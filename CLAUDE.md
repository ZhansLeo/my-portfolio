# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for 赵寒石 (Nanjing University, software engineering + business admin). Next.js **static export** (`output: "export"` in `next.config.ts`) deployed to Tencent CloudBase hosting. Site content is Chinese; keep new copy consistent.

## Commands

- `npm run dev` — dev server (Turbopack, http://localhost:3000)
- `npm run prebuild` — runs all content/data generator scripts (see Architecture). **Required before every build** — generated artifacts are gitignored, so a fresh checkout must run this first.
- `npm run build` — `next build`
- `npm run check` — validates `out/`: required pages exist, internal links resolve, `feed.xml` is well-formed. Requires `out/` to exist (build first).
- `npm run lint` — ESLint (flat config; generated data files and `scripts/**` are ignored)
- `npm run deploy` — prebuild + build + check + `tcb hosting deploy out -e my-portfolio-d3g4m2j50a17c3d18`

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict). Path alias `@/*` → project root.
- Tailwind CSS v4 — **no `tailwind.config.ts`**; theme is defined in `app/globals.css` via `@theme inline` (fonts/colors). Site CSS (dark bg `#0a0e27`, `.text-gradient`, `.nebula-glow`, `.reveal`, `.blog-content`) lives in that same file.
- Markdown is converted by hand-rolled parsers in the generator scripts — the pages render raw HTML via `dangerouslySetInnerHTML`. Only `#`/`##`/`###` headings, `- ` lists, paragraphs, `**bold**`, `` `code` ``, and `[text](url)` links are supported.

## Architecture: content → generators → static data

The site is fully static. Markdown/JSON sources are transformed by scripts in `scripts/` into TS modules and JSON that pages import directly at build time. **To change site content, edit the source files and re-run `npm run prebuild`** — do not edit generated files by hand (they are gitignored and overwritten).

| Source (edit these) | Script | Generated artifact (gitignored unless noted) |
|---|---|---|
| `content/posts/*.md` | `scripts/generate-blog.js` | `app/blog/posts-data.ts`; also writes `public/feed.xml` (site's own RSS, gitignored) |
| `content/wiki/*.md` | `scripts/generate-wiki.js` | `app/wiki/pages-data.ts`; wiki links `[x](slug)` become `/wiki/pages/<slug>` |
| `config/feeds.json` (external feeds) | `scripts/parse-rss.js` (live network fetch) | `data/rss-items/items.json` |
| `content/digest/papers.json` + `wiki.json` | `scripts/build_digest.py` (validates required fields, note ≤200 chars) | `public/data/digest.json` (committed) |
| build-time counters | `scripts/build_status.py` (sanitizes secrets from error logs) | `public/data/status.json` (committed) |
| `local-data/agent.db` (SQLite) | `scripts/build_agent.py` | `public/data/agent-rules.json` (committed) |
| `docs/architecture.md` | `scripts/build_architecture.py` (markdown → JSON elements) | `public/data/architecture.json` (committed) |

Blog/wiki markdown files use YAML-style frontmatter (`title`, `date`/`updated`, `description`, `tags`) between `---` lines. Frontmatter parsing is regex-based; keep values simple.

`scripts/match-jd.py` fetches job descriptions from DuckDuckGo and writes `public/data/jd-match.json` (committed). It is **not** part of `prebuild` — run it manually when JDs need re-matching.

## Agent system (`agent/`)

Separate Python package: a "24-hour personal agent" that ingests messages from Feishu/WeCom/email, applies a security policy, calls an LLM, queues replies for human approval, and accumulates approved rules in SQLite. It feeds the site only via `scripts/build_agent.py` (export approved rules to `public/data/agent-rules.json`). See `docs/architecture.md` for the full design.

Flow (`agent/worker.py:handle`): dedup (SHA256 event_id) → `policy.evaluate()` (allowlist → rate limit 5/60s → high-risk-word detection; returns `reject`/`draft`/`approval`) → `prompts.build_messages()` (injects system rules + approved lessons + retrieval evidence) → `llm.call_llm()` (NJUSE Hub API, `deepseek-v4-pro`, requires `NJUSE_API_KEY` env) → write draft to `local-data/approval-queue.jsonl`.

State lives in gitignored `local-data/` (`agent.db`, `approval-queue.jsonl`). Key modules: `events.py` (Event dataclass), `inbound.py`/`email_inbox.py` (channel adapters), `memory.py` (SQLite, candidate/approved two-stage lessons), `review.py` (interactive approval CLI), `responder.py`/`channels.py` (Feishu/WeCom/SMTP outbound), `run_once.py` (single-run entry), `demo_loop.py` (offline end-to-end demo). Secrets come from env vars (`FEISHU_WEBHOOK`, `WECOM_WEBHOOK`, `SMTP_*`, `IMAP_*`, `NJUSE_API_KEY`).

## Deployment

`.github/workflows/deploy.yml` runs on push to `main`: `npm ci` → install CloudBase CLI → `tcb login` with secrets → `npm run prebuild && npx next build` → `npm run check` → `tcb hosting deploy out`. `npm run deploy` does the same locally.

## Conventions

- **Git commits**: messages in Chinese, format `类型: 简要描述`. Types: `feat`(新功能) `fix`(修复) `docs`(文档) `refactor`(重构) `style`(样式调整). Body must describe what changed from the previous commit (not vague phrases like "update").
- **Design**: dark indigo/violet theme, `max-w-3xl` content column, `font-mono` labels, scroll animations via `app/components/reveal.tsx` (IntersectionObserver → `.revealed` class). `Reveal` accepts a `stagger` prop for list items.
