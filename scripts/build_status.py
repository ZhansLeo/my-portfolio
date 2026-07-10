import json
import os
import re
import uuid
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))

PROJECT_ROOT = os.path.join(os.path.dirname(__file__), "..")
STATUS_FILE = os.path.join(PROJECT_ROOT, "public", "data", "status.json")
PAPERS_FILE = os.path.join(PROJECT_ROOT, "public", "data", "papers.json")
CONTENT_POSTS = os.path.join(PROJECT_ROOT, "content", "posts")
CONTENT_WIKI = os.path.join(PROJECT_ROOT, "content", "wiki")
OUT_DIR = os.path.join(PROJECT_ROOT, "out")

SENSITIVE_PATTERNS = [
    (re.compile(r'(?i)(secret|token|key|password|auth|credential|api[-_]?key)\s*[:=]\s*\S+'), r'\1=***'),
    (re.compile(r'https://hooks\.(slack|discord)\.com/\S+'), '***webhook***'),
    (re.compile(r'https://qyapi\.weixin\.qq\.com/\S+'), '***webhook***'),
    (re.compile(r'open\.feishu\.cn/\S+'), '***webhook***'),
    (re.compile(r'[\w.+-]+@[\w-]+\.[\w.-]+'), '***email***'),
]


def sanitize_log(message):
    if not isinstance(message, str):
        return str(message)
    for pattern, replacement in SENSITIVE_PATTERNS:
        message = pattern.sub(replacement, message)
    return message


def count_blog_posts():
    if not os.path.isdir(CONTENT_POSTS):
        return 0
    return len([f for f in os.listdir(CONTENT_POSTS) if f.endswith(".md")])


def count_wiki_pages():
    if not os.path.isdir(CONTENT_WIKI):
        return 0
    return len([f for f in os.listdir(CONTENT_WIKI) if f.endswith(".md") and f != "README.md"])


def count_papers():
    if not os.path.isfile(PAPERS_FILE):
        return 0
    try:
        with open(PAPERS_FILE, "r", encoding="utf-8") as f:
            return len(json.load(f))
    except Exception:
        return 0


def count_pages():
    if not os.path.isdir(OUT_DIR):
        return 0
    return len([f for f in os.listdir(OUT_DIR) if f.endswith(".html")])


def generate_run_id():
    ts = datetime.now(CST).strftime("%Y%m%d-%H%M%S")
    short = uuid.uuid4().hex[:6]
    return f"{ts}-{short}"


def load_existing():
    if os.path.isfile(STATUS_FILE):
        with open(STATUS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"history": []}


def main():
    errors = []
    run_id = generate_run_id()
    timestamp = datetime.now(CST).isoformat()

    try:
        blog_count = count_blog_posts()
    except Exception as e:
        blog_count = 0
        errors.append(sanitize_log(f"blog count failed: {e}"))

    try:
        wiki_count = count_wiki_pages()
    except Exception as e:
        wiki_count = 0
        errors.append(sanitize_log(f"wiki count failed: {e}"))

    try:
        paper_count = count_papers()
    except Exception as e:
        paper_count = 0
        errors.append(sanitize_log(f"paper count failed: {e}"))

    try:
        page_count = count_pages()
    except Exception as e:
        page_count = 0
        errors.append(sanitize_log(f"page count failed: {e}"))

    entry = {
        "run_id": run_id,
        "timestamp": timestamp,
        "counts": {
            "blog_posts": blog_count,
            "wiki_pages": wiki_count,
            "papers": paper_count,
            "pages": page_count,
        },
        "errors": errors,
    }

    existing = load_existing()
    existing["history"].insert(0, entry)
    if len(existing["history"]) > 50:
        existing["history"] = existing["history"][:50]

    os.makedirs(os.path.dirname(STATUS_FILE), exist_ok=True)
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"run_id: {run_id}")
    print(f"blog_posts: {blog_count}")
    print(f"wiki_pages: {wiki_count}")
    print(f"papers: {paper_count}")
    print(f"pages: {page_count}")
    if errors:
        print(f"errors: {len(errors)}")
        for e in errors:
            print(f"  - {e}")
    print(f"saved: {STATUS_FILE}")


if __name__ == "__main__":
    main()