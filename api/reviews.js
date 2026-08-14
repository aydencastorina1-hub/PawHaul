// PawHaul product reviews — real, user-submitted, publicly visible.
//
// WHY THIS SHAPE: this repo has NO package.json and no build step; every other
// serverless function here (chat, cart, customer, shop) talks to its backend
// with plain `fetch`. Adding an SDK would introduce a dependency install to a
// project that deliberately has none. Both backends below therefore speak
// their REST APIs directly:
//
//   * Upstash Redis (REST)  — the review data itself.
//   * Vercel Blob  (REST)   — the optional review photo.
//
// Blob is OPTIONAL. With no blob token the endpoint still works and simply
// refuses photos, so reviews can go live before photo hosting is set up.
//
// ENV (all injected by the Vercel Marketplace install; both the Upstash names
// and Vercel's legacy KV_* aliases are accepted, since which pair you get
// depends on how the integration was provisioned):
//   UPSTASH_REDIS_REST_URL   | KV_REST_API_URL
//   UPSTASH_REDIS_REST_TOKEN | KV_REST_API_TOKEN
//   BLOB_READ_WRITE_TOKEN    (optional — photos, classic Blob provisioning)
//   BLOB_STORE_ID            (optional — photos, OIDC Blob provisioning)
//
// KEYS
//   pawhaul:rev:<productId>  LIST  newest-first JSON review objects
//   pawhaul:agg:<productId>  HASH  { n: <count>, sum: <sum of ratings> }
//   pawhaul:rl:<bucket>      STR   rate-limit marker with a TTL
//
// The aggregate is kept as its own counter rather than recomputed from the
// list, so the site-wide stats call is one cheap HGETALL per product instead
// of pulling every review body for every product on every page load.
//
// Every review carries a unique `id`. Nothing uses it yet — it is there so a
// moderation/delete endpoint can be added later without a data migration.

var MAX_TEXT = 1500;
var MAX_NAME = 40;
var MAX_PHOTO_BYTES = 2 * 1024 * 1024;      // 2 MB
var MAX_LIST = 200;                          // reviews kept per product
var ALLOWED_PHOTO = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

// Reviews may only be attached to a product that actually exists. Without this
// anyone could POST reviews for arbitrary ids and quietly fill the store with
// rows nothing renders. The catalogue is parsed from products.js by the same
// helper the SEO renderer uses (see includeFiles for api/reviews.js in
// vercel.json), and cached for the life of the serverless instance.
var seo = require('./_seo.js');
var _idsCache = null;
async function validProductIds(baseUrl) {
  if (_idsCache) return _idsCache;
  try {
    var list = await seo.getProducts(baseUrl);
    if (list && list.length) {
      _idsCache = {};
      list.forEach(function (p) { if (p && p.id) _idsCache[p.id] = true; });
    }
  } catch (e) { /* fall through — see below */ }
  return _idsCache;
}

function cleanValue(v) { return String(v || '').replace(/[^\x21-\x7E]/g, ''); }

function resolveEnv(names) {
  for (var i = 0; i < names.length; i++) {
    var want = names[i];
    if (process.env[want]) return cleanValue(process.env[want]);
    var keys = Object.keys(process.env);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j].toLowerCase() === want.toLowerCase() && process.env[keys[j]]) {
        return cleanValue(process.env[keys[j]]);
      }
    }
  }
  return '';
}

function redisConfig() {
  return {
    url: resolveEnv(['UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL']).replace(/\/$/, ''),
    token: resolveEnv(['UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN'])
  };
}

// One Upstash pipeline round-trip. Commands are arrays: [["HGETALL","k"], ...]
async function redis(commands) {
  var cfg = redisConfig();
  if (!cfg.url || !cfg.token) return { configured: false, results: [] };
  var res = await fetch(cfg.url + '/pipeline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cfg.token },
    body: JSON.stringify(commands)
  });
  if (!res.ok) {
    var detail = await res.text().catch(function () { return ''; });
    throw new Error('upstash ' + res.status + ' ' + detail.slice(0, 200));
  }
  var data = await res.json();
  return { configured: true, results: (data || []).map(function (r) { return r && r.result; }) };
}

// ---------------------------------------------------------------- sanitising
// Reviews are rendered as TEXT on the client (never innerHTML), but they are
// also sent to the SSR renderer for JSON-LD, so strip anything markup-ish here
// too rather than relying on one layer.
function scrub(s, max) {
  return String(s == null ? '' : s)
    .replace(new RegExp('[\u0000-\u001F\u007F]', 'g'), '')   // control characters
    .replace(/[<>]/g, '')                                           // no tag chars
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function parseRating(v) {
  var n = typeof v === 'number' ? v : parseInt(v, 10);
  if (!(n >= 1 && n <= 5)) return null;
  return Math.round(n);
}

function clientKey(req) {
  var fwd = req.headers['x-forwarded-for'] || '';
  var ip = String(fwd).split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown';
  // Not for identification — only to bucket rate limits. Hashed so raw IPs are
  // never written to storage.
  var h = 0;
  var s = String(ip) + '|' + String(req.headers['user-agent'] || '').slice(0, 60);
  for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36);
}

function makeId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// ------------------------------------------------------------------- photos
// Vercel Blob auth comes in two shapes, and which one you get depends on how
// the store was provisioned:
//
//   1. BLOB_READ_WRITE_TOKEN — a long-lived token, injected by the classic
//      "connect store to project" flow. It encodes the store id itself.
//   2. OIDC — newer provisioning injects only BLOB_STORE_ID, and Vercel hands
//      each individual REQUEST a short-lived OIDC token in the
//      `x-vercel-oidc-token` header. The store id is NOT encoded in that
//      token, so it has to travel separately in `x-vercel-blob-store-id`.
//
// This store is provisioned the second way, so the token cannot be read from
// process.env at all — it only exists per-request. Both are supported below so
// that adding a BLOB_READ_WRITE_TOKEN later also just works.
//
// No SDK: this repo has no package.json (see the header comment), so the wire
// format is written out by hand. It matches @vercel/blob 2.8.0 exactly —
// PUT https://vercel.com/api/blob/?pathname=... with x-api-version 12.
var BLOB_API = 'https://vercel.com/api/blob';
var BLOB_API_VERSION = '12';

// Returns null when Blob is unavailable, which is what keeps the photo field
// hidden instead of erroring. Needs `req` because of the per-request OIDC case.
function blobAuth(req) {
  var storeId = resolveEnv(['BLOB_STORE_ID']);
  var rw = resolveEnv(['BLOB_READ_WRITE_TOKEN']);
  if (rw) return { token: rw, storeId: storeId };
  var oidc = req && req.headers && req.headers['x-vercel-oidc-token'];
  if (oidc && storeId) return { token: cleanValue(oidc), storeId: storeId };
  return null;
}

// Returns a public URL, or null when Blob is not configured / the payload is
// not an acceptable image. Never throws — a photo problem must not cost the
// customer their review.
async function uploadPhoto(dataUrl, productId, req) {
  var auth = blobAuth(req);
  if (!auth || !dataUrl) return null;
  var m = /^data:([a-z/+.-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(String(dataUrl));
  if (!m) return null;
  var mime = m[1].toLowerCase();
  var ext = ALLOWED_PHOTO[mime];
  if (!ext) return null;
  var bytes = Buffer.from(m[2], 'base64');
  if (!bytes.length || bytes.length > MAX_PHOTO_BYTES) return null;

  var pathname = 'reviews/' + productId + '/' + makeId() + '.' + ext;
  var headers = {
    authorization: 'Bearer ' + auth.token,
    'x-api-version': BLOB_API_VERSION,
    'x-vercel-blob-access': 'public',
    'x-content-type': mime,
    'x-add-random-suffix': '1'
  };
  if (auth.storeId) headers['x-vercel-blob-store-id'] = auth.storeId;

  var res = await fetch(BLOB_API + '/?' + new URLSearchParams({ pathname: pathname }).toString(), {
    method: 'PUT',
    headers: headers,
    body: bytes
  });
  if (!res.ok) {
    console.error('[reviews] blob upload failed', res.status, (await res.text().catch(function () { return ''; })).slice(0, 200));
    return null;
  }
  var out = await res.json().catch(function () { return null; });
  return (out && out.url) || null;
}

// -------------------------------------------------------------------- reads
async function readProduct(productId) {
  var r = await redis([
    ['LRANGE', 'pawhaul:rev:' + productId, '0', '-1'],
    ['HGETALL', 'pawhaul:agg:' + productId]
  ]);
  if (!r.configured) return { configured: false, reviews: [], count: 0, average: 0 };
  var raw = r.results[0] || [];
  var reviews = [];
  for (var i = 0; i < raw.length; i++) {
    try { reviews.push(JSON.parse(raw[i])); } catch (e) { /* skip a corrupt row */ }
  }
  var agg = hashToObj(r.results[1]);
  var n = parseInt(agg.n, 10) || 0;
  var sum = parseInt(agg.sum, 10) || 0;
  return {
    configured: true,
    reviews: reviews,
    count: n,
    average: n ? Math.round((sum / n) * 10) / 10 : 0
  };
}

// Upstash returns a hash as a flat [field, value, ...] array.
function hashToObj(v) {
  var o = {};
  if (Array.isArray(v)) {
    for (var i = 0; i < v.length - 1; i += 2) o[v[i]] = v[i + 1];
  } else if (v && typeof v === 'object') {
    o = v;
  }
  return o;
}

async function readStats(ids) {
  var cmds = ids.map(function (id) { return ['HGETALL', 'pawhaul:agg:' + id]; });
  var r = await redis(cmds);
  var stats = {};
  if (!r.configured) return { configured: false, stats: stats };
  ids.forEach(function (id, i) {
    var agg = hashToObj(r.results[i]);
    var n = parseInt(agg.n, 10) || 0;
    var sum = parseInt(agg.sum, 10) || 0;
    if (n > 0) stats[id] = { count: n, average: Math.round((sum / n) * 10) / 10 };
  });
  return { configured: true, stats: stats };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  var cfg = redisConfig();
  var configured = !!(cfg.url && cfg.token);

  try {
    if (req.method === 'GET') {
      // /api/reviews with no params reports configuration state so
      // the client can hide the form instead of failing on submit.
      if (req.query && req.query.stats) {
        var ids = String(req.query.stats).split(',')
          .map(function (x) { return parseInt(x, 10); })
          .filter(function (x) { return x > 0; })
          .slice(0, 50);
        if (!ids.length) { res.status(400).json({ ok: false, error: 'No product ids.' }); return; }
        var s = await readStats(ids);
        res.status(200).json({ ok: true, configured: s.configured, stats: s.stats });
        return;
      }
      var pid = parseInt((req.query && req.query.product) || '', 10);
      if (!(pid > 0)) {
        res.status(200).json({ ok: true, configured: configured, photos: !!blobAuth(req) });
        return;
      }
      var data = await readProduct(pid);
      res.status(200).json({
        ok: true, configured: data.configured, productId: pid,
        count: data.count, average: data.average, reviews: data.reviews,
        photos: !!blobAuth(req)
      });
      return;
    }

    if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }

    if (!configured) {
      res.status(503).json({ ok: false, error: 'Reviews are not set up on this store yet.' });
      return;
    }

    var body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};

    var productId = parseInt(body.productId, 10);
    if (!(productId > 0)) { res.status(400).json({ ok: false, error: 'Missing product.' }); return; }
    // If the catalogue can't be read for any reason we deliberately do NOT
    // block submissions — a parsing hiccup should not take reviews offline.
    var known = await validProductIds('https://' + (req.headers['x-forwarded-host'] || req.headers.host || ''));
    if (known && !known[productId]) {
      res.status(400).json({ ok: false, error: 'Unknown product.' });
      return;
    }

    // The ONE hard requirement, per spec: a star rating. Text stays optional.
    var rating = parseRating(body.rating);
    if (rating === null) { res.status(400).json({ ok: false, error: 'Please pick a star rating.' }); return; }

    var name = scrub(body.name, MAX_NAME) || 'Anonymous';
    var text = scrub(body.text, MAX_TEXT);

    // --- rate limiting -------------------------------------------------
    // Two buckets, both deliberately simple: one review per product per day,
    // and a short global cool-down so one device cannot spray every product
    // back to back. SET NX EX is atomic, so no read-then-write race.
    var who = clientKey(req);
    var perProductKey = 'pawhaul:rl:' + who + ':p' + productId;
    var burstKey = 'pawhaul:rl:' + who + ':burst';
    var gate = await redis([
      ['SET', perProductKey, '1', 'NX', 'EX', '86400'],
      ['SET', burstKey, '1', 'NX', 'EX', '45']
    ]);
    if (!gate.results[0]) {
      res.status(429).json({ ok: false, error: "You've already reviewed this product. Thanks!" });
      return;
    }
    if (!gate.results[1]) {
      // Roll back the per-product hold so a blocked burst does not consume
      // their one allowed review for the day.
      await redis([['DEL', perProductKey]]);
      res.status(429).json({ ok: false, error: 'Please wait a moment before posting another review.' });
      return;
    }

    var photoUrl = null;
    try { photoUrl = await uploadPhoto(body.photo, productId, req); }
    catch (e) { console.error('[reviews] photo error', e && e.message); }

    var review = {
      id: makeId(),
      productId: productId,
      rating: rating,
      name: name,
      text: text,
      photo: photoUrl,
      createdAt: new Date().toISOString()
    };

    var w = await redis([
      ['LPUSH', 'pawhaul:rev:' + productId, JSON.stringify(review)],
      ['LTRIM', 'pawhaul:rev:' + productId, '0', String(MAX_LIST - 1)],
      ['HINCRBY', 'pawhaul:agg:' + productId, 'n', '1'],
      ['HINCRBY', 'pawhaul:agg:' + productId, 'sum', String(rating)]
    ]);
    var n = parseInt(w.results[2], 10) || 1;
    var sum = parseInt(w.results[3], 10) || rating;

    res.status(200).json({
      ok: true, review: review,
      count: n, average: Math.round((sum / n) * 10) / 10
    });
  } catch (e) {
    console.error('[reviews] failed', e && e.message);
    res.status(502).json({ ok: false, error: 'Could not save your review — please try again.' });
  }
};
