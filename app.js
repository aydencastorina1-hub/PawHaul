var chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  var win = document.getElementById('chatWindow');
  var btn = document.getElementById('chatToggle');
  // Open: display:block starts the CSS entrance (chatWinIn, styles.css).
  // Close: play the exit first, then hide. A re-open mid-exit cancels it.
  clearTimeout(toggleChat._t);
  win.classList.remove('chat-closing');
  if (chatOpen) {
    win.style.display = 'flex';
  } else {
    win.classList.add('chat-closing');
    toggleChat._t = setTimeout(function () {
      win.classList.remove('chat-closing');
      win.style.display = 'none';
    }, 180);
    // Closing the chat always drops it out of fullscreen too, so it
    // reopens at its normal floating size next time.
    if (win.classList.contains('chat-fullscreen')) {
      win.classList.remove('chat-fullscreen');
      document.body.style.overflow = '';
      var msgs = document.getElementById('chatMessages');
      if (msgs) {
        msgs.style.height = msgs.dataset.origHeight || '220px';
        msgs.style.flex = '';
      }
    }
  }
  // Closed-state icon: a chat bubble (task 117), not the paw. Keep this SVG
  // in sync with the one inlined on #chatToggle in index.html.
  btn.innerHTML = chatOpen ? '&#10005;' : '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"26\" height=\"26\" fill=\"white\"><path d=\"M12 3C6.48 3 2 6.58 2 11c0 2.24 1.17 4.26 3.06 5.7-.11.94-.5 2.06-1.3 3.15a.5.5 0 0 0 .54.78c1.94-.5 3.4-1.28 4.4-1.98A12.6 12.6 0 0 0 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z\"/></svg>';
  // Tapping the toggle at all (open or close) means the first-visit greeting
  // bubble has done its job.
  if (typeof dismissChatGreeting === 'function') dismissChatGreeting();
  // input focus removed to prevent keyboard covering chat on mobile
}

// Drag-handle dash at the top of the chat window: tap to expand it to fill
// the screen, tap again to shrink back to the normal floating card.
function toggleChatFullscreen(e) {
  if (e) e.stopPropagation();
  var win = document.getElementById('chatWindow');
  var msgs = document.getElementById('chatMessages');
  if (!win) return;
  var full = win.classList.toggle('chat-fullscreen');
  document.body.style.overflow = full ? 'hidden' : '';
  // #chatMessages has an inline height:220px (set in index.html), which beats
  // the chat-fullscreen CSS class on specificity alone — swap it in JS instead.
  if (msgs) {
    if (full) {
      if (!msgs.dataset.origHeight) msgs.dataset.origHeight = msgs.style.height;
      msgs.style.height = 'auto';
      msgs.style.flex = '1';
    } else {
      msgs.style.height = msgs.dataset.origHeight || '220px';
      msgs.style.flex = '';
    }
  }
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
  // white-space:pre-line so the bot's line breaks between products render.
  // Bot bubble is white/navy-text now, not navy/white-text (direct feedback:
  // a solid dark block reading on a light cream pane looked heavy/harsh) —
  // matches the user bubble's own convention everywhere else on the site
  // (accent colour = the thing that stands out, not the default bubble).
  bub.style.cssText = 'padding:9px 13px;max-width:210px;font-size:13px;font-weight:600;line-height:1.5;white-space:pre-line;' + (isUser ? 'background:#E8630A;color:white;border-radius:14px 14px 4px 14px;' : 'background:white;color:#1a1a2e;border:1px solid #ECE7E0;border-radius:14px 14px 14px 4px;box-shadow:0 2px 8px rgba(0,0,0,0.06);');
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
    return { ok: false, error: "No product with id " + (args && args.product_id) + ". Valid ids are " + products.map(function (p) { return p.id; }).join(", ") + "." };
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
  // Light bubble + dark dots now, matching addMsg()'s bot bubble (direct
  // feedback on the chat window's colors) — was a navy bubble with
  // low-opacity white dots.
  typing.innerHTML = "<div style='width:30px;height:30px;border-radius:50%;background:#E8630A;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='16' height='16' fill='white'><ellipse cx='50' cy='67' rx='20' ry='16'/><ellipse cx='27' cy='47' rx='9' ry='12'/><ellipse cx='42' cy='35' rx='9' ry='12'/><ellipse cx='58' cy='35' rx='9' ry='12'/><ellipse cx='73' cy='47' rx='9' ry='12'/></svg></div><div style='background:white;border:1px solid #ECE7E0;border-radius:14px;padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;gap:4px;align-items:center;'><span style='width:7px;height:7px;background:rgba(26,26,46,0.35);border-radius:50%;display:inline-block;animation:bounce 1s infinite 0s'></span><span style='width:7px;height:7px;background:rgba(26,26,46,0.35);border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.2s'></span><span style='width:7px;height:7px;background:rgba(26,26,46,0.35);border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.4s'></span></div>";
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
    clearTimeout(closePolicyModal._t);
    modal.classList.remove('policy-closing');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } catch(e) { return; }
}

function closePolicyModal() {
  try {
    var modal = document.getElementById('policyModal');
    // Short fade-out (policy-closing, styles.css) before it's hidden.
    if (modal) {
      modal.classList.add('policy-closing');
      clearTimeout(closePolicyModal._t);
      closePolicyModal._t = setTimeout(function () {
        modal.classList.remove('policy-closing');
        modal.style.display = 'none';
      }, 180);
    }
    document.body.style.overflow = '';
  } catch(e) { return; }
}

// ── TAP FEEDBACK ON iOS ───────────────────────────────────────
// iOS Safari only applies :active styles when the page has a touchstart
// listener somewhere. Without one, every press state in styles.css
// (buttons, cards, arrows, options) is skipped on iPhone and taps feel
// dead. Empty and passive: it never blocks or delays scrolling or clicks.
document.addEventListener('touchstart', function () {}, { passive: true });

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

// ── MOBILE HERO HEIGHT LOCK (task 120, hardened task 121) ────────
// On top of the CSS fix (styles.css: #heroSection uses 100svh, not 100dvh,
// in the mobile media query) — that CSS fix depends on the browser actually
// supporting the svh unit, and even in a WebKit-based browser that does
// (confirmed still happening in Chrome for iOS, which is WebKit under Apple's
// platform rules same as Safari) a `resize`-event-only defense turned out not
// to be enough: some mobile browsers' toolbar-collapse animation changes the
// rendered box size of a `position` element WITHOUT ever firing a `resize`
// on `window` at all, so the original version of this fix (recompute only on
// a window resize) never got a chance to intervene, and 100svh alone doesn't
// stop the actual PAINTED size of the box from drifting during that
// animation either.
//
// This version doesn't wait for an event that might not fire: a
// ResizeObserver watches the element's OWN rendered box directly, and
// reasserts the locked height the instant that box's size drifts from what
// was locked, for ANY reason. It only treats innerWidth actually changing as
// a legitimate reason to recompute (a real rotation or window resize); every
// other observed change is corrected back to the same locked value. Setting
// that same value back doesn't loop forever: the observer's next callback
// sees the box already matches and does nothing further.
(function () {
  var hero = document.getElementById('heroSection');
  if (!hero) return;
  var MOBILE_MAX = 900; // matches styles.css's `@media (max-width: 900px)`
  var lastWidth = window.innerWidth;
  var lockedPx = null;

  var announceBar = document.getElementById('announceBar');

  function computeHeight() {
    // --mob-announce-h (styles.css) is a calc()/min()/env() expression, so it
    // varies by device and getComputedStyle().getPropertyValue() on a custom
    // property only ever returns that literal text, not a resolved number —
    // parseFloat on it would silently become NaN. Measuring the real
    // element's rendered height sidesteps that entirely and is correct
    // regardless of how complex the CSS driving it gets.
    var announceH = announceBar ? announceBar.getBoundingClientRect().height : 0;
    var navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mob-nav-h')) || 68;
    // The extra -44 must match styles.css's #heroSection height calc() EXACTLY
    // (both shrink the hero the same "a little shorter" amount per direct
    // feedback) — this inline, !important JS value is what the browser
    // actually renders, so if only the CSS calc() changes this silently wins
    // over it and the hero looks untouched, which is exactly what happened
    // the first time this number changed here without updating this file too.
    var SHRINK_PX = 44;
    return Math.max(window.innerHeight - announceH - navH - SHRINK_PX, 420); // 420 matches the CSS min-height floor
  }

  function apply() {
    if (window.innerWidth > MOBILE_MAX) {
      hero.style.removeProperty('height'); // desktop: let styles.css's own rules govern it
      lockedPx = null;
      return;
    }
    lockedPx = computeHeight();
    hero.style.setProperty('height', lockedPx + 'px', 'important');
  }

  apply();

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) {
      if (lockedPx === null) return; // desktop right now — nothing to enforce
      var widthChanged = window.innerWidth !== lastWidth;
      if (widthChanged) { lastWidth = window.innerWidth; apply(); return; }
      var seen = Math.round(entries[0].contentRect.height);
      if (seen !== lockedPx) hero.style.setProperty('height', lockedPx + 'px', 'important');
    });
    ro.observe(hero);
  } else {
    // No ResizeObserver (very old browser): fall back to the resize-event-only
    // version, still correct on any browser where the box size only ever
    // changes alongside a real `resize` event.
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      apply();
    }, { passive: true });
  }
})();

// ── HERO SLIDESHOW ────────────────────────────────────────────
// Crossfades the 4 hero slides: 5s per image, 1.5s fade (CSS transition),
// looping forever. All 4 are loaded eagerly at high priority (index.html)
// since the starting slide is randomized — the actual random pick and the
// matching preload link + initial .active class are decided as early as
// possible in <head>/inline (see index.html); this just continues the
// rotation from whichever slide that was.
// Restored in place of the task-121 hero <video>, which never got a real
// clip (this sandbox has no outbound network access) and was just showing
// one of these same 4 photos as a permanent poster the whole time — a video
// in name only. Skips entirely under prefers-reduced-motion (the video
// attempt's own convention, worth keeping even in the restored slideshow).
// Skips any slide index.html's heroSlideError() marked data-heroFailed — a
// hotlinked photo that 404s partway through the visit (or was already dead
// on load) drops out of the rotation instead of the crossfade landing on a
// blank frame every time it comes back around.
(function () {
  var slides = document.querySelectorAll('#heroSection .hero-slide');
  if (slides.length < 2) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var idx = window.__heroStartIdx || 0;
  setInterval(function () {
    if (document.hidden) return; // pause in background tabs
    // Find the next slide that hasn't failed, starting right after idx and
    // wrapping at most once all the way around. If every slide has failed,
    // there's nothing left to switch to — leave whatever's currently shown
    // (even a failed one keeps its last-good frame, never reverts to blank).
    var next = -1;
    for (var step = 1; step <= slides.length; step++) {
      var candidate = (idx + step) % slides.length;
      if (slides[candidate].dataset.heroFailed !== '1') { next = candidate; break; }
    }
    if (next === -1) return;
    idx = next;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
  }, 5000);
})();

// ── ANNOUNCE BAR ROTATOR (task 122, mobile only) ──────────────────────
// Crossfades through whichever .announce-slide elements are actually visible
// (desktop never runs this — .announce-rotator stays display:none there, so
// getElementById still finds it but the loop below finds zero slides and
// bails). The 10% Off slide is hidden by a plain CSS rule the moment
// html.offer-claimed is set (pre-paint from localStorage, or live via
// markOfferClaimed()), and getSlides() re-reads computed style on every
// tick — so an email submitted mid-rotation drops that slide out within one
// cycle with no extra code path, the same way the hero crossfade paused
// itself in background tabs rather than needing a separate "stopped" state.
(function () {
  var rotator = document.getElementById('announceRotator');
  if (!rotator) return;
  var ROTATE_MS = 3500;
  var idx = -1;

  function getSlides() {
    var all = rotator.querySelectorAll('.announce-slide');
    var visible = [];
    for (var i = 0; i < all.length; i++) {
      if (getComputedStyle(all[i]).display !== 'none') visible.push(all[i]);
    }
    return visible;
  }

  function show(nextIdx) {
    var slides = getSlides();
    if (!slides.length) return;
    for (var i = 0; i < slides.length; i++) slides[i].classList.remove('active');
    idx = ((nextIdx % slides.length) + slides.length) % slides.length;
    slides[idx].classList.add('active');
  }

  show(0);
  setInterval(function () {
    if (document.hidden) return; // pause in background tabs, same as the hero crossfade did
    show(idx + 1);
  }, ROTATE_MS);
})();

// Tapping the announce bar's "10% Off Your First Order" slide scrolls down to
// the home page's email-capture section instead of following the bare "#"
// href (kept as a real href so it still does SOMETHING with JS disabled or
// mid-load). Offset by both fixed bars' actual rendered height rather than
// trying to parse --mob-announce-h, which is a calc()/env() expression, not
// a flat number — same reasoning as the mobile hero-height-lock above.
function scrollToEmailSection(e) {
  if (e) e.preventDefault();
  var target = document.getElementById('emailSection');
  if (!target) return;
  var nav = document.getElementById('mainNav');
  var announceBar = document.getElementById('announceBar');
  var offset = (nav ? nav.getBoundingClientRect().height : 0) +
               (announceBar ? announceBar.getBoundingClientRect().height : 0) + 12;
  var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(y, 0), behavior: reduce ? 'auto' : 'smooth' });
}

// ── PRODUCT PAGE TITLE ───────────────────────
var originalShowProduct = showProduct;
showProduct = function(id, opts) {
  // opts (routing sync/push mode — see products.js) must be forwarded, not
  // dropped, or every product-page navigation would silently stop updating
  // the URL.
  originalShowProduct(id, opts);
  var p = products.find(function (pr) { return pr.id === id; });
  if (p) setSpaTitle(p.name);
};

// ==================== BLOG ====================
// Post content lives in blog.js. The SERVER (api/_seo.js) already renders the
// same markup into #blogIndex / #blogPost for a direct URL load, because the
// entire point of the blog is being read by crawlers that do not run
// JavaScript. These functions produce byte-comparable markup and cover
// in-site navigation, where no new document is ever fetched.
//
// KEEP IN SYNC with renderBlogIndexHtml()/renderPostHtml() in api/_seo.js —
// if the two drift, a post looks different depending on whether you arrived
// by link or by clicking through the site.

function blogEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function blogFmtDate(iso) {
  // Parsed as UTC and formatted as UTC on purpose: a bare "2026-08-08" parsed
  // as local time renders as the 7th for anyone west of UTC, which would then
  // disagree with the datetime attribute and with the server-rendered copy.
  var d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function blogCardHtml(p) {
  return '<a class="blog-card" href="/blog/' + blogEsc(p.slug) + '" onclick="goToPost(event,\'' + blogEsc(p.slug) + '\')">' +
    '<div class="blog-card-img"><img src="' + blogEsc(p.image) + '" alt="' + blogEsc(p.imageAlt) + '" loading="lazy" width="1200" height="630"></div>' +
    '<div class="blog-card-body">' +
    '<div class="blog-card-tags">' + (p.tags || []).map(function (t) { return '<span>' + blogEsc(t) + '</span>'; }).join('') + '</div>' +
    '<h2>' + blogEsc(p.title) + '</h2>' +
    '<p>' + blogEsc(p.excerpt) + '</p>' +
    '<div class="blog-card-meta"><time datetime="' + blogEsc(p.date) + '">' + blogEsc(blogFmtDate(p.date)) + '</time><span>·</span><span>' + blogEsc(p.readMins) + ' min read</span></div>' +
    '</div></a>';
}

function renderBlogIndex() {
  var el = document.getElementById('blogIndex');
  if (!el || typeof blogPosts === 'undefined') return;
  el.innerHTML = '<div class="blog-grid">' + blogPosts.map(blogCardHtml).join('') + '</div>';
}

function blogPostHtml(post) {
  return '<article class="blog-article">' +
    '<nav class="blog-crumbs"><a href="/blog" onclick="goTo(event,\'blog\')">Blog</a><span>/</span><span>' + blogEsc(post.title) + '</span></nav>' +
    '<h1 class="blog-article-title">' + blogEsc(post.title) + '</h1>' +
    '<div class="blog-article-meta"><time datetime="' + blogEsc(post.date) + '">' + blogEsc(blogFmtDate(post.date)) + '</time>' +
    '<span>·</span><span>' + blogEsc(post.readMins) + ' min read</span></div>' +
    '<img class="blog-article-img" src="' + blogEsc(post.image) + '" alt="' + blogEsc(post.imageAlt) + '" width="1200" height="630">' +
    '<div class="blog-body">' + post.body + '</div>' +
    '<div class="blog-article-foot">' +
    '<a class="btn-primary" href="/shop" onclick="goTo(event,\'shop\')">Shop Walk Gear</a>' +
    '<a class="blog-back" href="/blog" onclick="goTo(event,\'blog\')">← All articles</a>' +
    '</div></article>';
}

// Returns false for an unknown slug so dispatchRoute (products.js) can fall
// back to Home and correct the address bar, exactly as it does for a stale
// product slug.
function showPost(slug, opts) {
  if (typeof blogPosts === 'undefined') return false;
  var post = blogPosts.find(function (p) { return p.slug === slug; });
  if (!post) return false;

  var el = document.getElementById('blogPost');
  if (!el) return false;
  el.innerHTML = blogPostHtml(post);

  // Same bootstrap-class teardown showPage does — without it the pre-paint
  // !important rule from the <head> keeps pinning whichever page the hard
  // reload landed on (see the ROUTE_BOOTSTRAP_CLASSES comment in products.js).
  document.documentElement.classList.remove.apply(
    document.documentElement.classList, ROUTE_BOOTSTRAP_CLASSES);
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active', 'page-transition'); });
  document.getElementById('page-blog-post').classList.add('active', 'page-transition');

  closeMobileMenu();
  closeSearch();
  setSpaTitle(post.metaTitle || post.title);
  navigateUrl('/blog/' + post.slug, opts);

  document.documentElement.style.scrollBehavior = 'auto';
  requestAnimationFrame(function () {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  });
  return true;
}

// Link handler for post links, mirroring goTo() — lets ctrl/cmd/middle-click
// open a real new tab from the href instead of being hijacked.
function goToPost(e, slug) {
  if (e && (e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
  if (e) e.preventDefault();
  showPost(slug);
}

// Tab/bookmark/history title for CLIENT-SIDE navigation only. The server owns
// the real SEO <head> (api/_seo.js) — it is what every crawler and link
// scraper sees, since none of them navigate an SPA. This is deliberately a
// short human-facing label rather than a duplicate of the full meta table,
// so there is no second copy of that copywriting to keep in sync.
var SPA_PAGE_TITLES = {
  home: 'PawHaul — Built For Every Walk',
  shop: 'Shop Walk Gear',
  about: 'Our Story',
  contact: 'Contact',
  blog: 'The PawHaul Blog',
  bundles: 'Bundles',
  cart: 'Your Cart',
  wishlist: 'Your Wishlist'
};

function setSpaTitle(label) {
  document.title = (label && label.indexOf('PawHaul') !== -1) ? label : (label ? label + ' | PawHaul' : 'PawHaul');
}

// ==================== ANALYTICS ====================
// Every function here is a no-op unless GA4_ID has been filled in (see the
// ANALYTICS comment in index.html). Nothing below throws when analytics is
// off, so the site behaves identically either way — which is the point:
// tracking must never be able to break a purchase.
//
// Vercel Web Analytics needs none of this; it records page views by itself.
// GA4 does, because automatic pageview tracking fires once per DOCUMENT load
// and this SPA changes route without one.

function gaReady() { return typeof gtag === 'function' && !!window.GA4_ID; }

function trackPageView() {
  if (!gaReady()) return;
  gtag('event', 'page_view', {
    page_path: location.pathname,
    page_location: location.href,
    page_title: document.title
  });
}

function trackEvent(name, params) {
  if (!gaReady()) return;
  gtag('event', name, params || {});
}

// GA4's recommended ecommerce event shape, so the standard Monetisation
// reports populate rather than these landing as unmapped custom events.
function trackAddToCart(product, price, size, color) {
  if (!gaReady() || !product) return;
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: Number(price) || Number(product.price) || 0,
    items: [{
      item_id: 'PH-' + product.id,
      item_name: product.name,
      item_variant: [size, color].filter(Boolean).join(' / ') || undefined,
      price: Number(price) || Number(product.price) || 0,
      quantity: 1
    }]
  });
}

// The wrappers that feed these live at the very bottom of this file — they
// have to be applied AFTER the page-navigation hooks below, so that a
// page_view is only sent once the hook has finished setting document.title.

// ==================== PAGE NAVIGATION HOOKS ====================
var _origShowPage = showPage;
showPage = function(page, opts) {
  _origShowPage(page, opts);
  closeMobileMenu();
  closeSearch();
  if (SPA_PAGE_TITLES[page]) setSpaTitle(SPA_PAGE_TITLES[page]);
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
// The closed panel is hidden with opacity + pointer-events, NOT with
// `visibility: hidden` — see the long note on .mob-menu-overlay in styles.css:
// the visibility flip is what destroys the overlay's compositing layer at the
// end of a close, and iOS re-composites the fixed header a frame late when
// that happens, flashing a strip of the page above it. Visibility was also
// what kept the closed panel out of the accessibility tree and the tab order,
// so that job moves here: aria-hidden for screen readers, inert (where
// supported) so its links cannot be tabbed to or clicked while invisible.
function setMenuHidden(menu, hidden) {
  if (!menu) return;
  menu.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  // Assigning to .inert is a no-op on browsers that don't support it; the
  // pointer-events:none in the stylesheet still covers pointer input there.
  try { menu.inert = hidden; } catch (e) {}
}

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
  setMenuHidden(menu, isOpen);
  // task 134: the panel now fills the screen exactly (100dvh) with nothing
  // inside it scrolling, so the page behind has to be locked too. Locks
  // <html>, not <body> — document.scrollingElement is HTML on this page (it
  // carries overflow-x:hidden and the implicit auto-y that make it the real
  // scroller), so body.style.overflow is a no-op here: verified a plain
  // wheel scroll still moved the page 800px with the menu open before this
  // was pointed at the right element. The chat-fullscreen/policy-modal locks
  // elsewhere in this file set body instead and were never actually
  // confirmed to stop scrolling on this page either — out of scope to chase
  // down here, but worth knowing this isn't a mechanism to copy blindly.
  document.documentElement.style.overflow = isOpen ? '' : 'hidden';
}

function closeMobileMenu() {
  var menu = document.getElementById('mobMenu');
  if (!menu) return;
  menu.classList.remove('open');
  document.getElementById('mobMenuOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  setMenuHidden(menu, true);
  document.documentElement.style.overflow = '';
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

// ── NEW-BUILD DETECTION ───────────────────────────────────────
// Symptom this exists to fix: a deploy goes out, but a phone that already had
// the site open keeps showing the previous build — only a brand-new tab (a
// private window, say) picks it up. That is NOT an HTTP caching problem;
// vercel.json already sends `no-cache, no-store, must-revalidate` on every
// route, and a normal profile re-fetches correctly on any real navigation.
// It's that iOS Safari can restore a suspended tab, or a bfcache entry, as a
// finished render with no request to the server at all — no response header
// can reach a page that is never requested. So the page checks for itself
// whenever it comes back to the foreground.
//
// The signal is the ETag of "/", which Vercel derives from index.html's
// content: it changes on every deploy that touches the page (the ?v= bumps on
// styles/app guarantee that) and is byte-identical across repeat requests and
// edge nodes — verified, and it matters, because a value that flapped would
// mean a reload loop.
(function () {
  var RECHECK_MS = 30000;
  var loadedTag = null;
  var lastCheck = 0;
  var busy = false;

  function headTag() {
    return fetch('/', { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.headers.get('etag') : null; })
      .catch(function () { return null; }); // offline/blocked: try again later
  }

  // Deferred: this must never compete with first paint (see the hero/flash
  // notes elsewhere in this file for how sensitive that window is here).
  setTimeout(function () { headTag().then(function (t) { loadedTag = t; }); }, 2000);

  // Reloading under someone's fingers is worse than showing them a stale page,
  // so anything that would throw away real work vetoes it — the next
  // foreground check picks the update up once they're done. The cart survives
  // regardless (it rehydrates from Shopify), but a half-typed message doesn't.
  function safeToReload() {
    var chat = document.getElementById('chatWindow');
    if (chat && chat.style.display === 'block') return false;
    var typed = false;
    document.querySelectorAll('input, textarea').forEach(function (el) {
      if (el.type !== 'hidden' && el.value && el.value.trim()) typed = true;
    });
    return !typed;
  }

  function check() {
    if (busy || !loadedTag) return;
    // Vetoed before the request, not after: this way a user who is mid-way
    // through typing doesn't burn the throttle window, so the update lands on
    // their very next return rather than 30s later.
    if (!safeToReload()) return;
    if (Date.now() - lastCheck < RECHECK_MS) return;
    lastCheck = Date.now();
    busy = true;
    headTag().then(function (tag) {
      busy = false;
      if (!tag || tag === loadedTag) return;
      if (!safeToReload()) return; // re-checked: they may have started typing
      // Belt and braces: never reload twice for the same build, so even a
      // pathological mismatch between served and rendered HTML can't loop.
      try {
        if (sessionStorage.getItem('pawhaul_reloaded_for') === tag) return;
        sessionStorage.setItem('pawhaul_reloaded_for', tag);
      } catch (e) {}
      location.reload();
    });
  }

  // Both paths matter: `persisted` is a true bfcache restore, while a tab that
  // was merely backgrounded and re-shown only fires visibilitychange.
  window.addEventListener('pageshow', function (e) { if (e.persisted) check(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
})();

// ==================== SEARCH (task 135) ====================
// Full-screen view (a large centered overlay on desktop — see styles.css).
// Default state: all products + 3 named bundles, rendered ONCE by
// renderSearchDefaults() (called from the DOMContentLoaded block further
// down) and toggled via the `hidden` attribute rather than rebuilt per
// keystroke, so the carousel's scroll position and bound listeners survive
// typing and clearing. Active state: live results, rebuilt by doSearch() on
// every keystroke.

function searchIsOpen() {
  var bar = document.getElementById('navSearchBar');
  return !!(bar && bar.classList.contains('open'));
}

// Hide the floating chat paw while the search view or offer popup is up
// (it sits at z-index 9999 and would float on top of them).
function syncOverlayChrome() {
  document.body.classList.toggle('overlay-up', searchIsOpen() || offerIsOpen() || offlineIsUp());
}

// Declared here (not only inside the offline IIFE further down) so
// syncOverlayChrome can be called before that block has run.
function offlineIsUp() {
  var s = document.getElementById('offlineScreen');
  return !!(s && s.classList.contains('active'));
}

function toggleSearch() {
  if (searchIsOpen()) { dismissSearch(); } else { openSearch(); }
}

// Pushed once per open so the browser's own Back button closes search
// instead of leaving the page (see the popstate listener below). Cleared
// the moment that entry is consumed — either by dismissSearch() popping it,
// or by a real Back press, where the popstate listener clears it instead
// since the browser has already done the popping itself.
var searchHistoryPushed = false;
// The scroll position to restore once search closes — captured on open,
// restored in the popstate listener below. Needed because this file ALSO
// has a pre-existing, unconditional `window.scrollTo(0, 0)` on every
// `pageshow` (see that listener further down — it exists to reset bfcache
// restores for ordinary page navigation), and a same-document Back press
// triggers pageshow too, even though nothing actually navigated. Without
// this, "returns to the exact spot" was losing to that reset: measured
// scrollY go 166 -> 0 across a real Back press before this was added.
var searchScrollY = 0;
// Chrome restores scroll position asynchronously AFTER popstate listeners
// run, which clobbers the manual window.scrollTo() below regardless of
// timing tricks (confirmed: scrollY lands on the browser's own restored
// value immediately after popstate, then snaps to 0 moments later on its
// own). Opting out of automatic restoration site-wide is the only reliable
// fix — we restore the exact spot ourselves instead.
try { history.scrollRestoration = 'manual'; } catch (e) {}
// Whether the task-136 body lock below is currently applied — closeSearch()
// is called defensively from many places regardless of whether search was
// ever open (see its own comment), so it needs to know whether there's
// actually anything to unlock before touching body.style or scrolling.
var searchBodyLocked = false;
// task 137: set by closeSearchAnimated() while its deferred unlock is
// still pending (fade-out in progress) — a canceller openSearch() calls if
// the view is reopened before that unlock ran. Without this, a quick
// reopen during the ~300ms close window would read window.scrollY as 0
// (the body is still position:fixed from the close that hasn't finished
// yet) and stamp that 0 over the still-correct saved offset, so the
// EVENTUAL close would restore to the top of the page instead of where the
// visitor actually was — caught via a rapid open/close/open/close test.
var searchPendingCloseCancel = null;

function openSearch() {
  var bar = document.getElementById('navSearchBar');
  var scrim = document.getElementById('searchScrim');
  if (!bar) return;
  closeMobileMenu();
  // "any popup" (task 136) includes this one — it sits at z-index 1001,
  // above the search view's 905, and nothing before this would otherwise
  // close it if a visitor opened search while it happened to be up.
  if (offerIsOpen()) dismissOffer();
  if (searchPendingCloseCancel) { searchPendingCloseCancel(); searchPendingCloseCancel = null; }
  bar.classList.add('open');
  if (scrim) scrim.classList.add('open');
  syncOverlayChrome();
  // task 134-style lock: documentElement, not body — this page's real
  // scrolling element is <html> (confirmed while building the task-134
  // menu lock), so body.style.overflow is a no-op here.
  document.documentElement.style.overflow = 'hidden';
  // task 136: overflow:hidden on <html> alone doesn't stop iOS Safari from
  // scrolling the page out from under a focused input once the keyboard
  // rises — position:fixed on body, offset by the scroll position just
  // saved above, is what actually holds firm there. Kept alongside (not
  // instead of) the documentElement lock above: menus/overlays with no text
  // input on this site have never needed it, but search is the one view
  // that hands the keyboard a focused field to push against.
  //
  // Only capture + apply the lock if it isn't ALREADY applied (the
  // cancelled pending close above can leave it in place) — see
  // searchPendingCloseCancel's own comment for why re-reading
  // window.scrollY here would be wrong in that case.
  if (!searchBodyLocked) {
    searchScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -searchScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    searchBodyLocked = true;
  }
  syncSearchViewportHeight();
  if (!searchHistoryPushed) {
    history.pushState({ searchOpen: true }, '', location.href);
    searchHistoryPushed = true;
  }
  // Focus synchronously (still inside the tap gesture) so iOS opens the
  // keyboard; preventScroll so focusing the fixed input can't nudge the page.
  var inp = document.getElementById('navSearchInput');
  if (inp) {
    try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
  }
}

// Shared by closeSearch() and closeSearchAnimated() below: the actual
// page-unlock + scroll-restore, factored out so the animated path can defer
// running it without duplicating it.
function unlockAfterSearchClose() {
  document.documentElement.style.overflow = '';
  if (searchBodyLocked) {
    searchBodyLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    // Removing position:fixed drops the page back at scrollY 0 — restore
    // the saved spot ourselves, and do it with scroll-behavior forced to
    // 'auto' first: this site's html has scroll-behavior:smooth, which
    // would otherwise animate the jump back into a visible slide/bounce —
    // exactly the drop-and-snap tasks 31, 91 and 116 already had to fix
    // once. Instant here is the "no jump" task 136 asks for.
    var prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, searchScrollY);
    document.documentElement.style.scrollBehavior = prevBehavior;
  }
  syncOverlayChrome();
}

// Pure UI close — safe to call from anywhere, any time, regardless of order
// relative to some OTHER navigation happening in the same click (several
// places in this file call it defensively, e.g. goTo()'s own
// "closeMobileMenu();closeSearch()", and every product/bundle card inside
// search itself, which is ON ITS WAY to a different page the instant this
// returns). Deliberately never touches history: see dismissSearch() below
// for the one path that does, and why it has to stay separate from this
// one. Immediate and synchronous throughout — correct for a navigation
// (there's no "white gap" to race there, the page is being replaced right
// away) but NOT what the bar's own close button/Escape/Back use any more;
// see closeSearchAnimated() for why those need to wait.
function closeSearch() {
  var bar = document.getElementById('navSearchBar');
  if (!bar) return;
  // A closeSearchAnimated() from a moment ago may still be waiting on its
  // transition before it unlocks the page — this function is about to do
  // that right now instead, so cancel the pending one rather than leave it
  // to redundantly fire its own finish() later.
  if (searchPendingCloseCancel) { searchPendingCloseCancel(); searchPendingCloseCancel = null; }
  bar.classList.remove('open');
  var scrim = document.getElementById('searchScrim');
  if (scrim) scrim.classList.remove('open');
  unlockAfterSearchClose();
  var inp = document.getElementById('navSearchInput');
  if (inp) { inp.value = ''; inp.blur(); }
  doSearch(''); // resets to the default (carousel + bundles) view
}

// task 137: the user explicitly closing search while STAYING on this page
// (the bar's own close button, Escape, the desktop scrim click, or a real
// hardware Back press — see the popstate listener below) used to run
// through plain closeSearch(), which unlocks the page and snaps its scroll
// back to the saved position in the same instant the fade-out starts. With
// the keyboard up, that raced its own ~250ms dismiss animation: the page
// would already be unlocked and resting at its true scroll position while
// the overlay was still visibly fading out and the keyboard was still
// mid-collapse, and neither geometry had settled yet — that gap is what
// showed as a white bar across the bottom for about a second.
//
// This path blurs first (so the keyboard starts closing immediately,
// rather than only once the unlock below gets around to calling it), lets
// the fade-out transition actually finish, and only then unlocks the page
// and restores scroll. searchIsOpen() (and so syncSearchViewportHeight's
// own guard) already goes false the moment the 'open' class comes off
// below — synchronously, before this function even returns — so nothing
// needs to separately suppress the visualViewport listener during the
// wait: it's already a no-op for the whole ~300ms this takes.
function closeSearchAnimated() {
  var bar = document.getElementById('navSearchBar');
  if (!bar || !bar.classList.contains('open')) { closeSearch(); return; }
  var inp = document.getElementById('navSearchInput');
  if (inp) inp.blur();
  bar.classList.remove('open');
  var scrim = document.getElementById('searchScrim');
  if (scrim) scrim.classList.remove('open');
  var done = false;
  var timer;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    bar.removeEventListener('transitionend', onEnd);
    if (searchPendingCloseCancel === cancel) searchPendingCloseCancel = null;
    unlockAfterSearchClose();
    if (inp) inp.value = '';
    doSearch('');
  }
  // Reopening search before finish() runs (a quick re-tap) must NOT let
  // this unlock the page out from under the new open — see
  // searchPendingCloseCancel's own comment. Cancelling just stops this
  // close from completing; it leaves the lock exactly as it already is,
  // which openSearch() then reuses rather than re-establishes.
  function cancel() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    bar.removeEventListener('transitionend', onEnd);
  }
  function onEnd(e) { if (e.target === bar) finish(); }
  bar.addEventListener('transitionend', onEnd);
  // Safety net, not the primary signal: covers prefers-reduced-motion's
  // shorter transition, a transitionend that never fires (interrupted by a
  // second rapid open/close), and the iOS keyboard's own dismiss animation
  // outlasting the view's 0.24s fade.
  timer = setTimeout(finish, 360);
  searchPendingCloseCancel = cancel;
}

// The actual user-facing "close" affordance (the bar's back button, the
// desktop scrim click, Escape). Unlike closeSearch() this ALSO pops the
// history entry openSearch() pushed — which is what makes the browser's
// real Back button, pressed afterwards, land one step further back than it
// otherwise would. That's the "closes search and returns to the exact
// spot" behaviour the task asks for, done the same way for both triggers.
function dismissSearch() {
  var hadHistory = searchHistoryPushed;
  closeSearchAnimated();
  if (hadHistory) {
    searchHistoryPushed = false;
    history.back();
  }
}

// A real Back press has already popped the entry by the time this fires —
// no history.back() here (that would pop a SECOND, unrelated entry).
// Harmless no-op whenever search isn't open — ordinary page-to-page Back
// navigation is products.js's own popstate listener's job, not this one's.
window.addEventListener('popstate', function () {
  if (searchIsOpen()) {
    searchHistoryPushed = false;
    // closeSearchAnimated() (not closeSearch()) — a real hardware Back
    // press can land here with the keyboard still up, same as pressing the
    // X button, and needs the same wait-for-the-fade handling; see its own
    // comment. products.js's popstate listener (registered first, so it
    // already ran by the time this fires) used to re-dispatch the current
    // route and reset scroll to 0 on every popstate, including this
    // state-only one; fixed there (see lastRouteHref) by skipping that
    // re-dispatch when the href didn't actually change.
    closeSearchAnimated();
  }
});

function clearSearchInput() {
  var inp = document.getElementById('navSearchInput');
  if (!inp) return;
  inp.value = '';
  doSearch('');
  try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
}

// task 136: sizes ONLY the inner scrollable results area (.search-body) to
// the space still visible above the iOS keyboard — the overlay itself
// (.search-view) stays pinned to the full 100dvh layout viewport always
// (see its own styles.css comment for why: shrinking the WHOLE view to
// visualViewport used to leave the page behind it visible under the
// keyboard). --search-kb-inset is the keyboard's own height: the layout
// viewport's height minus what visualViewport still reports visible.
// Harmless no-op in browsers without visualViewport (the var()'s 0px
// fallback in styles.css covers them) and effectively a no-op on desktop,
// where a keyboard never shrinks the viewport in the first place.
function syncSearchViewportHeight() {
  if (!window.visualViewport || !searchIsOpen()) return;
  var vv = window.visualViewport;
  var inset = Math.max(0, document.documentElement.clientHeight - vv.height - vv.offsetTop);
  document.documentElement.style.setProperty('--search-kb-inset', inset + 'px');
  // The visual viewport shifting (keyboard opening/closing, or iOS nudging
  // it to keep the focused input in view) is exactly what used to drag the
  // whole page up/down behind the overlay. The body is already pinned via
  // position:fixed (see openSearch), so window.scrollY has no business
  // moving at all while search is open — if iOS moves it anyway, put it
  // straight back so the overlay never visibly shifts.
  if (searchBodyLocked && window.scrollY !== 0) window.scrollTo(0, 0);
}
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncSearchViewportHeight);
  window.visualViewport.addEventListener('scroll', syncSearchViewportHeight);
}

// ---------- default-state content: product carousel + bundles row ----------
// Exactly the 3 bundles task 135 names — NOT the full BUNDLES array, which
// also has the separate Walk Essentials Bundle (bottle + poop clip, id
// 'hydration' — confusingly close to 'portable-hydration', the one actually
// wanted here, named "Hydration Bundle").
var SEARCH_BUNDLE_IDS = ['led', 'portable-hydration', 'visibility'];

// task 138: a failed <img> load (a dead/renamed file, a blocked host, a
// network hiccup) used to just leave the browser's own broken-image icon
// sitting there — `src` resolving to SOMETHING is not the same as the photo
// actually loading, and productImageFor()'s own fallback (used below) only
// ever covers the first case, not the second. This is the second: `onerror`
// swaps the failed <img> for the plain-text emoji the same card would have
// shown had no photo URL existed in the first place, so a real network
// failure degrades exactly like "no photo" always has — never a broken-
// image glyph. The replacement text is plain (no nested element/attributes)
// specifically so it needs no quote-escaping games inside the onerror
// attribute itself: HTML entity-decodes `this.outerHTML='<emoji>'` before JS
// ever sees it, so the only character that would be unsafe here is an
// apostrophe, and no emoji in this catalogue's data contains one.
function imgOnErrorToEmoji(emoji) {
  return ' onerror="this.outerHTML=\'' + emoji + '\'"';
}

function searchProductCardHtml(p) {
  var img = productImageFor(p, p.colors && p.colors[0]);
  var media = img
    ? '<img ' + photoAttrs(img, 'card') + ' alt=""' + imgOnErrorToEmoji(p.emoji) + '>'
    : '<span class="search-pc-emoji" aria-hidden="true">' + p.emoji + '</span>';
  return '<a class="search-pc-card" href="/product/' + slugify(p.name) + '" onclick="closeSearch();goToProductLink(event,' + p.id + ')">' +
    '<div class="search-pc-media">' + media + '</div>' +
    '<div class="search-pc-name">' + esc(p.name) + '</div>' +
    '<div class="search-pc-price">$' + lowestVariant(p).price.toFixed(2) + '</div>' +
  '</a>';
}

// A bundle (BUNDLES in products.js) doesn't always carry its own `img` —
// some, like the Hydration Bundle, deliberately leave it out because
// neither of their two products has a real photo yet (see that bundle's own
// comment). Falling back straight to a bare "%" character there read as a
// broken placeholder, not a deliberate design choice, so this instead tries,
// in order: the bundle's own photo, then each constituent product's own
// photo (bundleProducts() preserves `ids` order, so "the first product's
// image" per task 138 is whichever of the two actually has one), and only
// once none of that exists falls back to the first constituent product's
// emoji — the same real fallback chain searchProductCardHtml() above uses
// for a single product, just extended across a bundle's line items.
function bundleMediaUrl(b) {
  if (b.img) return b.img;
  var items = bundleProducts(b);
  for (var i = 0; i < items.length; i++) {
    var url = productImageFor(items[i], items[i].colors && items[i].colors[0]);
    if (url) return url;
  }
  return null;
}
function bundleFallbackEmoji(b) {
  var items = bundleProducts(b);
  return (items[0] && items[0].emoji) || '🎁';
}

function searchBundleCardHtml(b) {
  var t = bundleTotals(b);
  var url = bundleMediaUrl(b);
  var emoji = bundleFallbackEmoji(b);
  var media = url
    ? '<img src="' + url + '" alt=""' + imgOnErrorToEmoji(emoji) + '>'
    : emoji;
  return '<a class="search-bundle-card" href="/bundles#bundle-' + b.id + '" onclick="closeSearch();goToBundle(event,\'' + b.id + '\')">' +
    '<div class="search-bundle-media">' + media + '</div>' +
    '<div class="search-bundle-info">' +
      '<div class="search-bundle-name">' + esc(b.name) + '</div>' +
      '<div class="search-bundle-price">$' + t.bundle.toFixed(2) + '</div>' +
    '</div>' +
  '</a>';
}

// Called once at page load (DOMContentLoaded block further down), not on
// every openSearch() — rebuilding/rebinding the carousel on every open
// would also reset its scroll position every time.
function renderSearchDefaults() {
  var track = document.getElementById('searchCarTrack');
  if (track) {
    var list = (typeof products !== 'undefined') ? products : [];
    track.innerHTML = list.map(searchProductCardHtml).join('');
  }
  var bundlesRow = document.getElementById('searchBundlesRow');
  if (bundlesRow && typeof BUNDLES !== 'undefined') {
    var bundles = SEARCH_BUNDLE_IDS.map(function (id) {
      return BUNDLES.find(function (b) { return b.id === id; });
    }).filter(Boolean);
    bundlesRow.innerHTML = bundles.map(searchBundleCardHtml).join('');
  }
  initPcCarousel('searchCarTrack', 'searchCarPrev', 'searchCarNext', null);
}

// ---------- active-state content: live results ----------
function searchResultProductHtml(p, hl) {
  var thumbUrl = productImageFor(p, p.colors && p.colors[0]);
  var thumb = thumbUrl ? '<img ' + photoAttrs(thumbUrl, 'thumb') + ' alt=""' + imgOnErrorToEmoji(p.emoji) + '>' : p.emoji;
  return '<a class="search-result-item" href="/product/' + slugify(p.name) + '" onclick="closeSearch();goToProductLink(event,' + p.id + ')">' +
    '<span class="search-result-thumb">' + thumb + '</span>' +
    '<div class="search-result-info">' +
      '<div class="search-result-name">' + p.name.replace(hl, '<b>$1</b>') + '</div>' +
      '<div class="search-result-meta">' +
        '<span class="search-result-price">$' + lowestVariant(p).price.toFixed(2) + '</span>' +
        supplierRatingCompactHtml(p) +
      '</div>' +
    '</div>' +
  '</a>';
}

function searchResultBundleHtml(b, hl) {
  var t = bundleTotals(b);
  var url = bundleMediaUrl(b);
  var emoji = bundleFallbackEmoji(b);
  var thumb = url
    ? '<img ' + photoAttrs(url, 'thumb') + ' alt=""' + imgOnErrorToEmoji(emoji) + '>'
    : emoji;
  return '<a class="search-result-item" href="/bundles#bundle-' + b.id + '" onclick="closeSearch();goToBundle(event,\'' + b.id + '\')">' +
    '<span class="search-result-thumb search-result-thumb--bundle" aria-hidden="true">' + thumb + '</span>' +
    '<div class="search-result-info">' +
      '<div class="search-result-name">' + b.name.replace(hl, '<b>$1</b>') + '<span class="search-result-tag">Bundle</span></div>' +
      '<div class="search-result-meta"><span class="search-result-price">$' + t.bundle.toFixed(2) + '</span></div>' +
    '</div>' +
  '</a>';
}

// Matches product/bundle NAMES plus each product's desc/tags, all
// case-insensitive substring — which, for what it's worth, already covers
// every example keyword task 135 lists ("led", "water", "bowl", "leash",
// "collar", "strap") for free: every one of them is literally a substring
// of a real product name ("LED Dog Collar", "...Water Bottle", "...Water
// Bowl", "...Leash", "Anti-Drop Leash Wrist Strap"). "bundle" is handled
// separately below since it's not naturally part of any bundle's name.
function doSearch(val) {
  var defaultEl = document.getElementById('searchDefault');
  var resultsEl = document.getElementById('searchResults');
  var clearBtn = document.getElementById('searchClearBtn');
  if (!resultsEl) return;
  var q = (val || '').trim().toLowerCase();
  if (clearBtn) clearBtn.hidden = !q;

  if (!q) {
    if (defaultEl) defaultEl.hidden = false;
    resultsEl.hidden = true;
    resultsEl.innerHTML = '';
    return;
  }
  if (defaultEl) defaultEl.hidden = true;
  resultsEl.hidden = false;

  var list = (typeof products !== 'undefined') ? products : [];
  // Name matches rank first, then description/tag matches below them.
  var nameHits = [], otherHits = [];
  list.forEach(function (p) {
    if (p.name.toLowerCase().indexOf(q) !== -1) { nameHits.push(p); return; }
    var haystack = ((p.desc || '') + ' ' + (p.tags ? p.tags.join(' ') : '')).toLowerCase();
    if (haystack.indexOf(q) !== -1) otherHits.push(p);
  });
  var prodMatches = nameHits.concat(otherHits);

  var bundleList = (typeof BUNDLES !== 'undefined') ? BUNDLES : [];
  var bundleMatches = bundleList.filter(function (b) {
    // ' bundle' appended so the literal query "bundle" matches every one of
    // them, same as the old "bundl|deal|.../" regex did for the Bundles
    // page link it used to show — this version offers the actual bundles
    // instead of a generic page link.
    var haystack = (b.name + ' ' + (b.blurb || '') + ' ' + (b.tagline || '') + ' bundle').toLowerCase();
    return haystack.indexOf(q) !== -1;
  });

  if (!prodMatches.length && !bundleMatches.length) {
    resultsEl.innerHTML = '<div class="search-no-results">' +
      '<span class="snr-emoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#C9C2B8" style="width:34px;height:34px;display:inline-block" aria-hidden="true"><ellipse cx="50" cy="67" rx="20" ry="16"/><ellipse cx="27" cy="47" rx="9" ry="12"/><ellipse cx="42" cy="35" rx="9" ry="12"/><ellipse cx="58" cy="35" rx="9" ry="12"/><ellipse cx="73" cy="47" rx="9" ry="12"/></svg></span>' +
      'No results' +
      '<span class="snr-hint"><a href="/shop" onclick="closeSearch();goTo(event,\'shop\')">Browse the full shop →</a></span>' +
    '</div>';
    return;
  }

  // Bold the matched part of the name. Product/bundle names are plain text
  // and the query is regex-escaped, so this stays injection-safe.
  var safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var hl = new RegExp('(' + safe + ')', 'ig');
  resultsEl.innerHTML =
    prodMatches.map(function (p) { return searchResultProductHtml(p, hl); }).join('') +
    bundleMatches.map(function (b) { return searchResultBundleHtml(b, hl); }).join('');
}

// One-time wiring. The scrim only ever matters on desktop (phone/iPad is
// edge to edge — there's no "outside" to tap), but it swallows wheel/touch
// unconditionally so whatever's behind it holds still regardless of width.
(function () {
  var scrim = document.getElementById('searchScrim');
  if (scrim) {
    scrim.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    scrim.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchIsOpen()) dismissSearch();
  });
  // task 138: dismissing the iOS keyboard WITHOUT closing search (the
  // checkmark/Done key, tapping outside the input, or scrolling the results
  // list) blurs the input but leaves search open — and that's exactly the
  // case window.visualViewport's own resize event is unreliable for: it can
  // fire late, fire before the keyboard's dismiss animation has actually
  // finished, or not fire at all, leaving --search-kb-inset (and, before
  // this task, the view's own height) stuck at its keyboard-open value.
  // Blur is a signal of its own, so re-sync immediately on it AND again at
  // 300ms/700ms to catch the keyboard animation settling after the event
  // itself (or the event) was unreliable. A no-op padding value is the
  // worst case if these all somehow still race — see .search-body's own
  // comment for why that was made a deliberately cheap failure mode.
  var inp = document.getElementById('navSearchInput');
  if (inp) {
    inp.addEventListener('blur', function () {
      syncSearchViewportHeight();
      setTimeout(syncSearchViewportHeight, 300);
      setTimeout(syncSearchViewportHeight, 700);
    });
  }
})();

// ==================== CAROUSEL ====================
// Scrolling is NATIVE. Every track is a real overflow-x:auto scroller with
// CSS scroll-snap (see the "CAROUSEL MOTION" block at the end of styles.css),
// and nothing here listens to touch at all. That is the whole point:
//
//   - Touch gets the platform's own momentum, so a hard flick travels
//     further than a slow drag. The handler this replaces wrote scrollLeft
//     1:1 during the drag and then advanced exactly ONE card on release, so
//     a flick and a crawl landed in the identical spot (measured: both
//     327px on every carousel, at every width).
//   - The scroll runs on the compositor instead of a requestAnimationFrame
//     loop writing scrollLeft on the main thread every frame.
//   - The browser does the snapping, so slides land flush. The reviews
//     track used to come to rest 66.5px inside a card.
//   - Rapid arrow clicks retarget one native smooth scroll instead of
//     starting a second rAF loop that fights the first — that overlap was a
//     measurable backwards jump mid-animation.
//   - With no touch handlers, a tap can never be swallowed or mistaken for
//     a drag, and a vertical scroll starting on a card is never hijacked.
//
// What is left is arrow/dot wiring and keeping their state in sync with
// wherever the user actually left the track.

// Shared engine for every carousel on the site. `dots` is optional (only the
// product gallery has them); pass null for the rest.
function bindCarousel(track, prev, next, dots, signal) {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function maxScroll() { return Math.max(0, track.scrollWidth - track.clientWidth); }

  // The scrollLeft that puts each slide flush against the track's left edge,
  // measured from the live boxes rather than computed from card width + gap.
  // The old arithmetic drifted whenever a card width was a fractional
  // percentage, which is what left the arrows resting mid-card. Cached so
  // that syncing during a scroll reads no geometry and forces no layout;
  // re-measured on resize and whenever the carousel is re-bound after a
  // re-render. Stored UNCLAMPED so slides near the end stay distinguishable.
  var targets = [];
  function measure() {
    var rect = track.getBoundingClientRect();
    var sl = track.scrollLeft;
    // getBoundingClientRect reports VISUAL pixels, scrollLeft reports LAYOUT
    // pixels. Those differ whenever an ancestor is scaled — and one is: the
    // product gallery's wrapper carries `.main-img:hover { scale(1.02) }`, so
    // re-measuring while the pointer rests on the gallery would bake a 2%
    // error into every target. Normalise by the live scale factor.
    var scale = track.clientWidth ? (rect.width / track.clientWidth) : 1;
    if (!scale || !isFinite(scale)) scale = 1;
    targets = [];
    for (var i = 0; i < track.children.length; i++) {
      targets.push(sl + (track.children[i].getBoundingClientRect().left - rect.left) / scale);
    }
  }

  function current() {
    if (!targets.length) return 0;
    // Resting at the scroll limit always means the last slide, even when its
    // own left edge sits past that limit (several cards per view).
    if (track.scrollLeft >= maxScroll() - 1) return targets.length - 1;
    var best = 0, bestD = Infinity;
    for (var i = 0; i < targets.length; i++) {
      var d = Math.abs(targets[i] - track.scrollLeft);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function goTo(i, instant) {
    if (!targets.length) return;
    i = Math.max(0, Math.min(i, targets.length - 1));
    var left = Math.max(0, Math.min(targets[i], maxScroll()));
    track.scrollTo({ left: left, behavior: (instant || reduce) ? 'auto' : 'smooth' });
  }

  // Arrow disabled state is driven by the SCROLL POSITION, not by a counted
  // index — that is what stops the next arrow staying enabled with nothing
  // left to reveal once several cards share a view.
  function sync() {
    var atStart = track.scrollLeft <= 1;
    var atEnd = track.scrollLeft >= maxScroll() - 1;
    // A track that cannot scroll at all (every slide already fits the view)
    // would otherwise sit under two permanently dimmed
    // arrows. Take them out of the layout and the tab order entirely instead;
    // they come back the moment a resize makes the track overflow again.
    var idle = maxScroll() <= 1;
    if (prev) prev.hidden = idle;
    if (next) next.hidden = idle;
    if (prev) prev.classList.toggle('disabled', atStart);
    if (next) next.classList.toggle('disabled', atEnd);
    var c = current();
    if (dots && dots.length) {
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('active', i === c);
    }
    warm(c);
  }

  // Pull the slides on either side of the current one out of the lazy queue
  // as soon as it becomes current, so the NEXT swipe shows a decoded photo
  // instead of an empty box that fills a moment later.
  //
  // A lazy image inside a horizontally scrolling track is only fetched once
  // it is near the scrollport, which on a fast flick is too late — that is
  // the pop-in. Flipping loading to "eager" starts the fetch immediately
  // (per spec, an image whose load was deferred begins loading the moment
  // the attribute stops being "lazy"), and each slide is only ever promoted
  // once, so this stays a no-op after the first pass over the gallery.
  //
  // Deliberately a WINDOW, not the whole track: the LED collar's gallery is
  // 13 slides, and fetching all of them on every product view is the bytes
  // this lazy-loading was added to save.
  function warm(c) {
    for (var i = c - 1; i <= c + 2; i++) {
      if (i < 0 || i >= track.children.length) continue;
      var img = track.children[i].querySelector ? track.children[i].querySelector('img[loading="lazy"]') : null;
      if (img) img.loading = 'eager';
    }
  }

  var opts = { passive: true, signal: signal };
  var ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; sync(); });
  }, opts);

  // Step to the next/previous SNAP POINT rather than to current()+-1. Once
  // several cards share a view the last few slide positions all sit past the
  // scroll limit, so index arithmetic would clamp to the same place and the
  // arrow would appear dead — that is exactly what left the desktop Best
  // Sellers track stuck at its end, unable to walk back.
  function nextIndex() {
    for (var i = 0; i < targets.length; i++) if (targets[i] > track.scrollLeft + 1) return i;
    return targets.length - 1;
  }
  function prevIndex() {
    for (var i = targets.length - 1; i >= 0; i--) if (targets[i] < track.scrollLeft - 1) return i;
    return 0;
  }

  if (prev) prev.addEventListener('click', function () { goTo(prevIndex()); }, { signal: signal });
  if (next) next.addEventListener('click', function () { goTo(nextIndex()); }, { signal: signal });

  if (dots && dots.length) {
    for (var d = 0; d < dots.length; d++) {
      (function (i) {
        dots[i].addEventListener('click', function () { goTo(i); }, { signal: signal });
      })(d);
    }
  }

  window.addEventListener('resize', function () { measure(); sync(); }, opts);
  // Slide widths here are percentage-based and do not wait on images, but a
  // late web font or a scrollbar appearing can still shift them.
  window.addEventListener('load', function () { measure(); sync(); }, opts);

  measure();
  sync();
  return { goTo: goTo, measure: measure, sync: sync };
}

function initCarousel(trackId, prevId, nextId) {
  var track = document.getElementById(trackId);
  var prev = document.getElementById(prevId);
  var next = document.getElementById(nextId);
  if (!track || !prev || !next) return;

  // Re-render pages re-run initCarousel on the SAME track element — abort the
  // previous instance's listeners so they never stack up and fight.
  if (track._carouselAbort) track._carouselAbort.abort();
  var ac = new AbortController();
  track._carouselAbort = ac;

  bindCarousel(track, prev, next, null, ac.signal);
}

// Same as initCarousel() above, but also wires a dots row — used by the
// task-133 product-education carousels (Portable Bottles, Wrist Strap, LED
// Gear), which need dots alongside the arrows per the task-88 standard.
function initPcCarousel(trackId, prevId, nextId, dotsId) {
  var track = document.getElementById(trackId);
  var prev = document.getElementById(prevId);
  var next = document.getElementById(nextId);
  var dotsWrap = document.getElementById(dotsId);
  if (!track || !prev || !next) return;

  if (track._carouselAbort) track._carouselAbort.abort();
  var ac = new AbortController();
  track._carouselAbort = ac;

  var dots = dotsWrap ? dotsWrap.querySelectorAll('.pc-dot') : null;
  bindCarousel(track, prev, next, dots, ac.signal);
}

// ==================== DETAIL IMAGE CAROUSEL ====================
// Only rendered when a product has more than one gallery slide for the
// selected color (see renderDetailGallery in products.js) — a single-photo
// product never calls this. renderDetailGallery rebuilds this whole subtree
// on every colour tap, so the track is a fresh element each time and the
// listeners bound here go with the old one.
function initDetailCarousel() {
  var track = document.getElementById('detTrack');
  var prev = document.getElementById('detPrev');
  var next = document.getElementById('detNext');
  var dotsWrap = document.getElementById('detDots');
  if (!track || !prev || !next) return;

  var total = track.children.length;
  // renderDetailGallery() already ships the dots in the markup so the row is
  // never empty for a paint (that emptiness was the colour-tap layout shake).
  // Only build them here if this ran against markup that lacks them, and
  // never rebuild a row that already has the right number — replacing them
  // for nothing would reintroduce the same shrink/re-grow.
  if (dotsWrap && dotsWrap.children.length !== total) {
    dotsWrap.innerHTML = Array.from({ length: total }, function () { return '<span class="det-dot"></span>'; }).join('');
  }
  var dots = dotsWrap ? dotsWrap.querySelectorAll('.det-dot') : [];

  if (track._carouselAbort) track._carouselAbort.abort();
  var ac = new AbortController();
  track._carouselAbort = ac;

  var api = bindCarousel(track, prev, next, dots, ac.signal);
  // A rebuilt gallery always opens on slide 1 (the selected colour's photo) —
  // but only actually scroll if it is not already there. renderDetailGallery
  // replaces this whole subtree, so the fresh track is at 0 already and this
  // call was a programmatic scroll on a `scroll-snap-type: mandatory`
  // container for no reason. That arms a pending snap, and a touch arriving
  // while one is pending is spent resolving it instead of scrolling — the
  // shape of the task-101 report. Belt-and-braces next to the real fix (the
  // gallery hover transform, see .main-img:hover in styles.css); costs a
  // property read and removes a needless poke at the scroller.
  if (track.scrollLeft !== 0) api.goTo(0, true);
}

// ==================== SECTION REVEAL (subtle fade-up on scroll) ====================
// The .reveal class is added by JS, so if anything fails no content is ever hidden.
// A guaranteed fallback timer also un-hides everything, so content can NEVER get stuck invisible.
document.addEventListener('DOMContentLoaded', function() {
  var sel = '.why-section, .mission-section, .reviews-section, .faq-section, .email-section';
  // Only reveal-gate sections that start fully below the fold: a section already
  // partly visible in the first viewport on load would race IntersectionObserver
  // — its first callback isn't synchronous with paint — that race
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

  // Task 133: the five product-education carousels (Portable Bottles,
  // Wrist Strap, LED Gear). No-ops wherever a given id isn't on the current
  // page — initPcCarousel() itself checks for that.
  initPcCarousel('pcBottleTrack', 'pcBottlePrev', 'pcBottleNext', 'pcBottleDots');
  initPcCarousel('pcBowlTrack', 'pcBowlPrev', 'pcBowlNext', 'pcBowlDots');
  initPcCarousel('pcStrapTrack', 'pcStrapPrev', 'pcStrapNext', 'pcStrapDots');
  initPcCarousel('pcCollarTrack', 'pcCollarPrev', 'pcCollarNext', 'pcCollarDots');
  initPcCarousel('pcLeashTrack', 'pcLeashPrev', 'pcLeashNext', 'pcLeashDots');
  renderHomeBundleNotes();
  // Task 135: search's default-state carousel + bundles row — rendered
  // once here (not per open) and present on every page, same as the
  // search view itself.
  renderSearchDefaults();
});

// Task 133: live bundle pricing for the "want both?" blocks under the
// Portable Bottles and LED Gear carousels — reads the same bundleTotals()
// every other bundle price on the site uses, so these numbers can never
// drift from the Bundles page or the product-detail "comes in a bundle" box.
function renderHomeBundleNotes() {
  var notes = [
    { bundleId: 'portable-hydration', elId: 'pbottlesBundlePrice' },
    { bundleId: 'led', elId: 'ledBundlePrice' }
  ];
  notes.forEach(function (n) {
    var el = document.getElementById(n.elId);
    if (!el) return;
    var b = BUNDLES.find(function (x) { return x.id === n.bundleId; });
    if (!b) return;
    var t = bundleTotals(b);
    el.innerHTML = 'Bought separately $' + t.separately.toFixed(2) + ' — bundled <strong>$' + t.bundle.toFixed(2) + '</strong>, you save $' + t.save.toFixed(2) + ' (' + b.pct + '% off).';
  });
}

// ==================== LIFESTYLE IMAGE FADE-IN ====================
// Marks each large lifestyle/background photo (see .lifestyle-img in
// styles.css) ready once it's actually decoded, triggering its CSS fade
// instead of an abrupt shimmer-to-photo cut. A hard fallback timer
// guarantees an image can never get stuck invisible even if load/error
// somehow never fires — same safety-net philosophy as the reveal observer.
document.addEventListener('DOMContentLoaded', function() {
  // Keeps the 10% off panels showing whatever DISCOUNT_CODE actually is.
  if (typeof syncDiscountCodeText === 'function') syncDiscountCodeText();

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

// ==================== PHOTO LOCK (task 97) ====================
// Backup for the CSS in styles.css (search: PHOTO LOCK). The callout/select
// properties are the whole answer on iOS and iPadOS, but Android Chrome and
// desktop browsers raise a real `contextmenu` event on a long-press or a
// right-click regardless of them, so the event itself has to be refused.
//
// Delegated on the document rather than bound per image, because almost
// every photo on this site is written into the page later — product grids,
// the detail gallery, blog cards, the popups — and a
// listener attached at load time would miss all of them.
//
// Capture phase so a component that stops propagation on its own container
// can't punch a hole in this, and scoped to the photo itself: a right-click
// on text, a link or a form field still gets its normal menu (copy, paste,
// open in new tab), which is what "don't break normal interactions" means.
(function () {
  function isPhoto(el) {
    return el && typeof el.closest === 'function' && el.closest('img, picture, svg');
  }

  document.addEventListener('contextmenu', function (e) {
    if (isPhoto(e.target)) e.preventDefault();
  }, true);

  // A mouse drag off an image saves/copies the file just as readily as the
  // menu does, and it is the one route the touch-callout rule says nothing
  // about. The carousels swipe on scroll, never on HTML drag-and-drop, so
  // nothing on the site depends on this event firing.
  document.addEventListener('dragstart', function (e) {
    if (isPhoto(e.target)) e.preventDefault();
  }, true);
})();

// ==================== 10% OFF POPUP ====================
function offerIsOpen() {
  var popup = document.getElementById('offerPopup');
  return !!(popup && popup.classList.contains('active'));
}

function dismissOffer() {
  var overlay = document.getElementById('offerOverlay');
  var popup = document.getElementById('offerPopup');
  if (!overlay || !popup) return;
  // Read BEFORE removing: dismissOffer() is also called defensively on every
  // `pageshow` and whenever the offline screen comes up (see those call
  // sites), specifically because it's supposed to be a harmless no-op when
  // the popup was never open. Without this check every fresh page load would
  // "dismiss" an already-closed popup and pop the side tab up unprompted.
  var wasOpen = popup.classList.contains('active');
  overlay.classList.remove('active');
  popup.classList.remove('active');
  syncOverlayChrome();
  // task 122: collapse into the side tab instead of vanishing outright — but
  // ONLY when an actually-open popup just got dismissed without a claim.
  // dismissOffer() is also what the post-success "Continue Shopping" button
  // calls; by the time that fires, showOfferResult() has already run
  // markOfferClaimed(), so offerAlreadyClaimed() is true there too and the
  // tab correctly never shows.
  if (wasOpen && !offerAlreadyClaimed()) showOfferSideTab();
}

// ── GET 10% OFF SIDE TAB (task 122) ───────────────────────────────────
// A low-friction way back into the offer after a visitor closes the popup
// without submitting an email, instead of it just disappearing with no
// trace. Pure in-memory UI state, same as the popup's own "shown this visit"
// flag — nothing here is written to storage, and nothing needs to be: once
// claimed, markOfferClaimed()'s permanent flag hides it right alongside
// everything else offer-related, and a fresh visit just runs the normal
// popup flow again from the top.
function showOfferSideTab() {
  if (offerAlreadyClaimed()) return; // safety net; see markOfferClaimed()
  var tab = document.getElementById('offerSideTab');
  if (tab) tab.classList.add('show');
}

function hideOfferSideTab() {
  var tab = document.getElementById('offerSideTab');
  if (tab) tab.classList.remove('show');
}

// The tab's own small X — dismisses just the tab, same as closing the popup
// did, without reopening anything.
function dismissOfferSideTab() {
  hideOfferSideTab();
}

// Tapping the tab's label reopens the full popup. The popup's open/close
// listeners (overlay click, #offerClose, Escape) were already bound the
// first time reveal() (below) showed it — showOfferSideTab() only ever runs
// after that has happened at least once — so this just re-triggers the same
// show animation rather than re-binding anything.
function reopenOfferFromTab() {
  hideOfferSideTab();
  var overlay = document.getElementById('offerOverlay');
  var popup = document.getElementById('offerPopup');
  if (!overlay || !popup) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('active');
      popup.classList.add('active');
      syncOverlayChrome();
    });
  });
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
  var prevOfferHtml = setBtnBusy(btn, 'Signing you up…');

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
    clearBtnBusy(btn, prevOfferHtml);
    showOfferError((data && data.error) || 'Something went wrong — please try again.');
  } catch (err) {
    clearBtnBusy(btn, prevOfferHtml);
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

  // The ONE thing that retires the popup on this device — reaching here means
  // /api/customer returned ok. Both outcomes flag it: the "already used"
  // visitor gave a real address and has had their answer, so continuing to ask
  // them on every page would be nuisance, not marketing. No expiry is written
  // anywhere; the flag is permanent. markOfferClaimed() no-ops under
  // ?offer=always so reviewing the popup never retires the reviewer's browser.
  markOfferClaimed();
}

// Shared by both places a code is shown: the popup (default ids) and the home
// page's 10% off box, which passes its own.
function copyOfferCode(codeElId, btnElId) {
  var codeEl = document.getElementById(codeElId || 'offerCode');
  var code = codeEl ? codeEl.textContent.trim() : DISCOUNT_CODE;
  var btn = document.getElementById(btnElId || 'offerCopyBtn');
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

// ── OFFER CLAIM STATE (shared by BOTH entry points) ───────────
// One flag, one meaning: this device has actually handed over an email
// address. Nothing else retires the popup — not seeing it, not timing out,
// not closing it. Set by the popup's own form AND by the 10% off box on the
// home page (submitEmail in products.js), because they are the same action
// and claiming through one must silence the other.
//
// There used to be a second flag, `pawhaul_offer_seen`, written the moment the
// popup appeared. That is what made it show once per device ever; it's gone
// (along with the `?offer=reset` hatch, which existed only to clear it and
// would now be a no-op). Devices still carrying the old flag are simply
// ignored, so they start seeing the popup again — intended.
var OFFER_CLAIMED_KEY = 'pawhaul_offer_claimed';

function offerAlreadyClaimed() {
  if (OFFER_PREVIEW) return false; // review mode never reads the flag
  try { return !!localStorage.getItem(OFFER_CLAIMED_KEY); } catch (e) { return false; }
}

// Called only on a confirmed ok:true from /api/customer. `alreadyExists` still
// counts: that visitor gave a real address and has been told it was already
// used, so asking again on every page would be pure nuisance.
function markOfferClaimed() {
  if (OFFER_PREVIEW) return; // reviewing must never retire the reviewer's browser
  try { localStorage.setItem(OFFER_CLAIMED_KEY, '1'); } catch (e) {}
  // Switches the home page's 10% off box to its "your code" state too,
  // immediately and not just from the next load — claiming through the popup
  // while looking at the home page should not leave a signup form asking for
  // the address they just gave. The section is never hidden: the same class
  // drives the pre-paint swap in <head>, so from here on every visit lands on
  // the standing code panel.
  document.documentElement.classList.add('offer-claimed');
  // Kill any armed timer too, or a submission through the home-page box would
  // still be followed by the popup firing seconds later on this same view.
  if (typeof window.disarmOfferPopup === 'function') window.disarmOfferPopup();
  // task 122: the side tab must disappear the instant the offer is claimed,
  // from either entry point, and never come back — same moment everything
  // else offer-related (the popup, the home page's 10% off box) retires.
  hideOfferSideTab();
}

// Shows ONCE PER VISIT until the visitor actually submits an email: 5s after
// the site loads, or sooner on exit intent (mouse leaving via the top of the
// viewport, the classic "heading for the tab bar" tell).
//
// Two independent layers of suppression, and they are not interchangeable:
//
//  1. THIS VISIT — the in-memory `shownThisVisit` below. Once the popup has
//     appeared, it will not appear again no matter how many pages the visitor
//     navigates to, because SPA navigation doesn't re-arm anything and the
//     variable outlives it. It is deliberately NOT in localStorage or
//     sessionStorage: a plain closure variable dies with the page load, which
//     is exactly the "until the tab is closed or hard-reloaded" boundary. A
//     reload is a new visit and gets a fresh appearance.
//
//  2. FOREVER — the localStorage claim flag (markOfferClaimed above), set only
//     by a real submission through this popup or the home page's 10% off box.
//     It outranks everything: a device that has claimed never sees the popup
//     again, reload or not.
//
// Appearing, timing out and being closed still write nothing permanent.
(function () {
  var TRIGGER_MS = 5000;
  var timer = null;
  var shownThisVisit = false;
  var listening = false;

  function reveal() {
    if (shownThisVisit || offerAlreadyClaimed()) return;

    // This runs from a timer / an exit-intent event, so the popup markup
    // (which sits BELOW app.js's own <script> tag in index.html) is always
    // parsed by now — but resolve it before committing to anything.
    var overlay = document.getElementById('offerOverlay');
    var popup = document.getElementById('offerPopup');
    if (!overlay || !popup) return;

    shownThisVisit = true;
    stopListening();

    // Close controls are bound HERE, not at script-execution time. The popup
    // markup comes after this file's <script> tag, so an early
    // getElementById returned null and the X button and backdrop silently
    // never got a listener — the popup opened with no way to close it except
    // Escape or the two inline-onclick buttons. Bound once and only once,
    // since reveal() can't run twice in a visit (shownThisVisit above).
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

  function stopListening() {
    clearTimeout(timer);
    timer = null;
    if (listening) { document.removeEventListener('mouseleave', exitIntent); listening = false; }
  }

  // Exposed so a claim through the home-page 10% off box can cancel a
  // countdown already running on this visit (see markOfferClaimed).
  window.disarmOfferPopup = stopListening;

  // Armed exactly once, here, for the whole visit. Nothing re-arms it — that's
  // what keeps SPA navigation from starting a fresh countdown on every page.
  if (!offerAlreadyClaimed()) {
    timer = setTimeout(reveal, TRIGGER_MS);
    document.addEventListener('mouseleave', exitIntent);
    listening = true;
  }
})();

// ── CHAT GREETING (task 117, now EVERY VISIT per direct feedback) ──
// A small bubble near the chat icon, scroll-triggered. Used to be once ever
// per device via a permanent localStorage flag; that's gone now — it shows
// on every fresh visit, same trigger as before (scroll past the hero). What
// stays is "once PER VISIT": a plain in-memory flag (not localStorage/
// sessionStorage), same pattern as the offer popup's own shownThisVisit
// below, so scrolling past the threshold, back up, and down again doesn't
// re-trigger it a second time in the same visit — only a fresh page load
// (a real new visit) resets it.
function dismissChatGreeting() {
  var el = document.getElementById('chatGreeting');
  if (!el || !el.classList.contains('show')) return;
  el.classList.add('dismissing');
  setTimeout(function () {
    el.classList.remove('show', 'dismissing');
    el.style.display = 'none';
  }, 200);
}

(function () {
  // Task 119: was a flat 3s-after-load timer, which fired while the visitor
  // was still looking at the hero and sat right over its CTA buttons (the
  // hero fills nearly the whole screen on mobile — task 118). Now it waits
  // for the visitor to actually scroll down a bit, so it only ever appears
  // once the hero's buttons are no longer the thing on screen.
  var SCROLL_THRESHOLD = 150;
  var shownThisVisit = false;

  // The greeting only ever appears on the homepage — checked by the actual
  // page state (not location.pathname), since this is an SPA and the
  // visitor can reach another page without a real navigation/reload.
  function onHome() {
    var el = document.getElementById('page-home');
    return !!el && el.classList.contains('active');
  }

  function reveal() {
    if (chatOpen || shownThisVisit || !onHome()) return;
    // Don't stack on top of the email popup if it happens to be up at the
    // same moment — try again shortly rather than cluttering the screen.
    var offerOverlay = document.getElementById('offerOverlay');
    if (offerOverlay && offerOverlay.classList.contains('active')) {
      setTimeout(reveal, 2000);
      return;
    }
    var el = document.getElementById('chatGreeting');
    if (!el) return;
    shownThisVisit = true;
    el.style.display = 'flex';
    // rAF so the .show transition actually plays instead of starting already-on.
    requestAnimationFrame(function () { el.classList.add('show'); });
  }
  function onScroll() {
    if (window.scrollY < SCROLL_THRESHOLD) return;
    // Only consume this visit's one-shot trigger on the homepage — scrolling
    // past the threshold on another page first (entirely possible: a direct
    // /shop load, for instance) must not permanently use it up before the
    // visitor ever reaches Home.
    if (!onHome()) return;
    window.removeEventListener('scroll', onScroll);
    reveal();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Escape closes whichever overlay is up (search first, then the offer).
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (searchIsOpen()) { closeSearch(); }
  else if (offerIsOpen()) { dismissOffer(); }
});

// ==================== ANALYTICS WRAPPERS ====================
// Applied at the very END of this file, deliberately. Each of these functions
// is already wrapped earlier (page-navigation and product-page hooks), and
// those wrappers set document.title as part of navigating. Wrapping last makes
// these the OUTERMOST layer, so a page_view is sent after the title is
// correct rather than reporting the previous page's title.
//
// All of these are inert while GA4_ID is empty — see the ANALYTICS section in
// index.html and the helpers further up this file.

var _trackOrigShowPage = showPage;
showPage = function (page, opts) {
  _trackOrigShowPage(page, opts);
  trackPageView();
};

var _trackOrigShowProduct = showProduct;
showProduct = function (id, opts) {
  _trackOrigShowProduct(id, opts);
  var p = products.find(function (pr) { return pr.id === id; });
  if (p) {
    var lv = lowestVariant(p);
    trackEvent('view_item', {
      currency: 'USD',
      value: lv.price,
      items: [{ item_id: 'PH-' + p.id, item_name: p.name, price: lv.price }]
    });
  }
  trackPageView();
};

var _trackOrigShowPost = showPost;
showPost = function (slug, opts) {
  var ok = _trackOrigShowPost(slug, opts);
  if (ok) trackPageView();
  return ok;
};

// addToCart(product) takes a fully-resolved item — a copy of the product with
// the chosen variant's price/size/color already merged in (see products.js) —
// so everything the event needs is on the single argument. Wrapping the one
// function covers every entry point: detail page, quick-add, wishlist,
// and the chatbot's tool call.
var _trackOrigAddToCart = addToCart;
addToCart = function (product) {
  var result = _trackOrigAddToCart.apply(this, arguments);
  try {
    if (product) trackAddToCart(product, product.price, product.size, product.color);
  } catch (e) { /* analytics must never be able to break a real add */ }
  return result;
};

// Checkout hand-off to Shopify. This is the last event we can observe — GA4
// cannot follow the visitor onto Shopify's hosted checkout, so purchases are
// NOT tracked here (see MARKETING-SETUP.md for how to close that loop).
if (typeof checkout === 'function') {
  var _trackOrigCheckout = checkout;
  checkout = function () {
    try {
      var items = (typeof cart !== 'undefined' ? cart : []).map(function (i) {
        return {
          item_id: 'PH-' + i.id, item_name: i.name,
          item_variant: [i.size, i.color].filter(Boolean).join(' / ') || undefined,
          price: Number(i.price) || 0, quantity: i.qty || 1
        };
      });
      var value = items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
      trackEvent('begin_checkout', { currency: 'USD', value: Number(value.toFixed(2)), items: items });
    } catch (e) { /* never block checkout */ }
    return _trackOrigCheckout.apply(this, arguments);
  };
}


// ==================== OFFLINE SCREEN (task 81) ====================
// Replaces the browser's own "no internet" page with a branded one, and takes
// itself down the moment the connection is back — no reload, because every
// page of this SPA is already in the DOM behind the screen, exactly where the
// visitor left it.
//
// navigator.onLine alone is not trustworthy in either direction: it reports
// "online" for a laptop on a wifi network with no route to the internet, and
// some browsers are slow to fire `online` when a phone comes off airplane
// mode. So the events are the trigger, and a real HEAD request to this origin
// is the proof — the same signal the new-build check above uses.
(function () {
  var POLL_MS = 5000;      // while the screen is up, keep checking quietly
  var pollTimer = null;
  var probing = false;
  var dismissed = false;   // "Keep browsing anyway" — reset on the next drop

  function el(id) { return document.getElementById(id); }

  function setNote(text) {
    var n = el('offlineNote');
    if (n) n.textContent = text || '';
  }

  function visible() { return offlineIsUp(); }

  function show() {
    var s = el('offlineScreen');
    if (!s || dismissed) return;
    s.classList.add('active');
    s.setAttribute('aria-hidden', 'false');
    try { s.inert = false; } catch (e) {}
    document.documentElement.classList.add('offline-locked');
    setNote('');
    // Anything else that owns the screen would fight this one for it.
    closeMobileMenu();
    closeSearch();
    dismissOffer();
    var btn = el('offlineRetry');
    if (btn) setTimeout(function () { try { btn.focus(); } catch (e) {} }, 60);
    // Fades the floating chat paw out, the same way the search overlay and
    // the offer popup do — the chat needs the network this screen is about.
    syncOverlayChrome();
    startPolling();
  }

  function hide() {
    var s = el('offlineScreen');
    if (!s) return;
    s.classList.remove('active');
    s.setAttribute('aria-hidden', 'true');
    try { s.inert = true; } catch (e) {}
    document.documentElement.classList.remove('offline-locked');
    syncOverlayChrome();
    stopPolling();
  }

  function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(function () {
      if (!visible()) return stopPolling();
      probe().then(function (ok) { if (ok) recovered(); });
    }, POLL_MS);
  }

  function stopPolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  // A HEAD to this origin, cache-busted, with its own timeout so a hung
  // request can't leave the Retry button spinning forever.
  function probe() {
    if (probing) return Promise.resolve(false);
    probing = true;
    var done = false;
    return new Promise(function (resolve) {
      var finish = function (ok) {
        if (done) return;
        done = true; probing = false;
        resolve(ok);
      };
      setTimeout(function () { finish(false); }, 6000);
      fetch('/?ping=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
        .then(function (r) { finish(!!r && r.ok); })
        .catch(function () { finish(false); });
    });
  }

  function recovered() {
    if (!visible()) return;
    hide();
    dismissed = false;
    if (typeof showToast === 'function') showToast("You're back online.");
  }

  // Pressed by the visitor. The paw loader goes into the button itself, so the
  // site's one loading visual covers this wait too.
  window.retryConnection = function () {
    var btn = el('offlineRetry');
    if (!btn || btn.disabled) return;
    setNote('');
    var prev = setBtnBusy(btn, 'Checking…');
    probe().then(function (ok) {
      if (ok) { clearBtnBusy(btn, prev); recovered(); return; }
      clearBtnBusy(btn, prev);
      setNote("Still nothing — we'll keep trying.");
    });
  };

  window.dismissOffline = function () {
    dismissed = true;
    hide();
  };

  window.addEventListener('offline', function () { dismissed = false; show(); });
  window.addEventListener('online', function () {
    // Trust but verify: `online` can fire before the connection actually
    // carries traffic, so only the probe takes the screen down.
    probe().then(function (ok) { if (ok) recovered(); else if (!dismissed) show(); });
  });

  // A tab that was backgrounded through an outage comes back needing an answer.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || !visible()) return;
    probe().then(function (ok) { if (ok) recovered(); });
  });

  // Loaded while already offline (a bfcache restore, or the SPA shell served
  // from disk cache).
  if (navigator.onLine === false) show();
})();
