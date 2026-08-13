import { activeBrands } from '@/lib/videos';

/**
 * The portals the source photography came from. Not a client logo wall — it is
 * the provenance of the stills, and it doubles as proof of range.
 */
export default function PortalMarquee() {
  const row = [...activeBrands, ...activeBrands];

  return (
    <section className="border-y border-[var(--line)] py-8">
      <div className="shell">
        <p className="label mb-6 text-center text-[var(--ink-3)]">
          Built from listings on
        </p>
      </div>

      <div className="edge-fade-x group relative overflow-hidden">
        <div
          className="track-left flex w-max items-center gap-14 group-hover:[animation-play-state:paused] sm:gap-20"
          style={{ ['--speed' as string]: '46s' }}
        >
          {row.map((brand, i) => (
            <span
              key={`${brand.id}-${i}`}
              aria-hidden={i >= activeBrands.length}
              className="display whitespace-nowrap text-[clamp(1.35rem,2.4vw,2.4rem)] leading-none text-[var(--ink-3)] transition-colors duration-300 hover:text-[var(--ink)]"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
