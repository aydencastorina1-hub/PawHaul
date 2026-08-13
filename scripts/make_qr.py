"""Generate the PawHaul QR codes for print material.

Run:  python scripts/make_qr.py
Deps: python -m pip install "qrcode[pil]"

Outputs into marketing/ :
  pawhaul-qr.png        2000px, plain navy on white — the safe default
  pawhaul-qr-logo.png   2000px, with the paw badge in the centre
  pawhaul-qr.svg        vector, scales to any print size without blurring

WHY THREE FILES
A QR code carries redundant data so it still scans with part of it obscured.
Error-correction level H tolerates ~30% loss, which is what makes a centre logo
possible at all — but every logo eats into a budget that is also being spent on
print smudging, bad lighting and awkward scan angles. So the logo version is
offered, not forced: use the plain one when the code has to work reliably (a
flyer handed out on the street, a sticker on a lamppost) and the logo one when
it is being scanned in good conditions and brand presence matters.

The SVG has no logo on purpose: it is the file to hand a printer, and a vector
that scales cleanly at any size is worth more there than the badge.

PRINT NOTES
  * Do not print smaller than 2cm x 2cm. Below that, phone cameras struggle.
  * Keep the white "quiet zone" border — the generator adds it (border=4
    modules). Cropping it in is the single most common reason a QR fails.
  * Dark-on-light only. Inverting (light modules on a dark background) breaks
    a lot of scanners, which is why the navy is used for the modules and never
    for the background.
"""

import os

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.svg import SvgPathImage
from PIL import Image, ImageDraw

URL = "https://pawhaul.vercel.app"
NAVY = "#1a1a2e"
ORANGE = "#E8630A"
WHITE = "#FFFFFF"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "marketing")
os.makedirs(OUT_DIR, exist_ok=True)


def build(url=URL):
    # ERROR_CORRECT_H = ~30% recoverable. Required for the logo variant and
    # harmless (just slightly denser) for the others, so all three share it.
    qr = qrcode.QRCode(
        version=None,               # auto-size to the smallest that fits
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,                   # the mandatory quiet zone
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr


def paw_badge(size):
    """The PawHaul paw mark, drawn to match the SVG used across the site
    (one pad plus four toes, same relative geometry)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, size - 1, size - 1], fill=ORANGE)

    s = size / 100.0

    def ell(cx, cy, rx, ry):
        d.ellipse([(cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s], fill=WHITE)

    ell(50, 62, 15, 12)      # main pad
    ell(30, 46, 6.5, 8.5)    # toes
    ell(42, 37, 6.5, 8.5)
    ell(58, 37, 6.5, 8.5)
    ell(70, 46, 6.5, 8.5)
    return img


def main():
    target = 2000

    # ---- plain ----
    qr = build()
    plain = qr.make_image(fill_color=NAVY, back_color=WHITE).convert("RGB")
    plain = plain.resize((target, target), Image.LANCZOS)
    plain_path = os.path.join(OUT_DIR, "pawhaul-qr.png")
    plain.save(plain_path, "PNG")
    print("wrote", plain_path, plain.size)

    # ---- with centre logo ----
    logo_img = plain.copy()
    # 18% of the code's width. Level H tolerates ~30% of the TOTAL modules, and
    # an 18% square is ~3.2% of the area — a wide margin, deliberately: the rest
    # of the budget is left for real-world print and lighting damage.
    badge = int(target * 0.18)
    # White backing ring so the badge never sits directly against dark modules,
    # which is what actually confuses decoders.
    ring = int(badge * 1.18)
    backing = Image.new("RGBA", (ring, ring), (0, 0, 0, 0))
    ImageDraw.Draw(backing).ellipse([0, 0, ring - 1, ring - 1], fill=WHITE)
    logo_img.paste(backing, ((target - ring) // 2, (target - ring) // 2), backing)
    paw = paw_badge(badge)
    logo_img.paste(paw, ((target - badge) // 2, (target - badge) // 2), paw)
    logo_path = os.path.join(OUT_DIR, "pawhaul-qr-logo.png")
    logo_img.save(logo_path, "PNG")
    print("wrote", logo_path, logo_img.size)

    # ---- vector ----
    svg = build().make_image(image_factory=SvgPathImage)
    svg_path = os.path.join(OUT_DIR, "pawhaul-qr.svg")
    svg.save(svg_path)
    # The factory emits black paths; recolour to the brand navy.
    with open(svg_path, "r", encoding="utf-8") as f:
        body = f.read()
    body = body.replace('fill="#000000"', 'fill="%s"' % NAVY).replace('fill:#000000', 'fill:%s' % NAVY)
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(body)
    print("wrote", svg_path)

    print("\nencoded URL:", URL)


if __name__ == "__main__":
    main()
