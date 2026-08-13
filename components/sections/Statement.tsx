import Reveal from '@/components/ui/Reveal';

interface Props {
  eyebrow?: string;
  lines: string[];
  /** Index of the line to set in the accent colour. */
  accentLine?: number;
  sub?: string;
  tone?: 'paper' | 'night';
}

/** The full-width editorial breath between content blocks. */
export default function Statement({
  eyebrow,
  lines,
  accentLine,
  sub,
  tone = 'paper',
}: Props) {
  const night = tone === 'night';

  return (
    <section
      className={`py-[clamp(6rem,14vh,11rem)] ${night ? 'bg-[var(--night)]' : ''}`}
    >
      <div className="shell text-center">
        {eyebrow && (
          <Reveal>
            <p className={`label mb-8 ${night ? 'text-[var(--on-night-2)]' : 'text-[var(--ink-3)]'}`}>
              {eyebrow}
            </p>
          </Reveal>
        )}

        <h2 className={`display t-section ${night ? 'text-[var(--on-night)]' : ''}`}>
          {lines.map((line, i) => (
            <Reveal key={line} delay={i * 0.08}>
              <span
                className={`block ${i === accentLine ? 'text-[var(--accent)]' : ''}`}
              >
                {line}
              </span>
            </Reveal>
          ))}
        </h2>

        {sub && (
          <Reveal delay={lines.length * 0.08}>
            <p
              className={`lede mx-auto mt-9 max-w-[52ch] text-balance ${
                night ? 'text-[var(--on-night-2)]' : ''
              }`}
            >
              {sub}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
