"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";

const fallbackNav = [
  { label: "About", href: "/#about" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Work", href: "/work" },
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const { site } = useSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tucked, setTucked] = useState(false);
  const header = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const nav = site?.nav?.length ? site.nav : fallbackNav;
  const mark = site?.title?.split(" - ")[0] || "Sadhu J";
  const hide = pathname.startsWith("/admin");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    lastY.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      const delta = y - lastY.current;
      if (motion.matches || y < 80 || header.current?.contains(document.activeElement)) setTucked(false);
      else if (delta > 6) setTucked(true);
      else if (delta < -6) setTucked(false);
      if (Math.abs(delta) > 6 || y < 80) lastY.current = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const tuck = tucked && !open;
  useEffect(() => {
    document.documentElement.dataset.nav = tuck ? "hidden" : "shown";
  }, [tuck]);

  if (hide) return null;

  function isCurrent(href: string) {
    const path = href.split("#")[0] || "/";
    if (href.includes("#")) return false;
    if (path === "/work") return pathname === "/work" || pathname.startsWith("/work/");
    return pathname === path;
  }

  return (
    <header ref={header} className={`nav-wrap ${tuck ? "is-hidden" : ""}`} onFocus={() => setTucked(false)}>
      <div className="scroll-progress" aria-hidden>
        <span style={{ width: `${progress * 100}%` }} />
      </div>
      <nav className="navbar" aria-label="Primary">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          {mark}
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
        <div className={`nav-links ${open ? "active" : ""}`}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isCurrent(item.href) ? "is-active" : undefined}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
