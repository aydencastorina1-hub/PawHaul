"""Generate responsive WebP variants for PawHaul's local product photos.

Source .jpg files stay on disk untouched: they are the full-quality masters
(and _seo.js still points social scrapers at them, since WebP OG images are
hit-and-miss across scrapers).

For each source we emit <name>-<width>.webp for every bucket at or below the
source's native width, plus the native width itself when it falls between
buckets. Nothing is ever upscaled.
"""
import json
import os
import sys
from PIL import Image

SRC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "images", "products")
BUCKETS = [400, 800, 1200]
QUALITY = 82

manifest = {}
total_before = 0
total_after = 0
rows = []

for name in sorted(os.listdir(SRC_DIR)):
    if not name.lower().endswith(".jpg"):
        continue
    src = os.path.join(SRC_DIR, name)
    base = name[:-4]
    im = Image.open(src).convert("RGB")
    nw, nh = im.size
    orig_bytes = os.path.getsize(src)

    widths = [w for w in BUCKETS if w < nw]
    widths.append(min(nw, BUCKETS[-1]) if nw < BUCKETS[-1] else nw)
    widths = sorted(set(widths))
    # Cap the top variant: nothing on this site renders wider than ~1800 CSS px
    # even on a 2x full-bleed category hero.
    widths = [w for w in widths if w <= 1800] or [min(nw, 1800)]

    out_widths = []
    made = []
    for w in widths:
        h = round(nh * (w / nw))
        resized = im if w == nw else im.resize((w, h), Image.LANCZOS)
        out = os.path.join(SRC_DIR, "%s-%d.webp" % (base, w))
        resized.save(out, "WEBP", quality=QUALITY, method=6)
        out_widths.append(w)
        made.append(os.path.getsize(out))

    manifest[base] = out_widths
    total_before += orig_bytes
    total_after += made[-1]
    rows.append((name, nw, nh, orig_bytes, out_widths, made))

for name, nw, nh, ob, ws, ms in rows:
    variants = " ".join("%d:%dK" % (w, m // 1024) for w, m in zip(ws, ms))
    print("%-42s %dx%d  jpg=%4dK  ->  %s" % (name, nw, nh, ob // 1024, variants))

print()
print("largest-variant total: %.1fMB  (was %.1fMB of jpg)"
      % (total_after / 1048576.0, total_before / 1048576.0))

# products.js needs to know which widths actually exist per file (nothing is
# upscaled, so a 675px master has no 800 or 1200 variant). Paste this block
# over the LOCAL_PHOTO_WIDTHS table in products.js after re-running.
lines = ["var LOCAL_PHOTO_WIDTHS = {"]
for k in sorted(manifest):
    lines.append("  '%s': [%s]," % (k, ", ".join(str(w) for w in manifest[k])))
lines.append("};")
block = chr(10).join(lines)

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "local-photo-widths.js")
with open(out_path, "w") as f:
    f.write(block + chr(10))
print()
print("%d entries -> %s" % (len(manifest), out_path))
