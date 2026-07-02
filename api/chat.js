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
  "1. PawHaul Walk Kit 2-in-1 - Portable 2-in-1 bottle that keeps your dog hydrated and fed on every walk. Leak-proof design holds both water and dry food in one sleek container, with a flip-out drinking spout for easy on-the-go hydration. Lightweight, durable and great for walks, hikes and travel. Ideal for small to medium dogs. PRICE VARIES BY SIZE: 350ml is $19.99 (was $27.99) and 550ml is $24.99 (was $34.99). Colors: Pink, Teal/Blue, Red/Maroon.",
  "2. Leash With Poop Bag Dispenser - $19.99 (was $27.99) - Premium leash with built-in poop bag dispenser. Comes with starter roll of bags.",
  "3. Collapsible Travel Bowl - $12.99 (was $17.99) - Silicone foldable bowl. Collapses flat for easy storage. Food and water safe.",
  "4. AirTag Dog Tag Holder - $14.99 (was $19.99) - Waterproof silicone holder that keeps Apple AirTag on your dog's collar. Twist lock closure. Fits standard collars up to 1.5 inch wide.",
  "5. Hands-Free Running Leash - $22.99 (was $29.99) - Waist belt leash with bungee cord. Adjustable waist 28-48 inch. Bungee absorbs shock. Phone pocket included.",
  "6. Reflective Safety Collar - $16.99 (was $22.99) - Reflective strips visible up to 500 feet. Adjustable sizing. Available in small, medium, large.",
  "7. Dual Dog Walk Coupler - $21.99 (was $28.99) - Walk two dogs at once with zero tangle. 360-degree swivel clips prevent knots while the bungee cord absorbs shock from both dogs. Adjustable length fits all breed sizes. Reflective stitching. Perfect for multi-dog households.",
  "8. Walk Clean Bag Hook - $9.99 (was $14.99) - A carabiner clip that hooks a poop bag directly onto any leash so the bag hangs securely while you keep walking. Compatible with all standard leashes. Lightweight and odor resistant. Hands-free carry.",
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
  "Be friendly, fun, and helpful. Use dog emojis occasionally 🐾. Keep responses short and conversational. If someone asks something you do not know tell them to email pawhaulsupport@gmail.com. Never make up information not listed above."
].join("\n");

function resolveGroqKey() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  var keys = Object.keys(process.env);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === "groq_api_key" && process.env[keys[i]]) {
      return process.env[keys[i]];
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

    // Only allow user/assistant turns through, cap length, keep recent context.
    var clean = [];
    for (var i = 0; i < incoming.length; i++) {
      var m = incoming[i];
      if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
      if (typeof m.content !== "string" || !m.content.trim()) continue;
      clean.push({ role: m.role, content: m.content.slice(0, 2000) });
    }
    clean = clean.slice(-20);

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
      temperature: 0.6
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
    var reply =
      data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : "";

    res.status(200).json({ reply: reply });
  } catch (e) {
    console.error("chat handler error", e);
    res.status(500).json({ error: "Server error" });
  }
};
