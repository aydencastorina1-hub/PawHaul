// PawHaul shop settings — read-only Storefront API lookup.
//
// Exists for ONE reason: the payment badges on the cart and product pages
// must reflect what this store actually accepts, not a guessed row of card
// logos. Shopify reports that directly via shop.paymentSettings, so the
// badges are grounded in the merchant's real Shopify Payments configuration.
//
// Read-only and cheap, but it is NOT on the customer's critical path: the
// site ships a build-time snapshot of these values (PAYMENT_METHODS in
// products.js) and renders from that, so the badge row costs no request and
// cannot shift layout. This endpoint is what that snapshot is checked
// against — run `node scripts/check-payment-methods.js` after changing
// anything in Shopify Payments to see whether the snapshot has gone stale.
//
// Same env handling as api/cart.js: SHOPIFY_STOREFRONT_TOKEN and
// SHOPIFY_STORE_DOMAIN come from Vercel env vars and never touch the repo.

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

var QUERY = "{ shop { name primaryDomain { url } paymentSettings {" +
  " acceptedCardBrands supportedDigitalWallets countryCode currencyCode" +
  " shopifyPaymentsAccountId } } }";

module.exports = async function handler(req, res) {
  var token = resolveEnv("SHOPIFY_STOREFRONT_TOKEN");
  var domain = resolveEnv("SHOPIFY_STORE_DOMAIN").replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }
  if (!token || !domain) {
    res.status(500).json({ ok: false, error: "Shop lookup is not configured on the server." });
    return;
  }

  try {
    var r = await fetch("https://" + domain + "/api/2024-10/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({ query: QUERY })
    });
    var data = null;
    try { data = await r.json(); } catch (e) { /* handled below */ }

    if (!r.ok) {
      res.status(502).json({ ok: false, error: "Could not reach Shopify.", upstreamStatus: r.status });
      return;
    }
    if (data && data.errors && data.errors.length) {
      // Surfaced rather than swallowed: this endpoint is a diagnostic, and a
      // field-name change in a future API version should be legible.
      res.status(502).json({ ok: false, error: "Shopify returned errors.", detail: data.errors });
      return;
    }
    var shop = data && data.data && data.data.shop;
    if (!shop) {
      res.status(502).json({ ok: false, error: "Malformed response from Shopify." });
      return;
    }
    var ps = shop.paymentSettings || {};
    res.status(200).json({
      ok: true,
      shopName: shop.name,
      primaryDomain: shop.primaryDomain && shop.primaryDomain.url,
      acceptedCardBrands: ps.acceptedCardBrands || [],
      supportedDigitalWallets: ps.supportedDigitalWallets || [],
      countryCode: ps.countryCode,
      currencyCode: ps.currencyCode,
      usesShopifyPayments: !!ps.shopifyPaymentsAccountId
    });
  } catch (e) {
    console.error("[shop] lookup failed", e && e.message);
    res.status(502).json({ ok: false, error: "Shop lookup failed." });
  }
};
