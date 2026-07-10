import Reveal from "../components/reveal";
import rulesData from "../../public/data/agent-rules.json";

interface Rule {
  id: number;
  trigger: string;
  rule: string;
}

export default function AgentPage() {
  const rules = rulesData as Rule[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">Agent 经验库</span>
        </h1>
        <p className="mb-10 text-white/40">
          24 小时个人 Agent 从日常交互中学习并沉淀的经验规则，人工审批后生效。
        </p>
      </Reveal>

      {rules.length === 0 ? (
        <Reveal>
          <div className="rounded-2xl bg-white/5 p-10 text-center">
            <p className="font-mono text-sm text-white/30">
              暂无经验规则。运行 Agent 后，审批通过的规则将自动出现在这里。
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, i) => (
            <Reveal key={rule.id} stagger={0.05 * i}>
              <div className="rounded-2xl bg-white/5 p-6 transition-colors hover:bg-white/[0.07]">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[10px] text-indigo-300">
                    #{rule.id}
                  </span>
                  <span className="font-mono text-xs text-white/60">
                    {rule.trigger}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/70">{rule.rule}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}