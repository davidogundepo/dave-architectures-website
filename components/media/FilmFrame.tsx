'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Clip } from '@/lib/types';
import { useCoarsePointer, useInView, useReducedMotion } from '@/lib/hooks';

type Trigger = 'hover' | 'inview' | 'always';

interface Props {
  clip: Clip;
  /** hover = desktop hover-to-play, inview = autoplay once scrolled to. */
  trigger?: Trigger;
  className?: string;
  /** Overlay content rendered above the frame (title cards, indices). */
  children?: React.ReactNode;
  /** Dim the poster slightly so overlaid text stays readable. */
  scrim?: boolean;
  priority?: boolean;
  rounded?: boolean;
  /** Fill the parent instead of holding the clip's own aspect ratio. */
  fill?: boolean;
  /** Crop to a different ratio than the clip's own, e.g. '4 / 3'. */
  ratio?: string;
}

/**
 * A single film tile.
 *
 * Tiles play the ~0.5 MB silent preview loop, never the full cut — that is what
 * makes a wall of six of these autoplay without costing anyone their data plan.
 * Even so the <video> is only mounted once the trigger fires, and the poster
 * stays on top until a frame is genuinely decodable, so grids never flash black.
 */
export default function FilmFrame({
  clip,
  trigger = 'hover',
  className = '',
  children,
  scrim = false,
  priority = false,
  rounded = true,
  fill = false,
  ratio,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const coarse = useCoarsePointer();
  const reducedMotion = useReducedMotion();
  const inView = useInView(wrapRef, { rootMargin: '300px' });

  const [armed, setArmed] = useState(false); // mount the <video> at all
  const [playing, setPlaying] = useState(false); // first frame is up
  const [loading, setLoading] = useState(false);

  // On touch, hover tiles fall back to play-when-visible so the page is not dead.
  const effectiveTrigger: Trigger =
    reducedMotion ? 'always' : coarse && trigger === 'hover' ? 'inview' : trigger;

  const arm = useCallback(() => {
    if (reducedMotion) return;
    setArmed(true);
    setLoading(true);
  }, [reducedMotion]);

  const disarm = useCallback(() => {
    setPlaying(false);
    setLoading(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setArmed(false);
  }, []);

  useEffect(() => {
    if (effectiveTrigger === 'hover') return;
    if (inView && !reducedMotion) arm();
  }, [effectiveTrigger, inView, arm, reducedMotion]);

  // Kick playback off as soon as the element exists.
  useEffect(() => {
    const video = videoRef.current;
    if (!armed || !video) return;
    video.play().catch(() => {
      // Autoplay can still be refused (e.g. low power mode); poster stays up.
      setLoading(false);
    });
  }, [armed]);

  const isPortrait = clip.orientation === 'portrait';
  const frameRatio = ratio ?? (isPortrait ? '9 / 16' : '16 / 9');
  const source = clip.preview ?? clip.src;

  const hoverProps =
    effectiveTrigger === 'hover'
      ? { onMouseEnter: arm, onMouseLeave: disarm, onFocus: arm, onBlur: disarm }
      : {};

  return (
    <div
      ref={wrapRef}
      {...hoverProps}
      className={`group relative isolate overflow-hidden bg-[var(--night-2)] ${
        rounded ? 'rounded-[var(--radius)]' : ''
      } ${className}`}
      style={fill ? undefined : { aspectRatio: frameRatio }}
    >
      {clip.poster ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={clip.poster}
          alt={clip.title ? `${clip.title}${clip.location ? `, ${clip.location}` : ''}` : ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--night-2)] to-[var(--night)]" />
      )}

      {armed && source && (
        <video
          ref={videoRef}
          src={source}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => {
            setPlaying(true);
            setLoading(false);
          }}
          onWaiting={() => setLoading(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {scrim && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
      )}

      {/* Buffering pip. These are large masters — silence here reads as broken. */}
      <div
        className={`pointer-events-none absolute right-3 top-3 z-10 transition-opacity duration-300 ${
          loading && !playing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="block h-2 w-2 animate-ping rounded-full bg-[var(--accent)]" />
      </div>

      {children}
    </div>
  );
}
