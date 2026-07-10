import { wikiPages } from "../../pages-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/app/components/reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return wikiPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = wikiPages.find((p) => p.slug === slug);
  if (!page) return {};
  return { title: `${page.title} | Wiki`, description: `Wiki: ${page.title}` };
}

export default async function WikiPage({ params }: Props) {
  const { slug } = await params;
  const page = wikiPages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <Link
          href="/wiki"
          className="mb-8 inline-block font-mono text-xs text-indigo-300/60 transition-colors hover:text-indigo-300"
        >
          ← 返回 Wiki
        </Link>

        <article className="blog-content">
          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-bold">
              <span className="text-gradient">{page.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {page.updated && (
                <time className="font-mono text-xs text-white/30">
                  {page.updated}
                </time>
              )}
              {page.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] text-indigo-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
        </article>
      </Reveal>
    </div>
  );
}