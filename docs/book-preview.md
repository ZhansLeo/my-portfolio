# 暖白书页改版：预览与维护

当前只在本地实施，未推送或部署。首页使用用户提供的手绘肖像，发布前确认文案与交互效果。

## 本地预览

```sh
npm run build:preview
npm run preview
```

打开 http://localhost:4173/my-portfolio/ 。中文首页为 http://localhost:4173/my-portfolio/zh/ 。

`build:preview` 使用真实生产构建，但不刷新外部 RSS、状态或周报数据。原有 `npm run build` 及定时任务仍保留。

## 内容与页面

- `app/book/content.ts`：完整英中首页介绍、Personal 正文、栏目文案和项目内容。中文以用户提供的文字为底稿，英文按第一人称自然表达。
- `app/research/projects.ts`：保留原始中文研究记录；对应英文在 `app/book/content.ts`，表格数字必须一致。
- `content/wiki/*.md`：Notes 唯一正文来源，全部保持中文。`README.md` 是编辑规则，不发布。`home.md` 保留为索引页，但不进入最近文章列表。
- `app/book/notes-data.ts`：由 `scripts/generate-notes.js` 生成，不直接编辑、不提交；只改写站内知识库链接为同语言导航下的 Notes 地址。
- `app/book/book.css`：暖白配色、字体、响应式和纸页转场。
- `app/(english)/` 和 `app/[locale]/`：英文与中文入口，使用独立根布局保证初始 HTML 的语言正确。公开地址不包含路由组名称。

默认英文。中文地址添加 `/zh/`，语言切换保留当前内容。英文 Notes 列表和首页笔记区使用 `content/note-listings.en.json` 中的英文标题、摘要与标签；中文列表保留原文。点击进入详情后，两套导航下的文章标题、摘要、标签和正文均保持中文，正文设置 `lang="zh-CN"`。

旧博客、关于、论文、RSS、状态和周报保留原地址，标明历史归档。旧知识库跳转对应中文 Notes，保留 hash，并提供无 JavaScript 时可点击的备用链接。

## 验证

```sh
npm run lint
npm run build:preview
npm run check
npm run test:content
```

`check` 包含静态站点链接检查、双语地址及 HTML 语言检查、七篇笔记正文保真检查、实验数值配对检查和归档链接检查。

手动检查：1440、1024、390、360px 宽度；手机菜单开关和 Escape；同页语言切换、返回；长笔记表格与公式；减少动态效果；禁用 JavaScript 后的正文和链接。

同语言站内导航使用 Next 客户端路由，鼠标悬停、键盘聚焦或触摸时预加载目的页。点击立即抬起当前纸页，目标内容就绪后沿左侧轴立体翻开；桌面约 560ms，手机约 430ms。导航栏保持可操作，连续点击会取消旧动画。减少动态效果时直接切换；外链、锚点和新标签页不拦截。语言切换保留跨文档淡入淡出，不支持动画时正常导航。

## 发布前

肖像位于 `public/images/hanshi-portrait.png`，保持桌面 144×184、手机 96×124 的椭圆裁切。确认中英文介绍、研究记录及 Personal 表达，再执行既有发布流程。
