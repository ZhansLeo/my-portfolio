"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const coreLinks = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
  { href: "/blog", label: "博客" },
  { href: "/wiki", label: "Wiki" },
  { href: "/papers", label: "Papers" },
];

const moreLinks = [
  { href: "/architecture", label: "技术架构" },
  { href: "/rss-reader", label: "RSS" },
  { href: "/digest", label: "周报" },
  { href: "/jd-match", label: "岗位匹配" },
  { href: "/status", label: "状态" },
  { href: "/agent", label: "Agent" },
];

const allLinks = [...coreLinks, ...moreLinks];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "text-gradient font-medium"
          : "text-white/40 hover:text-white/70"
      }`}
    >
      {label}
    </Link>
  );
}

function DropdownLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-white/50 hover:bg-white/[0.06] hover:text-white/75"
      }`}
    >
      <span className="font-mono text-xs opacity-50">{icon}</span>
      <span className="font-mono text-xs">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0e27]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-gradient font-mono text-sm font-semibold tracking-wide"
        >
          赵寒石
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {coreLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              onMouseEnter={() => setOpen(true)}
              className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
                moreLinks.some((l) => isActive(pathname, l.href))
                  ? "text-gradient font-medium"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="3" viewBox="0 0 12 3" fill="currentColor">
                  <circle cx="1.5" cy="1.5" r="1.5" />
                  <circle cx="6" cy="1.5" r="1.5" />
                  <circle cx="10.5" cy="1.5" r="1.5" />
                </svg>
                更多
              </span>
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-[#0d1128]/95 p-1.5 shadow-lg shadow-black/30 backdrop-blur-xl"
                onMouseLeave={() => setOpen(false)}
              >
                {moreLinks.map((link, i) => (
                  <DropdownLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={["●", "○", "◇", "△", "▽", "◆"][i]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1 p-2 md:hidden"
          aria-label="菜单"
        >
          <span
            className={`block h-0.5 w-4 rounded bg-white/60 transition-transform ${
              mobileOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-4 rounded bg-white/60 transition-opacity ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-4 rounded bg-white/60 transition-transform ${
              mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#0a0e27]/95 px-6 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-0.5">
            {allLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2.5 font-mono text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:bg-white/[0.05] hover:text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}