#!/usr/bin/env node
'use strict';
/**
 * PawHaul -> Pinterest auto-pinning.
 *
 * Pinterest is the one major visual network that genuinely allows programmatic
 * posting of promotional product content, and it is a search engine as much as
 * a social network — pins keep driving clicks for months, unlike a feed post.
 * That makes it the best automation target of the free channels.
 *
 * READ THIS BEFORE ASSUMING IT WORKS:
 * Pinterest has two access tiers, and the difference is decisive.
 *   * TRIAL access (granted automatically after the first app review):
 *     API calls succeed and return a real pin ID, but THE PINS ARE HIDDEN FROM
 *     THE PUBLIC. Tokens also expire after 24 hours. Useful only for proving
 *     the integration works.
 *   * STANDARD access (a second, separate review): pins are public and tokens
 *     behave normally. Requires submitting a screen recording of this
 *     integration actually creating a pin.
 * So the sequence is: get Trial -> run this in --live mode -> record that ->
 * submit for Standard. See MARKETING-SETUP.md.
 *
 * USAGE
 *   node scripts/social/pinterest-pin.js --check
 *       Verify the token and list the boards it can post to.
 *
 *   node scripts/social/pinterest-pin.js --all
 *       DRY RUN (default): print exactly what would be posted, call nothing.
 *
 *   node scripts/social/pinterest-pin.js --all --live
 *       Actually create the pins.
 *
 *   node scripts/social/pinterest-pin.js --product 6 --live
 *   node scripts/social/pinterest-pin.js --all --images all --live
 *       One pin per colourway instead of one per product.
 *
 * ENV (put these in a .env file at the repo root; it is gitignored)
 *   PINTEREST_ACCESS_TOKEN   OAuth token with boards:read, pins:read, pins:write
 *   PINTEREST_BOARD_ID       Target board (--check prints the IDs)
 *
 * Run from the repo root — the catalogue is read out of products.js.
 */

const path = require('path');

// Load tokens from a .env at the repo root if there is one, so they stay out of
// shell history and out of git (.gitignore already covers .env*). Falls back to
// the real environment when the file is absent. Node 20.6+.
try { process.loadEnvFile(path.join(__dirname, '..', '..', '.env')); } catch (e) { /* no .env — use the ambient environment */ }

const seo = require(path.join(__dirname, '..', '..', 'api', '_seo.js'));

const API = 'https://api.pinterest.com/v5';
const UTM = '?utm_source=pinterest&utm_medium=social&utm_campaign=product_pins';

// ---------------------------------------------------------------- arg parsing

const argv = process.argv.slice(2);
function flag(name) { return argv.includes('--' + name); }
function opt(name, dflt) {
  const i = argv.indexOf('--' + name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : dflt;
}

const LIVE = flag('live');
const TOKEN = (process.env.PINTEREST_ACCESS_TOKEN || '').trim();
const BOARD = (opt('board', process.env.PINTEREST_BOARD_ID) || '').trim();

// ------------------------------------------------------------------- helpers

async function api(pathname, options) {
  const res = await fetch(API + pathname, Object.assign({
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    }
  }, options || {}));
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* keep raw */ }
  if (!res.ok) {
    const err = new Error('Pinterest ' + res.status + ': ' + (json && (json.message || json.error_description) || text.slice(0, 300)));
    err.status = res.status;
    err.body = json || text;
    throw err;
  }
  return json;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Pin copy. Pinterest is a SEARCH surface: the description is indexed and is
 * what surfaces a pin months later, so it is written for the query a dog owner
 * would actually type, not as ad copy. Title caps at 100 chars, description at
 * 800 — both are enforced by the API.
 */
function pinCopy(product) {
  const lv = seo.priceRange(product);
  const price = '$' + seo.money(lv.low);
  const title = (product.name + ' — ' + (product.tagline || '')).slice(0, 100);

  const bullets = (product.features || []).slice(0, 3).map(f => '• ' + f).join('\n');
  const description = [
    product.tagline || '',
    '',
    (product.desc || '').split('. ').slice(0, 2).join('. ') + (product.desc ? '.' : ''),
    '',
    bullets,
    '',
    'From ' + price + ' · Free shipping · 30-day returns',
    '',
    hashtagsFor(product)
  ].filter(l => l !== null).join('\n').trim().slice(0, 800);

  return { title, description };
}

function hashtagsFor(product) {
  const base = ['#dogwalk', '#doggear', '#dogsofpinterest', '#puppylove'];
  const byCategory = {
    water: ['#doghydration', '#dogtravel', '#dogwaterbottle'],
    leash: ['#dogleash', '#dogwalking', '#dogtraining'],
    safety: ['#dogsafety', '#nightwalks', '#dogcollar']
  };
  return base.concat(byCategory[product.category] || []).join(' ');
}

// Pinterest fetches the image itself, so it must be a public URL. Shopify's CDN
// serves these; ?width=1200 keeps them within Pinterest's size expectations and
// well above its 200px minimum. Local /images/... paths are made absolute
// against the live site.
function imagesFor(product, mode) {
  const pool = []
    .concat(Object.values(product.images || {}), product.extraImages || [])
    .filter(Boolean);
  // Shopify-hosted images first: they can be requested at ?width=1200, whereas
  // the committed /images/products/*.jpg copies are small card-sized files.
  // Pinterest scales a pin to 1000px wide in the feed, so resolution matters
  // more here than anywhere else on the site.
  const ranked = pool
    .slice()
    .sort((a, b) => (b.indexOf('cdn.shopify.com') !== -1) - (a.indexOf('cdn.shopify.com') !== -1))
    .map(u => u.indexOf('cdn.shopify.com') !== -1 ? u.replace(/([?&])width=\d+/, '$1width=1200') : seo.absolute(u));
  return mode === 'all' ? ranked.slice(0, 5) : ranked.slice(0, 1);
}

// --------------------------------------------------------------------- modes

async function check() {
  if (!TOKEN) throw new Error('PINTEREST_ACCESS_TOKEN is not set.');
  const me = await api('/user_account');
  console.log('Authenticated as: ' + (me.username || '(unknown)') + '  type=' + (me.account_type || '?'));

  const boards = await api('/boards?page_size=50');
  const items = (boards && boards.items) || [];
  if (!items.length) {
    console.log('\nNo boards found. Create a board in the Pinterest UI first —');
    console.log('the API can only pin to a board that already exists.');
    return;
  }
  console.log('\nBoards this token can post to:');
  items.forEach(b => console.log('  ' + b.id + '  ' + b.name + (b.privacy ? '  [' + b.privacy + ']' : '')));
  console.log('\nSet PINTEREST_BOARD_ID to the one you want, or pass --board <id>.');
}

async function run() {
  const products = await seo.getProducts(null);
  if (!products.length) throw new Error('No products parsed from products.js — run this from the repo root.');

  const only = opt('product', null);
  const targets = only ? products.filter(p => String(p.id) === String(only)) : products;
  if (!targets.length) throw new Error('No product with id ' + only);

  const imageMode = opt('images', 'first');

  if (!LIVE) {
    console.log('DRY RUN — nothing will be posted. Add --live to actually pin.\n');
  } else {
    if (!TOKEN) throw new Error('PINTEREST_ACCESS_TOKEN is not set.');
    if (!BOARD) throw new Error('No board. Pass --board <id> or set PINTEREST_BOARD_ID (run --check to list them).');
  }

  let created = 0, failed = 0;
  for (const product of targets) {
    const copy = pinCopy(product);
    const link = seo.ORIGIN + '/product/' + seo.slugify(product.name) + UTM;
    const images = imagesFor(product, imageMode);

    for (const image of images) {
      console.log('---');
      console.log('title: ' + copy.title);
      console.log('link:  ' + link);
      console.log('image: ' + image);
      if (!LIVE) { console.log(copy.description.split('\n').map(l => '  ' + l).join('\n')); continue; }

      try {
        const pin = await api('/pins', {
          method: 'POST',
          body: JSON.stringify({
            board_id: BOARD,
            title: copy.title,
            description: copy.description,
            link: link,
            alt_text: (product.name + ' — ' + (product.tagline || '')).slice(0, 500),
            media_source: { source_type: 'image_url', url: image }
          })
        });
        created++;
        console.log('  -> created pin ' + pin.id);
      } catch (e) {
        failed++;
        console.log('  -> FAILED: ' + e.message);
        // 429 is a rate limit; on Trial access the quota is per DAY, so there
        // is no point retrying in-process.
        if (e.status === 429) { console.log('  Rate limited — stopping.'); return report(created, failed); }
      }
      // Well under any documented limit; being unhurried here costs nothing
      // and keeps the account from looking automated.
      await sleep(2000);
    }
  }
  report(created, failed);
}

function report(created, failed) {
  if (LIVE) {
    console.log('\n' + created + ' pins created, ' + failed + ' failed.');
    if (created) {
      console.log('\nIf your app is still on TRIAL access these pins exist but are');
      console.log('NOT publicly visible. Record this run and submit for Standard.');
    }
  }
}

// ---------------------------------------------------------------------- main

(async () => {
  try {
    if (flag('check')) await check();
    else if (flag('all') || opt('product', null)) await run();
    else {
      console.log('Usage:');
      console.log('  node scripts/social/pinterest-pin.js --check');
      console.log('  node scripts/social/pinterest-pin.js --all            (dry run)');
      console.log('  node scripts/social/pinterest-pin.js --all --live');
      console.log('  node scripts/social/pinterest-pin.js --product 6 --live');
      console.log('  node scripts/social/pinterest-pin.js --all --images all --live');
    }
  } catch (e) {
    console.error('\nERROR: ' + e.message);
    process.exit(1);
  }
})();
