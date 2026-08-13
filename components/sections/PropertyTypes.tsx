'use client';

import Link from 'next/link';
import FilmFrame from '@/components/media/FilmFrame';
import Reveal from '@/components/ui/Reveal';
import { clips } from '@/lib/videos';

/**
 * "Types of properties we can film" — each card is fronted by a real clip from
 * that category rather than stock, so the claim and the proof are the same tile.
 */
const categories = [
  {
    label: 'City apartments',
    detail: 'Towers, penthouses and one-beds where the view is the product.',
    clipId: 'domain-com-au-3',
  },
  {
    label: 'Family homes',
    detail: 'Suburban houses where flow between rooms is what sells.',
    clipId: 'rightmove-co-uk-5',
  },
  {
    label: 'Estates & country',
    detail: 'Grounds, outbuildings and approach shots that need room to breathe.',
    clipId: 'savills-co-uk-5',
  },
  {
    label: 'New developments',
    detail: 'Off-plan and just-finished stock, unit by unit.',
    clipId: 'zillow-com-us-1',
  },
  {
    label: 'Resort & waterfront',
    detail: 'Beach villas and marina property, graded warm.',
    clipId: 'sothebysrealty-com-eng-3',
  },
  {
    label: 'Luxury & trophy',
    detail: 'The listings where the film has to match the price tag.',
    clipId: 'christiesrealestate-com-1',
  },
];

export default function PropertyTypes() {
  const byId = new Map(clips.map((c) => [c.id, c]));
  const cards = categories
    .map((c) => ({ ...c, clip: byId.get(c.clipId) }))
    .filter((c) => c.clip);

  if (!cards.length) return null;

  return (
    <section className="py-[clamp(5rem,11vh,9rem)]">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-10">
          <div>
            <Reveal>
              <p className="label text-[var(--ink-3)]">What we film</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display t-section mt-4 max-w-[16ch]">
                If it has rooms,
                <br />
                it has a film in it
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <Link
              href="/services"
              data-cursor="Details"
              className="label inline-flex items-center gap-2 border-b border-[var(--ink)] pb-1 transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              What&rsquo;s included <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {cards.map(({ label, detail, clip }, i) => (
            <Reveal key={label} delay={(i % 3) * 0.07}>
              <article className="group/card">
                <FilmFrame
                  clip={clip!}
                  trigger="hover"
                  scrim
                  ratio="4 / 3"
                >
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5">
                    <h3 className="display text-[clamp(1.3rem,2.2vw,2rem)] leading-none text-white">
                      {label}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-sm leading-snug text-white/0 transition-colors duration-500 group-hover/card:text-white/85">
                      {detail}
                    </p>
                  </div>
                </FilmFrame>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
