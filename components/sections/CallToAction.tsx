import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { SITE, mailHref } from '@/lib/site';

export default function CallToAction() {
  return (
    <section className="border-t border-[var(--line)] py-[clamp(5rem,12vh,9rem)]">
      <div className="shell text-center">
        <Reveal>
          <p className="label text-[var(--ink-3)]">Next step</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="display t-hero mt-5 text-balance">
            Send us one listing
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede mx-auto mt-7 max-w-[46ch] text-balance">
            Pick the property you most want sold. Send the photos. You&rsquo;ll
            have both cuts back inside a week, and you decide from there.
          </p>
        </Reveal>

        <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            data-cursor="Let's go"
            className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-9 py-5 text-white transition-colors duration-300 hover:bg-[var(--accent-deep)]"
          >
            <span className="label !tracking-[0.18em]">Start a film</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href={mailHref()}
            data-cursor="Write"
            className="label inline-flex items-center border-b border-[var(--ink)] pb-1 transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}
