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
- Single-page portfolio for 赵寒石
- `app/page.tsx` — main page content
- `app/layout.tsx` — root layout with Geist fonts, `lang="zh-CN"`
- GitHub: `git@github.com:ZhansLeo/my-portfolio.git`

## Git Commit Convention
- Commit messages in Chinese, format: `类型: 简要描述`
  - Types: `feat`(新功能) `fix`(修复) `docs`(文档) `refactor`(重构) `style`(样式调整)
- Body must describe **what changed from the previous commit**, not vague phrases like "update" or "fix bug"


## Others
1. 只用原生HTML、CSS；禁止外部框架；
2. 正文宽度最多800px；
3. HTML采用语义标签；CSS单独文件；
4. 文件结构规范：页面放在pages文件夹，md文章放在articles文件夹。