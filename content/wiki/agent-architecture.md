---
title: 24 小时个人 Agent 架构设计
updated: 2026-07-10
tags: [agent, architecture, LLM, memory]
---

## 我的原话

今天在搭建 24 小时个人 Agent 时，我画了一个简单的架构图。核心思路是：Agent 不是聊天机器人，而是以"事件"为最小处理单元的工作流引擎。

流程是这样的：外部消息（飞书/企微/邮箱）→ 入站适配器统一成 Event 对象 → 策略引擎检查安全性 → LLM 生成回复草稿 → 人工审批 → 发送回复 → 经验入库。

## 关键设计决策

1. **事件去重用 SHA256**：把 `渠道|发送者|内容` 拼接后哈希，杜绝重复处理
2. **经验库用 SQLite**：轻量、零配置、单文件，适合个人 Agent
3. **人工审批是必须的**：LLM 生成的回复在发送前必须经过人工确认，这是安全底线
4. **策略引擎做三层防护**：发送者白名单、频率限制（60 秒内同发送者最多 3 条）、高危词检测

## Agent 总结

架构采用"事件驱动 + 人工审批"模式，确保 Agent 在自动化处理的同时不失安全性。每个模块独立可测试，`demo_loop.py` 提供端到端闭环演示。

## 外部来源

- [Agent 架构参考：OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Wiki 首页](home)
- [Skill 课堂反思：论文收集](skill-reflection)