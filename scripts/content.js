const fs = require("node:fs");
const path = require("node:path");
const MarkdownIt = require("markdown-it");
const YAML = require("yaml");
const katex = require("katex");
const ROOT = path.resolve(__dirname, "..");
const BASE = "/my-portfolio";
const escape = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function parse(raw) {
  if (Buffer.byteLength(raw, "utf8") > 1024 * 1024) throw new Error("单篇 Markdown 不得超过 1 MB。");
  const match = raw.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error("文章需要 YAML 元信息，以 --- 分隔。");
  const data = YAML.parse(match[1], { schema: "core", maxAliasCount: 0 });
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("元信息必须为对象。");
  for (const key of ["title", "description", "date", "updated"]) {
    if (data[key] !== undefined && typeof data[key] !== "string") throw new Error(key + " 必须为文本。");
  }
  if (data.draft !== undefined && typeof data.draft !== "boolean") throw new Error("draft 必须为 true 或 false。");
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== "string"))) throw new Error("tags 必须为文本列表。");
  return { data, body: match[2] };
}

function renderer(kind, slug) {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
  // CommonMark treats full-width punctuation as a word boundary, so e.g.
  // **假设：**正文 otherwise stays literal. Extend only CJK strong boundaries;
  // keep the normal tokenizer (and its code/escape handling) in control.
  const InlineState = md.inline.State;
  md.inline.State = class extends InlineState {
    scanDelims(start, canSplitWord) {
      const result = super.scanDelims(start, canSplitWord);
      if (this.src[start] !== "*" || result.length !== 2) return result;
      const before = this.src[start - 1] || "";
      const after = this.src[start + result.length] || "";
      if (/[。，：；！？、）》」』】”’]/u.test(before) && /\p{Script=Han}/u.test(after)) {
        result.can_close = true;
      }
      if (/\p{Script=Han}/u.test(before) && /[“‘（《「『【]/u.test(after)) {
        result.can_open = true;
      }
      return result;
    }
  };
  const headings = new Map();
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const text = tokens[idx + 1]?.content || "section";
    const base = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section";
    const count = headings.get(base) || 0;
    headings.set(base, count + 1);
    tokens[idx].attrSet("id", count ? base + "-" + count : base);
    return self.renderToken(tokens, idx, options);
  };
  const defaultValidate = md.validateLink.bind(md);
  md.validateLink = url => defaultValidate(url) && !/^(?:data:|file:|\/\/)/i.test(url) && !/[\u0000-\u0020\\]/.test(url);
  md.inline.ruler.before("escape", "math_inline", (state, silent) => {
    const start = state.pos;
    if (state.src[start] !== "$" || state.src[start + 1] === "$") return false;
    const end = state.src.indexOf("$", start + 1);
    if (end < 0 || end === start + 1 || state.src.slice(start + 1, end).includes("\n")) return false;
    if (!silent) state.push("math_inline", "math", 0).content = state.src.slice(start + 1, end);
    state.pos = end + 1;
    return true;
  });
  md.block.ruler.before("fence", "math_block", (state, startLine, endLine, silent) => {
    const first = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]).trim();
    if (first !== "$$" && !(first.startsWith("$$") && first.endsWith("$$") && first.length > 4)) return false;
    let end = startLine;
    let content = first.slice(2, -2);
    if (first === "$$") {
      end++;
      while (end < endLine && state.src.slice(state.bMarks[end], state.eMarks[end]).trim() !== "$$") end++;
      if (end >= endLine) return false;
      content = state.getLines(startLine + 1, end, state.blkIndent, false);
    }
    if (!silent) state.push("math_block", "math", 0).content = content;
    state.line = end + 1;
    return true;
  });
  const math = displayMode => tokens => katex.renderToString(tokens.content, { displayMode, throwOnError: false, trust: false, strict: "ignore", maxExpand: 500, maxSize: 20 });
  md.renderer.rules.math_inline = (tokens, idx) => math(false)(tokens[idx]);
  md.renderer.rules.math_block = (tokens, idx) => math(true)(tokens[idx]);
  const originalLink = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    let href = token.attrGet("href") || "";
    if (/^https?:\/\//i.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    } else if (href.startsWith("/") && !href.startsWith(BASE + "/")) {
      href = BASE + href;
    } else if (kind === "wiki" && /^[a-z0-9-]+(?:\.md)?(?:#[\w-]+)?$/i.test(href)) {
      const [name, hash] = href.split("#");
      href = BASE + "/wiki/pages/" + name.replace(/\.md$/, "") + "/" + (hash ? "#" + hash : "");
    }
    token.attrSet("href", href);
    return originalLink(tokens, idx, options, env, self);
  };
  const originalImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const src = token.attrGet("src") || "";
    // Local images must be explicitly published under the article's own directory.
    if (!/^https:\/\//i.test(src)) {
      const normalized = src.replace(BASE, "");
      if (!normalized.startsWith("/media/" + kind + "/" + slug + "/") || normalized.includes("..") || normalized.includes("\\")) {
        throw new Error("本地图片请放在 /media/" + kind + "/" + slug + "/，禁止引用草稿或本机路径。");
      }
      token.attrSet("src", BASE + normalized);
    }
    token.attrSet("loading", "lazy");
    token.attrSet("decoding", "async");
    return originalImage(tokens, idx, options, env, self);
  };
  return md;
}

function load(kind) {
  const dir = path.join(ROOT, "content", kind === "blog" ? "posts" : "wiki");
  return fs.readdirSync(dir).filter(f => f.endsWith(".md") && f !== "README.md").map(file => {
    const full = path.join(dir, file);
    if (fs.lstatSync(full).isSymbolicLink()) throw new Error("禁止通过符号链接发布内容。");
    const { data, body } = parse(fs.readFileSync(full, "utf8"));
    if (data.draft === true) throw new Error(file + " 是草稿，请移至被忽略的 drafts 目录。");
    const slug = path.basename(file, ".md");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("文件名必须为小写英文 slug: " + file);
    if (!data.title?.trim()) throw new Error(file + " 缺少标题。");
    const date = data.date || "";
    const updated = data.updated || date;
    for (const value of [date, updated]) {
      if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value).toISOString().slice(0, 10) !== value)) throw new Error(file + " 日期无效。");
    }
    return { slug, title: data.title, date, updated, description: data.description || "", tags: data.tags || [], html: renderer(kind, slug).render(body) };
  }).sort((a, b) => (kind === "blog" ? b.date.localeCompare(a.date) : b.updated.localeCompare(a.updated)));
}

function generate(kind) {
  const records = load(kind);
  const output = kind === "blog" ? "app/blog/posts-data.ts" : "app/wiki/pages-data.ts";
  const name = kind === "blog" ? "posts" : "wikiPages";
  // JSON serialization prevents frontmatter from becoming executable TypeScript.
  fs.writeFileSync(path.join(ROOT, output), "export const " + name + " = " + JSON.stringify(records, null, 2) + ";\n");
  if (kind === "blog") {
    const origin = "https://zhansleo.github.io" + BASE;
    const items = records.map(p => {
      const url = origin + "/blog/posts/" + p.slug + "/";
      return "<item><title>" + escape(p.title) + "</title><link>" + url + "</link><guid>" + url + "</guid><description>" + escape(p.description) + "</description>" + (p.date ? "<pubDate>" + new Date(p.date + "T00:00:00+08:00").toUTCString() + "</pubDate>" : "") + "</item>";
    }).join("\n");
    fs.writeFileSync(path.join(ROOT, "public/feed.xml"), '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>赵寒石的博客</title><link>' + origin + '</link><description>实验、复盘与日常思考</description><language>zh-CN</language>' + items + "</channel></rss>");
  }
  console.log(kind + ": generated " + records.length);
}
module.exports = { parse, renderer, load, generate, escape };
