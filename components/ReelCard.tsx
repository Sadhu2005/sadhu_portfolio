'use client';

import { motion } from 'framer-motion';
import { fadeUp, transitionAura } from '@/lib/motion';

interface ReelCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function ReelCard({ children, className = '', delay = 0, style }: ReelCardProps) {
  return (
    <motion.div
      className={`glass-card ${className}`.trim()}
      style={{ position: 'relative', ...style }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...transitionAura, delay }}
      whileHover={{ y: -6 }}
    >
      {children}
    </motion.div>
  );
}
