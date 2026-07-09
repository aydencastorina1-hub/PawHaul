// PawHaul email-capture popup — Vercel serverless proxy for Shopify's
// Storefront API customerCreate mutation.
//
// The Storefront API's customerCreate mutation always requires a password
// (it creates a real storefront login account — there's no marketing-only
// signup mutation on this API surface). Since the popup only ever asks for
// an email, this endpoint generates a random password server-side purely to
// satisfy the schema; it's never logged, returned, or reused, so the
// customer never actually has a usable password (a well-established
// pattern for headless "email capture" via the Storefront API without
// Admin API access).

var crypto = require("crypto");

// Same BOM/whitespace defense as api/chat.js's cleanKey / api/cart.js's
// cleanValue — a shell pipe can smuggle invisible characters into a saved
// env var and break the header.
function cleanValue(value) {
  return String(value || "").replace(/[^\x21-\x7E]/g, "");
}

function resolveEnv(name) {
  if (process.env[name]) return cleanValue(process.env[name]);
  var keys = Object.keys(process.env);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === name.toLowerCase() && process.env[keys[i]]) {
      return cleanValue(process.env[keys[i]]);
    }
  }
  return "";
}

module.exports = async function handler(req, res) {
  var token = resolveEnv("SHOPIFY_STOREFRONT_TOKEN");
  var domain = resolveEnv("SHOPIFY_STORE_DOMAIN").replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (req.method === "GET") {
    res.status(200).json({ ok: true, hasToken: !!token, hasDomain: !!domain });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  if (!token || !domain) {
    console.error("[customer] SHOPIFY_STOREFRONT_TOKEN or SHOPIFY_STORE_DOMAIN not configured");
    res.status(500).json({ ok: false, error: "Signup is not configured on the server." });
    return;
  }

  try {
    var body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    var email = body && typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
    if (!email || email.indexOf("@") === -1) {
      res.status(400).json({ ok: false, error: "Please enter a valid email." });
      return;
    }

    var query =
      "mutation CustomerCreate($input: CustomerCreateInput!) { " +
      "customerCreate(input: $input) { " +
      "customer { id email } " +
      "customerUserErrors { code field message } " +
      "} }";

    var shopifyRes = await fetch("https://" + domain + "/api/2024-10/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({
        query: query,
        variables: {
          input: {
            email: email,
            password: crypto.randomBytes(24).toString("base64"),
            acceptsMarketing: true
          }
        }
      })
    });

    if (!shopifyRes.ok) {
      var errText = await shopifyRes.text();
      console.error("Shopify Storefront API error", shopifyRes.status, errText);
      res.status(502).json({ ok: false, error: "Could not sign up right now — please try again." });
      return;
    }

    var data = await shopifyRes.json();
    if (data.errors && data.errors.length) {
      console.error("Shopify customerCreate GraphQL errors", JSON.stringify(data.errors));
      res.status(502).json({ ok: false, error: "Could not sign up right now — please try again." });
      return;
    }

    var result = data && data.data && data.data.customerCreate;
    var userErrors = (result && result.customerUserErrors) || [];
    if (userErrors.length) {
      var taken = userErrors.some(function (e) {
        return e.code === "TAKEN" || /already|taken/i.test(e.message || "");
      });
      if (taken) {
        // Not a real failure from the customer's point of view — they're
        // already subscribed, so they still get the code.
        res.status(200).json({ ok: true, alreadyExists: true });
        return;
      }
      console.error("Shopify customerCreate userErrors", JSON.stringify(userErrors));
      res.status(200).json({ ok: false, error: "Could not sign up right now — please try again." });
      return;
    }

    if (!result || !result.customer) {
      res.status(502).json({ ok: false, error: "Could not sign up right now — please try again." });
      return;
    }

    res.status(200).json({ ok: true, alreadyExists: false });
  } catch (e) {
    console.error("customer handler error", e);
    res.status(500).json({ ok: false, error: "Server error — please try again." });
  }
};
