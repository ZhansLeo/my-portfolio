import RootLayout from "@/app/book/root-layout";
export { metadata } from "@/app/book/root-layout";
export default function Layout({ children }: { children: React.ReactNode }) { return <RootLayout>{children}</RootLayout>; }
