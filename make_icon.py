"""Generate apple-touch-icon.png (180x180) matching favicon.svg paw print.

Navy background (#1a1a2e), orange paw print (#E8630A) centered.
Paw shape mirrors favicon.svg: 2 top toe circles, 2 side toe circles,
1 large center pad ellipse. Coordinates from the 100x100 SVG viewBox,
scaled 1.8x to fill 180x180. Rendered at 4x then downsampled for
smooth anti-aliased edges.
"""
from PIL import Image, ImageDraw

NAVY = (26, 26, 46)      # #1a1a2e
ORANGE = (232, 99, 10)   # #E8630A

SIZE = 180
SS = 4                   # supersample factor
S = SIZE * SS
SCALE = (SIZE / 100.0) * SS   # SVG (100 viewBox) -> supersampled px

img = Image.new("RGB", (S, S), NAVY)
d = ImageDraw.Draw(img)

def circle(cx, cy, r):
    x, y, rr = cx * SCALE, cy * SCALE, r * SCALE
    d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=ORANGE)

def ellipse(cx, cy, rx, ry):
    x, y, ex, ey = cx * SCALE, cy * SCALE, rx * SCALE, ry * SCALE
    d.ellipse([x - ex, y - ey, x + ex, y + ey], fill=ORANGE)

# Toes (top pair)
circle(35, 30, 8)
circle(65, 30, 8)
# Toes (side pair)
circle(20, 50, 7)
circle(80, 50, 7)
# Center pad
ellipse(50, 68, 22, 18)

img = img.resize((SIZE, SIZE), Image.LANCZOS)
img.save("apple-touch-icon.png", "PNG")
print("Wrote apple-touch-icon.png", img.size)
