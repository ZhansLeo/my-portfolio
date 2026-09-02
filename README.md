# 赵寒石 | 个人主页

南京大学 软件工程与工商管理双学位 · 准大二 的个人网站。记录软件工程实践、AI 研究与思考，包含博客、Wiki 知识库、学习周报、RSS 阅读等技术模块。

**线上地址**：https://zhansleo.github.io/my-portfolio/

## 功能模块

| 模块 | 说明 |
|---|---|
| 首页 / 关于我 | 个人介绍、技能与项目 |
| 博客 | `content/posts/*.md` 渲染的文章，附 RSS `feed.xml` |
| Wiki | 个人知识库，`content/wiki/*.md`，支持内部互链 |
| Papers | 论文收藏 |
| RSS | 订阅外部技术源，自动汇总 `data/rss-items/items.json` |
| 周报 | 每周论文 + Wiki 精选，数据在 `content/digest/` |
| 技术架构 | 24 小时个人 Agent 的设计文档（`docs/architecture.md`） |
| 状态 | 每次构建自动生成的计数与健康信息 |

## 技术栈

- Next.js 16（App Router，`output: "export"` 全静态导出）+ React 19 + TypeScript（strict）
- Tailwind CSS v4：无 `tailwind.config.ts`，主题在 `app/globals.css` 通过 `@theme inline` 配置
- 字体：`next/font` 加载 Geist；路径别名 `@/*` → 项目根
- 构建期数据生成：Node.js 脚本 + Python 脚本
- 部署：GitHub Pages（`basePath: /my-portfolio` + `trailingSlash: true` + `.nojekyll`）

## 快速开始

```bash
npm install
npm run dev   # 开发服务器，http://localhost:3000
```

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 开发服务器（Turbopack） |
| `npm run prebuild` | 运行全部内容/数据生成脚本，**改内容后必须执行** |
| `npm run build` | Next.js 生产构建，输出到 `out/` |
| `npm run check` | 校验 `out/` 产物：必需页面、内部链接、RSS XML |
| `npm run lint` | ESLint |

> `npm run deploy` 已废弃：原脚本指向腾讯云 CloudBase，现已由 GitHub Actions 部署 GitHub Pages 取代，仅保留作本地参考。

## 内容与数据

网站是全静态的：内容源文件 → 构建脚本 → 生成 TS/JSON 数据 → 页面在构建期引用。**改内容请改源文件，不要动生成文件。**

| 内容源（编辑这里） | 脚本 | 生成产物（已 gitignore 的标 `*`） |
|---|---|---|
| `content/posts/*.md` | `scripts/generate-blog.js` | `app/blog/posts-data.ts`\*、`public/feed.xml`\* |
| `content/wiki/*.md` | `scripts/generate-wiki.js` | `app/wiki/pages-data.ts`\* |
| `config/feeds.json`（外部订阅源） | `scripts/parse-rss.js`（联网抓取） | `data/rss-items/items.json`\* |
| `content/digest/*.json` | `scripts/build_digest.py` | `public/data/digest.json` |
| 构建时统计 | `scripts/build_status.py` | `public/data/status.json` |
| `local-data/agent.db`（SQLite） | `scripts/build_agent.py` | `public/data/agent-rules.json` |
| `docs/architecture.md` | `scripts/build_architecture.py` | `public/data/architecture.json` |

博客/Wiki 的 Markdown 使用 `---` 包裹的 frontmatter（`title`、`date`/`updated`、`description`、`tags`），正文由脚本内置的简化解析器转换（支持 `#`/`##`/`###`、列表、段落、加粗、行内代码、链接）。

## 部署

`.github/workflows/deploy.yml` 在推送到 `master` 时自动构建并部署到 GitHub Pages：

1. 仓库 Settings → Pages → Source 选择 **GitHub Actions**（一次性）
2. `git push origin master`，等待 Actions 跑完（约 2~4 分钟）
3. 访问 https://zhansleo.github.io/my-portfolio/

## Agent 系统

`agent/` 是一个独立的 Python 项目（24 小时个人 Agent），不在网站运行时使用，仅通过 `scripts/build_agent.py` 把已批准的经验规则导出到 `public/data/agent-rules.json` 供网站展示。完整设计见 `docs/architecture.md`。

## 目录结构

```
content/    博客与 Wiki 的 Markdown 源文件、周报 JSON
app/        页面与组件（Next.js App Router）
scripts/    内容生成、校验与数据构建脚本（Node + Python）
agent/      独立的 Python 个人 Agent 项目
config/     RSS 订阅源、JD 查询、技能同义词等配置
docs/       技术架构等文档
local-data/ 本地运行数据（agent.db、审批队列，已 gitignore）
public/     静态资源与生成的公开数据（`public/data/`）
```
