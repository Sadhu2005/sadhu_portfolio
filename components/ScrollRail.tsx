"use client";

import { Children, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ScrollRail({
  label,
  children,
  variant = "full",
  fit = false,
  rise = false,
  emptyLabel = "Nothing to show yet.",
}: {
  label: string;
  children: ReactNode;
  variant?: "full" | "half" | "card";
  fit?: boolean;
  rise?: boolean;
  emptyLabel?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0 });
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  function stepSize() {
    const el = scroller.current;
    if (!el) return 1;
    const item = el.querySelector<HTMLElement>(".rail-item");
    return (item?.offsetWidth || el.clientWidth) + 16;
  }

  function scrollToIndex(next: number) {
    const el = scroller.current;
    if (!el) return;
    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * stepSize(), behavior: motionOff ? "auto" : "smooth" });
  }

  function go(dir: number) {
    const el = scroller.current;
    if (!el) return;
    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * stepSize(), behavior: motionOff ? "auto" : "smooth" });
  }

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / stepSize()))));
  }

  useEffect(() => {
    setCount(items.length);
  }, [items.length]);

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, video")) return;
    const el = scroller.current;
    if (!el) return;
    drag.current = { active: true, x: event.clientX, left: el.scrollLeft };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = scroller.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
  }

  function onPointerUp() {
    drag.current.active = false;
  }

  if (items.length === 0) {
    return <p className="rail-empty">{emptyLabel}</p>;
  }

  return (
    <div className={`rail-wrap ${fit ? "rail-wrap--fit" : ""}`}>
      <div className="rail-controls">
        <button type="button" className="rail-btn" aria-label={`Previous ${label}`} onClick={() => go(-1)}>
          ‹
        </button>
        <button type="button" className="rail-btn" aria-label={`Next ${label}`} onClick={() => go(1)}>
          ›
        </button>
      </div>
      <div
        ref={scroller}
        className={`rail ${fit ? "rail--fit" : ""}`}
        tabIndex={0}
        role="region"
        aria-label={label}
        onKeyDown={onKey}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((child, itemIndex) => {
          const className = `rail-item rail-item--${variant}`;
          if (!rise || reduce) {
            return (
              <div className={className} key={itemIndex}>
                {child}
              </div>
            );
          }
          return (
            <motion.div
              className={className}
              key={itemIndex}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, delay: Math.min(itemIndex, 4) * 0.08 }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
      <div className="rail-dots">
        {Array.from({ length: count }, (_, dot) => (
          <button
            key={dot}
            type="button"
            className={`rail-dot ${dot === index ? "is-on" : ""}`}
            aria-label={`Show ${label} item ${dot + 1}`}
            aria-current={dot === index ? "true" : undefined}
            onClick={() => scrollToIndex(dot)}
          />
        ))}
      </div>
    </div>
  );
}
