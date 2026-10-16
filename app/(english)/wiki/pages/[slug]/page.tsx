import LegacyNote from "@/app/book/legacy-note";
import { notes } from "@/app/book/notes-data";
import { notFound } from "next/navigation";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return notes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; return { title: "知识库已搬到笔记 | 赵寒石", alternates: { canonical: `https://zhansleo.github.io/my-portfolio/zh/notes/${slug}/` } }; }
export default async function Page({ params }: Props) { const { slug } = await params; if (!notes.some(n => n.slug === slug)) notFound(); return <LegacyNote slug={slug}/>; }
