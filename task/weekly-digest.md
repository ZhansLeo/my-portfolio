新功能由四个任务组成：

|角色	|输入	|输出	|允许修改|
|----|----|----|-----|
|Research Agent	|data/papers.json	|本周论文摘要	|content/digest/papers.json|
|Wiki Agent	Wiki |索引	|本周新增概念	|content/digest/wiki.json|
|UI Agent	|两份 JSON	|周报生成器	|scripts/build_digest.py、相关 CSS|
|Test Agent	|完整工作树	|检查报告	|只读，不修改|


# Weekly Digest

## 用户功能

生成一页本周学习周报，包括 3 篇论文、3 个 Wiki 概念和对应原文链接。

## 共享约束

- 不虚构论文结论；
- 所有摘要必须链接来源；
- 每个 Agent 只修改分配的文件；
- 不允许自行提交、push 或合并；
- 最终由协调者运行完整测试。

## 验收标准

- 周报在手机端可阅读；
- 每个条目有来源；
- 没有断链；
- 网站测试全部通过。


----

多agent实行

## 协调者 Prompt

请阅读 AGENTS.md 和 tasks/weekly-digest.md。
把任务拆成 Research、Wiki、UI、Test 四个独立子任务。
为每个角色明确输入、输出、可修改文件和完成条件。
确认不存在同文件写冲突后才并行执行。
汇总时检查 git diff，并运行完整构建和测试；任何子任务失败都不能宣称整体完成。

## 两个内容 Agent 的独立 Prompt

Research Agent：
只读取 data/papers.json，只写 content/digest/papers.json。
选择发布日期最新且字段完整的 3 篇论文。
每项输出 title、url、published、note；note 只能压缩原摘要，最多 100 个汉字，
不能声称论文已经同行评审，不能修改任何 HTML。
写完后重新解析 JSON，证明它语法有效。

Wiki Agent：
只读取 data/wiki-index.json，只写 content/digest/wiki.json。
选择 3 个最近学习的概念，每项输出 title、url、note。
note 必须来自 Wiki 原文，最多 100 个汉字；没有证据时跳过，不能补写想象内容。
写完后重新解析 JSON，证明它语法有效。

## 内容 Agent 的输出 Schema
content/digest/papers.json：
```
[
  {
    "title": "A Study of Human-Agent Collaboration",
    "url": "https://arxiv.org/abs/0000.00000",
    "published": "2026-09-20",
    "note": "研究人类与 Agent 在协作任务中的分工方式。"
  }
]
```

content/digest/wiki.json：
```
[
  {
    "title": "Agent Loop",
    "url": "wiki/agent-loop.html",
    "note": "观察、行动、验证并决定是否继续的有限循环。"
  }
]
```

## UI Agent 实现确定性生成器
scripts/build_digest.py：完成脚本，实现对页面的生成

生成后的 digest.html 核心结构如下，帮助学生把“源数据”和“生成结果”对应起来：
```
<main class="page">
  <p class="eyebrow">WEEKLY DIGEST</p>
  <h1>我的 Agent 学习周报</h1>
  <section aria-labelledby="paper-digest">
    <h2 id="paper-digest">本周论文</h2>
    <div id="digest-papers"></div>
  </section>
  <section aria-labelledby="wiki-digest">
    <h2 id="wiki-digest">本周 Wiki</h2>
    <div id="digest-wiki"></div>
  </section>
</main>
```

## Test Agent 只读验证
