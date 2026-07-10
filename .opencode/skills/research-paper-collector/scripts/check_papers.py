import json
import os
import sys

PAPERS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "public", "data", "papers.json")

REQUIRED_FIELDS = ["id", "title", "authors", "published", "summary", "url"]


def main():
    if not os.path.exists(PAPERS_FILE):
        print(f"MISSING: {PAPERS_FILE} not found")
        sys.exit(1)

    with open(PAPERS_FILE, "r", encoding="utf-8") as f:
        papers = json.load(f)

    errors = 0
    seen_ids = set()

    for i, paper in enumerate(papers):
        for field in REQUIRED_FIELDS:
            if field not in paper or not paper[field]:
                print(f"FAIL  [{i}] missing field: {field}")
                errors += 1

        if "id" in paper and paper["id"]:
            if paper["id"] in seen_ids:
                print(f"FAIL  [{i}] duplicate id: {paper['id']}")
                errors += 1
            seen_ids.add(paper["id"])

        if "url" in paper and paper["url"]:
            if not paper["url"].startswith("https://arxiv.org/abs/"):
                print(f"FAIL  [{i}] invalid url: {paper['url']}")
                errors += 1

    if errors == 0:
        print(f"PASS  {len(papers)} paper(s), all valid")
    else:
        print(f"Result: {errors} error(s) in {len(papers)} paper(s)")

    sys.exit(0 if errors == 0 else 1)


if __name__ == "__main__":
    main()