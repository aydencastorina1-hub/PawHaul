'use strict';
// ==================== SERVER-SIDE SEO / META RENDERER ====================
//
// WHY THIS EXISTS
// PawHaul is a script-only SPA: every URL (/shop, /product/<slug>, /blog/...)
// is served the same index.html and the page is chosen client-side. That is
// fine for humans and mostly fine for Googlebot (which renders JS), but it is
// useless for everything else that matters commercially:
//
//   * Facebook / iMessage / WhatsApp / Pinterest / LinkedIn link previews run
//     NO JavaScript at all. They read the HTML bytes as served. Without this,
//     every shared link — a product, a blog post, the home page — previews
//     with one identical title and no image.
//   * Bing/DuckDuckGo render JS inconsistently, so a JS-set <title> is a
//     coin flip.
//   * Product rich results (price, availability) need JSON-LD that is
//     reliably present.
//
// So: api/render.js serves index.html with a per-route <head> injected. There
// is no build step and no framework — this module reads the SAME index.html,
// products.js and blog.js the browser gets, so there is exactly one source of
// truth and nothing to regenerate when a product or post changes.
//
// KEEP IN SYNC: parseRoute() below mirrors the one in index.html's <head>.
// If a new route is added to one, add it to the other or the URL will render
// with home-page meta.
//
// Files prefixed with "_" inside api/ are NOT deployed as routes by Vercel,
// they are just a module for the real handlers.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------- constants

// Canonical origin. Deliberately hard-coded rather than taken from the
// request Host header: preview deployments must not emit canonicals/OG URLs
// pointing at themselves (that is how a preview build ends up competing with
// production in the index). isProductionHost() below noindexes them instead.
const ORIGIN = 'https://pawhaul.vercel.app';
const PROD_HOST = 'pawhaul.vercel.app';
const BRAND = 'PawHaul';
const SUPPORT_EMAIL = 'pawhaulsupport@gmail.com';
const DEFAULT_OG = ORIGIN + '/images/og/pawhaul-og.jpg';
const TWITTER_CARD = 'summary_large_image';

// ============ SITE VERIFICATION — PASTE YOUR CODES HERE ============
// Each of these services proves you own the domain before it will show you
// data. All three accept a meta tag; paste ONLY the value from the tag's
// content="..." attribute, not the whole tag. Empty strings emit nothing.
//
//   google    Search Console -> Add property -> URL prefix -> HTML tag
//             (Search Console also accepts a googleXXXX.html file dropped in
//             the repo root — that works too, because any path with a dot
//             bypasses the SPA rewrite and is served as a real static file.)
//   bing      Bing Webmaster Tools -> Add site -> HTML Meta Tag
//             (Or skip it entirely: Bing can import a verified Search Console
//             property in one click, which is the faster route.)
//   pinterest Pinterest Business -> Settings -> Claimed accounts -> Claim
//             website -> Add HTML tag. Claiming is what enables Pins that
//             link here to be attributed to the account and show the profile.
//
// Because these are rendered into every page's <head> by buildHead() below,
// verification works on every URL, not just the home page.
const SITE_VERIFICATION = {
  google: '',
  bing: '',
  pinterest: ''
};

// Real, verifiable claims taken from the site's own policy copy (app.js
// POLICIES): free shipping on all orders, 1-3 business days processing,
// 7-14 business days delivery, 30-day returns for a full refund.
// NOTE: returnFees is deliberately OMITTED — the published refund policy does
// not say who pays return postage, and asserting FreeReturn without a policy
// to back it is exactly the kind of unsupported markup that earns a manual
// action. Fill it in only when the policy actually states it.
const SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 7, maxValue: 14, unitCode: 'DAY' }
  }
};
const RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'US',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail'
};

// AGGREGATE RATING IS INTENTIONALLY ABSENT (task 103).
//
// Google Search Essentials prohibits marking up review data you did not
// genuinely collect from your own customers, and the penalty for self-serving
// ratings is a structured-data manual action that strips rich results from the
// WHOLE site — strictly worse than shipping no stars at all.
//
// Task 56 added a real user-submitted review system, which made a per-product
// exemption legitimate: a product got aggregateRating if and only if it had at
// least one genuine submitted review. Task 103 REMOVED that system, so the
// exemption is gone with it and this is a hard rule again.
//
// The supplier ratings now shown on the site (products.js `supplier`, read off
// the AliExpress listings PawHaul sources from) must NOT be substituted here.
// They are a third party's ratings of the manufacturer's listing, not reviews
// of this store's product, service or fulfilment — marking them up as this
// product's aggregateRating is exactly the misrepresentation the rule targets.
// They are surfaced to shoppers in plain sight, attributed, and nowhere else.
//
// If a real PawHaul review system ever exists, reinstate the per-product rule
// from task 56 — not a global switch.


// ------------------------------------------------------------ file loading

// Serverless instances are reused between requests, so parse once per cold
// start and keep it in module memory.
const _fileCache = Object.create(null);

async function readRootFile(name, baseUrl) {
  if (name in _fileCache) return _fileCache[name];
  // Normal path: the file is in the function bundle (see the includeFiles
  // entry in vercel.json).
  const candidates = [
    path.join(process.cwd(), name),
    path.join(__dirname, '..', name)
  ];
  for (const c of candidates) {
    try {
      const text = fs.readFileSync(c, 'utf8');
      _fileCache[name] = text;
      return text;
    } catch (e) { /* try next */ }
  }
  // Fallback: fetch it off our own CDN. Every file this module needs has a
  // dot in its name, so it is excluded from the SPA catch-all rewrite in
  // vercel.json and resolves to the real static asset (no recursion).
  if (baseUrl) {
    try {
      const res = await fetch(baseUrl + '/' + name, { headers: { 'user-agent': 'pawhaul-ssr' } });
      if (res.ok) {
        const text = await res.text();
        _fileCache[name] = text;
        return text;
      }
    } catch (e) { /* fall through */ }
  }
  _fileCache[name] = null;
  return null;
}

// Pulls `var <name> = [ ... ];` out of a browser script and evaluates just
// that array literal, so products.js / blog.js stay plain browser files with
// no module system and no duplicate copy of the data on the server.
//
// The scanner skips // and /* */ comments. That is not optional: the data in
// products.js is interleaved with prose comments containing apostrophes
// (e.g. "Shopify's data model") and blog.js's header contains backticks —
// a naive quote scanner mistakes those for string delimiters and miscounts
// bracket depth. The declaration is matched line-anchored for the same
// reason: a comment that merely mentions the declaration must not match.
function extractArrayLiteral(src, varName) {
  if (!src) return null;
  src = src.replace(/^﻿/, '');
  const decl = new RegExp('^[ \\t]*var[ \\t]+' + varName + '[ \\t]*=[ \\t]*\\[', 'm');
  const m = decl.exec(src);
  if (!m) return null;
  const open = src.indexOf('[', m.index);
  const BS = '\\';
  let depth = 0, str = null, esc = false;
  for (let i = open; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (str) {
      if (esc) { esc = false; continue; }
      if (c === BS) { esc = true; continue; }
      if (c === str) str = null;
      continue;
    }
    if (c === '/' && n === '/') { const e = src.indexOf('\n', i); i = (e === -1 ? src.length : e); continue; }
    if (c === '/' && n === '*') { const e = src.indexOf('*/', i + 2); i = (e === -1 ? src.length : e + 1); continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  return null;
}

async function getProducts(baseUrl) {
  const src = await readRootFile('products.js', baseUrl);
  const lit = extractArrayLiteral(src, 'products');
  if (!lit) return [];
  try { return new Function('return ' + lit)() || []; } catch (e) { return []; }
}

async function getPosts(baseUrl) {
  const src = await readRootFile('blog.js', baseUrl);
  const lit = extractArrayLiteral(src, 'blogPosts');
  if (!lit) return [];
  try { return new Function('return ' + lit)() || []; } catch (e) { return []; }
}

// ---------------------------------------------------------------- routing

// MIRROR of parseRoute() in index.html <head>, plus the blog routes.
function parseRoute(pathname) {
  const p = String(pathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (p === '/') return { type: 'page', page: 'home' };
  if (p === '/shop') return { type: 'page', page: 'shop' };
  let m;
  if (p === '/contact') return { type: 'page', page: 'contact' };
  if (p === '/about') return { type: 'page', page: 'about' };
  if (p === '/wishlist') return { type: 'page', page: 'wishlist' };
  if (p === '/cart') return { type: 'page', page: 'cart' };
  if (p === '/bundles') return { type: 'page', page: 'bundles' };
  if (p === '/blog') return { type: 'page', page: 'blog' };
  m = p.match(/^\/blog\/([a-z0-9-]+)$/);
  if (m) return { type: 'post', slug: m[1] };
  m = p.match(/^\/product\/([a-z0-9-]+)$/);
  if (m) return { type: 'product', slug: m[1] };
  return { type: 'unknown' };
}

// MIRROR of slugify() in products.js. Product URLs are derived from names, so
// this must not drift or every product URL breaks at once.
// MIRRORS products.js. See the note there: old product URLs have to keep
// resolving after a rename.
const RENAMED_SLUGS = {
  'light-up-dog-collar': 6   // -> "LED Dog Collar" (task 95)
};

function slugify(name) {
  return String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// --------------------------------------------------------------- utilities

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// JSON-LD goes inside a <script> element, where the HTML parser looks for the
// literal characters "</script" and nothing else. Escaping "<" covers it.
function jsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function absolute(url) {
  if (!url) return DEFAULT_OG;
  if (/^https?:\/\//i.test(url)) return url;
  return ORIGIN + (url.charAt(0) === '/' ? '' : '/') + url;
}

// Social scrapers want a big image. Shopify's CDN resizes via ?width= and
// content-negotiates the format, so it serves JPEG to crawlers that do not
// advertise webp support (verified) — no separate OG asset needed per product.
function ogImageFor(product) {
  const pool = [].concat(Object.values(product.images || {}), product.extraImages || []);
  const shopify = pool.find(function (u) { return typeof u === 'string' && u.indexOf('cdn.shopify.com') !== -1; });
  if (shopify) return shopify.replace(/([?&])width=\d+/, '$1width=1200');
  return pool.length ? absolute(pool[0]) : DEFAULT_OG;
}

function priceRange(p) {
  if (p.sizePrices) {
    const vals = Object.keys(p.sizePrices).map(function (k) { return p.sizePrices[k].price; });
    if (vals.length) return { low: Math.min.apply(null, vals), high: Math.max.apply(null, vals), multi: vals.length > 1 };
  }
  return { low: p.price, high: p.price, multi: false };
}

function money(n) { return Number(n).toFixed(2); }

// ------------------------------------------------------- hand-written copy
//
// Unique, keyword-relevant titles and descriptions per product. Hand-written
// on purpose: auto-generating from the product name produces the duplicate,
// thin meta that the whole exercise is meant to avoid.
//
// A product with no entry here still renders valid (if generic) meta via the
// fallback in productMeta() — nothing breaks — but ANY NEW PRODUCT SHOULD GET
// AN ENTRY ADDED HERE.
const PRODUCT_COPY = {
  1: {
    title: '2-in-1 Dog Water Bottle — Leak-Proof Water & Food Bottle',
    description: 'Portable 2-in-1 dog water bottle with a flip-out drinking spout and a sealed dry food compartment. 350ml and 550ml, BPA-free. From $16.99 with free shipping.'
  },
  3: {
    title: 'Collapsible Dog Bowl — Portable Silicone Travel Bowl',
    description: 'Food-grade silicone dog bowl that folds flat and pops open in seconds. Built-in carabiner clips to a leash or belt loop. $11.99 with free shipping.'
  },
  10: {
    title: 'LED Flashlight Retractable Dog Leash — Light Up Night Lead',
    description: 'Retractable dog leash with a built-in LED light ring and a flashlight for the path ahead. 3M and 5M lengths. From $22.99, free shipping. Needs 2 AAA batteries.'
  },
  9: {
    title: 'Anti-Drop Dog Leash Wrist Strap — Adjustable Safety Loop',
    description: 'Adjustable wrist strap that clips to any dog leash so a slipped grip never means a loose dog. Six colours, fits retractable and standard leads. $8.99, free shipping.'
  },
  6: {
    title: 'LED Dog Collar — USB Rechargeable Night Collar',
    description: 'USB rechargeable LED dog collar with three light modes for night walks. Complete collar with a reflective stripe, four neck sizes from 13 to 22 inches. From $14.99, free shipping.'
  }
};

const PAGE_COPY = {
  home: {
    title: 'PawHaul — Dog Walk Gear: Leashes, Water Bottles & LED Collars',
    description: 'Everything for a better dog walk: leak-proof water bottles, collapsible bowls, LED safety collars, a light-up retractable leash and anti-drop wrist straps. Free shipping, 30-day returns.',
    path: '/'
  },
  shop: {
    title: 'Shop All Dog Walk Gear — Water Bottles, Bowls, LED Collars & Leashes',
    description: 'Browse all five PawHaul walk essentials: the 2-in-1 water bottle, collapsible bowl, LED dog collar, LED flashlight retractable leash and anti-drop wrist strap. Free shipping.',
    path: '/shop'
  },
  about: {
    title: 'Our Story — Why We Built PawHaul',
    description: 'PawHaul exists because dog walk gear should just work. Read why we started, how we choose what we sell, and what we will not put our name on.',
    path: '/about'
  },
  contact: {
    title: 'Contact PawHaul — Customer Support',
    description: 'Questions about an order, a return or a product? Email ' + SUPPORT_EMAIL + ' or use the contact form. We reply within 24 hours.',
    path: '/contact'
  },
  bundles: {
    title: 'Dog Walk Gear Bundles — 20% Off',
    description: 'PawHaul bundles: the LED collar with the LED flashlight leash, the 2-in-1 water bottle with the collapsible bowl, or the LED flashlight leash with the anti-drop wrist strap. 20% off each bundle, applied automatically at checkout.',
    path: '/bundles'
  },
  blog: {
    title: 'The PawHaul Blog — Dog Walking Guides & Gear Advice',
    description: 'Practical guides for dog owners: stopping leash pulling, staying visible on night walks, what to pack, and how much water your dog actually needs.',
    path: '/blog'
  },
  // Utility pages: real, reachable, and deliberately kept out of the index.
  // They are per-visitor state, have no standalone content, and would only
  // dilute crawl budget.
  cart: { title: 'Your Cart', description: 'Review the items in your PawHaul cart.', path: '/cart', noindex: true },
  wishlist: { title: 'Your Wishlist', description: 'Products you have saved at PawHaul.', path: '/wishlist', noindex: true }
};

// ------------------------------------------------------------ schema.org

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORIGIN + '/#organization',
    name: BRAND,
    url: ORIGIN,
    logo: ORIGIN + '/favicon-192.png',
    email: SUPPORT_EMAIL,
    description: 'PawHaul sells dog walk gear — 2-in-1 water bottles, collapsible bowls, LED safety collars, a light-up retractable leash and anti-drop wrist straps.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SUPPORT_EMAIL,
      availableLanguage: 'English'
    }
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ORIGIN + '/#website',
    name: BRAND,
    url: ORIGIN,
    publisher: { '@id': ORIGIN + '/#organization' }
  };
}

function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(function (t, i) {
      return { '@type': 'ListItem', position: i + 1, name: t.name, item: ORIGIN + t.path };
    })
  };
}

function productSchema(p) {
  const url = ORIGIN + '/product/' + slugify(p.name);
  const range = priceRange(p);
  const images = [].concat(Object.values(p.images || {}), p.extraImages || [])
    .filter(Boolean)
    .map(function (u) { return u.indexOf('cdn.shopify.com') !== -1 ? u.replace(/([?&])width=\d+/, '$1width=1200') : absolute(u); })
    .slice(0, 8);

  const offerBase = {
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    url: url,
    seller: { '@id': ORIGIN + '/#organization' },
    shippingDetails: SHIPPING_DETAILS,
    hasMerchantReturnPolicy: RETURN_POLICY
  };

  const offers = range.multi
    ? Object.assign({ '@type': 'AggregateOffer', lowPrice: money(range.low), highPrice: money(range.high), offerCount: Object.keys(p.sizePrices).length }, offerBase)
    : Object.assign({ '@type': 'Offer', price: money(range.low) }, offerBase);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url + '#product',
    name: p.name,
    description: p.desc || p.tagline || '',
    image: images.length ? images : [DEFAULT_OG],
    sku: 'PH-' + p.id,
    brand: { '@type': 'Brand', name: BRAND },
    url: url,
    offers: offers
  };

  if (p.material) schema.material = p.material;
  if (p.colors && p.colors.length) schema.color = p.colors.join(', ');

  // NO aggregateRating — see the note at the top of this file. The supplier
  // ratings shown on the site are a third party's, and marking them up as this
  // product's own is the misrepresentation Google penalises site-wide.
  return schema;
}

function articleSchema(post) {
  const url = ORIGIN + '/blog/' + post.slug;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url + '#article',
    headline: post.title,
    description: post.metaDescription || post.excerpt || '',
    image: [absolute(post.image)],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Organization', name: BRAND, url: ORIGIN },
    publisher: { '@id': ORIGIN + '/#organization' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url: url
  };
}

function itemListSchema(products, listPath, listName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: ORIGIN + listPath,
    numberOfItems: products.length,
    itemListElement: products.map(function (p, i) {
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: ORIGIN + '/product/' + slugify(p.name),
        name: p.name
      };
    })
  };
}

// --------------------------------------------------------- meta assembly

function titleWithBrand(t) {
  // The home title already carries the brand; everything else gets the
  // " | PawHaul" suffix so a SERP listing is attributable at a glance.
  return t.indexOf(BRAND) === 0 || t.indexOf('| ' + BRAND) !== -1 ? t : t + ' | ' + BRAND;
}

// ASYNC. Task 56 made this async so product routes could look up a review
// aggregate before building JSON-LD; task 103 removed that lookup, but the
// signature stays async — renderPage(), the only caller, already awaits it,
// and narrowing it back would be a breaking change for no gain.
async function metaFor(route, products, posts) {
  const meta = {
    title: PAGE_COPY.home.title,
    description: PAGE_COPY.home.description,
    path: '/',
    ogImage: DEFAULT_OG,
    ogType: 'website',
    noindex: false,
    schemas: [organizationSchema(), websiteSchema()],
    // Crawlable markup injected into the matching placeholder in index.html.
    // Two separate slots, not one: both blog containers exist in the DOM at
    // all times (this is an SPA), so a single shared marker would always be
    // filled at whichever container appears first in the file.
    ssrBlogIndex: '',
    ssrBlogPost: ''
  };

  if (route.type === 'product') {
    let p = products.find(function (pr) { return slugify(pr.name) === route.slug; });
    // An old slug for a product that still exists serves that product's real
    // meta, with meta.path (the canonical, set below) pointing at its CURRENT
    // URL — so a crawler on an old link is sent to the new one rather than
    // finding a noindex dead end. MIRRORS RENAMED_SLUGS in products.js.
    if (!p) p = products.find(function (pr) { return pr.id === RENAMED_SLUGS[route.slug]; });
    if (!p) { meta.noindex = true; return meta; } // genuinely stale slug — client falls back to Home
    const copy = PRODUCT_COPY[p.id] || {
      title: p.name,
      description: (p.tagline || p.desc || '').slice(0, 155)
    };
    meta.title = titleWithBrand(copy.title);
    meta.description = copy.description;
    meta.path = '/product/' + slugify(p.name);
    meta.ogImage = ogImageFor(p);
    meta.ogType = 'product';
    meta.schemas.push(productSchema(p));
    meta.schemas.push(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: p.name, path: meta.path }
    ]));
    return meta;
  }

  if (route.type === 'post') {
    const post = posts.find(function (b) { return b.slug === route.slug; });
    if (!post) { meta.noindex = true; return meta; }
    meta.title = titleWithBrand(post.metaTitle || post.title);
    meta.description = post.metaDescription || post.excerpt || '';
    meta.path = '/blog/' + post.slug;
    meta.ogImage = absolute(post.image);
    meta.ogType = 'article';
    meta.schemas.push(articleSchema(post));
    meta.schemas.push(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: meta.path }
    ]));
    meta.ssrBlogPost = renderPostHtml(post);
    return meta;
  }

  if (route.type === 'page') {
    const copy = PAGE_COPY[route.page];
    if (!copy) { meta.noindex = true; return meta; }
    meta.title = titleWithBrand(copy.title);
    meta.description = copy.description;
    meta.path = copy.path;
    meta.noindex = !!copy.noindex;

    if (route.page === 'shop') {
      meta.schemas.push(itemListSchema(products, copy.path, copy.title));
      meta.schemas.push(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }]));
    }
    if (route.page === 'blog') {
      meta.schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': ORIGIN + '/blog#blog',
        name: 'The PawHaul Blog',
        url: ORIGIN + '/blog',
        publisher: { '@id': ORIGIN + '/#organization' },
        blogPost: posts.map(function (b) { return articleSchema(b); })
      });
      meta.schemas.push(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]));
      meta.ssrBlogIndex = renderBlogIndexHtml(posts);
    }
    if (route.page === 'contact' || route.page === 'about') {
      meta.schemas.push(breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: route.page === 'about' ? 'Our Story' : 'Contact', path: copy.path }
      ]));
    }
    return meta;
  }

  // Unknown URL: still serves the SPA (which falls back to Home) but must not
  // be indexed as a duplicate of the home page.
  meta.noindex = true;
  return meta;
}

// --------------------------------------------------- crawlable blog markup
//
// The blog exists to be read by search engines, so its text cannot depend on
// JavaScript running. These produce the same markup app.js renders client-
// side; the server drops it straight into the page container so the article
// is in the served HTML.

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function renderPostHtml(post) {
  return '' +
    '<article class="blog-article">' +
    '<nav class="blog-crumbs"><a href="/blog">Blog</a><span>/</span><span>' + esc(post.title) + '</span></nav>' +
    '<h1 class="blog-article-title">' + esc(post.title) + '</h1>' +
    '<div class="blog-article-meta"><time datetime="' + esc(post.date) + '">' + esc(fmtDate(post.date)) + '</time>' +
    '<span>·</span><span>' + esc(post.readMins) + ' min read</span></div>' +
    '<img class="blog-article-img" src="' + esc(post.image) + '" alt="' + esc(post.imageAlt) + '" width="1200" height="630">' +
    '<div class="blog-body">' + post.body + '</div>' +
    '<div class="blog-article-foot">' +
    '<a class="btn-primary" href="/shop">Shop Walk Gear</a>' +
    '<a class="blog-back" href="/blog">← All articles</a>' +
    '</div>' +
    '</article>';
}

function renderBlogIndexHtml(posts) {
  const cards = posts.map(function (p) {
    return '' +
      '<a class="blog-card" href="/blog/' + esc(p.slug) + '">' +
      '<div class="blog-card-img"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '" loading="lazy" width="1200" height="630"></div>' +
      '<div class="blog-card-body">' +
      '<div class="blog-card-tags">' + (p.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<h2>' + esc(p.title) + '</h2>' +
      '<p>' + esc(p.excerpt) + '</p>' +
      '<div class="blog-card-meta"><time datetime="' + esc(p.date) + '">' + esc(fmtDate(p.date)) + '</time><span>·</span><span>' + esc(p.readMins) + ' min read</span></div>' +
      '</div></a>';
  }).join('');
  return '<div class="blog-grid">' + cards + '</div>';
}

// ------------------------------------------------------------ head markup

function buildHead(meta, isProdHost) {
  const canonical = ORIGIN + meta.path;
  const robots = (meta.noindex || !isProdHost)
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const lines = [
    '<title>' + esc(meta.title) + '</title>',
    '<meta name="description" content="' + esc(meta.description) + '">',
    '<link rel="canonical" href="' + esc(canonical) + '">',
    '<meta name="robots" content="' + robots + '">',
    // Open Graph — Facebook, iMessage, WhatsApp, LinkedIn, Pinterest.
    '<meta property="og:site_name" content="' + BRAND + '">',
    '<meta property="og:type" content="' + esc(meta.ogType) + '">',
    '<meta property="og:title" content="' + esc(meta.title) + '">',
    '<meta property="og:description" content="' + esc(meta.description) + '">',
    '<meta property="og:url" content="' + esc(canonical) + '">',
    '<meta property="og:image" content="' + esc(meta.ogImage) + '">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="' + esc(meta.title) + '">',
    '<meta property="og:locale" content="en_US">',
    // Twitter/X reads og:* as a fallback but wants its own card type.
    '<meta name="twitter:card" content="' + TWITTER_CARD + '">',
    '<meta name="twitter:title" content="' + esc(meta.title) + '">',
    '<meta name="twitter:description" content="' + esc(meta.description) + '">',
    '<meta name="twitter:image" content="' + esc(meta.ogImage) + '">',
    '<meta name="theme-color" content="#1a1a2e">'
  ];

  // Ownership proofs — see SITE_VERIFICATION at the top of this file.
  if (SITE_VERIFICATION.google) lines.push('<meta name="google-site-verification" content="' + esc(SITE_VERIFICATION.google) + '">');
  if (SITE_VERIFICATION.bing) lines.push('<meta name="msvalidate.01" content="' + esc(SITE_VERIFICATION.bing) + '">');
  if (SITE_VERIFICATION.pinterest) lines.push('<meta name="p:domain_verify" content="' + esc(SITE_VERIFICATION.pinterest) + '">');

  meta.schemas.forEach(function (s) {
    lines.push('<script type="application/ld+json">' + jsonLd(s) + '</script>');
  });

  return lines.join('\n');
}

// ------------------------------------------------------------- rendering

// index.html keeps a real <title> so the raw file is still valid on its own
// (and so a failure here degrades to the old behaviour rather than a
// title-less page). This swaps that one tag for the whole generated block.
const TITLE_RE = /<title>[\s\S]*?<\/title>/i;
const BLOG_INDEX_SLOT = '<!--SSR-BLOG-INDEX-->';
const BLOG_POST_SLOT = '<!--SSR-BLOG-POST-->';

async function renderPage(pathname, baseUrl, hostHeader) {
  const html = await readRootFile('index.html', baseUrl);
  if (!html) return null;

  const products = await getProducts(baseUrl);
  const posts = await getPosts(baseUrl);
  const route = parseRoute(pathname);
  const meta = await metaFor(route, products, posts);
  const isProdHost = String(hostHeader || '').toLowerCase() === PROD_HOST;

  // Function replacers, not string ones: the generated head and the article
  // bodies both contain "$" sequences ($1, $& etc. appear in prices and prose)
  // which String.replace would otherwise interpret as capture references.
  let out = html.replace(TITLE_RE, function () { return buildHead(meta, isProdHost); });
  if (meta.ssrBlogIndex) out = out.replace(BLOG_INDEX_SLOT, function () { return meta.ssrBlogIndex; });
  if (meta.ssrBlogPost) out = out.replace(BLOG_POST_SLOT, function () { return meta.ssrBlogPost; });
  return out;
}

module.exports = {
  ORIGIN, PROD_HOST, BRAND, SUPPORT_EMAIL, DEFAULT_OG,
  readRootFile, extractArrayLiteral, getProducts, getPosts,
  parseRoute, slugify, esc, absolute, ogImageFor, priceRange, money,
  PRODUCT_COPY, PAGE_COPY,
  metaFor, buildHead, renderPage,
  renderPostHtml, renderBlogIndexHtml,
  sha1: function (s) { return crypto.createHash('sha1').update(s).digest('hex'); }
};
