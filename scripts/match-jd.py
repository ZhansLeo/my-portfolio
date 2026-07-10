import json
import os
import re
import urllib.request
import urllib.parse
from difflib import SequenceMatcher

PROJECT_ROOT = os.path.join(os.path.dirname(__file__), "..")

QUERIES_FILE = os.path.join(PROJECT_ROOT, "config", "jd-queries.json")
SYNONYMS_FILE = os.path.join(PROJECT_ROOT, "config", "skill-synonyms.json")
OUT_FILE = os.path.join(PROJECT_ROOT, "public", "data", "jd-match.json")

USER_SKILLS = {
    "编程语言": ["Python", "Java", "C"],
    "前端框架": ["Next.js", "Tailwind CSS"],
    "AI & LLM": ["LLM 接入", "Prompt 调试", "RAG"],
    "软件工程": ["OOP", "PRD", "业务流程图"],
    "数据分析": ["K-means", "数据可视化"],
    "工具": ["Git", "AI 辅助编程"],
}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch_jd(query):
    """Fetch JD content from web search."""
    encoded = urllib.parse.quote(query)
    try:
        url = f"https://html.duckduckgo.com/html/?q={encoded}"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; JDMatcher/1.0)",
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            text = re.sub(r"<[^>]+>", " ", html)
            text = re.sub(r"\s+", " ", text)
            return text
    except Exception as e:
        print(f"  Fetch failed: {e}")
        return None


def extract_skills(text):
    """Extract skill keywords from JD text."""
    found = set()
    text_lower = text.lower()

    tech_keywords = [
        "python", "java", "c++", "c语言", "golang", "go语言", "rust",
        "javascript", "typescript", "js", "ts",
        "react", "vue", "next.js", "nextjs", "tailwind", "css", "html",
        "spring", "springboot", "django", "flask", "node", "express",
        "mysql", "redis", "mongodb", "postgresql", "elasticsearch",
        "kafka", "rabbitmq", "rocketmq", "消息队列",
        "docker", "kubernetes", "k8s", "linux", "git", "nginx",
        "机器学习", "深度学习", "nlp", "自然语言", "大数据", "hadoop", "spark",
        "微服务", "分布式", "rpc", "restful", "graphql", "grpc",
        "敏捷", "scrum", "devops", "ci/cd",
        "数据结构", "算法", "设计模式", "面向对象",
        "数据库", "缓存", "容器", "云计算",
        "前端", "后端", "全栈", "移动端",
        "网络协议", "tcp", "http", "https",
        "需求分析", "项目管理", "产品设计",
    ]
    for kw in tech_keywords:
        if kw.lower() in text_lower:
            found.add(kw.lower())

    return found


def char_ngrams(s, n=2):
    s = s.lower().replace(" ", "")
    return {s[i:i+n] for i in range(len(s) - n + 1)}


def semantic_similarity(a, b):
    """Jaccard similarity on character n-grams."""
    if not a or not b:
        return 0.0
    ng_a = char_ngrams(a)
    ng_b = char_ngrams(b)
    intersection = len(ng_a & ng_b)
    union = len(ng_a | ng_b)
    if union == 0:
        return 0.0
    return intersection / union


def match_jd(query_entry, synonyms):
    """Match one JD against user skills."""
    print(f"Searching: {query_entry['company']} {query_entry['position']}")

    html = fetch_jd(query_entry["search_keywords"])
    if not html:
        return fallback_match(query_entry, synonyms)

    text = html
    found_skills = extract_skills(text)

    if len(found_skills) < 3:
        print(f"  Low signal ({len(found_skills)} keywords), using fallback")
        return fallback_match(query_entry, synonyms)

    return build_result(query_entry, found_skills, synonyms, "web_search")


FALLBACK_JDS = {
    "美团 后端开发工程师": [
        "java", "python", "golang", "spring", "springboot",
        "mysql", "redis", "消息队列", "kafka", "rocketmq",
        "docker", "kubernetes", "linux", "git",
        "微服务", "分布式", "rpc", "数据结构", "算法",
        "设计模式", "面向对象", "数据库",
    ],
    "字节跳动 前端开发实习生": [
        "javascript", "typescript", "react", "vue",
        "html", "css", "tailwind", "next.js",
        "node", "webpack", "git",
        "计算机网络", "http", "数据结构", "算法",
        "浏览器原理", "响应式", "前端性能",
    ],
}


def fallback_match(query_entry, synonyms):
    key = f"{query_entry['company']} {query_entry['position']}"
    if key in FALLBACK_JDS:
        found_skills = set(FALLBACK_JDS[key])
        return build_result(query_entry, found_skills, synonyms, "knowledge_base")
    return build_result(query_entry, set(), synonyms, "no_data")


def build_result(query_entry, found_skills, synonyms, source):
    matched = []
    missing = []
    partial = []

    jd_skill_map = {
        "java": "Java", "python": "Python", "c++": "C", "c语言": "C",
        "golang": "Go", "rust": "Rust",
        "javascript": "JavaScript", "typescript": "TypeScript",
        "react": "React", "vue": "Vue", "next.js": "Next.js", "nextjs": "Next.js",
        "tailwind": "Tailwind CSS", "css": "CSS", "html": "HTML",
        "spring": "Spring", "springboot": "Spring Boot", "django": "Django",
        "mysql": "MySQL", "redis": "Redis", "mongodb": "MongoDB",
        "kafka": "Kafka", "rabbitmq": "RabbitMQ", "rocketmq": "RocketMQ",
        "消息队列": "消息队列",
        "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
        "linux": "Linux", "git": "Git", "nginx": "Nginx",
        "微服务": "微服务", "分布式": "分布式系统", "rpc": "RPC",
        "数据结构": "数据结构", "算法": "算法",
        "设计模式": "设计模式", "面向对象": "OOP",
        "数据库": "数据库",
        "机器学习": "机器学习", "深度学习": "深度学习",
        "网络协议": "计算机网络", "tcp": "计算机网络", "http": "HTTP",
        "webpack": "Webpack", "node": "Node.js",
        "浏览器原理": "浏览器原理", "响应式": "响应式设计",
        "前端性能": "前端性能优化",
        "计算机网络": "计算机网络",
    }

    all_user = {}
    for cat, skills in USER_SKILLS.items():
        for s in skills:
            all_user[s.lower()] = (s, cat)

    for kw in sorted(found_skills):
        jd_name = jd_skill_map.get(kw, kw)
        is_match, confidence = match_against_user(kw, all_user, synonyms)
        if is_match and confidence >= 0.85:
            matched.append({"skill": jd_name, "category": "JD 要求", "confidence": round(confidence, 2)})
        elif is_match:
            partial.append({"skill": jd_name, "category": "JD 要求", "confidence": round(confidence, 2)})
        else:
            missing.append({"skill": jd_name, "category": "JD 要求"})

    all_jd = len(matched) + len(partial) + len(missing)
    score = round((len(matched) + len(partial) * 0.5) / all_jd * 100) if all_jd > 0 else 0

    analysis = []
    if matched:
        names = "、".join(m["skill"] for m in matched[:5])
        analysis.append(f"已具备：{names}")
    if partial:
        names = "、".join(p["skill"] for p in partial[:3])
        analysis.append(f"需加强：{names}")
    if missing:
        names = "、".join(m["skill"] for m in missing[:5])
        analysis.append(f"建议学习：{names}")

    return {
        "company": query_entry["company"],
        "position": query_entry["position"],
        "source": source,
        "matched": matched,
        "missing": missing,
        "partial": partial,
        "score": score,
        "analysis": analysis,
        "found_keywords": sorted(found_skills)[:30],
    }


def match_against_user(jd_kw, all_user, synonyms):
    jd_variants = {jd_kw}
    for syn_key, syn_list in synonyms.items():
        if syn_key.lower() == jd_kw or jd_kw in [s.lower() for s in syn_list]:
            jd_variants.update(s.lower() for s in syn_list)

    for user_lower, (user_skill, _) in all_user.items():
        for jv in jd_variants:
            if jv == user_lower:
                return True, 1.0
            if len(user_lower) >= 3 and len(jv) >= 3:
                if jv in user_lower or user_lower in jv:
                    return True, 1.0
        ratio = SequenceMatcher(None, jd_kw, user_lower).ratio()
        if ratio > 0.85:
            return True, ratio
        sim = semantic_similarity(jd_kw, user_lower)
        if sim > 0.65:
            return True, sim

    return False, 0.0


def main():
    if not os.path.exists(QUERIES_FILE):
        print("config/jd-queries.json not found")
        return

    queries = load_json(QUERIES_FILE)
    synonyms = load_json(SYNONYMS_FILE)["synonyms"]

    results = []
    for q in queries:
        result = match_jd(q, synonyms)
        results.append(result)
        print(f"  Score: {result['score']}% | matched: {len(result['matched'])} | partial: {len(result['partial'])} | missing: {len(result['missing'])}")

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nSaved: {OUT_FILE}")


if __name__ == "__main__":
    main()