'use client';

import Link from 'next/link';
import FilmFrame from '@/components/media/FilmFrame';
import Reveal from '@/components/ui/Reveal';
import { getBrand } from '@/lib/brands';
import { displayLocation, displayTitle, landscapeClips, pickDiverse } from '@/lib/videos';

const wall = pickDiverse(landscapeClips, 6);

/**
 * The 16:9 grid. Deliberately on black — this is the one place the site goes
 * dark, because a wall of video on white reads as a spreadsheet.
 */
export default function CinemaWall() {
  return (
    <section className="bg-[var(--night)] py-[clamp(4rem,9vh,7rem)] text-[var(--on-night)]">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-10">
          <div>
            <Reveal>
              <p className="label text-[var(--on-night-2)]">The 16:9 cut</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display t-section mt-4 max-w-[14ch]">
                For the listing page
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <p className="body-text max-w-[38ch] !text-[var(--on-night-2)]">
              The wide cut is the one that sits at the top of a portal listing,
              plays on a showroom screen, or runs as a pre-roll. Paced slower,
              graded warmer, built to be watched on a big display.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {wall.map((clip, i) => {
            const brand = getBrand(clip.brandId);
            return (
              <Link
                key={clip.id}
                href={`/work#${clip.id}`}
                data-cursor="Play"
                className="block"
              >
                <FilmFrame clip={clip} trigger="hover" scrim priority={i < 2}>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5">
                    <p className="label text-white/60">{brand.domain}</p>
                    <p className="display mt-1.5 text-[clamp(1.1rem,1.7vw,1.6rem)] leading-none text-white">
                      {displayTitle(clip)}
                    </p>
                    <p className="mt-1 text-sm text-white/70">{displayLocation(clip)}</p>
                  </div>
                </FilmFrame>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/work"
            data-cursor="All of it"
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--line-night)] px-8 py-4 transition-colors duration-300 hover:border-white"
          >
            <span className="label !tracking-[0.18em]">See the full reel</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
