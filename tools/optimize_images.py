from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent

IMAGE_FOLDERS = [
    PROJECT_ROOT / "portfolio" / "sapphira" / "assets",
    PROJECT_ROOT / "portfolio" / "dove-farms" / "assets",
]

HTML_FILES = [
    PROJECT_ROOT / "portfolio.html",
    PROJECT_ROOT / "portfolio" / "sapphira" / "index.html",
    PROJECT_ROOT / "portfolio" / "dove-farms" / "index.html",
]

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg"}
WEBP_QUALITY = 82


def convert_images():
    converted = []
    skipped = []
    failed = []

    for folder in IMAGE_FOLDERS:
        if not folder.exists():
            print(f"Folder not found: {folder}")
            continue

        for source in folder.iterdir():
            if source.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue

            destination = source.with_suffix(".webp")

            if destination.exists():
                skipped.append(destination)
                continue

            try:
                with Image.open(source) as image:
                    # Preserve transparency where present.
                    if image.mode not in ("RGB", "RGBA"):
                        image = image.convert(
                            "RGBA" if "transparency" in image.info else "RGB"
                        )

                    image.save(
                        destination,
                        "WEBP",
                        quality=WEBP_QUALITY,
                        method=6,
                    )

                converted.append(destination)

            except Exception as error:
                failed.append((source, error))

    return converted, skipped, failed


def update_html_references():
    updated_files = []

    for html_file in HTML_FILES:
        if not html_file.exists():
            print(f"HTML file not found: {html_file}")
            continue

        original_text = html_file.read_text(encoding="utf-8")
        updated_text = original_text

        for folder in IMAGE_FOLDERS:
            for source in folder.iterdir():
                if source.suffix.lower() not in SUPPORTED_EXTENSIONS:
                    continue

                webp_file = source.with_suffix(".webp")

                if not webp_file.exists():
                    continue

                updated_text = updated_text.replace(
                    source.name,
                    webp_file.name,
                )

        if updated_text != original_text:
            backup_file = html_file.with_suffix(html_file.suffix + ".backup")

            if not backup_file.exists():
                backup_file.write_text(original_text, encoding="utf-8")

            html_file.write_text(updated_text, encoding="utf-8")
            updated_files.append(html_file)

    return updated_files


def main():
    print("\nConverting portfolio images to WebP...\n")

    converted, skipped, failed = convert_images()
    updated_files = update_html_references()

    print(f"Converted: {len(converted)}")
    print(f"Already existed: {len(skipped)}")
    print(f"HTML files updated: {len(updated_files)}")
    print(f"Failed: {len(failed)}")

    if updated_files:
        print("\nUpdated HTML files:")
        for file in updated_files:
            print(f"  - {file.relative_to(PROJECT_ROOT)}")

    if failed:
        print("\nConversion errors:")
        for source, error in failed:
            print(f"  - {source}: {error}")

    print("\nOriginal PNG and JPG files were preserved.")
    print("HTML backups use the extension .html.backup.\n")


if __name__ == "__main__":
    main()