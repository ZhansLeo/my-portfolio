import json
import os
import sys

PROJECT_ROOT = os.path.join(os.path.dirname(__file__), "..")
PAPERS_IN = os.path.join(PROJECT_ROOT, "content", "digest", "papers.json")
WIKI_IN = os.path.join(PROJECT_ROOT, "content", "digest", "wiki.json")
OUT_FILE = os.path.join(PROJECT_ROOT, "public", "data", "digest.json")
OUT_DIR = os.path.dirname(OUT_FILE)


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate():
    papers = load_json(PAPERS_IN)
    wiki = load_json(WIKI_IN)

    errors = []
    for i, p in enumerate(papers):
        for field in ["title", "url", "published", "note"]:
            if field not in p or not p[field]:
                errors.append(f"papers[{i}] missing {field}")
        if "note" in p and len(p["note"]) > 200:
            errors.append(f"papers[{i}] note too long ({len(p['note'])} chars)")

    for i, w in enumerate(wiki):
        for field in ["title", "url", "note"]:
            if field not in w or not w[field]:
                errors.append(f"wiki[{i}] missing {field}")
        if "note" in w and len(w["note"]) > 200:
            errors.append(f"wiki[{i}] note too long ({len(w['note'])} chars)")

    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)

    ts = __import__("datetime").datetime.now().isoformat()
    result = {
        "papers": papers,
        "wiki": wiki,
        "generated": ts,
    }
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Papers: {len(papers)}")
    print(f"Wiki concepts: {len(wiki)}")
    print(f"Saved: {OUT_FILE}")


if __name__ == "__main__":
    validate()