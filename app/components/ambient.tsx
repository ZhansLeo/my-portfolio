"use client";
import { useEffect, useRef } from "react";
export default function Ambient() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => ref.current?.classList.toggle("ambient-paused", document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return <div ref={ref} className="ambient" aria-hidden="true"><div className="ambient-field" /><div className="ambient-fold" /></div>;
}
