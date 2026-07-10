import Reveal from "../components/reveal";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">关于我</span>
        </h1>
        <p className="text-white/40">更多关于我的信息即将上线，敬请期待。</p>
      </Reveal>
    </div>
  );
}