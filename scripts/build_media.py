"""
Build every web asset from the local masters in ../Property Assets.

The masters are 27 Mbps 1440p exports, 100-270 MB each. Nothing that heavy goes
near a browser. For each clip this produces four things:

  posters/<slug>.jpg     ~110 KB  layout + first paint
  preview/<slug>.mp4     ~0.3 MB  480p silent loop, what grids autoplay
  preview-hd/<slug>.mp4  ~1.7 MB  720p loop for frames shown large (the hero)
  web/<slug>.mp4         ~8-14 MB full film, only fetched when someone opens it

It also reads the saved listing page in each folder — the filename is the real
estate ad's own title — and turns it into the property name and location shown
on the site, so nothing on the portfolio is invented.

Usage:
    python3 scripts/build_media.py            # everything, skipping existing
    python3 scripts/build_media.py --posters  # posters + captions only (fast)
    python3 scripts/build_media.py --force
"""

import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.abspath(os.path.join(ROOT, "..", "Property Assets"))
POSTER_DIR = os.path.join(ROOT, "public", "posters")
DERIV_DIR = os.path.join(ROOT, ".media")  # git-ignored staging, uploaded separately
PREVIEW_DIR = os.path.join(DERIV_DIR, "preview")
PREVIEW_HD_DIR = os.path.join(DERIV_DIR, "preview-hd")
WEB_DIR = os.path.join(DERIV_DIR, "web")
CAPTIONS = os.path.join(ROOT, "lib", "captions.json")
OVERRIDES = os.path.join(ROOT, "lib", "captions.overrides.json")
CROPS = os.path.join(ROOT, "lib", "crops.json")

FORCE = "--force" in sys.argv
POSTERS_ONLY = "--posters" in sys.argv
CAPTIONS_ONLY = "--captions" in sys.argv
# Rebuild only the clips that have black bars to crop away.
ONLY_CROPPED = "--only-cropped" in sys.argv
# Only (re)build the HD hero previews.
HD_ONLY = "--hd-only" in sys.argv

PREVIEW_START = 4.0   # skip the burned-in title card
PREVIEW_LEN = 10.0

VIDEO_RE = re.compile(r"^(?P<portal>.+?) (?P<index>\d+) video_export_ready\.mp4$")


# --------------------------------------------------------------------------
# Listing titles
# --------------------------------------------------------------------------

# Order matters: the longest forms have to match before their own prefixes do,
# otherwise "T3C 2C8" loses its first half to the UK outward-code pattern.
POSTCODE_RE = re.compile(
    r"\b("
    r"[A-Z]\d[A-Z]\s*\d[A-Z]\d"                # Canada, T3C 2C8
    r"|[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}"      # UK full, SW1X 8AA
    r"|[A-Z]{1,2}\d[A-Z\d]?"                   # UK outward, CF14
    r"|\d{5}(-\d{4})?"                          # US zip
    r")\b"
)

# Used only to put a comma in front of a trailing state code — "Kyle TX".
STATE_CODES = (
    "NSW VIC QLD WA SA TAS ACT NT "
    "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO "
    "MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WV WI WY DC "
    "AB BC MB NB NL NS ON PE QC SK"
).split()


def clean(text: str) -> str:
    text = text.replace("_", " ").replace("–", "-")
    return re.sub(r"\s+", " ", text).strip(" -,·")


def polish(text: str) -> str:
    """Tidy the raw ad copy into something that reads on a portfolio card."""
    if not text:
        return text

    text = POSTCODE_RE.sub("", text)
    text = re.sub(r"\bCities In\b", "", text, flags=re.I)

    # Listings write "Toorak VIC" and "Kyle TX" — the comma reads better.
    def comma_state(m: re.Match) -> str:
        code = m.group(1).upper()
        return f", {code}" if code in STATE_CODES else m.group(0)

    text = re.sub(r"(?<=[a-z])\s+([A-Za-z]{2,3})\b", comma_state, text)
    # And normalise a state that already had its comma ("Brisbane City, Qld").
    text = re.sub(
        r"(?<=,\s)([A-Za-z]{2,3})\b",
        lambda m: m.group(1).upper() if m.group(1).upper() in STATE_CODES else m.group(1),
        text,
    )

    # Unit numbers get duplicated by the export ("Unit 14C 14C").
    text = re.sub(r"\b(\w+)( \1\b)+", r"\1", text)

    # Collapse the debris left by the substitutions above.
    text = re.sub(r"\s*,\s*", ", ", text)
    text = re.sub(r"(,\s*)+", ", ", text)
    text = re.sub(r"\s{2,}", " ", text)
    text = text.strip(" ,-·")

    # SHOUTY ad headlines get sentence case; leave normal casing alone.
    letters = [c for c in text if c.isalpha()]
    if letters and sum(c.isupper() for c in letters) / len(letters) > 0.7:
        text = text.title()

    # Dedupe "Anguilla, Anguilla" style repeats.
    parts = [p.strip() for p in text.split(",") if p.strip()]
    seen, unique = set(), []
    for p in parts:
        if p.lower() not in seen:
            seen.add(p.lower())
            unique.append(p)

    return ", ".join(unique)


def address_parts(text: str) -> list[str]:
    """Comma-split an address, dropping segments that are only a postcode."""
    parts = []
    for raw in text.split(","):
        part = clean(raw)
        if not part:
            continue
        if not POSTCODE_RE.sub("", part).strip(" ,-"):
            continue
        parts.append(part)
    return parts


def split_address(text: str) -> tuple[str, str]:
    """'970 Powder Lane, Aspen, CO' -> ('970 Powder Lane', 'Aspen, CO')"""
    parts = [p.strip() for p in text.split(",") if p.strip()]
    if len(parts) <= 1:
        return clean(text), ""
    return clean(parts[0]), clean(", ".join(parts[1:3]))


def parse_listing(portal: str, name: str) -> dict:
    """Turn a saved-listing filename into {title, location}."""
    n = name

    if portal.startswith("zillow"):
        n = re.split(r"\s*_\s*(MLS|Zillow)", n)[0]
        if " in " in n and not n[0].isdigit():          # "Paramount by D.R. Horton in Kyle TX"
            title, _, place = n.partition(" in ")
            return {"title": clean(title), "location": clean(place)}
        title, loc = split_address(n)
        return {"title": title, "location": loc}

    if portal.startswith("christiesrealestate"):
        n = re.split(r"\s+with ID\b", n)[0]
        n = n.replace(", United States of America", ", USA")
        title, loc = split_address(n)
        return {"title": title, "location": loc}

    if portal.startswith("coldwellbankerluxury"):
        n = n.split(" _ ")[0]
        n = re.sub(r"\s+United States$", "", n)
        n = re.sub(r"\s+\d{5}$", "", n)
        title, loc = split_address(n)
        return {"title": title, "location": loc}

    if portal.startswith("mansionglobal"):
        n = n.split(" - ")[0]
        n = n.replace(", USA,", ",")
        title, loc = split_address(n)
        return {"title": title, "location": loc}

    if portal.startswith("domain") or portal.startswith("realestate.com.au"):
        n = re.split(r"\s+[-_]\s+(Apartment|House|Townhouse|Domain)", n)[0]
        n = n.split(" _ Domain")[0]
        n = re.sub(r"\b\d{4}$", "", n).strip(" ,")
        # unit prefixes come through as "2910_135 A'Beckett Street"
        n = re.sub(r"^[\w\d]+_", "", n)
        title, loc = split_address(n)
        return {"title": title, "location": loc}

    if portal.startswith("rightmove"):
        m = re.match(r"^(?P<beds>\d+) bedroom (?P<kind>[\w\- ]+?) for sale in (?P<addr>.+)$", n)
        if m:
            parts = address_parts(m.group("addr"))
            return {
                "title": clean(", ".join(parts[:2])),
                "location": clean(", ".join(parts[2:4])) or clean(parts[-1] if parts else ""),
                "note": f"{m.group('beds')} bed {m.group('kind').strip()}",
            }
        title, loc = split_address(n)
        return {"title": title, "location": loc}

    if portal.startswith("savills"):
        parts = address_parts(n.split(" _ ")[0])
        return {
            "title": clean(", ".join(parts[:2])),
            "location": clean(", ".join(parts[2:4])) or clean(parts[-1] if parts else ""),
        }

    if portal.startswith("sothebysrealty"):
        n = re.split(r"\s*[-–]\s*Luxury Home", n)[0]
        n = re.sub(r"^\d+[\s_]+(?=\d)", "", n)  # drop the leading unit number
        parts = address_parts(n)
        return {
            "title": clean(parts[0]) if parts else "",
            "location": clean(", ".join(parts[-2:])) if len(parts) > 1 else "",
        }

    if portal.startswith("pamgolding"):
        parts = [p.strip() for p in n.split(" _ ")]
        kind = clean(parts[0]).replace(" for Sale", "")
        place = clean(parts[1]) if len(parts) > 1 else ""
        return {"title": place or kind, "location": "South Africa", "note": kind}

    if portal.startswith("nigeriapropertycentre"):
        n = re.split(r"\s*_\s*\d+ Beds", n)[0]
        n = re.sub(r"^For (Rent|Sale)_\s*", "", n)
        parts = [p.strip() for p in n.split(",")]
        return {
            "title": clean(parts[0]),
            "location": clean(", ".join(parts[1:3])) if len(parts) > 1 else "Nigeria",
        }

    if portal.startswith("propertyfinder"):
        n = n.split(" _ Property Finder")[0]
        n = re.sub(r"^Rent in\s*", "", n)
        parts = [p.strip() for p in re.split(r"[_:]", n) if p.strip()]
        return {
            "title": clean(parts[0]),
            "location": "United Arab Emirates",
            "note": clean(" · ".join(parts[1:3])) if len(parts) > 1 else None,
        }

    if portal.startswith("bayut"):
        n = n.split(" _ Bayut")[0]
        parts = [clean(p) for p in n.split("_") if clean(p)]
        return {
            "title": clean(" · ".join(parts[:2])),
            "location": "United Arab Emirates",
        }

    title, loc = split_address(n)
    return {"title": title, "location": loc}


def listing_name(folder: str) -> str | None:
    """The saved listing page/PDF in a clip folder, whose filename is the ad title."""
    best = None
    for entry in sorted(os.listdir(folder)):
        stem, ext = os.path.splitext(entry)
        if ext.lower() in (".html", ".pdf") and not entry.startswith("."):
            if ext.lower() == ".html":
                return stem
            best = best or stem
    return best


# --------------------------------------------------------------------------
# Encoding
# --------------------------------------------------------------------------

def slugify(portal: str, index: int) -> str:
    return re.sub(r"[^a-z0-9]+", "-", f"{portal} {index}".lower()).strip("-")


def run(cmd: list[str]) -> bool:
    return subprocess.run(cmd, capture_output=True).returncode == 0


def fit(crop: dict | None, w: int, h: int) -> str:
    """
    Filter chain that lands on exactly w×h with no black edges.

    Any bars found by detect_letterbox.py are cropped off first, then the
    picture is scaled to *cover* the target box and centre-cropped — so a source
    whose aspect shifted slightly after de-barring still fills the frame.
    """
    chain = []
    if crop:
        chain.append(f"crop={crop['w']}:{crop['h']}:{crop['x']}:{crop['y']}")
    chain.append(f"scale={w}:{h}:force_original_aspect_ratio=increase")
    chain.append(f"crop={w}:{h}")
    return ",".join(chain)


def build(job: dict) -> dict | None:
    slug, src, index = job["slug"], job["src"], job["index"]
    portrait = index >= 3
    crop = job.get("crop")

    poster = os.path.join(POSTER_DIR, f"{slug}.jpg")
    preview = os.path.join(PREVIEW_DIR, f"{slug}.mp4")
    preview_hd = os.path.join(PREVIEW_HD_DIR, f"{slug}.mp4")
    web = os.path.join(WEB_DIR, f"{slug}.mp4")

    poster_scale = fit(crop, 720, 1280) if portrait else fit(crop, 1280, 720)
    preview_scale = fit(crop, 480, 854) if portrait else fit(crop, 854, 480)
    hd_scale = fit(crop, 720, 1280) if portrait else fit(crop, 1280, 720)
    web_scale = fit(crop, 720, 1280) if portrait else fit(crop, 1280, 720)

    # The hero blows a frame up to ~870px wide on hover, where the 480px grid
    # preview upscales 1.8x and turns to mush. This one is native size there.
    if HD_ONLY or FORCE or not os.path.exists(preview_hd):
        run([
            "ffmpeg", "-y", "-v", "error",
            "-ss", str(PREVIEW_START), "-t", str(PREVIEW_LEN), "-i", src,
            "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "25",
            "-maxrate", "2600k", "-bufsize", "5200k",
            "-vf", f"{hd_scale},fps=25",
            "-pix_fmt", "yuv420p", "-profile:v", "high",
            "-movflags", "+faststart", preview_hd,
        ])

    if HD_ONLY:
        kb = os.path.getsize(preview_hd) // 1024 if os.path.exists(preview_hd) else 0
        print(f"  {slug:<28} hd {kb:>5}K")
        return {"slug": slug, "hd": kb}

    if FORCE or not os.path.exists(poster):
        # Let ffmpeg choose the most representative frame of the window rather
        # than a fixed timestamp — fixed stamps land mid-pan and come out smeared.
        run([
            "ffmpeg", "-y", "-v", "error", "-ss", str(PREVIEW_START), "-t", "6", "-i", src,
            "-vf", f"thumbnail=n=120,{poster_scale}",
            "-frames:v", "1", "-q:v", "4", poster,
        ])

    if not POSTERS_ONLY:
        if FORCE or not os.path.exists(preview):
            run([
                "ffmpeg", "-y", "-v", "error",
                "-ss", str(PREVIEW_START), "-t", str(PREVIEW_LEN), "-i", src,
                "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "31",
                "-maxrate", "700k", "-bufsize", "1400k",
                "-vf", f"{preview_scale},fps=24",
                "-pix_fmt", "yuv420p", "-profile:v", "main",
                "-movflags", "+faststart", preview,
            ])

        if FORCE or not os.path.exists(web):
            run([
                "ffmpeg", "-y", "-v", "error", "-i", src,
                "-c:v", "libx264", "-preset", "fast", "-crf", "25",
                "-maxrate", "2400k", "-bufsize", "4800k",
                "-vf", f"{web_scale}",
                "-pix_fmt", "yuv420p", "-profile:v", "high",
                "-c:a", "aac", "-b:a", "96k",
                "-movflags", "+faststart", web,
            ])

    sizes = {
        "poster": os.path.getsize(poster) // 1024 if os.path.exists(poster) else 0,
        "preview": os.path.getsize(preview) // 1024 if os.path.exists(preview) else 0,
        "web": os.path.getsize(web) // 1024 if os.path.exists(web) else 0,
    }
    print(f"  {slug:<28} poster {sizes['poster']:>4}K  preview {sizes['preview']:>5}K  web {sizes['web']:>6}K")
    return {"slug": slug, **sizes}


def main():
    for d in (POSTER_DIR, PREVIEW_DIR, PREVIEW_HD_DIR, WEB_DIR):
        os.makedirs(d, exist_ok=True)

    overrides = {}
    if os.path.exists(OVERRIDES):
        with open(OVERRIDES) as f:
            overrides = {k: v for k, v in json.load(f).items() if not k.startswith("_")}

    crops = {}
    if os.path.exists(CROPS):
        with open(CROPS) as f:
            crops = json.load(f)

    jobs, captions = [], {}

    for portal in sorted(os.listdir(ASSETS)):
        portal_dir = os.path.join(ASSETS, portal)
        if not os.path.isdir(portal_dir):
            continue

        for entry in sorted(os.listdir(portal_dir)):
            clip_dir = os.path.join(portal_dir, entry)
            if not os.path.isdir(clip_dir):
                continue

            master = next(
                (f for f in os.listdir(clip_dir) if VIDEO_RE.match(f)), None
            )
            if not master:
                print(f"  WARN  no master export in {portal}/{entry}")
                continue

            m = VIDEO_RE.match(master)
            index = int(m.group("index"))
            slug = slugify(m.group("portal"), index)

            name = listing_name(clip_dir)
            if name:
                parsed = parse_listing(portal, name)
                parsed = {k: polish(v) for k, v in parsed.items() if v}
                # Hand-checked values win over whatever the filename parser guessed.
                parsed.update(overrides.get(slug, {}))
                captions[slug] = {k: v for k, v in parsed.items() if v}
            else:
                print(f"  WARN  no saved listing page in {portal}/{entry}")

            jobs.append({
                "slug": slug,
                "index": index,
                "src": os.path.join(clip_dir, master),
                "crop": crops.get(slug),
            })

    if ONLY_CROPPED:
        jobs = [j for j in jobs if j["crop"]]

    with open(CAPTIONS, "w") as f:
        json.dump(dict(sorted(captions.items())), f, indent=2, ensure_ascii=False)
    print(f"wrote {CAPTIONS} — {len(captions)} listings\n")
    if CAPTIONS_ONLY:
        for slug, cap in sorted(captions.items()):
            print(f"  {slug:<30} {cap.get('title', '?')!r:<46} {cap.get('location', '')!r}")
        return

    print(f"{len(jobs)} clips to process\n")

    workers = 2 if not POSTERS_ONLY else 4
    with ThreadPoolExecutor(max_workers=workers) as pool:
        list(pool.map(build, jobs))

    print("\ndone")


if __name__ == "__main__":
    main()
