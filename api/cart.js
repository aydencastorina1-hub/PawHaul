// PawHaul cart — Vercel serverless proxy for Shopify's Storefront API.
//
// One endpoint, dispatched by body.action, backing the persistent-cart
// feature: products.js keeps a real Shopify cart in sync with the local
// `cart` array (create the first time a variant is added, addLines/
// updateLines/removeLines after that, reusing the same cart id — see the
// SHOPIFY CART PERSISTENCE section in products.js) and restores it from
// Shopify on a later visit via `get`. The final Checkout button (checkout()
// in products.js) also lands here, reusing whatever cart is already synced.
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

// Cart/CartLine ids carry a query-string key portion (gid://shopify/Cart/c1-
// xxxx?key=xxxx) so a strict char-class regex is more trouble than it's
// worth — these are passed as GraphQL *variables* (never string-concatenated
// into the query), so the real injection risk doesn't apply here; this check
// is just sanity/defense-in-depth against garbage input.
function isGid(value, type) {
  return typeof value === "string" && value.length > 0 && value.length <= 300 &&
    value.indexOf("gid://shopify/" + type + "/") === 0;
}

// Rebuilds+validates a client-supplied lines array field-by-field — never
// forwards arbitrary client JSON into a GraphQL request. Shared by create/addLines.
function sanitizeMerchandiseLines(rawLines) {
  var lines = [];
  if (!Array.isArray(rawLines)) return lines;
  for (var i = 0; i < rawLines.length && lines.length < 50; i++) {
    var l = rawLines[i];
    if (!l || !VARIANT_GID_RE.test(l.variantId)) continue;
    var qty = parseInt(l.quantity, 10);
    if (!(qty >= 1)) qty = 1;
    if (qty > 20) qty = 20;
    lines.push({ merchandiseId: l.variantId, quantity: qty });
  }
  return lines;
}

// Same idea for updateLines, which addresses a line by its own CartLine id
// (not a variant id) plus a new quantity.
function sanitizeUpdateLines(rawLines) {
  var lines = [];
  if (!Array.isArray(rawLines)) return lines;
  for (var i = 0; i < rawLines.length && lines.length < 50; i++) {
    var l = rawLines[i];
    if (!l || !isGid(l.id, "CartLine")) continue;
    var qty = parseInt(l.quantity, 10);
    if (!(qty >= 1)) qty = 1;
    if (qty > 20) qty = 20;
    lines.push({ id: l.id, quantity: qty });
  }
  return lines;
}

// Requested on every action so the client always gets back exactly what it
// needs to stay in sync: the cart id (for storing/reusing), checkoutUrl (for
// the Checkout button), and each line's own CartLine id + variant id (so the
// client can map a Shopify line back to a local cart item and target that
// exact line on the next quantity change/removal).
var CART_FIELDS =
  "id checkoutUrl lines(first: 100) { edges { node { id quantity merchandise { ... on ProductVariant { id } } } } }";

async function shopifyGraphql(domain, token, query, variables) {
  var res = await fetch("https://" + domain + "/api/2024-10/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token
    },
    body: JSON.stringify({ query: query, variables: variables })
  });
  var data = null;
  try { data = await res.json(); } catch (e) { /* leave data null — handled below */ }
  return { httpOk: res.ok, status: res.status, data: data };
}

function linesFromCart(cartObj) {
  if (!cartObj || !cartObj.lines || !cartObj.lines.edges) return [];
  return cartObj.lines.edges.map(function (e) {
    return {
      id: e.node.id,
      variantId: e.node.merchandise && e.node.merchandise.id,
      quantity: e.node.quantity
    };
  });
}

// Shared response handling for the three mutations (create/addLines/
// updateLines/removeLines all return the same { cart { ... } userErrors }
// shape) — one place to interpret GraphQL errors, userErrors, and a
// malformed/missing cart consistently.
function respondWithMutation(res, r, mutationName) {
  if (!r.httpOk) {
    console.error("[cart] Shopify Storefront API HTTP error", r.status);
    res.status(502).json({ ok: false, error: "Could not reach Shopify — please try again." });
    return;
  }
  if (r.data && r.data.errors && r.data.errors.length) {
    console.error("[cart] Shopify Storefront API GraphQL errors", JSON.stringify(r.data.errors));
    res.status(502).json({ ok: false, error: "Could not update your cart — please try again." });
    return;
  }
  var result = r.data && r.data.data && r.data.data[mutationName];
  var userErrors = (result && result.userErrors) || [];
  if (userErrors.length) {
    // Most common real-world case: a variant went out of stock, or the
    // cart/line id itself no longer exists (expired cart).
    var msg = userErrors.map(function (e) { return e.message; }).join(" ");
    res.status(200).json({
      ok: false,
      error: "Some items in your cart are no longer available (" + msg + ")."
    });
    return;
  }
  var resultCart = result && result.cart;
  if (!resultCart || !resultCart.checkoutUrl) {
    res.status(502).json({ ok: false, error: "Could not update your cart — please try again." });
    return;
  }
  res.status(200).json({
    ok: true,
    cartId: resultCart.id,
    checkoutUrl: resultCart.checkoutUrl,
    lines: linesFromCart(resultCart)
  });
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
    res.status(500).json({ ok: false, error: "Cart is not configured on the server." });
    return;
  }

  var body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};
  // No action specified = the original single-purpose behavior this endpoint
  // always had (build a fresh cart from a full line list) — keeps any old
  // caller/cached client working exactly as before.
  var action = typeof body.action === "string" ? body.action : "create";

  try {
    if (action === "get") {
      if (!isGid(body.cartId, "Cart")) {
        res.status(200).json({ ok: false, notFound: true, error: "No cart id given." });
        return;
      }
      var qGet = "query CartGet($id: ID!) { cart(id: $id) { " + CART_FIELDS + " } }";
      var rGet = await shopifyGraphql(domain, token, qGet, { id: body.cartId });
      if (!rGet.httpOk || (rGet.data && rGet.data.errors && rGet.data.errors.length)) {
        res.status(200).json({ ok: false, notFound: true, error: "Cart lookup failed." });
        return;
      }
      var gotCart = rGet.data && rGet.data.data && rGet.data.data.cart;
      if (!gotCart) {
        // Carts do expire — this is the expected, non-error path for a stale
        // id, not a server fault.
        res.status(200).json({ ok: false, notFound: true, error: "Cart not found or expired." });
        return;
      }
      res.status(200).json({
        ok: true,
        cartId: gotCart.id,
        checkoutUrl: gotCart.checkoutUrl,
        lines: linesFromCart(gotCart)
      });
      return;
    }

    if (action === "create") {
      var createLines = sanitizeMerchandiseLines(body.lines);
      if (!createLines.length) {
        res.status(400).json({ ok: false, error: "Your cart is empty or contains no valid items." });
        return;
      }
      var mCreate =
        "mutation CartCreate($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { " +
        CART_FIELDS + " } userErrors { field message } } }";
      var rCreate = await shopifyGraphql(domain, token, mCreate, { lines: createLines });
      respondWithMutation(res, rCreate, "cartCreate");
      return;
    }

    if (action === "addLines") {
      if (!isGid(body.cartId, "Cart")) { res.status(400).json({ ok: false, error: "Missing cart id." }); return; }
      var addLines = sanitizeMerchandiseLines(body.lines);
      if (!addLines.length) { res.status(400).json({ ok: false, error: "Nothing to add." }); return; }
      var mAdd =
        "mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { " +
        CART_FIELDS + " } userErrors { field message } } }";
      var rAdd = await shopifyGraphql(domain, token, mAdd, { cartId: body.cartId, lines: addLines });
      respondWithMutation(res, rAdd, "cartLinesAdd");
      return;
    }

    if (action === "updateLines") {
      if (!isGid(body.cartId, "Cart")) { res.status(400).json({ ok: false, error: "Missing cart id." }); return; }
      var updLines = sanitizeUpdateLines(body.lines);
      if (!updLines.length) { res.status(400).json({ ok: false, error: "Nothing to update." }); return; }
      var mUpd =
        "mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { " +
        CART_FIELDS + " } userErrors { field message } } }";
      var rUpd = await shopifyGraphql(domain, token, mUpd, { cartId: body.cartId, lines: updLines });
      respondWithMutation(res, rUpd, "cartLinesUpdate");
      return;
    }

    if (action === "removeLines") {
      if (!isGid(body.cartId, "Cart")) { res.status(400).json({ ok: false, error: "Missing cart id." }); return; }
      var lineIds = Array.isArray(body.lineIds)
        ? body.lineIds.filter(function (id) { return isGid(id, "CartLine"); }).slice(0, 50)
        : [];
      if (!lineIds.length) { res.status(400).json({ ok: false, error: "Nothing to remove." }); return; }
      var mRem =
        "mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { " +
        CART_FIELDS + " } userErrors { field message } } }";
      var rRem = await shopifyGraphql(domain, token, mRem, { cartId: body.cartId, lineIds: lineIds });
      respondWithMutation(res, rRem, "cartLinesRemove");
      return;
    }

    res.status(400).json({ ok: false, error: "Unknown action." });
  } catch (e) {
    console.error("[cart] handler error", e);
    res.status(500).json({ ok: false, error: "Server error — please try again." });
  }
};
