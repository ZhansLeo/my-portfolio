const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const OUT_FILE = path.join(__dirname, "..", "app", "blog", "posts-data.ts");

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
      if ((value.startsWith('"') && value.endsWith('"')) ||
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
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith("### ")) {
      closeList();
      const text = inlineMd(line.slice(4));
      html.push(`<h3>${text}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      const text = inlineMd(line.slice(3));
      html.push(`<h2>${text}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      closeList();
      const text = inlineMd(line.slice(2));
      html.push(`<h1>${text}</h1>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      const text = inlineMd(line.slice(2));
      html.push(`<li>${text}</li>`);
      continue;
    }

    closeList();

    const trimmed = line.trim();
    if (trimmed === "") {
      continue;
    }

    html.push(`<p>${inlineMd(trimmed)}</p>`);
  }

  closeList();
  return html.join("\n");
}

function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeTemplate(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function generate() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log("content/posts directory not found, skipping blog generation.");
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const parts = raw.split("---");
    if (parts.length < 3) continue;

    const frontmatter = parts[1];
    const body = parts.slice(2).join("---").trim();

    const data = parseFrontmatter(frontmatter);
    const html = mdToHtml(body);
    const slug = file.replace(/\.md$/, "");

    posts.push({
      slug,
      title: data.title || slug,
      date: data.date || "",
      description: data.description || "",
      html,
    });
  }

  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const lines = [];
  lines.push("export interface Post {");
  lines.push("  slug: string;");
  lines.push("  title: string;");
  lines.push("  date: string;");
  lines.push("  description: string;");
  lines.push("  html: string;");
  lines.push("}");
  lines.push("");
  lines.push("export const posts: Post[] = [");

  for (const p of posts) {
    lines.push("  {");
    lines.push(`    slug: "${escapeTemplate(p.slug)}",`);
    lines.push(`    title: "${escapeTemplate(p.title)}",`);
    lines.push(`    date: "${escapeTemplate(p.date)}",`);
    lines.push(`    description: "${escapeTemplate(p.description)}",`);
    lines.push(`    html: \`${escapeTemplate(p.html)}\`,`);
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  const dir = path.dirname(OUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf-8");

  console.log(`Generated ${posts.length} blog post(s) to ${OUT_FILE}`);
  for (const p of posts) {
    console.log(`  - ${p.slug} (${p.date})`);
  }
}

generate();