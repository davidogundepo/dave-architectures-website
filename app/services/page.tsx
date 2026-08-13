import type { Metadata } from 'next';
import Reveal from '@/components/ui/Reveal';
import Process from '@/components/sections/Process';
import CallToAction from '@/components/sections/CallToAction';
import Statement from '@/components/sections/Statement';
import Faq from '@/components/sections/Faq';
import FilmFrame from '@/components/media/FilmFrame';
import { landscapeClips, pickDiverse, portraitClips } from '@/lib/videos';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'We turn an agent’s existing listing photographs into property films — a 16:9 cut for the listing page and 9:16 cuts for the feed. No shoot, no site visit.',
};

const formats = [
  {
    id: 'listing-film',
    ratio: '16:9',
    name: 'The listing film',
    where: 'Portal listing · YouTube · office screen · website hero',
    body: 'The wide cut. Paced slower, graded warmer, built to be watched on a big display while someone decides whether to book a viewing.',
  },
  {
    id: 'social-cuts',
    ratio: '9:16',
    name: 'The social cuts',
    where: 'Reels · TikTok · Shorts · WhatsApp Status',
    body: 'The same house recut for a thumb. Best room first, faster cuts, captions burned in — because a Matterport link cannot be posted to Instagram, and a photo carousel does not stop the scroll.',
  },
];

const included = [
  {
    title: 'Motion from stills',
    body: 'Every photograph gets a real camera move — dolly, orbit, tilt — with parallax and depth. Not a slideshow with a zoom on it.',
  },
  {
    title: 'A route through the house',
    body: 'Rooms are sequenced the way someone would actually walk them: approach, entrance, living, kitchen, bedrooms, outside. The film has to make spatial sense.',
  },
  {
    title: 'Virtual staging',
    body: 'An empty room is the hardest thing to sell. We furnish it digitally, then animate the furnished version, so vacant stock stops photographing cold.',
  },
  {
    title: 'Sky and light',
    body: 'A grey-day exterior becomes golden hour. Day-to-twilight on request — the shot agents pay drone operators to wait around for.',
  },
  {
    title: 'Captions and your branding',
    body: 'Address, key specs, your logo and your contact details burned in. Most of the feed watches on mute.',
  },
  {
    title: 'Both ratios, cut separately',
    body: 'The 9:16 is not a crop of the 16:9. They are two different edits, because they are watched in two different ways.',
  },
];

const forWho = [
  ['Listing agents', 'One film per property, turned around while the listing is still fresh.'],
  ['Brokerages & teams', 'Every listing on the book filmed to the same standard, at volume.'],
  ['Developers', 'Off-plan and just-finished stock, unit type by unit type.'],
  ['Property managers', 'Rental stock that has to let fast, filmed without disturbing tenants.'],
];

export default function ServicesPage() {
  const [wide] = pickDiverse(landscapeClips, 1, 2);
  const [tall] = pickDiverse(portraitClips, 1, 4);
  const samples = [wide, tall];

  return (
    <>
      <header className="pt-36 pb-4 sm:pt-44">
        <div className="shell">
          <p className="label text-[var(--ink-3)]">What we do</p>
          <h1 className="display t-hero mt-5 max-w-[16ch]">
            You already have
            <br />
            the photos
          </h1>
          <p className="lede mt-8 max-w-[54ch]">
            Every listing you take on gets a full set of professional photographs
            — and then a buyer clicks through them in about eleven seconds. We
            turn that same set into a film, without another visit to the property.
          </p>
        </div>
      </header>

      {/* The two formats */}
      <section className="py-14">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-6">
          {formats.map((format, i) => (
            <Reveal key={format.id} delay={i * 0.08}>
              <article id={format.id} className="scroll-mt-28">
                {samples[i] && (
                  <FilmFrame
                    clip={samples[i]}
                    trigger="inview"
                    ratio="16 / 10"
                    scrim
                  >
                    <span className="display absolute left-5 top-4 z-10 text-[clamp(1.6rem,3vw,2.6rem)] leading-none text-white/90">
                      {format.ratio}
                    </span>
                  </FilmFrame>
                )}
                <h2 className="display mt-6 text-[clamp(1.7rem,3vw,2.6rem)] leading-none">
                  {format.name}
                </h2>
                <p className="label mt-3 text-[var(--accent-deep)]">{format.where}</p>
                <p className="body-text mt-4 max-w-[46ch]">{format.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="shell mt-10">
          <p className="body-text max-w-[62ch]">
            Every property comes back with both. One film is not a substitute for
            the other — the wide cut sells the house, the vertical cut finds the
            person who buys it.
          </p>
        </div>
      </section>

      <Statement
        eyebrow="What happens to a photograph"
        lines={['Six things', 'we do to', 'a still image']}
        accentLine={2}
      />

      <section id="included" className="scroll-mt-24 pb-[clamp(4rem,9vh,7rem)]">
        <div className="shell grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.06}>
              <div className="border-t border-[var(--line)] py-7">
                <p className="label text-[var(--accent-deep)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="display mt-3 text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none">
                  {item.title}
                </h3>
                <p className="body-text mt-3">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Process />

      {/* Who it's for */}
      <section id="who" className="scroll-mt-24 bg-[var(--paper-2)] py-[clamp(4rem,9vh,7rem)]">
        <div className="shell">
          <Reveal>
            <h2 className="display t-section max-w-[14ch]">Who we film for</h2>
          </Reveal>
          <div className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {forWho.map(([title, body], i) => (
              <Reveal key={title} delay={(i % 2) * 0.06}>
                <div className="border-t border-[var(--line-strong)] py-6">
                  <p className="display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none">
                    {title}
                  </p>
                  <p className="body-text mt-2 max-w-[42ch]">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="body-text mt-10 max-w-[58ch]">
            Pricing is per property and depends on how many rooms need animating
            and whether anything needs staging. Send one listing and you&rsquo;ll
            have a number back the same day.
          </p>
        </div>
      </section>

      <Faq />
      <CallToAction />
    </>
  );
}
