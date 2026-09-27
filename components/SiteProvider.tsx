"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSite } from "@/lib/api";
import type { SiteConfig } from "@/lib/types";

interface SiteContextValue {
  site: SiteConfig | null;
  error: boolean;
}

const SiteContext = createContext<SiteContextValue>({ site: null, error: false });

export function useSite() {
  return useContext(SiteContext);
}

function applyTheme(site: SiteConfig) {
  const root = document.documentElement;
  const theme = site.theme;
  root.style.setProperty("--bg", theme.background);
  root.style.setProperty("--surface", theme.surface);
  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--copper", theme.copper);
  root.style.setProperty("--mint", theme.mint);
}

export default function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getSite()
      .then((value) => {
        if (!active) return;
        setSite(value);
        applyTheme(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return <SiteContext.Provider value={{ site, error }}>{children}</SiteContext.Provider>;
}
