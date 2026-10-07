import Link from "next/link";
import { researchProjects } from "./research/projects";
import { posts } from "./blog/posts-data";
import { wikiPages } from "./wiki/pages-data";
import Ambient from "./components/ambient";
import paperFeed from "../public/data/paper-feed.json";

const paperBatches = paperFeed.batches as { papers: { id: string; title: string; url: string; published: string }[] }[];

export default function Home() {
  return <div className="portfolio">
    <Ambient />
    <header className="identity">
      <p className="identity-school">南京大学</p>
      <h1>赵寒石</h1>
      <p className="identity-degree">软件工程与工商管理双学位 <span>大二</span></p>
      <p className="identity-intro">关注智能体的执行可靠性与语言模型的推理。<br />在实验、代码与真实问题之间，逐步建立自己的理解。</p>
      <div className="identity-links"><a href="#research">科研实践</a><Link href="/about">关于我</Link><a href="https://github.com/ZhansLeo" target="_blank" rel="noreferrer">GitHub</a></div>
      <a className="scroll-note" href="#research">向下阅读 <span aria-hidden="true">↓</span></a>
    </header>
    <section className="chapter research-chapter" id="research" aria-labelledby="research-title">
      <div className="chapter-intro"><h2 id="research-title">从问题出发，<br />让实验给出回答。</h2><p>两项独立完成的科研学习实践。记录方法、失败与证据，也保留结论的边界。</p></div>
      <div className="research-list">{researchProjects.map(project => <article className="research-entry" key={project.slug}>
        <div className="entry-meta"><span>个人研究实践</span><span>{project.period}</span></div>
        <h3><Link href={`/research/${project.slug}`}>{project.title}</Link></h3>
        <p className="research-question">{project.question}</p>
        <p className="research-finding">{project.finding}</p>
        <div className="entry-bottom"><span>{project.methods}</span><Link href={`/research/${project.slug}`}>阅读实验记录 ↗</Link></div>
      </article>)}</div>
    </section>
    <section className="chapter" id="practice" aria-labelledby="practice-title">
      <div className="chapter-intro"><h2 id="practice-title">把理解带进实践。</h2><p>从业务流程到数据实验，关心系统如何运行，也关心判断如何被验证。</p></div>
      <div className="practice-pair">
        <article><p className="entry-meta">工程实践 · 核心开发</p><h3>Cartify<br />智能销售副驾</h3><p>将销售流程与知识组织为业务本体，以状态控制和人在环中干预连接对话辅助与客户记录，完成端到端部署。</p><p className="practice-note">德勤数字化精英挑战赛 · 全国半决赛</p><a href="https://cartifyv3.vercel.app/" target="_blank" rel="noreferrer">访问在线演示 ↗</a></article>
        <article><p className="entry-meta">数据研究 · 核心成员</p><h3>市场微观结构<br />与分钟级收益预测</h3><p>处理逐笔成交数据，构建微观结构因子，结合时间序列切分、特征消融与交易成本回测，分析预测信号的有效边界。</p><p className="practice-note">Python / Polars / LSTM / 因子分析</p><Link href="/about#experience">了解项目经历 ↗</Link></article>
      </div>
      <p className="quiet-link">也在持续搭建个人 Agent 系统。<Link href="/architecture">查看架构记录</Link></p>
    </section>
    <section className="chapter writing-chapter" aria-labelledby="writing-title">
      <div className="chapter-intro"><h2 id="writing-title">留下思考的过程。</h2><p>博客记录一次探索，知识库沉淀一种理解，论文追踪打开新的问题。</p></div>
      <nav className="writing-doors" aria-label="学习记录"><Link href="/blog"><h3>博客</h3><p>实验、复盘与日常思考</p></Link><Link href="/wiki"><h3>知识库</h3><p>概念、方法与持续修订的笔记</p></Link><Link href="/papers"><h3>论文追踪</h3><p>每三天，至多四篇自动精选</p></Link></nav>
      <div className="recent-notes">{posts.slice(0, 2).map(post => <Link key={post.slug} href={`/blog/posts/${post.slug}`}><span>博客</span><strong>{post.title}</strong><time>{post.date}</time></Link>)}{wikiPages.filter(p => p.slug !== "home").slice(0, 1).map(p => <Link key={p.slug} href={`/wiki/pages/${p.slug}`}><span>知识库</span><strong>{p.title}</strong><time>{p.updated}</time></Link>)}</div>
      {paperBatches[0] && <div className="recent-notes" aria-label="最近自动精选论文">{paperBatches[0].papers.slice(0, 2).map(p => <a key={p.id} href={p.url} target="_blank" rel="noreferrer"><span>论文</span><strong>{p.title}</strong><time>{p.published.slice(0, 10)}</time></a>)}</div>}
    </section>
    <footer className="portfolio-footer"><h2>欢迎交流。</h2><p>关于智能体、模型推理，或你正在探索的问题。</p><a href="mailto:1061124482@qq.com">1061124482@qq.com</a><div><span>南京大学 · 赵寒石</span><Link href="/about">更多关于我</Link></div></footer>
  </div>;
}
