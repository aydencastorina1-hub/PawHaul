#!/usr/bin/env node
'use strict';
/**
 * Download a video (TikTok/Reels/YouTube Short) into marketing/video/ so it can
 * be re-published with scripts/social/meta-reel.js.
 *
 * ---------------------------------------------------------------------------
 * ONLY USE THIS ON VIDEOS YOU OWN.
 * Re-posting someone else's video as PawHaul content is copyright infringement
 * and a terms-of-service violation on every platform involved, regardless of
 * whether it is credited. If the video is not yours, get written permission or
 * do not post it. This script does not and cannot check that — you do.
 * ---------------------------------------------------------------------------
 *
 * A SECOND, PRACTICAL WARNING: videos pulled from TikTok carry a TikTok
 * watermark, and both Instagram and Facebook actively demote visibly
 * watermarked reposts — the reach hit is real and large. If the video is your
 * own, export it watermark-free from TikTok's own "save video" flow (or from
 * whatever you edited it in) instead of scraping the published copy. Use this
 * script when that is not possible.
 *
 * REQUIRES yt-dlp on PATH:
 *   winget install yt-dlp            (Windows)
 *   python -m pip install -U yt-dlp  (anywhere)
 *
 * USAGE
 *   node scripts/social/fetch-video.js <url> [--name walk-kit]
 *
 * Then, because Instagram will only accept a public URL:
 *   git add marketing/video && git commit && git push     (Vercel auto-deploys)
 *   node scripts/social/meta-reel.js \
 *     --video ./marketing/video/<name>.mp4 \
 *     --video-url https://pawhaul.vercel.app/marketing/video/<name>.mp4 \
 *     --caption "..." --both --live
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const url = argv.find(a => /^https?:\/\//.test(a));
function opt(n, d) { const i = argv.indexOf('--' + n); return i !== -1 && argv[i + 1] ? argv[i + 1] : d; }

if (!url) {
  console.log('Usage: node scripts/social/fetch-video.js <url> [--name my-clip]');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '..', '..', 'marketing', 'video');
fs.mkdirSync(OUT_DIR, { recursive: true });

const name = (opt('name', 'clip-' + Date.now())).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
const target = path.join(OUT_DIR, name + '.mp4');

try {
  execFileSync('yt-dlp', ['--version'], { stdio: 'ignore' });
} catch (e) {
  console.error('yt-dlp is not on PATH. Install it first:');
  console.error('  winget install yt-dlp        OR        python -m pip install -U yt-dlp');
  process.exit(1);
}

console.log('Downloading ' + url);
console.log('  -> ' + target);
try {
  // Force mp4 + h264/aac: Meta re-encodes anyway, but a webm or an exotic codec
  // is a common cause of a container failing to transcode with no useful error.
  execFileSync('yt-dlp', [
    '-f', 'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b',
    '--merge-output-format', 'mp4',
    '-o', target,
    url
  ], { stdio: 'inherit' });
} catch (e) {
  console.error('\nDownload failed. If this is a private or region-locked video, yt-dlp cannot reach it.');
  process.exit(1);
}

if (!fs.existsSync(target)) {
  console.error('Download reported success but no file was written.');
  process.exit(1);
}

const mb = fs.statSync(target).size / 1048576;
console.log('\nSaved ' + target + ' (' + mb.toFixed(1) + ' MB)');

// Vercel Hobby caps a deployment at 100 MB and this file will be committed into
// the repo, so flag anything big before it becomes a failed deploy.
if (mb > 45) {
  console.log('\nWARNING: that is large for a file committed to the repo and served');
  console.log('from the deployment. Compress it before pushing, e.g.:');
  console.log('  ffmpeg -i "' + target + '" -vcodec h264 -crf 28 -preset slow out.mp4');
}

console.log('\nNext:');
console.log('  1. Check it is 9:16 and 5-90s, or it will not land in the Reels tab.');
console.log('  2. git add marketing/video && git commit -m "reel: ' + name + '" && git push');
console.log('  3. node scripts/social/meta-reel.js \\');
console.log('       --video ./marketing/video/' + name + '.mp4 \\');
console.log('       --video-url https://pawhaul.vercel.app/marketing/video/' + name + '.mp4 \\');
console.log('       --caption "your caption" --both --live');
