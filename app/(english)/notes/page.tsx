import { BookPage, pageMetadata } from "@/app/book/pages";
export const metadata = pageMetadata("notes", "en");
export default function Page() { return <BookPage path="notes"/>; }
