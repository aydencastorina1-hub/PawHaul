'use strict';
// Catch-all HTML renderer. vercel.json routes every non-API, non-file path
// here (previously straight to /index.html) so that each URL can be served
// with its own <title>, meta description, canonical, Open Graph tags and
// JSON-LD. See api/_seo.js for the reasoning and the route table.
//
// The original path arrives as ?path=... because a Vercel rewrite to an API
// route does not reliably preserve the source path on req.url.
//
// ---------------------------------------------------------------------------
// WHY vercel.json USES THE LEGACY `routes` ARRAY INSTEAD OF `rewrites`
// (Vercel's config schema rejects comments, so the explanation lives here.)
//
// `rewrites` are only consulted AFTER Vercel's filesystem check, and Vercel
// maps `/` to a root index.html automatically. With `rewrites`, the HOME PAGE
// — the most-shared URL on the site — was therefore served as the raw static
// shell and skipped this renderer entirely: no meta description, no Open Graph
// tags, no JSON-LD, just the generic fallback <title>. Every other route
// worked correctly, which is exactly what made it easy to miss. It was caught
// only because the ETag on `/` was MD5-length (Vercel's own static ETag) while
// every other route returned the SHA-1 this function sets.
//
// `routes` entries placed BEFORE the { "handle": "filesystem" } marker run
// ahead of static file resolution, which is the only way to intercept `/`
// while keeping index.html at its normal path. The two config styles are
// mutually exclusive, so the no-store cache headers had to move into a
// `"continue": true` route in the same array.
//
// If that config is ever "modernised" back to `rewrites`, re-check the home
// page specifically — the rest of the site will look fine.
// ---------------------------------------------------------------------------

const seo = require('./_seo');

module.exports = async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || seo.PROD_HOST;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = proto + '://' + host;

  let pathname = '/';
  try {
    const u = new URL(req.url || '/', baseUrl);
    pathname = u.searchParams.get('path') || u.pathname || '/';
  } catch (e) { /* keep default */ }
  if (pathname.charAt(0) !== '/') pathname = '/' + pathname;
  // A request that somehow lands here addressed as the function itself is a
  // home-page request, not a page called "render".
  if (pathname === '/api/render') pathname = '/';

  let body;
  try {
    body = await seo.renderPage(pathname, baseUrl, host);
  } catch (e) {
    body = null;
  }

  if (!body) {
    // Degrade to the unmodified SPA shell rather than erroring: a page with
    // generic meta still works for every human visitor.
    body = await seo.readRootFile('index.html', baseUrl);
  }
  if (!body) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Unable to load page.');
    return;
  }

  // An unknown path still renders the SPA (which falls back to Home) but must
  // answer 404 so search engines do not index an unlimited supply of
  // soft-duplicate home pages.
  const route = seo.parseRoute(pathname);
  res.statusCode = route.type === 'unknown' ? 404 : 200;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // vercel.json already sends no-store on every route; restated here because
  // this response is generated per request and must never be held anywhere.
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // app.js detects a new deploy by comparing the ETag of "/" between page
  // loads (see the NEW-BUILD DETECTION block there). Static index.html used to
  // get an ETag from Vercel automatically; a function response does not, so
  // it has to be set explicitly or stale-tab reloading silently stops working.
  // Hashing the rendered body keeps the guarantee that matters: the value
  // changes whenever the deployed HTML changes and is stable while it does not.
  res.setHeader('ETag', '"' + seo.sha1(body) + '"');

  if ((req.method || 'GET').toUpperCase() === 'HEAD') { res.end(); return; }
  res.end(body);
};
