import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

ARXIV_API = "http://export.arxiv.org/api/query"
PAPERS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "public", "data", "papers.json")

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "arxiv": "http://arxiv.org/schemas/atom",
}


def load_existing():
    if os.path.exists(PAPERS_FILE):
        with open(PAPERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_papers(papers):
    os.makedirs(os.path.dirname(PAPERS_FILE), exist_ok=True)
    with open(PAPERS_FILE, "w", encoding="utf-8") as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)


def fetch_arxiv(query, max_results):
    params = {
        "search_query": query,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }
    url = ARXIV_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "ResearchPaperCollector/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def parse_entry(entry):
    def get_text(tag):
        el = entry.find(f"atom:{tag}", NS)
        return el.text.strip() if el is not None and el.text else ""

    def get_authors():
        authors = []
        for author in entry.findall("atom:author", NS):
            name = author.find("atom:name", NS)
            if name is not None and name.text:
                authors.append(name.text.strip())
        return authors

    arxiv_id = get_text("id")
    # Extract pure ID from URL
    arxiv_id = arxiv_id.split("/abs/")[-1] if "/abs/" in arxiv_id else arxiv_id

    return {
        "id": arxiv_id,
        "title": get_text("title").replace("\n", " ").strip(),
        "authors": get_authors(),
        "published": get_text("published")[:10],
        "summary": get_text("summary").replace("\n", " ").strip(),
        "url": f"https://arxiv.org/abs/{arxiv_id}",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", required=True)
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    existing = load_existing()
    existing_ids = {p["id"] for p in existing}

    print(f"Query: {args.query}")
    print(f"Limit: {args.limit}")

    try:
        xml = fetch_arxiv(args.query, args.limit)
    except Exception as e:
        print(f"Fetch error: {e}", file=sys.stderr)
        print("No new papers saved due to network error.")
        return

    root = ET.fromstring(xml)
    entries = root.findall("atom:entry", NS)
    fetched = len(entries)
    print(f"Fetched: {fetched}")

    new_papers = []
    for entry in entries:
        paper = parse_entry(entry)
        if paper["id"] not in existing_ids:
            new_papers.append(paper)
            existing_ids.add(paper["id"])

    if new_papers:
        existing = new_papers + existing
        save_papers(existing)
        print(f"Saved: {len(new_papers)} new, {len(existing)} total")
    else:
        print(f"Saved: 0 new (no new papers), {len(existing)} total")

    print(f"File: {PAPERS_FILE}")


if __name__ == "__main__":
    main()