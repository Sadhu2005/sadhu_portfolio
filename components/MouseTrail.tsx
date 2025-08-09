// components/MouseTrail.tsx
'use client';

import { useEffect } from 'react';

export default function MouseTrail() {
  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;

    const colors = ['#6e44ff', '#8e64ff', '#a384ff'];

    const handleMouseMove = (e: MouseEvent) => {
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = e.pageX + 'px';
      trail.style.top = e.pageY + 'px';
      trail.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      body.appendChild(trail);
      
      setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(3)';
        
        setTimeout(() => {
          trail.remove();
        }, 800);
      }, 10);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // This component doesn't render anything itself
}