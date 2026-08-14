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
  /** Play the 720p loop instead of the grid one. For frames shown large. */
  hd?: boolean;
  /**
   * Fetch the clip during idle time after load rather than on first hover, so
   * the first interaction plays instantly. Only worth it for a handful of
   * frames — see the note on `warmed` below.
   */
  warm?: boolean;
}

/**
 * A single film tile.
 *
 * Tiles play a short silent loop, never the full cut — that is what makes a
 * wall of six autoplay without costing anyone their data plan. The poster holds
 * the layout and stays on top until a frame is genuinely decodable, so grids
 * never flash black on a slow connection.
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
  hd = false,
  warm = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const coarse = useCoarsePointer();
  const reducedMotion = useReducedMotion();
  const inView = useInView(wrapRef, { rootMargin: '300px' });

  const [armed, setArmed] = useState(false); // should be playing
  const [warmed, setWarmed] = useState(false); // downloaded ahead of time
  const [playing, setPlaying] = useState(false); // first frame is up
  const [loading, setLoading] = useState(false);

  // On touch, hover tiles fall back to play-when-visible so the page is not dead.
  const effectiveTrigger: Trigger =
    reducedMotion ? 'always' : coarse && trigger === 'hover' ? 'inview' : trigger;

  /**
   * Pre-fetch once the browser is idle. Skipped on Save-Data and on 2G, where
   * spending megabytes on something nobody has asked for yet is rude. Because
   * the loops are served `immutable`, this only ever costs on a first visit —
   * on every later visit the file comes straight from disk cache.
   */
  useEffect(() => {
    if (!warm || reducedMotion) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;

    const idle = window.requestIdleCallback;
    if (idle) {
      const handle = idle(() => setWarmed(true), { timeout: 4000 });
      return () => window.cancelIdleCallback?.(handle);
    }

    const timer = window.setTimeout(() => setWarmed(true), 1500);
    return () => window.clearTimeout(timer);
  }, [warm, reducedMotion]);

  const arm = useCallback(() => {
    if (reducedMotion) return;
    setArmed(true);
    setLoading(true);
  }, [reducedMotion]);

  const disarm = useCallback(() => {
    setArmed(false);
    setPlaying(false);
    setLoading(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (effectiveTrigger === 'hover') return;
    if (inView && !reducedMotion) arm();
  }, [effectiveTrigger, inView, arm, reducedMotion]);

  // Kick playback off once the element exists and we actually want it playing.
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
  const source = hd
    ? clip.previewHd ?? clip.preview ?? clip.src
    : clip.preview ?? clip.src;

  // A warmed tile keeps its <video> mounted and paused, so hovering is instant.
  const mounted = armed || warmed;

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

      {mounted && source && (
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

      {/* Buffering. These are real downloads — silence here reads as broken. */}
      <div
        className={`pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full bg-black/55 py-1.5 pl-2 pr-3 backdrop-blur-sm transition-opacity duration-300 ${
          loading && !playing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="block h-3 w-3 animate-spin rounded-full border-[1.5px] border-white/35 border-t-white" />
        <span className="label !text-[0.55rem] text-white">Loading</span>
      </div>

      {children}
    </div>
  );
}
