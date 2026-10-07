import feedData from "../../public/data/paper-feed.json";
type Paper = { id: string; version: number; title: string; authors: string[]; published: string; summary: string; url: string; topics: string[]; primaryTopic: string; related: boolean; reason: string };
type Feed = { lastAttempt: string | null; lastSuccess: string | null; status: string; message: string; batches: { id: string; createdAt: string; coverage: string[]; note: string; papers: Paper[] }[] };
const feed = feedData as Feed;
const date = (value: string) => new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
export default function PapersPage() {
  return <div className="site-page papers-page">
    <header className="page-header"><p>发现新的问题</p><h1>论文追踪</h1><p>每三天，从 arXiv 自动精选至多四篇论文，优先覆盖 AI Agent、World Models、VLM 中至少两个方向；不足时扩展相近主题。</p></header>
    <div className="papers-status"><p>自动精选根据标题与摘要的主题相关性筛选，不代表个人已读或推荐。摘要保留原文。</p><p>{feed.lastSuccess ? "最近成功检查：" + date(feed.lastSuccess) + "（北京时间）" : "尚未完成首次自动精选。"} {feed.message}</p>{feed.status === "error" && <p role="status">采集暂时失败，历史记录仍可阅读。</p>}</div>
    {feed.batches.length === 0 && <section className="paper-batch"><h2>等待首批论文</h2><p>完成采集后，论文和筛选理由会显示在这里。</p></section>}
    {feed.batches.map(batch => <section className="paper-batch" key={batch.id}><h2>{date(batch.createdAt).split(" ")[0]} · {batch.papers.length} 篇</h2>{batch.note && <p className="papers-status">{batch.note}</p>}{batch.papers.map(p => <article className="paper-entry" key={p.id}><div className="paper-tags">{p.topics.map(t => <span key={t}>{t}</span>)}{p.related && <span>相近方向</span>}<span>arXiv:{p.id}v{p.version}</span></div><h3><a href={p.url} target="_blank" rel="noopener noreferrer">{p.title} ↗</a></h3><p>{p.authors.join(", ")}</p><p>首次提交：{p.published.slice(0, 10)}</p><p className="paper-reason">{p.reason}</p><details><summary>阅读原文摘要</summary><p>{p.summary}</p></details></article>)}</section>)}
  </div>;
}
