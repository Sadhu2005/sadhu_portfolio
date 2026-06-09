// components/MouseTrail.tsx
'use client';

import { useEffect } from 'react';

export default function MouseTrail() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    const body = document.querySelector('body');
    if (!body) return;

    const colors = ['#6e44ff', '#8e64ff', '#a384ff', '#60a5fa', '#34d399'];

    let lastX = 0;
    let lastY = 0;
    let hasLast = false;

    function spawnDot(x: number, y: number) {
      const dot = document.createElement('div');
      dot.className = 'mouse-trail';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.opacity = '0.95';
      body?.appendChild(dot);

      // Animate out after a short delay so initial render is visible
      const lifeMs = 800 + Math.random() * 400; // 0.8s - 1.2s (reduced by 50%)
      setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%, -50%) scale(4.5)';
        setTimeout(() => dot.remove(), lifeMs);
      }, 20);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.pageX;
      const y = e.pageY;

      if (!hasLast) {
        spawnDot(x, y);
        lastX = x; lastY = y; hasLast = true;
        return;
      }

      // Interpolate points between the last and current positions to create a longer trail
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.min(4, Math.max(1, Math.floor(dist / 24))); // 1-4 dots depending on speed (reduced by 50%)
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        spawnDot(lastX + dx * t, lastY + dy * t);
      }

      lastX = x;
      lastY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // Visual-only component
}