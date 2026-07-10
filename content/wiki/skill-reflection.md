---
title: Skill 课堂反思：论文收集
updated: 2026-07-10
tags: [skill, paper, agent, learning, arXiv]
---

## 我的原话

今天在课堂上第一次接触了"自定义 Skill"的概念。之前我以为和 Agent 协作就是写 prompt，但今天的实践让我意识到：Skill 本质上是把一套可复用的工作流和约束条件打包成模块。

我们做了一个论文收集的 Skill，核心流程是：读取主题映射表 → 调用 arXiv API → 解析 XML → 用 arXiv ID 去重 → 检查每篇论文的六个必填字段 → 运行验证脚本。这个流程让我联想到之前写 PRD 的体验——把模糊需求拆成一步步可验证的操作。

我最大的收获是"验证"这一步。以前写代码，我经常是"跑起来就行"，但今天 Skill 里强制要求运行 `check_papers.py`，检查 id、title、authors、published、summary、url 六个字段是否齐全，URL 是否来自 arXiv。这种"写完就验"的习惯，我觉得应该用到以后所有项目里。

另外，关于 arXiv ID 去重而不是标题去重这一点，我开始觉得标题去重更直观，但实际操作时发现论文标题经常有细微差异（比如 arXiv 版本号不同导致的标题微调），用 ID 去重确实是更可靠的做法。

## Agent 总结

本次实践完成了以下工作：

1. **Skill 搭建**：创建了 `research-paper-collector` Skill，包含 `references/topics.md`（主题到查询词映射）、`scripts/collect_papers.py`（arXiv API 调用与解析）、`scripts/check_papers.py`（数据验证）。
2. **数据收集**：以 `all:"AI agent" OR all:"LLM agent"` 为查询词，从 arXiv 拉取 10 篇最新论文，发布时间 2026-07-08 ~ 2026-07-09。
3. **质量保障**：通过 arXiv ID 去重（10 篇全部为新论文）、六字段完整性检查、URL 来源校验三步验证，全部通过。
4. **页面展示**：将论文数据接入 `/papers` 页面，卡片式展示，支持点击跳转 arXiv 原文。

技术要点：
- arXiv API 返回 Atom XML 格式，需解析 `atom:entry`、`atom:title`、`atom:author` 等命名空间元素。
- `collect_papers.py` 用 `xml.etree.ElementTree` 解析，无第三方依赖。
- `check_papers.py` 作为独立验证脚本，确保数据质量，退出码 0 表示通过。

## 外部来源

- [arXiv API 使用指南](https://arxiv.org/help/api)
- [arXiv 论文: Formal Mechanisms for Market Stability](https://arxiv.org/abs/2607.08652v1)
- [Wiki 首页](home)