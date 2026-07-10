const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");
const REQUIRED_PAGES = [
  "index.html",
  "about.html",
  "blog.html",
  "blog/posts/hello-agent.html",
  "rss-reader.html",
  "papers.html",
  "wiki.html",
  "wiki/pages/home.html",
  "wiki/pages/skill-reflection.html",
  "status.html",
  "feed.xml",
  "404.html",
];

let passed = 0;
let failed = 0;

function ok(msg) { passed++; console.log(`  PASS  ${msg}`); }
function fail(msg) { failed++; console.error(`  FAIL  ${msg}`); }

function exists(filePath) {
  return fs.existsSync(path.join(OUT_DIR, filePath));
}

function readHtml(filePath) {
  return fs.readFileSync(path.join(OUT_DIR, filePath), "utf-8");
}

function extractLinks(html) {
  const links = [];
  const re = /<a\s[^>]*href="([^"]*)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    links.push({ href: m[1], pos: m.index });
  }
  return links;
}

function resolveLink(href, baseFile) {
  if (href.startsWith("http://") || href.startsWith("https://")) return null;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (href.startsWith("#")) return null;

  let target;
  if (href.startsWith("/")) {
    target = href.replace(/^\//, "");
  } else {
    target = path.join(path.dirname(baseFile), href).replace(/\\/g, "/");
  }

  if (!target || target === ".") return "index.html";
  if (!target.endsWith(".html") && !target.includes(".")) {
    return target.replace(/\/$/, "") + ".html";
  }
  return target;
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
        throw new Error(`Mismatched tag: </${tagName}>`);
      }
      stack.pop();
    } else if (!fullTag.endsWith("/>") && !fullTag.endsWith("?>")) {
      stack.push(tagName);
    }
  }
  if (stack.length > 0) throw new Error(`Unclosed tags: ${stack.join(", ")}`);
  return true;
}

function main() {
  console.log("=== Check 1: Required Pages ===\n");

  if (!fs.existsSync(OUT_DIR)) {
    fail("out/ directory not found. Run `npm run build` first.");
    console.log(`\nResult: ${passed} passed, ${failed} failed`);
    process.exit(1);
  }

  for (const page of REQUIRED_PAGES) {
    if (exists(page)) {
      ok(page);
    } else {
      fail(`${page} — MISSING`);
    }
  }

  console.log("\n=== Check 2: Internal Links ===\n");

  const htmlFiles = REQUIRED_PAGES.filter((f) => f.endsWith(".html"));
  for (const htmlFile of htmlFiles) {
    const html = readHtml(htmlFile);
    const links = extractLinks(html);
    for (const link of links) {
      const target = resolveLink(link.href, htmlFile);
      if (target === null) continue;
      if (exists(target)) {
        ok(`${htmlFile} -> ${link.href}  (${target})`);
      } else {
        fail(`${htmlFile} -> ${link.href}  (resolved: ${target}) — NOT FOUND`);
      }
    }
  }

  console.log("\n=== Check 3: RSS XML ===\n");

  try {
    const xml = readHtml("feed.xml");
    validateXml(xml);
    ok("feed.xml is valid XML");

    const itemCount = (xml.match(/<item>/gi) || []).length;
    if (itemCount > 0) {
      ok(`feed.xml contains ${itemCount} <item> tag(s)`);
    } else {
      fail("feed.xml has no <item> tags");
    }
  } catch (err) {
    fail(`feed.xml XML validation: ${err.message}`);
  }

  console.log(`\n=== Result: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main();