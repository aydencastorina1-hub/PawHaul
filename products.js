// ==================== DATA ====================
var products = [
  {
    id: 1, name: "2-in-1 Dog Water Bottle", emoji: "🧴", image: "", category: "water",
    badge: "Best Seller", badgeClass: "", reviews: 127,
    desc: "Keep your dog hydrated and fed on every walk with this portable 2-in-1 bottle. The leak-proof design holds both water and dry food in one sleek container, with a flip-out drinking spout for easy on-the-go hydration. Lightweight, durable, and perfect for walks, hikes, and travel.",
    tagline: "Water and food in one leak-proof bottle — never cut a walk short again.",
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "Halfway through the walk with a thirsty dog?",
    solution: "One bottle carries the water and the food, and the spout folds out into a bowl that pours and drains in a second.",

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
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "Leash always too short, or way too long?",
    solution: "Let out slack on the quiet stretch and lock it short at the kerb, all with one thumb on the button.",

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
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "Water to give, and nothing to pour it into?",
    solution: "Folds flat to the size of a coaster and clips onto the leash, so there is always a bowl on you.",
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
    id: 5, name: "Poop Bag Clip", price: 9.99, was: 14.99, emoji: "🧷", image: "", category: "leash",
    badge: "New", badgeClass: "badge-new", reviews: 67,
    desc: "Never fumble with a bag of waste on your walk again. This hands-free clip holds used poop bags securely so you can keep both hands free while walking your dog. Lightweight and compact, it clips easily onto any leash or belt for a quick, hygienic cleanup every time.",
    tagline: "Hands-free carrying for used bags, every walk.",
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "Stuck carrying a full bag the whole way home?",
    solution: "Thread the knot through the clip and it hangs off the leash, so your hands are free again.",
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
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "Your dog vanishes the moment it gets dark?",
    solution: "A rechargeable ring of light makes them visible to drivers and cyclists long before you are.",
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
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "Reached for a bag and found the roll empty?",
    solution: "A canvas pouch clips to the leash and keeps a whole roll where you can grab one without stopping.",
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
  },
  {
    // Sourcing note (NOT surfaced in the UI): the supplier listing shows 4.9
    // stars and 3,000+ sold. The site deliberately has no per-product supplier
    // rating field — star ratings come only from real customer reviews via
    // /api/reviews — so this stays a comment, same as the id 7 listing did.
    id: 9, name: "Anti-Drop Leash Wrist Strap", price: 8.99, was: 13.99, emoji: "🔗", image: "", category: "leash",
    // Genuinely belongs in two aisles: it is a leash accessory AND a
    // loss-prevention/safety item. `category` stays the PRIMARY one (it drives
    // the breadcrumb, the detail-page eyebrow and the Merchant Center product
    // type, all of which need a single value); `categories` is what filtering
    // and search read. Any product without this field just uses `category`.
    categories: ["leash", "safety"],
    badge: "New", badgeClass: "badge-new",
    desc: "Never worry about dropping the leash mid-walk again. This adjustable wrist strap clips onto your dog's leash so if it ever slips from your hand, it stays safely secured to your wrist — not your dog running off. Simple, lightweight, and fits any walk.",
    tagline: "If the leash slips, it stays on your wrist.",
    // "The problem it solves" copy — shown on the home carousel and on
    // this product's own page. Specific to what this product actually
    // fixes on a real walk, not generic marketing filler.
    problem: "One hard tug away from losing the leash?",
    solution: "The strap keeps the handle secured to your wrist even if it gets pulled clean out of your hand.",
    // Single option in Shopify (Color only). A non-empty sizes array is
    // required — showProduct() maps over it unconditionally — and a lone size
    // is hidden from the size picker on the detail page.
    sizes: ["Universal — adjustable, fits any leash"],
    colors: ["Green", "Black", "Gray", "Brown", "Pink", "Purple"],

    // Search matches name/category/desc, none of which contain the phrases
    // people actually type for this thing.
    tags: ["wrist strap", "wristband", "anti drop", "anti-drop", "hands free leash", "leash strap", "dog walking strap"],

    // The six variant-assigned Shopify photos — one clean white-background
    // studio shot per colour. The wider 28-image pool was audited and four
    // images were rejected outright: a multi-strap collage, a shot with a
    // misspelled text overlay ("Porvides"), one with a burned-in
    // "22cm/8.6inch" measurement diagram, and one stamped "4Pcs" (which would
    // imply a four-pack). No Chinese text was present anywhere in this pool.
    images: {
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sb2ac92f1728c4d60b6b829cb49350f44o.webp?width=900",
      "Black": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sb0cde838dcae46548021fd92b632f2caN.webp?width=900",
      "Gray": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S677376f94420460abab02ced06ed2667M.webp?width=900",
      "Brown": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/Sa66f58d267df4b3b9cdb14e68d83e891z.webp?width=900",
      "Pink": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S7dc7107a6f8a466bb78a46f2a05bf3c05_2ec00128-e5e9-41e5-9145-12481b27a139.webp?width=900",
      "Purple": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S9d3b04c34a364c71954fe739a24ee96eN_725b41ce-da4f-4f49-bc90-dbefbc05d203.webp?width=900"
    },

    // Extra gallery slides: all three show the strap actually in use on a
    // wrist with a retractable leash, which is the whole point of the product
    // and is not obvious from a studio shot of a loop of cord.
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S6f41f4569a8b4c66812bd7c76ca26683D.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S0d26b16360be468a904ee320f7f3f001m.webp?width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/S142247eaa0d94974a8e4f61798de608b4.webp?width=900"
    ],

    // Real Shopify variant GIDs (Storefront API) for checkout. Every one of
    // these was confirmed with a real cartCreate before being written here.
    shopifyVariants: { productGid: "gid://shopify/Product/9608724742400", byColor: {
        "Green": "gid://shopify/ProductVariant/49180679176448",
        "Black": "gid://shopify/ProductVariant/49180679045376",
        "Gray": "gid://shopify/ProductVariant/49180679143680",
        "Brown": "gid://shopify/ProductVariant/49180679241984",
        "Pink": "gid://shopify/ProductVariant/49180679209216",
        "Purple": "gid://shopify/ProductVariant/49180679110912"
      } },

    features: [
      "Keeps the leash secured to your wrist if it slips",
      "Adjustable — tightens to fit any wrist",
      "Clips onto any leash, retractable or standard",
      "Lightweight braided cord, barely noticeable to wear",
      "Frees up your grip without letting go of your dog",
      "6 colors to choose from"
    ],
    material: "Braided nylon paracord · Adjustable slide · Metal clip",
    whatsInBox: "1× Anti-Drop Leash Wrist Strap"
  }
];

// ==================== EMAILJS CONFIG ====================
// Step 1: Sign up free at emailjs.com
// Step 2: Add a Gmail service, copy the Service ID below
// Step 3: Create the contact template (see instructions), copy its ID below
// Step 4: Go to Account > API Keys, copy your Public Key below
// EmailJS now backs the CONTACT FORM ONLY. The 10% off box and the offer popup
// both go through /api/customer (Shopify) instead — see submitEmail below.
var EMAILJS_PUBLIC_KEY    = 'Ejew9NO0SiQgXbDAU';
var EMAILJS_SERVICE_ID    = 'service_qqcrtoe';
var EMAILJS_CONTACT_TEMPLATE = 'template_t5ark9a';
var DISCOUNT_CODE = 'WELCOME10';   // Your 10% off code (change this anytime) — also shown by the offer popup

// ==================== TRUST / PAYMENT SIGNALS ====================
// EVERY signal here is verified against the real store — nothing decorative,
// nothing aspirational. Two independent sources were used:
//
//   1. /api/shop  -> shop.paymentSettings.acceptedCardBrands reported
//      VISA, MASTERCARD, AMERICAN_EXPRESS, DISCOVER, DINERS_CLUB.
//   2. The REAL checkout page for a real cart was loaded and read, because
//      paymentSettings alone is misleading: it reported
//      shopifyPaymentsAccountId as null (which would suggest Shop Pay is
//      off) while the live checkout in fact offers Shop Pay as its first
//      express option. It also OMITS PayPal and Venmo entirely, since those
//      are PayPal-provided rather than Shopify digital wallets.
//
// Shown: the four card networks a US shopper will actually recognise, plus
// the two express methods that render on every device. DELIBERATELY LEFT OUT
// to keep the row honest and uncluttered rather than maximal:
//   - Diners Club: accepted, but vanishingly rare in this market.
//   - Apple Pay:   real, but only ever renders on Apple devices/Safari, so a
//                  static badge would be a lie on most of the traffic.
//   - Venmo/Google Pay: real, but they push the row past the point where it
//                  reads as reassurance instead of clutter.
// Re-check with `curl https://pawhaul.vercel.app/api/shop` if payment
// providers change in the Shopify admin.
var STORE_URL = 'https://pawhaul.myshopify.com';

// Small, restrained marks. Deliberately NOT full-colour reproductions of each
// brand's logo — approximating trademarked artwork badly looks cheaper than
// not using it, and a row of six saturated logos fights the navy/orange
// palette. Each is the brand's own colour on a neutral chip.
var PAYMENT_MARKS = [
  { name: 'Visa', svg:
    '<rect width="34" height="22" rx="3" fill="#fff" stroke="#E3E0D9"/>' +
    '<text x="17" y="15.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="9.5" font-weight="700" font-style="italic" fill="#1434CB">VISA</text>' },
  { name: 'Mastercard', svg:
    '<rect width="34" height="22" rx="3" fill="#fff" stroke="#E3E0D9"/>' +
    '<circle cx="14" cy="11" r="6" fill="#EB001B"/><circle cx="20" cy="11" r="6" fill="#F79E1B" fill-opacity="0.85"/>' },
  { name: 'American Express', svg:
    '<rect width="34" height="22" rx="3" fill="#006FCF"/>' +
    '<text x="17" y="14.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="7" font-weight="700" fill="#fff">AMEX</text>' },
  // The ball sits AFTER the wordmark, as it does in the real Discover logo —
  // centring the text and dropping a circle at x=26 overlapped the final "C".
  { name: 'Discover', svg:
    '<rect width="34" height="22" rx="3" fill="#fff" stroke="#E3E0D9"/>' +
    '<text x="4" y="14.3" font-family="Arial,Helvetica,sans-serif" font-size="6.2" font-weight="700" fill="#4D4D4D">DISC</text>' +
    '<circle cx="27.5" cy="11" r="4" fill="#FF6000"/>' },
  { name: 'Shop Pay', svg:
    '<rect width="34" height="22" rx="3" fill="#5A31F4"/>' +
    '<text x="17" y="14.8" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="700" fill="#fff">shop</text>' },
  { name: 'PayPal', svg:
    '<rect width="34" height="22" rx="3" fill="#fff" stroke="#E3E0D9"/>' +
    '<text x="17" y="14.8" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="7.5" font-weight="700" fill="#003087">PayPal</text>' }
];

function paymentMarksHtml() {
  return PAYMENT_MARKS.map(function (m) {
    return '<svg class="pay-mark" viewBox="0 0 34 22" role="img" aria-label="' + m.name + '">' +
      '<title>' + m.name + '</title>' + m.svg + '</svg>';
  }).join('');
}

var LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

// One component, used on both the cart and the product page. `variant`
// controls how much it says: the cart is where payment actually matters, the
// product page gets the quieter one-line version.
function trustBadgesHtml(variant) {
  var full = variant === 'full';
  return '<div class="trust-badges' + (full ? ' trust-badges--full' : '') + '">' +
    '<p class="trust-badges-line">' + LOCK_SVG +
      '<span>Secure checkout powered by <strong>Shopify</strong></span></p>' +
    '<div class="pay-marks">' + paymentMarksHtml() + '</div>' +
    (full ? '<p class="trust-badges-note">Payment is taken by Shopify — this site never sees your card details.</p>' : '') +
    '</div>';
}

// The checkout button's label lives in its own span so a status change
// ("Preparing checkout...") can't wipe out sibling markup inside the button.
function setCheckoutBtnLabel(btn, text) {
  var label = btn.querySelector('.checkout-btn-label');
  if (label) label.textContent = text; else btn.textContent = text;
}

// ---- Buy with Shop Pay (real accelerated checkout) ----------------------
// <shop-pay-button> is Shopify's own custom element. Verified working for
// THIS store from a plain non-Shopify origin with nothing but the script
// below — no app install, no extra Storefront API scope, no Shop Pay Wallet
// plan. (The separate "Shop Pay Component"/ShopPayPaymentRequestSession API
// in Shopify's docs is a different, heavier product and is NOT needed here.)
//
// It takes a literal variant list and opens its own accelerated checkout, so
// it deliberately does NOT reuse the synced Shopify cart id. That is safe
// here only because nothing is ever attached to the cart server-side — the
// WELCOME10 discount is typed in by the customer at checkout, and no cart
// attributes/notes are set. If cart-level discounts are ever added, this
// button must be revisited or it will silently drop them.
//
// Rendered only when every line resolves to a real Shopify variant; a cart
// that can't be fully resolved falls back to the standard button alone,
// which is the same guard checkout() applies.
function shopPayVariantList() {
  if (!cart.length) return '';
  var parts = [];
  for (var i = 0; i < cart.length; i++) {
    var gid = resolveShopifyVariantId(cart[i]);
    if (!gid) return '';
    var numeric = String(gid).split('/').pop();
    if (!/^\d+$/.test(numeric)) return '';
    parts.push(numeric + ':' + cart[i].qty);
  }
  return parts.join(',');
}

function shopPayBlockHtml() {
  var variants = shopPayVariantList();
  if (!variants) return '';
  // The wrapper carries a fixed height in CSS. The custom element is unknown
  // to the browser until the module lands from Shopify's CDN, and an unknown
  // element is an inline 0-height box — without reserved space the whole
  // summary below it would jump once the button upgrades.
  return '<div class="shop-pay-or"><span>or</span></div>' +
    '<div class="shop-pay-wrap">' +
      '<shop-pay-button store-url="' + STORE_URL + '" variants="' + variants + '"></shop-pay-button>' +
    '</div>';
}

// Loaded on demand, never at boot: it is ~16 module chunks from Shopify's CDN
// and only the cart page has anything to show it on.
var shopPayLoaded = false;
function loadShopPay() {
  if (shopPayLoaded || !document.querySelector('shop-pay-button')) return;
  shopPayLoaded = true;
  var s = document.createElement('script');
  s.type = 'module';
  s.src = 'https://cdn.shopify.com/shopifycloud/shop-js/modules/v2/loader.pay-button.esm.js';
  s.onerror = function () {
    // Shopify unreachable/blocked — drop the reserved space rather than leave
    // an empty gap and an orphaned "or" divider above it.
    document.querySelectorAll('.shop-pay-wrap, .shop-pay-or').forEach(function (el) { el.remove(); });
  };
  document.head.appendChild(s);
}

// EmailJS is initialised LAZILY — the first time a form actually sends. It used
// to run here, at the top level, which forced its <script> tag to load (render-
// blocking, from a third-party CDN) BEFORE this file could execute. The browser
// paints while that CDN request is in flight, so every visitor saw the product
// grids in their un-rendered state for as long as jsdelivr took to answer.
// Nothing on first paint needs EmailJS, so it's deferred and initialised here
// on demand instead. Returns false when it isn't configured/available.
var __emailjsReady = false;
function ensureEmailjs() {
  if (!EMAILJS_PUBLIC_KEY || typeof emailjs === 'undefined') return false;
  if (!__emailjsReady) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    __emailjsReady = true;
  }
  return true;
}
// True in the (very short) window where EmailJS IS configured but its deferred
// script hasn't arrived yet — so a send can never silently report success.
function emailjsPending() { return !!EMAILJS_PUBLIC_KEY && typeof emailjs === 'undefined'; }

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
  if (page === 'blog') return '/blog';
  // 'product' and 'blog-post' own their own URLs (showProduct / showPost) —
  // they need a slug, not just a page name, so they are never routed here.
  return null;
}

// opts.sync: this is the browser CORRECTING us to match a URL it already
// has (initial load, or popstate back/forward) — never push a new history
// entry, just normalize the address bar via replaceState.
// opts.replace: an explicit non-sync replace (e.g. filter pills — see
// filterProducts()) — updates the URL without growing browser history.
// default: a real user-driven navigation — pushState (adds a back-button step).
// Which nav entry should read as "you are here" for a given path. Product
// pages count as Shop and a blog post counts as Blog — the section is what a
// nav highlight is for, not the exact URL.
function navKeyFor(path) {
  var p = String(path || '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  if (p === '/shop' || p.indexOf('/shop/') === 0 || p.indexOf('/product/') === 0) return 'shop';
  if (p === '/blog' || p.indexOf('/blog/') === 0) return 'blog';
  if (p === '/about') return 'about';
  if (p === '/contact') return 'contact';
  if (p === '/wishlist') return 'wishlist';
  return ''; // /cart and anything unknown highlight nothing
}

// Drives the active state on BOTH the desktop nav and the mobile menu (they
// share the data-nav attribute). This cannot be done with the html.route-*
// classes the <head> sets: showPage() strips those the moment client-side
// routing takes over, so they only ever describe the first page loaded.
function markActiveNav(path) {
  var key = navKeyFor(path);
  var els = document.querySelectorAll('[data-nav]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var on = el.getAttribute('data-nav') === key;
    el.classList.toggle('is-active', on);
    if (on) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  }
}

function navigateUrl(path, opts) {
  opts = opts || {};
  if (!path) return;
  // Before the early returns below: the destination is known here on every
  // call, including the ones that don't end up touching history at all.
  markActiveNav(path);
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
  if (route.type === 'post') {
    // showPost lives in app.js (blog rendering sits with the other content
    // rendering there). Both files have loaded by the time anything calls
    // dispatchRoute, but guard anyway so a load failure degrades to Home
    // instead of throwing.
    if (typeof showPost === 'function' && showPost(route.slug, opts)) return;
    showPage('home', null, opts);
    if (opts && opts.sync) history.replaceState({ p: 1 }, '', '/');
    return;
  }
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
// One-time pre-paint route class (see the ROUTING <head> script in
// index.html) that forces the direct-load page visible via an ID-selector
// !important rule, before styles.css/JS are even ready. It must be stripped
// the moment real navigation takes over — otherwise that !important rule
// keeps pinning the ORIGINAL load page's display forever, even after this
// function removes/adds .active on the correct elements, so every nav
// button/link appears stuck showing whatever page a hard reload landed on.
var ROUTE_BOOTSTRAP_CLASSES = ['route-home', 'route-shop', 'route-contact', 'route-about', 'route-wishlist', 'route-cart', 'route-product', 'route-blog', 'route-blog-post'];

function showPage(page, filter, opts) {
  document.documentElement.classList.remove.apply(document.documentElement.classList, ROUTE_BOOTSTRAP_CLASSES);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-transition'));
  document.getElementById('page-' + page).classList.add('active', 'page-transition');
  // Use instant so smooth-scroll CSS doesn't animate page transitions. The
  // actual scrollTo(0,0) is deliberately NOT called synchronously here (it
  // used to be) — on iOS Safari, changing scrollY synchronously inside the
  // very same tap/click handler that triggered navigation (e.g. tapping a
  // product card while the previous page was scrolled down) gets bundled
  // into that touch's own gesture by the OS, and the very next distinct tap
  // — typically Add To Cart on the page that just opened — gets silently
  // swallowed as though it were settling the scroll, not a real click,
  // until an unrelated tap/scroll elsewhere gives the browser a clean
  // gesture to process. requestAnimationFrame runs before the next paint
  // (so there's still no visible flash of the old scroll position — the
  // reset lands before anything is ever drawn at the wrong offset) but
  // outside the click handler's own call stack, which is enough to stop
  // iOS from treating the two taps as one gesture.
  document.documentElement.style.scrollBehavior = 'auto';

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
  // The server already put the post cards in #blogIndex for a direct /blog
  // load; this re-render covers in-site navigation to it (and a JS-only
  // client that never saw the server markup). Same markup either way.
  if (page === 'blog' && typeof renderBlogIndex === 'function') renderBlogIndex();

  // page==='product' is deliberately NOT routed here — showProduct() (which
  // is the only caller that ever passes 'product') owns that URL itself,
  // since it needs the product's slug, not just the page name.
  navigateUrl(pageToPath(page, filter), opts);

  // The actual scroll-to-top + restoring smooth scrolling for user swipes —
  // see the comment above for why this waits for the next frame instead of
  // running inline in showPage()'s own (possibly tap-triggered) call stack.
  requestAnimationFrame(function() {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  });
}

// ==================== RENDER PRODUCTS ====================
// NOTE: both grids ship static loading-skeleton cards in index.html that
// reserve the exact height these renders will produce (see the LOADING
// SKELETON comments there). If you change the featured list below, the
// product catalogue, a product's colours or its sizes, update the skeletons
// to match — otherwise the page starts jumping on load again.
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

// ---- "The problem it solves" home carousel -----------------------------
// One slide per product that has problem/solution copy, in catalogue order.
// Rendered from JS (not static markup) so each slide reuses the same
// per-colour photo the cards and detail page use; the track has a CSS
// min-height so the space is reserved before this runs.
function renderProblemCarousel() {
  var track = document.getElementById('problemCarousel');
  if (!track) return;
  var slides = products.filter(function (p) { return p.problem && p.solution; });
  track.innerHTML = slides.map(function (p) {
    var img = productImageFor(p, p.colors && p.colors[0]);
    var media = img
      ? '<img loading="lazy" src="' + img + '" alt="' + reviewsEscape(p.name) + '">'
      : '<span class="prob-emoji">' + p.emoji + '</span>';
    // Clickable card rather than a link, matching the product cards: keeps
    // modifier-click behaviour consistent and avoids nesting interactive
    // content, and showProduct() still writes a real /product/<slug> URL.
    return '<article class="prob-slide" onclick="showProduct(' + p.id + ')">' +
        '<div class="prob-slide-img">' + media + '</div>' +
        '<div class="prob-slide-body">' +
          '<p class="prob-kicker">' + reviewsEscape(p.name) + '</p>' +
          '<h3 class="prob-head">' + reviewsEscape(p.problem) + '</h3>' +
          '<p class="prob-copy">' + reviewsEscape(p.solution) + '</p>' +
          '<span class="prob-link">See how it works &rarr;</span>' +
        '</div>' +
      '</article>';
  }).join('');
  // initCarousel lives in app.js, which loads after this file — same deferred
  // hook renderHomeProducts() uses.
  setTimeout(function () {
    if (typeof initCarousel === 'function') initCarousel('problemCarousel', 'probCarPrev', 'probCarNext');
  }, 50);
}

// Single-product version of the same framing, on the product page.
function renderDetailProblem() {
  var el = document.getElementById('detailProblem');
  if (!el) return;
  if (!currentProduct || !currentProduct.problem || !currentProduct.solution) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML =
    '<p class="prob-detail-kicker">The problem it solves</p>' +
    '<h3 class="prob-detail-head">' + reviewsEscape(currentProduct.problem) + '</h3>' +
    '<p class="prob-detail-copy">' + reviewsEscape(currentProduct.solution) + '</p>';
}

// A product can legitimately sit in more than one aisle (the Anti-Drop Leash
// Wrist Strap is both a leash accessory and a safety/loss-prevention item), so
// membership is read from `categories` when present and falls back to the
// single `category` otherwise. Everything that filters or searches by category
// goes through these two helpers so the rules can't drift apart.
function productCategories(p) {
  if (!p) return [];
  if (Array.isArray(p.categories) && p.categories.length) return p.categories;
  return p.category ? [p.category] : [];
}

function productInCategory(p, f) {
  if (!f || f === 'all') return true;
  return productCategories(p).indexOf(f) !== -1;
}

function renderShopProducts(filter) {
  var container = document.getElementById('shopProducts');
  if (!container) return;
  var f = filter || 'all';
  var filtered = (f === 'all') ? products.slice() : products.filter(function(p) { return productInCategory(p, f); });
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
  black: '#15151F', coffee: '#6F4E37', orange: '#E8630A',
  // Added for the Anti-Drop Leash Wrist Strap's colourway. Without these,
  // "Brown" and "Purple" fell through to the #CCCCCC fallback — Brown would
  // have rendered as a grey circle sitting next to the strap's real Gray.
  // Note: adding `purple` also corrects the Poop Bag Clip's Purple swatch,
  // which was silently grey for the same reason. ("White" is still missing and
  // still falls back for the Bowl/Leash — left alone, out of scope here.)
  brown: '#8B5E3C', purple: '#7C3AED'
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

// Card Add To Cart: adds whatever size/color the card currently has
// selected (falls back to the cheapest variant, same as quickAdd).
// Cards carry no colour/size pickers any more, so an add from a card always
// uses the product's DEFAULTS — the same ones the card itself is showing:
// the first colour (whose photo is on the card) and the cheapest size (whose
// price is on the card). Adding anything else would charge a price the
// customer never saw.
//
// The defaults are in stock for every product today, but if a default ever
// goes out of stock this steps to the cheapest size that is still available
// for that colour rather than dead-ending on a toast.
function defaultCardVariant(p) {
  var color = (p.colors && p.colors.length) ? p.colors[0] : null;
  var v = lowestVariant(p);
  if (!variantUnavailable(p, v.size || '', color)) {
    return { size: v.size || '', price: v.price, color: color };
  }
  var sizes = (p.sizes || []).slice().sort(function (a, b) {
    var pa = p.sizePrices && p.sizePrices[a] ? p.sizePrices[a].price : p.price;
    var pb = p.sizePrices && p.sizePrices[b] ? p.sizePrices[b].price : p.price;
    return pa - pb;
  });
  for (var i = 0; i < sizes.length; i++) {
    if (!variantUnavailable(p, sizes[i], color)) {
      var sp = p.sizePrices ? p.sizePrices[sizes[i]] : null;
      return { size: sizes[i], price: sp ? sp.price : p.price, color: color };
    }
  }
  return null;
}

function cardAdd(ev, id) {
  if (ev) ev.stopPropagation();
  var p = products.find(function (x) { return x.id === id; });
  if (!p) return;
  var v = defaultCardVariant(p);
  if (!v) {
    showToast('That one is out of stock right now.');
    return;
  }
  var item = Object.assign({}, p, { price: v.price, size: v.size });
  if (v.color) item.color = v.color;
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
        ${cardRatingHtml(p)}
        <div class="product-price">${priceDisplayHtml(p)}</div>
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

  // The dot row ships WITH its dots already in it (first one active), rather
  // than as an empty div for initDetailCarousel() to fill on its 30ms timer.
  // An empty .det-dots is exactly one dot shorter than a filled one (8px —
  // it's a padding-only flex row), so filling it a paint later made this
  // whole block shrink then re-grow, jolting the colour swatches, sizes,
  // price and Add To Cart button 8px up and back on every colour tap. That
  // was the "screen shakes when selecting a colour" bug. styles.css also
  // carries a min-height on .det-dots as a structural backstop.
  var dotsHtml = urls.map(function (_, i) {
    return '<span class="det-dot' + (i === 0 ? ' active' : '') + '"></span>';
  }).join('');

  detailImg.innerHTML =
    '<div class="det-carousel">' +
      '<div class="det-track" id="detTrack">' + slidesHtml + '</div>' +
      '<button class="det-prev disabled" id="detPrev" aria-label="Previous">&#8249;</button>' +
      '<button class="det-next" id="detNext" aria-label="Next">&#8250;</button>' +
    '</div>' +
    '<div class="det-dots" id="detDots">' + dotsHtml + '</div>';
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
  // Rating text/stars are set from REAL data by syncDetailRating(); renderReviews()
  // fills the section and calls it once the fetch lands.
  syncDetailRating(currentProduct.id);
  renderReviews(currentProduct.id);
  renderDetailProblem();
  document.getElementById('qtyNum').textContent = '1';
  renderDetailShopPay();

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

  var trustEl = document.getElementById('detailTrustBadges');
  if (trustEl && !trustEl.childElementCount) trustEl.innerHTML = trustBadgesHtml('compact');

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
  renderDetailShopPay();
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
  renderDetailShopPay();
}

// ==================== DESCRIPTION/REVIEWS/SHIPPING ACCORDION ====================
function togglePdAccordion(btn) {
  btn.closest('.pd-acc-item').classList.toggle('open');
}

// ==================== STICKY ADD TO CART BAR ====================
// Shows once the main Add To Cart / Shop Pay row scrolls out of view, so
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
  // The Shop Pay button carries the quantity in its variants attribute.
  renderDetailShopPay();
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

// ---- Shop Pay on the product page --------------------------------------
// Replaces the old "Buy It Now", which only did addToCartDetail() + navigate
// to the cart. This is Shop Pay's real accelerated checkout for the single
// variant currently selected, using the same <shop-pay-button> element and
// loader already proven on the cart page (see shopPayBlockHtml above).
//
// Returns '' — which renders nothing at all — when the variant can't be
// resolved to a real Shopify variant or that exact combo is out of stock, so
// the customer can never be sent to a checkout that would reject them. The
// ordinary Add To Cart button is untouched in every case.
function detailShopPayVariants() {
  if (!currentProduct) return '';
  if (variantUnavailable(currentProduct, currentSize, currentColor)) return '';
  var gid = resolveShopifyVariantId({ id: currentProduct.id, size: currentSize, color: currentColor });
  if (!gid) return '';
  var numeric = String(gid).split('/').pop();
  if (!/^\d+$/.test(numeric)) return '';
  return numeric + ':' + Math.max(1, currentQty || 1);
}

// Rebuild only when the value actually changes: colour/size/qty clicks fire
// this a lot, and re-creating the custom element needlessly would flicker.
var _detailShopPayKey = null;
function renderDetailShopPay() {
  var host = document.getElementById('detailShopPay');
  if (!host) return;
  var variants = detailShopPayVariants();
  if (!variants) {
    _detailShopPayKey = null;
    host.innerHTML = '';
    return;
  }
  // UPDATE IN PLACE when the button already exists. Re-writing innerHTML
  // destroys the custom element and makes a fresh one re-upgrade from
  // Shopify's CDN module, which is a visible flash on EVERY colour/size tap.
  // shop-js registers `variants` as an observed prop, so setting the attribute
  // is enough — and the checkout it opens is built from the attribute at click
  // time, which is verified end-to-end (change colour -> click -> the new
  // variant is what appears on shop.app).
  var existing = host.querySelector('shop-pay-button');
  if (existing) {
    if (variants !== _detailShopPayKey) {
      existing.setAttribute('variants', variants);
      _detailShopPayKey = variants;
    }
    return;
  }
  _detailShopPayKey = variants;
  // Same "or" divider component the cart page uses, so the two pages read the
  // same. The Shop Pay LOGO is kept (no button-text attribute) — the element
  // renders `buttonText || <logo>`, never both, and the logo carries its own
  // mx-auto so it stays centred once the button goes full width.
  host.innerHTML = '<div class="shop-pay-or"><span>or buy now with</span></div>' +
    '<div class="shop-pay-wrap">' +
      '<shop-pay-button store-url="' + STORE_URL + '" variants="' + variants + '"></shop-pay-button>' +
    '</div>';
  loadShopPay();
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

// Used by the wishlist cards, which have never had pickers either — so it
// resolves the same defaults as cardAdd (first colour + cheapest in-stock
// size) and records the colour on the line, keeping every card-originated
// add identical regardless of which grid it came from.
function quickAdd(id) {
  var product = products.find(p => p.id === id);
  if (!product) return;
  var v = defaultCardVariant(product);
  if (!v) { showToast('That one is out of stock right now.'); return; }
  var item = Object.assign({}, product, { price: v.price, size: v.size });
  if (v.color) item.color = v.color;
  addToCart(item);
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
      cardRatingHtml(p) +
      '<div class="product-price">' + priceDisplayHtml(p) + '</div>' +
      '<button class="btn-black" onclick="event.stopPropagation();quickAdd(' + p.id + ')">Add To Cart</button></div></div>';
  }).join('') + '</div>';
}


function updateCartCount() {
  var total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = total;
  var mobileCount = document.getElementById('menuCartCount');
  if (mobileCount) mobileCount.textContent = total;
  setCachedCartCount(total);
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
        <button class="checkout-btn" onclick="checkout()"><span class="checkout-btn-label">Checkout Securely →</span></button>
        ${shopPayBlockHtml()}
        <p class="cart-returns-line">30-day returns • Free shipping on every order</p>
        ${trustBadgesHtml('full')}
      </div>
    </div>`;
  loadShopPay();
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

// A tiny cached copy of the cart item count, written every time
// updateCartCount() runs (i.e. always in sync with the real `cart` array).
// Exists purely so the very first paint of a fresh page load — before
// initCartFromStorage()'s async Shopify fetch has had a chance to resolve —
// can show a returning visitor's real count instantly instead of the static
// "0" markup in index.html. Kept in lockstep with SHOPIFY_CART_KEY: cleared
// wherever the stored cart id is confirmed gone, so a stale cached number
// can never outlive the cart it described (see initCartFromStorage below).
var CART_COUNT_CACHE_KEY = 'pawhaul_cart_count_cache';
function setCachedCartCount(n) {
  try { localStorage.setItem(CART_COUNT_CACHE_KEY, String(n)); } catch (e) {}
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
    // No stored cart id at all -- either a first-ever visit or storage was
    // cleared. updateCartCount() (not just setCachedCartCount) so that if the
    // pre-hydration script in index.html painted a stale cached number with
    // nothing real behind it, the visible badge actually gets corrected too,
    // not just the cache for next time.
    if (!cartId) { updateCartCount(); return; }

    var result = await cartApi({ action: 'get', cartId: cartId });
    if (!result || !result.ok) {
      setStoredCartId(null); // expired/deleted cart — start clean rather than error out
      updateCartCount(); // cart is genuinely empty -- reflect that on screen too, not just the cache
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

  if (btn) { btn.disabled = true; setCheckoutBtnLabel(btn, 'Preparing checkout...'); }
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
    if (btn) { btn.disabled = false; setCheckoutBtnLabel(btn, 'Checkout Securely →'); }
    showToast((data && data.error) || 'Could not start checkout — please try again.', 5000);
  } catch (e) {
    if (btn) { btn.disabled = false; setCheckoutBtnLabel(btn, 'Checkout Securely →'); }
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

// Swaps the 10% off box's form for the code, in place and permanently — no
// timeout, because this is the customer's discount code and it must not vanish
// while they're reaching for it. Returns false if the markup isn't there, so
// the caller can fall back to a toast rather than showing nothing.
//
// `alreadyExists` means the address was already a Shopify customer, so the code
// row is hidden: identical to the popup's rule, since revealing WELCOME10 again
// to a repeat address would make "one per customer" meaningless.
function revealEmailSectionSuccess(alreadyExists) {
  var section = document.querySelector('.email-section');
  var success = document.getElementById('emailSuccess');
  if (!section || !success) return false;

  // Exempts this section from the site-wide hide rule for the rest of the
  // visit (see the <head> block in index.html). On the next load the class is
  // gone with the fresh markup, and the section hides for good.
  section.classList.add('email-claimed-now');

  var form = section.querySelector('.email-form');
  var pitch = section.querySelector('.email-pitch');
  var codeRow = document.getElementById('emailCodeRow');
  var code = document.getElementById('emailCode');
  var msg = document.getElementById('emailSuccessMsg');

  if (form) form.style.display = 'none';
  if (pitch) pitch.style.display = 'none'; // "Sign up for..." no longer applies
  if (code) code.textContent = DISCOUNT_CODE;
  if (codeRow) codeRow.style.display = alreadyExists ? 'none' : '';
  if (msg) {
    msg.textContent = alreadyExists
      ? 'This email was already used.'
      : "You're in! Use this code at checkout.";
  }
  success.style.display = 'block';
  return true;
}

// The home page's 10% off box. This is the SAME action as the offer popup and
// now runs the same path: /api/customer (Shopify customerCreate) + the same
// format validation + the same "already used" answer, and a success here sets
// the shared claim flag so the popup stops appearing everywhere.
//
// It used to be a different thing wearing the same label: emailjs.send() to
// EMAILJS_WELCOME_TEMPLATE, which was never configured (empty string), so every
// submission failed into a catch that showed the code anyway and told the
// visitor it had been "sent to your email" when nothing was sent and no
// customer record was created. There was also no real success/failure to hang
// a claim flag on — everything, including total failure, ended the same way.
function submitEmail() {
  var input = document.querySelector('.email-input');
  var btn = document.querySelector('.email-submit');
  var email = input ? input.value.trim() : '';

  if (!email) { showToast('Please enter your email address.'); return; }
  // Same validator the popup uses (app.js), so the two can't disagree about
  // what a valid address is. Guarded: app.js loads after this file.
  if (typeof isValidEmailFormat === 'function' && !isValidEmailFormat(email)) {
    showToast("That doesn't look like a valid email address — please check and try again.");
    return;
  }

  var label = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
  function restore() { if (btn) { btn.disabled = false; btn.textContent = label; } }

  fetch('/api/customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  }).then(function (res) { return res.json(); }).then(function (data) {
    restore();
    if (!data || !data.ok) {
      showToast((data && data.error) || 'Something went wrong — please try again.');
      return; // no claim flag: nothing was actually recorded
    }
    input.value = '';
    // Reveal BEFORE marking claimed: markOfferClaimed() adds the site-wide
    // "hide this section" class, and the reveal is what exempts this section
    // from it for the rest of the visit.
    var revealed = revealEmailSectionSuccess(!!data.alreadyExists);
    if (typeof markOfferClaimed === 'function') markOfferClaimed();
    // Toast only as a fallback — if the success markup is somehow missing, the
    // customer must still be told their code rather than nothing at all.
    if (!revealed) {
      showToast(data.alreadyExists
        ? 'This email was already used.'
        : "You're in! Use code " + DISCOUNT_CODE + " at checkout for 10% off.");
    }
  }).catch(function () {
    restore();
    showToast('Something went wrong — please try again.');
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

  if (!ensureEmailjs()) {
    if (emailjsPending()) {
      showToast('Just a moment — still loading. Tap Send Message again.');
      return;
    }
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

// ==================== REAL PRODUCT REVIEWS (task 56) ====================
// Backed by /api/reviews (Upstash Redis + optional Vercel Blob). Nothing here
// is seeded: a product with no reviews says so, and no star average is shown
// for it anywhere on the site until a real one exists.
//
// reviewStats is fetched ONCE per page load for every product at boot, so the
// shop grid and carousel can show real ratings without a request per card.
var reviewStats = {};          // { <productId>: { count, average } }
var reviewsConfigured = null;  // null = unknown yet, false = backend not set up
var reviewPhotosEnabled = false;

function starSvg(fill) {
  return '<svg viewBox="0 0 24 24" fill="' + fill + '" class="rv-star" aria-hidden="true">' +
    '<path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg>';
}

// Rounded to the nearest whole star — half-star clipping is not worth the
// markup here, and the numeric average is always shown beside it.
function starsHtml(avg) {
  var full = Math.round(Number(avg) || 0);
  var out = '';
  for (var i = 1; i <= 5; i++) out += starSvg(i <= full ? '#FFB800' : '#D8D4CC');
  return out;
}

function ratingFor(id) { return reviewStats[id] || null; }

// Used by product cards. No reviews yet => no rating row at all, rather than
// five decorative stars implying a score nobody gave.
function cardRatingHtml(p) {
  var r = ratingFor(p.id);
  if (!r) return '<div class="product-stars product-stars--empty">No reviews yet</div>';
  return '<div class="product-stars">' + starsHtml(r.average) +
    ' <span>' + r.average.toFixed(1) + ' (' + r.count + ')</span></div>';
}

async function loadReviewStats() {
  try {
    var ids = products.map(function (p) { return p.id; }).join(',');
    var res = await fetch('/api/reviews?stats=' + encodeURIComponent(ids), { cache: 'no-store' });
    var data = await res.json();
    if (data && data.ok) {
      reviewStats = data.stats || {};
      reviewsConfigured = !!data.configured;
    }
  } catch (e) {
    reviewsConfigured = false;   // leave stats empty; cards fall back to "No reviews yet"
  }
  // Re-render whatever is on screen so ratings appear as soon as they arrive.
  try {
    if (document.getElementById('shopProducts')) renderShopProducts(currentShopFilter);
    if (document.getElementById('homeProducts')) renderHomeProducts();
  } catch (e) { /* pages not built yet — boot renders with stats already present */ }
}

function reviewsEscape(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function reviewDateLabel(iso) {
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function reviewCardHtml(r) {
  var alt = 'Photo from a review by ' + reviewsEscape(r.name);
  var photo = r.photo
    ? '<a class="rv-photo" href="' + reviewsEscape(r.photo) + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="' + reviewsEscape(r.photo) + '" alt="' + alt + '" loading="lazy"></a>'
    : '';
  return '<li class="rv-item" data-review-id="' + reviewsEscape(r.id) + '">' +
    '<div class="rv-item-head">' +
      '<span class="rv-item-stars" aria-label="' + r.rating + ' out of 5 stars">' + starsHtml(r.rating) + '</span>' +
      '<span class="rv-item-name">' + reviewsEscape(r.name) + '</span>' +
      '<span class="rv-item-date">' + reviewsEscape(reviewDateLabel(r.createdAt)) + '</span>' +
    '</div>' +
    (r.text ? '<p class="rv-item-text">' + reviewsEscape(r.text) + '</p>' : '') +
    photo +
  '</li>';
}

function reviewFormHtml(productId) {
  var photoField = reviewPhotosEnabled
    ? '<label class="rv-field"><span class="rv-label">Photo <em>(optional)</em></span>' +
      '<input type="file" id="rvPhoto" accept="image/jpeg,image/png,image/webp"></label>'
    : '';
  var starButtons = [1, 2, 3, 4, 5].map(function (n) {
    return '<button type="button" class="rv-starbtn" role="radio" aria-checked="false" ' +
      'aria-label="' + n + ' star' + (n > 1 ? 's' : '') + '" data-star="' + n + '" ' +
      'onclick="pickReviewStar(' + n + ')">' + starSvg('#D8D4CC') + '</button>';
  }).join('');
  return '<form class="rv-form" id="rvForm" onsubmit="return submitReview(event,' + productId + ')">' +
    '<div class="rv-field">' +
      '<span class="rv-label">Your rating <em>(required)</em></span>' +
      '<div class="rv-starpick" id="rvStars" role="radiogroup" aria-label="Rating out of 5">' + starButtons + '</div>' +
    '</div>' +
    '<label class="rv-field"><span class="rv-label">Your name</span>' +
      '<input type="text" id="rvName" maxlength="40" placeholder="e.g. Sam" autocomplete="name"></label>' +
    '<label class="rv-field"><span class="rv-label">Your review</span>' +
      '<textarea id="rvText" maxlength="1500" rows="4" placeholder="How did it work out on your walks?"></textarea></label>' +
    photoField +
    '<button type="submit" class="rv-submit" id="rvSubmit">Post Review</button>' +
    '<p class="rv-form-note" id="rvNote" role="status" aria-live="polite"></p>' +
  '</form>';
}

var rvSelectedStars = 0;

function pickReviewStar(n) {
  rvSelectedStars = n;
  var wrap = document.getElementById('rvStars');
  if (!wrap) return;
  wrap.querySelectorAll('.rv-starbtn').forEach(function (b) {
    var v = parseInt(b.dataset.star, 10);
    b.setAttribute('aria-checked', v === n ? 'true' : 'false');
    b.innerHTML = starSvg(v <= n ? '#FFB800' : '#D8D4CC');
  });
  var note = document.getElementById('rvNote');
  if (note && note.dataset.err === '1') { note.textContent = ''; note.dataset.err = ''; }
}

async function renderReviews(productId) {
  var root = document.getElementById('reviewsRoot');
  if (!root) return;
  rvSelectedStars = 0;
  root.innerHTML = '<p class="rv-loading">Loading reviews...</p>';

  var data = null;
  try {
    var res = await fetch('/api/reviews?product=' + productId, { cache: 'no-store' });
    data = await res.json();
  } catch (e) { data = null; }

  // Ignore a response that arrived after the shopper moved to another product.
  if (!currentProduct || currentProduct.id !== productId) return;

  if (!data || !data.ok) {
    root.innerHTML = '<p class="rv-loading">Reviews are unavailable right now.</p>';
    return;
  }
  reviewsConfigured = !!data.configured;
  reviewPhotosEnabled = !!data.photos;
  if (data.count > 0) reviewStats[productId] = { count: data.count, average: data.average };
  else delete reviewStats[productId];

  var summary = data.count > 0
    ? '<div class="rv-summary">' +
        '<div class="rv-summary-score">' + Number(data.average).toFixed(1) + '</div>' +
        '<div><div class="rv-summary-stars">' + starsHtml(data.average) + '</div>' +
        '<div class="rv-summary-count">' + data.count + ' review' + (data.count === 1 ? '' : 's') + '</div></div>' +
      '</div>'
    : '<p class="rv-empty">No reviews yet &mdash; <strong>be the first to review this product.</strong></p>';

  var list = data.reviews && data.reviews.length
    ? '<ul class="rv-list">' + data.reviews.map(reviewCardHtml).join('') + '</ul>'
    : '';

  var form = reviewsConfigured
    ? reviewFormHtml(productId)
    : '<p class="rv-offline">Reviews cannot be submitted yet &mdash; the store owner still needs to finish setting this up.</p>';

  root.innerHTML = summary + list +
    '<div class="rv-write"><h4 class="rv-write-title">Write a review</h4>' + form + '</div>';

  syncDetailRating(productId);
}

// Keeps the price-block rating line honest and in step with the section below.
function syncDetailRating(productId) {
  var r = ratingFor(productId);
  var starWrap = document.querySelector('#page-product .detail-stars');
  var countEl = document.getElementById('detailReviews');
  if (starWrap) {
    starWrap.querySelectorAll('svg').forEach(function (s) { s.remove(); });
    if (r) starWrap.insertAdjacentHTML('afterbegin', starsHtml(r.average));
  }
  if (countEl) {
    countEl.textContent = r
      ? '(' + r.average.toFixed(1) + ' · ' + r.count + ' review' + (r.count === 1 ? '' : 's') + ')'
      : '(No reviews yet)';
  }
}

async function submitReview(ev, productId) {
  ev.preventDefault();
  var note = document.getElementById('rvNote');
  var btn = document.getElementById('rvSubmit');
  var setNote = function (msg, isErr) {
    if (!note) return;
    note.textContent = msg;
    note.dataset.err = isErr ? '1' : '';
    note.className = 'rv-form-note' + (isErr ? ' rv-form-note--err' : '');
  };

  if (!rvSelectedStars) { setNote('Please pick a star rating first.', true); return false; }

  var photoInput = document.getElementById('rvPhoto');
  var payload = {
    productId: productId,
    rating: rvSelectedStars,
    name: (document.getElementById('rvName') || {}).value || '',
    text: (document.getElementById('rvText') || {}).value || ''
  };

  if (photoInput && photoInput.files && photoInput.files[0]) {
    var f = photoInput.files[0];
    if (f.size > 2 * 1024 * 1024) { setNote('That photo is over 2MB - please pick a smaller one.', true); return false; }
    try {
      payload.photo = await new Promise(function (resolve, reject) {
        var fr = new FileReader();
        fr.onload = function () { resolve(fr.result); };
        fr.onerror = reject;
        fr.readAsDataURL(f);
      });
    } catch (e) { /* post the review without the photo rather than losing it */ }
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Posting...'; }
  setNote('');
  try {
    var res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var data = await res.json();
    if (!data || !data.ok) {
      setNote((data && data.error) || 'Could not post your review - please try again.', true);
      if (btn) { btn.disabled = false; btn.textContent = 'Post Review'; }
      return false;
    }
    showToast('Thanks for your review!');
    reviewStats[productId] = { count: data.count, average: data.average };
    await renderReviews(productId);
    // The card grids show the average too, so refresh them with the new number.
    try {
      if (document.getElementById('shopProducts')) renderShopProducts(currentShopFilter);
      if (document.getElementById('homeProducts')) renderHomeProducts();
    } catch (e) { /* not fatal */ }
  } catch (e) {
    setNote('Could not post your review - please try again.', true);
    if (btn) { btn.disabled = false; btn.textContent = 'Post Review'; }
  }
  return false;
}

// ==================== INIT ====================
renderHomeProducts();
// Rendered once at boot: the section lives in the SPA's DOM permanently,
// so it does not need re-rendering on every return to the home page.
renderProblemCarousel();
// Real review aggregates for every product, one request, then a re-render.
loadReviewStats();
