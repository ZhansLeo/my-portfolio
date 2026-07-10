import Reveal from "../components/reveal";
import digestData from "../../public/data/digest.json";

interface PaperEntry {
  title: string;
  url: string;
  published: string;
  note: string;
}

interface WikiEntry {
  title: string;
  url: string;
  note: string;
}

export default function DigestPage() {
  const data = digestData as { papers: PaperEntry[]; wiki: WikiEntry[]; generated: string };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <p className="mb-2 font-mono text-xs tracking-[0.2em] text-indigo-300/50 uppercase">
          WEEKLY DIGEST
        </p>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">我的 Agent 学习周报</span>
        </h1>
        <p className="mb-10 text-white/40">
          每周从论文和 Wiki 中精选 3+3 条学习内容，由 Research Agent 和 Wiki Agent 协作生成。
        </p>
      </Reveal>

      <section aria-labelledby="paper-digest" className="mb-12">
        <h2 id="paper-digest" className="mb-6 flex items-center gap-2 font-mono text-sm tracking-wider text-white/40">
          <span className="text-indigo-400/40">01</span>
          <span className="h-px flex-1 bg-white/5" />
          本周论文
        </h2>
        <div className="space-y-4">
          {data.papers.map((paper) => (
            <Reveal key={paper.url} stagger={0.1}>
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-white/5 p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
                    arXiv
                  </span>
                  <time className="font-mono text-[11px] text-white/25">
                    {paper.published}
                  </time>
                </div>
                <h3 className="mb-1.5 font-semibold text-white/80 leading-snug">
                  {paper.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/45">
                  {paper.note}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="wiki-digest">
        <h2 id="wiki-digest" className="mb-6 flex items-center gap-2 font-mono text-sm tracking-wider text-white/40">
          <span className="text-indigo-400/40">02</span>
          <span className="h-px flex-1 bg-white/5" />
          本周 Wiki
        </h2>
        <div className="space-y-4">
          {data.wiki.map((entry) => (
            <Reveal key={entry.title} stagger={0.1}>
              <a
                href={`/${entry.url}`}
                className="block rounded-2xl bg-white/5 p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-violet-500/15 px-2 py-0.5 font-mono text-[10px] text-violet-300">
                    Wiki
                  </span>
                </div>
                <h3 className="mb-1.5 font-semibold text-white/80 leading-snug">
                  {entry.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/45">
                  {entry.note}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <footer className="mt-12 border-t border-white/5 pt-6 text-center font-mono text-xs text-white/20">
          {data.generated.slice(0, 16)}
        </footer>
      </Reveal>
    </div>
  );
}