const fs = require("fs");
const path = require("path");

const WIKI_DIR = path.join(__dirname, "..", "content", "wiki");

function parsePage(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parts = raw.split("---");
  if (parts.length < 3) return null;

  const frontmatter = parts[1];
  const body = parts.slice(2).join("---").trim();
  const slug = path.basename(filePath, ".md");

  const data = {};
  for (const line of frontmatter.trim().split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon > 0) {
      const key = trimmed.slice(0, colon).trim();
      let value = trimmed.slice(colon + 1).trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        try { value = JSON.parse(value.replace(/'/g, '"')); } catch { value = value.slice(1, -1).split(",").map((s) => s.trim()); }
      } else if ((value.startsWith('"') && value.endsWith('"')) ||
                 (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }

  return { slug, title: data.title || slug, tags: data.tags || [], body };
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[#*_`\[\]()>-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function scorePage(page, queryTokens) {
  let score = 0;
  const titleTokens = tokenize(page.title);
  const bodyTokens = tokenize(page.body);
  const tagTokens = (Array.isArray(page.tags) ? page.tags : []).flatMap((t) => tokenize(String(t)));

  for (const qt of queryTokens) {
    for (const tt of titleTokens) {
      if (tt.includes(qt) || qt.includes(tt)) score += 10;
    }
    for (const tt of tagTokens) {
      if (tt.includes(qt) || qt.includes(tt)) score += 5;
    }
    for (const bt of bodyTokens) {
      if (bt.includes(qt) || qt.includes(bt)) score += 1;
    }
  }

  return score;
}

function extractSnippets(body, queryTokens, maxLen = 120) {
  const paragraphs = body.split("\n").filter((l) => l.trim().length > 0);
  const snippets = [];

  for (const para of paragraphs) {
    const clean = para.replace(/^#+\s*/, "").replace(/[*_`\[\]()]/g, "").trim();
    if (!clean) continue;

    const lower = clean.toLowerCase();
    for (const qt of queryTokens) {
      if (lower.includes(qt)) {
        const idx = lower.indexOf(qt);
        const start = Math.max(0, idx - 40);
        const end = Math.min(clean.length, idx + qt.length + 80);
        let snippet = clean.slice(start, end);
        if (start > 0) snippet = "..." + snippet;
        if (end < clean.length) snippet = snippet + "...";
        if (!snippets.includes(snippet)) snippets.push(snippet);
      }
    }
    if (snippets.length >= 3) break;
  }

  return snippets.slice(0, 3);
}

function main() {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    console.log("Usage: node scripts/retrieve.js <query>");
    process.exit(1);
  }

  if (!fs.existsSync(WIKI_DIR)) {
    console.log("No wiki directory found.");
    process.exit(0);
  }

  const files = fs.readdirSync(WIKI_DIR).filter((f) => f.endsWith(".md") && f !== "README.md");
  const pages = files.map((f) => parsePage(path.join(WIKI_DIR, f))).filter(Boolean);

  const queryTokens = tokenize(query);
  const results = pages
    .map((p) => ({ ...p, score: scorePage(p, queryTokens) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  console.log(`Query: "${query}"`);
  console.log(`Found: ${results.length} page(s)\n`);

  for (const r of results) {
    const snippets = extractSnippets(r.body, queryTokens);
    console.log(`=== ${r.title} (score: ${r.score}) ===`);
    console.log(`  slug: ${r.slug}`);
    if (r.tags.length) console.log(`  tags: ${r.tags.join(", ")}`);
    for (const s of snippets) {
      console.log(`  > ${s}`);
    }
    console.log();
  }
}

main();