"""
Upload the web-weight cuts from .media/web/ to Firebase Storage and record their
public download URLs in lib/uploads.json.

The 100-270 MB masters stay where they are — only the ~10-15 MB web cuts go up,
under a separate prefix so the originals in a_dave_architectures_project/ are
left untouched.

Usage:  python3 scripts/upload_media.py [--force]
"""

import json
import os
import sys
import urllib.parse
import uuid
from concurrent.futures import ThreadPoolExecutor

from google.cloud import storage

BUCKET = "icdatinnovation.appspot.com"
PREFIX = "a_dave_architectures_project/web/"
PROJECT = "icdatinnovation"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB_DIR = os.path.join(ROOT, ".media", "web")
UPLOADS = os.path.join(ROOT, "lib", "uploads.json")

FORCE = "--force" in sys.argv


def load_record() -> dict:
    if os.path.exists(UPLOADS):
        try:
            with open(UPLOADS) as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def main():
    if not os.path.isdir(WEB_DIR):
        raise SystemExit(f"nothing to upload — {WEB_DIR} does not exist. "
                         f"Run scripts/build_media.py first.")

    record = load_record()
    client = storage.Client(project=PROJECT)
    bucket = client.bucket(BUCKET)

    files = sorted(f for f in os.listdir(WEB_DIR) if f.endswith(".mp4"))
    todo = [f for f in files if FORCE or f[:-4] not in record]
    print(f"{len(files)} web cuts on disk, {len(todo)} to upload\n")

    def push(filename: str):
        slug = filename[:-4]
        path = os.path.join(WEB_DIR, filename)
        token = str(uuid.uuid4())

        blob = bucket.blob(f"{PREFIX}{filename}")
        blob.content_type = "video/mp4"
        # A year of immutable caching — the slug changes if the cut changes.
        blob.cache_control = "public, max-age=31536000, immutable"
        blob.metadata = {"firebaseStorageDownloadTokens": token}
        blob.upload_from_filename(path, content_type="video/mp4")

        quoted = urllib.parse.quote(blob.name, safe="")
        url = (
            f"https://firebasestorage.googleapis.com/v0/b/{BUCKET}/o/{quoted}"
            f"?alt=media&token={token}"
        )
        mb = os.path.getsize(path) / 1e6
        print(f"  up  {slug:<30} {mb:>6.1f} MB")
        return slug, {"url": url, "bytes": os.path.getsize(path)}

    with ThreadPoolExecutor(max_workers=4) as pool:
        for slug, entry in pool.map(push, todo):
            record[slug] = entry

    with open(UPLOADS, "w") as f:
        json.dump(dict(sorted(record.items())), f, indent=2)

    total = sum(e["bytes"] for e in record.values()) / 1e9
    print(f"\nwrote {UPLOADS} — {len(record)} clips, {total:.2f} GB in Storage")
    print("now run: python3 scripts/generate_manifest.py")


if __name__ == "__main__":
    main()
