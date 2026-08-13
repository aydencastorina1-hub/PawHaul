'use strict';
// XML sitemap, served at /sitemap.xml (see the rewrite in vercel.json).
//
// Generated per request from products.js and blog.js rather than committed as
// a static file, so adding a product or a post publishes a correct sitemap
// with no extra step and no chance of it going stale — which is the usual
// reason sitemaps stop being useful.

const seo = require('./_seo');

// Utility pages (/cart, /wishlist) are intentionally absent: they are
// per-visitor state with no indexable content and are marked noindex.
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/shop', changefreq: 'weekly', priority: '0.9' },
  { path: '/shop/water', changefreq: 'weekly', priority: '0.8' },
  { path: '/shop/leash', changefreq: 'weekly', priority: '0.8' },
  { path: '/shop/safety', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' }
];

function urlEntry(loc, lastmod, changefreq, priority, extra) {
  return '  <url>\n' +
    '    <loc>' + seo.esc(loc) + '</loc>\n' +
    (lastmod ? '    <lastmod>' + lastmod + '</lastmod>\n' : '') +
    '    <changefreq>' + changefreq + '</changefreq>\n' +
    '    <priority>' + priority + '</priority>\n' +
    (extra || '') +
    '  </url>\n';
}

module.exports = async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || seo.PROD_HOST;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = proto + '://' + host;

  const products = await seo.getProducts(baseUrl);
  const posts = await seo.getPosts(baseUrl);
  const today = new Date().toISOString().slice(0, 10);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  STATIC_PAGES.forEach(function (p) {
    xml += urlEntry(seo.ORIGIN + p.path, today, p.changefreq, p.priority);
  });

  // Product URLs carry an <image:image> so Google Images can associate the
  // photo with the product page directly.
  products.forEach(function (p) {
    const loc = seo.ORIGIN + '/product/' + seo.slugify(p.name);
    const img = seo.ogImageFor(p);
    const extra = '    <image:image>\n' +
      '      <image:loc>' + seo.esc(img) + '</image:loc>\n' +
      '      <image:title>' + seo.esc(p.name) + '</image:title>\n' +
      '    </image:image>\n';
    xml += urlEntry(loc, today, 'weekly', '0.9', extra);
  });

  posts.forEach(function (b) {
    const loc = seo.ORIGIN + '/blog/' + b.slug;
    const extra = '    <image:image>\n' +
      '      <image:loc>' + seo.esc(seo.absolute(b.image)) + '</image:loc>\n' +
      '      <image:title>' + seo.esc(b.title) + '</image:title>\n' +
      '    </image:image>\n';
    xml += urlEntry(loc, b.updated || b.date, 'monthly', '0.6', extra);
  });

  xml += '</urlset>\n';

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.end(xml);
};
