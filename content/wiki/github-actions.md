---
title: GitHub Actions 自动部署配置
updated: 2026-07-09
tags: [devops, CI/CD, GitHub, CloudBase]
---

## 我的原话

今天配好了 GitHub Actions 自动部署。每次 push 到 main 分支，自动执行：安装依赖 → prebuild（生成博客、Wiki、RSS、状态等）→ 构建 → 检查 → 部署到 CloudBase。

## 踩坑记录

1. **Node.js 版本**：Next.js 16 需要 Node 20+，在 workflow 里要指定 `node-version: 20`
2. **Python 依赖**：`build_status.py`、`build_digest.py`、`build_agent.py` 都是纯标准库，不需要 `pip install`
3. **tcb CLI**：用 `npm install -g @cloudbase/cli` 全局安装，然后用 `tcb login --key` 用 API 密钥登录
4. **Secrets 管理**：`TCB_SECRET_ID`、`TCB_SECRET_KEY` 存在 GitHub Secrets 里，workflow 里通过 `${{ secrets.XXX }}` 引用

## 外部来源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [CloudBase CLI 文档](https://docs.cloudbase.net/cli-v1/install)
- [Wiki 首页](home)