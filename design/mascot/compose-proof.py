"""Compose labelled raster review sheets from already rendered SVG artwork."""
from pathlib import Path
import json
import sys
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def font(size, body=False):
    filename = "nunito-latin.woff2" if body else "fredoka-latin.woff2"
    face = ImageFont.truetype(str(HERE.parent / "logo-concepts/fonts" / filename), size)
    face.set_variation_by_axes([600])
    return face


def main():
    scratch = Path(sys.argv[1])
    poses = json.loads((ROOT / "src/data/mascot.json").read_text())["poses"]
    proof = Image.new("RGB", (1600, 1610), "#F6F7FA")
    draw = ImageDraw.Draw(proof)
    draw.text((30, 22), "Zubek / twelve moments", font=font(36), fill="#1E2132")
    # The existing Latin-only font subset lacks Ż. The proof's title dot is
    # drawn separately; HTML and SVG accessibility labels use the actual name.
    draw.ellipse((38, 17, 42, 21), fill="#1E2132")
    draw.text((30, 73), "SVG artwork proof, not a browser screenshot / all figures 320px wide", font=font(18, True), fill="#1E2132")
    for index, (pose, entry) in enumerate(poses.items()):
        x, y = (index % 4) * 400, 115 + (index // 4) * 445
        background = ["#FFFFFF", "#F6F7FA", "#D91F3B"][index // 4]
        foreground = "#FFFFFF" if background == "#D91F3B" else "#1E2132"
        draw.rectangle((x + 10, y, x + 390, y + 428), fill=background)
        with Image.open(scratch / f"{pose}.png") as art:
            proof.paste(art, (x + 40, y + 8), art)
        draw.text((x + 35, y + 393), pose.title(), font=font(22), fill=foreground)
    draw.text((30, 1467), "48px-high silhouette check", font=font(18, True), fill="#1E2132")
    for index, pose in enumerate(poses):
        with Image.open(scratch / f"{pose}-48-high.png") as art:
            solid = Image.new("RGBA", art.size, "#1E2132")
            solid.putalpha(art.getchannel("A"))
            # Shadow is included in the original art; kept unchanged in proof.
            proof.paste(solid, (40 + index * 131, 1515), solid)
    proof.save(HERE / "pose-proof.png")
    for name in ["model-sheet", "expressions"]:
        with Image.open(scratch / f"{name}.png") as source:
            source.save(HERE / f"{name}-proof.png")
    for name in ["pose-proof.png", "model-sheet-proof.png", "expressions-proof.png"]:
        with Image.open(HERE / name) as image:
            image.load()
            print(f"Pillow opened {name}: {image.size}")


if __name__ == "__main__":
    main()
