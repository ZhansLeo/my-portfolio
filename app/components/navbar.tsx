"use client";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { base, copy, url, type Language } from "../book/content";

export default function Navbar() {
  const pathname = usePathname().replace(new RegExp(`^${base}(?=/|$)`), "");
  const language: Language = /^\/zh(?:\/|$)/.test(pathname) ? "zh" : "en";
  const path = pathname.replace(/^\/zh(?=\/|$)/, "").replace(/^\/+|\/+$/g, "");
  const c = copy[language];
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const sections = ["", "research", "projects", "notes", "personal"];
  const archive = !sections.includes(path.split("/")[0]) && !path.startsWith("wiki");
  return <><nav className="book-nav" aria-label={language === "zh" ? "主导航" : "Main navigation"} onKeyDown={event => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } }}>
    <div className="book-nav-inner"><a className="book-brand" href={url("", language)}>{c.name}</a>
      <div className="desktop-links">{sections.map((section, i) => <a key={section} href={url(section, language)} aria-current={path === section || (section && path.startsWith(section + "/")) ? "page" : undefined}>{c.nav[i]}</a>)}</div>
      <div className="book-nav-actions">{!archive && <a className="language-switch" href={url(path.startsWith("wiki") ? "notes" : path, language === "en" ? "zh" : "en")} lang={language === "en" ? "zh-CN" : "en"} hrefLang={language === "en" ? "zh-CN" : "en"} data-language-switch>{language === "en" ? "中文" : "English"}</a>}
        <button ref={button} className="menu-toggle" aria-label={language === "en" ? (open ? "Close menu" : "Open menu") : (open ? "关闭菜单" : "打开菜单")} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">{open ? <path d="m6 6 12 12M6 18 18 6"/> : <path d="M4 8h16M4 16h16"/>}</svg></button></div>
    </div><div id="mobile-navigation" className="mobile-links" hidden={!open}>{sections.map((section, i) => <a key={section} href={url(section, language)} onClick={() => setOpen(false)} aria-current={path === section || (section && path.startsWith(section + "/")) ? "page" : undefined}>{c.nav[i]}</a>)}</div>
  </nav>{archive && <div className="archive-notice" lang="zh-CN">历史归档 · 保留原文与原有链接。<a href={url()}>返回新首页</a></div>}</>;
}
