// PawHaul checkout — Vercel serverless proxy for Shopify's Storefront API.
//
// The client (checkout() in products.js) already knows exactly which Shopify
// variant each local cart line maps to (see each product's shopifyVariants
// field) and posts { lines: [{ variantId, quantity }] } here. This endpoint
// creates a real Shopify cart from those lines and returns its checkoutUrl —
// DSers/the Shopify admin sees the resulting order like any other sale.
//
// SHOPIFY_STOREFRONT_TOKEN / SHOPIFY_STORE_DOMAIN are read from Vercel env
// vars (never committed). A Storefront API token is designed to be safe in
// client-side code by Shopify's own model (it only grants read + cart/
// checkout access), but it's kept server-side here anyway to match this
// project's existing pattern (see api/chat.js) and to validate/limit what a
// request can ask for before it reaches Shopify.

var VARIANT_GID_RE = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

// Same BOM/whitespace defense as api/chat.js's cleanKey — a shell pipe can
// smuggle invisible characters into a saved env var and break the header.
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
    console.error("[cart] SHOPIFY_STOREFRONT_TOKEN or SHOPIFY_STORE_DOMAIN not configured");
    res.status(500).json({ ok: false, error: "Checkout is not configured on the server." });
    return;
  }

  try {
    var body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    var rawLines = body && Array.isArray(body.lines) ? body.lines : [];

    // Rebuild every line field-by-field — never forward arbitrary client
    // JSON into the GraphQL request.
    var lines = [];
    for (var i = 0; i < rawLines.length && lines.length < 50; i++) {
      var l = rawLines[i];
      if (!l || typeof l.variantId !== "string" || !VARIANT_GID_RE.test(l.variantId)) continue;
      var qty = parseInt(l.quantity, 10);
      if (!(qty >= 1)) qty = 1;
      if (qty > 20) qty = 20;
      lines.push({ merchandiseId: l.variantId, quantity: qty });
    }

    if (!lines.length) {
      res.status(400).json({ ok: false, error: "Your cart is empty or contains no valid items." });
      return;
    }

    var query =
      "mutation CartCreate($lines: [CartLineInput!]!) { " +
      "cartCreate(input: { lines: $lines }) { " +
      "cart { id checkoutUrl } " +
      "userErrors { field message } " +
      "} }";

    var shopifyRes = await fetch("https://" + domain + "/api/2024-10/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({ query: query, variables: { lines: lines } })
    });

    if (!shopifyRes.ok) {
      var errText = await shopifyRes.text();
      console.error("Shopify Storefront API error", shopifyRes.status, errText);
      res.status(502).json({ ok: false, error: "Could not reach Shopify checkout — please try again." });
      return;
    }

    var data = await shopifyRes.json();
    if (data.errors && data.errors.length) {
      console.error("Shopify Storefront API GraphQL errors", JSON.stringify(data.errors));
      res.status(502).json({ ok: false, error: "Could not start checkout — please try again." });
      return;
    }

    var result = data && data.data && data.data.cartCreate;
    var userErrors = (result && result.userErrors) || [];
    if (userErrors.length) {
      // Most common real-world case: a variant went out of stock between the
      // customer adding it locally and hitting Checkout.
      var msg = userErrors.map(function (e) { return e.message; }).join(" ");
      res.status(200).json({
        ok: false,
        error: "Some items in your cart are no longer available (" + msg + "). Please remove them and try again."
      });
      return;
    }

    if (!result || !result.cart || !result.cart.checkoutUrl) {
      res.status(502).json({ ok: false, error: "Could not start checkout — please try again." });
      return;
    }

    res.status(200).json({ ok: true, checkoutUrl: result.cart.checkoutUrl });
  } catch (e) {
    console.error("cart handler error", e);
    res.status(500).json({ ok: false, error: "Server error — please try again." });
  }
};
