"""arXiv metadata collection; no paid API, model, or arbitrary URL execution."""
import argparse
from datetime import datetime, timezone, timedelta
import itertools
import json
from pathlib import Path
import re
import time
import subprocess
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FEED = ROOT / "public/data/paper-feed.json"
TOPICS = json.loads((ROOT / "config/paper-topics.json").read_text(encoding="utf-8"))
ATOM = {"a": "http://www.w3.org/2005/Atom"}
MAX_RESPONSE = 8 * 1024 * 1024


def now_utc():
    return datetime.now(timezone.utc)


def timestamp(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def atomic_json(path, value):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def classify(paper):
    title = re.sub(r"\s+", " ", paper["title"].lower())
    abstract = re.sub(r"\s+", " ", paper["summary"].lower())
    matches = []
    for topic, terms in TOPICS.items():
        for kind, weight in [("direct", 5), ("related", 2)]:
            hits = [term for term in terms[kind] if re.search(r"(?<!\w)" + re.escape(term) + r"(?!\w)", title + " " + abstract)]
            if hits:
                score = weight + sum(3 if term in title else 1 for term in hits)
                matches.append((score, topic, kind, hits[0]))
                break
    if not matches:
        return None
    matches.sort(key=lambda x: (-x[0], x[1]))
    best = matches[0]
    return dict(paper, topics=[m[1] for m in matches], primaryTopic=best[1],
                related=best[2] == "related", score=best[0],
                reason=("相近方向：" if best[2] == "related" else "主题匹配：") + best[3])


def parse_atom(raw):
    if len(raw) > MAX_RESPONSE or b"<!DOCTYPE" in raw.upper() or b"<!ENTITY" in raw.upper():
        raise ValueError("拒绝异常 XML 响应")
    root = ET.fromstring(raw)
    if root.tag != "{http://www.w3.org/2005/Atom}feed":
        raise ValueError("arXiv 未返回 Atom feed")
    results = []
    for entry in root.findall("a:entry", ATOM):
        def field(name):
            return re.sub(r"\s+", " ", entry.findtext("a:" + name, default="", namespaces=ATOM)).strip()
        match = re.fullmatch(r"https?://arxiv\.org/abs/(\d{4}\.\d{4,5})(v\d+)?", field("id"))
        if not match:
            raise ValueError("arXiv 条目 ID 无效或接口返回错误")
        paper = {"id": match[1], "version": int((match[2] or "v1")[1:]),
                 "title": field("title"), "summary": field("summary"),
                 "authors": [a.findtext("a:name", default="", namespaces=ATOM) for a in entry.findall("a:author", ATOM)],
                 "published": field("published"), "updated": field("updated"),
                 "url": "https://arxiv.org/abs/" + match[1]}
        if not paper["title"] or not paper["summary"] or not paper["authors"]:
            raise ValueError("论文缺少必要字段")
        timestamp(paper["published"])
        timestamp(paper["updated"])
        results.append(paper)
    return results


def fetch(query, start=0):
    params = urllib.parse.urlencode({"search_query": query, "start": start,
                                    "max_results": 100, "sortBy": "submittedDate",
                                    "sortOrder": "descending"})
    request = urllib.request.Request("https://export.arxiv.org/api/query?" + params,
        headers={"User-Agent": "ZhansLeo-Research-Feed/1.0 (https://github.com/ZhansLeo/my-portfolio)"})
    for attempt in range(3):
        # arXiv asks clients to space consecutive API calls.
        time.sleep(3.2 if attempt == 0 else 8 * attempt)
        try:
            if sys.platform == "win32":
                # Windows' certificate store avoids Conda/OpenSSL TLS incompatibilities.
                # No shell, no insecure TLS option, bounded response and request time.
                raw = subprocess.check_output(["curl.exe", "--fail", "--silent", "--show-error",
                    "--proto", "=https", "--max-time", "45", "--max-filesize", str(MAX_RESPONSE),
                    "--user-agent", "ZhansLeo-Research-Feed/1.0 (https://github.com/ZhansLeo/my-portfolio)",
                    request.full_url], timeout=50)
            else:
                with urllib.request.urlopen(request, timeout=45) as response:
                    raw = response.read(MAX_RESPONSE + 1)
            return parse_atom(raw)
        except Exception:
            if attempt == 2:
                raise


def candidates(now):
    # Seven days covers arXiv announcement gaps; selection prefers the last three.
    since = (now - timedelta(days=7)).strftime("%Y%m%d0000")
    until = now.strftime("%Y%m%d2359")
    found = {}
    for terms in TOPICS.values():
        phrases = terms["direct"] + terms["related"]
        query = "(" + " OR ".join('ti:"' + t + '" OR abs:"' + t + '"' for t in phrases) + ")"
        query += " AND (cat:cs.AI OR cat:cs.CL OR cat:cs.CV OR cat:cs.LG OR cat:cs.RO OR cat:cs.MA)"
        query += " AND submittedDate:[" + since + " TO " + until + "]"
        for start in range(0, 300, 100):
            page = fetch(query, start)
            for paper in page:
                previous = found.get(paper["id"])
                if not previous or paper["version"] > previous["version"]:
                    found[paper["id"]] = paper
            if len(page) < 100:
                break
    return list(found.values())


def select(papers, seen, now):
    ranked = []
    for p in papers:
        age = (now - timestamp(p["published"])).total_seconds() / 86400
        if p["id"] in seen or not 0 <= age <= 7:
            continue
        item = classify(p)
        if item:
            item["rank"] = item["score"] + (4 if age <= 3 else 0)
            ranked.append(item)
    ranked.sort(key=lambda p: (-p["rank"], p["published"], p["id"]))
    # Same-paper duplicate versions are never allowed to count toward coverage.
    unique = {}
    for p in ranked:
        if p["id"] not in unique or p["version"] > unique[p["id"]]["version"]:
            unique[p["id"]] = p
    ranked = sorted(unique.values(), key=lambda p: (-p["rank"], p["published"], p["id"]))
    chosen = []
    pairs = [(a, b) for a, b in itertools.combinations(ranked, 2) if a["primaryTopic"] != b["primaryTopic"]]
    if pairs:
        chosen = list(max(pairs, key=lambda pair: sum(p["rank"] for p in pair)))
    for p in ranked:
        if len(chosen) == 4:
            break
        if p["id"] not in {v["id"] for v in chosen}:
            chosen.append(p)
    return [{k: v for k, v in p.items() if k not in ("score", "rank")} for p in chosen]


def collect(force=False):
    state = json.loads(FEED.read_text(encoding="utf-8"))
    now = now_utc()
    if not force and state["lastSuccess"] and now - timestamp(state["lastSuccess"]) < timedelta(hours=72):
        print("未到 72 小时，保持现有批次。")
        return
    state["lastAttempt"] = now.isoformat()
    try:
        papers = candidates(now)
        seen = {p["id"] for batch in state["batches"] for p in batch["papers"]}
        chosen = select(papers, seen, now)
        newest = {p["id"]: p for p in papers}
        # Refresh metadata for already selected versions, without reselecting them.
        for batch in state["batches"]:
            for p in batch["papers"]:
                latest = newest.get(p["id"])
                if latest and latest["version"] > p.get("version", 1):
                    p.update(latest)
        if chosen:
            topics = {p["primaryTopic"] for p in chosen}
            state["batches"].insert(0, {"id": now.strftime("%Y%m%dT%H%M%SZ"), "createdAt": now.isoformat(),
                "coverage": sorted(topics), "papers": chosen,
                "note": "覆盖不足：已扩展相近方向，未为凑数重复收录。" if len(topics) < 2 else ""})
        state.update(lastSuccess=now.isoformat(), status="ok",
                     message="本次新增 " + str(len(chosen)) + " 篇。" if chosen else "本次检查成功，暂无新的相关论文。")
        atomic_json(FEED, state)
        print(state["message"])
    except Exception as error:
        state.update(status="error", message="最近一次采集未完成，保留上次成功结果，稍后重试。")
        atomic_json(FEED, state)
        print("采集失败：" + type(error).__name__ + ": " + str(error))
        raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="手动重试，不受 72 小时门槛限制")
    args = parser.parse_args()
    collect(args.force)
