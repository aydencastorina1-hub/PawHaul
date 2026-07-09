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
  "1. 2-in-1 Dog Water Bottle - Portable 2-in-1 bottle that keeps your dog hydrated and fed on every walk. Leak-proof design holds both water and dry food in one sleek container, with a flip-out drinking spout for easy on-the-go hydration. Lightweight, durable and great for walks, hikes and travel. Ideal for small to medium dogs. PRICE VARIES BY SIZE: 350ml is $19.99 (was $27.99) and 550ml is $24.99 (was $34.99). Colors: Pink, White, Blue.",
  "2. Retractable Dog Leash - PRICE VARIES BY LENGTH: 3m (10ft) is $17.99 (was $24.99) and 5m (16ft) is $21.99 (was $28.99). Retractable leash with a smooth, jam-free mechanism and a one-touch lock button for instant stopping power. Durable nylon construction handles dogs of all sizes. Comfortable ergonomic grip. Colors: Red, Green, Blue, White, Pink. IMPORTANT: Pink is OUT OF STOCK in the 5m (16ft) length only — Pink in 3m (10ft) is fully available. If a customer asks for Pink in 5m, let them know that combo is currently out of stock and offer Pink in 3m or another color in 5m instead. Pairs perfectly with the Poop Bag Clip and Poop Bag Holder.",
  "3. Collapsible Dog Bowl - $14.99 (was $21.99) - Silicone collapsible bowl that folds flat for easy storage and pops open in seconds for food or water. Built-in carabiner clip hooks onto your bag, belt, or leash. Size: 5.12in diameter x 1.97in height. Durable, lightweight, easy to clean. Colors: Red, Blue, Orange, Green, White, Black.",
  "4. Dog AirTag Holder - $10.99 (was $16.99) - Waterproof silicone holder that keeps Apple AirTag on your dog's collar. Twist lock closure. Fits standard collars up to 1.5 inch wide. Colors: Black, Transparent, Pink, Blue, Green, Purple. IMPORTANT: this is the CASE ONLY — it does not include an Apple AirTag, which is sold separately by Apple. Proactively mention this whenever discussing this product so customers aren't surprised.",
  "5. Poop Bag Clip - $9.99 (was $14.99) - Compact dispenser clip that holds a full roll of UNUSED waste bags and clips onto any leash, dispensing one bag at a time so you're always ready before pickup. Lightweight and weatherproof. Colors: Orange, Purple, Red, Black, Green, Pink, Blue. Pairs perfectly with the Retractable Dog Leash and the Poop Bag Holder.",
  "6. Light Up Dog Collar - PRICE VARIES BY SIZE: S (34-41cm) is $19.99 (was $26.99), M (37-46cm) is $21.99 (was $29.99), L (41-52cm) is $23.99 (was $32.99), XL (42-56cm) is $25.99 (was $35.99). USB rechargeable LED collar with 3 light modes: fast blink, slow blink, and steady glow. Super bright for night walks, doesn't overheat, charges fully in about 2 hours and holds a charge through multiple walks. Detachable design fits any standard collar setup. Colors: Green, Blue, Red, Pink, Black.",
  "8. Poop Bag Holder - $9.99 (was $14.99) - Odor-sealing pouch that clips onto your leash or bag and holds a USED waste bag securely shut until you reach a trash can. Wipeable and discreet. Colors: Green, Blue, Black. This is DIFFERENT from the Poop Bag Clip (which dispenses unused bags) — if a customer seems unsure which one they want, briefly clarify the difference: Clip = holds a roll of unused bags, Holder = carries a used bag until disposal. Pairs perfectly with the Poop Bag Clip and the 2-in-1 Dog Water Bottle.",
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
  "- You can add products to the customer's REAL shopping cart by calling the add_to_cart tool. product_id is the number shown at the start of that product's line above (valid ids: 1, 2, 3, 4, 5, 6, 8 — there is no product 7).",
  "- Only call the tool when the customer clearly asks to add a product or says yes to adding it. Never add anything they have not agreed to.",
  "- If you are not sure WHICH product they mean, ask a short clarifying question instead of guessing.",
  "- Size: pass the exact size option listed for that product. If the customer did not pick a size for a product whose price varies by size, omit size — the cheapest option is added by default — and mention which size was added.",
  "- Color: pass a color only if the customer named one; otherwise omit it.",
  "- The tool returns a JSON result. If ok is true, confirm exactly what was added (name, size, price). If ok is false, apologize and tell the customer honestly that it did not work (they can still use the Add To Cart button on the product page), and relay the error reason.",
  "- NEVER say an item was added to the cart unless a tool result with ok true says so. No exceptions.",
  "- Never mention product id numbers to the customer — they are internal. Refer to products by name only.",
  "",
  "FORMATTING — PLAIN TEXT ONLY:",
  "- Your replies are shown in a plain-text chat bubble that does NOT render markdown. NEVER use markdown formatting of any kind: no tables, no pipe | characters, no asterisks for bold or bullets, no underscores for emphasis, no # headers, no backticks, no [text](url) links.",
  "- When listing multiple products, put each product on its own line with a blank line between products, like this:",
  "2-in-1 Dog Water Bottle - $19.99 (350ml) or $24.99 (550ml)",
  "Keeps water and food in one leak-proof container with a flip-out spout",
  "",
  "Retractable Dog Leash - $17.99 (3m) or $21.99 (5m)",
  "Jam-free retractable leash with one-touch lock",
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
            description: "The product's number in the PRODUCTS list (valid ids: 1, 2, 3, 4, 5, 6, 8 — there is no product 7)."
          },
          size: {
            type: "string",
            description:
              "Exact size/length option as listed for the product (e.g. \"550ml\", \"5m (16ft)\", \"M (37-46cm)\"). Omit to add the cheapest option."
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
