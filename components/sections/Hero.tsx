'use client';

import Link from 'next/link';
import { useState } from 'react';
import FilmFrame from '@/components/media/FilmFrame';
import { getBrand } from '@/lib/brands';
import { displayLocation, displayTitle, pickDiverse, portraitClips, stats } from '@/lib/videos';

const reel = pickDiverse(portraitClips, 3);

export default function Hero() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 lg:pt-44">
      <div className="shell">
        <div className="flex flex-col items-center text-center">
          <p className="label flex items-center gap-2.5 text-[var(--ink-3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Property films from still photographs
          </p>

          <h1 className="display t-mega mt-6 max-w-[16ch]">
            Stills in.
            <br />
            <span className="text-[var(--accent)]">Film</span> out.
          </h1>

          <p className="lede mt-8 max-w-[46ch] text-balance">
            Send the photos you already have of the house. We send back a
            property film that makes people stop scrolling and book a viewing.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              data-cursor="Let's go"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-8 py-4 text-white transition-colors duration-300 hover:bg-[var(--accent-deep)]"
            >
              <span className="label !tracking-[0.18em]">Start a film</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/work"
              data-cursor="See it"
              className="inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] px-8 py-4 transition-colors duration-300 hover:border-[var(--ink)]"
            >
              <span className="label !tracking-[0.18em]">
                Watch {stats.films} films
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* The accordion: five 9:16 cuts that stretch toward 16:9 as you hover,
          which is also the moment the film starts. */}
      <div className="shell mt-16 sm:mt-20">
        {/* Three frames butted together. Idle, they share the width equally;
            hovering one pushes it wide and squeezes the other two. */}
        <div
          className="flex h-[clamp(320px,52vh,600px)] items-stretch gap-[2px] overflow-hidden"
          onMouseLeave={() => setActive(null)}
        >
          {reel.map((clip, i) => {
            const isActive = active === i;
            const brand = getBrand(clip.brandId);

            return (
              <div
                key={clip.id}
                onMouseEnter={() => setActive(i)}
                className="relative min-w-0 transition-[flex-grow] duration-[700ms] ease-[var(--ease)]"
                style={{ flexGrow: isActive ? 2.6 : 1, flexBasis: 0 }}
              >
                <FilmFrame
                  clip={clip}
                  trigger="hover"
                  scrim
                  priority
                  fill
                  rounded={false}
                  className="h-full w-full"
                >
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
                    <p
                      className={`label mb-2 text-white/70 transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {brand.domain}
                    </p>
                    <p className="display text-[clamp(0.95rem,1.5vw,1.75rem)] leading-[0.95] text-white">
                      {displayTitle(clip)}
                    </p>
                    <p
                      className={`mt-1 text-sm text-white/75 transition-all duration-500 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                      }`}
                    >
                      {displayLocation(clip)}
                    </p>
                  </div>
                </FilmFrame>
              </div>
            );
          })}
        </div>

        <p className="label mt-5 text-center text-[var(--ink-3)]">
          Hover a frame to play · Every film ships in 16:9 and 9:16
        </p>
      </div>
    </section>
  );
}
