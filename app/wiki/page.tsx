import { wikiPages } from "./pages-data";
import Link from "next/link";
import Reveal from "../components/reveal";

export default function WikiPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">Wiki</span>
        </h1>
        <p className="mb-10 text-white/40">
          个人知识库，记录学习反思、笔记与参考资料。
        </p>
      </Reveal>

      {wikiPages.length === 0 ? (
        <Reveal>
          <p className="text-white/30">暂无 Wiki 页面。</p>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {wikiPages.map((page) => (
            <Reveal key={page.slug} stagger={0.1}>
              <Link
                href={`/wiki/pages/${page.slug}`}
                className="block rounded-2xl bg-white/5 p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="font-semibold text-white/85">{page.title}</h2>
                  {page.updated && (
                    <time className="font-mono text-xs text-white/30">
                      {page.updated}
                    </time>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {page.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}