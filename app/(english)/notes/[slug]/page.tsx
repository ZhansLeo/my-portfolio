import { BookPage, pageMetadata, paths } from "@/app/book/pages";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return paths.filter(p => p.startsWith("notes/")).map(p => ({ slug: p.split("/")[1] })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; return pageMetadata("notes/" + slug, "en"); }
export default async function Page({ params }: Props) { const { slug } = await params; return <BookPage path={"notes/" + slug}/>; }
