import Reveal from "../components/reveal";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">关于我</span>
        </h1>
      </Reveal>

      <Reveal>
        <section className="relative mb-28 overflow-hidden rounded-2xl px-6 py-10 md:px-10">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute top-[10%] left-[15%] h-[500px] w-[500px] rounded-full opacity-30 blur-[100px]"
              style={{
                background:
                  "radial-gradient(circle, #6366f1 0%, transparent 70%)",
                animation: "float-glow 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-[40%] right-[10%] h-[600px] w-[600px] rounded-full opacity-25 blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, #a855f7 0%, transparent 70%)",
                animation: "float-glow 12s ease-in-out infinite 2s",
              }}
            />
            <div
              className="absolute bottom-[5%] left-[30%] h-[450px] w-[450px] rounded-full opacity-20 blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle, #ec4899 0%, transparent 70%)",
                animation: "float-glow 10s ease-in-out infinite 4s",
              }}
            />
          </div>
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-indigo-300/50 uppercase">
            ABOUT ME
          </p>
          <h2 className="mb-8 flex items-center gap-2 font-mono text-sm tracking-wider text-white/40">
            <span className="text-indigo-400/60">01</span>
            <span className="h-px flex-1 bg-white/5" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent -rotate-[2deg] text-2xl font-bold">
              关于我
            </span>
          </h2>
          <div className="space-y-6 text-sm leading-relaxed text-white/60 md:text-base">
            <p>
              你好，我是赵寒石。在大一这一年里，我修读了 C
              语言、Java、Python 以及微观/宏观经济学等跨学科课程。
            </p>
            <p>
              在学习过程中，我发现自己对<b className="text-white/90">
                如何用软件工程的方法去解决具体的商业/业务问题
              </b>有着浓厚的兴趣。目前，我正在努力克服专业课上的难点，并尝试利用课余时间，通过
               AI 辅助编程和一些动手实践，把课本上的理论变成可以运行的小程序。
            </p>
            <p>
              我深知自己目前的底子还很薄，面对复杂的开发工作也经常觉得像在面对&ldquo;黑箱&rdquo;。但我愿意保持朴实的态度，通过多动手、多踩坑，一步步积累写代码和做产品的真本事。
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal stagger={0.1}>
        <section className="mb-28">
          <h2 className="mb-6 flex items-center gap-2 font-mono text-sm tracking-wider text-white/40">
            <span className="text-indigo-400/40">02</span>
            <span className="h-px flex-1 bg-white/5" />
            技能
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "编程与开发基础",
                icon: "💻",
                chipColor: "bg-indigo-500/20 text-indigo-300",
                items: [
                  "C / Java / Python",
                  "面向对象编程 (OOP)",
                  "Next.js + Tailwind CSS",
                  "AI 辅助编程 (Cursor, Claude Code)",
                ],
              },
              {
                title: "软件工程与业务分析",
                icon: "📋",
                chipColor: "bg-violet-500/20 text-violet-300",
                items: [
                  "需求工程 & 商业模式画布",
                  "PRD / 业务流程图",
                  "LLM 接入 & Prompt 调试",
                  "RAG 检索增强生成",
                ],
              },
              {
                title: "商科与数据处理",
                icon: "📊",
                chipColor: "bg-purple-500/20 text-purple-300",
                items: [
                  "微观/宏观经济学",
                  "Python 数据清洗",
                  "K-means 聚类分析",
                  "Matplotlib / Plotly 可视化",
                ],
              },
            ].map((group) => (
              <div
                key={group.title}
                className="rounded-2xl bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${group.chipColor}`}
                >
                  {group.icon}
                </div>
                <h3 className="mb-3 font-mono text-base font-semibold text-white/50">
                  {group.title}
                </h3>
                <ul className="space-y-2 text-sm text-white/60">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-indigo-400/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal stagger={0.15}>
        <section className="mb-28">
          <h2 className="mb-6 flex items-center gap-2 font-mono text-sm tracking-wider text-white/40">
            <span className="text-indigo-400/40">03</span>
            <span className="h-px flex-1 bg-white/5" />
            项目
          </h2>
          <div className="space-y-6">
            {[
              {
                name: "Cartify 智能销售副驾",
                subtitle: "德勤数字化精英挑战赛 · 全国半决赛",
                work: "负责 AI 销售话术推荐与外呼逻辑设计，撰写 PRD 文档。用 Next.js + Tailwind CSS 搭建前端，通过 Serverless API 接入 DeepSeek 大模型，将销冠经验做成 JSON 知识引导，用状态机控制对话阶段跳转。",
                insight:
                  "第一次面对高压交付，学会了团队配合、清晰表达，以及如何把商业点子拆解成技术逻辑。",
                link: "https://cartifyv3.vercel.app/",
                tags: ["Next.js", "DeepSeek", "Serverless", "PRD"],
              },
              {
                name: "金融纠纷调解机器人",
                subtitle: "大模型法律调解研究 · 核心成员",
                work: "梳理花呗/借呗金融纠纷的线下调解 SOP，将复杂法律规则转化为多轮对话核心逻辑。调研 RAG 技术在法律场景的可行性，学习收集清洗法律条款并导入向量数据库，以减少大模型法律回答偏差。",
                insight:
                  "逻辑严密，向量数据库和 Embedding 是全新领域，正在努力攻克消化中。",
                tags: ["RAG", "向量数据库", "LLM", "多轮对话"],
              },
              {
                name: "RFM 客户精准营销系统",
                subtitle: "Python 数据练习项目",
                work: "基于 RFM（近度、频度、额度）模型，用 Python 调用 K-means 算法对模拟客户数据进行聚类，分为高价值、活跃、潜在、流失四个圈层。用 Plotly / Matplotlib 制作可交互 3D 图表。",
                insight:
                  "把课本上抽象的营销圈层理论变成看得见的代码和图表，锻炼了数据预处理和可视化动手能力。",
                tags: ["Python", "K-means", "Plotly", "RFM"],
              },
            ].map((project) => (
              <div
                key={project.name}
                className="rounded-2xl bg-white/5 p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white/85">
                    {project.name}
                  </h3>
                  <span className="font-mono text-xs text-white/30">
                    {project.subtitle}
                  </span>
                </div>
                <p className="mb-2 text-sm leading-relaxed text-white/60">
                  {project.work}
                </p>
                <p className="mb-3 text-xs italic leading-relaxed text-white/35">
                  {project.insight}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[10px] text-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto font-mono text-xs text-indigo-300 underline underline-offset-2 transition-colors hover:text-indigo-200"
                    >
                      体验 →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <footer>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-sm tracking-wider text-white/40">
            <span className="text-indigo-400/40">04</span>
            <span className="h-px flex-1 bg-white/5" />
            联系方式
          </h2>
          <div className="flex flex-col gap-2 font-mono text-sm text-white/50">
            <p>
              <span className="text-white/30">tel</span>{" "}
              <a
                href="tel:+8617512666050"
                className="transition-colors hover:text-indigo-300"
              >
                +86 175 1266 6050
              </a>
            </p>
            <p>
              <span className="text-white/30">mail</span>{" "}
              <a
                href="mailto:1061124482@qq.com"
                className="transition-colors hover:text-indigo-300"
              >
                1061124482@qq.com
              </a>
            </p>
            <p>
              <span className="text-white/30">github</span>{" "}
              <a
                href="https://github.com/ZhansLeo"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-indigo-300"
              >
                ZhansLeo
              </a>
            </p>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}