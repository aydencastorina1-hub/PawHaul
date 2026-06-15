// ==================== DATA ====================
var products = [
  {
    id: 1, name: "PawHaul Walk Kit 2-in-1", price: 24.99, was: 34.99, emoji: "🧴", image: "", category: "water",
    badge: "🔥 Best Seller", badgeClass: "", reviews: 127,
    desc: "The ultimate walk companion. One bottle that carries both fresh water AND dry food for your dog — grab one thing and walk out the door. The water side features a leak-proof flip-out drinking bowl, and the sealed food compartment keeps kibble or treats fresh for hours. Lightweight enough to clip to any bag or belt. Perfect for walks, hikes, road trips, and every adventure.",
    sizes: ["350ml / 12oz", "550ml / 18oz"],
    colors: ["Pink", "Blue", "White"],
    features: [
      "100% leak-proof water compartment",
      "Separate sealed food & treat storage",
      "Flip-out silicone drinking bowl",
      "BPA-free food-grade materials throughout",
      "Carabiner clip included — attaches to any bag",
      "Lightweight: under 200g empty",
      "One-hand pour and lock operation",
      "Easy to clean — all parts detach"
    ],
    material: "BPA-free food-grade plastic body · Food-safe silicone flip bowl · Stainless steel locking cap",
    whatsInBox: "1× Walk Kit 2-in-1 bottle · 1× carabiner clip · 1× cleaning brush"
  },
  {
    id: 2, name: "Leash With Poop Bag Dispenser", price: 19.99, was: 27.99, emoji: "🦮", image: "", category: "leash",
    badge: "⭐ New", badgeClass: "badge-new", reviews: 84,
    desc: "A full-featured dog leash with a poop bag dispenser built right into the handle — so you never leave home without bags again. No separate clip-ons, no fumbling. Pull a bag, do the job, keep walking. The 360° reflective stitching keeps you both visible on early morning and evening walks, and the padded handle makes long walks comfortable.",
    sizes: ["4ft / Standard", "5ft / Heavy Duty"],
    colors: ["Black", "Blue", "Pink"],
    features: [
      "Built-in poop bag dispenser at the handle",
      "Comes with 1 starter roll of bags (15 bags)",
      "360° reflective stitching for night safety",
      "Padded non-slip comfort grip handle",
      "Heavy-duty nylon webbing construction",
      "Secure stainless steel D-ring clip",
      "Fits all dog sizes — small to XL",
      "Easy-load dispenser refills any standard roll"
    ],
    material: "Heavy-duty nylon webbing · TPU padded handle grip · Stainless steel hardware",
    whatsInBox: "1× leash with built-in dispenser · 1× starter roll of poop bags (15 bags)"
  },
  {
    id: 3, name: "Collapsible Travel Bowl", price: 12.99, was: 17.99, emoji: "🥣", image: "", category: "water",
    badge: "💧 Popular", badgeClass: "badge-popular", reviews: 91,
    desc: "A food-grade silicone bowl that folds completely flat and fits in any pocket or bag. Pop it open in seconds when your dog needs water or food on the go. The included carabiner clip keeps it attached to your bag so you never leave it behind. Works for water and food — dishwasher safe and built to last.",
    sizes: ["Small — 350ml / 12oz", "Large — 700ml / 24oz"],
    colors: ["Orange", "Blue", "Green"],
    features: [
      "Folds flat to under 2cm — fits any pocket",
      "100% food-grade BPA-free silicone",
      "Dishwasher safe — top rack",
      "Non-slip base keeps it steady when open",
      "Carabiner clip included",
      "Lightweight: under 60g",
      "Works for both water and dry food",
      "Heat resistant up to 200°C / 392°F"
    ],
    material: "100% food-grade BPA-free silicone · Stainless steel carabiner clip",
    whatsInBox: "1× collapsible silicone bowl · 1× stainless steel carabiner clip"
  },
  {
    id: 4, name: "AirTag Dog Tag Holder", price: 14.99, was: 19.99, emoji: "📍", image: "", category: "safety",
    badge: "🔒 Safety", badgeClass: "badge-safety", reviews: 38,
    desc: "A secure waterproof silicone holder that keeps your Apple AirTag attached to your dog's collar at all times — so you always know where they are. The twist-lock closure holds the AirTag firmly in place through daily walks, rain, mud, and rough play. Compatible with Apple AirTag 1st and 2nd generation. Fits any standard collar up to 1.5\" wide.",
    sizes: ["Universal — fits all standard collars"],
    colors: ["Black", "Orange", "Pink"],
    features: [
      "Compatible with Apple AirTag 1st & 2nd gen",
      "Attaches securely to any collar up to 1.5\" wide",
      "100% waterproof premium silicone",
      "Twist-lock closure — won't pop off during play",
      "Does not interfere with AirTag signal",
      "Lightweight: under 15g",
      "Built for daily wear — UV and weather resistant",
      "Easy to transfer between collars"
    ],
    material: "Premium waterproof food-grade silicone · Stainless steel locking ring",
    whatsInBox: "1× AirTag silicone collar holder (Apple AirTag not included)"
  },
  {
    id: 5, name: "Hands-Free Running Leash", price: 22.99, was: 29.99, emoji: "🏃", image: "", category: "leash",
    badge: "🏃 Active", badgeClass: "badge-active", reviews: 55,
    desc: "Run, jog, hike, or walk completely hands-free. The padded adjustable waist belt sits comfortably at your hips and the bungee section absorbs your dog's sudden lunges so you never lose your stride. Built-in zip pocket keeps your phone safe, and the side holder fits most water bottles. The quick-release buckle lets you detach instantly if needed.",
    sizes: ["One Size — waist 28\" to 48\""],
    colors: ["Black", "Orange", "Blue"],
    features: [
      "Fully hands-free — clips around your waist",
      "Bungee cord absorbs sudden pulls and lunges",
      "Padded neoprene waist belt — fits 28\" to 48\"",
      "Built-in zip phone pocket fits most phones",
      "Side water bottle holder included",
      "360° reflective accents for low-light safety",
      "Quick-release safety buckle",
      "Connects to collar or harness D-ring"
    ],
    material: "Neoprene padded waist belt · Elastic bungee cord · Heavy-duty nylon leash attachment",
    whatsInBox: "1× waist belt · 1× bungee leash tether · 1× poop bag holder attachment"
  },
  {
    id: 6, name: "Reflective Safety Collar", price: 16.99, was: 21.99, emoji: "✨", image: "", category: "safety",
    badge: "🌙 Night Safety", badgeClass: "badge-night", reviews: 62,
    desc: "A tough everyday collar with 360° reflective strips that make your dog visible from up to 500ft in the dark — perfect for early morning walks, evening runs, and everything in between. Built from heavy-duty nylon that holds up through rain, mud, and daily wear. The quick-release buckle makes it easy on and off, and the padded inner lining keeps your dog comfortable all day.",
    sizes: ["S — neck 8\"–12\"", "M — neck 12\"–16\"", "L — neck 16\"–20\"", "XL — neck 20\"–26\""],
    colors: ["Orange", "Blue", "Pink", "Black"],
    features: [
      "360° reflective strips — visible up to 500ft away",
      "Heavy-duty nylon webbing — built for daily wear",
      "Quick-release safety buckle",
      "Padded soft inner lining for all-day comfort",
      "Adjustable fit with secure slide buckle",
      "Stainless steel D-ring for leash attachment",
      "All-weather and waterproof — hose it clean",
      "Available in 4 sizes and 4 colors"
    ],
    material: "Heavy-duty nylon webbing with reflective threading · Stainless steel D-ring · Quick-release plastic buckle · Soft padded lining",
    whatsInBox: "1× reflective safety collar"
  }
];

// ==================== EMAILJS CONFIG ====================
// Step 1: Sign up free at emailjs.com
// Step 2: Add a Gmail service, copy the Service ID below
// Step 3: Create two templates (see instructions), copy their IDs below
// Step 4: Go to Account > API Keys, copy your Public Key below
var EMAILJS_PUBLIC_KEY    = 'Ejew9NO0SiQgXbDAU';
var EMAILJS_SERVICE_ID    = 'service_qqcrtoe';
var EMAILJS_CONTACT_TEMPLATE = 'template_t5ark9a';
var EMAILJS_WELCOME_TEMPLATE = ''; // e.g. 'template_yyyyyy'  (10% off -> customer)
var DISCOUNT_CODE = 'PAWHAUL10';   // Your 10% off code (change this anytime)

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// ==================== CART STATE ====================
var cart = [];
var currentProduct = null;
var currentQty = 1;

// ==================== NAVIGATION ====================
function showPage(page, filter) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  // Use instant so smooth-scroll CSS doesn't animate page transitions
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);

  if (page === 'home') renderHomeProducts();
  if (page === 'shop') {
    var f = filter || 'all';
    renderShopProducts(f);
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    var map = { all: 0, water: 1, leash: 2, safety: 3 };
    var idx = map[f];
    if (idx !== undefined) {
      var btns = document.querySelectorAll('.filter-btn');
      if (btns[idx]) btns[idx].classList.add('active');
    }
  }
  if (page === 'cart') renderCart();
  if (page === 'wishlist') renderWishlist();
  // Snap to top after render, then restore smooth scrolling for user swipes
  requestAnimationFrame(function() {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  });
}

// ==================== RENDER PRODUCTS ====================
function renderHomeProducts() {
  var container = document.getElementById('homeProducts');
  var featured = products.slice(0, 4);
  container.innerHTML = featured.map(p => productCard(p)).join('');
  setTimeout(function() { if (typeof initCarousel === 'function') initCarousel('homeProducts', 'prodCarouselPrev', 'prodCarouselNext'); }, 50);
}

function renderShopProducts(filter) {
  var container = document.getElementById('shopProducts');
  if (!container) return;
  var f = filter || 'all';
  var filtered = (f === 'all') ? products.slice() : products.filter(function(p) { return p.category === f; });
  container.innerHTML = filtered.map(function(p) { return productCard(p); }).join('');
}

function productCard(p) {
  var imgContent = p.image
    ? `<img src="${p.image}" alt="${p.name}">`
    : p.emoji;
  return `
    <div class="product-card" id="prodcard-${p.id}" onclick="showProduct(${p.id})">
      <div class="product-img-wrap">
        <div class="product-img">${imgContent}</div>
        <div class="product-badge ${p.badgeClass||''}">${p.badge}</div>
        <button class="wishlist-btn" onclick="event.stopPropagation(); wishlist(${p.id})">${wishlistItems.some(function(w){return w.id===p.id}) ? String.fromCodePoint(10084,65039) : String.fromCodePoint(129293)}</button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-stars">⭐⭐⭐⭐⭐ <span>(${p.reviews} reviews)</span></div>
        <div class="product-price">
          <span class="price-now">$${p.price.toFixed(2)}</span>
          ${p.was ? `<span class="price-was">$${p.was.toFixed(2)}</span>` : ''}
        </div>
        <button class="btn-black" onclick="event.stopPropagation(); quickAdd(${p.id})">Add To Cart 🛒</button>
      </div>
    </div>
  `;
}

// ==================== PRODUCT DETAIL ====================
function showProduct(id) {
  currentProduct = products.find(p => p.id === id);
  currentQty = 1;
  if (!currentProduct) return;

  var detailImg = document.getElementById('detailImg');
  var slideHtml = currentProduct.image
    ? '<img src="' + currentProduct.image + '" alt="' + currentProduct.name + '">'
    : '<span style="font-size:110px;line-height:1">' + currentProduct.emoji + '</span>';
  detailImg.innerHTML =
    '<div class="det-carousel">' +
      '<div class="det-track" id="detTrack">' +
        '<div class="det-slide">' + slideHtml + '</div>' +
        '<div class="det-slide">' + slideHtml + '</div>' +
        '<div class="det-slide">' + slideHtml + '</div>' +
      '</div>' +
      '<button class="det-prev" id="detPrev" aria-label="Previous">&#8249;</button>' +
      '<button class="det-next" id="detNext" aria-label="Next">&#8250;</button>' +
      '<div class="det-dots" id="detDots">' +
        '<span class="det-dot active"></span>' +
        '<span class="det-dot"></span>' +
        '<span class="det-dot"></span>' +
      '</div>' +
    '</div>';
  setTimeout(function() { if (typeof initDetailCarousel === 'function') initDetailCarousel(); }, 30);
  document.getElementById('detailName').textContent = currentProduct.name;
  document.getElementById('detailPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
  document.getElementById('detailWas').textContent = currentProduct.was ? `$${currentProduct.was.toFixed(2)}` : '';
  document.getElementById('detailDesc').textContent = currentProduct.desc;
  document.getElementById('detailReviews').textContent = `(${currentProduct.reviews} reviews)`;
  document.getElementById('qtyNum').textContent = '1';

  var cats = { walk: 'Walk Essentials', car: 'Car & Travel', treats: 'Health & Treats', home: 'Home & Grooming' };
  document.getElementById('detailCategory').textContent = cats[currentProduct.category] || 'PawHaul';

  document.getElementById('detailSizes').innerHTML = currentProduct.sizes.map((s, i) =>
    `<button class="option-btn ${i===0?'active':''}" onclick="selectOption(this)">${s}</button>`).join('');

  document.getElementById('detailColors').innerHTML = currentProduct.colors.map((c, i) =>
    `<button class="option-btn ${i===0?'active':''}" onclick="selectOption(this)">${c}</button>`).join('');

  document.getElementById('detailFeatures').innerHTML = currentProduct.features.map(f =>
    `<li>${f}</li>`).join('');

  var matEl = document.getElementById('detailMaterial');
  if (matEl) matEl.textContent = currentProduct.material || '';
  var boxEl = document.getElementById('detailBox');
  if (boxEl) boxEl.textContent = currentProduct.whatsInBox || '';

  var saveEl = document.querySelector('.save');
  if (saveEl && currentProduct.was) {
    var savePct = Math.round((1 - currentProduct.price / currentProduct.was) * 100);
    saveEl.textContent = 'Save ' + savePct + '%';
    saveEl.style.display = '';
  } else if (saveEl) {
    saveEl.style.display = 'none';
  }

  var thumbContent = currentProduct.image
    ? `<img src="${currentProduct.image}" alt="${currentProduct.name}">`
    : currentProduct.emoji;
  document.getElementById('detailThumbs').innerHTML = [0,1,2,3].map((i) =>
    `<div class="thumb ${i===0?'active':''}" onclick="selectThumb(this)">${thumbContent}</div>`).join('');

  showPage('product');
}

function selectOption(btn) {
  btn.closest('.options-row').querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectThumb(thumb) {
  thumb.closest('.thumb-row').querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('qtyNum').textContent = currentQty;
}

function addToCartDetail() {
  if (!currentProduct) return;
  for (var i = 0; i < currentQty; i++) addToCart(currentProduct);
}

function buyNow() {
  addToCartDetail();
  showPage('cart');
}

// ==================== CART ====================
function addToCart(product) {
  var existing = cart.find(item => item.id === product.id);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, qty: 1 }); }
  updateCartCount();
  showToast(`🐾 ${product.name} added to cart!`);
}

function quickAdd(id) {
  var product = products.find(p => p.id === id);
  if (product) addToCart(product);
}

var wishlistItems = [];
var currentShopFilter = 'all';

function wishlist(id) {
  var product = products.find(function(p) { return p.id === id; });
  if (!product) return;
  var existingIdx = -1;
  for (var i = 0; i < wishlistItems.length; i++) { if (wishlistItems[i].id === id) { existingIdx = i; break; } }
  if (existingIdx > -1) {
    wishlistItems.splice(existingIdx, 1);
    showToast('Removed from wishlist');
  } else {
    wishlistItems.push(product);
    showToast('Added to wishlist!');
  }
  updateWishlistCount();
  renderHomeProducts();
  renderShopProducts(currentShopFilter);
}

function updateWishlistCount() {
  var count = wishlistItems.length;
  var badge = document.getElementById('wishlistCount');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
  var menuBadge = document.getElementById('menuWishlistCount');
  if (menuBadge) { menuBadge.textContent = count; menuBadge.style.display = count > 0 ? 'flex' : 'none'; }
}

function renderWishlist() {
  var container = document.getElementById('wishlistContent');
  if (!container) return;
  if (wishlistItems.length === 0) {
    container.innerHTML = '<div class="empty-cart"><span class="empty-icon">🐾</span><h2>Your pup\'s missing out!</h2><p>Heart any product to save it here</p><button class="btn-primary" onclick="showPage(\'shop\')">Browse Products</button></div>';
    return;
  }
  container.innerHTML = '<div class="products-grid">' + wishlistItems.map(function(p) {
    var imgContent = p.image ? ('<img src="' + p.image + '" alt="' + p.name + '">') : p.emoji;
    var inWish = true;
    return '<div class="product-card" onclick="showProduct(' + p.id + ')">' +
      '<div class="product-img-wrap"><div class="product-img">' + imgContent + '</div>' +
      '<div class="product-badge ' + (p.badgeClass||'') + '">' + p.badge + '</div>' +
      '<button class="wishlist-btn" style="opacity:1;color:#ef4444;" onclick="event.stopPropagation();wishlist(' + p.id + ')">' + String.fromCodePoint(10084, 65039) + '</button></div>' +
      '<div class="product-info"><div class="product-name">' + p.name + '</div>' +
      '<div class="product-stars">⭐⭐⭐⭐⭐ <span>(' + p.reviews + ' reviews)</span></div>' +
      '<div class="product-price"><span class="price-now">$' + p.price.toFixed(2) + '</span>' +
      (p.was ? '<span class="price-was">$' + p.was.toFixed(2) + '</span>' : '') + '</div>' +
      '<button class="btn-black" onclick="event.stopPropagation();quickAdd(' + p.id + ')">Add To Cart</button></div></div>';
  }).join('') + '</div>';
}


function updateCartCount() {
  var total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = total;
  var mobileCount = document.getElementById('menuCartCount');
  if (mobileCount) mobileCount.textContent = total;
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  renderCart();
}

function renderCart() {
  var container = document.getElementById('cartContent');
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon">🛒</span>
        <h2>Your cart is empty!</h2>
        <p>Looks like your pup needs some new gear</p>
        <button class="btn-primary" onclick="showPage('shop')">Shop Now →</button>
      </div>`;
    return;
  }

  var subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  var shipping = 0;
  var total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-img">${item.emoji}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-variant">Qty: ${item.qty}</div>
              <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class="cart-item-right">
              <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
              <div class="qty-control">
                <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span style="color:var(--green)">FREE 🎉</span></div>
        <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <button class="checkout-btn" onclick="checkout()">Checkout Securely →</button>
        <p style="text-align:center;font-size:12px;color:var(--gray);margin-top:14px;font-weight:600">🔒 Secure checkout • 30 day returns</p>
      </div>
    </div>`;
}

function updateCartQty(id, delta) {
  var item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartCount();
  renderCart();
}

function checkout() {
  showToast('🎉 Redirecting to secure checkout...');
  setTimeout(function() { window.open('https://pawhaul.myshopify.com/cart', '_blank'); }, 1000);
}

// ==================== FILTERS ====================
function filterProducts(filter, btn) {
  currentShopFilter = filter || 'all';
  document.querySelectorAll('.shop-filters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderShopProducts(currentShopFilter);
}

// Navigate from a search result to the matching product in the shop grid and flash it
function goToProduct(id) {
  closeSearch();
  showPage('shop', 'all');
  setTimeout(function() {
    var el = document.getElementById('prodcard-' + id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('flash');
    setTimeout(function() { el.classList.remove('flash'); }, 1600);
  }, 140);
}

// ==================== UI HELPERS ====================
function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}

function showToast(msg, duration) {
  try {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, duration || 2800);
  } catch(e) { return; }
}

function showTrackOrder() {
  showToast('Check the confirmation email we sent you for your tracking number. Need help? Email pawhaulsupport@gmail.com', 6000);
}

function submitEmail() {
  var input = document.querySelector('.email-input');
  var email = input.value.trim();
  if (!email || !email.includes('@')) {
    showToast('⚠️ Please enter a valid email!');
    return;
  }
  if (!EMAILJS_PUBLIC_KEY) {
    showToast('🎉 Your code: ' + DISCOUNT_CODE + ' — 10% off your order!');
    input.value = '';
    return;
  }
  var btn = document.querySelector('.email-submit');
  if (btn) btn.disabled = true;
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_WELCOME_TEMPLATE, {
    to_email: email,
    discount_code: DISCOUNT_CODE
  }).then(function() {
    showToast('🎉 10% off code sent to your email!');
    input.value = '';
    if (btn) btn.disabled = false;
  }).catch(function() {
    showToast('🎉 Your code is: ' + DISCOUNT_CODE + ' — 10% off!');
    input.value = '';
    if (btn) btn.disabled = false;
  });
}

function submitContact() {
  var inputs = document.querySelectorAll('#page-contact .form-input, #page-contact .form-textarea');
  var allFilled = true;
  inputs.forEach(function(el) { if (!el.value.trim()) allFilled = false; });
  if (!allFilled) { showToast('⚠️ Please fill in all fields!'); return; }

  var formInputs = document.querySelectorAll('#page-contact .form-input');
  var firstName  = formInputs[0] ? formInputs[0].value.trim() : '';
  var lastName   = formInputs[1] ? formInputs[1].value.trim() : '';
  var fromEmail  = formInputs[2] ? formInputs[2].value.trim() : '';
  var subject    = document.querySelector('#page-contact .form-select');
  subject = subject ? subject.value : 'General Inquiry';
  var message    = document.querySelector('#page-contact .form-textarea');
  message = message ? message.value.trim() : '';

  if (!EMAILJS_PUBLIC_KEY) {
    showToast('✅ Message sent! We\'ll reply within 24 hours 🐾');
    inputs.forEach(function(el) { el.value = ''; });
    return;
  }

  var btn = document.querySelector('#page-contact .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, {
    // name variants — cover whichever your template uses
    from_name:  firstName + ' ' + lastName,
    name:       firstName + ' ' + lastName,
    full_name:  firstName + ' ' + lastName,
    first_name: firstName,
    last_name:  lastName,
    // email variants
    from_email: fromEmail,
    email:      fromEmail,
    user_email: fromEmail,
    reply_to:   fromEmail,   // required for EmailJS auto-reply to reach the sender
    // other fields
    subject:    subject,
    message:    message,
    to_email:   'pawhaulsupport@gmail.com'
  }).then(function() {
    showToast('✅ Message sent! We\'ll reply within 24 hours 🐾');
    inputs.forEach(function(el) { el.value = ''; });
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  }).catch(function() {
    showToast('❌ Something went wrong. Email us at pawhaulsupport@gmail.com');
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  });
}

// ==================== INIT ====================
renderHomeProducts();
