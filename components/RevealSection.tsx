"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

export function stagger(index: number, cap = 6): CSSProperties {
  return { "--i": Math.min(index, cap) } as CSSProperties;
}

export default function RevealSection({
  as: Tag = "div",
  className = "",
  index,
  id,
  children,
}: {
  as?: ElementType;
  className?: string;
  index?: number;
  id?: string;
  children: ReactNode;
}) {
  const { ref, isInView } = useInView<HTMLElement>();
  const style = index === undefined ? undefined : ({ "--ri": index } as CSSProperties);

  return (
    <Tag ref={ref} id={id} className={`reveal ${isInView ? "in-view" : ""} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
