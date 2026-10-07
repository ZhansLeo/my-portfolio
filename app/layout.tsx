import type { Metadata } from "next";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/600.css";
import "@fontsource/noto-sans-sc/400.css";
import "katex/dist/katex.min.css";
import Navbar from "./components/navbar";
import "./globals.css";
import "./portfolio.css";
export const metadata: Metadata = {
  title: "赵寒石 | 南京大学",
  description: "南京大学软件工程与工商管理双学位学生。记录智能体可靠性、小模型推理的科研学习实践，以及工程项目与持续思考。",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" className="h-full antialiased"><body className="min-h-full flex flex-col"><a className="skip-link" href="#main-content">跳到正文</a><Navbar /><main id="main-content" className="pt-14">{children}</main></body></html>;
}
