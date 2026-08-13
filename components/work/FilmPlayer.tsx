'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getBrand } from '@/lib/brands';
import { displayLocation, displayTitle } from '@/lib/videos';
import type { Clip } from '@/lib/types';

/**
 * Full-cut lightbox. This is the only place the ~10 MB web master is fetched —
 * everywhere else on the site plays the small preview loop instead.
 */
export default function FilmPlayer({
  clip,
  onClose,
}: {
  clip: Clip | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!clip) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [clip, onClose]);

  return (
    <AnimatePresence>
      {clip && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={displayTitle(clip)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[950] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`flex w-full flex-col gap-4 ${
              clip.orientation === 'portrait'
                ? 'max-w-[min(420px,92vw)]'
                : 'max-w-[min(1200px,94vw)]'
            }`}
          >
            {clip.src ? (
              <video
                key={clip.id}
                src={clip.src}
                poster={clip.poster}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full rounded-[var(--radius)] bg-black"
                style={{
                  aspectRatio: clip.orientation === 'portrait' ? '9 / 16' : '16 / 9',
                }}
              />
            ) : (
              <div
                className="flex w-full items-center justify-center rounded-[var(--radius)] bg-[var(--night-2)] p-8 text-center"
                style={{
                  aspectRatio: clip.orientation === 'portrait' ? '9 / 16' : '16 / 9',
                }}
              >
                <p className="body-text !text-[var(--on-night-2)]">
                  The full cut for this one is still uploading.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[var(--on-night)]">
              <div>
                <h2 className="display text-[clamp(1.3rem,2.4vw,2.1rem)] leading-none">
                  {displayTitle(clip)}
                </h2>
                <p className="mt-2 text-sm text-[var(--on-night-2)]">
                  {displayLocation(clip)}
                  {clip.note ? ` · ${clip.note}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <span className="label text-[var(--on-night-2)]">
                  {getBrand(clip.brandId).domain} ·{' '}
                  {clip.orientation === 'portrait' ? '9:16' : '16:9'}
                </span>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="label rounded-full border border-[var(--line-night)] px-5 py-2.5 text-[var(--on-night)] transition-colors hover:border-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
