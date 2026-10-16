"use client";
import { useEffect } from "react";
import { url } from "./content";
export default function LegacyNote({ slug }: { slug?: string }) {
  const target = url(slug ? `notes/${slug}` : "notes", "zh");
  useEffect(() => { location.replace(target + location.hash); }, [target]);
  return <div className="compatibility-page" lang="zh-CN"><h1>知识库已搬到笔记</h1><p>原文保持不变，正在前往新的阅读页面。</p><a href={target}>打开对应笔记</a></div>;
}
