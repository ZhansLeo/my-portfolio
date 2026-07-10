---
title: 从零实现 Markdown 到 RSS 的博客系统
date: 2026-07-08
description: 不用任何第三方框架，用纯 Node.js 实现博客生成和 RSS 2.0 输出。
---

# 从零实现 Markdown 到 RSS 的博客系统

在做这个个人网站时，我给自己定了一条规矩：**零第三方依赖**。博客系统自然也不能用 Hexo、Gatsby 这些框架。

## 整体架构

```
content/posts/*.md → scripts/generate-blog.js → app/blog/posts/[slug]/page.tsx
                                               → public/feed.xml (RSS 2.0)
```

## 三个核心模块

### 1. 解析 frontmatter

用正则 `/^---\n([\s\S]*?)\n---\n([\s\S]*)/` 提取 YAML 头部和正文，手写一个极简的 YAML 解析器处理 `key: value` 格式。

### 2. Markdown 渲染

只处理了标题、段落、链接、列表、代码块五种语法，用正则逐行替换。不需要完整的 Markdown 引擎，80% 的场景用 20% 的功能就够了。

### 3. RSS 2.0 生成

RSS 2.0 本质是 XML，按规范拼出 `<channel>`、`<item>` 等标签即可。写完之后还写了一个 XML 验证器，确保输出合法。

## 反思

这个过程中最大的收获不是博客功能本身，而是**对"框架"祛魅**——很多看起来复杂的功能，用原生 API 实现并不难，而且代码量更少、更可控。