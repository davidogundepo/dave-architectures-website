'use client';

import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  delay?: number;
  /** Distance in px the content rises from. */
  from?: number;
  className?: string;
}

/** Scroll-triggered rise. Clipped so the movement reads as a wipe, not a slide. */
export default function Reveal({ children, delay = 0, from = 44, className = '' }: Props) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: from, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
