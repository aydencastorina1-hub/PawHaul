var chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  var win = document.getElementById('chatWindow');
  var btn = document.getElementById('chatToggle');
  win.style.display = chatOpen ? 'block' : 'none';
  btn.innerHTML = chatOpen ? '&#10005;' : '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" width=\"28\" height=\"28\" fill=\"white\"><ellipse cx=\"50\" cy=\"67\" rx=\"20\" ry=\"16\"/><ellipse cx=\"27\" cy=\"47\" rx=\"9\" ry=\"12\"/><ellipse cx=\"42\" cy=\"35\" rx=\"9\" ry=\"12\"/><ellipse cx=\"58\" cy=\"35\" rx=\"9\" ry=\"12\"/><ellipse cx=\"73\" cy=\"47\" rx=\"9\" ry=\"12\"/></svg>';
  // input focus removed to prevent keyboard covering chat on mobile
}

function askQuick(question) {
  document.getElementById('chatInput').value = question;
  sendChat();
}

// Safety net: the chat bubble renders plain text, so if the AI slips any
// markdown past the system prompt (tables, **bold**, # headers, `code`),
// strip it down to clean readable lines instead of showing raw symbols.
function stripMarkdown(text) {
  var t = String(text || '');
  // code fences and inline backticks
  t = t.replace(/```[a-zA-Z]*\n?/g, '').replace(/`([^`]*)`/g, '$1');
  // [text](url) links -> just the text
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // **bold** / __bold__ / *italic* / _italic_ -> bare text
  t = t.replace(/(\*\*|__)([\s\S]*?)\1/g, '$2');
  t = t.replace(/(^|\s)\*([^*\n]+)\*(?=[\s.,!?)]|$)/g, '$1$2');
  t = t.replace(/(^|\s)_([^_\n]+)_(?=[\s.,!?)]|$)/g, '$1$2');
  // # headers (line starts only, so "#1 best seller" survives)
  t = t.replace(/^#{1,6}\s+/gm, '');
  // table separator rows (|---|---|) -> drop the whole line
  // ([ \t] not \s in the classes: \s eats newlines and merges lines)
  t = t.replace(/^[ \t]*\|?[ \t]*:?-{2,}[ \t|:-]*$/gm, '');
  // table rows -> cells joined with " - " on a plain line; a bare "#"
  // cell (markdown's numbering column header) carries no meaning - drop it
  t = t.replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, function (m, inner) {
    return inner.split('|').map(function (c) { return c.trim(); })
      .filter(function (c) { return c && c !== '#'; }).join(' - ');
  });
  // * bullets -> hyphen bullets, then kill leftover pipes/asterisks
  t = t.replace(/^\s*\*\s+/gm, '- ');
  t = t.replace(/\|/g, ' ').replace(/\*/g, '');
  // tidy: no trailing spaces, max one blank line, trimmed
  t = t.replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return t;
}

function addMsg(text, isUser) {
  var msgs = document.getElementById('chatMessages');
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;align-items:flex-start;' + (isUser ? 'flex-direction:row-reverse;' : '');

  var av = document.createElement('div');
  av.style.cssText = 'width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;font-weight:800;' + (isUser ? 'background:#1a1a2e;color:white;' : 'background:#E8630A;color:white;');
  av.textContent = isUser ? 'You' : String.fromCodePoint(128062);

  var bub = document.createElement('div');
  // white-space:pre-line so the bot's line breaks between products render
  bub.style.cssText = 'padding:9px 13px;max-width:210px;font-size:13px;font-weight:600;line-height:1.5;white-space:pre-line;' + (isUser ? 'background:#E8630A;color:white;border-radius:14px 14px 4px 14px;' : 'background:#1a1a2e;color:white;border-radius:14px 14px 14px 4px;box-shadow:0 2px 8px rgba(0,0,0,0.06);');
  bub.textContent = isUser ? text : stripMarkdown(text);

  row.appendChild(av);
  row.appendChild(bub);
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}



// ── AI CHATBOT (Groq openai/gpt-oss-20b via /api/chat serverless proxy) ──
// No API key lives in this file. The browser calls our own /api/chat
// endpoint, which adds the system prompt + key server-side and talks to
// Groq. Replaces the old keyword chatbot entirely.
var chatHistory = [];
var CHAT_FALLBACK = "Woof, my brain just hiccuped! Please email pawhaulsupport@gmail.com and a real human will get back to you within 24 hours.";

// ── Chatbot cart tool ─────────────────────────────────────────
// When the AI decides to add a product it emits an add_to_cart tool call;
// the server relays it here and THIS runs the site's real cart functions
// (products/lowestVariant/addToCart from products.js) — same code path as
// the Add To Cart buttons, so the cart badge, toast and cart page all
// update for real. The result is sent back so the AI only confirms what
// actually happened.
function chatbotAddToCart(args) {
  var id = parseInt(args && args.product_id, 10);
  var product = products.find(function (p) { return p.id === id; });
  if (!product) {
    return { ok: false, error: "No product with id " + (args && args.product_id) + ". Valid ids are 1, 2, 3, 4, 6, 7, 8." };
  }

  var qty = parseInt(args && args.quantity, 10);
  if (!(qty >= 1)) qty = 1;
  if (qty > 10) qty = 10;

  // Color doesn't affect price or cart lines, but never accept an option
  // the product doesn't actually come in.
  var color = null;
  if (args && args.color) {
    var wantColor = String(args.color).trim().toLowerCase();
    color = (product.colors || []).find(function (c) { return c.toLowerCase() === wantColor; }) ||
            (product.colors || []).find(function (c) { return c.toLowerCase().indexOf(wantColor) > -1; }) || null;
    if (!color) {
      return { ok: false, error: "'" + args.color + "' is not an available color. Options: " + (product.colors || []).join(", ") };
    }
  }

  // Resolve the size variant. No size given = cheapest option (site-wide
  // lowest-price rule, same as the product-card quick-add buttons).
  var size, price;
  if (args && args.size) {
    var wantSize = String(args.size).trim().toLowerCase();
    var match = (product.sizes || []).find(function (s) { return s.toLowerCase() === wantSize; }) ||
                (product.sizes || []).find(function (s) { return s.toLowerCase().indexOf(wantSize) > -1; });
    if (!match) {
      return { ok: false, error: "'" + args.size + "' is not an available size. Options: " + (product.sizes || []).join(", ") };
    }
    size = match;
    var sp = product.sizePrices ? product.sizePrices[match] : null;
    price = sp ? sp.price : product.price;
  } else {
    var v = lowestVariant(product);
    size = v.size || '';
    price = v.price;
  }

  var item = Object.assign({}, product, { price: price, size: size || '' });
  if (color) item.color = color;
  for (var i = 0; i < qty; i++) addToCart(item);

  return {
    ok: true,
    added: {
      product: product.name,
      size: size || null,
      color: color,
      unit_price: price,
      quantity: qty
    },
    cart_item_count: cart.reduce(function (sum, it) { return sum + it.qty; }, 0)
  };
}

function runChatToolCall(tc) {
  try {
    if (!tc || !tc.function || tc.function.name !== "add_to_cart") {
      return { ok: false, error: "Unknown tool" };
    }
    var toolArgs;
    try { toolArgs = JSON.parse(tc.function.arguments || "{}"); }
    catch (e) { return { ok: false, error: "Could not parse tool arguments" }; }
    return chatbotAddToCart(toolArgs);
  } catch (e) {
    return { ok: false, error: "Cart action failed: " + (e && e.message ? e.message : "unknown error") };
  }
}

async function sendChatToAI(userMessage) {
  chatHistory.push({ role: "user", content: userMessage });
  // The tool exchange (assistant tool_calls + tool results) only lives for
  // this request cycle; the final text reply carries the memory of the add,
  // so chatHistory stays plain user/assistant strings.
  var toolTurns = [];
  var succeededAdds = [];
  try {
    for (var round = 0; round < 3; round++) {
      var response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory.concat(toolTurns) })
      });
      if (!response.ok) break;
      var data = await response.json();

      if (data && data.assistantMessage && Array.isArray(data.assistantMessage.tool_calls)) {
        toolTurns.push(data.assistantMessage);
        data.assistantMessage.tool_calls.forEach(function (tc) {
          var result = runChatToolCall(tc);
          if (result.ok && result.added) succeededAdds.push(result.added);
          toolTurns.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
        });
        continue; // next round: the AI turns the results into a reply
      }

      var reply = data && data.reply ? String(data.reply).trim() : "";
      if (!reply) break;
      chatHistory.push({ role: "assistant", content: reply });
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
      return reply;
    }
  } catch (e) { /* fall through to the honest fallback below */ }

  // The AI turn failed. If items DID land in the cart, say so truthfully
  // (the add really happened); otherwise report nothing and let the caller
  // show the generic fallback.
  if (succeededAdds.length) {
    var summary = succeededAdds.map(function (a) {
      return (a.quantity > 1 ? a.quantity + "× " : "") + a.product + (a.size ? " (" + a.size + ")" : "");
    }).join(", ");
    var confirmMsg = "Added " + summary + " to your cart!";
    chatHistory.push({ role: "assistant", content: confirmMsg });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    return confirmMsg;
  }
  chatHistory.pop();
  return null;
}

function sendChat() {
  var input = document.getElementById("chatInput");
  var msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  addMsg(msg, true);

  var msgs = document.getElementById("chatMessages");
  var typing = document.createElement("div");
  typing.id = "typing";
  typing.style.cssText = "display:flex;gap:8px;align-items:center;padding:4px 0;";
  typing.innerHTML = "<div style='width:30px;height:30px;border-radius:50%;background:#E8630A;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='16' height='16' fill='white'><ellipse cx='50' cy='67' rx='20' ry='16'/><ellipse cx='27' cy='47' rx='9' ry='12'/><ellipse cx='42' cy='35' rx='9' ry='12'/><ellipse cx='58' cy='35' rx='9' ry='12'/><ellipse cx='73' cy='47' rx='9' ry='12'/></svg></div><div style='background:#1a1a2e;border-radius:14px;padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;gap:4px;align-items:center;'><span style='width:7px;height:7px;background:rgba(255,255,255,0.55);border-radius:50%;display:inline-block;animation:bounce 1s infinite 0s'></span><span style='width:7px;height:7px;background:rgba(255,255,255,0.55);border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.2s'></span><span style='width:7px;height:7px;background:rgba(255,255,255,0.55);border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.4s'></span></div>";
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  sendChatToAI(msg).then(function(aiReply) {
    var t = document.getElementById("typing");
    if (t) t.remove();
    addMsg(aiReply || CHAT_FALLBACK, false);
    msgs.scrollTop = msgs.scrollHeight;
  });
}

var policies = {
  privacy: {
    title: "Privacy Policy",
    body: "Last updated: January 2026<br><br>This Privacy Policy describes how PawHaul collects, uses, and discloses your personal information when you visit or make a purchase from our store.<br><br><strong>Information We Collect</strong><br>We collect your name, email, billing and shipping address, and payment information when you place an order. We also collect basic browsing data to improve your experience.<br><br><strong>How We Use Your Information</strong><br>Your information is used to process and fulfill your orders, send order confirmations and tracking updates, and send marketing emails only if you have opted in. We do not sell your personal information to third parties.<br><br><strong>Sharing Your Information</strong><br>We share your information with Shopify (our store platform) and payment processors solely to fulfill your order.<br><br><strong>Your Rights</strong><br>You have the right to access, correct, or delete your personal data at any time. Email pawhaulsupport@gmail.com to make a request.<br><br><strong>Contact</strong><br>Questions? Email pawhaulsupport@gmail.com"
  },
  terms: {
    title: "Terms of Service",
    body: "Last updated: January 2026<br><br>By accessing and using PawHaul you agree to be bound by these Terms of Service.<br><br><strong>Overview</strong><br>This website is operated by PawHaul. By visiting our site and purchasing from us you agree to these terms.<br><br><strong>Eligibility</strong><br>You must be at least 18 years of age to use this site and make purchases.<br><br><strong>Products and Pricing</strong><br>All products are subject to availability. Prices are listed in USD and may change without notice.<br><br><strong>Orders</strong><br>We reserve the right to refuse or cancel any order for any reason. If your order is cancelled you will receive a full refund.<br><br><strong>Shipping</strong><br>We offer free shipping on all orders. Estimated delivery is 7-14 business days.<br><br><strong>Contact</strong><br>Questions? Email pawhaulsupport@gmail.com"
  },
  refund: {
    title: "Refund Policy",
    body: "Last updated: January 2026<br><br><strong>30 Day Return Policy</strong><br>We want you to be completely satisfied. If you are not happy for any reason you may return your item within 30 days of receiving it for a full refund.<br><br><strong>How To Start A Return</strong><br>Email pawhaulsupport@gmail.com with your order number and reason for return. We respond within 24 hours.<br><br><strong>Refunds</strong><br>Once we receive your return it will be processed within 5-7 business days back to your original payment method.<br><br><strong>Damaged Items</strong><br>If your item arrives damaged email pawhaulsupport@gmail.com with a photo within 7 days. We will send a replacement or issue a full refund.<br><br><strong>Contact</strong><br>All return requests go through pawhaulsupport@gmail.com. We always respond within 24 hours."
  },
  shipping: {
    title: "Shipping Policy",
    body: "Last updated: January 2026<br><br><strong>Free Shipping On All Orders</strong><br>PawHaul offers free standard shipping on every order with no minimum purchase required.<br><br><strong>Processing Time</strong><br>Orders are processed within 1-3 business days. You will receive a confirmation email with your tracking number once your order ships.<br><br><strong>Delivery Time</strong><br>Standard delivery takes 7-14 business days from the date your order ships.<br><br><strong>Tracking Your Order</strong><br>Once your order ships you will receive a tracking number by email. Did not receive one within 5 business days? Email pawhaulsupport@gmail.com.<br><br><strong>Lost Packages</strong><br>If your package is marked delivered but not received, contact pawhaulsupport@gmail.com within 7 days.<br><br><strong>Contact</strong><br>Shipping questions? Email pawhaulsupport@gmail.com"
  }
};

function showPolicy(type) {
  try {
    var p = policies[type];
    if (!p) return;
    var modal = document.getElementById('policyModal');
    var title = document.getElementById('policyTitle');
    var body = document.getElementById('policyBody');
    if (!modal || !title || !body) return;
    title.textContent = p.title;
    body.innerHTML = p.body;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } catch(e) { return; }
}

function closePolicyModal() {
  try {
    var modal = document.getElementById('policyModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  } catch(e) { return; }
}

// ── BACK TO TOP ───────────────────────────────────────────────
(function() {
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var btn = document.getElementById('backToTop');
        if (btn) btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── HERO SLIDESHOW ────────────────────────────────────────────
// Crossfades the 4 hero slides: 5s per image, 1.5s fade (CSS transition),
// looping forever. All 4 are loaded eagerly at high priority (index.html)
// since the starting slide is randomized — the actual random pick and the
// matching preload link + initial .active class are decided as early as
// possible in <head>/inline (see index.html); this just continues the
// rotation from whichever slide that was.
(function () {
  var slides = document.querySelectorAll('#heroSection .hero-slide');
  if (slides.length < 2) return;
  var idx = window.__heroStartIdx || 0;
  setInterval(function () {
    if (document.hidden) return; // pause in background tabs
    idx = (idx + 1) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
  }, 5000);
})();

// ── BUNDLE / FREQUENTLY BOUGHT TOGETHER ───────────────────────
var bundleMap = {
  1: [2, 3],    // Walk Bottle → suggest Retractable Leash + Bowl
  2: [8],       // Retractable Leash → pairs with Walk Clean Bag Hook ("Add Both")
  3: [1, 2],    // Bowl → suggest Walk Bottle + Retractable Leash
  4: [6, 1],    // AirTag → suggest LED Collar + Walk Bottle
  6: [4, 2],    // LED Collar → suggest AirTag + Retractable Leash
  7: [8],       // No-Tangle LED Dual Dog Leash → pairs with Walk Clean Bag Hook ("Add Both")
  8: [2],       // Bag Hook → pairs with Retractable Leash ("Add Both")
};

var originalShowProduct = showProduct;
showProduct = function(id) {
  originalShowProduct(id);
  showBundle(id);
};

function showBundle(productId) {
  var bundleDiv = document.getElementById('bundleSuggestion');
  var bundleItems = document.getElementById('bundleItems');
  if (!bundleDiv || !bundleItems) return;

  var companions = bundleMap[productId] || [];
  var allIds = [productId].concat(companions);
  var total = 0;
  var html = '';

  allIds.forEach(function(bid) {
    var p = products.find(function(x) { return x.id === bid; });
    if (!p) return;
    total += lowestVariant(p).price;
    var isMain = bid === productId;
    var imgContent = p.image ? ('<img src="' + p.image + '" alt="' + p.name + '" style="width:36px;height:36px;object-fit:cover;border-radius:8px;">') : ('<span style="font-size:28px;">' + p.emoji + '</span>');
    html += '<div style="display:flex;align-items:center;gap:12px;background:white;padding:10px 14px;border-radius:10px;">' +
      imgContent +
      '<div style="flex:1;">' +
        '<div style="font-weight:800;font-size:13px;line-height:1.4;">' + p.name +
          (isMain ? ' <span style="background:var(--orange);color:white;font-size:10px;padding:2px 7px;border-radius:50px;white-space:nowrap;">This Item</span>' : '') +
        '</div>' +
        '<div style="color:var(--orange);font-weight:800;font-size:13px;">$' + lowestVariant(p).price.toFixed(2) + '</div>' +
      '</div>' +
      '<span style="color:var(--green);font-size:14px;font-weight:900;">&#10003;</span>' +
    '</div>';
  });

  var isPair = allIds.length === 2;
  html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-top:2px dashed #F0F0F0;margin-top:4px;">' +
    '<span style="font-weight:800;font-size:14px;">' + (isPair ? 'Combined Price' : 'Bundle Total') + '</span>' +
    '<span style="font-family:Fredoka One,cursive;font-size:20px;color:var(--orange);">$' + total.toFixed(2) + '</span>' +
  '</div>';

  bundleItems.innerHTML = html;
  // Two-item pairings read "Add Both To Cart"; bigger bundles keep "Add Bundle To Cart".
  var bundleBtn = document.getElementById('bundleAddBtn');
  if (bundleBtn) bundleBtn.textContent = isPair ? 'Add Both To Cart' : 'Add Bundle To Cart';
  bundleDiv.style.display = 'block';
}

function addBundleToCart() {
  var currentId = currentProduct ? currentProduct.id : null;
  if (!currentId) return;

  var companions = bundleMap[currentId] || [];
  var allIds = [currentId].concat(companions);

  allIds.forEach(function(bid) {
    var p = products.find(function(x) { return x.id === bid; });
    if (!p) return;
    var alreadyInCart = cart.some(function(c) { return c.id === bid; });
    if (!alreadyInCart) {
      // Variant products go in at their lowest-priced option (the price shown
      // in the bundle box), tagged with its size.
      var v = lowestVariant(p);
      cart.push(Object.assign({}, p, { price: v.price, size: v.size || '', qty: 1 }));
    }
  });

  updateCartCount();
  showToast('Bundle added to cart!');
}

// ==================== PAGE NAVIGATION HOOKS ====================
var _origShowPage = showPage;
showPage = function(page, filter) {
  _origShowPage(page, filter);
  closeMobileMenu();
  closeSearch();
};

// ==================== HAMBURGER MENU ====================
function toggleMobileMenu() {
  var menu = document.getElementById('mobMenu');
  var overlay = document.getElementById('mobMenuOverlay');
  var burger = document.getElementById('hamburger');
  if (!menu) return;
  var isOpen = menu.classList.contains('open');
  if (!isOpen) closeSearch();
  menu.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  burger.classList.toggle('open', !isOpen);
}

function closeMobileMenu() {
  var menu = document.getElementById('mobMenu');
  if (!menu) return;
  menu.classList.remove('open');
  document.getElementById('mobMenuOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// Some mobile browsers restore a page from the back/forward cache (e.g. after
// a pull-to-refresh or swipe-back gesture) with whatever open/closed state the
// menu, search overlay or offer popup happened to be in when the tab was last
// backgrounded — and with whatever scroll position it had, since a bfcache
// restore doesn't re-run the <head> script that resets scroll on a normal
// load. Force everything closed and scrolled to top on every pageshow (fresh
// loads too, where these are already correct, so this is a harmless no-op).
window.addEventListener('pageshow', function () {
  closeMobileMenu();
  closeSearch();
  dismissOffer();
  window.scrollTo(0, 0);
});

// ==================== SEARCH ====================
// In-place overlay search: a fixed scrim + fixed panel, so opening/closing
// never reflows the page or moves the scroll position. Desktop/tablet gets a
// dropdown pinned right under the nav; mobile (≤900px, CSS) goes full-screen.

function searchIsMobile() {
  return window.matchMedia('(max-width: 900px)').matches;
}

// Pin the desktop dropdown to the nav's live bottom edge (the nav is sticky,
// so its viewport position depends on whether the announce bar has scrolled
// away). Mobile is full-screen via CSS (!important), so skip it there.
function positionSearchBar() {
  var bar = document.getElementById('navSearchBar');
  var nav = document.getElementById('mainNav');
  if (!bar || !nav || searchIsMobile()) return;
  bar.style.top = Math.max(0, Math.round(nav.getBoundingClientRect().bottom)) + 'px';
}

function searchIsOpen() {
  var bar = document.getElementById('navSearchBar');
  return !!(bar && bar.classList.contains('open'));
}

// Hide the floating chat paw while the search overlay or offer popup is up
// (it sits at z-index 9999 and would float on top of them).
function syncOverlayChrome() {
  document.body.classList.toggle('overlay-up', searchIsOpen() || offerIsOpen());
}

// Rotating placeholder: cycles example searches while the input is empty
// (pauses automatically once the user types — the overlay hides via the
// input listener below, and we skip advancing while there's text).
var SEARCH_PLACEHOLDERS = ['Search leashes...', 'Search collars...', 'Search water bottles...', 'Search safety gear...'];
var searchPhTimer = null;
var searchPhIdx = 0;

function startSearchPhCycle() {
  stopSearchPhCycle();
  var ph = document.getElementById('navSearchPh');
  if (!ph) return;
  searchPhTimer = setInterval(function() {
    var inp = document.getElementById('navSearchInput');
    if (inp && inp.value) return; // user is typing — hold the current phrase
    ph.classList.add('is-fading');
    setTimeout(function() {
      searchPhIdx = (searchPhIdx + 1) % SEARCH_PLACEHOLDERS.length;
      ph.textContent = SEARCH_PLACEHOLDERS[searchPhIdx];
      ph.classList.remove('is-fading');
    }, 240); // matches the CSS fade duration
  }, 2600);
}

function stopSearchPhCycle() {
  if (searchPhTimer) { clearInterval(searchPhTimer); searchPhTimer = null; }
}

// Category card in the search panel: jump to the shop with that filter
// active, then close the overlay.
function searchGoCategory(cat) {
  showPage('shop', cat || 'all');
  closeSearch();
}

function toggleSearch() {
  if (searchIsOpen()) { closeSearch(); } else { openSearch(); }
}

function openSearch() {
  var bar = document.getElementById('navSearchBar');
  var scrim = document.getElementById('searchScrim');
  if (!bar) return;
  closeMobileMenu();
  positionSearchBar();
  bar.classList.add('open');
  if (scrim) scrim.classList.add('open');
  syncOverlayChrome();
  // Focus synchronously (still inside the tap gesture) so iOS opens the
  // keyboard; preventScroll so focusing the fixed input can't nudge the page.
  var inp = document.getElementById('navSearchInput');
  if (inp) {
    try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
  }
  startSearchPhCycle();
}

function closeSearch() {
  var bar = document.getElementById('navSearchBar');
  var scrim = document.getElementById('searchScrim');
  if (!bar) return;
  bar.classList.remove('open', 'typing');
  if (scrim) scrim.classList.remove('open');
  syncOverlayChrome();
  stopSearchPhCycle();
  var inp = document.getElementById('navSearchInput');
  if (inp) { inp.value = ''; inp.blur(); }
  var ph = document.getElementById('navSearchPh');
  if (ph) ph.classList.remove('ph-hidden', 'is-fading');
  var res = document.getElementById('searchResults');
  if (res) res.innerHTML = '';
}

function doSearch(val) {
  var res = document.getElementById('searchResults');
  if (!res) return;
  var q = (val || '').trim().toLowerCase();
  if (!q) { res.innerHTML = ''; return; }
  var list = (typeof products !== 'undefined') ? products : [];
  // Name matches rank first, then category/description matches below them.
  var nameHits = [], otherHits = [];
  list.forEach(function(p) {
    if (p.name.toLowerCase().indexOf(q) !== -1) { nameHits.push(p); return; }
    var haystack = ((p.category || '') + ' ' + (p.desc || '') + ' ' + (p.tags ? p.tags.join(' ') : '')).toLowerCase();
    if (haystack.indexOf(q) !== -1) otherHits.push(p);
  });
  var matches = nameHits.concat(otherHits);
  if (matches.length === 0) {
    res.innerHTML = '<div class="search-no-results">' +
      '<span class="snr-emoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#C9C2B8" style="width:34px;height:34px;display:inline-block" aria-hidden="true"><ellipse cx="50" cy="67" rx="20" ry="16"/><ellipse cx="27" cy="47" rx="9" ry="12"/><ellipse cx="42" cy="35" rx="9" ry="12"/><ellipse cx="58" cy="35" rx="9" ry="12"/><ellipse cx="73" cy="47" rx="9" ry="12"/></svg></span>' +
      'No products found' +
      '<span class="snr-hint">Try "leash", "bottle", "collar"...</span>' +
    '</div>';
    return;
  }
  // Bold the matched part of the name. Product names are plain text and the
  // query is regex-escaped, so this stays injection-safe.
  var safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var hl = new RegExp('(' + safe + ')', 'ig');
  res.innerHTML = matches.map(function(p) {
    var thumb = p.image
      ? '<img src="' + p.image + '" alt="" loading="lazy">'
      : p.emoji;
    return '<div class="search-result-item" onclick="goToProduct(' + p.id + ')">' +
      '<span class="search-result-thumb">' + thumb + '</span>' +
      '<div class="search-result-info">' +
        '<div class="search-result-name">' + p.name.replace(hl, '<b>$1</b>') + '</div>' +
        '<div class="search-result-price">$' + lowestVariant(p).price.toFixed(2) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// One-time wiring for scroll/keyboard behavior around the overlay.
(function() {
  var bar = document.getElementById('navSearchBar');
  var scrim = document.getElementById('searchScrim');

  // Keep the desktop dropdown glued to the nav if the viewport changes or the
  // page scrolls (scrollbar drag still works while the scrim is up).
  window.addEventListener('resize', function() { if (searchIsOpen()) positionSearchBar(); });
  window.addEventListener('scroll', function() { if (searchIsOpen()) positionSearchBar(); }, { passive: true });

  // The scrim swallows wheel/touch so the page behind holds perfectly still.
  if (scrim) {
    scrim.addEventListener('wheel', function(e) { e.preventDefault(); }, { passive: false });
    scrim.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
  }
  // On the panel itself only the results list may scroll — anywhere else a
  // touch-drag would rubber-band the page behind it (iOS).
  if (bar) {
    bar.addEventListener('touchmove', function(e) {
      if (!e.target.closest('.search-results')) e.preventDefault();
    }, { passive: false });
  }

  // The rotating placeholder is a real element over the input (native
  // placeholders can't fade) — hide it the instant there's any text.
  var inp = document.getElementById('navSearchInput');
  var ph = document.getElementById('navSearchPh');
  if (inp && ph) {
    inp.addEventListener('input', function() {
      ph.classList.toggle('ph-hidden', !!inp.value);
      // While typing, the browse-by-category cards give way to live results
      if (bar) bar.classList.toggle('typing', !!inp.value);
    });
  }
})();

// ==================== CAROUSEL ====================
function initCarousel(trackId, prevId, nextId) {
  var track = document.getElementById(trackId);
  var prev = document.getElementById(prevId);
  var next = document.getElementById(nextId);
  if (!track || !prev || !next) return;

  var idx = 0;
  var touchStartX = 0;
  var touchStartLeft = 0;

  function step() {
    var card = track.children[0];
    if (!card) return 220;
    return card.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 12);
  }
  function count() { return track.children.length; }
  // True scroll limit (content minus viewport) — with several cards per view
  // the last reachable index is well before count()-1, so clamp to it or the
  // next arrow keeps "working" with nothing left to reveal.
  function maxScroll() { return Math.max(0, track.scrollWidth - track.clientWidth); }
  function maxIdx() { return Math.min(count() - 1, Math.ceil(maxScroll() / step())); }

  function smoothTo(target) {
    var start = track.scrollLeft;
    var dest = Math.max(0, Math.min(target, maxScroll()));
    var diff = dest - start;
    if (!diff) return;
    var t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 300, 1);
      track.scrollLeft = start + diff * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  function goTo(n, instant) {
    idx = Math.max(0, Math.min(n, maxIdx()));
    var target = Math.min(idx * step(), maxScroll());
    if (instant) { track.scrollLeft = target; } else { smoothTo(target); }
    prev.classList.toggle('disabled', idx === 0);
    next.classList.toggle('disabled', idx >= maxIdx());
  }

  // Re-render pages re-run initCarousel on the SAME track element — abort
  // the previous instance's listeners so they never stack up and fight.
  if (track._carouselAbort) track._carouselAbort.abort();
  var ac = new AbortController();
  track._carouselAbort = ac;
  var opts = { passive: true, signal: ac.signal };

  // Sync internal state to wherever the track actually rests. Native
  // momentum scrolling settles between indexes, so idx must be derived
  // from scrollLeft — a stale idx made the next tap/arrow visibly "jump".
  function resync() {
    idx = Math.max(0, Math.min(Math.round(track.scrollLeft / step()), maxIdx()));
    prev.classList.toggle('disabled', idx === 0);
    next.classList.toggle('disabled', idx >= maxIdx());
  }
  var scrollT;
  track.addEventListener('scroll', function() {
    clearTimeout(scrollT);
    scrollT = setTimeout(resync, 120);
  }, opts);

  prev.addEventListener('click', function() { goTo(idx - 1); }, { signal: ac.signal });
  next.addEventListener('click', function() { goTo(idx + 1); }, { signal: ac.signal });

  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartLeft = track.scrollLeft;
  }, opts);

  track.addEventListener('touchmove', function(e) {
    var raw = touchStartLeft + (touchStartX - e.touches[0].clientX);
    track.scrollLeft = Math.max(0, Math.min(raw, maxScroll()));
  }, opts);

  track.addEventListener('touchend', function(e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 30) {
      // Real swipe: advance from where the gesture STARTED.
      goTo(Math.round(touchStartLeft / step()) + (delta > 0 ? 1 : -1));
    } else if (Math.abs(delta) > 8) {
      // Micro-drag: settle on the nearest card.
      goTo(Math.round(track.scrollLeft / step()));
    }
    // Pure tap (≤8px): never move the track — picking a color/size or
    // opening a product must not slide the carousel. resync() via the
    // scroll listener keeps idx honest.
  }, opts);

  goTo(0, true);
}

// ==================== DETAIL IMAGE CAROUSEL ====================
function initDetailCarousel() {
  var track = document.getElementById('detTrack');
  var prev = document.getElementById('detPrev');
  var next = document.getElementById('detNext');
  var dotsWrap = document.getElementById('detDots');
  if (!track || !prev || !next) return;

  var idx = 0;
  var total = track.children.length;
  var touchStartX = 0;
  var touchStartY = 0;
  var touchStartLeft = 0;
  var touchAxis = null; // 'x' once a swipe is confirmed horizontal, 'y' once confirmed vertical
  if (dotsWrap) dotsWrap.innerHTML = Array.from({ length: total }, function() { return '<span class="det-dot"></span>'; }).join('');
  var dots = dotsWrap ? dotsWrap.querySelectorAll('.det-dot') : [];

  function step() { return track.offsetWidth || 300; }
  function maxScroll() { return Math.max(0, (total - 1) * step()); }

  function smoothTo(target) {
    var start = track.scrollLeft;
    var dest = Math.max(0, Math.min(target, maxScroll()));
    var diff = dest - start;
    if (!diff) return;
    var t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 300, 1);
      track.scrollLeft = start + diff * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  function goTo(n, instant) {
    idx = Math.max(0, Math.min(n, total - 1));
    var target = idx * step();
    if (instant) { track.scrollLeft = target; } else { smoothTo(target); }
    prev.classList.toggle('disabled', idx === 0);
    next.classList.toggle('disabled', idx >= total - 1);
    dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  }

  prev.addEventListener('click', function() { goTo(idx - 1); });
  next.addEventListener('click', function() { goTo(idx + 1); });

  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartLeft = track.scrollLeft;
    touchAxis = null;
  }, { passive: true });

  track.addEventListener('touchmove', function(e) {
    var dx = e.touches[0].clientX - touchStartX;
    var dy = e.touches[0].clientY - touchStartY;

    // Decide the gesture's axis once there's enough movement to be sure —
    // whichever direction has moved further wins, and that decision sticks
    // for the rest of this touch. Until then, do nothing: no preventDefault
    // (so a vertical scroll can still start natively) and no scrollLeft
    // change (so a few pixels of jitter don't nudge the image early).
    if (!touchAxis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (touchAxis === 'x') {
      e.preventDefault();
      var raw = touchStartLeft - dx;
      track.scrollLeft = Math.max(0, Math.min(raw, maxScroll()));
    }
    // touchAxis === 'y' (or not yet decided): let the page scroll normally.
  }, { passive: false });

  track.addEventListener('touchend', function(e) {
    if (touchAxis !== 'x') return; // vertical scroll or a tap — never treat as a swipe
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 30) {
      goTo(idx + (delta > 0 ? 1 : -1));
    } else {
      goTo(idx);
    }
  }, { passive: true });

  goTo(0, true);
}

// ==================== SECTION REVEAL (subtle fade-up on scroll) ====================
// The .reveal class is added by JS, so if anything fails no content is ever hidden.
// A guaranteed fallback timer also un-hides everything, so content can NEVER get stuck invisible.
document.addEventListener('DOMContentLoaded', function() {
  var sel = '.collections-section, .bestsellers, .why-section, .mission-section, .reviews-section, .faq-section, .email-section';
  // Only reveal-gate sections that start fully below the fold. .collections-section
  // in particular is often already partly visible in the first viewport on load, and
  // IntersectionObserver's first callback isn't synchronous with paint — that race
  // could leave an already-on-screen section sitting at opacity:0 for several hundred
  // ms (looked like a black/blank section flash) before the observer caught up.
  var els = Array.prototype.filter.call(document.querySelectorAll(sel), function(el) {
    return el.getBoundingClientRect().top >= window.innerHeight;
  });
  function revealAll() { els.forEach(function(el) { el.classList.add('reveal-in'); }); }

  if (!('IntersectionObserver' in window)) { return; } // no reveal class added -> sections stay fully visible

  els.forEach(function(el) { el.classList.add('reveal'); });
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('reveal-in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(function(el) { obs.observe(el); });

  // Safety net: whatever happens, reveal everything after 1.2s so nothing can stay hidden.
  setTimeout(revealAll, 1200);

  initCarousel('revCarousel', 'revCarouselPrev', 'revCarouselNext');
  // Collections benefit carousel is static HTML (never re-rendered), so a
  // single init here is enough — same drag/arrow/boundary logic as the rest.
  initCarousel('collectionsCarousel', 'colCarPrev', 'colCarNext');
});

// ==================== 10% OFF POPUP ====================
function offerIsOpen() {
  var popup = document.getElementById('offerPopup');
  return !!(popup && popup.classList.contains('active'));
}

function dismissOffer() {
  var overlay = document.getElementById('offerOverlay');
  var popup = document.getElementById('offerPopup');
  if (!overlay || !popup) return;
  overlay.classList.remove('active');
  popup.classList.remove('active');
  syncOverlayChrome();
}

// Sends the code with the same EmailJS setup as the footer email box; if the
// welcome template isn't configured (or sending fails), the customer still
// gets the code via toast so the promise of the popup is always kept.
function handleOfferSubmit(e) {
  e.preventDefault();
  var input = document.getElementById('offerEmail');
  var email = input ? input.value.trim() : '';
  if (!email || email.indexOf('@') === -1) {
    showToast('Please enter a valid email!');
    return;
  }
  var btn = document.getElementById('offerBtn');
  function finish(msg) {
    if (btn) { btn.disabled = false; btn.textContent = 'Claim My 10% Off →'; }
    if (input) input.value = '';
    dismissOffer();
    showToast(msg, 5000);
  }
  var canSend = typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY &&
                typeof EMAILJS_WELCOME_TEMPLATE !== 'undefined' && EMAILJS_WELCOME_TEMPLATE;
  if (!canSend) {
    finish('Your code: ' + DISCOUNT_CODE + ' — 10% off your first order!');
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_WELCOME_TEMPLATE, {
    to_email: email,
    discount_code: DISCOUNT_CODE
  }).then(function() {
    finish('10% off code sent to your email!');
  }).catch(function() {
    finish('Your code: ' + DISCOUNT_CODE + ' — 10% off your first order!');
  });
}

setTimeout(function() {
  var overlay = document.getElementById('offerOverlay');
  var popup = document.getElementById('offerPopup');
  if (!overlay || !popup) return;
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      overlay.classList.add('active');
      popup.classList.add('active');
      syncOverlayChrome();
    });
  });
  document.getElementById('offerClose').addEventListener('click', dismissOffer);
  overlay.addEventListener('click', dismissOffer);
}, 10000);

// Escape closes whichever overlay is up (search first, then the offer).
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (searchIsOpen()) { closeSearch(); }
  else if (offerIsOpen()) { dismissOffer(); }
});
