# 本地写作与发布

网站没有编辑入口。Markdown 草稿和未发布图片仅保存在被 Git 忽略的 `drafts/` 下；不要把私人草稿放进 `content/`、`public/`，也不要强制提交 drafts。

## 新建与预览

`npm run content:new -- blog my-first-note`

知识库将 blog 改成 wiki。文章在 `drafts/blog/my-first-note.md`。编辑标题、日期、简介、标签和正文，保持 `draft: true`。支持标题、列表、引用、表格、代码块、行内 $x^2$ 与独立行 $$ 公式。不允许执行 Markdown 中的 HTML。

图片放在同名的 `my-first-note-assets/` 文件夹，引用写成：

`![说明](/media/blog/my-first-note/result.png)`

仅引用过的 PNG/JPEG/WebP/GIF 图片会被复制公开；每张不超过 10 MB。不要把含私人信息的图片写入正文。

`npm run content:preview -- blog my-first-note`

打开终端显示的本机地址。修改后刷新；Ctrl+C 关闭。预览只监听 127.0.0.1，不会生成公开草稿网页。公式字体和样式在本地提供。

## 准备发布

`npm run content:stage -- blog my-first-note`

此操作将正文和引用图片复制到公开内容目录，设置 draft 为 false，但不会上传。检查 Git diff 后：

`npm run content:publish -- blog my-first-note`

发布助手先检查内容、执行构建及链接检查，再只提交文章与明确引用的图片并推送 master，触发 GitHub Pages。需要本机 GitHub 认证。若存在其他改动、已有暂存内容、未推送提交或远程更新，会停止并要求你先处理；不会强推或自动合并。

若推送因网络失败，提交仍保留在本机；检查该提交后手动 `git push origin master`，不要反复执行发布命令。

已有文章可以复制回对应 drafts 位置编辑，将 draft 改为 true；图片复制到对应 assets 文件夹。保留原 slug，旧网址不变。删除旧图片需要单独确认，不自动批量删除。

## 论文追踪

GitHub Actions 每六小时检查一次，距离最近成功采集不足 72 小时时跳过。到期后查询最近七天的论文，优先最近三天，最多四篇，优先覆盖两个主方向；允许相近主题，不凑数。

在 Actions 中手动运行 Deploy to GitHub Pages 可触发到期检查；需要立即采集时勾选 force_papers。采集失败保留原数据并显示失败状态，后续定时重试。无需模型 API 或收费翻译接口。

筛选词见 config/paper-topics.json。自动筛选只判断主题相关性，不代表本人读过或学术质量保证。不要把自动摘要与个人笔记混淆。

GitHub 定时调度可能延迟；长期无仓库活动时需到 Actions 确认定时任务仍启用。自动化提交只操作论文数据，部署在同一次工作流内完成，不依赖机器人提交触发第二次工作流。
