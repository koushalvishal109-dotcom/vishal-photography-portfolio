#!/usr/bin/env python3
"""Generate optimized WebP archive thumbnails and verify image dimensions."""

from pathlib import Path
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PHOTO_DATA = ROOT / "photos.js"
THUMB_DIR = ROOT / "thumbnails"
MAX_SIDE = 960
QUALITY = 72

text = PHOTO_DATA.read_text(encoding="utf-8")
source_pattern = re.compile(
    r'src:"([^"]+\\.webp)"(?:,thumb:"[^"]+",width:\\d+,height:\\d+)?'
)
sources = source_pattern.findall(text)
if len(sources) != 30:
    raise SystemExit(f"Expected 30 photo records, found {len(sources)}")

dimensions = {}
for raw_path in sources:
    filename = Path(raw_path).name
    source = ROOT / filename
    if not source.is_file():
        source = ROOT / raw_path
    if not source.is_file():
        raise SystemExit(f"Missing original photograph: {raw_path}")

    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        width, height = image.size
        dimensions[filename] = (width, height)
        image.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        destination = THUMB_DIR / filename
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "WEBP", quality=QUALITY, method=6)

def add_photo_fields(match):
    filename = Path(match.group(1)).name
    width, height = dimensions[filename]
    return (
        f'src:"{filename}",thumb:"thumbnails/{filename}",'
        f'width:{width},height:{height}'
    )

text = source_pattern.sub(add_photo_fields, text)

def add_collection_thumb(match):
    filename = Path(match.group(1)).name
    return f'cover:"{filename}",thumb:"thumbnails/{filename}"'

text = re.sub(
    r'cover:"([^"]+\\.webp)"(?:,thumb:"[^"]+")?',
    add_collection_thumb,
    text
)
PHOTO_DATA.write_text(text, encoding="utf-8")
print(f"Generated {len(dimensions)} optimized thumbnails.")
