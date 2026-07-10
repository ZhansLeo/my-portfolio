import { posts } from "../../posts-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/app/components/reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | 赵寒石的博客`,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <Link
          href="/blog"
          className="mb-8 inline-block font-mono text-xs text-indigo-300/60 transition-colors hover:text-indigo-300"
        >
          ← 返回博客
        </Link>

        <article className="blog-content">
          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-bold">
              <span className="text-gradient">{post.title}</span>
            </h1>
            {post.date && (
              <time className="font-mono text-sm text-white/30">
                {post.date}
              </time>
            )}
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </Reveal>
    </div>
  );
}