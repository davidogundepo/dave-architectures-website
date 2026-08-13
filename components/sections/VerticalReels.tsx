'use client';

import { useRef } from 'react';
import FilmFrame from '@/components/media/FilmFrame';
import Reveal from '@/components/ui/Reveal';
import { useInView } from '@/lib/hooks';
import { pickDiverse, portraitClips } from '@/lib/videos';
import type { Clip } from '@/lib/types';

const pool = pickDiverse(portraitClips, 12);

/** Three columns of 9:16, drifting in alternating directions. */
const columns: Clip[][] = [0, 1, 2].map((c) =>
  pool.filter((_, i) => i % 3 === c),
);

export default function VerticalReels() {
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useInView(sectionRef, { rootMargin: '150px', once: false });

  return (
    <section ref={sectionRef} className="overflow-hidden py-[clamp(4rem,9vh,7rem)]">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="label text-[var(--ink-3)]">The 9:16 cut</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display t-section mt-4 max-w-[12ch]">
                For the
                <span className="text-[var(--accent)]"> feed</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lede mt-7 max-w-[42ch]">
                Same house, recut for a thumb. Faster cuts, the hook in the first
                second, captions burned in, and framing that survives a phone held
                one-handed on a bus.
              </p>
            </Reveal>

            <ul className="mt-9 space-y-0 border-t border-[var(--line)]">
              {[
                ['Reels, TikTok, Shorts', 'Delivered at 1080×1920, ready to post.'],
                ['Hook in frame one', 'The best room leads. Nobody waits for a slow reveal.'],
                ['Captioned by default', 'Most of the feed watches on mute.'],
              ].map(([title, detail]) => (
                <li key={title} className="border-b border-[var(--line)] py-5">
                  <p className="display text-[1.35rem] leading-none">{title}</p>
                  <p className="body-text mt-2">{detail}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Drifting columns. Paused while off-screen so we are not animating
              for nobody, and paused on hover so a frame can be read. */}
          <div
            className="group relative grid h-[clamp(420px,78vh,760px)] grid-cols-3 gap-3 overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent)',
            }}
          >
            {columns.map((column, ci) => (
              <div
                key={ci}
                className={`flex flex-col gap-3 ${ci % 2 === 0 ? 'track-up' : 'track-down'} ${
                  visible ? '' : 'track-paused'
                } group-hover:[animation-play-state:paused]`}
                style={{ ['--speed' as string]: `${38 + ci * 9}s` }}
              >
                {[...column, ...column].map((clip, i) => (
                  <FilmFrame
                    key={`${clip.id}-${i}`}
                    clip={clip}
                    trigger="hover"
                    className="shrink-0"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
