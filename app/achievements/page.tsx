'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Lightbox from '@/components/Lightbox';
import ReelCard from '@/components/ReelCard';
import { achievements } from '@/lib/data';
import { asset } from '@/lib/utils';
import { staggerContainer } from '@/lib/motion';

export default function AchievementsPage() {
  const [lightboxItems, setLightboxItems] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <PageTransition>
      <main>
        <div className="page-hero">
          <motion.h1 className="text-gradient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Competitions & Hackathons</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Technical events, hackathons, and competition outcomes.
          </motion.p>
        </div>

        <motion.div className="achievements-container" variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: '0 5% 4rem' }}>
          {achievements.map((event, index) => (
            <ReelCard key={event.eventName} delay={index * 0.08} className="achievement-card" style={{ padding: '1.5rem' }}>
              <div className="achievement-header">
                <h3 style={{ color: 'var(--aura-primary)' }}>{event.eventName}</h3>
                <p className="achievement-date">{event.date}</p>
              </div>
              <div className="achievement-body">
                <p className="achievement-outcome"><strong>Outcome:</strong> {event.outcome}</p>
                <p className="achievement-description" style={{ color: 'var(--text-muted)' }}>{event.description}</p>
                <p className="achievement-tech"><strong>Key Skills:</strong> {event.techUsed}</p>
                <button
                  type="button"
                  className="button-aura"
                  style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                  onClick={() => { setLightboxItems([event.certificateUrl, ...event.media]); setLightboxIndex(0); }}
                >
                  View Certificate
                </button>
                {event.media.length > 0 && (
                  <div className="achievement-media">
                    <h4>Event Gallery</h4>
                    <div className="media-scroller">
                      {event.media.map((mediaUrl, mediaIndex) => (
                        <div
                          key={mediaUrl}
                          className="media-item"
                          onClick={() => { setLightboxItems(event.media); setLightboxIndex(mediaIndex); }}
                          style={{ cursor: 'pointer' }}
                          role="button"
                          tabIndex={0}
                        >
                          {mediaUrl.endsWith('.mp4') ? (
                            <div className="video-thumbnail-wrapper">
                              <video src={asset(mediaUrl)} muted loop playsInline />
                              <div className="play-icon">▶</div>
                            </div>
                          ) : (
                            <Image src={asset(mediaUrl)} alt={`${event.eventName} media ${mediaIndex + 1}`} width={200} height={150} style={{ objectFit: 'cover' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ReelCard>
          ))}
        </motion.div>
      </main>
      <Lightbox items={lightboxItems} index={lightboxIndex} onClose={() => setLightboxItems([])} onChange={setLightboxIndex} />
    </PageTransition>
  );
}
