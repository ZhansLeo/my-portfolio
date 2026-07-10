const fs = require("fs");
const path = require("path");

const WIKI_DIR = path.join(__dirname, "..", "content", "wiki");
const OUT_FILE = path.join(__dirname, "..", "app", "wiki", "pages-data.ts");

function parseFrontmatter(raw) {
  const lines = raw.trim().split("\n");
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    const colon = line.indexOf(":");
    if (colon > 0) {
      const key = line.slice(0, colon).trim();
      let value = line.slice(colon + 1).trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        try { value = JSON.parse(value); } catch { /* keep raw */ }
      } else if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }
  return data;
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const html = [];
  let inList = false;

  function closeList() {
    if (inList) { html.push("</ul>"); inList = false; }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inlineMd(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMd(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inlineMd(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${inlineMd(line.slice(2))}</li>`);
      continue;
    }
    closeList();
    const trimmed = line.trim();
    if (trimmed === "") continue;
    html.push(`<p>${inlineMd(trimmed)}</p>`);
  }
  closeList();
  return html.join("\n");
}

function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      if (href.startsWith("http")) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      }
      return `<a href="/wiki/pages/${href}" class="wiki-link">${label}</a>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeTemplate(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function generate() {
  if (!fs.existsSync(WIKI_DIR)) return;

  const files = fs.readdirSync(WIKI_DIR).filter((f) => f.endsWith(".md") && f !== "README.md");
  const pages = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(WIKI_DIR, file), "utf-8");
    const parts = raw.split("---");
    if (parts.length < 3) continue;

    const frontmatter = parts[1];
    const body = parts.slice(2).join("---").trim();
    const data = parseFrontmatter(frontmatter);
    const html = mdToHtml(body);
    const slug = file.replace(/\.md$/, "");

    pages.push({
      slug,
      title: data.title || slug,
      updated: data.updated || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      html,
    });
  }

  pages.sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));

  const lines = [];
  lines.push("export interface WikiPage {");
  lines.push("  slug: string;");
  lines.push("  title: string;");
  lines.push("  updated: string;");
  lines.push("  tags: string[];");
  lines.push("  html: string;");
  lines.push("}");
  lines.push("");
  lines.push("export const wikiPages: WikiPage[] = [");

  for (const p of pages) {
    lines.push("  {");
    lines.push(`    slug: "${escapeTemplate(p.slug)}",`);
    lines.push(`    title: "${escapeTemplate(p.title)}",`);
    lines.push(`    updated: "${escapeTemplate(p.updated)}",`);
    lines.push(`    tags: ${JSON.stringify(p.tags)},`);
    lines.push(`    html: \`${escapeTemplate(p.html)}\`,`);
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  const dir = path.dirname(OUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf-8");

  console.log(`Generated ${pages.length} wiki page(s) to ${OUT_FILE}`);
  for (const p of pages) {
    console.log(`  - ${p.slug} (${p.updated})`);
  }
}

generate();