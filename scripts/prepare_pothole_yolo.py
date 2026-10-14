from pathlib import Path
import shutil

ROOT = Path(r"E:\AI-PAVE")
RAW = ROOT / "datasets" / "raw" / "RDD_SPLIT"
OUT = ROOT / "datasets"

# RDD2022 YOLO mapping:
# 0=D00, 1=D10, 2=D20, 3=D40(pothole), 4=other
POTHOLE_CLASS = "3"

image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

total_images = 0
pothole_images = 0
pothole_boxes = 0

for split in ("train", "val", "test"):
    src_images = RAW / split / "images"
    src_labels = RAW / split / "labels"

    dst_images = OUT / split / "images"
    dst_labels = OUT / split / "labels"

    dst_images.mkdir(parents=True, exist_ok=True)
    dst_labels.mkdir(parents=True, exist_ok=True)

    for image in src_images.iterdir():
        if not image.is_file() or image.suffix.lower() not in image_exts:
            continue

        total_images += 1

        label_src = src_labels / f"{image.stem}.txt"
        pothole_lines = []

        if label_src.exists():
            for line in label_src.read_text(encoding="utf-8").splitlines():
                parts = line.strip().split()

                if len(parts) != 5:
                    continue

                if parts[0] == POTHOLE_CLASS:
                    # Convert RDD class 3 (D40) -> our class 0 (pothole)
                    pothole_lines.append("0 " + " ".join(parts[1:]))
                    pothole_boxes += 1

        # Copy image
        shutil.copy2(image, dst_images / image.name)

        # Always create a label file.
        # Empty label = valid background/negative image.
        (dst_labels / f"{image.stem}.txt").write_text(
            "\n".join(pothole_lines) + ("\n" if pothole_lines else ""),
            encoding="utf-8"
        )

        if pothole_lines:
            pothole_images += 1

print()
print("====================================")
print("AI-PAVE POTHOLE DATASET PREPARED")
print("====================================")
print(f"Total images : {total_images}")
print(f"Pothole images: {pothole_images}")
print(f"Pothole boxes : {pothole_boxes}")
print()
for split in ("train", "val", "test"):
    ni = len(list((OUT / split / "images").glob("*")))
    nl = len(list((OUT / split / "labels").glob("*.txt")))
    print(f"{split:5s}: {ni} images, {nl} labels")
