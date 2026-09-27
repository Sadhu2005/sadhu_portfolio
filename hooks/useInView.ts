"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLDivElement>(amount = 0.15) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return undefined;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsInView(true);
      return undefined;
    }

    // Blocks taller than the viewport never reach a 15% ratio, so also accept 15% of the viewport height.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const viewport = entry.rootBounds?.height ?? window.innerHeight;
        if (entry.intersectionRatio >= amount || entry.intersectionRect.height >= viewport * amount) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: [0, amount / 3, (amount * 2) / 3, amount] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, isInView]);

  return { ref, isInView };
}
