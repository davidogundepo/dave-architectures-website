import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import Reveal from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Send one listing and see what comes back. Tell us the property, the portal it is on, and which cuts you need.',
};

const steps = [
  ['You send', 'A link to the listing, or the photo set straight from your camera roll.'],
  ['We quote', 'A fixed price against one of the three packages, within a day.'],
  ['We film', 'Both cuts back inside five working days. One revision included.'],
];

export default function ContactPage() {
  return (
    <>
      <header className="pt-36 pb-10 sm:pt-44">
        <div className="shell">
          <p className="label text-[var(--ink-3)]">Contact</p>
          <h1 className="display t-hero mt-5 max-w-[13ch]">
            Send one
            <br />
            listing
          </h1>
          <p className="lede mt-8 max-w-[48ch]">
            Pick the property you most want sold. If the photos are already
            online, a link is enough to start.
          </p>
        </div>
      </header>

      <section className="pb-[clamp(4rem,10vh,8rem)]">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <ul className="border-t border-[var(--line)]">
              {steps.map(([title, detail], i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <li className="border-b border-[var(--line)] py-6">
                    <p className="label text-[var(--accent-deep)]">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="display mt-2.5 text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none">
                      {title}
                    </p>
                    <p className="body-text mt-2 max-w-[38ch]">{detail}</p>
                  </li>
                </Reveal>
              ))}
            </ul>

            <div className="mt-10">
              <p className="label text-[var(--ink-3)]">Or just write</p>
              <a
                href={`mailto:${SITE.email}`}
                data-cursor="Write"
                className="display mt-3 block text-[clamp(1.3rem,2.6vw,2.1rem)] leading-none underline decoration-[var(--accent)] decoration-2 underline-offset-8 transition-colors duration-300 hover:text-[var(--accent)]"
              >
                {SITE.email}
              </a>

              <div className="mt-7 flex gap-6">
                {SITE.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label text-[var(--ink-3)] transition-colors hover:text-[var(--accent)]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
