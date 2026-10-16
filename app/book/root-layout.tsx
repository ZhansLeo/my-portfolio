import type { Metadata } from "next";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/600.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/source-serif-4/latin-400.css";
import "@fontsource/source-serif-4/latin-600.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-600.css";
import "katex/dist/katex.min.css";
import Navbar from "../components/navbar";
import ReadingBehavior from "./reading-behavior";
import { transitionScript } from "./transition-script";
import "../globals.css";
import "../portfolio.css";
import "./book.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zhansleo.github.io/my-portfolio/"),
  title: "Hanshi Zhao | Nanjing University",
  description: "An undergraduate at Nanjing University. Research, things I’m building, and notes along the way.",
};
export default function RootLayout({ children, language = "en" }: Readonly<{ children: React.ReactNode; language?: "en" | "zh" }>) {
  const zh = language === "zh";
  return <html lang={zh ? "zh-CN" : "en"} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: transitionScript }}/></head><body><a className="skip-link" href="#main-content">{zh ? "跳到正文" : "Skip to content"}</a><Navbar/><main id="main-content" tabIndex={-1}>{children}</main><ReadingBehavior/></body></html>;
}
