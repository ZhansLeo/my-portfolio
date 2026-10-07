const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { execFileSync } = require("node:child_process");
const YAML = require("yaml");
const { parse, renderer, escape } = require("./content");
const ROOT = path.resolve(__dirname, "..");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };

function identity(kind, slug) {
  if (!["blog", "wiki"].includes(kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || "")) throw new Error("格式：npm run content:new -- blog|wiki lowercase-slug");
  return { kind, slug, draft: path.join(ROOT, "drafts", kind, slug + ".md"), assets: path.join(ROOT, "drafts", kind, slug + "-assets"),
    published: path.join(ROOT, "content", kind === "blog" ? "posts" : "wiki", slug + ".md"), media: path.join(ROOT, "public/media", kind, slug) };
}
function regular(file) {
  // Reject links at every existing level, including Windows junctions.
  let current = path.resolve(file);
  if (!current.startsWith(ROOT + path.sep)) throw new Error("路径超出项目目录。");
  while (current !== ROOT) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error("禁止符号链接或目录联接。");
    current = path.dirname(current);
  }
}
function image(file) {
  regular(file);
  const data = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  const valid = ext === ".png" ? data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) :
    [".jpg", ".jpeg"].includes(ext) ? data[0] === 255 && data[1] === 216 && data[2] === 255 :
    ext === ".webp" ? data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP" :
    ext === ".gif" ? ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6)) : false;
  if (!valid || data.length > 10 * 1024 * 1024) throw new Error("图片必须是真实 PNG/JPEG/WebP/GIF 且不大于 10 MB：" + file);
  return data;
}
function references(md, body, info) {
  const names = new Set();
  const prefix = "/media/" + info.kind + "/" + info.slug + "/";
  function visit(tokens) {
    for (const token of tokens) {
      if (token.type === "image") {
        const src = (token.attrGet("src") || "").replace(/^\/my-portfolio/, "");
        if (!src.startsWith("https://")) {
          if (!src.startsWith(prefix)) throw new Error("图片路径必须为 " + prefix + "文件名");
          const name = src.slice(prefix.length);
          if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpe?g|webp|gif)$/i.test(name) || name.includes("..")) throw new Error("图片名不安全。");
          names.add(name);
        }
      }
      if (token.children) visit(token.children);
    }
  }
  visit(md.parse(body, {}));
  return [...names];
}
function read(info, published = false) {
  const file = published ? info.published : info.draft;
  regular(file);
  const parsed = parse(fs.readFileSync(file, "utf8"));
  const md = renderer(info.kind, info.slug);
  const names = references(md, parsed.body, info);
  const folder = published ? info.media : info.assets;
  for (const name of names) image(path.join(folder, name));
  if (!parsed.data.title?.trim()) throw new Error("请填写文章标题。");
  return { ...parsed, names, html: md.render(parsed.body) };
}
function run(command, kind, slug) {
  const info = identity(kind, slug);
  if (command === "new") {
    regular(info.draft);
    if (fs.existsSync(info.draft) || fs.existsSync(info.published)) throw new Error("文章已存在；修改现有草稿，或先将已发布文章复制到 drafts 对应位置。");
    fs.mkdirSync(info.assets, { recursive: true });
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
    const data = { title: "填写标题", [kind === "blog" ? "date" : "updated"]: day, description: "一句话简介", tags: [], draft: true };
    fs.writeFileSync(info.draft, "---\n" + YAML.stringify(data) + "---\n\n从这里开始写。\n", { flag: "wx" });
    console.log("已创建私有草稿：" + path.relative(ROOT, info.draft));
  } else if (command === "preview") {
    read(info);
    const server = http.createServer((req, res) => {
      try {
        if (req.method !== "GET") { res.writeHead(405); return res.end(); }
        if (req.headers.host !== "127.0.0.1:4317" || (req.headers.origin && req.headers.origin !== "http://127.0.0.1:4317")) {
          res.writeHead(403); return res.end("Forbidden");
        }
        const url = new URL(req.url, "http://127.0.0.1");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
        if (url.pathname === "/") {
          const article = read(info);
          const html = article.html.replaceAll("/my-portfolio/media/" + kind + "/" + slug + "/", "/assets/");
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.end('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>本地草稿预览</title><link rel="stylesheet" href="/katex.css"><style>body{max-width:760px;margin:60px auto;padding:0 24px;background:#080d16;color:#d6dde7;font:16px/1.9 system-ui}h1,h2,h3{font-family:serif}img{max-width:100%}pre,table,.katex-display{overflow:auto}pre{padding:20px;background:#152030}a{color:#a8c5d5}td,th{padding:8px;border:1px solid #405060}small{color:#a7b0bd}</style><small>仅本机草稿预览 · 刷新查看修改 · Ctrl+C 关闭</small><h1>' + escape(article.data.title) + "</h1>" + html + "</html>");
        }
        if (url.pathname === "/katex.css") { res.setHeader("Content-Type", "text/css"); return res.end(fs.readFileSync(require.resolve("katex/dist/katex.min.css"))); }
        if (/^\/fonts\/KaTeX_[A-Za-z0-9_-]+\.(woff2?|ttf)$/.test(url.pathname)) {
          const file = path.join(path.dirname(require.resolve("katex/dist/katex.min.css")), url.pathname.slice(1));
          res.setHeader("Content-Type", url.pathname.endsWith("woff2") ? "font/woff2" : "font/woff");
          return res.end(fs.readFileSync(file));
        }
        const name = url.pathname.slice("/assets/".length);
        if (url.pathname.startsWith("/assets/") && read(info).names.includes(name)) {
          res.setHeader("Content-Type", types[path.extname(name).toLowerCase()]);
          return res.end(image(path.join(info.assets, name)));
        }
        res.writeHead(404); res.end("Not found");
      } catch { res.writeHead(400); res.end("草稿或图片校验失败，请检查本地文件。"); }
    });
    server.listen(4317, "127.0.0.1", () => console.log("仅本机预览：http://127.0.0.1:4317"));
  } else if (command === "stage") {
    const article = read(info);
    regular(info.published); regular(info.media);
    // Only explicitly referenced images leave the private draft folder.
    fs.mkdirSync(info.media, { recursive: true });
    for (const name of article.names) {
      regular(path.join(info.media, name));
      fs.copyFileSync(path.join(info.assets, name), path.join(info.media, name));
    }
    fs.writeFileSync(info.published, "---\n" + YAML.stringify({ ...article.data, draft: false }) + "---\n" + article.body);
    console.log("已准备公开内容，尚未提交或上传。请检查 diff，再执行 content:publish。");
  } else if (command === "publish") {
    const article = read(info, true);
    if (article.data.draft === true) throw new Error("草稿不能发布。");
    if (git("branch", "--show-current") !== "master") throw new Error("只允许在 master 上发布文章。");
    if (!/^(https:\/\/github\.com\/ZhansLeo\/my-portfolio(?:\.git)?|git@github\.com:ZhansLeo\/my-portfolio\.git)$/.test(git("remote", "get-url", "origin"))) throw new Error("origin 不是已确认的网站仓库。");
    if (git("diff", "--cached", "--name-only")) throw new Error("已有暂存内容，请先处理，避免混入发布。");
    const allowed = [info.published, ...article.names.map(n => path.join(info.media, n))].map(f => path.relative(ROOT, f).replaceAll("\\", "/"));
    const changed = [...git("diff", "--name-only").split("\n"), ...git("ls-files", "--others", "--exclude-standard").split("\n")].filter(Boolean);
    const generated = ["public/data/status.json", "public/data/digest.json", "public/data/agent-rules.json", "public/data/architecture.json"];
    if (changed.some(f => !allowed.includes(f) && !generated.includes(f))) throw new Error("存在其他改动，请先单独处理。发布工具不会提交无关文件。");
    git("fetch", "origin", "master");
    if (git("rev-parse", "HEAD") !== git("rev-parse", "origin/master")) throw new Error("本地与远程 master 不一致，请先手动同步；不会自动合并、强推或上传其他提交。");
    execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" });
    execFileSync(process.execPath, ["scripts/check.js"], { cwd: ROOT, stdio: "inherit" });
    git("add", "--", ...allowed);
    git("commit", "-m", "docs: 发布" + (kind === "blog" ? "博客" : "知识库") + "文章 " + slug, "-m", "新增或修订 " + slug + " 的正文、元信息及明确引用的图片。", "--", ...allowed);
    git("push", "origin", "HEAD:master");
    console.log("已推送，GitHub Pages 正在构建。请在仓库 Actions 中确认部署结果。");
  } else throw new Error("支持 new、preview、stage、publish。");
}
if (require.main === module) {
  try { run(...process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { identity, references, image };
