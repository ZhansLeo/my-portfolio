import { posts } from "./posts-data";
import Link from "next/link";
import Reveal from "../components/reveal";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-gradient">博客</span>
        </h1>
        <p className="mb-10 text-white/40">
          记录我的学习、实验和思考。
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal>
          <p className="text-white/30">还没有文章，敬请期待。</p>
        </Reveal>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => (
            <Reveal key={post.slug} stagger={0.1}>
              <Link
                href={`/blog/posts/${post.slug}`}
                className="block rounded-2xl bg-white/5 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h2 className="mb-1 font-semibold text-white/85">
                  {post.title}
                </h2>
                {post.date && (
                  <time className="mb-2 block font-mono text-xs text-white/30">
                    {post.date}
                  </time>
                )}
                {post.description && (
                  <p className="text-sm leading-relaxed text-white/50">
                    {post.description}
                  </p>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}