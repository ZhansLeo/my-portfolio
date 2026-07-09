"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  stagger?: number;
}

export default function Reveal({ children, stagger = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("revealed");

            if (stagger > 0) {
              const items = el.querySelectorAll<HTMLElement>(":scope > *");
              items.forEach((item, i) => {
                item.style.animationDelay = `${i * stagger}s`;
              });
            }

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [stagger]);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}