'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { asset } from '@/lib/utils';

interface LightboxProps {
  items: string[];
  index: number;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
}

export default function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = items[index];

  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement) videoElement.pause();
    };
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onClose, onChange]);

  if (!items.length || !src) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <span className="lightbox-close" onClick={onClose}>&times;</span>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {src.endsWith('.mp4') ? (
          <video
            ref={videoRef}
            src={asset(src)}
            controls
            autoPlay
            muted
            loop
            style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '8px' }}
          />
        ) : (
          <Image
            src={asset(src)}
            alt="Lightbox content"
            width={1200}
            height={800}
            style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '80vh', width: 'auto', height: 'auto', borderRadius: '8px' }}
          />
        )}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              className="lightbox-nav lightbox-nav--prev"
              onClick={() => onChange((index - 1 + items.length) % items.length)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              className="lightbox-nav lightbox-nav--next"
              onClick={() => onChange((index + 1) % items.length)}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
