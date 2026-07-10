import Reveal from "../components/reveal";
import statusData from "../../public/data/status.json";

interface StatusEntry {
  run_id: string;
  timestamp: string;
  counts: {
    blog_posts: number;
    wiki_pages: number;
    papers: number;
    pages: number;
  };
  errors: string[];
}

export default function StatusPage() {
  const data = statusData as { history: StatusEntry[] };
  const latest = data.history[0];

  if (!latest) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Reveal>
          <h1 className="mb-4 text-3xl font-bold">
            <span className="text-gradient">网站状态</span>
          </h1>
          <p className="text-white/30">暂无状态数据。</p>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">网站状态</span>
        </h1>
        <p className="mb-10 text-white/40">
          每次构建自动生成，由 <code className="rounded bg-white/10 px-1 font-mono text-xs">build_status.py</code> 写入，前端不可伪造。
        </p>
      </Reveal>

      <Reveal>
        <div className="mb-8 rounded-2xl bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs text-white/40">当前构建</span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
              {latest.errors.length === 0 ? "HEALTHY" : "DEGRADED"}
            </span>
          </div>
          <h2 className="mb-2 font-mono text-sm text-white/60 break-all">
            {latest.run_id}
          </h2>
          <time className="font-mono text-xs text-white/25">
            {latest.timestamp}
          </time>
        </div>
      </Reveal>

      <Reveal stagger={0.1}>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "文章", value: latest.counts.blog_posts },
            { label: "Wiki", value: latest.counts.wiki_pages },
            { label: "论文", value: latest.counts.papers },
            { label: "页面", value: latest.counts.pages },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/5 p-5 text-center"
            >
              <div className="mb-1 text-2xl font-bold text-white/80">
                {item.value}
              </div>
              <div className="font-mono text-xs text-white/30">{item.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {latest.errors.length > 0 && (
        <Reveal>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="mb-3 font-mono text-sm text-red-300">
              错误日志 ({latest.errors.length})
            </h3>
            <ul className="space-y-1 font-mono text-xs text-red-200/60">
              {latest.errors.map((err, i) => (
                <li key={i} className="break-all">
                  {err}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {data.history.length > 1 && (
        <Reveal>
          <details className="mt-8 rounded-2xl bg-white/5 p-6">
            <summary className="cursor-pointer font-mono text-sm text-white/40 select-none">
              历史记录 ({data.history.length})
            </summary>
            <div className="mt-4 space-y-2">
              {data.history.slice(1).map((entry) => (
                <div
                  key={entry.run_id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
                >
                  <span className="font-mono text-xs text-white/40 break-all">
                    {entry.run_id}
                  </span>
                  <span className="font-mono text-[10px] text-white/25">
                    {entry.timestamp.slice(0, 16)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        </Reveal>
      )}
    </div>
  );
}