import Reveal from "../components/reveal";
import items from "@/data/rss-items/items.json";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  sourceUrl: string;
  category: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.slice(0, 10);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr.slice(0, 10);
  }
}

export default function RssReaderPage() {
  const typedItems = items as FeedItem[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">RSS 阅读器</span>
        </h1>
        <p className="mb-10 text-white/40">
          订阅技术博客与研究团队的 RSS 内容，自动汇总更新。
        </p>
      </Reveal>

      {typedItems.length === 0 ? (
        <Reveal>
          <p className="text-white/30">暂无内容，请检查订阅源配置。</p>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {typedItems.map((item, i) => (
            <Reveal key={`${item.link}-${i}`} stagger={0.05}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-white/5 p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
                    {item.source}
                  </span>
                  {item.pubDate && (
                    <time className="font-mono text-[11px] text-white/25">
                      {formatDate(item.pubDate)}
                    </time>
                  )}
                </div>
                <h2 className="mb-1 font-semibold text-white/80">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-white/45">
                    {item.description}
                  </p>
                )}
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}