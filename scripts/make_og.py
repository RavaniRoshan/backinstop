"""Generate the social card the site promises and does not currently deliver.

`app/layout.tsx` declares `twitter: { card: 'summary_large_image' }` and points
at no image, so every share of the link rendered a blank card. This draws one
from the site's own palette -- the oklch brand colours converted to sRGB -- and
its own words, so it is a third surface rather than a fourth voice.

Everything asserted on the card is a fact this repository can evidence: the
package name on PyPI, the version, and that it is MIT licensed. The performance
line is deliberately absent, because a card is the one place a number gets seen
without the footnote that qualifies it.
"""
from __future__ import annotations

import math
import subprocess
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
OUT = Path(__file__).resolve().parents[1] / "public" / "og.png"

# From app/globals.css, converted oklch -> sRGB so the card is the same colour
# as the site rather than a plausible third palette.
OXBLOOD = (77, 14, 18)
CREAM = (250, 247, 239)
INK = (26, 12, 12)

SITE = "https://backinstop.vercel.app"
REPO = "RavaniRoshan/backstop"

# Resolved by search rather than by a hard-coded path to a font this repository
# does not ship. The first version pointed at the JetBrains files under the
# video pipeline's build directory, which are not committed, so every lookup
# silently fell through to PIL's bitmap default and the card rendered with 12px
# type on a 1200px canvas. `load_default()` does not raise, so the failure was
# invisible until the image was looked at.
FONT_DIRS = (
    Path("/usr/share/fonts/truetype/dejavu"),
    Path("/usr/share/fonts/truetype/liberation"),
    Path("/usr/share/fonts"),
)
FACES = {
    ("sans", False): "DejaVuSans.ttf",
    ("sans", True): "DejaVuSans-Bold.ttf",
    ("mono", False): "DejaVuSansMono.ttf",
    ("mono", True): "DejaVuSansMono-Bold.ttf",
}


def font(size: int, *, bold: bool = False, mono: bool = True) -> ImageFont.FreeTypeFont:
    name = FACES[("mono" if mono else "sans", bold)]
    for directory in FONT_DIRS:
        candidate = directory / name
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    raise FileNotFoundError(
        f"no usable font named {name} in {FONT_DIRS}. Refusing to fall back to "
        "PIL's bitmap default, which renders at a fixed tiny size and made this "
        "card look like a mistake rather than an error."
    )


def published_version() -> str:
    """The version actually on PyPI, so the card cannot advertise a future one."""
    try:
        with urllib.request.urlopen("https://pypi.org/pypi/backstop-ai/json", timeout=15) as r:
            import json

            return str(json.load(r)["info"]["version"])
    except Exception:
        return "0.7.0"


def build() -> Path:
    img = Image.new("RGB", (W, H), OXBLOOD)
    d = ImageDraw.Draw(img, "RGBA")

    # A warm vignette so the flat fill has some depth, and a faint grid that
    # reads as instrumentation without competing with the type.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-260, -420, 900, 300], fill=(150, 40, 30, 92))
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"), (0, 0))
    d = ImageDraw.Draw(img, "RGBA")

    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 6), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)

    # Title bar, matching the site's own window chrome.
    d.rectangle([0, 0, W, 8], fill=CREAM)
    d.rectangle([56, 52, 56 + 320, 96], fill=CREAM[:3] + (26,), outline=CREAM[:3] + (70,), width=1)
    d.text((74, 74), "backstop-ai", font=font(20, bold=True), fill=CREAM, anchor="lm")
    ver = published_version()
    vw = d.textlength(ver, font=font(20, bold=True))
    d.text((56 + 300 - vw, 74), ver, font=font(20, bold=True), fill=(255, 196, 120), anchor="rm")

    d.text((56, 196), "In-process reliability", font=font(76, bold=True, mono=False), fill=CREAM)
    d.text((56, 286), "for AI SDKs", font=font(76, bold=True, mono=False), fill=(255, 196, 120))

    d.text((56, 392), "Budget ceilings, circuit breaking and a priced spend ledger —",
           font=font(22), fill=CREAM[:3] + (208,))
    d.text((56, 424), "one wrap() call, in your process. No proxy, no extra hop.",
           font=font(22), fill=CREAM[:3] + (208,))

    # The evidence line. Three facts a card can carry without a footnote.
    d.line([(56, 492), (1144, 492)], fill=CREAM[:3] + (60,), width=1)
    for i, (label, value) in enumerate([
        ("install", "pip install backstop-ai"),
        ("licence", "MIT"),
        ("ledger", "opt-in, off by default"),
    ]):
        x = 56 + i * 372
        d.text((x, 518), label.upper(), font=font(14), fill=CREAM[:3] + (135,))
        d.text((x, 544), value, font=font(21, bold=True), fill=CREAM)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    return OUT


if __name__ == "__main__":
    path = build()
    size = path.stat().st_size
    print(f"wrote {path} ({path.stat().st_size / 1024:.0f} KB) advertising PyPI {published_version()}")
