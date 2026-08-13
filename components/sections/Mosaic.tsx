'use client';

import Link from 'next/link';
import FilmFrame from '@/components/media/FilmFrame';
import Reveal from '@/components/ui/Reveal';
import { clips, displayLocation, displayTitle, pickDiverse } from '@/lib/videos';

/**
 * The mixed wall: 16:9 and 9:16 interleaved in a masonry column flow, every tile
 * playing at once. CSS columns do the packing, so tall and wide tiles slot
 * together without a layout library.
 */
const wall = pickDiverse(clips, 14, 1);

export default function Mosaic() {
  return (
    <section className="bg-[var(--night)] py-[clamp(4rem,9vh,7rem)] text-[var(--on-night)]">
      <div className="shell">
        <div className="mx-auto max-w-[44ch] pb-12 text-center">
          <Reveal>
            <p className="label text-[var(--on-night-2)]">One house, every format</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display t-section mt-4 text-balance">
              All of it, playing at once
            </h2>
          </Reveal>
        </div>

        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
          {wall.map((clip, i) => (
            <Link
              key={clip.id}
              href={`/work#${clip.id}`}
              data-cursor="Open"
              className="group/tile mb-3 block break-inside-avoid"
            >
              <FilmFrame clip={clip} trigger="inview" scrim priority={i < 5}>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3.5 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100">
                  <p className="display text-[0.98rem] leading-tight text-white">
                    {displayTitle(clip)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">
                    {displayLocation(clip)}
                  </p>
                </div>
              </FilmFrame>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
