import Link from "next/link";
import { researchProjects } from "../research/projects";
export default function AboutPage() {
  return <div className="site-page research-document about-new">
    <header className="page-header"><p>关于我</p><h1>赵寒石</h1><p>南京大学 · 软件工程与工商管理双学位 · 大二</p></header>
    <section><h2>在研究与实践中学习。</h2><p>我关注多模态智能与交互式智能系统。目前的个人实践集中在 LLM Agent 的规划与执行可靠性，以及小参数语言模型的数学推理评测。</p><p>我习惯把一个问题拆成可以验证的假设，写出最小实验，再通过结果和失败案例修正理解。软件工程帮助我把实验组织成可复现的系统，工商管理的学习则让我关注技术所处的业务流程与使用情境。</p><p>世界模型、视觉理解与生成、智能体决策和 AI4Science 是我希望继续探索的方向；它们是研究兴趣，不代表已经完成对应研究。</p></section>
    <section><h2>教育背景</h2><p>南京大学 · 软件工程与工商管理双学位<br />2025.09 — 2029.07（预计）</p><p>GPA 4.62 / 5.00，排名前 4.76%<br /><small>根据个人简历记录，非实时成绩。</small></p><p>相关课程包括软件工程与计算、数据结构与算法、数据库系统概论、计算机组织结构，以及微观经济学、宏观经济学。</p></section>
    <section><h2>科研学习实践</h2><p>以下项目均为独立完成的学习与实验实践，尚未发表。</p>{researchProjects.map(p => <article className="about-project" key={p.slug}><h3><Link href={`/research/${p.slug}`}>{p.title}</Link></h3><p className="entry-meta">{p.period}</p><p>{p.finding}</p><Link href={`/research/${p.slug}`}>方法、结果与局限 ↗</Link></article>)}</section>
    <section id="experience"><h2>工程与数据实践</h2><article className="about-project"><h3>A 股市场微观结构因子研究与分钟级收益预测</h3><p className="entry-meta">2026.08 · 核心成员</p><p>处理约 32 GB 逐笔成交数据，构建覆盖 302 个交易日、270 只股票的数据集；研究活跃度、动量、主买占比和波动率等因子，以 IC、分层回测和收益拆分分析信号。</p><p>在项目的时间序列切分测试中，LSTM 的 AUC 为 0.6783，Logistic Regression 为 0.6137；进一步通过特征消融、时段稳健性和交易成本回测检查有效边界。这些是特定实验结果，不代表实际投资收益。</p></article><article className="about-project"><h3>Cartify 智能销售副驾</h3><p className="entry-meta">2026.04 — 2026.05 · 核心开发 · 德勤数字化精英挑战赛全国半决赛</p><p>把销售流程、客户意图与品牌规则组织为业务本体，以状态控制和人在环中干预串联线索筛选、实时对话辅助与 CRM 信息萃取。使用 Next.js 与 Serverless API 接入 DeepSeek，完成端到端系统并部署。</p><a href="https://cartifyv3.vercel.app/" target="_blank" rel="noreferrer">访问在线演示 ↗</a></article><details><summary>其他学习实践</summary><p>持续搭建个人 Agent 系统，探索记忆、审批和任务执行；也曾参与金融纠纷调解机器人实践，以及 RFM 客户营销分析。</p><Link href="/architecture">阅读个人 Agent 架构</Link></details></section>
    <section><h2>使用的方法与工具</h2><dl className="skills-list"><dt>模型与实验</dt><dd>PyTorch、Transformers、PEFT / LoRA、ReAct、RAG、模型评测、错误分析与配对统计</dd><dt>数据与编程</dt><dd>Python、Pandas、Polars、SQL、Java、C / C++</dd><dt>软件与协作</dt><dd>Git、GitHub Actions、Next.js、Serverless API 与可复现实验管理</dd></dl></section>
    <footer className="research-source"><p>欢迎交流研究问题、实验经验或工程实践。</p><a href="mailto:1061124482@qq.com">1061124482@qq.com</a><a href="https://github.com/ZhansLeo" target="_blank" rel="noreferrer">GitHub / ZhansLeo</a></footer>
  </div>;
}
