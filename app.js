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

// A reply is often taller than the 220px message pane, and scrolling the pane
// to its bottom (what a chat log normally does) dropped the reader at the LAST
// line of an answer they hadn't read yet. Put the TOP of the new reply at the
// top of the pane instead, so reading starts at the beginning.
// Short replies need no scroll at all: the browser clamps scrollTop to its
// maximum, which still leaves the whole reply — beginning included — on screen.
function scrollReplyToTop(msgs, row) {
  // Rect math rather than offsetTop: #chatMessages isn't positioned, so the
  // row's offsetParent is some ancestor of the pane, not the pane itself.
  var delta = row.getBoundingClientRect().top - msgs.getBoundingClientRect().top;
  // 12px = the pane's own padding, so the bubble sits at its natural inset.
  msgs.scrollTop = msgs.scrollTop + delta - 12;
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
  // Your own message: the bottom of the thread is where you expect to land.
  // The bot's reply: land on its first line, not its last (see above).
  if (isUser) msgs.scrollTop = msgs.scrollHeight;
  else scrollReplyToTop(msgs, row);
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
    return { ok: false, error: "No product with id " + (args && args.product_id) + ". Valid ids are 1, 2, 3, 4, 5, 6, 8." };
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

  // Resolve the size variant. No size given = cheapest option that's still
  // actually available in the requested color (site-wide lowest-price rule,
  // same as the product-card quick-add buttons).
  var size, price;
  if (args && args.size) {
    var wantSize = String(args.size).trim().toLowerCase();
    var match = (product.sizes || []).find(function (s) { return s.toLowerCase() === wantSize; }) ||
                (product.sizes || []).find(function (s) { return s.toLowerCase().indexOf(wantSize) > -1; });
    if (!match) {
      return { ok: false, error: "'" + args.size + "' is not an available size. Options: " + (product.sizes || []).join(", ") };
    }
    size = match;
  } else {
    var candidates = (product.sizes && product.sizes.length) ? product.sizes : [null];
    var available = candidates.filter(function (s) { return !variantUnavailable(product, s, color); });
    var pool = available.length ? available : candidates;
    size = pool.reduce(function (best, s) {
      var p1 = (s && product.sizePrices) ? product.sizePrices[s].price : product.price;
      var p2 = (best && product.sizePrices) ? product.sizePrices[best].price : product.price;
      return p1 < p2 ? s : best;
    }, pool[0]);
  }
  var sp = (size && product.sizePrices) ? product.sizePrices[size] : null;
  price = sp ? sp.price : product.price;

  if (variantUnavailable(product, size, color)) {
    return {
      ok: false,
      error: "That combination is currently out of stock" + (color ? " in " + color : "") +
        (size ? " (" + size + ")" : "") + ". Try a different color or size."
    };
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
    // No scroll call here: addMsg positions the pane on the top of the reply.
    // A scrollHeight jump at this point would put it back at the bottom.
    addMsg(aiReply || CHAT_FALLBACK, false);
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
  1: [2, 3],    // Water Bottle → suggest Retractable Leash + Bowl
  2: [5, 8],    // Retractable Leash → suggest Poop Bag Clip + Poop Bag Holder
  3: [1, 2],    // Bowl → suggest Water Bottle + Retractable Leash
  4: [6, 1],    // AirTag Holder → suggest Light Up Collar + Water Bottle
  5: [8, 2],    // Poop Bag Clip → suggest Poop Bag Holder + Retractable Leash
  6: [4, 2],    // Light Up Collar → suggest AirTag Holder + Retractable Leash
  8: [5, 1],    // Poop Bag Holder → suggest Poop Bag Clip + Water Bottle
};

var originalShowProduct = showProduct;
showProduct = function(id, opts) {
  // opts (routing sync/push mode — see products.js) must be forwarded, not
  // dropped, or every product-page navigation would silently stop updating
  // the URL.
  originalShowProduct(id, opts);
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
    var bundleImgUrl = productImageFor(p, p.colors && p.colors[0]);
    var imgContent = bundleImgUrl ? ('<img src="' + bundleImgUrl + '" alt="' + p.name + '" style="width:36px;height:36px;object-fit:cover;border-radius:8px;">') : ('<span style="font-size:28px;">' + p.emoji + '</span>');
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
      var newItem = Object.assign({}, p, { price: v.price, size: v.size || '', qty: 1 });
      cart.push(newItem);
      syncAddToShopify(newItem);
    }
  });

  updateCartCount();
  showToast('Bundle added to cart!');
}

// ==================== PAGE NAVIGATION HOOKS ====================
var _origShowPage = showPage;
showPage = function(page, filter, opts) {
  _origShowPage(page, filter, opts);
  closeMobileMenu();
  closeSearch();
  // Leaving the product page: hide the sticky Add To Cart bar immediately
  // rather than waiting on the next IntersectionObserver callback.
  if (page !== 'product') {
    var stickyBar = document.getElementById('stickyAtc');
    if (stickyBar) stickyBar.classList.remove('show');
    var chat = document.getElementById('chatWidget');
    if (chat) chat.classList.remove('chat-lifted');
  }
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
    var thumbUrl = productImageFor(p, p.colors && p.colors[0]);
    var thumb = thumbUrl
      ? '<img src="' + thumbUrl + '" alt="" loading="lazy">'
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
// Only rendered when a product has more than one gallery slide for the
// selected color (see renderDetailGallery in products.js) — a single-photo
// product never calls this. Track-scroll based, same touch-axis
// disambiguation as the other carousels on this site: a vertical scroll
// attempt starting on the image must never get swallowed by the swipe.
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
  // .bestsellers is deliberately excluded from this selector — unlike every
  // other section here (all static HTML already in the document at parse
  // time), its content (#homeProducts) is populated by renderHomeProducts()
  // as part of the page's own render, which can finish well before this
  // DOMContentLoaded handler runs (it waits for the ENTIRE document,
  // including markup after this point, not just the content that already
  // rendered). That gap meant the carousel was often already painted fully
  // visible (opacity 1) by the time this code retroactively added the
  // .reveal class — which sets opacity:0 WITH a transition — so the browser
  // animated it from 1 down to 0 (a visible ~0.6s fade to invisible) and
  // then back to 1 once the IntersectionObserver caught up: a real flash/
  // disappear/reappear cycle on content the user had already seen. No other
  // section here can hit this, since none of them render fresh JS content
  // at boot the way the carousel does. Confirmed via real CDP screencast
  // frames on a throttled connection (opacity traced 1 -> ~0 -> 1).
  var sel = '.collections-section, .why-section, .mission-section, .reviews-section, .faq-section, .email-section';
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

// ==================== LIFESTYLE IMAGE FADE-IN ====================
// Marks each large lifestyle/background photo (see .lifestyle-img in
// styles.css) ready once it's actually decoded, triggering its CSS fade
// instead of an abrupt shimmer-to-photo cut. A hard fallback timer
// guarantees an image can never get stuck invisible even if load/error
// somehow never fires — same safety-net philosophy as the reveal observer.
document.addEventListener('DOMContentLoaded', function() {
  var imgs = document.querySelectorAll('.lifestyle-img');
  function ready(img) { img.classList.add('img-ready'); }
  imgs.forEach(function(img) {
    if (img.complete && img.naturalWidth > 0) { ready(img); }
    else {
      img.addEventListener('load', function() { ready(img); });
      img.addEventListener('error', function() { ready(img); });
    }
  });
  setTimeout(function() { imgs.forEach(ready); }, 2500);
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

// FORMAT validation only — this deliberately does NOT check deliverability or
// that the inbox exists (that needs a third-party verification service). The
// goal is to stop malformed and obviously-fake addresses before they ever
// reach Shopify's customerCreate mutation, so the customer list stays clean
// and a typo gets corrected while the popup is still open.
//
// type="email" alone isn't enough: browsers accept "test@test" (no TLD),
// which is exactly the junk we want rejected — hence the form is novalidate
// and this runs instead.
function isValidEmailFormat(email) {
  var e = String(email == null ? '' : email).trim();
  if (!e || e.length > 254 || /\s/.test(e)) return false;

  var parts = e.split('@');
  if (parts.length !== 2) return false;          // zero or multiple @
  var local = parts[0];
  var domain = parts[1];

  // Local part: RFC-legal dot-atom characters, no leading/trailing/double dot.
  if (!local || local.length > 64) return false;
  if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) return false;
  if (/^\.|\.$|\.\./.test(local)) return false;

  // Domain: at least two labels, so a bare "test@test" (no TLD) is rejected.
  if (!domain || domain.length > 253) return false;
  var labels = domain.split('.');
  if (labels.length < 2) return false;
  for (var i = 0; i < labels.length; i++) {
    var l = labels[i];
    if (!l || l.length > 63) return false;
    if (!/^[A-Za-z0-9-]+$/.test(l)) return false;
    if (l.charAt(0) === '-' || l.charAt(l.length - 1) === '-') return false;
  }

  // TLD must be alphabetic and at least 2 chars — kills "user@host.1" and
  // trailing-dot forms.
  var tld = labels[labels.length - 1].toLowerCase();
  if (!/^[a-z]{2,}$/.test(tld)) return false;

  // Names reserved by RFC 2606 / RFC 6761 specifically so they can never
  // resolve or receive mail — i.e. guaranteed-fake, not merely unusual.
  if (['test', 'invalid', 'localhost', 'example', 'local'].indexOf(tld) > -1) return false;
  var d = domain.toLowerCase();
  if (d === 'example.com' || d === 'example.net' || d === 'example.org') return false;

  return true;
}

function showOfferError(message) {
  var err = document.getElementById('offerError');
  var input = document.getElementById('offerEmail');
  if (err) { err.textContent = message; err.hidden = false; }
  if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
}

function clearOfferError() {
  var err = document.getElementById('offerError');
  var input = document.getElementById('offerEmail');
  if (err) { err.hidden = true; err.textContent = ''; }
  if (input) input.removeAttribute('aria-invalid');
}

// Saves the email as a real Shopify customer (Storefront API customerCreate,
// acceptsMarketing:true — see api/customer.js) and reveals the code in the
// popup itself instead of emailing it. An email that already exists (claimed
// on another device) does NOT get the code revealed a second time.
async function handleOfferSubmit(e) {
  e.preventDefault();
  var input = document.getElementById('offerEmail');
  var email = input ? input.value.trim() : '';

  // Bail before the network call — invalid input never reaches Shopify.
  if (!email) {
    showOfferError('Please enter your email address.');
    return;
  }
  if (!isValidEmailFormat(email)) {
    showOfferError("That doesn't look like a valid email address — please check and try again.");
    return;
  }
  clearOfferError();

  var btn = document.getElementById('offerBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

  try {
    var res = await fetch('/api/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    var data = await res.json();
    if (data && data.ok) {
      showOfferResult(!!data.alreadyExists);
      return;
    }
    if (btn) { btn.disabled = false; btn.textContent = 'Claim My 10% Off →'; }
    showOfferError((data && data.error) || 'Something went wrong — please try again.');
  } catch (err) {
    if (btn) { btn.disabled = false; btn.textContent = 'Claim My 10% Off →'; }
    showOfferError('Something went wrong — please try again.');
  }
}

// Swaps the form for the result panel (see index.html #offerSuccess) — the
// popup stays open so the customer can actually read/copy the code.
//
// alreadyExists === true means this address is already a Shopify customer,
// i.e. the code was claimed earlier (typically on another device or browser).
// That customer is told plainly and the code row is hidden — revealing
// WELCOME10 again would make the "one per customer" offer meaningless, since
// anyone could re-harvest it from any fresh browser profile.
function showOfferResult(alreadyExists) {
  var form = document.querySelector('#offerPopup .offer-form');
  var dismissLink = document.querySelector('#offerPopup .offer-dismiss');
  var success = document.getElementById('offerSuccess');
  var msg = document.getElementById('offerSuccessMsg');
  var code = document.getElementById('offerCode');
  var codeRow = document.getElementById('offerCodeRow');

  if (form) form.style.display = 'none';
  if (dismissLink) dismissLink.style.display = 'none';
  if (code) code.textContent = DISCOUNT_CODE;
  if (codeRow) codeRow.style.display = alreadyExists ? 'none' : '';
  if (msg) {
    msg.textContent = alreadyExists
      ? 'This email was already used.'
      : "You're in! Use this code at checkout.";
  }
  if (success) success.style.display = 'block';

  // Permanently retire the popup on this device. It's already flagged at
  // reveal time, but re-committing it here means a successful submission is
  // recorded even if the reveal-time write was lost (a storage quota error,
  // a since-cleared flag, an unusual privacy setting). Both outcomes flag it:
  // the "already used" customer has had their answer and shouldn't be asked
  // again either. No expiry is written anywhere — the flag is permanent.
  //
  // Skipped entirely under ?offer=always so reviewing the popup — including
  // running a submission through it — never retires the reviewer's browser.
  if (OFFER_PREVIEW) return;
  try { localStorage.setItem('pawhaul_offer_seen', '1'); } catch (e) {}
  if (!alreadyExists) {
    try { localStorage.setItem('pawhaul_offer_claimed', '1'); } catch (e) {}
  }
}

function copyOfferCode() {
  var codeEl = document.getElementById('offerCode');
  var code = codeEl ? codeEl.textContent.trim() : DISCOUNT_CODE;
  var btn = document.getElementById('offerCopyBtn');
  function done(ok) {
    if (!btn) return;
    btn.textContent = ok ? 'Copied!' : 'Select & copy manually';
    setTimeout(function() { if (btn) btn.textContent = 'Copy Code'; }, 2000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(function() { done(true); }).catch(function() { done(false); });
  } else {
    done(false);
  }
}

// PREVIEW MODE — ?offer=always on any URL shows the popup on EVERY load and
// writes no localStorage at all, so the site owner can review it repeatedly
// without burning their own once-per-device allowance. Latched once here at
// script load rather than read live, because client-side navigation rewrites
// the URL through pageToPath() and drops the query string; latching keeps
// preview active for the whole page load, across in-site navigation.
//
// It is a review tool, not a way around the offer rules: it never clears or
// sets a flag, so a device that has genuinely claimed the code still has
// pawhaul_offer_claimed afterwards and goes straight back to never showing it
// the moment the query string is gone.
var OFFER_PREVIEW = /[?&]offer=always\b/.test(location.search);

// Shows once per visitor: after 5s, or sooner on exit intent (mouse leaving
// via the top of the viewport, the classic "heading for the tab bar" tell).
// The localStorage flag is set the moment it's shown (not on submit/dismiss)
// so a visitor who ignores or closes it is never nagged again either.
(function () {
  var SEEN_KEY = 'pawhaul_offer_seen';
  var CLAIMED_KEY = 'pawhaul_offer_claimed';

  if (!OFFER_PREVIEW) {
    // A device that actually submitted an email and got the code is done for
    // good — no reset, no expiry, no second look. Checked before anything
    // else so nothing below can resurrect the popup for it.
    try { if (localStorage.getItem(CLAIMED_KEY)) return; } catch (e) {}

    // Escape hatch for testing on a browser that was flagged merely by having
    // SEEN the popup: ?offer=reset on any URL brings it back. Deliberately
    // powerless against CLAIMED_KEY above, so it can't be used to re-harvest
    // the code — clear site data / use a private window for that.
    try {
      if (/[?&]offer=reset\b/.test(location.search)) localStorage.removeItem(SEEN_KEY);
    } catch (e) {}

    var alreadySeen = false;
    try { alreadySeen = !!localStorage.getItem(SEEN_KEY); } catch (e) { /* privacy mode etc. — just show once per tab */ }
    if (alreadySeen) return;
  }

  var shown = false;
  function reveal() {
    if (shown) return;

    // This runs from a 5s timer / an exit-intent event, so the popup markup
    // (which sits BELOW app.js's own <script> tag in index.html) is always
    // parsed by now — but resolve it before committing to anything, and bail
    // without burning the "seen" flag if it somehow isn't there. Setting the
    // flag first would permanently mark a visitor who was never actually
    // shown the offer.
    var overlay = document.getElementById('offerOverlay');
    var popup = document.getElementById('offerPopup');
    if (!overlay || !popup) return;

    shown = true;
    if (!OFFER_PREVIEW) { try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {} }
    document.removeEventListener('mouseleave', exitIntent);

    // Close controls are bound HERE, not at script-execution time. The popup
    // markup comes after this file's <script> tag, so an early
    // getElementById returned null and the X button and backdrop silently
    // never got a listener — the popup opened with no way to close it except
    // Escape or the two inline-onclick buttons.
    overlay.addEventListener('click', dismissOffer);
    var closeBtn = document.getElementById('offerClose');
    if (closeBtn) closeBtn.addEventListener('click', dismissOffer);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        overlay.classList.add('active');
        popup.classList.add('active');
        syncOverlayChrome();
      });
    });
  }
  function exitIntent(e) {
    if (e.clientY <= 0) reveal();
  }

  document.addEventListener('mouseleave', exitIntent);
  setTimeout(reveal, 5000);
})();

// Escape closes whichever overlay is up (search first, then the offer).
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (searchIsOpen()) { closeSearch(); }
  else if (offerIsOpen()) { dismissOffer(); }
});
