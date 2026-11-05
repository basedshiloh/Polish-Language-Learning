"""Assemble exact-size ICO frames, typeset OG artwork, and validate raster assets."""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]


def font(name, size, weight):
    face = ImageFont.truetype(
        str(ROOT / f"design/logo-concepts/fonts/{name}-latin.woff2"), size
    )
    face.set_variation_by_axes([weight])
    return face


def main():
    scratch = Path(sys.argv[1])
    frames = []
    for size in [16, 32, 48]:
        with Image.open(scratch / f"favicon-{size}.png") as image:
            image.load()
            assert image.size == (size, size)
            frames.append(image.convert("RGBA"))
    # append_images preserves each independently rendered native-size frame.
    frames[-1].save(
        ROOT / "src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=frames[:-1],
    )

    # Keep the original OG composition: mark at left, wordmark + tagline + URL
    # at right. Flat crimson and a thicker bottom edge match the selected brand.
    og = Image.new("RGB", (1200, 630), "#D91F3B")
    with Image.open(scratch / "og-mark.png") as mark:
        og.paste(mark, (-16, 50), mark)
    draw = ImageDraw.Draw(og)
    draw.text((430, 195), "PolishPal", font=font("fredoka", 96, 600), fill="white")
    draw.text((434, 320), "Learn Polish free", font=font("nunito", 46, 700), fill="white")
    draw.text((434, 390), "polishpal.pl", font=font("nunito", 32, 600), fill="white")
    draw.rectangle((0, 614, 1199, 629), fill="#A3142B")
    og.save(ROOT / "public/og-image.png")

    # Artifact review sheet; explicitly distinct from application screenshots.
    proof = Image.new("RGB", (1100, 850), "#FAF7F2")
    review = ImageDraw.Draw(proof)
    review.text((34, 24), "Hello bloom / final assets", font=font("fredoka", 32, 600), fill="#1E2132")
    review.text((34, 72), "Raster proof — browser screenshots remain a separate check", font=font("nunito", 17, 600), fill="#1E2132")
    review.text((34, 126), "Favicon / native size", font=font("nunito", 18, 700), fill="#1E2132")
    for frame, x in zip(frames, [290, 390, 490]):
        proof.paste(frame, (x, 126), frame)
        review.text((x, 185), str(frame.width) + "px", font=font("nunito", 15, 600), fill="#1E2132")
    # Same transparent geometry, primary and reverse, on the three brand grounds.
    with Image.open(scratch / "og-mark.png") as source:
        white = source.convert("RGBA").resize((180, 180), Image.Resampling.LANCZOS)
    crimson = Image.new("RGBA", white.size, "#D91F3B")
    crimson.putalpha(white.getchannel("A"))
    for x, color, mark, label in [
        (34, "#FFFFFF", crimson, "White / primary"),
        (390, "#D91F3B", white, "Crimson / reverse"),
        (746, "#1E2132", white, "Ink / reverse"),
    ]:
        review.rectangle((x, 240, x + 320, 455), fill=color)
        proof.paste(mark, (x + 70, 255), mark)
        review.text((x, 471), label, font=font("nunito", 17, 700), fill="#1E2132")
    review.text((34, 530), "192px app icon / circle crop / 180px Apple icon", font=font("nunito", 20, 700), fill="#1E2132")
    with Image.open(ROOT / "public/icon-192.png") as app:
        proof.paste(app, (34, 586))
        circle = Image.new("L", app.size)
        ImageDraw.Draw(circle).ellipse((0, 0, 191, 191), fill=255)
        proof.paste(app, (390, 586), circle)
    with Image.open(ROOT / "public/apple-touch-icon.png") as apple:
        proof.paste(apple, (746, 586))
    proof.save(ROOT / "design/logo-concepts/chosen/asset-proof.png")

    expected = {
        "public/icon-192.png": (192, 192),
        "public/icon-512.png": (512, 512),
        "public/apple-touch-icon.png": (180, 180),
        "public/og-image.png": (1200, 630),
        "design/logo-concepts/chosen/asset-proof.png": (1100, 850),
    }
    for path, size in expected.items():
        with Image.open(ROOT / path) as image:
            image.load()
            assert image.size == size, (path, image.size)
            if "A" in image.getbands():
                assert image.getchannel("A").getextrema() == (255, 255), path
            print(f"Pillow validated {path}: {size}")
    with Image.open(ROOT / "src/app/favicon.ico") as icon:
        assert icon.ico.sizes() == {(16, 16), (32, 32), (48, 48)}
        for size in icon.ico.sizes():
            frame = icon.ico.getimage(size)
            frame.load()
            assert frame.size == size
        print("Pillow validated favicon.ico: 16, 32, 48px")


if __name__ == "__main__":
    main()
