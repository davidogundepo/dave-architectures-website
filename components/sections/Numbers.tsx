'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/lib/hooks';
import { stats } from '@/lib/videos';

/**
 * Production facts, not marketing arithmetic. Every figure here is derived from
 * the reel itself or from how the studio actually works — nothing invented.
 */
const figures = [
  {
    value: stats.films,
    suffix: '',
    label: 'Films in the reel',
    note: 'Every one built from stills alone.',
    lift: 0,
  },
  {
    value: stats.portals,
    suffix: '',
    label: 'Listing portals covered',
    note: 'From Rightmove to Bayut to Pam Golding.',
    lift: 3,
  },
  {
    value: 0,
    suffix: '',
    label: 'Site visits needed',
    note: 'No crew, no scheduling, no access problems.',
    lift: 1,
  },
  {
    value: 5,
    suffix: ' days',
    label: 'Typical turnaround',
    note: 'Photos Monday, both cuts by Friday.',
    lift: 4,
  },
  {
    value: 2,
    suffix: '',
    label: 'Aspect ratios per house',
    note: '16:9 for the listing, 9:16 for the feed.',
    lift: 2,
  },
];

export default function Numbers() {
  return (
    <section className="bg-[var(--night)] py-[clamp(5rem,11vh,9rem)] text-[var(--on-night)]">
      <div className="shell">
        <div className="mx-auto max-w-[46ch] text-center">
          <p className="label text-[var(--on-night-2)]">By the numbers</p>
          <h2 className="display t-section mt-4 text-balance">
            No crew. No scaffolding. No re-shoot.
          </h2>
        </div>

        <div className="relative mt-20 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
          {figures.map((figure) => (
            <Figure key={figure.label} {...figure} />
          ))}

          {/* The baseline the stems drop onto. */}
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-6 hidden h-px lg:block"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, var(--line-night) 0 1px, transparent 1px 14px)',
            }}
          />
        </div>
      </div>
    </section>
  );
}

function Figure({
  value,
  suffix,
  label,
  note,
  lift,
}: (typeof figures)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: '-10% 0px' });

  return (
    <div ref={ref} className="relative flex flex-col">
      <div style={{ paddingBottom: `calc(${lift} * 1.5rem)` }} className="lg:block hidden" />

      <div className="rounded-[var(--radius)] border border-[var(--line-night)] bg-[var(--night-2)] p-5">
        <p className="display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.85] text-[var(--accent)]">
          <Count to={value} run={inView} />
          {suffix}
        </p>
        <p className="mt-3 text-[0.95rem] leading-snug font-medium">{label}</p>
        <p className="mt-1.5 text-sm leading-snug text-[var(--on-night-2)]">{note}</p>
      </div>

      {/* Stem down to the baseline, echoing the reference chart. */}
      <div className="relative hidden flex-1 justify-center lg:flex">
        <span className="w-px flex-1 bg-[var(--line-night)]" />
        <span className="absolute -bottom-[3px] h-1.5 w-1.5 rounded-full bg-[var(--on-night-2)]" />
      </div>
    </div>
  );
}

/** Counts up once, on entry. Static for anyone who has asked for less motion. */
function Count({ to, run }: { to: number; run: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (to === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);

  return <>{n}</>;
}
