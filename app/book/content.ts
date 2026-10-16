import { researchProjects } from "../research/projects";

export type Language = "en" | "zh";
export const base = "/my-portfolio";
export function url(path = "", language: Language = "en") {
  return `${base}${language === "zh" ? "/zh" : ""}/${path.replace(/^\/+|\/+$/g, "")}${path ? "/" : ""}`;
}
export const copy = {
  en: {
    name: "Hanshi Zhao", university: "Nanjing University", degrees: ["Software Engineering", "Business Administration"],
    nav: ["Home", "Research", "Projects", "Notes", "Personal"],
    intro: [
      "I’m an undergraduate at Nanjing University, majoring in Software Engineering and pursuing a second degree in Business Administration. I’m familiar with requirements analysis and engineering practice, and my studies have given me a grounding in economics. Studying both has helped me think more clearly about what I want to build and how to bring it into the world.",
      "My research interests include world models, embodied intelligence, visual understanding, and video generation. I hope to discover new things by exploring ideas and trying them out. Lately, I’ve been paying particular attention to vision-and-language navigation (VLN).",
      "I love exploring, making things, and exchanging ideas. I’d like to build things that are a little cooler, and a little more useful."
    ],
    personalTitle: "A little more about me",
    personal: [
      "AI is moving quickly and becoming part of everyday life. Sometimes it feels as though software engineering needs less and less human involvement. But I still think there’s something it can’t do without: human taste—the judgment and feeling that shape what we want to make.",
      "Coding agents have made it much easier to turn an idea into something real. What they build may meet the requirements, yet still feel different from the picture we first had in our heads. I’m grateful that agents let me see my ideas take shape. And I’d like to keep learning how to make something that feels like what I imagined in the first place.",
      "I don’t have a long list of hobbies. I like listening to music, lying in the sun on a stretch of grass, wandering through a city, or spending an afternoon in a café. Sometimes I just want to slow down and notice what’s around me.",
      "If you’d like to talk, build something together, or explore a new question, I’d love to hear from you."
    ],
    contactTitle: "Let’s talk.", contact: "Have a question, an idea, or something you’d like to make together? I’d love to hear from you.",
    all: "View all", read: "Read more", notesDescription: "Notes on things I’m learning, with room to revise. These entries are written in Chinese.",
    researchDescription: "Two independent learning projects, including what worked, what didn’t, and what I still don’t know.",
    projectsDescription: "Things I’ve helped build, from a sales assistant to experiments with financial data.",
    portrait: "Portrait to come", preview: "Preview · portrait pending", updated: "Updated", chinese: "Articles in Chinese", empty: "No notes yet.",
    researchLabels: ["The question", "How I tested it", "Results", "My contribution", "Limits", "What’s next"],
    independent: "Independent learning project · unpublished", results: "Frozen experimental results from the public project record", source: "Code, protocols, and original results", sourceNote: "Metric definitions and reproduction conditions are documented in the repository.",
  },
  zh: {
    name: "赵寒石", university: "南京大学", degrees: ["软件工程", "工商管理（第二学位）"],
    nav: ["首页", "研究", "项目", "笔记", "关于自己"],
    intro: [
      "我是一名本科学生，来自南京大学。我主修软件工程，熟悉需求分析和工程实践，同时以工商管理为第二学位，有经济学的基本知识。双学位的背景让我对想要做什么、怎么进一步落地有了更清晰的认识。",
      "在科研方面，我对世界模型、具身智能、视觉理解和视频生成感兴趣，希望能在实践和探索中发现新的东西。最近在重点关注 VLN（视觉语言导航）。",
      "热爱探索、实践、交流，渴望做出更酷、更有价值的东西。"
    ],
    personalTitle: "再多说一点关于我",
    personal: [
      "目前，AI 奔涌向前，嵌入我们的生活里。软件工程似乎越来越不需要人类的参与，但是我认为它离不开人类的 taste——我们对想做的东西的判断、审美和感受。",
      "把脑子中的想法变成现实，coding agent 帮我们大大简化了。它做出来的东西会符合我们的要求，却很难和我们大脑中最初浮现的想象吻合。我感谢 agent 能让我看见想法落地，我也希望我自己能做出来自己最初想要的东西。",
      "我的爱好不多，也许习惯听听歌，喜欢躺在大草地上晒太阳，也希望在街上漫步感受城市，在咖啡馆里坐着感受午后。有些时候，想要慢下来看看身边是什么。",
      "如果想和我聊聊，或者希望一起做出什么新东西、新发现，欢迎交流！"
    ],
    contactTitle: "欢迎交流。", contact: "如果你有想聊的问题、想探索的想法，或想一起做点什么，欢迎联系我。",
    all: "查看全部", read: "阅读详情", notesDescription: "学习过程中的笔记、问题与参考资料，也留出继续修订的空间。",
    researchDescription: "两项独立完成的科研学习实践。记录方法、失败与证据，也保留结论的边界。",
    projectsDescription: "从销售辅助系统到金融数据实验，记录我参与构建和验证的东西。",
    portrait: "照片待补充", preview: "预览版 · 照片待补充", updated: "更新于", chinese: "中文笔记", empty: "还没有笔记。",
    researchLabels: ["研究的问题", "如何验证", "实验结果", "我完成的工作", "结论的边界", "下一步的问题"],
    independent: "独立完成 · 科研学习实践 · 未发表", results: "冻结实验结果，数据来自项目公开记录", source: "查看代码、实验协议与原始结果", sourceNote: "指标定义与复现条件以仓库记录为准。",
  }
};

const englishResearch: typeof researchProjects = [
  {
    slug: "planning-execution-failures", title: "Where planning and execution fail in LLM agents", period: "September 2026 — ongoing",
    question: "When an agent fails to finish a task, is the problem in planning, gathering evidence, or execution?",
    finding: "Explicit planning changed delivery and stopping behavior, but did not consistently solve final correctness. In this implementation, post-hoc verification added cost without a net improvement in the final pass rate.",
    methods: "Controlled experiments / tool use / failure diagnosis", repo: researchProjects[0].repo,
    intro: "I used long-horizon travel planning with multiple constraints to examine evidence gathering, execution control, entity grounding, and global constraint satisfaction in tool-augmented agents. Travel is the test setting; the question is where the system breaks down.",
    design: "TravelPlanner compares four settings on the same 180 validation problems: direct planning with official reference information (TP-A), a ReAct agent that retrieves its own evidence (TP-B), an explicit Planner (TP-C), and an independent TP-C chain followed by a Verifier and at most one Replan (TP-D). ChinaTravel provides a smaller mechanism check on 12 paired problems.",
    columns: ["Setting", "Delivery rate", "Final pass rate", "Tokens / problem"],
    rows: [["TP-A · supplied evidence", "95.0%", "13.89%", "10.9k"], ["TP-B · ReAct", "35.0%", "15.56%", "57.6k"], ["TP-C · Planner", "40.0%", "16.11%", "56.0k"], ["TP-D · Verifier", "41.67%", "16.11%", "63.0k"]],
    observations: ["Moving from supplied evidence to independent evidence gathering exposed problems with stopping control and failure to deliver.", "A structurally valid plan does not guarantee faithful execution or sufficient evidence.", "In ChinaTravel, some apparent efficiency gains came from stopping too early; execution traces are needed to interpret them."],
    limitations: "TP-A and TP-B change evidence acquisition, system responsibility, and interaction together; this is not a causal ablation of tools alone. ChinaTravel has only 12 paired samples and is not used for benchmark ranking. These conclusions apply only to the recorded models, protocols, and implementation. They do not establish that planners or verifiers are ineffective in general.",
    contribution: "I implemented the experiments, tool adapters, evaluation orchestration, layered metrics, and error categories, and documented frozen results, representative cases, and reproduction instructions.",
    next: "Continue separating insufficient evidence, stopping control, and constraint enforcement, and test whether earlier verification helps. New experiments will use explicitly separate protocols rather than being folded into the frozen results."
  },
  {
    slug: "small-llm-math-reasoning-lab", title: "Math reasoning in a small language model", period: "August — September 2026",
    question: "Does a better-formatted answer mean a model is actually better at reasoning?",
    finding: "LoRA fine-tuning raised strict format compliance above 99%, while mathematical accuracy fell. Error-guided sampling showed no significant advantage over random sampling.",
    methods: "Frozen evaluation / LoRA / paired statistics / error analysis", repo: researchProjects[1].repo,
    intro: "Using Qwen2.5-0.5B-Instruct and GSM8K, I built an experimental loop from baseline evaluation and error diagnosis to prompt interventions, fine-tuning, and re-evaluation on a frozen test set. The aim was to understand what each intervention changed, rather than chase a single high score.",
    design: "The evaluation uses 200 pre-frozen GSM8K test items, IDs 101–300, with greedy decoding and evaluator v4 fixed. It compares the base model, randomly sampled LoRA-SFT, and error-guided LoRA-SFT under Prompt A and structured Prompt C.",
    columns: ["Model", "Prompt A accuracy", "Prompt C accuracy", "Strict format A / C"],
    rows: [["Base model", "47.0%", "41.0%", "0% / 0%"], ["Random SFT", "34.5%", "30.0%", "99% / 99%"], ["Error-guided SFT", "35.5%", "31.5%", "99% / 100%"]],
    observations: ["Under Prompt A, error-guided SFT exceeded random SFT by only one percentage point. McNemar’s test gave p=0.8679, with no evidence of a stable difference.", "Of the base model’s 106 failures, relation-modeling errors accounted for 57.5% and arithmetic errors for 10.4%.", "Structured Prompt C reduced nominal accuracy in all three settings, but the paired A/C differences were not statistically significant."],
    limitations: "The conclusions are limited to this model, these prompts, the 1,000-sample LoRA setting, and the 200-item holdout. Error categories used model-assisted annotation with consistency spot checks, not complete human annotation. The frozen test set must not be reused for tuning and then reported as final performance.",
    contribution: "I built the inference backend, answer parser, sampling and training pipeline, unified evaluation, paired statistical analysis, and error analysis, preserving configurations, data manifests, and frozen results.",
    next: "Investigate relation modeling further. Any additional training or strategy selection should be validated on a new holdout, with format compliance and mathematical accuracy reported separately."
  }
];
export function research(language: Language) { return language === "zh" ? researchProjects : englishResearch; }

export const projects = {
  en: [
    { slug: "cartify", title: "Cartify", subtitle: "An intelligent sales copilot", period: "April — May 2026", role: "Core developer", description: "A sales assistant that connects live conversation support with customer records, with human intervention built into the workflow.", paragraphs: ["I helped organize sales processes, customer intentions, and brand rules into a business ontology. State control and human intervention connect lead screening, real-time conversation assistance, and CRM information extraction.", "Using Next.js and Serverless APIs, we integrated DeepSeek and deployed the end-to-end system.", "The project reached the national semifinals of the Deloitte Digital Elite Challenge."], link: "https://cartifyv3.vercel.app/", linkText: "Open the live demo" },
    { slug: "market-microstructure", title: "Market microstructure", subtitle: "Factors and minute-level return prediction", period: "August 2026", role: "Core team member", description: "Experiments with transaction-level data, market factors, and the limits of short-horizon prediction.", paragraphs: ["I worked with roughly 32 GB of transaction-level data to build a dataset spanning 302 trading days and 270 stocks. We studied activity, momentum, buy-side volume share, and volatility factors using IC, stratified backtests, and return decomposition.", "In the project’s time-series split, the LSTM achieved an AUC of 0.6783, compared with 0.6137 for logistic regression. Feature ablations, time-period robustness checks, and transaction-cost backtests were used to examine the limits of these signals.", "These are results from specific experiments, not evidence of real investment returns. The tools included Python, Polars, and LSTM models."], link: "mailto:1061124482@qq.com", linkText: "Ask me about this project" }
  ],
  zh: [
    { slug: "cartify", title: "Cartify", subtitle: "智能销售副驾", period: "2026 年 4—5 月", role: "核心开发", description: "连接实时对话辅助与客户记录，在销售工作流中保留人的判断与干预。", paragraphs: ["把销售流程、客户意图与品牌规则组织为业务本体，以状态控制和人在环中干预串联线索筛选、实时对话辅助与 CRM 信息萃取。", "使用 Next.js 与 Serverless API 接入 DeepSeek，完成端到端系统并部署。", "项目进入德勤数字化精英挑战赛全国半决赛。"], link: "https://cartifyv3.vercel.app/", linkText: "访问在线演示" },
    { slug: "market-microstructure", title: "市场微观结构", subtitle: "因子研究与分钟级收益预测", period: "2026 年 8 月", role: "核心成员", description: "从逐笔成交数据出发，研究市场因子与短期预测信号的有效边界。", paragraphs: ["处理约 32 GB 逐笔成交数据，构建覆盖 302 个交易日、270 只股票的数据集；研究活跃度、动量、主买占比和波动率等因子，以 IC、分层回测和收益拆分分析信号。", "在项目的时间序列切分测试中，LSTM 的 AUC 为 0.6783，Logistic Regression 为 0.6137；进一步通过特征消融、时段稳健性和交易成本回测检查有效边界。", "这些是特定实验结果，不代表实际投资收益。使用的工具包括 Python、Polars 与 LSTM 模型。"], link: "mailto:1061124482@qq.com", linkText: "与我聊聊这个项目" }
  ]
};
