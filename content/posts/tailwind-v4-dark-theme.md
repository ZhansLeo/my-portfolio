---
title: 用 Tailwind CSS v4 给个人网站做深色科技风
date: 2026-07-09
description: 从零配置 Tailwind v4 的新特性，打造一套蓝紫单色系的深色科技风格。
---

# 用 Tailwind CSS v4 给个人网站做深色科技风

Tailwind CSS v4 最大的变化是取消了 `tailwind.config.ts`，所有配置都通过 `@theme inline` 写在 CSS 里。这让我在搭建个人网站时少了一层心智负担。

## 深色科技风的几个要点

- **背景色**：用 `#0a0e27` 深蓝黑，不是纯黑，带一点蓝调
- **主色调**：`indigo` 系列，从 300 到 500 做渐变
- **发光效果**：`radial-gradient` 叠加 `backdrop-blur`，模拟星云光晕
- **字体**：Geist Sans + Geist Mono，中文用系统默认

## 踩坑记录

1. `@theme inline` 里定义的变量要加 `--color-` 前缀才能在 Tailwind 类名里用
2. `bg-white/5` 这种半透明叠加在深色背景上效果很好，比纯色卡片更轻盈
3. 动画用 `@keyframes` 自定义，不要引入第三方动画库

## 总结

Tailwind v4 的零配置理念很契合"少即是多"的设计哲学，特别是对这种个人项目，省去了大量样板配置。