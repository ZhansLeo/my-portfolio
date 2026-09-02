const abilities = [
  {
    title: "软件工程实践",
    text: "从需求和边界开始，把问题拆成能够实现、验证和持续迭代的系统。",
    items: ["Next.js / Python", "面向对象编程", "状态机与数据流程"],
  },
  {
    title: "AI 与 LLM 研究",
    text: "围绕 Agent、RAG 和多轮对话，理解模型如何可靠地进入真实工作流。",
    items: ["Agent 架构", "RAG / Embedding", "Prompt 与模型评估"],
  },
];

const experiences = [
  ["Cartify 智能销售副驾", "德勤数字化精英挑战赛 · 全国半决赛", "负责 AI 销售话术推荐、外呼逻辑和 PRD，以状态机组织对话阶段，并完成大模型接口接入。"],
  ["金融纠纷调解机器人", "大模型法律调解研究 · 核心成员", "把线下调解 SOP 转化为多轮对话逻辑，研究 RAG 在法律场景中的可靠性与回答偏差。"],
  ["RFM 客户营销分析", "Python 数据实践", "使用 K-means 完成客户分层，把营销理论转化为可观察的数据结果和交互图表。"],
];

export default function AboutPage() {
  return (
    <div className="site-page about-page">
      <header className="page-header">
        <p className="page-kicker">About</p>
        <h1>关于我</h1>
        <p>我关注软件工程实践与 AI 研究，也尝试用商业视角理解技术应该解决什么问题。</p>
      </header>

      <main>
        <section className="about-intro" aria-labelledby="about-intro-title">
          <h2 id="about-intro-title">保持诚实地学习，也持续把东西做出来。</h2>
          <div>
            <p>你好，我是赵寒石，南京大学软件工程与工商管理双学位学生。</p>
            <p>我现在的学习重点是 LLM、Agent 和软件系统实践。我希望不只停留在调用模型，而是逐步理解记忆、工具、审批、评估和可靠性如何共同组成一个真正可用的智能系统。</p>
            <p>我的基础仍在积累中。面对陌生领域，我习惯先拆问题、做出最小版本，再通过真实结果修正理解。</p>
          </div>
        </section>

        <section className="about-section" aria-labelledby="ability-title">
          <div className="page-section-title"><p>Practice map</p><h2 id="ability-title">目前的能力主线</h2></div>
          <div className="about-abilities">
            {abilities.map((ability) => <article key={ability.title}>
              <h3>{ability.title}</h3><p>{ability.text}</p>
              <ul>{ability.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>)}
          </div>
          <aside className="about-lens"><span>辅助视角</span><strong>商业思维</strong><p>需求拆解、业务流程和价值判断，帮助我决定技术应该用在哪里。</p></aside>
        </section>

        <section className="about-section" aria-labelledby="experience-title">
          <div className="page-section-title"><p>Selected experience</p><h2 id="experience-title">项目经历</h2></div>
          <div className="about-experiences">
            {experiences.map(([name, meta, text]) => <article key={name}>
              <div><h3>{name}</h3><span>{meta}</span></div><p>{text}</p>
            </article>)}
          </div>
        </section>
      </main>

      <footer className="about-contact">
        <p>如果你也在研究 LLM、Agent 或真实世界中的软件问题，欢迎交流。</p>
        <div><a href="mailto:1061124482@qq.com">1061124482@qq.com</a><a href="https://github.com/ZhansLeo" target="_blank" rel="noreferrer">GitHub / ZhansLeo</a></div>
      </footer>
    </div>
  );
}
