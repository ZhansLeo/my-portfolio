import { BookPage, pageMetadata } from "@/app/book/pages";
export const metadata = pageMetadata("personal", "en");
export default function Page() { return <BookPage path="personal"/>; }
