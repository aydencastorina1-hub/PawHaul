// ==================== DATA ====================
var products = [
  {
    id: 1, name: "2-in-1 Dog Water Bottle", emoji: "🧴", image: "",
    badge: "Best Seller", badgeClass: "",
    // Real, verified stats from the AliExpress listing this product is
    // sourced from — read off the live listing, not estimated. They are
    // the SUPPLIER's numbers, never PawHaul's, and every surface that
    // renders them says so. See supplierRatingHtml().
    supplier: { rating: 4.8, ratings: 322 },
    // Paragraphs separated by a blank line (\n\n) — rendered as <p>s on the
    // product page. Facts only from the supplier listing images and this file.
    desc: "This is the one you carry while you're moving. It holds water and a snack in one bottle you can hold in one hand: about 350ml of water in the regular size (550ml in the large) and about 180ml of kibble in the clear food section on top. The carry strap goes round your wrist, so it comes along without taking up a pocket.\n\nIt's built for drinks on the go. Press the button on the side, water fills the built-in trough, your dog drinks, and you keep walking, with no bowl to put down, fill and pack away. A downward lock on the button stops water leaking in your bag, and a sealing gasket keeps the food dry.\n\nIt's made for quick drinks between blocks, not long sit-down stops. For those, pair it with the Collapsible Dog Bowl: the bottle carries the water, and the bowl gives your dog somewhere to drink properly when you stop.",
    tagline: "Water and food in one leak-proof bottle — never cut a walk short again.",

    // Variant options (Shopify-ready). Size drives the price; color does not.
    sizes: ["350ml", "550ml"],
    colors: ["Pink", "White", "Blue"],

    // Real product photos, hosted in this repo (see images/products/) rather
    // than pulled from Shopify's CDN — one per color, so the card image, the
    // detail hero and gallery slide 1 always match the selected color.
    //
    // RE-CHECKED against Shopify (task 99): the re-uploaded pool there is
    // these same 7 files, pixel for pixel, and Shopify's own variant_ids
    // assign them to the same colours this map does. Shopify was brought in
    // line with these photos, not the other way round, so they stay local —
    // same image, but served as webp at the width the slot actually needs
    // (see LOCAL_PHOTO_WIDTHS) instead of a full-size CDN fetch.
    images: {
      "Pink": "/images/products/water-bottle-pink-main.jpg",
      "White": "/images/products/water-bottle-white-main.jpg",
      "Blue": "/images/products/water-bottle-blue-main.jpg"
    },

    // Extra detail-page gallery slides — the shared, non-color-specific shots
    // shown after slide 1 for every color, in this order: the 350ml/550ml
    // size comparison, the feature-callout panel, the gasket/leak-proof
    // cutaway and the "reduce storage space" in-hand shot. All four are shot
    // in the blue colorway (that is the only set that exists), which is why
    // they live in the shared pool and never in the per-color map above —
    // slide 1 is the only slide that claims to show the chosen color.
    extraImages: [
      "/images/products/water-bottle-size-comparison.jpg",
      "/images/products/water-bottle-lifestyle-1.jpg",
      "/images/products/water-bottle-lifestyle-2.jpg",
      "/images/products/water-bottle-lifestyle-3.jpg"
    ],

    // Per-size variant pricing — maps each size option to its price.
    // `price`/`was` below mirror the default (first) size so every other part
    // of the app (shop cards, search) keeps working.
    sizePrices: {
      "350ml": { price: 16.99, was: 24.99 },
      "550ml": { price: 21.99, was: 29.99 }
    },
    price: 16.99, was: 24.99,

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
      "Made for drinks on the move — no bowl to set down",
      "About 180ml of food on top, water below",
      "350ml or 550ml water size",
      "Press-button water release with a downward lock",
      "Built-in sealing gasket keeps food dry",
      "Detachable food container",
      "Carry strap",
      "BPA-free materials",
      "Pink, White or Blue"
    ],
    material: "BPA-free plastic body and food container · Leak-proof sealing gasket · Carry strap",
    whatsInBox: "1× 2-in-1 Dog Water Bottle (bottle, detachable food container, carry strap)"
  },
  {
    id: 3, name: "Collapsible Dog Bowl", price: 11.99, was: 18.99, emoji: "🥣", image: "",
    badge: "Popular", badgeClass: "badge-popular",
    // Real, verified stats from the AliExpress listing this product is
    // sourced from — read off the live listing, not estimated. They are
    // the SUPPLIER's numbers, never PawHaul's, and every surface that
    // renders them says so. See supplierRatingHtml().
    supplier: { rating: 4.8, ratings: 1749 },
    // Paragraphs separated by a blank line (\n\n) — rendered as <p>s on the
    // product page. Facts only from the supplier listing images and this file.
    desc: "This is the one you set down when you stop. On a proper break, like halfway up a trail, at a picnic or at a rest stop on a road trip, your dog needs a real bowl to drink or eat from, not a few sips from a trough. This silicone bowl opens to 5.12 inches across and just under 2 inches deep, so they can drink their fill or eat a full portion.\n\nWhen you're done, shake it out and press it flat. It folds down to a thin disc and clips to your bag, belt loop or leash with its built-in carabiner, so it's always with you and never in the way.\n\nIt doesn't carry any water itself. It pairs with the 2-in-1 Dog Water Bottle, or with whatever bottle you already bring: the bottle is for quick drinks while you're walking, and the bowl is for when you stop and your dog needs a proper drink or meal.",
    tagline: "Folds flat, pops open in seconds — water or food, anywhere.",
    sizes: ["5.12in diameter × 1.97in height"],
    colors: ["Red", "Blue", "Orange", "Green", "White", "Black"],

    // RE-SYNCED from Shopify (task 99). These REPLACE the local
    // images/products/bowl-*.jpg crops, and the reason those existed is
    // gone: they were cropped by hand because every Shopify variant photo
    // carried a burned-in measurement diagram. The re-shot pool has none —
    // six clean studio shots at one consistent angle, each with its own
    // matching carabiner — so the source of truth goes back to Shopify.
    // The old local files are now unreferenced (kept on disk, like the
    // pre-79 collar set, pending the user's word).
    images: {
      "Red": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/99B5501A-6912-4471-BFDA-E75A4CA2808C.png?v=1789928225&width=900",
      "Blue": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/475223E9-2911-41AD-8402-B9DF0D07B188.png?v=1789928246&width=900",
      "Orange": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/82088BE3-AB5D-4539-BBEA-94C16C5845BB.png?v=1789928267&width=900",
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/B2146D24-A830-44AF-8D2A-8DF25FFA4D90.png?v=1789928296&width=900",
      "White": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/2CE939E3-AD2C-471E-82A8-F1A87A72C42A.png?v=1789928320&width=900",
      "Black": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/0B2E56CB-BCD6-4717-A467-1FA77CF89FA6.png?v=1789928337&width=900"
    },

    // Extra detail-page gallery slides — all five shared pool images, in
    // Shopify's own position order (pos7 … pos11).
    //
    // Task 102 retired the task-20/27 skip list here: the gallery now
    // mirrors Shopify's pool one for one. That knowingly puts colours this
    // shop does not sell on screen — pos8's montage shows a yellow and a
    // pink bowl, pos11's phone size-reference (5.1 in / 3.5 in / 1.9 in) is
    // shot in pink — so slide 1 remains the ONLY slide that claims to show
    // the selected colour, and the colour swatches remain the only place a
    // buyer picks one.
    //
    // pos7 stays the CROPPED local copy: the pool original stacks five
    // bowls beside the one the dog is eating from, which reads as a
    // multi-pack of a product sold singly. images/products/bowl-lifestyle-1.jpg
    // is that same photo with the stack cropped out of frame — the image is
    // present, just framed on the one bowl in use.
    extraImages: [
      "/images/products/bowl-lifestyle-1.jpg",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/649F0CE6-2494-42DF-94BE-A9D3FD787024.png?v=1789928528&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/D7F9C6D8-41EA-44A4-BF2F-509EB4820D00.png?v=1789928528&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/86F6DB3D-B47A-490F-9A7B-7B7D0CB3A4BD.png?v=1789928528&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/E30A5796-62AB-4CE8-BF4F-158AA947326F.png?v=1789928528&width=900"
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
      "Made for stops: breaks, hikes, picnics and road trips",
      "Folds completely flat",
      "5.12in wide × 1.97in deep when open",
      "Built-in carabiner clip",
      "For water or food",
      "Rinses clean in seconds",
      "Food-grade silicone",
      "Six colours"
    ],
    material: "Food-grade silicone · Built-in carabiner clip",
    whatsInBox: "1× collapsible silicone bowl with carabiner clip"
  },
  {
    id: 6, name: "LED Dog Collar", price: 14.99, was: 21.99, emoji: "💡", image: "",
    badge: "Night Safety", badgeClass: "badge-night",
    // Real, verified stats from the AliExpress listing this product is
    // sourced from — read off the live listing, not estimated. They are
    // the SUPPLIER's numbers, never PawHaul's, and every surface that
    // renders them says so. See supplierRatingHtml().
    supplier: { rating: 4.5, ratings: 638 },
    // Paragraphs separated by a blank line (\n\n) — rendered as <p>s on the
    // product page. Facts only from the supplier listing images and this file.
    desc: "A proper everyday collar with the light built into it. A glowing LED strip runs along the nylon band, switched by a button on the collar, with three modes: fast blink, slow blink and steady glow. It charges over USB with the cable included, fills up in about 2 hours, and lasts several walks between charges.\n\nAt night a dog is low to the ground, often dark-coated and usually a few steps ahead of you. That puts it where drivers and cyclists look last. A lit collar puts light at the neck, the part that reaches the road first, so your dog is seen from any angle, not only when a headlight happens to hit them.\n\nUnlike clip-on lights that dangle and swing, the light is part of the band. It also has a reflective stripe as a backup, a quick-release buckle, a size adjuster and a chrome-plated D-ring for the leash, so it's a complete collar, not an add-on. It's rechargeable, so there are no coin batteries to buy.",
    tagline: "Be seen on every night walk, no matter how dark.",
    sizes: ["S (13-16 in)", "M (14-18 in)", "L (16-20 in)", "XL (16-22 in)"],
    colors: ["Green", "Blue", "Red", "Pink", "Black"],

    // Renamed from "Light Up Dog Collar" (task 95). Search matches on
    // name/desc/tags, and neither the name nor the desc carries the old name, so a
    // customer who remembers it — or who just types how they think about the
    // thing — would get "No products found". Same reason the wrist strap
    // carries tags.
    tags: ["light up collar", "light up dog collar", "glow collar", "glowing collar",
           "night collar", "safety collar", "rechargeable collar", "flashing collar"],

    // The user's own photo set, hosted in this repo (see images/products/),
    // one "-main-v2" per colour: a clean lit studio shot of the collar on
    // white, no colour-name label and no "USB Charging" banner. These
    // REPLACED the task-79 "-main" composites outright (task 80) and those
    // five files are deleted — do not resurrect the naming. Note the v2 set
    // is 3:2 LANDSCAPE while the eight shared shots below are square, so the
    // contain-fit gallery and cards letterbox them top and bottom.
    // Still unreferenced from the pre-79 era: collar-<colour>.jpg, the same
    // composites cropped to their studio panel. Left in place pending the
    // user's word.
    //
    // RE-CHECKED against Shopify (task 99): the re-uploaded pool there is
    // these same 13 files, pixel for pixel, and Shopify's own variant_ids
    // assign them to the same colours this map does. Shopify was brought in
    // line with these photos, not the other way round, so they stay local —
    // same image, but served as webp at the width the slot actually needs
    // (see LOCAL_PHOTO_WIDTHS) instead of a full-size CDN fetch.
    //
    // The eight shared shots below are part of that same identical set, so
    // the task-99 re-sync changes nothing here — including the three content
    // mismatches recorded further down, which the user was shown and chose
    // to keep. They are NOT re-decided by the task-99 audit.
    images: {
      "Green": "/images/products/collar-green-main-v2.jpg",
      "Blue": "/images/products/collar-blue-main-v2.jpg",
      "Red": "/images/products/collar-red-main-v2.jpg",
      "Pink": "/images/products/collar-pink-main-v2.jpg",
      "Black": "/images/products/collar-black-main-v2.jpg"
    },

    // Extra detail-page gallery slides — the eight shared shots the user
    // supplied, in their order: a black-collar feature callout, a green
    // collar on a black lab, the multi-colour group shot, a green collar on
    // a German shepherd, the green feature-callout ring, a blue collar on a
    // beagle at dusk, a daylight walk with a benefit strip, and the size
    // chart. Shared, so none of them belongs in the per-colour map above.
    // KNOWN CONTENT MISMATCHES, all flagged to the user and kept on their
    // instruction: the size chart advertises an XS this shop does not sell
    // and prints lengths that differ slightly from the four size options;
    // the group shot includes a yellow collar that is not sold; and two of
    // the dog shots show CR2032 coin cells, while this listing sells the
    // USB-rechargeable version.
    extraImages: [
      "/images/products/collar-lifestyle-1.jpg",
      "/images/products/collar-lifestyle-2.jpg",
      "/images/products/collar-lifestyle-3.jpg",
      "/images/products/collar-lifestyle-4.jpg",
      "/images/products/collar-lifestyle-5.jpg",
      "/images/products/collar-lifestyle-6.jpg",
      "/images/products/collar-lifestyle-7.jpg",
      "/images/products/collar-lifestyle-8.jpg"
    ],

    sizePrices: {
      "S (13-16 in)": { price: 14.99, was: 21.99 },
      "M (14-18 in)": { price: 16.99, was: 23.99 },
      "L (16-20 in)": { price: 18.99, was: 26.99 },
      "XL (16-22 in)": { price: 20.99, was: 29.99 }
    },

    // Real Shopify variant GIDs (Storefront API) for checkout.
    shopifyVariants: { productGid: "gid://shopify/Product/9518276739328", byVariant: {
        "S (13-16 in)|Green": "gid://shopify/ProductVariant/48945266360576",
        "M (14-18 in)|Green": "gid://shopify/ProductVariant/48945266295040",
        "L (16-20 in)|Green": "gid://shopify/ProductVariant/48945266327808",
        "XL (16-22 in)|Green": "gid://shopify/ProductVariant/48945266753792",
        "S (13-16 in)|Blue": "gid://shopify/ProductVariant/48945266491648",
        "M (14-18 in)|Blue": "gid://shopify/ProductVariant/48945266524416",
        "L (16-20 in)|Blue": "gid://shopify/ProductVariant/48945266426112",
        "XL (16-22 in)|Blue": "gid://shopify/ProductVariant/48945266393344",
        "S (13-16 in)|Red": "gid://shopify/ProductVariant/48945266458880",
        "M (14-18 in)|Red": "gid://shopify/ProductVariant/48945266655488",
        "L (16-20 in)|Red": "gid://shopify/ProductVariant/48945266557184",
        "XL (16-22 in)|Red": "gid://shopify/ProductVariant/48945266917632",
        "S (13-16 in)|Pink": "gid://shopify/ProductVariant/48945266589952",
        "M (14-18 in)|Pink": "gid://shopify/ProductVariant/48945266786560",
        "L (16-20 in)|Pink": "gid://shopify/ProductVariant/48945266688256",
        "XL (16-22 in)|Pink": "gid://shopify/ProductVariant/48945266622720",
        "S (13-16 in)|Black": "gid://shopify/ProductVariant/48945266884864",
        "M (14-18 in)|Black": "gid://shopify/ProductVariant/48945266819328",
        "L (16-20 in)|Black": "gid://shopify/ProductVariant/48945266852096",
        "XL (16-22 in)|Black": "gid://shopify/ProductVariant/48945266721024"
      } },

    features: [
      "Three modes: fast blink, slow blink, steady glow",
      "USB rechargeable, about 2 hours to full charge",
      "On/off button on the collar",
      "Reflective stripe for extra visibility",
      "Quick-release buckle, size adjuster, chrome-plated D-ring",
      "0.98in-wide nylon strap",
      "Rated waterproof by the manufacturer",
      "Four sizes, S to XL · five colours"
    ],
    material: "Nylon strap with reflective stripe · LED light strip · Rechargeable battery · Chrome-plated D-ring",
    whatsInBox: "1× LED dog collar · 1× USB charging cable"
  },
  {
    // Sourcing note: the supplier listing shows 4.9 stars and 3,000+ sold.
    // As of task 103 the star figure IS surfaced, via the `supplier` field
    // below and always attributed — the 546 there is the listing's RATINGS
    // count, which is a different number from the 3,000+ SOLD recorded here.
    id: 9, name: "Anti-Drop Leash Wrist Strap", price: 8.99, was: 13.99, emoji: "🔗", image: "",
    badge: "New", badgeClass: "badge-new",
    // Real, verified stats from the AliExpress listing this product is
    // sourced from — read off the live listing, not estimated. They are
    // the SUPPLIER's numbers, never PawHaul's, and every surface that
    // renders them says so. See supplierRatingHtml().
    supplier: { rating: 4.9, ratings: 546 },
    // Paragraphs separated by a blank line (\n\n) — rendered as <p>s on the
    // product page. Facts only from the supplier listing images and this file.
    desc: "A loop of braided cord that ties your leash handle to your wrist. Clip it onto the handle, slide the loop over your hand and pull the slider snug. You hold the leash exactly as you do now. The strap just means that if your grip ever fails, the handle stays with you.\n\nThe most common way a dog gets loose isn't slipping its collar. The handle gets yanked out of a hand: a squirrel, a cold morning, a phone in the other hand, a strong dog hitting the end of the leash. Retractable handles are the worst for it, because they're chunky and a dropped one skids along the ground behind the dog.\n\nIt weighs next to nothing, clips onto any leash (retractable or standard) and adjusts to any wrist. It can stay on the leash between walks, so there's nothing to remember.",
    tagline: "If the leash slips, it stays on your wrist.",
    // Single option in Shopify (Color only). A non-empty sizes array is
    // required — showProduct() maps over it unconditionally — and a lone size
    // is hidden from the size picker on the detail page.
    sizes: ["Universal — adjustable, fits any leash"],
    colors: ["Green", "Black", "Gray", "Brown", "Pink", "Purple"],

    // Search matches name/desc/tags, and neither the name nor the desc contains the phrases
    // people actually type for this thing.
    tags: ["wrist strap", "wristband", "anti drop", "anti-drop", "hands free leash", "leash strap", "dog walking strap"],

    // RE-SYNCED from Shopify (task 99): re-shot pool, so every URL is new.
    // One variant-assigned white-background studio shot per colour.
    images: {
      "Green": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/4C5BE3B2-5CC6-48DC-88EA-7486F24AA1B7.png?v=1790045465&width=900",
      "Black": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/92AC92E7-F62B-453D-BE87-C760272DB3CC.png?v=1790045199&width=900",
      "Gray": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/E5B644C1-AEEF-40A1-B4E6-43C0F6052DF3.png?v=1790045254&width=900",
      "Brown": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/22751449-1824-4A50-8179-E05E18CA4247.png?v=1790045514&width=900",
      "Pink": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/4373A82C-58AE-4E12-85BE-C89AE43A1BFC.png?v=1790045490&width=900",
      "Purple": "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/351A932E-77B2-473C-A6B3-3EA0CDEC4A8E.png?v=1790045227&width=900"
    },

    // Extra gallery slides — all five shared pool images, in Shopify's own
    // position order (pos7 … pos11). The middle two show the strap on a
    // wrist holding a retractable leash, which is the whole point of the
    // product and is not obvious from a studio shot of a loop of cord.
    //
    // Task 102 retired the task-20/27 skip list here, so three more are
    // back: pos7, an in-use shot with burned-in supplier copy ("Helps to
    // loosen grip on your hands / Provides a better control with greater
    // comfort" — clumsy, but English, contrary to the note this replaces);
    // pos10, an "8.6 in" dimension diagram on the brown strap; and pos11, a
    // four-strap fan-out in black, gray, brown and green, all four of which
    // this shop does sell.
    extraImages: [
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/C3A90130-E059-442F-B9F7-C799D58E5B80.png?v=1790046334&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/A2B89FF7-D438-4CD8-A03D-610075FC9FA5.png?v=1790046334&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/99AAC5E2-C549-48D9-B3F1-A730804FEE21.png?v=1790046334&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/439914DE-4282-4A10-9252-1390B8D2D76A.png?v=1790046334&width=900",
      "https://cdn.shopify.com/s/files/1/0812/3259/3152/files/CFBB5FE5-B16F-4FFA-8320-919BCDA27FB7.png?v=1790046334&width=900"
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
      "Keeps the handle on your wrist if it slips",
      "Adjustable slider fits any wrist",
      "Metal clip fits any leash, retractable or standard",
      "Lightweight braided nylon cord",
      "Stays on the leash between walks",
      "Six colours"
    ],
    material: "Braided nylon paracord · Adjustable slide · Metal clip",
    whatsInBox: "1× Anti-Drop Leash Wrist Strap"
  },
  {
    // Sourcing note: the supplier listing shows 4.8 stars and 1,000+ sold.
    // As of task 103 the star figure IS surfaced, via the `supplier` field
    // below and always attributed — the 174 there is the listing's RATINGS
    // count, which is a different number from the 1,000+ SOLD recorded here.
    //
    // MODELLING NOTE: Shopify sells this as ONE "Color" option with four flat
    // combo values (3M Purple, 5M Green, 5M Orange, 5M Purple). It is modelled
    // here on the normal colour x size axes instead, because that is what the
    // rest of the engine already understands — sizePrices drives the price,
    // images{} drives the photo, and unavailableVariants greys out the two
    // combos Shopify does not sell (3M Green and 3M Orange). The purchasable
    // set is therefore exactly Shopify's four, and every one maps to a real
    // variant GID below; the two blocked combos have no GID at all, so they
    // are refused twice over.
    id: 10, name: "LED Flashlight Retractable Dog Leash", emoji: "🔦", image: "",
    badge: "New", badgeClass: "badge-new",
    // Real, verified stats from the AliExpress listing this product is
    // sourced from — read off the live listing, not estimated. They are
    // the SUPPLIER's numbers, never PawHaul's, and every surface that
    // renders them says so. See supplierRatingHtml().
    supplier: { rating: 4.8, ratings: 174 },
    // Paragraphs separated by a blank line (\n\n) — rendered as <p>s on the
    // product page. Facts only from the supplier listing images and this file.
    desc: "A retractable leash with two lights in the handle. A colour-changing LED ring keeps your dog and you visible. A flashlight at the front points wherever the leash does. One touch button cycles through flashlight, light ring, both, and off.\n\nAfter dark, being seen is only half the problem. You also can't see what your dog is sniffing, what's on the path, or where the kerb ends. A phone torch ties up the hand you need for everything else. With the light in the handle you're already holding, your other hand stays free.\n\nUnder the lights it's a solid retractable leash. It has nylon tape, a lock button you work with your thumb to fix the length, a U-shaped outlet that feeds the tape out and back smoothly from any angle, and a non-slip grip. It comes in 3M or 5M and runs on 2 AAA batteries, not included, which go in behind a cover on the underside.",
    tagline: "A leash that lights the dog and the path.",

    // Shown as a pill under the tagline and surfaced by the chatbot.
    disclaimer: "Requires 2 AAA batteries (not included)",

    sizes: ["3M", "5M"],
    colors: ["Purple", "Green", "Orange"],
    tags: ["led leash", "light up leash", "flashlight leash", "night walk leash", "glow leash", "retractable led"],

    // Real product photos, hosted in this repo (see images/products/) rather
    // than pulled from Shopify's CDN — one per colour, so the card image, the
    // detail hero and gallery slide 1 always match the selected colour.
    // productImageFor() keys on colour ALONE, which is exactly what this
    // product needs: Purple is the only colour sold in both lengths, and 3M
    // Purple and 5M Purple are the same physical colourway, so both show this
    // one purple photo and changing length never swaps the image.
    //
    // RE-CHECKED against Shopify (task 99): the re-uploaded pool there is
    // these same 8 files, pixel for pixel, and Shopify assigns its own
    // 3M Purple and 5M Purple variants to the one purple photo — exactly the
    // colour-alone keying above. Shopify was brought in line with these
    // photos, not the other way round, so they stay local.
    images: {
      "Purple": "/images/products/led-leash-purple-main.jpg",
      "Green": "/images/products/led-leash-green-main.jpg",
      "Orange": "/images/products/led-leash-orange-main.jpg"
    },

    // Shared, non-colour-specific gallery slides, shown after slide 1 for
    // every colour in this order: the labelled feature callouts, the
    // "U-shaped rope outlet" panel, the touch-lighting instructions, the
    // in-hand night shot with the beam lit, and the three-colour lineup in
    // the dark. Slides 1, 2 and 4 are shot in the purple colourway (that is
    // the only set that exists), which is why they live in the shared pool
    // and never in the per-colour map above — slide 1 is the only slide the
    // page presents as "the" selected colour, and renderDetailGallery()
    // deliberately gives these slides alt text with no colour name.
    extraImages: [
      "/images/products/led-leash-lifestyle-1.jpg",
      "/images/products/led-leash-lifestyle-2.jpg",
      "/images/products/led-leash-lifestyle-3.jpg",
      "/images/products/led-leash-lifestyle-4.jpg",
      "/images/products/led-leash-lifestyle-5.jpg"
    ],

    sizePrices: {
      "3M": { price: 22.99, was: 32.99 },
      "5M": { price: 25.99, was: 35.99 }
    },
    price: 22.99, was: 32.99,

    // Shopify only sells Purple in 3M — there is no 3M Green or 3M Orange.
    unavailableVariants: [
      { size: "3M", color: "Green" },
      { size: "3M", color: "Orange" }
    ],

    // Real Shopify variant GIDs, all four confirmed with a real cartCreate.
    shopifyVariants: { productGid: "gid://shopify/Product/9608952119552", byVariant: {
        "5M|Green": "gid://shopify/ProductVariant/49181846569216",
        "5M|Orange": "gid://shopify/ProductVariant/49181846601984",
        "3M|Purple": "gid://shopify/ProductVariant/49181846634752",
        "5M|Purple": "gid://shopify/ProductVariant/49181846667520"
      } },

    features: [
      "Colour-changing LED light ring",
      "Built-in LED flashlight",
      "One button: flashlight, light ring, both, off",
      "One-hand lock button to fix the length",
      "U-shaped outlet for smooth 360° retraction",
      "Ergonomic, non-slip grip",
      "3M or 5M · Purple, Green or Orange",
      "Runs on 2 AAA batteries (not included)"
    ],
    material: "ABS housing · Nylon tape · Metal snap clip · LED light ring and flashlight",
    whatsInBox: "1× LED flashlight retractable leash (2 AAA batteries not included)"
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

// Slugs a product used to live at, mapped to its id. Renaming a product moves
// its URL (see above), and this store is indexed and linked to from its own
// blog posts, so the old address has to keep working instead of dumping the
// visitor on Home. Add a line here whenever a live product is renamed; never
// remove one, since the old link can outlive us on someone else's page.
// MIRRORED in api/_seo.js — the server needs the same map to serve the right
// meta (and a canonical pointing at the new URL) for a crawler on an old link.
var RENAMED_SLUGS = {
  'light-up-dog-collar': 6   // -> "LED Dog Collar" (task 95)
};

function pageToPath(page) {
  if (page === 'home') return '/';
  if (page === 'shop') return '/shop';
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
// opts.replace: an explicit non-sync replace — updates the URL without
// growing browser history.
// default: a real user-driven navigation — pushState (adds a back-button step).
// Which nav entry should read as "you are here" for a given path. Product
// pages count as Shop and a blog post counts as Blog — the section is what a
// nav highlight is for, not the exact URL.
function navKeyFor(path) {
  var p = String(path || '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  if (p === '/shop' || p.indexOf('/product/') === 0) return 'shop';
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
    showPage('home', opts);
    if (opts && opts.sync) history.replaceState({ p: 1 }, '', '/');
    return;
  }
  if (route.type === 'product') {
    var p = products.find(function (pr) { return slugify(pr.name) === route.slug; });
    if (!p && RENAMED_SLUGS[route.slug]) p = products.find(function (pr) { return pr.id === RENAMED_SLUGS[route.slug]; });
    // showProduct() rewrites the address bar to the CURRENT slug, so arriving
    // on an old one quietly lands on the right page at the right URL.
    if (p) { showProduct(p.id, opts); return; }
    // Unknown/stale product slug (e.g. a since-renamed or removed product) —
    // fall back to Home rather than show a broken/empty product page, and
    // fix the address bar to match so Back doesn't just return here.
    showPage('home', opts);
    if (opts && opts.sync) history.replaceState({ p: 1 }, '', '/');
    return;
  }
  if (route.type === 'page') { showPage(route.page, opts); return; }
  showPage('home', opts);
  if (opts && opts.sync) history.replaceState({ p: 1 }, '', '/');
}

window.addEventListener('popstate', function () {
  dispatchRoute(window.parseRoute(location.pathname), { sync: true });
});

// Click handler for real <a href="..."> nav links/buttons (nav bar, footer,
// footer links — see index.html). Lets modifier-clicks/middle-
// click fall through to native browser behavior (open in new tab, etc, using
// the real href) instead of always hijacking the click for SPA navigation.
function goTo(e, page) {
  if (e && (e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
  if (e) e.preventDefault();
  showPage(page);
}

// Same idea for real <a href="/product/<slug>"> links (the footer's product
// list): modifier-clicks open the real URL, a plain click stays in the SPA.
function goToProductLink(e, id) {
  if (e && (e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
  if (e) e.preventDefault();
  showProduct(id);
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

function showPage(page, opts) {
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

  if (page === 'shop') { renderShopProducts(); renderBundles(); }
  if (page === 'cart') renderCart();
  if (page === 'wishlist') renderWishlist();
  // The server already put the post cards in #blogIndex for a direct /blog
  // load; this re-render covers in-site navigation to it (and a JS-only
  // client that never saw the server markup). Same markup either way.
  if (page === 'blog' && typeof renderBlogIndex === 'function') renderBlogIndex();

  // page==='product' is deliberately NOT routed here — showProduct() (which
  // is the only caller that ever passes 'product') owns that URL itself,
  // since it needs the product's slug, not just the page name.
  navigateUrl(pageToPath(page), opts);

  // The actual scroll-to-top + restoring smooth scrolling for user swipes —
  // see the comment above for why this waits for the next frame instead of
  // running inline in showPage()'s own (possibly tap-triggered) call stack.
  requestAnimationFrame(function() {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  });
}

// ==================== RENDER PRODUCTS ====================
// NOTE: the shop grid ships static loading-skeleton cards in index.html that
// reserve the exact height this render will produce (see the LOADING
// SKELETON comment there). If you change the product catalogue, a product's
// colours or its sizes, update the skeletons to match — otherwise the page
// starts jumping on load again.
function renderShopProducts() {
  var container = document.getElementById('shopProducts');
  if (!container) return;
  // The shop grid is never more than 4 across, so the first four cards are
  // the ones above the fold at every width. They are also the page's LCP
  // candidates, hence priority rather than plain eager.
  container.innerHTML = products.map(function(p, i) {
    return productCard(p, i < 4 ? { priority: true } : null);
  }).join('');
}

// ==================== BUNDLES (shop page, task 112) ====================
// Curated sets shown under the shop grid. The discount is REAL only because
// Shopify applies it: each bundle has a matching AUTOMATIC discount in
// Shopify admin ("Amount off products", pct% off exactly these products,
// minimum quantity = number of products in the bundle, no code). Shopify
// applies it at checkout whenever those products are in the cart, however
// they got there. Never show a bundle price here that has no matching
// automatic discount in Shopify.
//
// `ids: 'all'` means every product in the catalogue, so a new product joins
// the Complete Walk Kit automatically. Its Shopify code must be updated to
// include that product too, or the new item will not be discounted.
// `wide` cards run the full width of the grid with their items side by side.
var BUNDLES = [
  {
    id: 'led',
    name: 'LED Bundle',
    blurb: 'Light on your dog and light in your hand: the collar makes them easy to spot, the leash lights the path ahead.',
    ids: [6, 10],
    pct: 10
  },
  {
    id: 'control',
    name: 'Control Bundle',
    blurb: 'Lock the length with your thumb and never lose the handle: the leash, plus a strap that keeps it on your wrist.',
    ids: [10, 9],
    pct: 10
  },
  {
    id: 'safety',
    name: 'Ultimate Safety Bundle',
    blurb: 'Everything for walking after dark: a lit collar, a lit leash, and a wrist strap so a spooked dog can’t pull free.',
    ids: [6, 10, 9],
    pct: 12,
    wide: true
  },
  {
    id: 'kit',
    name: 'Complete Walk Kit',
    blurb: 'The whole PawHaul lineup: water and a snack on the move, a bowl for proper breaks, and the full after-dark set.',
    ids: 'all',
    pct: 15,
    wide: true
  }
];

function bundleProducts(b) {
  var ids = b.ids === 'all' ? products.map(function (p) { return p.id; }) : b.ids;
  return ids.map(function (id) { return products.find(function (p) { return p.id === id; }); }).filter(Boolean);
}

// Shopify rounds a percentage discount per line, to the cent; so does this,
// so the saving shown matches what checkout charges.
function pctOff(amount, pct) {
  return Math.round(amount * pct) / 100;
}

// The size/colour the visitor picked for each product in each bundle card.
// Starts on the same default a quick-add uses (first colour, cheapest size).
var bundlePicks = {};
function bundlePick(b, p) {
  var key = b.id + ':' + p.id;
  if (!bundlePicks[key]) {
    var d = defaultCardVariant(p) || { size: (p.sizes || [''])[0], color: (p.colors || [null])[0] };
    bundlePicks[key] = { size: d.size || '', color: d.color || null };
  }
  return bundlePicks[key];
}

function bundlePickPrice(p, pick) {
  return priceForVariant(p, pick.size).price;
}

function bundleTotals(b) {
  var separately = 0, save = 0;
  bundleProducts(b).forEach(function (p) {
    var price = bundlePickPrice(p, bundlePick(b, p));
    separately += price;
    save += pctOff(price, b.pct);
  });
  return { separately: separately, save: save, bundle: separately - save };
}

function bundleOptionSelect(b, p, field, options, current) {
  if (!options || options.length < 2) return '';
  var label = field === 'size' ? 'Size' : 'Colour';
  return '<select class="bundle-select" aria-label="' + esc(p.name) + ' ' + label.toLowerCase() + '"' +
    ' onchange="bundlePickChange(\'' + b.id + '\',' + p.id + ',\'' + field + '\',this.value)">' +
    options.map(function (o) {
      var off = field === 'size'
        ? variantUnavailable(p, o, bundlePick(b, p).color)
        : variantUnavailable(p, bundlePick(b, p).size, o);
      return '<option value="' + esc(o) + '"' + (o === current ? ' selected' : '') + (off ? ' disabled' : '') + '>' +
        esc(field === 'size' ? shortSizeLabel(o) : o) + (off ? ' (n/a)' : '') + '</option>';
    }).join('') +
  '</select>';
}

function bundleCardHtml(b) {
  var items = bundleProducts(b);
  var t = bundleTotals(b);
  return '<article class="bundle-card' + (b.wide ? ' bundle-card--wide' : '') + '" id="bundle-' + b.id + '">' +
    '<div class="bundle-top">' +
      '<h3 class="bundle-name">' + esc(b.name) + '</h3>' +
      '<span class="bundle-pill">Save ' + b.pct + '%</span>' +
    '</div>' +
    '<p class="bundle-blurb">' + esc(b.blurb) + '</p>' +
    '<ul class="bundle-items">' + items.map(function (p) {
      var pick = bundlePick(b, p);
      var img = productImageFor(p, pick.color);
      return '<li class="bundle-item">' +
        '<a class="bundle-thumb" href="/product/' + slugify(p.name) + '" onclick="goToProductLink(event,' + p.id + ')">' +
          (img ? '<img ' + photoAttrs(img, 'thumb') + ' alt="' + esc(p.name) + '">' : p.emoji) +
        '</a>' +
        '<div class="bundle-item-info">' +
          '<span class="bundle-item-name">' + esc(p.name) + '</span>' +
          '<span class="bundle-item-opts">' +
            bundleOptionSelect(b, p, 'size', p.sizes, pick.size) +
            bundleOptionSelect(b, p, 'color', p.colors, pick.color) +
          '</span>' +
        '</div>' +
        '<span class="bundle-item-price">$' + bundlePickPrice(p, pick).toFixed(2) + '</span>' +
      '</li>';
    }).join('') + '</ul>' +
    '<div class="bundle-foot">' +
      '<div class="bundle-prices">' +
        '<span class="bundle-sep">Bought separately $' + t.separately.toFixed(2) + '</span>' +
        '<span class="bundle-price"><span class="price-now">$' + t.bundle.toFixed(2) + '</span>' +
          '<span class="bundle-save">You save $' + t.save.toFixed(2) + '</span></span>' +
      '</div>' +
      '<button class="btn-black bundle-add" type="button" onclick="addBundleToCart(\'' + b.id + '\')">Add Bundle to Cart</button>' +
    '</div>' +
  '</article>';
}

function renderBundles() {
  var el = document.getElementById('shopBundles');
  if (!el) return;
  el.innerHTML = BUNDLES.map(bundleCardHtml).join('');
}

function bundlePickChange(bundleId, productId, field, value) {
  var b = BUNDLES.find(function (x) { return x.id === bundleId; });
  var p = products.find(function (x) { return x.id === productId; });
  if (!b || !p) return;
  var pick = bundlePick(b, p);
  pick[field] = value;
  // A size/colour pair Shopify does not sell (e.g. a 3M leash in Green):
  // move the OTHER option to the first combination that exists.
  if (variantUnavailable(p, pick.size, pick.color)) {
    var pool = field === 'size' ? (p.colors || []) : (p.sizes || []);
    for (var i = 0; i < pool.length; i++) {
      var trySize = field === 'size' ? pick.size : pool[i];
      var tryColor = field === 'size' ? pool[i] : pick.color;
      if (!variantUnavailable(p, trySize, tryColor)) { pick.size = trySize; pick.color = tryColor; break; }
    }
  }
  var card = document.getElementById('bundle-' + b.id);
  if (card) card.outerHTML = bundleCardHtml(b);
}

function addBundleToCart(bundleId) {
  var b = BUNDLES.find(function (x) { return x.id === bundleId; });
  if (!b) return;
  bundleProducts(b).forEach(function (p) {
    var pick = bundlePick(b, p);
    var item = Object.assign({}, p, { price: bundlePickPrice(p, pick), size: pick.size || '' });
    if (pick.color) item.color = pick.color;
    addToCart(item);
  });
  showToast(b.name + ' added to cart! ' + b.pct + '% off is applied at checkout.');
}

// Every product of the bundle is in the cart — the condition Shopify's
// automatic discount checks.
function bundleInCart(b) {
  return bundleProducts(b).every(function (p) { return cart.some(function (i) { return i.id === p.id; }); });
}

// Estimated saving for the cart page, mirroring Shopify: each bundle whose
// products are all in the cart takes pct% off every line of those products;
// where two bundles share a product, the bigger percentage wins (the
// discounts are set not to combine). Shopify's checkout is the final word.
function bundleSavingsForCart() {
  var bundles = BUNDLES.filter(bundleInCart);
  if (!bundles.length) return { amount: 0, bundles: [] };
  var amount = 0;
  var used = [];
  cart.forEach(function (item) {
    if (retiredColorFor(item)) return;
    var best = null;
    bundles.forEach(function (b) {
      if (bundleProducts(b).some(function (p) { return p.id === item.id; }) && (!best || b.pct > best.pct)) best = b;
    });
    if (!best) return;
    amount += pctOff(item.price * item.qty, best.pct);
    if (used.indexOf(best) === -1) used.push(best);
  });
  // Only the bundles actually giving a discount are listed, so a cart with
  // the Ultimate Safety set does not also claim the LED and Control ones.
  return { amount: amount, bundles: BUNDLES.filter(function (b) { return used.indexOf(b) !== -1; }) };
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

// Builds the price markup for one exact variant (no "From" prefix — used
// once a specific size has actually been selected).
//
// NO COMPARE-AT. Products carry a `was` (and sizePrices[].was) and that data
// stays put — Shopify holds the same compare-at and the feed logic reads it —
// but it is NEVER rendered, in any form: no struck-through "was", no "Save
// N%", nowhere on the site. A compare-at is only honest if the product was
// genuinely sold at that price first, and these were not. api/feed.js refuses
// to emit g:sale_price for exactly this reason; the storefront matches it.
// Do not re-add a `was` argument here.
function variantPriceHtml(price) {
  return '<span class="price-now">$' + Number(price).toFixed(2) + '</span>';
}

// True when a product's sizes are priced differently from each other (so the
// card price is really a starting price, not the one-and-only price).
function hasPriceRange(p) {
  if (!p.sizePrices) return false;
  var prices = Object.keys(p.sizePrices).map(function (k) { return p.sizePrices[k].price; });
  return Math.max.apply(null, prices) !== Math.min.apply(null, prices);
}

// Builds the inner HTML of a .product-price block: the lowest real selling
// price, prefixed "From" when sizes actually vary in price. Shared by the shop
// grid and the wishlist so they always stay consistent.
function priceDisplayHtml(p) {
  var v = lowestVariant(p);
  var prefix = hasPriceRange(p) ? '<span class="price-from">From </span>' : '';
  return prefix + variantPriceHtml(v.price);
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

// ── Compact on-card variant pickers (shop grid) ──
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
  // ("White" is still missing and still falls back for the Bowl and the
  // Water Bottle — left alone, out of scope here.)
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

// ==================== PAW LOADER (task 81) ====================
// One loading visual for the whole site: three paw prints stepping in
// sequence under a short line of copy. Pure markup + CSS (see styles.css) —
// it costs nothing to show and, importantly, it is only ever rendered while
// something real is genuinely in flight. Nothing here delays anything.
var PAW_SVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' aria-hidden='true' focusable='false'>" +
  "<ellipse cx='50' cy='67' rx='20' ry='16'/><ellipse cx='27' cy='47' rx='9' ry='12'/>" +
  "<ellipse cx='42' cy='35' rx='9' ry='12'/><ellipse cx='58' cy='35' rx='9' ry='12'/>" +
  "<ellipse cx='73' cy='47' rx='9' ry='12'/></svg>";

// opts.inline — the compact form that goes inside a button in place of its
// label. Everything else gets the stacked block form.
function pawLoaderHtml(text, opts) {
  var inline = !!(opts && opts.inline);
  var paws = '';
  for (var i = 0; i < 3; i++) paws += '<span class="paw-loader-paw">' + PAW_SVG + '</span>';
  return '<span class="paw-loader ' + (inline ? 'paw-loader--inline' : 'paw-loader--block') + '"' +
    ' role="status" aria-live="polite">' +
    '<span class="paw-loader-paws" aria-hidden="true">' + paws + '</span>' +
    '<span class="paw-loader-text">' + (text || 'Fetching the good stuff…') + '</span>' +
    '</span>';
}

// Swaps a button's label for the walking paws and locks it while its own
// request is in flight. Returns the markup it replaced, so the caller hands
// exactly that back on failure — no rebuilding label spans by hand, which is
// how the checkout button's inner <span> used to get wiped.
function setBtnBusy(btn, text) {
  if (!btn) return null;
  var prev = btn.innerHTML;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  btn.innerHTML = pawLoaderHtml(text, { inline: true });
  return prev;
}

function clearBtnBusy(btn, prevHtml) {
  if (!btn) return;
  btn.disabled = false;
  btn.removeAttribute('aria-busy');
  if (prevHtml !== null && prevHtml !== undefined) btn.innerHTML = prevHtml;
}

// ==================== RESPONSIVE LOCAL PHOTOS ====================
// The photos we host ourselves (images/products/*.jpg) ship as responsive
// WebP variants, generated by scripts/gen-product-webp.py. Re-run that after
// dropping a new .jpg in and paste its output over the table below.
//
// The .jpg masters stay on disk on purpose: they are what the generator
// re-encodes from, and api/_seo.js still hands them to social scrapers, whose
// WebP support is patchy in a way browsers' no longer is.
//
// Product DATA keeps pointing at the .jpg. The swap happens here, at
// tag-build time, so everything that reads p.images for a non-<img> purpose
// (og:image, the schema.org image array, renderDetailGallery's de-dupe by
// URL) keeps working off one stable identifier per photo.
//
// Widths are listed per file because nothing is ever upscaled — a 675px
// master gets a 400 and a 675, and that is the whole srcset.
//
// CACHING (vercel.json): /images/ is carved out of the site-wide
// "no-cache, no-store, must-revalidate" rule and served
// "public, max-age=31536000, immutable" instead. Without that carve-out every
// local photo was re-downloaded in full on every page view — which is what
// made these shimmer and pop in while the Shopify-hosted ones, which arrive
// with max-age=31557600 off cdn.shopify.com, came straight from disk cache.
// The immutable is safe because a changed photo means a changed filename:
// re-run the generator and the width suffix / -v2 style name moves with it.
var LOCAL_PHOTO_WIDTHS = {
  'bowl-black': [400, 675],
  'bowl-blue': [400, 675],
  'bowl-green': [400, 675],
  'bowl-lifestyle-1': [400, 800, 822],
  'bowl-orange': [400, 675],
  'bowl-red': [400, 675],
  'bowl-white': [400, 675],
  'collar-black': [400, 800],
  'collar-black-main-v2': [400, 800, 1200],
  'collar-blue': [400, 800],
  'collar-blue-main-v2': [400, 800, 1200],
  'collar-green': [400, 800],
  'collar-green-main-v2': [400, 800, 1200],
  'collar-lifestyle-1': [400, 800, 1100],
  'collar-lifestyle-2': [400, 800, 1100],
  'collar-lifestyle-3': [400, 800, 1100],
  'collar-lifestyle-4': [400, 800, 1100],
  'collar-lifestyle-5': [400, 800, 1100],
  'collar-lifestyle-6': [400, 800, 1100],
  'collar-lifestyle-7': [400, 800, 1100],
  'collar-lifestyle-8': [400, 800, 1100],
  'collar-pink': [400, 800],
  'collar-pink-main-v2': [400, 800, 1200],
  'collar-red': [400, 800],
  'collar-red-main-v2': [400, 800, 1200],
  'led-leash-green-main': [400, 800, 1200, 1536],
  'led-leash-lifestyle-1': [400, 800, 1200, 1254],
  'led-leash-lifestyle-2': [400, 800, 1200, 1536],
  'led-leash-lifestyle-3': [400, 800, 1200, 1254],
  'led-leash-lifestyle-4': [400, 800, 1200, 1254],
  'led-leash-lifestyle-5': [400, 800, 1200, 1254],
  'led-leash-orange-main': [400, 800, 1200, 1536],
  'led-leash-purple-main': [400, 800, 1200, 1536],
  'water-bottle-blue-main': [400, 800, 1200],
  'water-bottle-lifestyle-1': [400, 800, 953],
  'water-bottle-lifestyle-2': [400, 800, 1000],
  'water-bottle-lifestyle-3': [400, 800, 1000],
  'water-bottle-pink-main': [400, 800, 1200],
  'water-bottle-size-comparison': [400, 800, 1200],
  'water-bottle-white-main': [400, 800, 1200],
};

// The CSS width each slot renders a photo at, for <img sizes>. Each is the
// WIDEST the slot ever gets: every photo box on this site is object-fit
// CONTAIN and height-driven, so a landscape shot fills more width than a
// square one in the same box, and guessing low would hand a phone a variant
// too small to be sharp.
var PHOTO_SIZES = {
  card: '(max-width: 767px) 50vw, 340px',   // .product-img, 300px tall in a 4-col grid
  detail: '(max-width: 900px) 100vw, 680px', // .det-carousel, 380-600px tall
  thumb: '96px'                              // cart lines, search results
};

// Non-null only for a local photo we actually generated variants for, so a
// Shopify or Unsplash URL (already sized by its own query string) and a local
// file nobody has run the generator over both fall through untouched.
function localPhotoBase(url) {
  var m = /^\/images\/products\/([a-z0-9-]+)\.jpg$/.exec(url || '');
  return (m && LOCAL_PHOTO_WIDTHS[m[1]]) ? m[1] : null;
}

// Shopify's CDN resizes on demand from the `width` query param, so one
// stored URL can serve a whole srcset. Every pool image is 1254px square (a
// couple are 1536 wide), so these are the useful steps under that; asking
// for more than the original just gets the original back.
//
// It also content-negotiates WebP off the Accept header with no parameter
// needed — a 900px pool PNG comes back as a 28KB WebP, a 400px one as 12KB —
// so the bytes were never the problem. The problem was that WITHOUT a
// srcset a phone rendering a 340px card still downloaded the 900px file.
var SHOPIFY_CDN_WIDTHS = [400, 600, 900, 1254];

function shopifyPhotoBase(url) {
  return /^https:\/\/cdn\.shopify\.com\/.*[?&]width=\d+/.test(url || '') ? url : null;
}

function shopifyPhotoAt(url, w) {
  return url.replace(/([?&]width=)\d+/, '$1' + w);
}

// Unsplash resizes off `w` the same way, so a full-bleed band photo gets the
// same treatment as the home hero slides — which have always hand-written
// these exact widths into their markup. Only the ones already written in the
// house form (fm=jpg&fit=crop&q=75&w=N) are touched, so a hand-tuned URL with
// its own crop or quality is left exactly as it is.
var UNSPLASH_WIDTHS = [640, 828, 1080, 1440, 1920, 2560];

function unsplashPhotoBase(url) {
  return /^https:\/\/images\.unsplash\.com\/.*[?&]w=\d+/.test(url || '') &&
    /[?&]q=\d+/.test(url) ? url : null;
}

function unsplashPhotoAt(url, w) {
  return url.replace(/([?&]w=)\d+/, '$1' + w);
}

function photoSrc(url) {
  var base = localPhotoBase(url);
  if (base) {
    var widths = LOCAL_PHOTO_WIDTHS[base];
    return '/images/products/' + base + '-' + widths[widths.length - 1] + '.webp';
  }
  // Shopify URLs keep the width they are stored with as the `src` fallback,
  // so a browser with no srcset support behaves exactly as it did before.
  return url;
}

function photoSrcset(url) {
  var base = localPhotoBase(url);
  if (base) {
    return LOCAL_PHOTO_WIDTHS[base].map(function (w) {
      return '/images/products/' + base + '-' + w + '.webp ' + w + 'w';
    }).join(', ');
  }
  if (shopifyPhotoBase(url)) {
    return SHOPIFY_CDN_WIDTHS.map(function (w) {
      return shopifyPhotoAt(url, w) + ' ' + w + 'w';
    }).join(', ');
  }
  if (unsplashPhotoBase(url)) {
    return UNSPLASH_WIDTHS.map(function (w) {
      return unsplashPhotoAt(url, w) + ' ' + w + 'w';
    }).join(', ');
  }
  return '';
}

// Every attribute an <img> needs except alt/class. `slot` keys PHOTO_SIZES.
//
// opts.eager: the photo is on screen at first paint, so lazy-loading it only
// buys a visible pop-in. opts.priority: additionally jump the fetch queue —
// that is for the one photo that IS the page's LCP (the open gallery slide,
// the first row of the shop grid), never for a whole grid, since marking
// everything high priority is the same as marking nothing.
function photoAttrs(url, slot, opts) {
  opts = opts || {};
  var srcset = photoSrcset(url);
  var out = 'src="' + photoSrc(url) + '"';
  if (srcset) out += ' srcset="' + srcset + '" sizes="' + (PHOTO_SIZES[slot] || PHOTO_SIZES.card) + '"';
  if (opts.priority) out += ' loading="eager" fetchpriority="high"';
  else if (opts.eager) out += ' loading="eager" fetchpriority="low"';
  else out += ' loading="lazy"';
  return out + ' decoding="async"';
}

// Resolves the photo for one color of a product, falling back to the
// default (first) color's photo, then the emoji when there are no real
// photos at all (e.g. a future product added before its images are set up).
function productImageFor(p, color) {
  if (!p.images) return null;
  return p.images[color] || (p.colors && p.images[p.colors[0]]) || null;
}

// `opts.eager` (set for the top row of a grid by its caller) keeps the cards
// that are on screen at first paint out of the lazy queue — a lazy image is
// only requested once layout has run, which is exactly the delay that showed
// up as the shimmer-then-pop on the photos above the fold.
function productCard(p, opts) {
  var defColor = p.colors && p.colors.length ? p.colors[0] : null;
  var imgUrl = productImageFor(p, defColor);
  var imgContent = imgUrl
    ? `<img ${photoAttrs(imgUrl, 'card', opts)} alt="${p.name}">`
    : p.emoji;
  return `
    <div class="product-card" id="prodcard-${p.id}" onclick="showProduct(${p.id})">
      <div class="product-img-wrap">
        <div class="product-img">${imgContent}</div>
        <button class="wishlist-btn" data-wid="${p.id}" onclick="event.stopPropagation(); wishlist(${p.id})">${wishlistItems.some(function(w){return w.id===p.id}) ? '♥' : '♡'}</button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        ${supplierRatingHtml(p)}
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

  // Slide order, rebuilt on every colour tap:
  //   1. the selected colour's own photo,
  //   2. the shared non-colour-specific shots (lifestyle, detail, size
  //      comparison) from extraImages, in the order the product lists them,
  //   3. every OTHER colour this product sells, in catalogue order.
  // Group 3 means the whole range is browsable from the gallery without
  // hunting the swatches, while slide 1 stays the only slide the page
  // presents as "the" selected colour. Each slide carries its own alt, so a
  // slide that does show a specific colour says which one — an unlabelled
  // alt on another colour's photo is exactly the mismatch this ordering is
  // designed to avoid.
  var slides = [];
  function addSlide(url, colorName) {
    if (!url) return;
    for (var j = 0; j < slides.length; j++) if (slides[j].url === url) return;
    slides.push({ url: url, color: colorName || null });
  }
  addSlide(mainUrl, c);
  (currentProduct.extraImages || []).forEach(function (u) { addSlide(u, null); });
  // Read `images` directly rather than through productImageFor(): its
  // fallback to the default colour would re-add slide 1 under someone
  // else's name for any colour that has no photo of its own.
  (currentProduct.colors || []).forEach(function (other) {
    if (other === c) return;
    addSlide(currentProduct.images && currentProduct.images[other], other);
  });
  var urls = slides.map(function (s) { return s.url; });

  if (!urls.length) {
    detailImg.innerHTML = '<div class="det-carousel"><div class="det-track" id="detTrack"><div class="det-slide">' +
      '<span style="font-size:110px;line-height:1">' + currentProduct.emoji + '</span></div></div></div>';
    return;
  }

  // Slide 1 loads at high priority (it is the one on screen, and the page's
  // largest image). Slide 2 is eager but LOW priority — it is the single
  // most likely next thing a visitor looks at, and fetching it behind
  // slide 1 means the first swipe never waits on the network. Slide 3
  // onward stay lazy; bindCarousel's warm() promotes them a slide ahead of
  // the scroll, so paging on through the gallery stays instant too.
  //
  // Everything past slide 2 must stay lazy on arrival: with the LED collar
  // and the wrist strap the gallery now runs to 11-13 slides, and eagerly
  // fetching all of them on every product view is exactly the waste the
  // lazy-loading was added to avoid — most visitors never page past the
  // first shot.
  var slidesHtml = slides.map(function (s, i) {
    var alt = currentProduct.name + (s.color ? ' — ' + s.color : '');
    var opts = i === 0 ? { priority: true } : (i === 1 ? { eager: true } : null);
    return '<div class="det-slide"><img ' +
      photoAttrs(s.url, 'detail', opts) +
      ' alt="' + alt + '"></div>';
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
  setDetailPrice(cheapest.price);
  // Generic disclaimer pill under the tagline — "requires 2 AAA batteries
  // (not included)" today, previously the AirTag "case only" note. The DOM
  // id/class still carry the older "case note" name.
  var caseNoteEl = document.getElementById('detailCaseNote');
  if (caseNoteEl) {
    if (currentProduct.disclaimer) {
      caseNoteEl.textContent = currentProduct.disclaimer;
      caseNoteEl.style.display = '';
    } else {
      caseNoteEl.style.display = 'none';
    }
  }
  // desc is plain text with blank-line paragraph breaks; each becomes a <p>.
  var descEl = document.getElementById('detailDesc');
  descEl.innerHTML = String(currentProduct.desc || '').split(/\n\s*\n/).map(function (para) {
    return '<p>' + esc(para.trim()) + '</p>';
  }).join('');
  document.getElementById('detailTagline').textContent = currentProduct.tagline || '';
  // The price-block rating line and the panel that replaced the old reviews
  // accordion are both rendered straight from this product's own `supplier`
  // stats -- no fetch, so they are correct on first paint instead of popping
  // in a moment later the way the /api/reviews round-trip used to.
  renderDetailRating();
  document.getElementById('qtyNum').textContent = '1';
  renderDetailShopPay();
  initShareControl();

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
  showPage('product', { sync: true });
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
  setDetailPrice(currentVariantPrice);
}

// Writes the selling price on the detail page (main price block AND the sticky
// Add To Cart bar, which mirrors it). Shared by showProduct (initial render)
// and selectSize (when the size toggles).
//
// One price, nothing beside it. This used to also write a struck-through
// "was" into #detailWas and a "Save N%" pill into .save — both computed from
// the compare-at price, both removed along with their markup in index.html
// and their rules in styles.css. See variantPriceHtml for why the compare-at
// data stays but never reaches the page. `was` is no longer a parameter, so
// re-introducing this needs a deliberate change rather than a passed argument
// quietly finding a still-present element.
function setDetailPrice(price) {
  var priceEl = document.getElementById('detailPrice');
  var stickyPriceEl = document.getElementById('stickyPrice');
  if (priceEl) priceEl.textContent = '$' + Number(price).toFixed(2);
  if (stickyPriceEl) stickyPriceEl.textContent = '$' + Number(price).toFixed(2);
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
  setDetailPrice(currentVariantPrice);
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

// ==================== WISHLIST PERSISTENCE ====================
// Same per-device scope as the cart (see SHOPIFY CART PERSISTENCE below):
// no accounts, so the wishlist lives in this browser's localStorage. Only
// product ids are stored, never product objects, so a returning visitor
// always sees current names/prices/photos. Loaded synchronously right here,
// before any grid, carousel or the wishlist page renders, so hearts paint
// filled on first render with no flash. Ids for products that no longer
// exist (discontinued/removed) are skipped and pruned from storage.
var WISHLIST_KEY = 'pawhaul_wishlist';

function loadStoredWishlist() {
  var ids;
  try { ids = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch (e) { ids = []; }
  if (!Array.isArray(ids)) ids = [];
  var seen = {};
  var items = [];
  ids.forEach(function (id) {
    id = Number(id);
    if (seen[id]) return;
    var product = products.find(function (p) { return p.id === id; });
    if (!product) return;
    seen[id] = true;
    items.push(product);
  });
  // Rewrite storage if anything was dropped (stale/duplicate/malformed ids).
  if (items.length !== ids.length) saveWishlist(items);
  return items;
}

function saveWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify((items || wishlistItems).map(function (p) { return p.id; })));
  } catch (e) { /* localStorage unavailable (private mode etc.) — wishlist just won't persist */ }
}

var wishlistItems = loadStoredWishlist();

// Keeps other open tabs of the site in step when the wishlist changes in one.
window.addEventListener('storage', function (e) {
  if (e.key !== WISHLIST_KEY) return;
  wishlistItems = loadStoredWishlist();
  updateWishlistCount();
  document.querySelectorAll('.wishlist-btn[data-wid]').forEach(function (btn) {
    var id = Number(btn.getAttribute('data-wid'));
    btn.textContent = wishlistItems.some(function (w) { return w.id === id; }) ? '♥' : '♡';
  });
  var wlPage = document.getElementById('page-wishlist');
  if (wlPage && wlPage.classList.contains('active')) renderWishlist();
});

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
  saveWishlist();
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
    var imgContent = wImgUrl ? ('<img ' + photoAttrs(wImgUrl, 'card') + ' alt="' + p.name + '">') : p.emoji;
    var inWish = true;
    return '<div class="product-card" onclick="showProduct(' + p.id + ')">' +
      '<div class="product-img-wrap"><div class="product-img">' + imgContent + '</div>' +
      '<button class="wishlist-btn" data-wid="' + p.id + '" style="opacity:1;" onclick="event.stopPropagation();wishlist(' + p.id + ')">♥</button></div>' +
      '<div class="product-info"><div class="product-name">' + p.name + '</div>' +
      supplierRatingHtml(p) +
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

  // A retired-colour line cannot be bought, so it must not be billed for
  // either — it shows in the cart as something to fix, not as a charge.
  var subtotal = cart.reduce((sum, item) => sum + (retiredColorFor(item) ? 0 : item.price * item.qty), 0);
  var shipping = 0;
  var bundleSave = bundleSavingsForCart();
  var total = subtotal - bundleSave.amount + shipping;

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cart.map((item, idx) => {
          var imgUrl = productImageFor(item, item.color);
          var imgContent = imgUrl ? ('<img ' + photoAttrs(imgUrl, 'thumb') + ' alt="' + item.name + '">') : item.emoji;
          // Discontinued colour: say so on the line, price it at nothing, and
          // offer the one action that fixes it (open the product and pick
          // another). Quantity controls are dropped — there is no quantity of
          // an unbuyable variant worth choosing.
          var gone = retiredColorFor(item);
          if (gone) {
            return `
          <div class="cart-item cart-item-gone">
            <div class="cart-item-img">${imgContent}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-variant">${item.size ? item.size + ' · ' : ''}${gone} · Qty: ${item.qty}</div>
              <p class="cart-item-gone-note">${gone} is no longer available. Pick a different color to check out.</p>
              <button class="cart-item-gone-btn" onclick="showProduct(${item.id})">Choose another color →</button>
            </div>
            <div class="cart-item-right">
              <button class="remove-btn" onclick="removeFromCart(${idx})">✕</button>
            </div>
          </div>
        `;
          }
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
        ${bundleSave.bundles.map(function (b) {
          return '<div class="summary-row summary-bundle"><span>' + esc(b.name) + ' (' + b.pct + '% off)</span><span>applied at checkout</span></div>';
        }).join('')}
        ${bundleSave.amount ? '<div class="summary-row summary-bundle"><span>Bundle savings</span><span>−$' + bundleSave.amount.toFixed(2) + '</span></div>' : ''}
        <div class="summary-row"><span>Shipping</span><span style="color:var(--green)">FREE</span></div>
        <div class="summary-row total"><span>${bundleSave.amount ? 'Estimated total' : 'Total'}</span><span>$${total.toFixed(2)}</span></div>
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

// The colour on a cart line that the catalogue no longer sells, or null when
// the line is fine: a variant deleted in Shopify is gone from `colors` and has
// no variant GID left to check out with.
//
// A line like this can only come from a tab left open across the change —
// the local cart is rebuilt from `products` on every load, and a restored
// Shopify cart maps its lines back through variantReverseMap(), which only
// knows current variants. Rare, but the old behaviour was that checkout
// refused the WHOLE cart with "please remove and try again" and never said
// which item or why, so it is worth naming.
function retiredColorFor(item) {
  if (!item || !item.color) return null;
  var product = products.find(function (p) { return p.id === item.id; });
  if (!product || !product.colors) return null;
  return product.colors.indexOf(item.color) > -1 ? null : item.color;
}

// Resolves a local cart line to the real Shopify variant GID it corresponds
// to, using that product's shopifyVariants map (see the DATA section above).
// Falls back to the product's first color when a line has no color recorded
// — quick-add never shows a color picker, so its
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
// it, two near-simultaneous adds with no cart yet (e.g. clicking Add on two
// different products quickly) would each read getStoredCartId() as empty before the other's
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

  // A discontinued colour is refused by name before the generic path, so the
  // customer is told which line to fix rather than that "something" is wrong.
  var retired = cart.filter(function (item) { return !!retiredColorFor(item); });
  if (retired.length) {
    showToast(retired.map(function (item) {
      return item.name + ' in ' + retiredColorFor(item);
    }).join(', ') + ' is no longer available — pick a different color or remove it to check out.', 6000);
    return;
  }

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

  var prevCheckoutHtml = setBtnBusy(btn, 'Preparing checkout…');
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
    clearBtnBusy(btn, prevCheckoutHtml);
    showToast((data && data.error) || 'Could not start checkout — please try again.', 5000);
  } catch (e) {
    clearBtnBusy(btn, prevCheckoutHtml);
    showToast('Could not start checkout — please try again.', 5000);
  }
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

// ==================== SHARE THIS PRODUCT ====================
//
// The origin is pinned to production rather than read from location.origin,
// mirroring the same decision in api/_seo.js: a link shared out of a preview
// deployment (or off a future custom domain alias) has to point somewhere a
// stranger can actually open, and preview hosts sit behind Vercel Auth.
var SHARE_ORIGIN = 'https://pawhaul.vercel.app';

function productShareUrl(p) {
  return SHARE_ORIGIN + '/product/' + slugify(p.name);
}

// Shows the button as "Share" or "Copy Link" depending on what the device can
// actually do. Called from showProduct(), so it is re-evaluated per product
// open and never runs before the markup exists; it is idempotent.
function initShareControl() {
  var btn = document.getElementById('detailShareBtn');
  if (!btn) return;
  var canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  btn.classList.toggle('is-copy', !canShare);
  var label = document.getElementById('detailShareLabel');
  if (label) label.textContent = canShare ? 'Share' : 'Copy Link';
  var aria = canShare ? 'Share this product' : 'Copy link to this product';
  btn.setAttribute('aria-label', aria);
  btn.setAttribute('title', aria);
}

// Clipboard fallback. navigator.clipboard is unavailable on http:// and can
// reject even on https:// (permission, or Safari outside a gesture), so the
// off-screen textarea + execCommand path stays as the last resort. If even
// that fails the URL itself goes in the toast, so the customer can still
// select it by hand rather than being told nothing happened.
function copyShareLink(url) {
  function legacyCopy() {
    try {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, url.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      showToast('Link copied!');
    }, function () {
      showToast(legacyCopy() ? 'Link copied!' : url, 6000);
    });
    return;
  }
  showToast(legacyCopy() ? 'Link copied!' : url, 6000);
}

function shareProduct() {
  if (!currentProduct) return;
  var url = productShareUrl(currentProduct);
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    // navigator.share MUST be invoked synchronously inside the click's user
    // gesture. Awaiting anything first (a permission check, a fetch) spends
    // the gesture and the OS refuses the sheet — so the call goes first and
    // every failure is handled afterwards.
    var pending;
    try {
      pending = navigator.share({
        title: currentProduct.name,
        // Deliberately no URL in the text: most targets append `url`
        // themselves, and including it here posts the link twice.
        text: 'Check out the ' + currentProduct.name + ' on PawHaul!',
        url: url
      });
    } catch (e) {
      copyShareLink(url);
      return;
    }
    if (pending && typeof pending.catch === 'function') {
      pending.catch(function (err) {
        // Dismissing the share sheet is a normal outcome, not an error —
        // falling back to a "Link copied!" toast there would be a lie about
        // something the customer just cancelled. Anything else (including
        // NotAllowedError, which means the sheet never opened) still needs
        // the fallback, or the tap does nothing at all.
        if (err && err.name === 'AbortError') return;
        copyShareLink(url);
      });
    }
    return;
  }
  copyShareLink(url);
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
// The claimed panel's code is written into the static markup so a returning
// visitor sees it pre-paint with no JS. DISCOUNT_CODE is documented as
// changeable, so this re-stamps it at boot — otherwise editing the constant
// would silently leave every returning visitor looking at the old code, which
// is the one place on the site where being stale actually costs a sale.
function syncDiscountCodeText() {
  ['emailCode', 'offerCode'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.textContent.trim() !== DISCOUNT_CODE) el.textContent = DISCOUNT_CODE;
  });
}

function revealEmailSectionSuccess(alreadyExists) {
  var section = document.querySelector('.email-section');
  var claimed = section && section.querySelector('.email-claimed');
  if (!section || !claimed) return false;

  var code = document.getElementById('emailCode');
  var msg = document.getElementById('emailSuccessMsg');

  if (code) code.textContent = DISCOUNT_CODE;
  if (msg) {
    // The code shows either way. An address already on file belongs to someone
    // who signed up before and is now standing on the page asking for their
    // code back — which is the whole reason this panel is permanent. Hiding it
    // from exactly that person would defeat the point, and it enforces nothing:
    // WELCOME10 is one fixed code and Shopify, not this page, is what holds a
    // customer to one use of it. The wording still tells them the truth.
    msg.textContent = alreadyExists
      ? "You're already signed up — here's your code again."
      : "You're in! Use this code at checkout.";
  }
  // Same class the pre-paint script in <head> sets from the stored flag, so
  // this swap is the identical state the customer gets on every later visit —
  // one rule drives both, and there is nothing to re-hide on reload.
  document.documentElement.classList.add('offer-claimed');
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
    // Both of these end up adding html.offer-claimed, so the order no longer
    // matters for the swap; the reveal still runs first because its return
    // value decides whether the toast fallback below is needed.
    var revealed = revealEmailSectionSuccess(!!data.alreadyExists);
    if (typeof markOfferClaimed === 'function') markOfferClaimed();
    // Toast only as a fallback — if the success markup is somehow missing, the
    // customer must still be told their code rather than nothing at all.
    if (!revealed) {
      showToast(data.alreadyExists
        ? "You're already signed up — use code " + DISCOUNT_CODE + " at checkout for 10% off."
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

// ==================== SUPPLIER RATINGS (task 103) ====================
// Task 56's user-submitted review system is GONE — the form, the stored
// reviews, the /api/reviews calls and the aggregateRating JSON-LD with it.
// What is left is a plain, honest reference to the real rating on the
// AliExpress listing each product is sourced from (see `supplier` in the
// product data, read off the live listings).
//
// These are the SUPPLIER's numbers, not PawHaul's. Nothing here invents a
// reviewer, a quote or a date, and nothing claims a PawHaul customer said
// anything. Every surface is neutral by construction — "4.8 * * * * * ·
// 322 ratings" asserts only that the rating exists, and the word "Reviews"
// appears nowhere, because on a PawHaul card it would read as PawHaul's own
// customers.
//
// ATTRIBUTION NOTE: a product-page panel used to spell out "these are the
// AliExpress supplier's ratings, PawHaul collects none of its own". The task
// 103 brief removed that lower section outright, so the ONLY place the
// AliExpress source is now stated is supplierAriaLabel(), which every
// surface hangs off its aria-label. Sighted shoppers see the number, the
// stars and the count with no visible source. That was the user's explicit
// call; if a visible source line is ever wanted back, this is the seam.
//
// Deliberately NOT fed into JSON-LD: Google prohibits marking up a rating
// you did not collect yourself as your product's aggregateRating, and the
// penalty is a structured-data manual action against the WHOLE site. The
// old comment in api/_seo.js explaining that risk is still the rule; the
// only change is that there is no longer a real review system to exempt.

// viewBox="0 0.484 ..." is NOT a typo and must not be "normalised" back to
// "0 0 24 24" (task 106).
//
// The star's ink spans y=2..21 of the path, so its BOUNDING BOX centre is
// y=11.5 — but a five-pointed star is not symmetric about that line. It has
// one thin point on top and two wide legs below, so its area centroid sits at
// y=12.484 (the circumscribed circle's centre, independently, is y=12.503 —
// the two agree to 0.02 units). Centring the BOX therefore hangs the star
// about 1/24 of its own height too low, which is what made "4.8 * * * * *"
// read as stars sagging under the digits on every card.
//
// Shifting the viewBox down by 12.484 - 12 = 0.484 makes the box centre BE
// the optical centre. That is a property of the icon, so every consumer gets
// it, including any consumer that centres the star with flexbox and could
// not be fixed by a baseline rule at all. Nothing about the
// drawn size changes — only where the ink sits inside its box.
function starSvg(fill) {
  return '<svg viewBox="0 0.484 24 24" fill="' + fill + '" class="rv-star" aria-hidden="true">' +
    '<path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 7.08L12 17.3 5.78 21l1.62-7.08-5.4-4.7 7.08-.6z"/></svg>';
}

// Every rating in the catalogue is x.5-x.9, so rounding to whole stars would
// round 4.5 up to a clean five and overstate it. The partial star is drawn by
// laying a gold row over a grey one and clipping it to the exact fraction —
// which is also what the reference design shows.
var STAR_GOLD = '#FFB800';
var STAR_GREY = '#D8D4CC';

function starsHtml(avg) {
  var v = Math.max(0, Math.min(5, Number(avg) || 0));
  var pct = (v / 5) * 100;
  var row = function (fill) {
    var out = '';
    for (var i = 0; i < 5; i++) out += starSvg(fill);
    return out;
  };
  return '<span class="rv-stars" aria-hidden="true">' +
    '<span class="rv-stars-base">' + row(STAR_GREY) + '</span>' +
    '<span class="rv-stars-fill" style="width:' + pct.toFixed(1) + '%">' + row(STAR_GOLD) + '</span>' +
  '</span>';
}

function supplierOf(p) {
  var s = p && p.supplier;
  return (s && typeof s.rating === 'number' && typeof s.ratings === 'number') ? s : null;
}

// Screen readers get the source spelled out even on the compact card row,
// where there is no width to print it.
function supplierAriaLabel(s) {
  return s.rating.toFixed(1) + ' out of 5 from ' + fmtRatings(s.ratings) +
    ' supplier ratings on AliExpress';
}

function fmtRatings(n) {
  return Number(n).toLocaleString('en-US');
}

// PRODUCT CARDS — shop grid and wishlist. One horizontal line
// in a fixed order, per the task-103 reference: NUMBER first, then the stars,
// then "· N ratings". Neutral by design: it states the rating and how many
// ratings there are, and claims nothing about who gave them. A product with no
// supplier stats renders no row at all rather than five decorative stars
// implying a score nobody gave.
function supplierRatingHtml(p) {
  var s = supplierOf(p);
  if (!s) return '';
  return '<div class="product-stars" role="img" aria-label="' + esc(supplierAriaLabel(s)) + '">' +
    '<strong class="product-stars-num">' + s.rating.toFixed(1) + '</strong>' +
    starsHtml(s.rating) +
    '<span class="product-stars-txt">· ' + fmtRatings(s.ratings) + ' ratings</span>' +
  '</div>';
}

// COMPACT ROWS — search results and the frequently-bought-together list.
// Same number-stars-count order as the cards, just at a smaller size, so the
// layout reads identically everywhere it appears. Same aria-label too, so the
// AliExpress source is never lost to a screen reader.
function supplierRatingCompactHtml(p) {
  var s = supplierOf(p);
  if (!s) return '';
  return '<span class="rating-compact" role="img" aria-label="' + esc(supplierAriaLabel(s)) + '">' +
    '<strong>' + s.rating.toFixed(1) + '</strong>' +
    starsHtml(s.rating) +
    '<span class="rating-compact-count">· ' + fmtRatings(s.ratings) + ' ratings</span>' +
  '</span>';
}

// Fills the product page's ONE rating surface: the line beside the price, at
// the top of the page next to the images. Called by showProduct() on every
// product open — synchronous, off local data, so there is no moment where the
// page shows a rating for the previous product.
//
// There is no lower panel any more. Task 103 removed the review accordion in
// that slot and then the supplier panel that had replaced it, so this is the
// only place a rating appears on a product page.
function renderDetailRating() {
  var p = currentProduct;
  if (!p) return;
  var s = supplierOf(p);

  // Same three parts in the same order as the cards — bold number, stars,
  // "· N ratings" — so the product page and the card a shopper clicked
  // through from read identically. Same class names too, so both share the
  // one baseline-alignment rule in styles.css rather than drifting apart.
  var line = document.getElementById('detailRating');
  if (line) {
    line.innerHTML = s
      ? '<strong class="product-stars-num">' + s.rating.toFixed(1) + '</strong>' +
        starsHtml(s.rating) +
        '<span class="product-stars-txt" id="detailRatingTxt">· ' +
        fmtRatings(s.ratings) + ' ratings</span>'
      : '';
    line.style.display = s ? '' : 'none';
    if (s) line.setAttribute('aria-label', supplierAriaLabel(s));
    else line.removeAttribute('aria-label');
  }
}

// Kept from the review system because a dozen callers outside it use this as
// the general-purpose HTML escape (the problem carousel, product cards). It
// was named esc() only because that is where it was first needed.
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ==================== INIT ====================
