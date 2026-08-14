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
HD_PREFIX = "a_dave_architectures_project/preview-hd/"
PROJECT = "icdatinnovation"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB_DIR = os.path.join(ROOT, ".media", "web")
HD_DIR = os.path.join(ROOT, ".media", "preview-hd")
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

    def push(directory: str, prefix: str, key: str):
        """Upload one derivative for every clip, recording its URL under `key`."""
        if not os.path.isdir(directory):
            return

        files = sorted(f for f in os.listdir(directory) if f.endswith(".mp4"))
        todo = [f for f in files if FORCE or key not in record.get(f[:-4], {})]
        print(f"{key}: {len(files)} on disk, {len(todo)} to upload")

        def one(filename: str):
            slug = filename[:-4]
            path = os.path.join(directory, filename)
            token = str(uuid.uuid4())

            blob = bucket.blob(f"{prefix}{filename}")
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
            print(f"  up  {key:<9} {slug:<30} {os.path.getsize(path) / 1e6:>6.1f} MB")
            return slug, url, os.path.getsize(path)

        with ThreadPoolExecutor(max_workers=4) as pool:
            for slug, url, size in pool.map(one, todo):
                entry = record.setdefault(slug, {})
                entry[key] = url
                entry[f"{key}_bytes"] = size

    push(WEB_DIR, PREFIX, "url")
    push(HD_DIR, HD_PREFIX, "previewHd")

    with open(UPLOADS, "w") as f:
        json.dump(dict(sorted(record.items())), f, indent=2)

    total = sum(
        v for e in record.values() for k, v in e.items() if k.endswith("bytes")
    ) / 1e9
    print(f"\nwrote {UPLOADS} — {len(record)} clips, {total:.2f} GB in Storage")
    print("now run: python3 scripts/generate_manifest.py")


if __name__ == "__main__":
    main()
