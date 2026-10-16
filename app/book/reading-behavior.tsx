"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type Turn = { overlay: HTMLElement; sheet: HTMLElement; animation: Animation; timer: ReturnType<typeof setTimeout>; target: string };
const mainRoute = /^\/my-portfolio\/(?:zh\/)?(?:(?:research|projects|notes|personal)(?:\/[^/?#]+)?\/)?$/;
const routePath = (url: URL) => url.pathname.replace(/^\/my-portfolio/, "") + url.search + url.hash;

export default function ReadingBehavior() {
  const router = useRouter();
  const pathname = usePathname();
  const turn = useRef<Turn | null>(null);
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.getElementById("main-content")?.focus({ preventScroll: true });
    const current = turn.current;
    if (!current) return;
    clearTimeout(current.timer);
    // The page underneath is committed. Continue from the current lift angle,
    // so even a slower destination never produces a blank or frozen snapshot.
    const transform = getComputedStyle(current.sheet).transform;
    current.animation.cancel();
    current.animation = current.sheet.animate([
      { transform, opacity: 1 },
      { transform: "rotateY(96deg)", opacity: 1, offset: .88 },
      { transform: "rotateY(102deg)", opacity: 0 }
    ], { duration: matchMedia("(max-width: 899px)").matches ? 430 : 560, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" });
    current.animation.finished.catch(() => {}).finally(() => {
      current.overlay.remove();
      if (turn.current === current) turn.current = null;
    });
  }, [pathname]);

  useEffect(() => {
    const prefetched = new Set<string>();
    function target(event: Event) {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return null;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || !mainRoute.test(url.pathname) || !mainRoute.test(location.pathname) || url.pathname === location.pathname) return null;
      // Each language has a distinct document root; preserve native language navigation.
      if (url.pathname.includes("/zh/") !== location.pathname.includes("/zh/")) return null;
      return url;
    }
    function prefetch(event: Event) {
      const url = target(event);
      if (url && !prefetched.has(url.pathname)) { prefetched.add(url.pathname); router.prefetch(routePath(url)); }
    }
    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const url = target(event);
      if (!url) return;
      event.preventDefault();
      const current = turn.current;
      if (current) { clearTimeout(current.timer); current.animation.cancel(); current.overlay.remove(); turn.current = null; }
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches && typeof Element.prototype.animate === "function") {
        const main = document.getElementById("main-content");
        if (main) {
          const rect = main.getBoundingClientRect();
          const top = Math.max(0, document.querySelector(".book-nav")?.getBoundingClientRect().bottom || 0);
          const overlay = document.createElement("div");
          overlay.className = "page-turn-viewport";
          overlay.style.top = `${top}px`;
          overlay.setAttribute("aria-hidden", "true");
          overlay.inert = true;
          const sheet = document.createElement("div");
          sheet.className = "page-turn-sheet";
          const clone = main.cloneNode(true) as HTMLElement;
          clone.removeAttribute("id");
          clone.querySelectorAll("[id]").forEach(e => e.removeAttribute("id"));
          clone.classList.add("page-turn-copy");
          Object.assign(clone.style, { position: "absolute", top: `${rect.top - top}px`, left: `${rect.left}px`, width: `${rect.width}px`, margin: "0" });
          if (clone.firstElementChild instanceof HTMLElement) clone.firstElementChild.style.marginTop = "0";
          sheet.append(clone); overlay.append(sheet); document.body.append(overlay);
          const animation = sheet.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(7deg)" }], { duration: 180, easing: "ease-out", fill: "forwards" });
          const timer = setTimeout(() => { animation.cancel(); overlay.remove(); if (turn.current?.overlay === overlay) turn.current = null; }, 4500);
          turn.current = { overlay, sheet, animation, timer, target: url.pathname };
        }
      }
      // Close the menu immediately; route navigation can complete independently.
      const menu = document.querySelector<HTMLButtonElement>('.menu-toggle[aria-expanded="true"]');
      menu?.click();
      router.push(routePath(url), { scroll: true });
    }
    document.addEventListener("pointerover", prefetch);
    document.addEventListener("focusin", prefetch);
    document.addEventListener("touchstart", prefetch, { passive: true });
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerover", prefetch); document.removeEventListener("focusin", prefetch);
      document.removeEventListener("touchstart", prefetch); document.removeEventListener("click", click);
      const current = turn.current;
      if (current) { clearTimeout(current.timer); current.animation.cancel(); current.overlay.remove(); turn.current = null; }
    };
  }, [router]);
  return null;
}
