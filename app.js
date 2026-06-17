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

function addMsg(text, isUser) {
  var msgs = document.getElementById('chatMessages');
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;align-items:flex-start;' + (isUser ? 'flex-direction:row-reverse;' : '');

  var av = document.createElement('div');
  av.style.cssText = 'width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;font-weight:800;' + (isUser ? 'background:#1a1a2e;color:white;' : 'background:#E8630A;color:white;');
  av.textContent = isUser ? 'You' : String.fromCodePoint(128062);

  var bub = document.createElement('div');
  bub.style.cssText = 'padding:9px 13px;max-width:210px;font-size:13px;font-weight:600;line-height:1.5;' + (isUser ? 'background:#E8630A;color:white;border-radius:14px 14px 4px 14px;' : 'background:white;color:#1a1a2e;border-radius:14px 14px 14px 4px;box-shadow:0 2px 8px rgba(0,0,0,0.06);');
  bub.textContent = text;

  row.appendChild(av);
  row.appendChild(bub);
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}



// ── AI CHATBOT (Groq llama3-8b-8192 via /api/chat serverless proxy) ──
// No API key lives in this file. The browser calls our own /api/chat
// endpoint, which adds the system prompt + key server-side and talks to
// Groq. Replaces the old keyword chatbot entirely.
var chatHistory = [];
var CHAT_FALLBACK = "Woof, my brain just hiccuped! 🐾 Please email pawhaulsupport@gmail.com and a real human will get back to you within 24 hours.";

async function sendChatToAI(userMessage) {
  try {
    chatHistory.push({ role: "user", content: userMessage });
    var response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });
    if (!response.ok) { chatHistory.pop(); return null; }
    var data = await response.json();
    var reply = data && data.reply ? String(data.reply).trim() : "";
    if (!reply) { chatHistory.pop(); return null; }
    chatHistory.push({ role: "assistant", content: reply });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    return reply;
  } catch (e) {
    chatHistory.pop();
    return null;
  }
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
  typing.innerHTML = "<div style='width:30px;height:30px;border-radius:50%;background:#E8630A;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='16' height='16' fill='white'><ellipse cx='50' cy='67' rx='20' ry='16'/><ellipse cx='27' cy='47' rx='9' ry='12'/><ellipse cx='42' cy='35' rx='9' ry='12'/><ellipse cx='58' cy='35' rx='9' ry='12'/><ellipse cx='73' cy='47' rx='9' ry='12'/></svg></div><div style='background:white;border-radius:14px;padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;gap:4px;align-items:center;'><span style='width:7px;height:7px;background:#ddd;border-radius:50%;display:inline-block;animation:bounce 1s infinite 0s'></span><span style='width:7px;height:7px;background:#ddd;border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.2s'></span><span style='width:7px;height:7px;background:#ddd;border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.4s'></span></div>";
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

// ── BUNDLE SUGGESTION ─────────────────────────────────────────
var bundleMap = {
  1: [2, 3],    // Walk Kit → suggest Leash + Bowl
  2: [1, 5],    // Leash → suggest Walk Kit + Running Leash
  3: [1, 2],    // Bowl → suggest Walk Kit + Leash
  4: [6, 1],    // AirTag → suggest Collar + Walk Kit
  5: [1, 2],    // Running Leash → suggest Walk Kit + Leash
  6: [4, 2],    // Collar → suggest AirTag + Leash
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
    total += p.price;
    var isMain = bid === productId;
    var imgContent = p.image ? ('<img src="' + p.image + '" alt="' + p.name + '" style="width:36px;height:36px;object-fit:cover;border-radius:8px;">') : ('<span style="font-size:28px;">' + p.emoji + '</span>');
    html += '<div style="display:flex;align-items:center;gap:12px;background:white;padding:10px 14px;border-radius:10px;">' +
      imgContent +
      '<div style="flex:1;">' +
        '<div style="font-weight:800;font-size:13px;line-height:1.4;">' + p.name +
          (isMain ? ' <span style="background:var(--orange);color:white;font-size:10px;padding:2px 7px;border-radius:50px;white-space:nowrap;">This Item</span>' : '') +
        '</div>' +
        '<div style="color:var(--orange);font-weight:800;font-size:13px;">$' + p.price.toFixed(2) + '</div>' +
      '</div>' +
      '<span style="color:var(--green);font-size:14px;font-weight:900;">&#10003;</span>' +
    '</div>';
  });

  html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-top:2px dashed #F0F0F0;margin-top:4px;">' +
    '<span style="font-weight:800;font-size:14px;">Bundle Total</span>' +
    '<span style="font-family:Fredoka One,cursive;font-size:20px;color:var(--orange);">$' + total.toFixed(2) + '</span>' +
  '</div>';

  bundleItems.innerHTML = html;
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
    if (!alreadyInCart) { cart.push({ ...p, qty: 1 }); }
  });

  updateCartCount();
  showToast('🐾 Bundle added to cart!');
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

// ==================== SEARCH ====================
function toggleSearch() {
  var bar = document.getElementById('navSearchBar');
  if (!bar) return;
  if (bar.classList.contains('open')) {
    closeSearch();
  } else {
    bar.classList.add('open');
    closeMobileMenu();
    setTimeout(function() {
      var inp = document.getElementById('navSearchInput');
      if (inp) inp.focus();
    }, 80);
  }
}

function closeSearch() {
  var bar = document.getElementById('navSearchBar');
  if (!bar) return;
  bar.classList.remove('open');
  var inp = document.getElementById('navSearchInput');
  if (inp) inp.value = '';
  var res = document.getElementById('searchResults');
  if (res) res.innerHTML = '';
}

function doSearch(val) {
  var res = document.getElementById('searchResults');
  if (!res) return;
  var q = (val || '').trim().toLowerCase();
  if (!q) { res.innerHTML = ''; return; }
  // Search is restricted to the 8 PawHaul products, matched by product name only.
  var list = (typeof products !== 'undefined') ? products : [];
  var matches = list.filter(function(p) {
    return p.name.toLowerCase().indexOf(q) !== -1;
  });
  if (matches.length === 0) {
    res.innerHTML = '<div class="search-no-results">No results found.</div>';
    return;
  }
  res.innerHTML = matches.map(function(p) {
    return '<div class="search-result-item" onclick="goToProduct(' + p.id + ')">' +
      '<span class="search-result-emoji">' + p.emoji + '</span>' +
      '<div class="search-result-info">' +
        '<div class="search-result-name">' + p.name + '</div>' +
        '<div class="search-result-price">$' + p.price.toFixed(2) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

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
  function maxScroll() { return Math.max(0, (count() - 1) * step()); }

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
    idx = Math.max(0, Math.min(n, count() - 1));
    var target = idx * step();
    if (instant) { track.scrollLeft = target; } else { smoothTo(target); }
    prev.classList.toggle('disabled', idx === 0);
    next.classList.toggle('disabled', idx >= count() - 1);
  }

  prev.addEventListener('click', function() { goTo(idx - 1); });
  next.addEventListener('click', function() { goTo(idx + 1); });

  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', function(e) {
    var raw = touchStartLeft + (touchStartX - e.touches[0].clientX);
    track.scrollLeft = Math.max(0, Math.min(raw, maxScroll()));
  }, { passive: true });

  track.addEventListener('touchend', function(e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 30) {
      goTo(idx + (delta > 0 ? 1 : -1));
    } else {
      goTo(idx);
    }
  }, { passive: true });

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
  var touchStartLeft = 0;
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
    touchStartLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var raw = touchStartLeft + (touchStartX - e.touches[0].clientX);
    track.scrollLeft = Math.max(0, Math.min(raw, maxScroll()));
  }, { passive: false });

  track.addEventListener('touchend', function(e) {
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
  var els = document.querySelectorAll(sel);
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
});

// ==================== 10% OFF POPUP ====================
function dismissOffer() {
  var overlay = document.getElementById('offerOverlay');
  var popup = document.getElementById('offerPopup');
  if (!overlay || !popup) return;
  overlay.classList.remove('active');
  popup.classList.remove('active');
}

function handleOfferSubmit(e) {
  e.preventDefault();
  dismissOffer();
}

setTimeout(function() {
  var overlay = document.getElementById('offerOverlay');
  var popup = document.getElementById('offerPopup');
  if (!overlay || !popup) return;
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      overlay.classList.add('active');
      popup.classList.add('active');
    });
  });
  document.getElementById('offerClose').addEventListener('click', dismissOffer);
  overlay.addEventListener('click', dismissOffer);
}, 10000);
