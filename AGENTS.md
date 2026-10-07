# AGENTS.md

## Commands
- `npm run dev` — start dev server (Turbopack, http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config)

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Tailwind CSS v4** — no `tailwind.config.ts`; config is in `app/globals.css` via `@theme inline`
- Path alias: `@/*` → project root

## Repo
- Personal research and engineering portfolio for 赵寒石
- `app/page.tsx` — main page content
- `app/layout.tsx` — root layout with self-hosted Noto Serif SC / Noto Sans SC, `lang="zh-CN"`
- GitHub: `git@github.com:ZhansLeo/my-portfolio.git`

## Git Commit Convention
- Commit messages in Chinese, format: `类型: 简要描述`
  - Types: `feat`(新功能) `fix`(修复) `docs`(文档) `refactor`(重构) `style`(样式调整)
- Body must describe **what changed from the previous commit**, not vague phrases like "update" or "fix bug"


## 实现约定
- 保持 Next.js App Router、React、TypeScript 与 GitHub Pages 静态导出的技术栈。
- 可按需求引入必要依赖；保留语义结构、独立样式、响应式与无障碍支持。
- 沿用 app 和 content 目录，不做无关迁移。
- 草稿不得进入公开仓库或静态产物，发布工具只操作明确指定的文章和资源。
