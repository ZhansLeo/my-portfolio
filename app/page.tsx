export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 py-20">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-3">赵寒石</h1>
        <p className="text-lg text-zinc-500">全栈开发者 · 热爱技术与创造</p>
      </section>

      {/* 三个关键词 */}
      <section className="flex flex-wrap justify-center gap-4 mb-16">
        {[
          { emoji: "⚛️", label: "React / Next.js" },
          { emoji: "🦀", label: "Rust" },
          { emoji: "📐", label: "系统设计" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium shadow-sm"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      {/* 项目卡片 */}
      <section className="w-full max-w-md mb-16">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          项目
        </h2>
        <div className="rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-1">Playground</h3>
          <p className="text-sm text-zinc-500 mb-4">
            个人项目集合，包含 CLI 工具、Web 应用和实验性代码。
          </p>
          <div className="flex gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              TypeScript
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              Next.js
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              Tailwind
            </span>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <footer className="text-center text-sm text-zinc-400">
        <p>
          📧 zhaohanshi@example.com &nbsp;·&nbsp;{" "}
          <a
            href="https://github.com/zhaohanshi"
            className="underline underline-offset-2 hover:text-zinc-600"
          >
            github.com/zhaohanshi
          </a>
        </p>
      </footer>
    </div>
  );
}
