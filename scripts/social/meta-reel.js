#!/usr/bin/env node
'use strict';
/**
 * PawHaul -> Facebook Page Reels + Instagram Reels.
 *
 * Publishes one video as a Reel to the PawHaul Facebook Page and/or the linked
 * Instagram Business account, via the Meta Graph API.
 *
 * WHAT META REQUIRES BEFORE ANY OF THIS RUNS (all one-time, all manual —
 * there is no way to automate around them; see MARKETING-SETUP.md):
 *   1. A Facebook Page for PawHaul.
 *   2. An Instagram account converted to a PROFESSIONAL / BUSINESS account and
 *      linked to that Page. Creator accounts CANNOT publish via the API.
 *   3. A Meta Business Portfolio with Business Verification completed.
 *   4. A Meta developer app with these permissions approved by App Review:
 *        pages_show_list, pages_read_engagement, pages_manage_posts
 *        instagram_basic, instagram_content_publish
 *      Each needs a screencast of the flow. Budget 2-4 weeks.
 *   5. A long-lived Page access token.
 *
 * THE TWO PLATFORMS TAKE THE VIDEO DIFFERENTLY — this is the main gotcha:
 *   * Facebook accepts a LOCAL FILE, uploaded as binary to rupload.facebook.com.
 *   * Instagram does NOT accept an upload. It requires a PUBLIC HTTPS URL that
 *     Meta's servers fetch themselves.
 *   The simplest zero-cost way to satisfy Instagram is to commit the file to
 *   marketing/video/ and deploy — Vercel then serves it at
 *   https://pawhaul.vercel.app/marketing/video/<name>.mp4, which is a perfectly
 *   good public URL. Pass that with --video-url.
 *
 * REEL SPEC (enforced by Meta, not by this script):
 *   9:16 aspect ratio, 5-90 seconds. Outside that range it still publishes but
 *   lands as an ordinary video post rather than in the Reels tab.
 *
 * USAGE
 *   node scripts/social/meta-reel.js --check
 *   node scripts/social/meta-reel.js --video ./marketing/video/walk.mp4 \
 *        --video-url https://pawhaul.vercel.app/marketing/video/walk.mp4 \
 *        --caption "Every walk essential in one kit 🐾" --both
 *   ...add --live to actually publish. Default is a dry run.
 *
 *   --fb      Facebook Page only    (needs --video, a local file)
 *   --ig      Instagram only        (needs --video-url, a public URL)
 *   --both    Both
 *
 * ENV
 *   META_PAGE_ID          Facebook Page ID
 *   META_PAGE_TOKEN       Long-lived Page access token
 *   META_IG_USER_ID       Instagram Business account ID (--check prints it)
 *   META_API_VERSION      Optional, defaults below. Bump when Meta deprecates.
 */

const fs = require('fs');
const path = require('path');

// See the note in pinterest-pin.js — tokens come from a gitignored .env.
try { process.loadEnvFile(path.join(__dirname, '..', '..', '.env')); } catch (e) { /* no .env — use the ambient environment */ }

const VERSION = process.env.META_API_VERSION || 'v23.0';
const GRAPH = 'https://graph.facebook.com/' + VERSION;
const RUPLOAD = 'https://rupload.facebook.com/video-upload/' + VERSION;

const PAGE_ID = (process.env.META_PAGE_ID || '').trim();
const PAGE_TOKEN = (process.env.META_PAGE_TOKEN || '').trim();
const IG_USER_ID = (process.env.META_IG_USER_ID || '').trim();

const argv = process.argv.slice(2);
const flag = n => argv.includes('--' + n);
function opt(n, d) { const i = argv.indexOf('--' + n); return i !== -1 && argv[i + 1] ? argv[i + 1] : d; }

const LIVE = flag('live');
const VIDEO = opt('video', null);
const VIDEO_URL = opt('video-url', null);
const CAPTION = opt('caption', 'New walk gear from PawHaul 🐾 pawhaul.vercel.app');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function graph(pathname, options) {
  const res = await fetch(GRAPH + pathname, options);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* keep raw */ }
  if (!res.ok || (json && json.error)) {
    const e = (json && json.error) || {};
    throw new Error('Meta ' + res.status + ': ' + (e.message || text.slice(0, 300)) +
      (e.code ? ' (code ' + e.code + (e.error_subcode ? '/' + e.error_subcode : '') + ')' : ''));
  }
  return json;
}

// ------------------------------------------------------------------- check

async function check() {
  if (!PAGE_TOKEN) throw new Error('META_PAGE_TOKEN is not set.');

  const me = await graph('/me?fields=id,name&access_token=' + encodeURIComponent(PAGE_TOKEN));
  console.log('Token belongs to: ' + me.name + ' (id ' + me.id + ')');

  // Which permissions actually got approved — the single most useful thing to
  // see, because a missing scope surfaces later as an opaque generic error.
  try {
    const perms = await graph('/me/permissions?access_token=' + encodeURIComponent(PAGE_TOKEN));
    const granted = (perms.data || []).filter(p => p.status === 'granted').map(p => p.permission);
    const declined = (perms.data || []).filter(p => p.status !== 'granted').map(p => p.permission);
    console.log('Granted:  ' + (granted.join(', ') || '(none)'));
    if (declined.length) console.log('DECLINED: ' + declined.join(', '));
    ['pages_manage_posts', 'instagram_content_publish'].forEach(need => {
      if (!granted.includes(need)) console.log('  !! missing "' + need + '" — publishing will fail until App Review approves it.');
    });
  } catch (e) {
    console.log('(could not read permissions: ' + e.message + ')');
  }

  if (PAGE_ID) {
    const ig = await graph('/' + PAGE_ID + '?fields=name,instagram_business_account&access_token=' + encodeURIComponent(PAGE_TOKEN));
    console.log('Page: ' + ig.name);
    if (ig.instagram_business_account) {
      console.log('Linked Instagram Business account id: ' + ig.instagram_business_account.id);
      console.log('  -> set META_IG_USER_ID to that value');
    } else {
      console.log('NO linked Instagram Business account. Instagram publishing will not work');
      console.log('until an Instagram PROFESSIONAL account is connected to this Page.');
    }
  } else {
    console.log('META_PAGE_ID not set — list your pages with /me/accounts.');
  }
}

// -------------------------------------------------------------- facebook

async function postFacebookReel() {
  if (!PAGE_ID) throw new Error('META_PAGE_ID is not set.');
  if (!VIDEO) throw new Error('--video <local file> is required for Facebook.');
  const file = path.resolve(VIDEO);
  if (!fs.existsSync(file)) throw new Error('No such file: ' + file);
  const size = fs.statSync(file).size;

  console.log('\n[facebook] ' + file + ' (' + (size / 1048576).toFixed(1) + ' MB)');
  if (!LIVE) { console.log('[facebook] DRY RUN — would publish with caption: ' + CAPTION); return; }

  // 1. start — reserves a video id and gives back a one-shot upload URL
  const start = await graph('/' + PAGE_ID + '/video_reels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upload_phase: 'start', access_token: PAGE_TOKEN })
  });
  console.log('[facebook] video_id ' + start.video_id);

  // 2. upload the bytes. This goes to rupload.facebook.com, NOT graph, and
  // uses the "OAuth <token>" Authorization form rather than a query param.
  const uploadRes = await fetch(RUPLOAD + '/' + start.video_id, {
    method: 'POST',
    headers: {
      Authorization: 'OAuth ' + PAGE_TOKEN,
      offset: '0',
      file_size: String(size),
      'Content-Type': 'application/octet-stream'
    },
    body: fs.readFileSync(file)
  });
  const uploadText = await uploadRes.text();
  if (!uploadRes.ok) throw new Error('upload failed ' + uploadRes.status + ': ' + uploadText.slice(0, 300));
  console.log('[facebook] uploaded');

  // 3. finish + publish
  const finish = await graph('/' + PAGE_ID + '/video_reels?' + new URLSearchParams({
    upload_phase: 'finish',
    video_id: start.video_id,
    video_state: 'PUBLISHED',
    description: CAPTION,
    access_token: PAGE_TOKEN
  }), { method: 'POST' });
  console.log('[facebook] published: ' + JSON.stringify(finish));
  console.log('[facebook] https://www.facebook.com/reel/' + start.video_id);
}

// ------------------------------------------------------------- instagram

async function postInstagramReel() {
  if (!IG_USER_ID) throw new Error('META_IG_USER_ID is not set (run --check).');
  if (!VIDEO_URL) throw new Error('--video-url <public https url> is required for Instagram — Meta fetches the file itself.');
  if (!/^https:\/\//.test(VIDEO_URL)) throw new Error('--video-url must be https.');

  console.log('\n[instagram] ' + VIDEO_URL);
  if (!LIVE) { console.log('[instagram] DRY RUN — would publish with caption: ' + CAPTION); return; }

  // Sanity-check the URL ourselves. If Meta cannot fetch it the container just
  // fails minutes later with an unhelpful message, so fail fast and clearly.
  const head = await fetch(VIDEO_URL, { method: 'HEAD' });
  if (!head.ok) throw new Error('video URL is not publicly reachable (HTTP ' + head.status + ')');

  // 1. container
  const container = await graph('/' + IG_USER_ID + '/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: VIDEO_URL,
      caption: CAPTION,
      share_to_feed: true,
      access_token: PAGE_TOKEN
    })
  });
  console.log('[instagram] container ' + container.id);

  // 2. Meta transcodes asynchronously. Publishing before it is FINISHED fails,
  // so poll. A 60-90s reel is usually ready inside a minute; the ceiling here
  // is generous because a cold CDN fetch can add to it.
  let status = '';
  for (let i = 0; i < 60; i++) {
    await sleep(5000);
    const s = await graph('/' + container.id + '?fields=status_code,status&access_token=' + encodeURIComponent(PAGE_TOKEN));
    status = s.status_code;
    process.stdout.write('\r[instagram] status: ' + status + ' (' + ((i + 1) * 5) + 's)   ');
    if (status === 'FINISHED') break;
    if (status === 'ERROR') throw new Error('\ntranscode failed: ' + (s.status || 'unknown'));
  }
  console.log('');
  if (status !== 'FINISHED') throw new Error('container never finished (last status ' + status + ')');

  // 3. publish
  const published = await graph('/' + IG_USER_ID + '/media_publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: PAGE_TOKEN })
  });
  console.log('[instagram] published media ' + published.id);
}

// ------------------------------------------------------------------- main

(async () => {
  try {
    if (flag('check')) { await check(); return; }

    const doFb = flag('fb') || flag('both');
    const doIg = flag('ig') || flag('both');
    if (!doFb && !doIg) {
      console.log('Pick a target: --fb, --ig or --both (add --check to inspect the token).');
      console.log('Run with no --live to dry run.');
      return;
    }
    if (!LIVE) console.log('DRY RUN — add --live to actually publish.');
    console.log('caption: ' + CAPTION);

    if (doFb) await postFacebookReel();
    if (doIg) await postInstagramReel();
  } catch (e) {
    console.error('\nERROR: ' + e.message);
    process.exit(1);
  }
})();
