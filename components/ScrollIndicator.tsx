'use client';

import { useEffect, useState } from 'react';

const SECTIONS = ['hero', 'about', 'education', 'experience', 'skills', 'links', 'contact'];

export default function ScrollIndicator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const index = Math.round(scrollTop / height);
      setActive(Math.min(index, SECTIONS.length - 1));
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (index: number) => {
    const container = document.querySelector('.snap-container');
    const section = document.getElementById(SECTIONS[index]);
    if (container && section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="scroll-indicator" aria-label="Section navigation">
      {SECTIONS.map((id, i) => (
        <button
          key={id}
          type="button"
          className={`scroll-indicator-dot ${active === i ? 'active' : ''}`}
          aria-label={`Go to ${id}`}
          onClick={() => scrollTo(i)}
        />
      ))}
    </nav>
  );
}
