'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Lightbox from '@/components/Lightbox';
import { certificates } from '@/lib/data';
import { asset } from '@/lib/utils';

export default function CertificationsPage() {
  const [lightboxItems, setLightboxItems] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openAt = useCallback((idx: number) => {
    setLightboxItems(certificates.map((c) => c.src));
    setLightboxIndex(idx);
  }, []);

  return (
    <PageTransition>
      <main>
        <div className="page-hero">
          <motion.h1 className="text-gradient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Certifications</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {certificates.length} credentials across AI, ML, and software development.
          </motion.p>
        </div>

        <div className="certifications-grid" style={{ padding: '0 5% 4rem' }}>
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.src}
              className="gallery glass-card"
              onClick={() => openAt(index)}
              style={{ cursor: 'pointer', overflow: 'hidden' }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: (index % 6) * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={asset(cert.src)}
                alt={cert.alt}
                width={400}
                height={300}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
              <div className="desc" style={{ padding: '1rem' }}>
                {cert.caption ? (
                  <>
                    <div style={{ fontWeight: 'bold', color: 'var(--aura-primary)', marginBottom: '4px' }}>{cert.caption}</div>
                    <div style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>{cert.desc}</div>
                  </>
                ) : (
                  <div>{cert.desc}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Lightbox items={lightboxItems} index={lightboxIndex} onClose={() => setLightboxItems([])} onChange={setLightboxIndex} />
    </PageTransition>
  );
}
