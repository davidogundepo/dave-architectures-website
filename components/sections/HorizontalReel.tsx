'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FilmFrame from '@/components/media/FilmFrame';
import { getBrand } from '@/lib/brands';
import { displayLocation, displayTitle, landscapeClips, pickDiverse } from '@/lib/videos';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reel = pickDiverse(landscapeClips, 8, 3);

/**
 * Pinned horizontal gallery: vertical scroll drives the track sideways.
 * Below the lg breakpoint it degrades to an ordinary swipeable strip, which is
 * the better interaction on a phone anyway.
 */
export default function HorizontalReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { x: 0 });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--paper-2)] py-16 lg:h-screen lg:py-0">
      <div className="flex h-full flex-col justify-center">
        <div className="shell shrink-0 pb-8 lg:pb-10">
          <p className="label text-[var(--ink-3)]">Selected work</p>
          <h2 className="display t-section mt-4 max-w-[18ch]">
            Eight houses, eight stories
          </h2>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 overflow-x-auto px-[var(--gutter)] pb-4 lg:overflow-visible lg:pb-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {reel.map((clip, i) => {
            const brand = getBrand(clip.brandId);
            return (
              <figure
                key={clip.id}
                className="w-[min(84vw,760px)] shrink-0"
                style={{ scrollSnapAlign: 'center' }}
              >
                <FilmFrame clip={clip} trigger="hover" />
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <p className="display truncate text-[clamp(1.1rem,1.6vw,1.6rem)] leading-none">
                      {displayTitle(clip)}
                    </p>
                    <p className="body-text mt-1 truncate !text-[var(--ink-3)]">
                      {displayLocation(clip)} · {brand.domain}
                    </p>
                  </div>
                  <span className="label shrink-0 text-[var(--ink-3)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="shell mt-8 hidden shrink-0 lg:block">
          <span className="block h-px w-full bg-[var(--line)]">
            <span
              ref={progressRef}
              className="block h-px w-full origin-left scale-x-0 bg-[var(--accent)]"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
