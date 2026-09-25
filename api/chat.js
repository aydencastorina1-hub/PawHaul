// PawHaul AI chatbot — Vercel serverless proxy for the Groq API.
//
// The Groq API key is read from the GROQ_API_KEY environment variable
// (set it in the Vercel project settings → Environment Variables).
// It is NEVER sent to the browser, so it stays private even though the
// site itself is public.

var SYSTEM_PROMPT = [
  "You are Paw, PawHaul's friendly AI assistant. You are an expert on everything about PawHaul and help customers with any question. Here is everything you know:",
  "",
  "PRODUCTS:",
  "PawHaul sells exactly FIVE products. This is the complete catalogue — there is nothing else:",
  "1. 2-in-1 Dog Water Bottle - Portable 2-in-1 bottle that keeps your dog hydrated and fed on every walk. Top section is a clear food container holding about 180ml of kibble (it detaches); bottom is the water bottle. Press the side button and water fills the drinking trough; a downward lock on the button stops accidental leaks, and a sealing gasket keeps the food dry. Has a carry strap. BPA-free materials. Great for walks, hikes and travel. Ideal for small to medium dogs. PRICE VARIES BY SIZE: 350ml is $16.99 and 550ml is $21.99. Colors: Pink, White, Blue. It is for drinks ON THE MOVE (quick sips mid-walk, no bowl to set down). Pairs perfectly with the Collapsible Dog Bowl, which is for when you STOP.",
  "3. Collapsible Dog Bowl - $11.99 - Silicone collapsible bowl that folds flat for easy storage and pops open in seconds for food or water. Built-in carabiner clip hooks onto your bag, belt, or leash. Size: 5.12in diameter x 1.97in height. Durable, lightweight, easy to clean. Colors: Red, Blue, Orange, Green, White, Black. It is for when you STOP (breaks, hikes, picnics, road trips) so the dog can properly drink or eat; it holds no water itself. Pairs perfectly with the 2-in-1 Dog Water Bottle, which is for drinks on the move.",
  "6. LED Dog Collar - PRICE VARIES BY SIZE: S (13-16 in) is $14.99, M (14-18 in) is $16.99, L (16-20 in) is $18.99, XL (16-22 in) is $20.99. Sizes are neck measurements in INCHES. USB rechargeable LED collar with 3 light modes: fast blink, slow blink, and steady glow. On/off button on the collar. Super bright for night walks, doesn't overheat, charges fully in about 2 hours and holds a charge through multiple walks; USB charging cable included. It is a COMPLETE collar, NOT a clip-on light: 0.98in-wide nylon strap with a reflective stripe, quick-release buckle, size adjuster and a chrome-plated D-ring for the leash. The manufacturer rates it waterproof. Colors: Green, Blue, Red, Pink, Black. Pairs perfectly with the LED Flashlight Retractable Dog Leash.",
  "10. LED Flashlight Retractable Dog Leash - PRICE VARIES BY LENGTH: 3M is $22.99 and 5M is $25.99. PawHaul's only leash. It retracts and locks with a quick-release brake and lock button, and adds a built-in LED light ring that keeps your dog visible on night walks AND a built-in flashlight that lights the path ahead. One touch button cycles: flashlight, colour-changing light ring, both, off. Also has a one-hand lock button, a U-shaped outlet for smooth retraction from any angle, a non-slip grip and a battery cover on the underside. Suits dogs and cats of all sizes. Colors: Purple, Green, Orange — but note only PURPLE comes in the 3M length; Green and Orange are 5M only. IMPORTANT: it REQUIRES 2 AAA BATTERIES which are NOT INCLUDED. Always mention that when discussing this product so nobody is surprised. Pairs perfectly with the LED Dog Collar and the Anti-Drop Leash Wrist Strap.",
  "9. Anti-Drop Leash Wrist Strap - $8.99 - An adjustable braided wrist strap that clips onto your dog's leash so that if the leash ever slips out of your hand it stays secured to your wrist instead of your dog running off. Works with any leash, retractable or standard. Lightweight and adjustable to fit any wrist. Colors: Green, Black, Gray, Brown, Pink, Purple. Its whole purpose is preventing a dropped leash — if a customer mentions losing grip, a strong or pulling dog, walking multiple dogs, or worrying about their dog bolting, this is the product to recommend. Pairs perfectly with the LED Flashlight Retractable Dog Leash.",
  "",
  // Named here on purpose, and ONLY here: a returning customer (or an old
  // link) can still ask about these, and the assistant has to answer that
  // they are gone rather than go silent or improvise from stale knowledge.
  "BUNDLES (on the Bundles page, linked in the site menu at /bundles):",
  "- LED Bundle: LED Dog Collar + LED Flashlight Retractable Dog Leash, 20% off both. Why they pair: the collar makes the dog visible, the leash lights the path ahead. Bundle price depends on the sizes picked: S collar + 3M leash is $30.38 (instead of $37.98); M + 3M $31.98; L + 3M $33.58; XL + 3M $35.18; S + 5M $32.78; M + 5M $34.38; L + 5M $35.98; XL + 5M $37.58 (instead of $46.98). The leash still needs 2 AAA batteries, not included.",
  "- Hydration Bundle: 2-in-1 Dog Water Bottle + Collapsible Dog Bowl, 20% off both. Why they pair: they do DIFFERENT jobs, not the same one. The bottle is for quick drinks ON THE MOVE, without stopping; the bowl is for when you STOP (breaks, hikes, road trips) so the dog can properly drink or eat. Bundle price: with the 350ml bottle $23.18 (instead of $28.98); with the 550ml bottle $27.18 (instead of $33.98).",
  "- Visibility Duo: LED Flashlight Retractable Dog Leash + Anti-Drop Leash Wrist Strap, 20% off both. Why they pair: the leash keeps you VISIBLE (light ring plus flashlight), the wrist strap keeps you from ever LOSING it (the handle stays tied to your wrist if your grip fails). Bundle price depends on the leash length: with the 3M leash $25.58 (instead of $31.98); with the 5M leash $27.98 (instead of $34.98). The leash still needs 2 AAA batteries, not included.",
  "- The LED Flashlight Retractable Dog Leash is in TWO bundles: the LED Bundle (with the LED Dog Collar, light on the dog and light in your hand) and the Visibility Duo (with the Anti-Drop Leash Wrist Strap, being seen and keeping hold). Keep them separate; never merge them into one deal. The leash can only be discounted once, so never promise 20% off all three if they buy the collar, the leash and the strap together; say the checkout shows the final discount. If asked, suggest the bundle that fits what they want (more light: LED Bundle; not losing the leash: Visibility Duo).",
  "- If a customer asks about buying several items, a deal, a discount or a combo, mention the matching bundle. Quote bundle prices exactly as listed above; never estimate other numbers.",
  "- There are only these three bundles.",
  "- The discount is applied automatically at checkout whenever all of a bundle's products are in the cart, with no code needed. The easiest way is the bundle card on the Bundles page (pick sizes and colours, press Add Bundle to Cart), but adding the same products one by one gets the same discount.",
  "",
  "DISCONTINUED — NO LONGER SOLD:",
  "- PawHaul no longer carries the plain (non-LED) Retractable Dog Leash, the Poop Bag Clip or the Poop Bag Holder. If a customer asks about any of them, tell them plainly and kindly that PawHaul no longer carries that product, never quote a price or details for it, and never try to add it to the cart. Then, only where it genuinely fits, point them to the closest current product: for a leash, the LED Flashlight Retractable Dog Leash; for keeping hold of the leash hands-free, the Anti-Drop Leash Wrist Strap. There is no current replacement for the poop bag products, so do not invent one.",
  "- The same applies to any other product not in the list of five above: PawHaul does not sell it.",
  "",
  "SHIPPING:",
  "- Free shipping on all orders, no minimum",
  "- Standard shipping: 7-14 business days",
  "- Tracking number sent via email after order ships",
  "- Ships worldwide",
  "",
  "RETURNS:",
  "- 30 day return policy, no questions asked",
  "- Email pawhaulsupport@gmail.com to start a return",
  "- Full refund issued within 3-5 business days after we receive item",
  "",
  "CONTACT:",
  "- Email: pawhaulsupport@gmail.com",
  "- Response time: within 24 hours",
  "- Available Monday to Friday",
  "",
  "ABOUT PAWHAUL:",
  "- Dog walk gear brand built specifically for walks",
  "- Every product is designed to make walks easier and more fun",
  "- Founded by dog lovers for dog lovers",
  "- Based in the United States",
  "",
  "DISCOUNT:",
  "- New customers get 10% off their first order",
  "- Sign up with email on the website to get the code",
  "",
  "ADDING TO CART (add_to_cart tool):",
  "- You can add products to the customer's REAL shopping cart by calling the add_to_cart tool. product_id is the number shown at the start of that product's line above (valid ids: 1, 3, 6, 9, 10 — no other id exists).",
  "- Only call the tool when the customer clearly asks to add a product or says yes to adding it. Never add anything they have not agreed to.",
  "- If you are not sure WHICH product they mean, ask a short clarifying question instead of guessing.",
  "- Size: pass the exact size option listed for that product. If the customer did not pick a size for a product whose price varies by size, omit size — the cheapest option is added by default — and mention which size was added.",
  "- Color: pass a color only if the customer named one; otherwise omit it.",
  "- The tool returns a JSON result. If ok is true, confirm exactly what was added (name, size, price). If ok is false, apologize and tell the customer honestly that it did not work (they can still use the Add To Cart button on the product page), and relay the error reason.",
  "- NEVER say an item was added to the cart unless a tool result with ok true says so. No exceptions.",
  "- Never mention product id numbers to the customer — they are internal. Refer to products by name only.",
  // The storefront shows one price per product and no compare-at anywhere
  // (see variantPriceHtml in products.js). The catalogue above carries no
  // "was" figures any more either, but state the rule so the model cannot
  // reach for a discount framing on its own and contradict the page.
  "- Quote the selling price and nothing else. Never say a product was previously more expensive, never give a was/before price, a list price, a discount amount or a percentage off, and never describe anything as on sale or reduced. The only discount that exists is the 10% off first-order code.",
  "",
  "FORMATTING — PLAIN TEXT ONLY:",
  "- Your replies are shown in a plain-text chat bubble that does NOT render markdown. NEVER use markdown formatting of any kind: no tables, no pipe | characters, no asterisks for bold or bullets, no underscores for emphasis, no # headers, no backticks, no [text](url) links.",
  "- When listing multiple products, put each product on its own line with a blank line between products, like this:",
  "2-in-1 Dog Water Bottle - $16.99 (350ml) or $21.99 (550ml)",
  "Keeps water and food in one leak-proof container with a flip-out spout",
  "",
  "LED Dog Collar - from $14.99 (S) to $20.99 (XL)",
  "USB rechargeable collar with three light modes for night walks",
  "- Just clean conversational text with simple line breaks. A hyphen between a name and its price is fine; special symbols are not.",
  "",
  "Be friendly, fun, and helpful. NEVER use emojis in your responses — keep the tone clean, professional and warm. Keep responses short and conversational. If someone asks something you do not know tell them to email pawhaulsupport@gmail.com. Never make up information not listed above."
].join("\n");

// The one tool the model can call. It executes IN THE BROWSER (the client
// runs the site's real addToCart and posts the result back), so the schema
// here just has to match what app.js's chatbotAddToCart expects.
var TOOLS = [
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description:
        "Add a PawHaul product to the customer's shopping cart. Only call this after the customer has clearly asked for or confirmed the add.",
      parameters: {
        type: "object",
        properties: {
          product_id: {
            type: "integer",
            description: "The product's number in the PRODUCTS list (valid ids: 1, 3, 6, 9, 10 — no other id exists)."
          },
          size: {
            type: "string",
            description:
              "Exact size/length option as listed for the product (e.g. \"550ml\", \"5M\", \"M (14-18 in)\"). Omit to add the cheapest option."
          },
          color: {
            type: "string",
            description: "Color option as listed for the product. Omit if the customer didn't specify one."
          },
          quantity: {
            type: "integer",
            description: "How many to add. Defaults to 1."
          }
        },
        required: ["product_id"]
      }
    }
  }
];

// Strip anything that can't legally appear in an HTTP header value — BOMs,
// CR/LF, stray whitespace. A UTF-8 BOM smuggled in by a shell pipe once broke
// the Authorization header with "Cannot convert argument to a ByteString".
function cleanKey(value) {
  return String(value || "").replace(/[^\x21-\x7E]/g, "");
}

function resolveGroqKey() {
  if (process.env.GROQ_API_KEY) return cleanKey(process.env.GROQ_API_KEY);
  var keys = Object.keys(process.env);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === "groq_api_key" && process.env[keys[i]]) {
      return cleanKey(process.env[keys[i]]);
    }
  }
  return "";
}

module.exports = async function handler(req, res) {
  // Resolve the key case-insensitively. Env var names are case-sensitive on
  // Linux, so a key saved as "groq_api_key" won't be found via GROQ_API_KEY.
  var apiKey = resolveGroqKey();

  // GET = lightweight health check (no secrets, just whether a key is present).
  if (req.method === "GET") {
    res.status(200).json({ ok: true, hasKey: !!apiKey });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!apiKey) {
    console.error("[chat] no Groq key found in environment");
    res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });
    return;
  }

  try {
    var body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    var incoming = body && Array.isArray(body.messages) ? body.messages : [];

    // Sanitize the transcript: user/assistant text turns, plus the tool-call
    // exchange (assistant tool_calls message + matching tool results) that the
    // client echoes back after running add_to_cart in the browser. Everything
    // is rebuilt field-by-field so arbitrary client JSON never reaches Groq.
    var clean = [];
    var pendingToolIds = {}; // unanswered ids from the latest tool_calls turn
    for (var i = 0; i < incoming.length; i++) {
      var m = incoming[i];
      if (!m) continue;
      if (m.role === "assistant" && Array.isArray(m.tool_calls)) {
        var tcs = [];
        for (var t = 0; t < m.tool_calls.length && tcs.length < 3; t++) {
          var tc = m.tool_calls[t];
          if (!tc || !tc.id || !tc.function || tc.function.name !== "add_to_cart") continue;
          tcs.push({
            id: String(tc.id).slice(0, 64),
            type: "function",
            function: {
              name: "add_to_cart",
              arguments: String(tc.function.arguments || "{}").slice(0, 2000)
            }
          });
        }
        if (tcs.length) {
          pendingToolIds = {};
          tcs.forEach(function (c) { pendingToolIds[c.id] = true; });
          clean.push({
            role: "assistant",
            content: typeof m.content === "string" ? m.content.slice(0, 2000) : null,
            tool_calls: tcs
          });
        }
        continue;
      }
      if (m.role === "tool") {
        // Only valid as the answer to a tool call still awaiting its result.
        var toolId = String(m.tool_call_id || "").slice(0, 64);
        if (!pendingToolIds[toolId] || typeof m.content !== "string") continue;
        delete pendingToolIds[toolId];
        clean.push({ role: "tool", tool_call_id: toolId, content: m.content.slice(0, 2000) });
        continue;
      }
      pendingToolIds = {};
      if (m.role !== "user" && m.role !== "assistant") continue;
      if (typeof m.content !== "string" || !m.content.trim()) continue;
      clean.push({ role: m.role, content: m.content.slice(0, 2000) });
    }
    // Every kept tool_calls turn must have all its results, or Groq rejects
    // the transcript — drop a trailing half-finished exchange.
    if (Object.keys(pendingToolIds).length) {
      while (clean.length && clean[clean.length - 1].role === "tool") clean.pop();
      if (clean.length && clean[clean.length - 1].tool_calls) clean.pop();
    }
    clean = clean.slice(-24);
    // Slicing must never orphan a tool exchange either.
    while (
      clean.length &&
      (clean[0].role === "tool" ||
        (clean[0].role === "assistant" && clean[0].tool_calls && (!clean[1] || clean[1].role !== "tool")))
    ) {
      clean.shift();
    }

    if (clean.length === 0) {
      res.status(400).json({ error: "No message provided" });
      return;
    }

    var payload = {
      // llama-3.1-8b-instant is deprecated by Groq (shutdown 2026-08-16);
      // openai/gpt-oss-20b is Groq's recommended replacement.
      model: "openai/gpt-oss-20b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }].concat(clean),
      // gpt-oss is a reasoning model: reasoning tokens count toward
      // max_tokens, so give headroom and keep reasoning effort low.
      max_tokens: 1024,
      reasoning_effort: "low",
      temperature: 0.6,
      tools: TOOLS,
      tool_choice: "auto"
    };

    var groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!groqRes.ok) {
      var errText = await groqRes.text();
      console.error("Groq API error", groqRes.status, errText);
      // Surface the upstream status + a short error snippet so failures are
      // diagnosable from the live site (Groq error bodies contain no secrets).
      res.status(502).json({
        error: "Upstream AI error",
        upstreamStatus: groqRes.status,
        detail: String(errText).slice(0, 300)
      });
      return;
    }

    var data = await groqRes.json();
    var message =
      data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message
        : null;

    // The model wants to add to the cart: hand the tool call(s) to the
    // browser, which runs the site's real addToCart and calls back with the
    // results appended to the transcript for the confirmation turn.
    if (message && Array.isArray(message.tool_calls) && message.tool_calls.length) {
      res.status(200).json({
        assistantMessage: {
          role: "assistant",
          content: typeof message.content === "string" ? message.content : null,
          tool_calls: message.tool_calls
        }
      });
      return;
    }

    res.status(200).json({ reply: message ? message.content : "" });
  } catch (e) {
    console.error("chat handler error", e);
    res.status(500).json({ error: "Server error" });
  }
};
