const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const FEEDS_PATH = path.join(__dirname, "..", "config", "feeds.json");
const OUT_DIR = path.join(__dirname, "..", "data", "rss-items");
const OUT_FILE = path.join(OUT_DIR, "items.json");
const MAX_ITEMS_PER_FEED = 20;
const REQUEST_TIMEOUT = 15000;

function fetchUrl(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 3) { reject(new Error("too many redirects")); return; }
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { timeout: REQUEST_TIMEOUT }, (res) => {
      if (res.statusCode >= 301 && res.statusCode <= 308 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        resolve(fetchUrl(next, redirects + 1));
        return;
      }
      if (res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  if (!m) return "";
  let text = m[1];
  const cdata = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  if (cdata) text = cdata[1];
  return decodeEntities(text);
}

function parseRSS(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    const description = extractTag(block, "description");
    if (title && link) {
      items.push({ title, link, pubDate, description: stripHtml(description).slice(0, 300) });
    }
  }
  return items;
}

function parseAtom(xml) {
  const items = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRe.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const linkM = block.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/i);
    const link = linkM ? linkM[1] : "";
    const pubDate = extractTag(block, "published") || extractTag(block, "updated");
    const description = extractTag(block, "summary") || extractTag(block, "content");
    if (title && link) {
      items.push({ title, link, pubDate, description: stripHtml(description).slice(0, 300) });
    }
  }
  return items;
}

function parseFeed(xml) {
  if (/<rss|<rdf/i.test(xml)) return parseRSS(xml);
  if (/<feed/i.test(xml)) return parseAtom(xml);
  throw new Error("Unrecognized feed format");
}

async function main() {
  if (!fs.existsSync(FEEDS_PATH)) {
    console.log("config/feeds.json not found, skipping RSS parsing.");
    return;
  }

  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf-8"));
  const allItems = [];
  let total = 0;
  let failed = 0;

  for (const feed of feeds) {
    try {
      console.log(`Fetching: ${feed.title} (${feed.url})`);
      const xml = await fetchUrl(feed.url);
      const items = parseFeed(xml).slice(0, MAX_ITEMS_PER_FEED);
      for (const item of items) {
        item.source = feed.title;
        item.sourceUrl = feed.url;
        item.category = feed.category || "";
      }
      allItems.push(...items);
      console.log(`  -> ${items.length} items`);
      total += items.length;
    } catch (err) {
      console.error(`  × Failed: ${err.message}`);
      failed++;
    }
  }

  allItems.sort((a, b) => (b.pubDate || "").localeCompare(a.pubDate || ""));

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(allItems, null, 2), "utf-8");

  console.log(`\nTotal: ${total} items from ${feeds.length} feed(s)${failed > 0 ? ` (${failed} failed)` : ""}`);
  console.log(`Saved to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});