'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Mouse-only. Touch devices and reduced-motion users keep the native cursor —
 * the `has-custom-cursor` class on <html> is what switches `cursor: none` on,
 * so if this never mounts nothing is left pointer-less.
 */
export default function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  const spring = { damping: 30, stiffness: 320, mass: 0.28 };
  const ringX = useSpring(x, spring);
  const ringY = useSpring(y, spring);

  useEffect(() => {
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!ok) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor], a, button');
      if (!target) return;
      setLabel(target.getAttribute('data-cursor') ?? '');
    };

    const out = (e: MouseEvent) => {
      const from = (e.target as HTMLElement | null)?.closest?.('[data-cursor], a, button');
      const to = (e.relatedTarget as HTMLElement | null)?.closest?.('[data-cursor], a, button');
      if (from && from !== to) setLabel('');
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1000]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full bg-[var(--accent)] text-white"
          animate={{
            width: label ? 84 : 14,
            height: label ? 84 : 14,
            marginLeft: label ? -42 : -7,
            marginTop: label ? -42 : -7,
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        >
          {label && (
            <span className="label whitespace-nowrap !text-[0.58rem]">{label}</span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1001] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ink)] mix-blend-difference"
        style={{ x, y }}
      />
    </>
  );
}
