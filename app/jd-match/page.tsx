import Reveal from "../components/reveal";
import jdData from "../../public/data/jd-match.json";

interface SkillItem {
  skill: string;
  category: string;
  confidence?: number;
}

interface JDMatch {
  company: string;
  position: string;
  source: string;
  matched: SkillItem[];
  missing: SkillItem[];
  partial: SkillItem[];
  score: number;
  analysis: string[];
  found_keywords: string[];
}

const sourceLabel: Record<string, string> = {
  web_search: "网络搜索",
  knowledge_base: "知识库",
  no_data: "无数据",
};

export default function JDMatchPage() {
  const matches = jdData as JDMatch[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">职位匹配度</span>
        </h1>
        <p className="mb-10 text-white/40">
          对比目标岗位 JD 与个人技能，分析差距并给出学习建议。
        </p>
      </Reveal>

      {matches.length === 0 ? (
        <Reveal>
          <p className="text-white/30">暂无匹配数据，请先运行匹配脚本。</p>
        </Reveal>
      ) : (
        <div className="space-y-8">
          {matches.map((m) => (
            <Reveal key={m.company + m.position}>
              <div className="overflow-hidden rounded-2xl bg-white/5">
                <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <div>
                    <h2 className="font-semibold text-white/85">
                      {m.company} · {m.position}
                    </h2>
                    <span className="font-mono text-xs text-white/25">
                      来源：{sourceLabel[m.source] || m.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white/80">
                      {m.score}%
                    </div>
                    <div className="font-mono text-[10px] text-white/30">
                      匹配度
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="mb-2 font-mono text-xs text-emerald-300/60 uppercase">
                      已匹配 ({m.matched.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {m.matched.map((s) => (
                        <span
                          key={s.skill}
                          className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-xs text-emerald-300"
                        >
                          {s.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {m.partial.length > 0 && (
                    <div className="mb-4">
                      <h3 className="mb-2 font-mono text-xs text-amber-300/60 uppercase">
                        部分匹配 ({m.partial.length})
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {m.partial.map((s) => (
                          <span
                            key={s.skill}
                            className="rounded-full bg-amber-500/15 px-3 py-1 font-mono text-xs text-amber-300"
                          >
                            {s.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="mb-2 font-mono text-xs text-red-300/60 uppercase">
                      建议补充 ({m.missing.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {m.missing.map((s) => (
                        <span
                          key={s.skill}
                          className="rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs text-red-300/60"
                        >
                          {s.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {m.analysis.length > 0 && (
                    <div className="rounded-lg bg-white/5 p-4">
                      <h3 className="mb-2 font-mono text-xs text-white/40">
                        分析建议
                      </h3>
                      <ul className="space-y-1">
                        {m.analysis.map((a, i) => (
                          <li
                            key={i}
                            className="text-sm leading-relaxed text-white/60"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}