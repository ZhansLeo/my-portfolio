import Link from "next/link";

const projects = [
  {
    name: "个人 Agent 系统",
    kind: "当前学习重点",
    description: "围绕记忆、审批、事件通道与任务执行搭建个人 Agent，尝试把大模型从一次问答推进到可控、可追踪的持续工作流。",
    detail: "Python · Agent 架构 · Memory · Human-in-the-loop",
    href: "/agent",
    featured: true,
  },
  {
    name: "金融纠纷调解机器人",
    kind: "AI 科研实践",
    description: "将线下调解 SOP 转化为多轮对话逻辑，研究 RAG 在法律场景中的可靠性，以及如何减少模型回答偏差。",
    detail: "RAG · Embedding · 多轮对话 · 法律场景",
    href: "/papers",
  },
  {
    name: "Cartify 智能销售副驾",
    kind: "工程落地",
    description: "把销售经验整理为知识引导，以状态机控制对话阶段，并完成从 PRD、前端到大模型接口的产品闭环。",
    detail: "Next.js · LLM · 状态机 · Serverless",
    href: "https://cartifyv3.vercel.app/",
    external: true,
  },
  {
    name: "RFM 客户营销分析",
    kind: "商业与数据",
    description: "用聚类算法把抽象的客户分层理论转化为可观察的数据结果，练习数据清洗、分析和可视化。",
    detail: "Python · K-means · Plotly · RFM",
    href: "/about",
  },
];

const trails = [
  {
    title: "软件工程实践",
    description: "把复杂问题拆成边界清楚、能够验证和持续迭代的系统。",
    items: ["系统拆解", "Next.js / Python", "状态与数据流"],
  },
  {
    title: "AI 与 LLM",
    description: "关注 Agent、RAG 与多轮对话，理解模型如何进入真实工作流。",
    items: ["Agent 架构", "RAG / Embedding", "Prompt 与评估"],
  },
];

export default function Home() {
  return (
    <div className="home-shell">
      <header className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-status"><span aria-hidden="true" /> 南京大学 · 软件工程 / 工商管理</p>
          <h1 id="hero-title">让 AI 从回答问题，<br />走向执行任务。</h1>
          <p className="hero-intro">
            我是赵寒石。我正在学习如何用软件工程的方法，把 LLM、Agent
            与真实问题连接起来；也用商业思维判断，什么值得被做出来。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#work">查看实践</a>
            <Link className="text-action" href="/architecture">阅读 Agent 架构</Link>
          </div>
        </div>

        <figure className="system-map" aria-label="问题经过 LLM 和 Agent 转化为可运行系统的流程图">
          <figcaption>一次任务如何开始运行</figcaption>
          <svg viewBox="0 0 520 300" role="img" aria-hidden="true">
            <path className="map-grid" d="M48 64H472M48 150H472M48 236H472M96 35V265M260 35V265M424 35V265" />
            <path className="map-line map-line-main" d="M64 150H168C205 150 205 95 242 95H310C347 95 347 150 384 150H458" />
            <path className="map-line map-line-branch" d="M277 95V214H402" />
            <circle className="map-node node-input" cx="64" cy="150" r="7" />
            <circle className="map-node node-llm" cx="242" cy="95" r="9" />
            <circle className="map-node node-agent" cx="310" cy="95" r="11" />
            <circle className="map-node node-business" cx="277" cy="214" r="7" />
            <circle className="map-node node-output" cx="458" cy="150" r="9" />
            <circle className="map-pulse" cx="310" cy="95" r="18" />
            <circle className="map-signal" cx="64" cy="150" r="5" />
            <text x="49" y="179">问题</text><text x="224" y="72">LLM</text>
            <text x="289" y="72">Agent</text><text x="242" y="244">场景约束</text>
            <text x="416" y="179">系统</text>
          </svg>
          <p><span>signal</span> 理解、计划、执行，再回到真实结果。</p>
        </figure>
      </header>

      <aside className="coordinate-strip" aria-label="个人状态">
        <p><span>当前坐标</span> 南京大学 · 准大二</p>
        <p><span>最近在学</span> LLM / Agent / RAG</p>
        <p><span>工作方式</span> 先拆问题，再写代码</p>
      </aside>

      <main>
        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div><p className="section-kicker">Selected work</p><h2 id="work-title">正在把什么做出来</h2></div>
            <p>项目不是技术名词的陈列，而是我理解问题、试错和积累工程能力的现场。</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => {
              const className = `project-item${project.featured ? " project-featured" : ""}`;
              const content = <>
                <div className="project-topline"><span>{project.kind}</span><span className="project-open" aria-hidden="true">↗</span></div>
                <h3>{project.name}</h3><p>{project.description}</p><div className="project-detail">{project.detail}</div>
              </>;
              return project.external
                ? <a key={project.name} className={className} href={project.href} target="_blank" rel="noreferrer">{content}</a>
                : <Link key={project.name} className={className} href={project.href}>{content}</Link>;
            })}
          </div>
        </section>

        <section className="practice-section" aria-labelledby="practice-title">
          <div className="section-heading compact-heading"><div><p className="section-kicker">Practice map</p><h2 id="practice-title">两条主线，一种辅助视角</h2></div></div>
          <div className="practice-layout">
            <div className="practice-main">
              {trails.map((trail) => <article className="practice-track" key={trail.title}>
                <div className="track-mark" aria-hidden="true" />
                <div><h3>{trail.title}</h3><p>{trail.description}</p><ul>{trail.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </article>)}
            </div>
            <aside className="business-lens"><span>辅助视角</span><h3>商业思维</h3><p>不只关心模型能做什么，也追问它解决谁的问题、如何进入流程、能否创造真实价值。</p></aside>
          </div>
        </section>

        <section className="notes-section" aria-labelledby="notes-title">
          <div className="notes-copy"><p className="section-kicker">Learning in public</p><h2 id="notes-title">把学习过程留下来</h2><p>代码之外，我也记录论文、工程实验、知识笔记和每周观察。</p></div>
          <nav className="notes-links" aria-label="学习记录">
            <Link href="/blog"><span>博客</span><small>工程实践与复盘</small></Link>
            <Link href="/wiki"><span>Wiki</span><small>正在生长的知识库</small></Link>
            <Link href="/papers"><span>Papers</span><small>AI 论文阅读</small></Link>
            <Link href="/digest"><span>周报</span><small>近期输入与进展</small></Link>
          </nav>
        </section>
      </main>

      <footer className="home-footer">
        <div><p>如果你也在研究 LLM、Agent 或有趣的真实问题，欢迎交流。</p><a href="mailto:1061124482@qq.com">1061124482@qq.com</a></div>
        <a href="https://github.com/ZhansLeo" target="_blank" rel="noreferrer">GitHub / ZhansLeo</a>
      </footer>
    </div>
  );
}
