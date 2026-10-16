import { notFound } from "next/navigation";
import { BookPage, pageMetadata, paths } from "@/app/book/pages";
type Props = { params: Promise<{ locale: string; segments?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() { return paths.map(p => ({ locale: "zh", segments: p ? p.split("/") : [] })); }
export async function generateMetadata({ params }: Props) { const { segments } = await params; return pageMetadata((segments || []).join("/"), "zh"); }
export default async function Page({ params }: Props) { const { locale, segments } = await params; if (locale !== "zh") notFound(); return <BookPage path={(segments || []).join("/")} language="zh"/>; }
