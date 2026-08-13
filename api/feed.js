'use strict';
// Google Merchant Center product feed (RSS 2.0 + the g: namespace), served at
// /feed.xml — see the rewrite in vercel.json.
//
// THIS IS THE FREE LISTINGS PATH, NOT A PAID CAMPAIGN. Uploading a feed to
// Merchant Center and opting into "free listings" surfaces products in the
// organic Google Shopping tab and in free product results on Search, at no
// cost and with no card on file. Shopping ADS are a separate opt-in that
// requires a linked Google Ads account and a budget; nothing here creates one.
// See MARKETING-SETUP.md for the click-by-click account steps.
//
// Also consumable by Bing's Microsoft Merchant Center and by Pinterest's
// catalogue ingestion, both of which accept the same RSS/g: format.

const seo = require('./_seo');

// Google's product taxonomy, mapped from the site's own three categories plus
// per-product overrides where the category is too coarse (a waste-bag holder
// is not a leash, even though the site files it under "leash").
const CATEGORY_BY_PRODUCT = {
  1: 'Animals & Pet Supplies > Pet Supplies > Pet Bowls, Feeders & Waterers',
  2: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Leashes',
  3: 'Animals & Pet Supplies > Pet Supplies > Pet Bowls, Feeders & Waterers',
  4: 'Animals & Pet Supplies > Pet Supplies > Pet ID Tags',
  5: 'Animals & Pet Supplies > Pet Supplies > Pet Waste Bag Dispensers & Holders',
  6: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Collars',
  8: 'Animals & Pet Supplies > Pet Supplies > Pet Waste Bag Dispensers & Holders'
};
const FALLBACK_CATEGORY = 'Animals & Pet Supplies > Pet Supplies > Dog Supplies';

const PRODUCT_TYPE = {
  water: 'Dog Walk Gear > Water & Food',
  leash: 'Dog Walk Gear > Leashes & Accessories',
  safety: 'Dog Walk Gear > Safety'
};

function cdata(s) {
  // Feed values are wrapped in CDATA, so the only sequence that can break out
  // is the terminator itself.
  return '<![CDATA[' + String(s == null ? '' : s).replace(/\]\]>/g, ']]&gt;') + ']]>';
}

function stripTags(s) {
  return String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

module.exports = async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || seo.PROD_HOST;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const products = await seo.getProducts(proto + '://' + host);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n' +
    '<channel>\n' +
    '  <title>' + cdata(seo.BRAND + ' Product Feed') + '</title>\n' +
    '  <link>' + seo.ORIGIN + '</link>\n' +
    '  <description>' + cdata('Dog walk gear from PawHaul — leashes, water bottles, travel bowls, LED safety collars and waste bag carriers.') + '</description>\n';

  products.forEach(function (p) {
    const url = seo.ORIGIN + '/product/' + seo.slugify(p.name);
    const copy = seo.PRODUCT_COPY[p.id] || {};
    const range = seo.priceRange(p);

    // One item per PRODUCT, priced at the lowest variant — which is exactly
    // what the landing page shows (the site-wide lowest-price rule). Feed
    // price and landing-page price must agree or Merchant Center disapproves
    // the item, so these two rules have to stay tied together.
    //
    // Deliberately NOT emitting g:sale_price. Mapping price=was /
    // sale_price=now would show a strikethrough in free listings, and that is
    // only defensible if `was` was genuinely charged previously. Submitting
    // the real selling price alone is always accurate and cannot be
    // disapproved for a price mismatch.
    const price = seo.money(range.low);

    const images = [].concat(Object.values(p.images || {}), p.extraImages || [])
      .filter(Boolean)
      .map(function (u) {
        return u.indexOf('cdn.shopify.com') !== -1 ? u.replace(/([?&])width=\d+/, '$1width=1200') : seo.absolute(u);
      });

    xml += '  <item>\n';
    xml += '    <g:id>PH-' + p.id + '</g:id>\n';
    xml += '    <g:title>' + cdata(copy.title || p.name) + '</g:title>\n';
    xml += '    <g:description>' + cdata(stripTags(p.desc || p.tagline)) + '</g:description>\n';
    xml += '    <g:link>' + seo.esc(url) + '</g:link>\n';
    if (images[0]) xml += '    <g:image_link>' + seo.esc(images[0]) + '</g:image_link>\n';
    // Google accepts up to 10 additional images.
    images.slice(1, 11).forEach(function (u) {
      xml += '    <g:additional_image_link>' + seo.esc(u) + '</g:additional_image_link>\n';
    });
    xml += '    <g:availability>in_stock</g:availability>\n';
    xml += '    <g:price>' + price + ' USD</g:price>\n';
    xml += '    <g:brand>' + cdata(seo.BRAND) + '</g:brand>\n';
    xml += '    <g:condition>new</g:condition>\n';
    // These are generically-manufactured goods with no GTIN and no real
    // manufacturer part number. Declaring that explicitly is required —
    // inventing an MPN to fill the field is what gets items disapproved.
    xml += '    <g:identifier_exists>no</g:identifier_exists>\n';
    xml += '    <g:google_product_category>' + cdata(CATEGORY_BY_PRODUCT[p.id] || FALLBACK_CATEGORY) + '</g:google_product_category>\n';
    xml += '    <g:product_type>' + cdata(PRODUCT_TYPE[p.category] || 'Dog Walk Gear') + '</g:product_type>\n';
    xml += '    <g:shipping>\n' +
           '      <g:country>US</g:country>\n' +
           '      <g:service>Standard</g:service>\n' +
           '      <g:price>0.00 USD</g:price>\n' +
           '    </g:shipping>\n';
    xml += '    <g:shipping_label>free-shipping</g:shipping_label>\n';
    xml += '  </item>\n';
  });

  xml += '</channel>\n</rss>\n';

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Keep the feed out of the search index without hiding it from the crawlers
  // that need it. robots.txt is the wrong lever here: Merchant Center's
  // scheduled fetch honours robots.txt, so a Disallow would stop the feed
  // refreshing, and a Disallow does not reliably deindex a URL anyway.
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(xml);
};
