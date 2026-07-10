import Reveal from "../components/reveal";
import papers from "../../public/data/papers.json";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  published: string;
  summary: string;
  url: string;
}

export default function PapersPage() {
  const typedPapers = papers as Paper[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">Research Papers</span>
        </h1>
        <p className="mb-10 text-white/40">
          通过 arXiv API 自动收集 AI Agent 领域最新论文，每日更新。
        </p>
      </Reveal>

      {typedPapers.length === 0 ? (
        <Reveal>
          <p className="text-white/30">暂无论文，请先运行论文收集脚本。</p>
        </Reveal>
      ) : (
        <div className="space-y-5">
          {typedPapers.map((paper) => (
            <Reveal key={paper.id} stagger={0.05}>
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
                    arXiv
                  </span>
                  <span className="font-mono text-[10px] text-white/25">
                    {paper.id}
                  </span>
                  <time className="font-mono text-[11px] text-white/25">
                    {paper.published}
                  </time>
                </div>
                <h2 className="mb-1.5 font-semibold text-white/80 leading-snug">
                  {paper.title}
                </h2>
                <p className="mb-2 font-mono text-xs text-white/30">
                  {paper.authors.join(", ")}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-white/45">
                  {paper.summary}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}