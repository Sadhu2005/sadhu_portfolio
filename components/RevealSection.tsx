'use client';

import { useInView } from '@/hooks/useInView';

export default function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-section ${isInView ? 'in-view' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
