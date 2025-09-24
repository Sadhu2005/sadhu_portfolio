// components/MouseTrail.tsx
'use client';

import { useEffect } from 'react';

export default function MouseTrail() {
  useEffect(() => {
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
      body.appendChild(dot);

      // Animate out after a short delay so initial render is visible
      const lifeMs = 1600 + Math.random() * 900; // 1.6s - 2.5s
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
      const steps = Math.min(8, Math.max(2, Math.floor(dist / 12))); // 2-8 dots depending on speed
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        spawnDot(lastX + dx * t, lastY + dy * t);
      }

      lastX = x;
      lastY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, []);

  return null; // Visual-only component
}