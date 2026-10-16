import { BookPage, pageMetadata } from "@/app/book/pages";
export const metadata = pageMetadata("research", "en");
export default function Page() { return <BookPage path="research"/>; }
