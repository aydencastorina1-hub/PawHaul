"""Regenerate every PawHaul icon from the source paw artwork.

Source: images/brand/favicon-source.png — a white paw centred on navy.

The source is a 1254x1254 render with a LOT of empty margin: the paw fills
only ~49% of the width, which at 16px would leave a 7px paw in a 16px box.
So this script does not simply resize it. It finds the five paw blobs, fits
an ellipse to each one, and redraws them — cropped so the paw fills ~80% of
the icon, supersampled 4x and downsampled with LANCZOS for clean edges at
16px.

Working from fitted geometry rather than the pixels also means favicon.svg
(emitted here too) is guaranteed to match the PNGs exactly, instead of being
a hand-drawn approximation that drifts from them.

Outputs, all at the repo root:
    favicon.svg            vector, what modern browsers actually use
    favicon.ico            16 + 32 + 48
    favicon-16.png
    favicon-32.png
    favicon-192.png        ALSO the Organization logo in JSON-LD (api/_seo.js)
    apple-touch-icon.png   180x180

Run: python make_icon.py
"""
import math
from collections import deque

import numpy as np
from PIL import Image, ImageDraw

SRC = "images/brand/favicon-source.png"
SS = 4              # supersample factor
PAW = (255, 255, 255)

# (shrink, fill) per output size.
#
# `fill` is how much of the icon the paw's long side spans. `shrink` scales
# each blob about its own centre WITHOUT moving it, which widens the gaps
# between the toes and the pad while keeping the silhouette.
#
# Why shrink at all: in the source the gap between the top toes and the pad is
# 4.97 units in 100 — 0.8px once the icon is 16px wide. Below a pixel it just
# blurs away, and the paw renders as one white blob. Opening the gaps and
# cropping tighter to compensate keeps five distinct shapes at 16px. Verified
# by rendering the candidates and looking at them, not by eye-balling numbers.
#
# Large sizes stay faithful to the artwork (1.00 / 0.80).
PROFILES = {
    16:  (0.87, 0.90),
    32:  (0.93, 0.85),
    48:  (0.95, 0.83),   # the .ico's largest frame
    180: (1.00, 0.80),
    192: (1.00, 0.80),
}
# favicon.svg is what modern browsers actually put in the TAB, where it is
# rasterised at 16-32px — so it takes the small-size treatment too. Sizing it
# for 192px would have quietly undone all of the above.
SVG_PROFILE = (0.90, 0.87)


def load_blobs(path):
    """Fit an ellipse to each connected white blob in the source art."""
    a = np.array(Image.open(path).convert("RGB"))
    mask = a.mean(axis=2) > 128
    H, W = mask.shape

    # Background colour = the most common pixel, so a re-render with a
    # different navy still produces a matching icon.
    cols, counts = np.unique(a.reshape(-1, 3), axis=0, return_counts=True)
    bg = tuple(int(v) for v in cols[counts.argmax()])

    seen = np.zeros((H, W), bool)
    comps = []
    for y in range(H):
        for x in range(W):
            if mask[y, x] and not seen[y, x]:
                q = deque([(y, x)])
                seen[y, x] = True
                px = []
                while q:
                    cy, cx = q.popleft()
                    px.append((cy, cx))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
                comps.append(px)

    blobs = []
    for px in comps:
        ys = np.array([p[0] for p in px], float)
        xs = np.array([p[1] for p in px], float)
        cx, cy = xs.mean(), ys.mean()
        x0, y0 = xs - cx, ys - cy
        cov = np.array([[(x0 * x0).mean(), (x0 * y0).mean()],
                        [(x0 * y0).mean(), (y0 * y0).mean()]])
        ev, evec = np.linalg.eigh(cov)
        order = ev.argsort()[::-1]
        ev, evec = ev[order], evec[:, order]
        # For a uniformly filled ellipse, semi-axis = 2 * sqrt(eigenvalue).
        ang = math.degrees(math.atan2(evec[1, 0], evec[0, 0]))
        # An ellipse is symmetric under a half turn, so fold the angle into
        # (-90, 90]. Without this the pad comes out as rotate(179.51) — the
        # same shape, but it reads as a mistake in the SVG source.
        ang = (ang + 90) % 180 - 90
        blobs.append(dict(cx=cx, cy=cy,
                          a=2 * math.sqrt(ev[0]), b=2 * math.sqrt(ev[1]),
                          ang=ang))

    ys, xs = np.nonzero(mask)
    bbox = (xs.min(), ys.min(), xs.max(), ys.max())
    return blobs, bg, bbox


def crop_window(bbox, fill):
    """Square crop centred on the paw, sized so it spans `fill` of the icon."""
    x0, y0, x1, y1 = bbox
    side = max(x1 - x0 + 1, y1 - y0 + 1) / fill
    cx, cy = (x0 + x1) / 2.0, (y0 + y1) / 2.0
    return cx - side / 2.0, cy - side / 2.0, side


def shrink_blobs(blobs, f):
    """Scale every blob about its own centre, leaving positions alone."""
    return [dict(cx=b["cx"], cy=b["cy"], a=b["a"] * f, b=b["b"] * f, ang=b["ang"])
            for b in blobs]


def variant(blobs, bbox, profile):
    f, fill = profile
    return shrink_blobs(blobs, f), crop_window(bbox, fill)


def ellipse_points(cx, cy, a, b, ang_deg, n=192):
    """Boundary of a rotated ellipse — PIL cannot draw one directly."""
    t = np.linspace(0, 2 * math.pi, n, endpoint=False)
    r = math.radians(ang_deg)
    ca, sa = math.cos(r), math.sin(r)
    ex, ey = a * np.cos(t), b * np.sin(t)
    return list(zip(cx + ex * ca - ey * sa, cy + ex * sa + ey * ca))


def render(size, blobs, bg, win):
    ox, oy, side = win
    s = size * SS
    k = s / side                      # source px -> supersampled icon px
    img = Image.new("RGB", (s, s), bg)
    d = ImageDraw.Draw(img)
    for bl in blobs:
        d.polygon(ellipse_points((bl["cx"] - ox) * k, (bl["cy"] - oy) * k,
                                 bl["a"] * k, bl["b"] * k, bl["ang"]), fill=PAW)
    return img.resize((size, size), Image.LANCZOS)


def write_svg(path, blobs, bg, win):
    ox, oy, side = win
    k = 100.0 / side                  # source px -> 100-unit viewBox
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
             '  <rect width="100" height="100" fill="#%02x%02x%02x"/>' % bg]
    for bl in blobs:
        cx, cy = (bl["cx"] - ox) * k, (bl["cy"] - oy) * k
        rx, ry = bl["a"] * k, bl["b"] * k
        # The fitted major axis is near-vertical on the toes, so each ellipse
        # is written with its own rotation rather than forced upright — that
        # slight outward splay is what makes it read as a paw and not as four
        # identical dots.
        parts.append(
            '  <ellipse cx="%.2f" cy="%.2f" rx="%.2f" ry="%.2f" fill="#fff"'
            ' transform="rotate(%.2f %.2f %.2f)"/>' % (cx, cy, rx, ry, bl["ang"], cx, cy))
    parts.append('</svg>')
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(parts) + "\n")


def main():
    blobs, bg, bbox = load_blobs(SRC)
    print("source blobs: %d   background: #%02x%02x%02x" % (len(blobs), *bg))

    for size, name in ((16, "favicon-16.png"), (32, "favicon-32.png"),
                       (192, "favicon-192.png"), (180, "apple-touch-icon.png")):
        bl, win = variant(blobs, bbox, PROFILES[size])
        render(size, bl, bg, win).save(name)
        print("  wrote %-22s shrink=%.2f fill=%.2f" % (name, *PROFILES[size]))

    # One .ico carrying three frames, each rendered at its own profile rather
    # than one bitmap downscaled twice.
    frames = []
    for size in (16, 32, 48):
        bl, win = variant(blobs, bbox, PROFILES[size])
        frames.append(render(size, bl, bg, win))
    frames[-1].save("favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
                    append_images=frames[:-1])
    print("  wrote %-22s per-frame profiles" % "favicon.ico (16/32/48)")

    bl, win = variant(blobs, bbox, SVG_PROFILE)
    write_svg("favicon.svg", bl, bg, win)
    print("  wrote %-22s shrink=%.2f fill=%.2f" % ("favicon.svg", *SVG_PROFILE))


if __name__ == "__main__":
    main()
