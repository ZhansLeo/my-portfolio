"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
  { href: "/blog", label: "博客" },
  { href: "/rss-reader", label: "RSS" },
  { href: "/papers", label: "Papers" },
  { href: "/wiki", label: "Wiki" },
  { href: "/digest", label: "周报" },
  { href: "/status", label: "状态" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0e27]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-gradient font-mono text-sm font-semibold tracking-wide"
        >
          赵寒石
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                  isActive
                    ? "text-gradient font-medium"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}