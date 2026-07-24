// ==================== DATA ====================
var products = [
  {
    id: 1, name: "2-in-1 Dog Water Bottle", emoji: "🧴", image: "", category: "water",
    badge: "Best Seller", badgeClass: "", reviews: 127,
    desc: "Keep your dog hydrated and fed on every walk with this portable 2-in-1 bottle. The leak-proof design holds both water and dry food in one sleek container, with a flip-out drinking spout for easy on-the-go hydration. Lightweight, durable, and perfect for walks, hikes, and travel.",
    tagline: "Water and food in one leak-proof bottle — never cut a walk short again.",

    // Variant options (Shopify-ready). Size drives the price; color does not.
    sizes: ["350ml", "550ml"],
    colors: ["Pink", "White", "Blue"],

    // Real product photos from Shopify, one per color (Shopify's data model
    // gives exactly one image per variant — see per-product notes on why
    // this is a flat color->url map, not a multi-angle gallery).
    images: {
      "Pink": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S3e62153a0359458e85ca8792786f892fS.webp?width=900",
      "White": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S0905a11eba164092b57f7dd587d9eaf1d.webp?width=900",
      "Blue": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sa7d924844a3d4013b1b397880dadfcadU.webp?width=900"
    },

    // Per-size variant pricing — maps each size option to its price.
    // `price`/`was` below mirror the default (first) size so every other part
    // of the app (shop cards, home carousel, bundles, search) keeps working.
    sizePrices: {
      "350ml": { price: 19.99, was: 27.99 },
      "550ml": { price: 24.99, was: 34.99 }
    },
    price: 19.99, was: 27.99,

    // Real Shopify variant GIDs (Storefront API) for checkout. Keyed
    // "size|color" to exactly match this product's own size/color labels.
    shopifyVariants: { productGid: "gid://shopify/Product/9527350657280", byVariant: {
        "350ml|Pink": "gid://shopify/ProductVariant/48957400285440",
        "550ml|Pink": "gid://shopify/ProductVariant/48957400219904",
        "350ml|White": "gid://shopify/ProductVariant/48957400350976",
        "550ml|White": "gid://shopify/ProductVariant/48957400252672",
        "350ml|Blue": "gid://shopify/ProductVariant/48957400383744",
        "550ml|Blue": "gid://shopify/ProductVariant/48957400318208"
      } },

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
    whatsInBox: "1× 2-in-1 Dog Water Bottle (water + food compartments)"
  },
  {
    id: 2, name: "Retractable Dog Leash", emoji: "🦮", image: "", category: "leash",
    badge: "New", badgeClass: "badge-new", reviews: 84,
    desc: "Give your dog the freedom to explore while staying fully in control. This retractable leash features a smooth, jam-free mechanism with a one-touch lock button for instant stopping power. Durable nylon construction handles dogs of all sizes with ease. Comfortable ergonomic grip keeps your hand happy on long walks.",
    tagline: "Smooth, jam-free control that adapts to every walk.",

    // Length drives the price (labels must exactly equal the sizePrices keys).
    sizes: ["3m (10ft)", "5m (16ft)"],
    colors: ["Red", "Green", "Blue", "White", "Pink"],

    images: {
      "Red": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S5294cac17bbb487bac47cce1df064df0J.webp?width=900",
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S5a39efa1841e49b1ad7857b34634dad6v.webp?width=900",
      "Blue": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sb032f773be6f4a26ad06ed2d00ca88783.webp?width=900",
      "White": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sef87ddb83ec648e9bb3240889af6c8a0k.webp?width=900",
      "Pink": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Saa15954db497432a8865ca3daedfc754j.webp?width=900"
    },

    // Extra detail-page gallery slides — general/non-color-specific shots
    // from Shopify's wider image pool (a hardware close-up, an in-use
    // hand-hold hero shot, and a full flat-lay). Picked after auditing all
    // 24 other pool images: excluded spec/measurement diagrams with text
    // overlays, a multi-color grid collage, and a mechanism close-up whose
    // composition left too much empty background above the subject on a
    // mobile crop.
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S0bac281c54e342e885cd09dd407d2182w.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sbdc750f0c22f49f19f834493fa8c1e8aJ.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sf813f54ca9f64fea9a4899c3006cf291s.webp?width=900"
    ],

    sizePrices: {
      "3m (10ft)": { price: 17.99, was: 24.99 },
      "5m (16ft)": { price: 21.99, was: 28.99 }
    },
    price: 17.99, was: 24.99,

    // Pink is out of stock in the 5m length only — Pink in 3m is fully
    // purchasable. Checked against on card pickers, the detail page, and
    // both add-to-cart paths (see variantUnavailable()).
    unavailableVariants: [
      { size: "5m (16ft)", color: "Pink" }
    ],

    // Real Shopify variant GIDs (Storefront API) for checkout.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276641024", byVariant: {
        "3m (10ft)|Red": "gid://shopify/ProductVariant/48945265508608",
        "5m (16ft)|Red": "gid://shopify/ProductVariant/48945265475840",
        "3m (10ft)|Green": "gid://shopify/ProductVariant/48945265574144",
        "5m (16ft)|Green": "gid://shopify/ProductVariant/48945265541376",
        "3m (10ft)|Blue": "gid://shopify/ProductVariant/48945265705216",
        "5m (16ft)|Blue": "gid://shopify/ProductVariant/48945265639680",
        "3m (10ft)|White": "gid://shopify/ProductVariant/48945265803520",
        "5m (16ft)|White": "gid://shopify/ProductVariant/48945265770752",
        "3m (10ft)|Pink": "gid://shopify/ProductVariant/48945265934592",
        "5m (16ft)|Pink": "gid://shopify/ProductVariant/48945265967360"
      } },

    features: [
      "Smooth, jam-free retracting mechanism",
      "One-touch lock button for instant stopping power",
      "Durable nylon tape handles dogs of all sizes",
      "Comfortable ergonomic anti-slip grip",
      "Available in 3m (10ft) and 5m (16ft) lengths",
      "360° tangle-free swivel clip",
      "5 colors to match your dog's style"
    ],
    material: "Durable nylon tape · Impact-resistant casing · Ergonomic anti-slip grip · Stainless steel swivel clip",
    whatsInBox: "1× retractable dog leash"
  },
  {
    id: 3, name: "Collapsible Dog Bowl", price: 14.99, was: 21.99, emoji: "🥣", image: "", category: "water",
    badge: "Popular", badgeClass: "badge-popular", reviews: 91,
    desc: "Never leave home without a bowl for your dog again. This silicone collapsible bowl folds flat for easy storage and pops open in seconds for food or water. Includes a built-in carabiner clip so it hooks right onto your bag, belt, or leash. Durable, lightweight, and easy to clean.",
    tagline: "Folds flat, pops open in seconds — water or food, anywhere.",
    sizes: ["5.12in diameter × 1.97in height"],
    colors: ["Red", "Blue", "Orange", "Green", "White", "Black"],

    // Locally-hosted: Shopify's own variant photos for this product all had
    // an AliExpress-style measurement-diagram overlay burned in — cropped
    // out (see images/products/) so the card/detail photos look like a
    // normal studio product shot instead of a supplier listing screenshot.
    images: {
      "Red": "/images/products/bowl-red.jpg",
      "Blue": "/images/products/bowl-blue.jpg",
      "Orange": "/images/products/bowl-orange.jpg",
      "Green": "/images/products/bowl-green.jpg",
      "White": "/images/products/bowl-white.jpg",
      "Black": "/images/products/bowl-black.jpg"
    },

    // Extra detail-page gallery slides — a lifestyle in-use shot and a solo
    // top-down detail shot. Picked after auditing all 10 other pool images:
    // excluded measurement-diagram overlays (same issue as the color photos
    // above), a rainbow "colors available" fan-out collage showing several
    // unsold colors (pink, yellow, magenta), a 3-panel backpack/belt-clip
    // montage that also showed unsold colors (yellow, pink), and other
    // single-color solo shots that read as another color's own photo.
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Se41e912ec0cb4da697da3f6f75a261b82.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sa0f8a84f540d477cb9edf31bc9bd202cq.webp?width=900"
    ],

    // Real Shopify variant GIDs (Storefront API) for checkout.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276542720", byColor: {
        "Red": "gid://shopify/ProductVariant/48945265082624",
        "Blue": "gid://shopify/ProductVariant/48945265115392",
        "Orange": "gid://shopify/ProductVariant/48945265148160",
        "Green": "gid://shopify/ProductVariant/48945265213696",
        "White": "gid://shopify/ProductVariant/48945265246464",
        "Black": "gid://shopify/ProductVariant/48945265279232"
      } },

    features: [
      "Folds completely flat for easy storage",
      "Pops open in seconds for food or water",
      "Built-in carabiner clip hooks onto your bag, belt, or leash",
      "Great size for walks and travel",
      "Easy to clean — just rinse and fold",
      "Durable, lightweight food-grade silicone",
      "6 colors to choose from"
    ],
    material: "Food-grade silicone bowl · Built-in carabiner clip",
    whatsInBox: "1× collapsible silicone bowl with carabiner clip"
  },
  {
    id: 4, name: "Dog AirTag Holder", price: 10.99, was: 16.99, emoji: "📍", image: "", category: "safety",
    badge: "Safety", badgeClass: "badge-safety", reviews: 38,
    desc: "A secure waterproof silicone holder that keeps your Apple AirTag attached to your dog's collar at all times — so you always know where they are. The twist-lock closure holds the AirTag firmly in place through daily walks, rain, mud, and rough play. Compatible with Apple AirTag 1st and 2nd generation. Fits any standard collar up to 1.5\" wide.",
    tagline: "Always know where they are, rain or shine.",
    // Shown as a callout on the product page + surfaced in the chatbot —
    // this is the case only, not the AirTag itself.
    caseOnlyNote: "Case only — AirTag sold separately",
    sizes: ["Universal — fits all standard collars"],
    colors: ["Black", "Transparent", "Pink", "Blue", "Green", "Purple"],

    images: {
      "Black": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S9fc066621549467db87867143006b174g.webp?width=900",
      "Transparent": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S43a2380c6d5a45ffa2a1743422529d30K.webp?width=900",
      "Pink": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S95dd5f8435454a1d9a33153ac34b3b10p.webp?width=900",
      "Blue": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S0e0c88fc2c2a4504ba1362ebe8c19ae6B.webp?width=900",
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S9056ad1490f74f2cb16aaa0efab4f25dv.webp?width=900",
      "Purple": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S44b6cdd7d98d431cb3a07d23fafa7b31A.webp?width=900"
    },

    // Real Shopify variant GIDs (Storefront API) for checkout.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276575488", byColor: {
        "Black": "gid://shopify/ProductVariant/48945265049856",
        "Transparent": "gid://shopify/ProductVariant/48945265017088",
        "Pink": "gid://shopify/ProductVariant/48945264984320",
        "Blue": "gid://shopify/ProductVariant/48945264951552",
        "Green": "gid://shopify/ProductVariant/48945264918784",
        "Purple": "gid://shopify/ProductVariant/48945264886016"
      } },

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
    id: 5, name: "Poop Bag Clip", price: 9.99, was: 14.99, emoji: "🧷", image: "", category: "leash",
    badge: "New", badgeClass: "badge-new", reviews: 67,
    desc: "Never fumble with a bag of waste on your walk again. This hands-free clip holds used poop bags securely so you can keep both hands free while walking your dog. Lightweight and compact, it clips easily onto any leash or belt for a quick, hygienic cleanup every time.",
    tagline: "Hands-free carrying for used bags, every walk.",
    sizes: ["Universal — fits all leashes"],
    colors: ["Orange", "Purple", "Red", "Black", "Green", "Pink", "Blue"],

    // Note: Shopify's own "Blue" variant image was a mismatched product (a
    // round tag with unrelated branding text) — swapped for a matching
    // teardrop-clip photo from the product's wider image pool instead.
    images: {
      "Orange": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sdabcb515185644749aa0640e68078179d.webp?width=900",
      "Purple": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S0da950fa93d04a25afebfaa0336a51cbS.webp?width=900",
      "Red": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Se9fbfd87f59e4b41beee2244e4b329b20.webp?width=900",
      "Black": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sdb52b5440928451eb6abb1ed06b3ce6dB.webp?width=900",
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S48db40d2b42148dd9cd2af3427535c48X.webp?width=900",
      "Pink": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S856c79dab79e4350a9cd09e7fb81679b6.webp?width=900",
      "Blue": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S96d1aaaf88394f8fa64e7a8ff93bede5O.webp?width=900"
    },

    // Extra detail-page gallery slides — a moody hardware close-up on the
    // clip's Y-notch, a hand-holding-a-used-bag hero shot (directly matches
    // the corrected "holds used bags" description), and a backpack-attached
    // usage shot. Picked after auditing all 23 other pool images: excluded
    // several wrong-product round-tag photos (unrelated branding text), a
    // multi-color grid collage, solo studio shots of other colors, and a
    // batch of spec/instruction diagrams.
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sb3cc74988c5349db92ec75f67e3e98e5R.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S68f4725cdb964fe683c982b0ac097df1C.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sde53da21db1445f4b8edf1b6e8d8a7abf.webp?width=900"
    ],

    // Real Shopify variant GIDs (Storefront API) for checkout.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276509952", byColor: {
        "Orange": "gid://shopify/ProductVariant/48945264296192",
        "Purple": "gid://shopify/ProductVariant/48945264328960",
        "Red": "gid://shopify/ProductVariant/48945264361728",
        "Black": "gid://shopify/ProductVariant/48945264394496",
        "Green": "gid://shopify/ProductVariant/48945264656640",
        "Pink": "gid://shopify/ProductVariant/48945264623872",
        "Blue": "gid://shopify/ProductVariant/48945264787712"
      } },

    features: [
      "Hands-free clip holds a used poop bag securely",
      "Clips easily onto any leash or belt",
      "Keeps both hands free while walking your dog",
      "Lightweight and compact design",
      "Quick, hygienic cleanup every time",
      "7 colors to choose from"
    ],
    material: "Durable silicone clip · Secure metal hook attachment",
    whatsInBox: "1× Poop Bag Clip"
  },
  {
    id: 6, name: "Light Up Dog Collar", price: 19.99, was: 26.99, emoji: "💡", image: "", category: "safety",
    badge: "Night Safety", badgeClass: "badge-night", reviews: 62,
    desc: "Keep your dog visible and safe on every night walk. USB rechargeable LED collar with 3 light modes — fast blink, slow blink, and steady glow. Detachable design fits any standard collar setup. Charges fully in about 2 hours and holds a charge through multiple walks.",
    tagline: "Be seen on every night walk, no matter how dark.",
    sizes: ["S (34-41cm)", "M (37-46cm)", "L (41-52cm)", "XL (42-56cm)"],
    colors: ["Green", "Blue", "Red", "Pink", "Black"],

    // Locally-hosted: Shopify's own variant photos for this product were all
    // two-panel composites with a "USB Charging" text-and-checkmark banner
    // stitched to the bottom — cropped down to just the clean product shot
    // (see images/products/) so the card/detail/gallery photos look like a
    // normal studio product shot instead of a supplier listing screenshot.
    images: {
      "Green": "/images/products/collar-green.jpg",
      "Blue": "/images/products/collar-blue.jpg",
      "Red": "/images/products/collar-red.jpg",
      "Pink": "/images/products/collar-pink.jpg",
      "Black": "/images/products/collar-black.jpg"
    },

    // Extra detail-page gallery slides — a night walk-in-progress shot (the
    // product's core visibility use case) and a charging-cable detail shot.
    // Picked after auditing all 30 other pool images: excluded size/spec
    // diagrams, battery/rechargeable diagrams with text overlays, two
    // separate rainbow "colors available" burst collages, a repeating-
    // watermark shot, and an 11-panel photo montage.
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S667ef3cbbee54b2eb1df60190cc6bee9k.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sb54672fb152d4d6e95156fb5c6c85cabj.webp?width=900"
    ],

    sizePrices: {
      "S (34-41cm)": { price: 19.99, was: 26.99 },
      "M (37-46cm)": { price: 21.99, was: 29.99 },
      "L (41-52cm)": { price: 23.99, was: 32.99 },
      "XL (42-56cm)": { price: 25.99, was: 35.99 }
    },

    // Real Shopify variant GIDs (Storefront API) for checkout.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276739328", byVariant: {
        "S (34-41cm)|Green": "gid://shopify/ProductVariant/48945266360576",
        "M (37-46cm)|Green": "gid://shopify/ProductVariant/48945266295040",
        "L (41-52cm)|Green": "gid://shopify/ProductVariant/48945266327808",
        "XL (42-56cm)|Green": "gid://shopify/ProductVariant/48945266753792",
        "S (34-41cm)|Blue": "gid://shopify/ProductVariant/48945266491648",
        "M (37-46cm)|Blue": "gid://shopify/ProductVariant/48945266524416",
        "L (41-52cm)|Blue": "gid://shopify/ProductVariant/48945266426112",
        "XL (42-56cm)|Blue": "gid://shopify/ProductVariant/48945266393344",
        "S (34-41cm)|Red": "gid://shopify/ProductVariant/48945266458880",
        "M (37-46cm)|Red": "gid://shopify/ProductVariant/48945266655488",
        "L (41-52cm)|Red": "gid://shopify/ProductVariant/48945266557184",
        "XL (42-56cm)|Red": "gid://shopify/ProductVariant/48945266917632",
        "S (34-41cm)|Pink": "gid://shopify/ProductVariant/48945266589952",
        "M (37-46cm)|Pink": "gid://shopify/ProductVariant/48945266786560",
        "L (41-52cm)|Pink": "gid://shopify/ProductVariant/48945266688256",
        "XL (42-56cm)|Pink": "gid://shopify/ProductVariant/48945266622720",
        "S (34-41cm)|Black": "gid://shopify/ProductVariant/48945266884864",
        "M (37-46cm)|Black": "gid://shopify/ProductVariant/48945266819328",
        "L (41-52cm)|Black": "gid://shopify/ProductVariant/48945266852096",
        "XL (42-56cm)|Black": "gid://shopify/ProductVariant/48945266721024"
      } },

    features: [
      "3 light modes — fast blink, slow blink, steady glow",
      "Super bright at night — visible from far away",
      "USB rechargeable — full charge in about 2 hours",
      "Long battery life — holds a charge through multiple walks",
      "Stays cool — doesn't overheat during wear",
      "Detachable design fits any standard collar setup",
      "4 sizes from S (34-41cm) to XL (42-56cm)"
    ],
    material: "Flexible LED light strip · USB rechargeable battery · Durable webbing band",
    whatsInBox: "1× LED light-up dog collar · 1× USB charging cable"
  },
  {
    id: 8, name: "Poop Bag Holder", price: 9.99, was: 14.99, emoji: "🧺", image: "", category: "leash",
    badge: "New", badgeClass: "badge-new", reviews: 24,
    desc: "Always be ready for cleanup with a full roll of bags on hand. This durable canvas holder attaches to your leash with a sturdy carabiner clip, keeping unused waste bags organized and within reach on every walk — just pull a bag out whenever you need one. Simple, reliable, and built to last.",
    tagline: "A full roll of bags, always within reach.",
    sizes: ["Universal — fits all leashes"],
    colors: ["Green", "Blue", "Black"],

    images: {
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S8eef5a0cca254e189de3a866ef6265c8f.webp?width=900",
      "Blue": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S0713da2667494a60a03cd40e7fc7c805B.webp?width=900",
      "Black": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S56ca0b52b7874b6b8b4b98ac4f252cd2E.webp?width=900"
    },

    // Extra detail-page gallery slides — a pouch shown with a bag, and a
    // hanging-on-leash lifestyle shot. Picked after auditing all 12 other
    // pool images: excluded a batch of spec/instruction-panel graphics, one
    // with faint Chinese-looking filler text in a product-parameters
    // diagram, and a styled multi-pouch group shot that showed pink and
    // grey pouches — neither an actual sold color (Green/Blue/Black only).
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S1fad867101bf459eb368629dc96f3b11W.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S61093ab6323a4f95bc544447f2d9f92fQ.webp?width=900"
    ],

    // Real Shopify variant GIDs (Storefront API) for checkout. Shopify's own
    // product title for this listing is longer ("Canvas Dog Poop Bag
    // Holder, Outdoor Pet Waste Bag Dispenser...") — matched by color set
    // + price, not by title text.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276477184", byColor: {
        "Green": "gid://shopify/ProductVariant/48945264034048",
        "Blue": "gid://shopify/ProductVariant/48945264066816",
        "Black": "gid://shopify/ProductVariant/48945264099584"
      } },

    features: [
      "Holds a full roll of unused waste bags",
      "Durable canvas construction built to last",
      "Sturdy carabiner clip attaches to any leash",
      "Keeps bags organized and easy to grab",
      "Simple, reliable design for every walk",
      "3 colors to choose from"
    ],
    material: "Durable canvas pouch · Sturdy metal carabiner clip",
    whatsInBox: "1× Poop Bag Holder pouch (bag roll not included)"
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
var DISCOUNT_CODE = 'WELCOME10';   // Your 10% off code (change this anytime) — also shown by the offer popup

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// ==================== CART STATE ====================
var cart = [];
var currentProduct = null;
var currentQty = 1;
var currentSize = null;          // selected size variant on the detail page
var currentColor = null;         // selected color variant on the detail page
var currentVariantPrice = null;  // price for the selected size (falls back to product.price)

// ==================== ROUTING ====================
// Real, distinct, bookmarkable/reloadable URLs for each page — added on top
// of the existing showPage()/showProduct() state-toggle system rather than
// replacing it (this is a script-only SPA, no build step/framework router).
// parseRoute() itself lives in index.html <head> (must run before first
// paint to avoid a flash of Home on a direct /shop, /contact, etc. load —
// see the ROUTING comment there); everything here just needs to stay in
// sync with it.

// Product URLs are named by slug, not id, per the task spec (/product/<name>)
// — this means a product rename changes its URL (old links break); accepted
// tradeoff for readability over a stable-but-ugly /product/<id>-<slug> form.
function slugify(name) {
  return String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function pageToPath(page, filter) {
  if (page === 'home') return '/';
  if (page === 'shop') return (filter && filter !== 'all') ? '/shop/' + filter : '/shop';
  if (page === 'contact') return '/contact';
  if (page === 'about') return '/about';
  if (page === 'wishlist') return '/wishlist';
  if (page === 'cart') return '/cart';
  return null; // 'product' owns its own URL (see showProduct) — never routed here
}

// opts.sync: this is the browser CORRECTING us to match a URL it already
// has (initial load, or popstate back/forward) — never push a new history
// entry, just normalize the address bar via replaceState.
// opts.replace: an explicit non-sync replace (e.g. filter pills — see
// filterProducts()) — updates the URL without growing browser history.
// default: a real user-driven navigation — pushState (adds a back-button step).
function navigateUrl(path, opts) {
  opts = opts || {};
  if (!path) return;
  if (opts.sync) {
    if (location.pathname !== path) history.replaceState({ p: 1 }, '', path);
    return;
  }
  if (location.pathname === path) return; // already there — don't clutter history
  if (opts.replace) history.replaceState({ p: 1 }, '', path);
  else history.pushState({ p: 1 }, '', path);
}

// Shared by the initial-load bootstrap script (index.html, after app.js
// loads) and the popstate (back/forward) listener below.
function dispatchRoute(route, opts) {
  if (!route) return;
  if (route.type === 'product') {
    var p = products.find(function (pr) { return slugify(pr.name) === route.slug; });
    if (p) { showProduct(p.id, opts); return; }
    // Unknown/stale product slug (e.g. a since-renamed or removed product) —
    // fall back to Home rather than show a broken/empty product page, and
    // fix the address bar to match so Back doesn't just return here.
    showPage('home', null, opts);
    if (opts && opts.sync) history.replaceState({ p: 1 }, '', '/');
    return;
  }
  if (route.type === 'page') { showPage(route.page, route.filter, opts); return; }
  showPage('home', null, opts);
  if (opts && opts.sync) history.replaceState({ p: 1 }, '', '/');
}

window.addEventListener('popstate', function () {
  dispatchRoute(window.parseRoute(location.pathname), { sync: true });
});

// Click handler for real <a href="..."> nav links/buttons (nav bar, footer,
// "Shop Leashes"-style CTAs — see index.html). Lets modifier-clicks/middle-
// click fall through to native browser behavior (open in new tab, etc, using
// the real href) instead of always hijacking the click for SPA navigation.
function goTo(e, page, filter) {
  if (e && (e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
  if (e) e.preventDefault();
  showPage(page, filter);
}

// ==================== NAVIGATION ====================
function showPage(page, filter, opts) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-transition'));
  document.getElementById('page-' + page).classList.add('active', 'page-transition');
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

  // page==='product' is deliberately NOT routed here — showProduct() (which
  // is the only caller that ever passes 'product') owns that URL itself,
  // since it needs the product's slug, not just the page name.
  navigateUrl(pageToPath(page, filter), opts);

  // Snap to top after render, then restore smooth scrolling for user swipes
  requestAnimationFrame(function() {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  });
}

// ==================== RENDER PRODUCTS ====================
function renderHomeProducts() {
  var container = document.getElementById('homeProducts');
  // Home carousel = these 5 specific products (best sellers), in this exact
  // order. (Shop page still shows all products.)
  var featuredIds = [2, 3, 8, 1, 6]; // Retractable Leash, Dog Bowl, Poop Bag Holder, Water Bottle, Light Up Collar
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

// Builds the price/was markup for one exact variant (no "From" prefix —
// used once a specific size has actually been selected).
function variantPriceHtml(price, was) {
  return '<span class="price-now">$' + Number(price).toFixed(2) + '</span>' +
    (was ? '<span class="price-was">$' + Number(was).toFixed(2) + '</span>' : '');
}

// True when a product's sizes are priced differently from each other (so the
// card price is really a starting price, not the one-and-only price).
function hasPriceRange(p) {
  if (!p.sizePrices) return false;
  var prices = Object.keys(p.sizePrices).map(function (k) { return p.sizePrices[k].price; });
  return Math.max.apply(null, prices) !== Math.min.apply(null, prices);
}

// Builds the inner HTML of a .product-price block: the lowest price plus its
// struck-through "was" (prefixed "From" when sizes actually vary in price).
// Shared by the shop grid, the home carousel and the wishlist so they always
// stay consistent.
function priceDisplayHtml(p) {
  var v = lowestVariant(p);
  var prefix = hasPriceRange(p) ? '<span class="price-from">From </span>' : '';
  return prefix + variantPriceHtml(v.price, v.was);
}

// True when this exact size+color combo has been marked unavailable on the
// product (e.g. one color sold out in one length). A rule with only `size`
// or only `color` set matches any value of the other field.
function variantUnavailable(p, size, color) {
  if (!p.unavailableVariants) return false;
  return p.unavailableVariants.some(function (v) {
    return (!v.size || v.size === size) && (!v.color || v.color === color);
  });
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
  var word = s.match(/^(XXL|XL|Small|Medium|Large|S|M|L)\b/i);
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
  var defColor = p.colors && p.colors.length ? p.colors[0] : null;
  if (p.colors && p.colors.length > 1) {
    colorRow = '<div class="mini-swatches">' + p.colors.map(function (c, i) {
      return '<button type="button" class="mini-swatch' + (i === 0 ? ' active' : '') +
        '" data-color="' + c + '" title="' + c + '" aria-label="Color: ' + c +
        '" style="' + swatchCss(c) + '" onmousedown="event.preventDefault()" onclick="cardSelectColor(event,this,' + p.id + ')"></button>';
    }).join('') + '</div>';
  }
  // Only render a size row when there's actually a choice — single-size
  // products carry long descriptive labels ("Universal — fits all leashes")
  // that would just be noise on a card.
  if (p.sizes && p.sizes.length > 1) {
    var def = lowestVariant(p).size || p.sizes[0];
    sizeRow = '<div class="mini-sizes">' + p.sizes.map(function (s) {
      var oos = variantUnavailable(p, s, defColor);
      return '<button type="button" class="mini-size' + (s === def ? ' active' : '') + (oos ? ' mini-size-oos' : '') +
        '" data-size="' + s + '" title="' + (oos ? s + ' — out of stock in ' + defColor : s) +
        '" onmousedown="event.preventDefault()" onclick="cardSelectSize(event,this,' + p.id + ')">' + shortSizeLabel(s) + '</button>';
    }).join('') + '</div>';
  }
  if (!colorRow && !sizeRow) return '';
  return '<div class="card-opts" onclick="event.stopPropagation()">' + colorRow + sizeRow + '</div>';
}

function cardSelectColor(ev, btn, id) {
  ev.stopPropagation();
  var card = btn.closest('.product-card');
  if (!card) return;
  card.querySelectorAll('.mini-swatch').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  refreshCardSizeAvailability(card, id);

  // Show that color's own product photo instead of the default color's.
  var p = products.find(function (x) { return x.id === id; });
  var color = btn.dataset.color;
  var imgUrl = p ? productImageFor(p, color) : null;
  var imgEl = card.querySelector('.product-img img');
  if (imgUrl && imgEl) imgEl.src = imgUrl;
}

// After a color changes, grey out any size that's out of stock in that color
// and — if the currently-selected size just became unavailable — jump to the
// cheapest size that's still purchasable, re-pricing the card to match.
function refreshCardSizeAvailability(card, id) {
  var p = products.find(function (x) { return x.id === id; });
  if (!p || !p.unavailableVariants) return;
  var colorBtn = card.querySelector('.mini-swatch.active');
  var color = colorBtn ? colorBtn.dataset.color : null;
  var sizeBtns = card.querySelectorAll('.mini-size');
  var activeWasOos = false;
  sizeBtns.forEach(function (btn) {
    var oos = variantUnavailable(p, btn.dataset.size, color);
    btn.classList.toggle('mini-size-oos', oos);
    btn.title = oos ? (btn.dataset.size + ' — out of stock in ' + color) : btn.dataset.size;
    if (oos && btn.classList.contains('active')) activeWasOos = true;
  });
  if (!activeWasOos) return;
  var available = p.sizes.filter(function (s) { return !variantUnavailable(p, s, color); });
  if (!available.length) return;
  var pick = available.reduce(function (best, s) {
    var price = p.sizePrices ? p.sizePrices[s].price : p.price;
    var bestPrice = p.sizePrices ? p.sizePrices[best].price : p.price;
    return price < bestPrice ? s : best;
  }, available[0]);
  sizeBtns.forEach(function (btn) { btn.classList.toggle('active', btn.dataset.size === pick); });
  var sp = p.sizePrices ? p.sizePrices[pick] : null;
  var priceEl = card.querySelector('.product-price');
  if (priceEl) priceEl.innerHTML = variantPriceHtml(sp ? sp.price : p.price, sp ? sp.was : p.was);
}

function cardSelectSize(ev, btn, id) {
  ev.stopPropagation();
  if (btn.classList.contains('mini-size-oos')) {
    showToast('That size is out of stock in this color.');
    return;
  }
  var card = btn.closest('.product-card');
  if (!card) return;
  card.querySelectorAll('.mini-size').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  // Re-price the card instantly from the selected size variant.
  var p = products.find(function (x) { return x.id === id; });
  var priceEl = card.querySelector('.product-price');
  if (!p || !priceEl) return;
  var sp = p.sizePrices ? p.sizePrices[btn.dataset.size] : null;
  priceEl.innerHTML = variantPriceHtml(sp ? sp.price : p.price, sp ? sp.was : p.was);
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
  var sw = card ? card.querySelector('.mini-swatch.active') : null;
  var color = sw && sw.dataset.color ? sw.dataset.color : null;
  if (variantUnavailable(p, size, color)) {
    showToast('That size/color combo is out of stock — pick another.');
    return;
  }
  var item = Object.assign({}, p, { price: price, size: size || '' });
  if (color) item.color = color;
  addToCart(item);
}

// Resolves the photo for one color of a product, falling back to the
// default (first) color's photo, then the emoji when there are no real
// photos at all (e.g. a future product added before its images are set up).
function productImageFor(p, color) {
  if (!p.images) return null;
  return p.images[color] || (p.colors && p.images[p.colors[0]]) || null;
}

function productCard(p) {
  var defColor = p.colors && p.colors.length ? p.colors[0] : null;
  var imgUrl = productImageFor(p, defColor);
  var imgContent = imgUrl
    ? `<img src="${imgUrl}" alt="${p.name}" loading="lazy">`
    : p.emoji;
  return `
    <div class="product-card" id="prodcard-${p.id}" onclick="showProduct(${p.id})">
      <div class="product-img-wrap">
        <div class="product-img">${imgContent}</div>
        <button class="wishlist-btn" data-wid="${p.id}" onclick="event.stopPropagation(); wishlist(${p.id})">${wishlistItems.some(function(w){return w.id===p.id}) ? '♥' : '♡'}</button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-stars"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg> <span>(${p.reviews})</span></div>
        <div class="product-price">${priceDisplayHtml(p)}</div>
        ${cardOptionsHtml(p)}
        <button class="btn-black" onclick="cardAdd(event, ${p.id})">Add To Cart</button>
      </div>
    </div>
  `;
}

// ==================== PRODUCT DETAIL ====================
// Shopify gives exactly one real photo per color variant (no multi-angle
// gallery data is available via the Storefront API for this catalog) — so
// the "gallery" is just that one photo, swapped whenever the color changes.
// No carousel controls are rendered since there's nothing to page between.
function renderDetailGallery(color) {
  var detailImg = document.getElementById('detailImg');
  if (!detailImg || !currentProduct) return;
  var c = color || (currentProduct.colors && currentProduct.colors[0]);
  var mainUrl = productImageFor(currentProduct, c);

  // Slide 1 is always the selected color's own photo; the rest are general/
  // non-color-specific shots from the product's wider Shopify image pool
  // (lifestyle, detail, multi-color) — never another color's own photo.
  var urls = [];
  if (mainUrl) urls.push(mainUrl);
  if (currentProduct.extraImages) urls = urls.concat(currentProduct.extraImages);

  if (!urls.length) {
    detailImg.innerHTML = '<div class="det-carousel"><div class="det-track" id="detTrack"><div class="det-slide">' +
      '<span style="font-size:110px;line-height:1">' + currentProduct.emoji + '</span></div></div></div>';
    return;
  }

  var slidesHtml = urls.map(function (url, i) {
    var alt = currentProduct.name + (i === 0 && c ? ' — ' + c : '');
    return '<div class="det-slide"><img src="' + url + '" alt="' + alt + '"></div>';
  }).join('');

  if (urls.length === 1) {
    // Nothing to page between — no arrows/dots for a single real photo.
    detailImg.innerHTML = '<div class="det-carousel"><div class="det-track" id="detTrack">' + slidesHtml + '</div></div>';
    return;
  }

  detailImg.innerHTML =
    '<div class="det-carousel">' +
      '<div class="det-track" id="detTrack">' + slidesHtml + '</div>' +
      '<button class="det-prev" id="detPrev" aria-label="Previous">&#8249;</button>' +
      '<button class="det-next" id="detNext" aria-label="Next">&#8250;</button>' +
    '</div>' +
    '<div class="det-dots" id="detDots"></div>';
  setTimeout(function () { if (typeof initDetailCarousel === 'function') initDetailCarousel(); }, 30);
}

function showProduct(id, opts) {
  currentProduct = products.find(p => p.id === id);
  currentQty = 1;
  if (!currentProduct) return;

  renderDetailGallery(currentProduct.colors && currentProduct.colors[0]);
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
  currentColor = currentProduct.colors && currentProduct.colors.length ? currentProduct.colors[0] : null;
  currentVariantPrice = cheapest.price;
  setDetailPrice(cheapest.price, cheapest.was);
  var caseNoteEl = document.getElementById('detailCaseNote');
  if (caseNoteEl) {
    if (currentProduct.caseOnlyNote) {
      caseNoteEl.textContent = currentProduct.caseOnlyNote;
      caseNoteEl.style.display = '';
    } else {
      caseNoteEl.style.display = 'none';
    }
  }
  document.getElementById('detailDesc').textContent = currentProduct.desc;
  document.getElementById('detailTagline').textContent = currentProduct.tagline || '';
  document.getElementById('detailReviews').textContent = `(${currentProduct.reviews} reviews)`;
  var reviewsCountEl = document.getElementById('detailReviewsCount');
  if (reviewsCountEl) reviewsCountEl.textContent = currentProduct.reviews + ' reviews';
  document.getElementById('qtyNum').textContent = '1';

  var cats = { walk: 'Walk Essentials', car: 'Car & Travel', treats: 'Health & Treats', home: 'Home & Grooming' };
  document.getElementById('detailCategory').textContent = cats[currentProduct.category] || 'PawHaul';

  document.getElementById('detailSizes').innerHTML = currentProduct.sizes.map((s, i) =>
    `<button class="option-btn ${i===defSizeIdx?'active':''}" onclick="selectSize(this)">${s}</button>`).join('');

  document.getElementById('detailColors').innerHTML = currentProduct.colors.map((c, i) =>
    `<button class="option-btn ${i===0?'active':''}" onclick="selectColorOption(this)">${c}</button>`).join('');

  updateVariantAvailability();

  document.getElementById('detailFeatures').innerHTML = currentProduct.features.map(f =>
    `<li>${f}</li>`).join('');

  var matEl = document.getElementById('detailMaterial');
  if (matEl) matEl.textContent = currentProduct.material || '';
  var boxEl = document.getElementById('detailBox');
  if (boxEl) boxEl.textContent = currentProduct.whatsInBox || '';

  // (Price, "was" and the Save % badge are set by setDetailPrice above,
  //  using the selected size variant.)

  // Every accordion section re-opens to its default state (Description open,
  // the rest closed) on a fresh product view.
  document.querySelectorAll('.pd-acc-item').forEach(function(item, i) {
    item.classList.toggle('open', i === 0);
  });

  document.getElementById('stickyName').textContent = currentProduct.name;
  initStickyAtc();

  // sync:true — showPage('product') must NOT touch the URL itself (see
  // pageToPath's comment); this product owns its own /product/<slug> URL,
  // set right below with the REAL opts (push for a real navigation, sync
  // for the initial-load/back-forward case).
  showPage('product', null, { sync: true });
  navigateUrl('/product/' + slugify(currentProduct.name), opts);
}

function selectOption(btn) {
  btn.closest('.options-row').querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// Color buttons use this instead of selectOption directly: it also tracks
// currentColor and re-checks size availability (some size+color combos are
// marked out of stock — see variantUnavailable()).
function selectColorOption(btn) {
  selectOption(btn);
  currentColor = btn.textContent.trim();
  updateVariantAvailability();
  renderDetailGallery(currentColor);
}

// Greys out any size that's unavailable in the currently-selected color, and
// — if the currently-selected size just became unavailable — jumps to the
// cheapest size that's still purchasable, re-pricing the page to match.
function updateVariantAvailability() {
  if (!currentProduct || !currentProduct.unavailableVariants) return;
  var sizeBtns = document.querySelectorAll('#detailSizes .option-btn');
  var activeWasOos = false;
  sizeBtns.forEach(function (btn) {
    var s = btn.textContent.trim();
    var oos = variantUnavailable(currentProduct, s, currentColor);
    btn.classList.toggle('option-btn-oos', oos);
    btn.title = oos ? ('Out of stock in ' + currentColor) : '';
    if (oos && btn.classList.contains('active')) activeWasOos = true;
  });
  if (!activeWasOos) return;
  var available = currentProduct.sizes.filter(function (s) { return !variantUnavailable(currentProduct, s, currentColor); });
  if (!available.length) return;
  var pick = available.reduce(function (best, s) {
    var price = currentProduct.sizePrices ? currentProduct.sizePrices[s].price : currentProduct.price;
    var bestPrice = currentProduct.sizePrices ? currentProduct.sizePrices[best].price : currentProduct.price;
    return price < bestPrice ? s : best;
  }, available[0]);
  sizeBtns.forEach(function (btn) { btn.classList.toggle('active', btn.textContent.trim() === pick); });
  currentSize = pick;
  var variant = currentProduct.sizePrices ? currentProduct.sizePrices[pick] : null;
  currentVariantPrice = variant ? variant.price : currentProduct.price;
  setDetailPrice(currentVariantPrice, variant ? variant.was : currentProduct.was);
}

// Writes the price, struck-through "was", and Save % badge on the detail page
// (main price block AND the sticky Add To Cart bar, which mirrors it).
// Shared by showProduct (initial render) and selectSize (when the size toggles).
function setDetailPrice(price, was) {
  var priceEl = document.getElementById('detailPrice');
  var wasEl = document.getElementById('detailWas');
  var saveEl = document.querySelector('.save');
  var stickyPriceEl = document.getElementById('stickyPrice');
  if (priceEl) priceEl.textContent = '$' + Number(price).toFixed(2);
  if (wasEl) wasEl.textContent = was ? '$' + Number(was).toFixed(2) : '';
  if (stickyPriceEl) stickyPriceEl.textContent = '$' + Number(price).toFixed(2);
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
  if (btn.classList.contains('option-btn-oos')) {
    showToast('That size is out of stock in this color.');
    return;
  }
  selectOption(btn);
  if (!currentProduct) return;
  currentSize = btn.textContent.trim();
  var variant = currentProduct.sizePrices ? currentProduct.sizePrices[currentSize] : null;
  currentVariantPrice = variant ? variant.price : currentProduct.price;
  setDetailPrice(currentVariantPrice, variant ? variant.was : currentProduct.was);
}

// ==================== DESCRIPTION/REVIEWS/SHIPPING ACCORDION ====================
function togglePdAccordion(btn) {
  btn.closest('.pd-acc-item').classList.toggle('open');
}

// ==================== STICKY ADD TO CART BAR ====================
// Shows once the main "Add To Cart"/"Buy It Now" row scrolls out of view, so
// the action is always reachable without scrolling back up. A plain scroll
// listener (not IntersectionObserver) is deliberate: a fast fling/flick or a
// programmatic scrollTo can jump the anchor from "below the viewport" straight
// to "above the viewport" without the browser ever sampling an intermediate
// "intersecting" frame, so a threshold-crossing observer can silently miss
// the transition entirely (reproduced while testing). Checking the anchor's
// actual position on every scroll tick has no such gap. Re-runs on every
// showProduct() call, removing its previous listener first so re-visits
// never stack up.
var _stickyAtcHandler = null;
function initStickyAtc() {
  var bar = document.getElementById('stickyAtc');
  var anchor = document.querySelector('.detail-btns');
  if (!bar || !anchor) return;

  if (_stickyAtcHandler) window.removeEventListener('scroll', _stickyAtcHandler);
  bar.classList.remove('show');
  document.getElementById('chatWidget') && document.getElementById('chatWidget').classList.remove('chat-lifted');

  function update() {
    // A hidden ancestor (navigated away from the product page) still reports
    // a getBoundingClientRect (just collapsed), so gate on the page itself.
    var onProductPage = document.getElementById('page-product').classList.contains('active');
    var scrolledPast = anchor.getBoundingClientRect().bottom < 0;
    var show = onProductPage && scrolledPast;
    bar.classList.toggle('show', show);
    var chat = document.getElementById('chatWidget');
    if (chat) chat.classList.toggle('chat-lifted', show);
  }
  _stickyAtcHandler = update;
  window.addEventListener('scroll', update, { passive: true });
  update(); // correct initial state immediately, no need to wait for a scroll event
}

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('qtyNum').textContent = currentQty;
}

function addToCartDetail() {
  if (!currentProduct) return false;
  if (variantUnavailable(currentProduct, currentSize, currentColor)) {
    showToast('That size/color combo is out of stock — pick another.');
    return false;
  }
  // Add the selected size variant at its price (falls back to the base price).
  // color is included so checkout can resolve the exact Shopify variant —
  // it isn't shown anywhere in the cart UI, so this changes no visible behavior.
  var item = Object.assign({}, currentProduct, {
    price: (typeof currentVariantPrice === 'number') ? currentVariantPrice : currentProduct.price,
    size: currentSize || '',
    color: currentColor || undefined
  });
  for (var i = 0; i < currentQty; i++) addToCart(item);
  return true;
}

function buyNow() {
  if (addToCartDetail()) showPage('cart');
}

// ==================== CART ====================
function addToCart(product) {
  // Match on id + size + color so different size/color variants are separate
  // line items (each needs to map to its own Shopify variant and show its
  // own photo). Products added without a size/color (e.g. quick-add) just
  // match on id, as before.
  var size = product.size || '';
  var color = product.color || '';
  var existing = cart.find(item => item.id === product.id && (item.size || '') === size && (item.color || '') === color);
  if (existing) { existing.qty++; syncQtyToShopify(existing); }
  else { var newItem = { ...product, qty: 1 }; cart.push(newItem); syncAddToShopify(newItem); }
  updateCartCount();
  showToast(`${product.name} added to cart!`);
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
    container.innerHTML = '<div class="empty-cart"><span class="empty-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="var(--orange)" style="width:52px;height:52px;display:inline-block" aria-hidden="true"><ellipse cx="50" cy="67" rx="20" ry="16"/><ellipse cx="27" cy="47" rx="9" ry="12"/><ellipse cx="42" cy="35" rx="9" ry="12"/><ellipse cx="58" cy="35" rx="9" ry="12"/><ellipse cx="73" cy="47" rx="9" ry="12"/></svg></span><h2>Your pup\'s missing out!</h2><p>Heart any product to save it here</p><button class="btn-primary" onclick="showPage(\'shop\')">Browse Products</button></div>';
    return;
  }
  container.innerHTML = '<div class="products-grid">' + wishlistItems.map(function(p) {
    var wImgUrl = productImageFor(p, p.colors && p.colors[0]);
    var imgContent = wImgUrl ? ('<img src="' + wImgUrl + '" alt="' + p.name + '" loading="lazy">') : p.emoji;
    var inWish = true;
    return '<div class="product-card" onclick="showProduct(' + p.id + ')">' +
      '<div class="product-img-wrap"><div class="product-img">' + imgContent + '</div>' +
      '<button class="wishlist-btn" data-wid="' + p.id + '" style="opacity:1;" onclick="event.stopPropagation();wishlist(' + p.id + ')">♥</button></div>' +
      '<div class="product-info"><div class="product-name">' + p.name + '</div>' +
      '<div class="product-stars"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB800" style="width:1em;height:1em;vertical-align:-0.12em;display:inline-block" aria-hidden="true"><path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg> <span>(' + p.reviews + ' reviews)</span></div>' +
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
  var removed = cart[idx];
  cart.splice(idx, 1);
  syncRemoveFromShopify(removed);
  updateCartCount();
  renderCart();
}

function renderCart() {
  var container = document.getElementById('cartContent');
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:52px;height:52px;display:inline-block" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
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
        ${cart.map((item, idx) => {
          var imgUrl = productImageFor(item, item.color);
          var imgContent = imgUrl ? ('<img src="' + imgUrl + '" alt="' + item.name + '" loading="lazy">') : item.emoji;
          return `
          <div class="cart-item">
            <div class="cart-item-img">${imgContent}</div>
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
        `;
        }).join('')}
      </div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span style="color:var(--green)">FREE</span></div>
        <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <button class="checkout-btn" onclick="checkout()">Checkout Securely →</button>
        <p style="text-align:center;font-size:12px;color:var(--gray);margin-top:14px;font-weight:600">Secure checkout • 30 day returns</p>
      </div>
    </div>`;
}

function updateCartQty(idx, delta) {
  var item = cart[idx];
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  syncQtyToShopify(item);
  updateCartCount();
  renderCart();
}

// Resolves a local cart line to the real Shopify variant GID it corresponds
// to, using that product's shopifyVariants map (see the DATA section above).
// Falls back to the product's first color when a line has no color recorded
// — quick-add and "Add Both/Bundle" never show a color picker, so their
// cart lines never carry one; the detail page's Add To Cart does track it.
function resolveShopifyVariantId(item) {
  var product = products.find(function (p) { return p.id === item.id; });
  if (!product || !product.shopifyVariants) return null;
  var sv = product.shopifyVariants;
  var color = item.color || (product.colors && product.colors[0]) || null;
  if (sv.byVariant) return sv.byVariant[(item.size || '') + '|' + (color || '')] || null;
  if (sv.byColor) return (color && sv.byColor[color]) || null;
  return null;
}

// ==================== SHOPIFY CART PERSISTENCE ====================
// Keeps a real Shopify cart (Storefront API, via /api/cart) in sync with the
// local `cart` array in the background, and restores it on a later visit —
// so a visitor's cart survives closing the tab/browser, tied to their
// specific browser/device via a cart id saved in localStorage (this store
// has no customer login/accounts, so per-device is the correct scope, not
// per-person). The local `cart` array stays the one source of truth driving
// the UI (pricing, variant availability, instant add/remove) — every
// Shopify call here is fire-and-forget and never blocks a click; if a sync
// call fails, checkout() below still reconciles/rebuilds before redirecting,
// so a background hiccup can never send a customer to a wrong checkout.
var SHOPIFY_CART_KEY = 'pawhaul_shopify_cart_id';

function getStoredCartId() {
  try { return localStorage.getItem(SHOPIFY_CART_KEY); } catch (e) { return null; }
}
function setStoredCartId(id) {
  try {
    if (id) localStorage.setItem(SHOPIFY_CART_KEY, id);
    else localStorage.removeItem(SHOPIFY_CART_KEY);
  } catch (e) { /* localStorage unavailable (private mode etc.) — cart just won't persist */ }
}

async function cartApi(payload) {
  try {
    var res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: 'network' };
  }
}

// Finds the Shopify CartLine id /api/cart returned for one merchandise
// variant, so a later quantity change/removal can target that exact line
// instead of re-adding or guessing.
function findShopifyLineId(lines, variantId) {
  if (!lines) return null;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].variantId === variantId) return lines[i].id;
  }
  return null;
}

// All syncXToShopify calls (below) go through this single-file promise
// chain instead of running whenever their caller happens to fire. Without
// it, two near-simultaneous adds with no cart yet (e.g. addBundleToCart's
// forEach over 2+ products, or just clicking Add on two different products
// quickly) would each read getStoredCartId() as empty before the other's
// "create" had a chance to write it back — spawning TWO separate Shopify
// carts and silently losing one of them (confirmed live: exactly this
// happened before this queue was added). Serializing every mutation means
// each one always sees the previous one's finished, saved cart id.
var _cartSyncQueue = Promise.resolve();
function queueCartSync(fn) {
  var next = _cartSyncQueue.then(fn, fn);
  _cartSyncQueue = next;
  return next;
}

// Pushes one newly-added local cart line to Shopify: creates the persistent
// cart on the very first item this browser ever adds, otherwise adds a line
// to the existing one. Stamps item.cartLineId once known (an internal field,
// like item.color — never shown in the cart UI) so future qty/remove calls
// on this exact item know which Shopify line to target.
function syncAddToShopify(item) {
  return queueCartSync(async function () {
    var variantId = resolveShopifyVariantId(item);
    if (!variantId) return; // no Shopify mapping for this product — stays local-only, same as before this feature
    var cartId = getStoredCartId();

    if (cartId) {
      var added = await cartApi({ action: 'addLines', cartId: cartId, lines: [{ variantId: variantId, quantity: item.qty }] });
      if (added && added.ok) { item.cartLineId = findShopifyLineId(added.lines, variantId); return; }
      // Stored id is stale/expired/deleted — drop it and fall through to
      // creating a fresh cart rather than leaving this item un-synced forever.
      setStoredCartId(null);
    }

    var created = await cartApi({ action: 'create', lines: [{ variantId: variantId, quantity: item.qty }] });
    if (created && created.ok) {
      setStoredCartId(created.cartId);
      item.cartLineId = findShopifyLineId(created.lines, variantId);
    }
  });
}

function syncQtyToShopify(item) {
  return queueCartSync(async function () {
    var cartId = getStoredCartId();
    if (!cartId || !item.cartLineId) return; // never successfully synced (e.g. offline when added) — nothing to update
    await cartApi({ action: 'updateLines', cartId: cartId, lines: [{ id: item.cartLineId, quantity: item.qty }] });
  });
}

function syncRemoveFromShopify(item) {
  return queueCartSync(async function () {
    var cartId = getStoredCartId();
    if (!cartId || !item.cartLineId) return;
    await cartApi({ action: 'removeLines', cartId: cartId, lineIds: [item.cartLineId] });
  });
}

// Reverse of shopifyVariants (see the DATA section above): Shopify variant
// GID -> { productId, size, color }, so a restored Shopify cart line can be
// mapped back to a local product. Built once, lazily, since it never changes
// after load (products/catalog are static for the page's lifetime).
var _variantReverseMap = null;
function variantReverseMap() {
  if (_variantReverseMap) return _variantReverseMap;
  var map = {};
  products.forEach(function (p) {
    var sv = p.shopifyVariants;
    if (!sv) return;
    if (sv.byVariant) {
      Object.keys(sv.byVariant).forEach(function (key) {
        var pipeIdx = key.indexOf('|');
        map[sv.byVariant[key]] = { productId: p.id, size: key.slice(0, pipeIdx), color: key.slice(pipeIdx + 1) || undefined };
      });
    } else if (sv.byColor) {
      Object.keys(sv.byColor).forEach(function (color) {
        map[sv.byColor[color]] = { productId: p.id, size: '', color: color };
      });
    }
  });
  _variantReverseMap = map;
  return map;
}

// Current price for a given size, same lookup every add-to-cart path already
// uses (sizePrices[size] when the product has size-based pricing, else the
// flat product price) — used when rebuilding a cart line from a restored
// Shopify cart, where all we have is the variant, not a price.
function priceForVariant(product, size) {
  if (product.sizePrices && size && product.sizePrices[size]) {
    return { price: product.sizePrices[size].price, was: product.sizePrices[size].was };
  }
  return { price: product.price, was: product.was };
}

// Runs once on page load (see the ROUTING bootstrap script in index.html,
// right after dispatchRoute — needs the `products` array and `cart` to
// already exist). Looks up any cart id saved from a previous visit and, if
// it still resolves to a real Shopify cart, repopulates the local `cart`
// array with its contents so a returning visitor sees what they left.
function initCartFromStorage() {
  // Queued through the same chain as every syncXToShopify call (see
  // queueCartSync above) so a click that fires the instant the page becomes
  // interactive can't read/clear the stored cart id concurrently with this.
  return queueCartSync(async function () {
    var cartId = getStoredCartId();
    if (!cartId) return; // first-ever visit, or storage was cleared — normal empty cart

    var result = await cartApi({ action: 'get', cartId: cartId });
    if (!result || !result.ok) {
      setStoredCartId(null); // expired/deleted cart — start clean rather than error out
      return;
    }
    // If the visitor already added something locally before this fetch
    // resolved (fast clicker on a slow connection), don't clobber it — rare
    // edge case, and losing a restore in that exact race is far better than
    // losing what they just did on purpose.
    if (cart.length > 0) return;

    var reverseMap = variantReverseMap();
    (result.lines || []).forEach(function (line) {
      var local = line.variantId && reverseMap[line.variantId];
      if (!local) return; // variant no longer maps to a current product (renamed/discontinued since) — skip it, don't crash
      var product = products.find(function (p) { return p.id === local.productId; });
      if (!product) return;
      var priced = priceForVariant(product, local.size);
      var item = Object.assign({}, product, {
        qty: line.quantity,
        size: local.size || '',
        price: priced.price,
        cartLineId: line.id
      });
      if (local.color) item.color = local.color;
      cart.push(item);
    });

    updateCartCount();
    var cartPage = document.getElementById('page-cart');
    if (cartPage && cartPage.classList.contains('active')) renderCart();
  });
}

// True when a Shopify cart's lines exactly match the local cart's resolved
// lines (same variants, same quantities) — used by checkout() to decide
// whether the already-synced cart is safe to reuse as-is.
function cartMatchesLines(shopifyLines, localLines) {
  if (!shopifyLines || shopifyLines.length !== localLines.length) return false;
  var counts = {};
  shopifyLines.forEach(function (l) { counts[l.variantId] = (counts[l.variantId] || 0) + l.quantity; });
  return localLines.every(function (l) { return counts[l.variantId] === l.quantity; });
}

// Redirects to Shopify's own hosted checkout so the order lands in Shopify/
// DSers for fulfillment. Reuses the persistent cart kept in sync by the
// SHOPIFY CART PERSISTENCE functions above whenever it still matches what's
// on screen — avoids spawning a second, separate Shopify cart on every
// checkout. Falls back to building a brand-new cart from the current local
// lines if there's no synced cart yet, or if it's drifted out of sync for
// any reason (a background sync call failing silently, etc.) — sync is
// best-effort, but checkout must never be wrong about what a customer pays for.
async function checkout() {
  if (!cart.length) return;
  var btn = document.querySelector('.checkout-btn');

  var lines = [];
  var unresolved = [];
  cart.forEach(function (item) {
    var variantId = resolveShopifyVariantId(item);
    if (variantId) lines.push({ variantId: variantId, quantity: item.qty });
    else unresolved.push(item.name);
  });

  if (unresolved.length) {
    showToast('Sorry, ' + unresolved.join(', ') + " can't be checked out right now — please remove and try again.", 5000);
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Preparing checkout...'; }
  showToast('Redirecting to secure checkout...');

  try {
    var cartId = getStoredCartId();
    var data = null;
    if (cartId) {
      var existing = await cartApi({ action: 'get', cartId: cartId });
      if (existing && existing.ok && cartMatchesLines(existing.lines, lines)) data = existing;
    }
    if (!data) {
      data = await cartApi({ action: 'create', lines: lines });
      if (data && data.ok) setStoredCartId(data.cartId);
    }

    if (data && data.ok && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }
    if (btn) { btn.disabled = false; btn.textContent = 'Checkout Securely →'; }
    showToast((data && data.error) || 'Could not start checkout — please try again.', 5000);
  } catch (e) {
    if (btn) { btn.disabled = false; btn.textContent = 'Checkout Securely →'; }
    showToast('Could not start checkout — please try again.', 5000);
  }
}

// ==================== FILTERS ====================
function filterProducts(filter, btn) {
  currentShopFilter = filter || 'all';
  document.querySelectorAll('.shop-filters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderShopProducts(currentShopFilter);
  // replace (not push): switching filter pills WHILE already on Shop keeps
  // the URL correct for reload/sharing without spamming back-button history
  // with every pill click.
  navigateUrl(pageToPath('shop', currentShopFilter), { replace: true });
}

// Navigate from a search result straight to that product's own detail page.
function goToProduct(id) {
  closeSearch();
  showProduct(id);
}

// ==================== UI HELPERS ====================
function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}

// Jump from Contact's "quick answers" links to a specific FAQ item on the
// home page, opening it so the answer is visible without another click.
function goToFaq(itemId) {
  showPage('home');
  setTimeout(function() {
    var el = document.getElementById(itemId);
    if (!el) return;
    el.classList.add('open');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 140);
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
    showToast('Please enter a valid email!');
    return;
  }
  if (!EMAILJS_PUBLIC_KEY) {
    showToast('Your code: ' + DISCOUNT_CODE + ' — 10% off your order!');
    input.value = '';
    return;
  }
  var btn = document.querySelector('.email-submit');
  if (btn) btn.disabled = true;
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_WELCOME_TEMPLATE, {
    to_email: email,
    discount_code: DISCOUNT_CODE
  }).then(function() {
    showToast('10% off code sent to your email!');
    input.value = '';
    if (btn) btn.disabled = false;
  }).catch(function() {
    showToast('Your code is: ' + DISCOUNT_CODE + ' — 10% off!');
    input.value = '';
    if (btn) btn.disabled = false;
  });
}

function submitContact() {
  var inputs = document.querySelectorAll('#page-contact .form-input, #page-contact .form-textarea');
  var allFilled = true;
  inputs.forEach(function(el) { if (!el.value.trim()) allFilled = false; });
  if (!allFilled) { showToast('Please fill in all fields!'); return; }

  var formInputs = document.querySelectorAll('#page-contact .form-input');
  var firstName  = formInputs[0] ? formInputs[0].value.trim() : '';
  var lastName   = formInputs[1] ? formInputs[1].value.trim() : '';
  var fromEmail  = formInputs[2] ? formInputs[2].value.trim() : '';
  var subject    = document.querySelector('#page-contact .form-select');
  subject = subject ? subject.value : 'General Inquiry';
  var message    = document.querySelector('#page-contact .form-textarea');
  message = message ? message.value.trim() : '';

  if (!EMAILJS_PUBLIC_KEY) {
    showToast('Message sent! We\'ll reply within 24 hours.');
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
    showToast('Message sent! We\'ll reply within 24 hours.');
    inputs.forEach(function(el) { el.value = ''; });
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  }).catch(function() {
    showToast('Something went wrong. Email us at pawhaulsupport@gmail.com');
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  });
}

// ==================== INIT ====================
renderHomeProducts();
