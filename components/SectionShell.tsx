'use client';

import { motion } from 'framer-motion';
import { fadeUp, transitionAura } from '@/lib/motion';

interface SectionShellProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionShell({ id, children, className = '' }: SectionShellProps) {
  return (
    <section id={id} className={`snap-section ${className}`.trim()}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={transitionAura}
        style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}
      >
        {children}
      </motion.div>
    </section>
  );
}
