'use client';

import { motion } from 'framer-motion';
import { pageTransition, transitionAura } from '@/lib/motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={transitionAura}
    >
      {children}
    </motion.div>
  );
}
