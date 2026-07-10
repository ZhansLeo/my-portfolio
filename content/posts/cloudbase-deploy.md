---
title: 把网站部署到 CloudBase 静态托管
date: 2026-07-10
description: Next.js 静态导出 + GitHub Actions 自动部署到腾讯云 CloudBase。
---

# 把网站部署到 CloudBase 静态托管

这个网站是 Next.js 构建的，但我不想跑 Node.js 服务器，所以选择了 `output: "export"` 静态导出方案。

## 部署流程

1. `next.config.ts` 设置 `output: "export"`
2. `npm run build` 生成 `out/` 目录
3. 用 `tcb hosting deploy out` 推送到 CloudBase
4. GitHub Actions 在每次 push 时自动触发

## 为什么选 CloudBase

- 静态托管免费额度足够个人网站用
- 自带 CDN，国内访问快
- 和腾讯云其他服务打通，后续如果加后端不用迁移

## 一次踩坑

静态导出不支持 `next/image` 的 `Image` 组件，因为图片优化需要运行时服务端。解决方式是全部用原生 `<img>` 标签，或者用 `next/image` 的 `unoptimized` 属性。