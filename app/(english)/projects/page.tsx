import { BookPage, pageMetadata } from "@/app/book/pages";
export const metadata = pageMetadata("projects", "en");
export default function Page() { return <BookPage path="projects"/>; }
