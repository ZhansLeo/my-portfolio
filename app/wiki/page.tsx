import Reveal from "../components/reveal";

export default function WikiPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">Wiki</span>
        </h1>
        <p className="text-white/40">个人 Wiki 知识库即将上线，敬请期待。</p>
      </Reveal>
    </div>
  );
}