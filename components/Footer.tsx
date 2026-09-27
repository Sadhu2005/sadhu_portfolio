"use client";

import { usePathname } from "next/navigation";
import { useSite } from "@/components/SiteProvider";

export default function Footer() {
  const { site } = useSite();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <p>{site?.copyright || "Sadhu J"}</p>
    </footer>
  );
}
