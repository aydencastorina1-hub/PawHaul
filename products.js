// ==================== DATA ====================
var products = [
  {
    id: 1, name: "PawHaul Walk Kit 2-in-1", emoji: "🧴", image: "", category: "water",
    badge: "🔥 Best Seller", badgeClass: "", reviews: 127,
    desc: "Keep your dog hydrated and fed on every walk with this portable 2-in-1 bottle. The leak-proof design holds both water and dry food in one sleek container, with a flip-out drinking spout for easy on-the-go hydration. Lightweight, durable, and perfect for walks, hikes, and travel.",

    // Variant options (Shopify-ready). Size drives the price; color does not.
    sizes: ["350ml", "550ml"],
    colors: ["Pink", "Teal/Blue", "Red/Maroon"],

    // Per-size variant pricing — maps each size option to its price.
    // `price`/`was` below mirror the default (first) size so every other part
    // of the app (shop cards, home carousel, bundles, search) keeps working.
    sizePrices: {
      "350ml": { price: 19.99, was: 27.99 },
      "550ml": { price: 24.99, was: 34.99 }
    },
    price: 19.99, was: 27.99,

    features: [
      "Leak-proof — holds water and dry food in one sealed container",
      "Flip-out drinking spout for easy on-the-go hydration",
      "Lightweight and durable — great for walks, hikes and travel",
      "Ideal for small to medium dogs",
      "BPA-free food-grade materials throughout",
      "One-hand open and lock operation",
      "Easy to clean — all parts detach"
    ],
    material: "BPA-free food-grade plastic body · Food-safe silicone drinking spout · Leak-proof sealed food compartment",
    whatsInBox: "1× Walk Kit 2-in-1 bottle (water + food compartments)"
  },
  {
    id: 2, name: "Heavy-Duty Retractable Dog Leash", emoji: "🦮", image: "", category: "leash",
    badge: "⭐ New", badgeClass: "badge-new", reviews: 84,
    desc: "Give your dog the freedom to explore while staying fully in control. This retractable leash features a smooth, jam-free mechanism with a one-touch lock button for instant stopping power. Durable nylon construction handles dogs of all sizes with ease. Comfortable ergonomic grip keeps your hand happy on long walks.",

    // Length drives the price (labels must exactly equal the sizePrices keys).
    sizes: ["3m (10ft)", "5m (16ft)"],
    colors: ["Red", "Gray", "Blue", "Black", "Pink", "Green", "Coffee", "Teal"],
    sizePrices: {
      "3m (10ft)": { price: 17.99, was: 24.99 },
      "5m (16ft)": { price: 21.99, was: 28.99 }
    },
    price: 17.99, was: 24.99,

    features: [
      "Smooth, jam-free retracting mechanism",
      "One-touch lock button for instant stopping power",
      "Durable nylon tape handles dogs of all sizes",
      "Comfortable ergonomic anti-slip grip",
      "Available in 3m (10ft) and 5m (16ft) lengths",
      "360° tangle-free swivel clip",
      "8 colors to match your dog's style"
    ],
    material: "Durable nylon tape · Impact-resistant casing · Ergonomic anti-slip grip · Stainless steel swivel clip",
    whatsInBox: "1× heavy-duty retractable dog leash"
  },
  {
    id: 3, name: "Collapsible Travel Bowl", price: 14.99, was: 19.99, emoji: "🥣", image: "", category: "water",
    badge: "💧 Popular", badgeClass: "badge-popular", reviews: 91,
    desc: "Never leave home without a bowl for your dog again. This silicone collapsible bowl folds flat for easy storage and pops open in seconds for food or water. Includes a built-in carabiner clip so it hooks right onto your bag, belt, or leash. Durable, lightweight, and easy to clean.",
    sizes: ["5.12in diameter × 1.97in height"],
    colors: ["Red", "Blue", "Orange", "Pink", "Green", "Gray", "Black"],
    features: [
      "Folds completely flat for easy storage",
      "Pops open in seconds for food or water",
      "Built-in carabiner clip hooks onto your bag, belt, or leash",
      "Great size for walks and travel",
      "Easy to clean — just rinse and fold",
      "Durable, lightweight food-grade silicone",
      "7 colors to choose from"
    ],
    material: "Food-grade silicone bowl · Built-in carabiner clip",
    whatsInBox: "1× collapsible silicone bowl with carabiner clip"
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
    id: 6, name: "LED Light-Up Dog Collar", price: 21.99, was: 29.99, emoji: "💡", image: "", category: "safety",
    badge: "🌙 Night Safety", badgeClass: "badge-night", reviews: 62,
    desc: "Keep your dog visible and safe on every night walk. USB rechargeable LED collar with 3 light modes — fast blink, slow blink, and steady glow. Detachable design fits any standard collar setup. Charges fully in about 2 hours and holds a charge through multiple walks.",
    sizes: ["Small 13-16in", "Medium 14.5-18in", "Large 16-20.5in", "XL 16.5-22in"],
    colors: ["Blue", "Green", "Pink", "Red", "Black"],
    features: [
      "3 light modes — fast blink, slow blink, steady glow",
      "Super bright at night — visible from far away",
      "USB rechargeable — full charge in about 2 hours",
      "Long battery life — holds a charge through multiple walks",
      "Stays cool — doesn't overheat during wear",
      "Detachable design fits any standard collar setup",
      "4 sizes from Small (13-16in) to XL (16.5-22in)"
    ],
    material: "Flexible LED light strip · USB rechargeable battery · Durable webbing band",
    whatsInBox: "1× LED light-up dog collar · 1× USB charging cable"
  },
  {
    id: 7, name: "Dual Dog Walk Coupler", price: 21.99, was: 28.99, emoji: "🔗", image: "", category: "leash",
    badge: "⭐ New", badgeClass: "badge-new", reviews: 67,
    desc: "Walk two dogs at once with zero tangle. The 360° swivel clips prevent knots while the bungee cord absorbs shock from both dogs at the same time. The adjustable length fits all breed sizes, so a big dog and a little one can walk comfortably side by side. Perfect for multi-dog households that want one hand free and zero chaos on the walk.",
    sizes: ["One Size — adjustable length"],
    colors: ["Black", "Blue", "Orange"],
    features: [
      "No-tangle 360° swivel clips",
      "Bungee cord absorbs shock from both dogs",
      "Adjustable length fits all breed sizes",
      "Walk two dogs with easy one-hand control",
      "Reflective stitching for low-light visibility"
    ],
    material: "Heavy-duty nylon webbing · Elastic bungee section · 360° stainless steel swivel clips",
    whatsInBox: "1× dual dog coupler with bungee section · 2× 360° swivel clips"
  },
  {
    id: 8, name: "Walk Clean Bag Hook", price: 9.99, was: 14.99, emoji: "🦴", image: "", category: "leash",
    badge: "🔥 Popular", badgeClass: "badge-popular", reviews: 43,
    desc: "Never get caught without a bag again. This bone-shaped poop bag dispenser clips directly onto any leash with a sturdy carabiner. Holds a full roll of bags inside, dispensing one at a time through the easy-pull slot. Lightweight and built to last.",
    sizes: ["Universal — fits all leashes"],
    colors: ["Red", "Blue", "Black", "Pink", "Green"],
    features: [
      "Bone-shaped dispenser holds a full roll of bags",
      "Dispenses one bag at a time through the easy-pull slot",
      "Sturdy carabiner clips onto any leash securely",
      "Easy-to-spot colors — never dig for it",
      "Lightweight and built to last"
    ],
    material: "Durable ABS bone-shaped shell · Aluminum carabiner clip",
    whatsInBox: "1× bone-shaped bag dispenser with carabiner (bag roll not included)"
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
var currentSize = null;          // selected size variant on the detail page
var currentVariantPrice = null;  // price for the selected size (falls back to product.price)

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
  // Home carousel = these 5 specific products, in this exact order.
  // (Shop page still shows all products.)
  var featuredIds = [1, 8, 6, 4, 2]; // Walk Kit, Bag Hook, LED Collar, AirTag Holder, Retractable Leash
  var featured = featuredIds
    .map(function(fid) { return products.find(function(p) { return p.id === fid; }); })
    .filter(Boolean);
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

// SITE-WIDE PRICE RULE: product cards always show the LOWEST price option —
// never a range. lowestVariant() finds the cheapest size variant (or the base
// price for single-price products); its label drives the default selection on
// the detail page too.
function lowestVariant(p) {
  if (p.sizePrices) {
    var best = null;
    Object.keys(p.sizePrices).forEach(function (k) {
      var v = p.sizePrices[k];
      if (v && (!best || v.price < best.price)) best = { size: k, price: v.price, was: v.was };
    });
    if (best) return best;
  }
  return { size: null, price: p.price, was: p.was };
}

// Builds the inner HTML of a .product-price block: the lowest price plus its
// struck-through "was". Shared by the shop grid, the home carousel and the
// wishlist so they always stay consistent.
function priceDisplayHtml(p) {
  var v = lowestVariant(p);
  return '<span class="price-now">$' + v.price.toFixed(2) + '</span>' +
    (v.was ? '<span class="price-was">$' + v.was.toFixed(2) + '</span>' : '');
}

// ── Compact on-card variant pickers (home carousel + shop grid) ──
// Tiny color swatches + size pills rendered between the reviews and the
// price. Selection lives in the card's own DOM (active classes), so every
// card picks independently; cardAdd() reads it back at add-to-cart time.
var SWATCH_COLORS = {
  red: '#D63031', maroon: '#7B1E24', pink: '#F06292', blue: '#2563EB',
  teal: '#0D9488', green: '#16A34A', gray: '#9CA3AF', grey: '#9CA3AF',
  black: '#15151F', coffee: '#6F4E37', orange: '#E8630A'
};

// "Teal/Blue" style dual names render as a split circle.
function swatchCss(name) {
  var parts = String(name).split('/').map(function (x) {
    return SWATCH_COLORS[x.trim().toLowerCase()] || '#CCCCCC';
  });
  if (parts.length > 1) return 'background:linear-gradient(135deg,' + parts[0] + ' 50%,' + parts[1] + ' 50%)';
  return 'background:' + parts[0];
}

// Cards are tiny, so size labels compress: "Small 13-16in" → "S",
// "3m (10ft)" → "3m", "350ml" stays. The FULL label is kept in data-size
// (it must exactly equal the sizePrices key for pricing/cart lines).
function shortSizeLabel(s) {
  s = String(s);
  var word = s.match(/^(XXL|XL|Small|Medium|Large)\b/i);
  if (word) {
    var w = word[1].toLowerCase();
    return w === 'small' ? 'S' : w === 'medium' ? 'M' : w === 'large' ? 'L' : word[1].toUpperCase();
  }
  var unit = s.match(/^\d+(?:\.\d+)?\s?(?:ml|cm|mm|in|ft|oz|m|L)\b/i);
  if (unit) return unit[0].replace(/\s+/g, '');
  return s;
}

function cardOptionsHtml(p) {
  var colorRow = '', sizeRow = '';
  if (p.colors && p.colors.length > 1) {
    colorRow = '<div class="mini-swatches">' + p.colors.map(function (c, i) {
      return '<button type="button" class="mini-swatch' + (i === 0 ? ' active' : '') +
        '" data-color="' + c + '" title="' + c + '" aria-label="Color: ' + c +
        '" style="' + swatchCss(c) + '" onmousedown="event.preventDefault()" onclick="cardSelectColor(event,this)"></button>';
    }).join('') + '</div>';
  }
  // Only render a size row when there's actually a choice — single-size
  // products carry long descriptive labels ("Universal — fits all leashes")
  // that would just be noise on a card.
  if (p.sizes && p.sizes.length > 1) {
    var def = lowestVariant(p).size || p.sizes[0];
    sizeRow = '<div class="mini-sizes">' + p.sizes.map(function (s) {
      return '<button type="button" class="mini-size' + (s === def ? ' active' : '') +
        '" data-size="' + s + '" title="' + s +
        '" onmousedown="event.preventDefault()" onclick="cardSelectSize(event,this,' + p.id + ')">' + shortSizeLabel(s) + '</button>';
    }).join('') + '</div>';
  }
  if (!colorRow && !sizeRow) return '';
  return '<div class="card-opts" onclick="event.stopPropagation()">' + colorRow + sizeRow + '</div>';
}

function cardSelectColor(ev, btn) {
  ev.stopPropagation();
  var card = btn.closest('.product-card');
  if (!card) return;
  card.querySelectorAll('.mini-swatch').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function cardSelectSize(ev, btn, id) {
  ev.stopPropagation();
  var card = btn.closest('.product-card');
  if (!card) return;
  card.querySelectorAll('.mini-size').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  // Re-price the card instantly from the selected size variant.
  var p = products.find(function (x) { return x.id === id; });
  var priceEl = card.querySelector('.product-price');
  if (!p || !priceEl) return;
  var sp = p.sizePrices ? p.sizePrices[btn.dataset.size] : null;
  var price = sp ? sp.price : p.price;
  var was = sp ? sp.was : p.was;
  priceEl.innerHTML = '<span class="price-now">$' + price.toFixed(2) + '</span>' +
    (was ? '<span class="price-was">$' + was.toFixed(2) + '</span>' : '');
}

// Card Add To Cart: adds whatever size/color the card currently has
// selected (falls back to the cheapest variant, same as quickAdd).
function cardAdd(ev, id) {
  if (ev) ev.stopPropagation();
  var p = products.find(function (x) { return x.id === id; });
  if (!p) return;
  var card = ev && ev.target ? ev.target.closest('.product-card') : null;
  var v = lowestVariant(p);
  var size = v.size || '', price = v.price;
  var sizeBtn = card ? card.querySelector('.mini-size.active') : null;
  if (sizeBtn && sizeBtn.dataset.size) {
    size = sizeBtn.dataset.size;
    var sp = p.sizePrices ? p.sizePrices[size] : null;
    price = sp ? sp.price : p.price;
  }
  var item = Object.assign({}, p, { price: price, size: size || '' });
  var sw = card ? card.querySelector('.mini-swatch.active') : null;
  if (sw && sw.dataset.color) item.color = sw.dataset.color;
  addToCart(item);
}

function productCard(p) {
  var imgContent = p.image
    ? `<img src="${p.image}" alt="${p.name}">`
    : p.emoji;
  return `
    <div class="product-card" id="prodcard-${p.id}" onclick="showProduct(${p.id})">
      <div class="product-img-wrap">
        <div class="product-img">${imgContent}</div>
        <button class="wishlist-btn" data-wid="${p.id}" onclick="event.stopPropagation(); wishlist(${p.id})">${wishlistItems.some(function(w){return w.id===p.id}) ? '♥' : '♡'}</button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-stars">⭐⭐⭐⭐⭐ <span>(${p.reviews} reviews)</span></div>
        ${cardOptionsHtml(p)}
        <div class="product-price">${priceDisplayHtml(p)}</div>
        <button class="btn-black" onclick="cardAdd(event, ${p.id})">Add To Cart 🛒</button>
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
    '</div>' +
    '<div class="det-dots" id="detDots"></div>';
  setTimeout(function() { if (typeof initDetailCarousel === 'function') initDetailCarousel(); }, 30);
  document.getElementById('detailName').textContent = currentProduct.name;
  // Default to the CHEAPEST size variant (site-wide lowest-price rule); its
  // price drives the initial display and its button starts out selected.
  var cheapest = lowestVariant(currentProduct);
  var defSizeIdx = 0;
  if (currentProduct.sizes && currentProduct.sizes.length) {
    var found = currentProduct.sizes.indexOf(cheapest.size);
    if (found > -1) defSizeIdx = found;
    currentSize = currentProduct.sizes[defSizeIdx];
  } else {
    currentSize = null;
  }
  currentVariantPrice = cheapest.price;
  setDetailPrice(cheapest.price, cheapest.was);
  document.getElementById('detailDesc').textContent = currentProduct.desc;
  document.getElementById('detailReviews').textContent = `(${currentProduct.reviews} reviews)`;
  document.getElementById('qtyNum').textContent = '1';

  var cats = { walk: 'Walk Essentials', car: 'Car & Travel', treats: 'Health & Treats', home: 'Home & Grooming' };
  document.getElementById('detailCategory').textContent = cats[currentProduct.category] || 'PawHaul';

  document.getElementById('detailSizes').innerHTML = currentProduct.sizes.map((s, i) =>
    `<button class="option-btn ${i===defSizeIdx?'active':''}" onclick="selectSize(this)">${s}</button>`).join('');

  document.getElementById('detailColors').innerHTML = currentProduct.colors.map((c, i) =>
    `<button class="option-btn ${i===0?'active':''}" onclick="selectOption(this)">${c}</button>`).join('');

  document.getElementById('detailFeatures').innerHTML = currentProduct.features.map(f =>
    `<li>${f}</li>`).join('');

  var matEl = document.getElementById('detailMaterial');
  if (matEl) matEl.textContent = currentProduct.material || '';
  var boxEl = document.getElementById('detailBox');
  if (boxEl) boxEl.textContent = currentProduct.whatsInBox || '';

  // (Price, "was" and the Save % badge are set by setDetailPrice above,
  //  using the selected size variant.)

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

// Writes the price, struck-through "was", and Save % badge on the detail page.
// Shared by showProduct (initial render) and selectSize (when the size toggles).
function setDetailPrice(price, was) {
  var priceEl = document.getElementById('detailPrice');
  var wasEl = document.getElementById('detailWas');
  var saveEl = document.querySelector('.save');
  if (priceEl) priceEl.textContent = '$' + Number(price).toFixed(2);
  if (wasEl) wasEl.textContent = was ? '$' + Number(was).toFixed(2) : '';
  if (saveEl) {
    if (was && was > price) {
      saveEl.textContent = 'Save ' + Math.round((1 - price / was) * 100) + '%';
      saveEl.style.display = '';
    } else {
      saveEl.style.display = 'none';
    }
  }
}

// Size buttons use this instead of selectOption: it toggles the active state
// AND re-prices the page from the product's sizePrices map (if present).
function selectSize(btn) {
  selectOption(btn);
  if (!currentProduct) return;
  currentSize = btn.textContent.trim();
  var variant = currentProduct.sizePrices ? currentProduct.sizePrices[currentSize] : null;
  currentVariantPrice = variant ? variant.price : currentProduct.price;
  setDetailPrice(currentVariantPrice, variant ? variant.was : currentProduct.was);
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
  // Add the selected size variant at its price (falls back to the base price).
  var item = Object.assign({}, currentProduct, {
    price: (typeof currentVariantPrice === 'number') ? currentVariantPrice : currentProduct.price,
    size: currentSize || ''
  });
  for (var i = 0; i < currentQty; i++) addToCart(item);
}

function buyNow() {
  addToCartDetail();
  showPage('cart');
}

// ==================== CART ====================
function addToCart(product) {
  // Match on id + size so different size variants are separate line items.
  // Products added without a size (e.g. quick-add) just match on id as before.
  var size = product.size || '';
  var existing = cart.find(item => item.id === product.id && (item.size || '') === size);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, qty: 1 }); }
  updateCartCount();
  showToast(`🐾 ${product.name} added to cart!`);
}

function quickAdd(id) {
  var product = products.find(p => p.id === id);
  if (!product) return;
  // Card buttons add the LOWEST-priced variant (the price the card shows),
  // tagged with its size so it lands on the right cart line.
  var v = lowestVariant(product);
  addToCart(Object.assign({}, product, { price: v.price, size: v.size || '' }));
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
  // Update heart glyphs in place so the carousel/shop never reset or scroll.
  var inWish = wishlistItems.some(function(w) { return w.id === id; });
  document.querySelectorAll('.wishlist-btn[data-wid="' + id + '"]').forEach(function(btn) {
    btn.textContent = inWish ? '♥' : '♡';
  });
  // Keep the wishlist page in sync only if it's the page being viewed.
  var wlPage = document.getElementById('page-wishlist');
  if (wlPage && wlPage.classList.contains('active')) renderWishlist();
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
      '<button class="wishlist-btn" data-wid="' + p.id + '" style="opacity:1;" onclick="event.stopPropagation();wishlist(' + p.id + ')">♥</button></div>' +
      '<div class="product-info"><div class="product-name">' + p.name + '</div>' +
      '<div class="product-stars">⭐⭐⭐⭐⭐ <span>(' + p.reviews + ' reviews)</span></div>' +
      '<div class="product-price">' + priceDisplayHtml(p) + '</div>' +
      '<button class="btn-black" onclick="event.stopPropagation();quickAdd(' + p.id + ')">Add To Cart</button></div></div>';
  }).join('') + '</div>';
}


function updateCartCount() {
  var total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = total;
  var mobileCount = document.getElementById('menuCartCount');
  if (mobileCount) mobileCount.textContent = total;
}

function removeFromCart(idx) {
  // idx is the cart line index (cart is re-rendered fresh each time, so
  // indices always match what's on screen — this is variant-safe).
  if (idx < 0 || idx >= cart.length) return;
  cart.splice(idx, 1);
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
        ${cart.map((item, idx) => `
          <div class="cart-item">
            <div class="cart-item-img">${item.emoji}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-variant">${item.size ? item.size + ' · ' : ''}Qty: ${item.qty}</div>
              <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class="cart-item-right">
              <button class="remove-btn" onclick="removeFromCart(${idx})">✕</button>
              <div class="qty-control">
                <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
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

function updateCartQty(idx, delta) {
  var item = cart[idx];
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
