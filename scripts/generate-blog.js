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

function escapeXML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatPubDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const pad = (n) => String(n).padStart(2, "0");
  return `${days[d.getUTCDay()]}, ${pad(day)} ${months[month - 1]} ${year} 00:00:00 +0800`;
}

function formatNowPubDate() {
  const now = new Date();
  const offsetMs = 8 * 60 * 60 * 1000;
  const local = new Date(now.getTime() + offsetMs);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const pad = (n) => String(n).padStart(2, "0");
  return `${days[local.getUTCDay()]}, ${pad(local.getUTCDate())} ${months[local.getUTCMonth()]} ${local.getUTCFullYear()} ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())} +0800`;
}

function validateXml(xml) {
  const tagPattern = /<\/?([\w][\w.:-]*)(\s[^>]*)?\/?>/g;
  const stack = [];
  let match;

  while ((match = tagPattern.exec(xml)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.startsWith("</")) {
      if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
        throw new Error(
          `XML validation failed: mismatched closing tag </${tagName}>, ` +
          `expected </${stack[stack.length - 1] || "none"}>`
        );
      }
      stack.pop();
    } else if (!fullTag.endsWith("/>") && !fullTag.endsWith("?>")) {
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    throw new Error(`XML validation failed: unclosed tags: ${stack.join(", ")}`);
  }

  const textContent = xml.replace(/<[^>]*>/g, "");
  const badAmp = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/;
  if (badAmp.test(textContent)) {
    throw new Error("XML validation failed: unescaped ampersand in text content");
  }

  return true;
}

function generateRSS(posts) {
  const BASE_URL = "https://my-portfolio-d3g4m2j50a17c3d18-1428721206.tcloudbaseapp.com";
  const now = formatNowPubDate();

  const sorted = [...posts]
    .filter((p) => p.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  const items = sorted.map((p) => {
    const link = `${BASE_URL}/blog/posts/${p.slug}`;
    const pubDate = formatPubDate(p.date);
    return [
      "    <item>",
      `      <title>${escapeXML(p.title)}</title>`,
      `      <link>${escapeXML(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXML(link)}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <description>${escapeXML(p.description)}</description>`,
      "    </item>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXML("赵寒石的博客")}</title>`,
    `    <link>${escapeXML(BASE_URL)}</link>`,
    `    <description>${escapeXML("赵寒石的个人博客——记录学习、实验和思考。")}</description>`,
    `    <language>zh-CN</language>`,
    `    <lastBuildDate>${now}</lastBuildDate>`,
    `    <atom:link href="${escapeXML(BASE_URL + "/feed.xml")}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  validateXml(xml);
  console.log("XML validation passed.");

  const OUT_DIR = path.join(__dirname, "..", "public");
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  const outPath = path.join(OUT_DIR, "feed.xml");
  fs.writeFileSync(outPath, xml, "utf-8");

  console.log(`Generated RSS feed with ${sorted.length} item(s) to ${outPath}`);
  for (const p of sorted) {
    console.log(`  - ${p.title} (${p.date})`);
  }
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

  generateRSS(posts);
}

generate();