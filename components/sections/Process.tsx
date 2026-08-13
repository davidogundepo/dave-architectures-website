import Reveal from '@/components/ui/Reveal';

const stages = [
  {
    name: 'Photos',
    detail: 'You send whatever you have — agent shots, phone photos, floor plans.',
  },
  {
    name: 'Sequence',
    detail: 'We order the rooms into a walkthrough that actually makes spatial sense.',
  },
  {
    name: 'Motion',
    detail: 'Each still gets camera move, parallax and depth. Stills stop looking like stills.',
  },
  {
    name: 'Grade & Cut',
    detail: 'Colour, music, captions, and the two cuts — 16:9 and 9:16.',
  },
];

const deliverables = [
  'One 16:9 master, up to 90 seconds',
  'Three 9:16 social cuts',
  'Captions burned in and as .srt',
  'Thumbnail stills pulled from the film',
  'One round of revisions included',
];

/** The funnel: four stages narrowing from a pile of photos to a finished cut. */
export default function Process() {
  return (
    <section className="py-[clamp(5rem,11vh,9rem)]">
      <div className="shell">
        <div className="mx-auto max-w-[52ch] text-center">
          <Reveal>
            <p className="label text-[var(--ink-3)]">How it gets made</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display t-section mt-4">Photos to film</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede mt-6 text-balance">
              Four stages, about five working days. You are only needed at the
              start and the end.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10">
          <div className="order-2 space-y-8 lg:order-1">
            {stages.slice(0, 2).map((stage, i) => (
              <StageNote key={stage.name} n={i + 1} {...stage} />
            ))}
          </div>

          {/* The funnel itself. Each band is a little narrower than the last. */}
          <div className="order-1 flex flex-col items-center gap-1.5 lg:order-2">
            {stages.map((stage, i) => {
              const inset = 5 + i * 5.5;
              return (
                <Reveal key={stage.name} delay={i * 0.09} className="w-full">
                  <div
                    className="flex h-[clamp(58px,8vw,84px)] w-full items-center justify-center text-white"
                    style={{
                      background: `color-mix(in oklab, var(--accent) ${100 - i * 17}%, #6C1508)`,
                      clipPath: `polygon(${inset}% 0, ${100 - inset}% 0, ${100 - inset - 5.5}% 100%, ${inset + 5.5}% 100%)`,
                    }}
                  >
                    <span className="display text-[clamp(1.1rem,2.1vw,1.9rem)] leading-none tracking-wide">
                      {stage.name}
                    </span>
                  </div>
                </Reveal>
              );
            })}

            <Reveal delay={stages.length * 0.09}>
              <p className="label mt-5 text-center text-[var(--ink-3)]">
                ≈ 5 working days
              </p>
            </Reveal>
          </div>

          <div className="order-3 space-y-8">
            {stages.slice(2).map((stage, i) => (
              <StageNote key={stage.name} n={i + 3} {...stage} />
            ))}
          </div>
        </div>

        {/* What lands in the inbox at the end. */}
        <div className="mt-16 rounded-[var(--radius-lg)] bg-[var(--paper-2)] p-[clamp(1.5rem,4vw,3rem)]">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-14">
            <div>
              <p className="label text-[var(--ink-3)]">What you get</p>
              <h3 className="display mt-3 text-[clamp(1.8rem,3.2vw,3rem)] leading-[0.9]">
                One shoot-free
                <br />
                delivery
              </h3>
            </div>
            <ul className="grid gap-0 self-center">
              {deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-[var(--line)] py-3 last:border-0"
                >
                  <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span className="body-text !text-[var(--ink)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageNote({ n, name, detail }: { n: number; name: string; detail: string }) {
  return (
    <Reveal delay={n * 0.05}>
      <div className="border-t border-[var(--line)] pt-4">
        <p className="label text-[var(--accent-deep)]">
          {String(n).padStart(2, '0')} · {name}
        </p>
        <p className="body-text mt-2">{detail}</p>
      </div>
    </Reveal>
  );
}
