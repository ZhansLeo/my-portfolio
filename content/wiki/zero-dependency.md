---
title: 零依赖原则实践总结
updated: 2026-07-08
tags: [principle, engineering, dependency]
---

## 我的原话

这个项目从第一天起就定了一条规矩：**零第三方依赖**。不是反框架，而是想通过这个项目验证一个假设——在 2026 年，Node.js 和 Python 标准库已经足够强大，大部分个人项目不需要引入外部库。

## 实践结果

到目前为止，整个项目没有引入任何第三方库：

- **Markdown 解析**：手写正则，支持标题、段落、链接、列表、代码块
- **RSS 2.0 生成**：纯字符串拼接 XML，附带 XML 验证器
- **arXiv API 调用**：Python 标准库 `urllib` + `xml.etree.ElementTree`
- **数据库**：SQLite（Python 标准库自带）
- **样式**：Tailwind CSS v4（唯一的外部工具，但它是构建时工具，不产生运行时依赖）

## 反思

零依赖的代价是某些功能实现比较"简陋"，但好处是：
- 代码完全可控，没有任何供应链风险
- 构建速度极快
- 包体积极小
- 学习曲线陡峭但收获大——每个功能都理解了底层原理

## 外部来源

- [Wiki 首页](home)
- [从零实现 Markdown 到 RSS 的博客系统](/blog/posts/markdown-to-rss)