"""
Find clips whose picture does not fill the frame.

Some AI-generated exports come back pillarboxed or letterboxed — the content
sits inside black bars baked into the video. Those read as broken on a poster
wall, so we detect the real picture area with ffmpeg's cropdetect and write it
to lib/crops.json for scripts/build_media.py to crop away on re-encode.

Usage:  python3 scripts/detect_letterbox.py
"""

import json
import os
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.abspath(os.path.join(ROOT, "..", "Property Assets"))
OUT = os.path.join(ROOT, "lib", "crops.json")

VIDEO_RE = re.compile(r"^(?P<portal>.+?) (?P<index>\d+) video_export_ready\.mp4$")
CROP_RE = re.compile(r"crop=(\d+):(\d+):(\d+):(\d+)")

# Ignore a couple of pixels of edge noise; only report real bars.
MIN_BAR_PX = 8


def slugify(portal: str, index: int) -> str:
    return re.sub(r"[^a-z0-9]+", "-", f"{portal} {index}".lower()).strip("-")


def probe_size(path: str) -> tuple[int, int]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", path],
        capture_output=True, text=True,
    ).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)


def detect(job: dict) -> tuple[str, dict] | None:
    slug, path = job["slug"], job["path"]
    width, height = probe_size(path)

    # Sample well past any fade-from-black opening, or every frame reads as bars.
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-ss", "5", "-t", "8", "-i", path,
         "-vf", "cropdetect=limit=24:round=2:reset=0", "-f", "null", "-"],
        capture_output=True, text=True,
    )

    matches = CROP_RE.findall(proc.stderr)
    if not matches:
        return None

    # The last cropdetect line is its settled verdict over the sampled window.
    cw, ch, cx, cy = (int(v) for v in matches[-1])

    bar_x = (width - cw) // 2
    bar_y = (height - ch) // 2
    if bar_x < MIN_BAR_PX and bar_y < MIN_BAR_PX:
        return None

    pct = round(100 * (1 - (cw * ch) / (width * height)), 1)
    print(f"  {slug:<28} {width}x{height} -> {cw}x{ch}+{cx}+{cy}   {pct}% bars")
    return slug, {"w": cw, "h": ch, "x": cx, "y": cy,
                  "src_w": width, "src_h": height, "bars_pct": pct}


def main():
    jobs = []
    for portal in sorted(os.listdir(ASSETS)):
        portal_dir = os.path.join(ASSETS, portal)
        if not os.path.isdir(portal_dir):
            continue
        for entry in sorted(os.listdir(portal_dir)):
            clip_dir = os.path.join(portal_dir, entry)
            if not os.path.isdir(clip_dir):
                continue
            master = next((f for f in os.listdir(clip_dir) if VIDEO_RE.match(f)), None)
            if not master:
                continue
            m = VIDEO_RE.match(master)
            jobs.append({
                "slug": slugify(m.group("portal"), int(m.group("index"))),
                "path": os.path.join(clip_dir, master),
            })

    print(f"scanning {len(jobs)} clips for baked-in black bars\n")

    with ThreadPoolExecutor(max_workers=4) as pool:
        found = dict(r for r in pool.map(detect, jobs) if r)

    with open(OUT, "w") as f:
        json.dump(dict(sorted(found.items())), f, indent=2)

    print(f"\n{len(found)} of {len(jobs)} clips need cropping — wrote {OUT}")
    if found:
        print("now re-run: python3 scripts/build_media.py --force-cropped")


if __name__ == "__main__":
    main()
