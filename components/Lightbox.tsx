"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { mediaSrc } from "@/lib/api";

interface LightboxProps {
  items: string[];
  kinds?: string[];
  index: number;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
}

function isVideo(src: string, kind?: string) {
  if (kind === "video") return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

export default function Lightbox({ items, kinds = [], index, onClose, onChange }: LightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = items[index];
  const kind = kinds[index];

  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement) videoElement.pause();
    };
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % items.length);
      if (event.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onChange]);

  if (!items.length || !src) return null;
  const url = mediaSrc(src);

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Media viewer">
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        {isVideo(src, kind) ? (
          <video ref={videoRef} src={url} controls playsInline preload="metadata" />
        ) : (
          <Image src={url} alt="Expanded media" width={1200} height={800} unoptimized style={{ width: "auto", height: "auto", maxWidth: "90vw", maxHeight: "80vh" }} />
        )}
        {items.length > 1 && (
          <>
            <button type="button" aria-label="Previous" className="lightbox-nav lightbox-nav--prev" onClick={() => onChange((index - 1 + items.length) % items.length)}>
              ‹
            </button>
            <button type="button" aria-label="Next" className="lightbox-nav lightbox-nav--next" onClick={() => onChange((index + 1) % items.length)}>
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
