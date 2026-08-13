import type { Metadata } from 'next';
import Reveal from '@/components/ui/Reveal';
import Statement from '@/components/sections/Statement';
import Numbers from '@/components/sections/Numbers';
import CallToAction from '@/components/sections/CallToAction';
import FilmFrame from '@/components/media/FilmFrame';
import { landscapeClips, pickDiverse } from '@/lib/videos';

export const metadata: Metadata = {
  title: 'About',
  description:
    'A one-person studio turning listing photographs into property films — why it exists, how it differs from a Matterport tour, and what it costs to try.',
};

const beliefs = [
  {
    title: 'A film is not a slideshow',
    body: 'Photos cross-fading to music is a slideshow, and buyers can tell in a second. A film has camera movement, a route through the house, and a reason for every cut.',
  },
  {
    title: 'The 3D tour is not the competition',
    body: 'A Matterport scan needs a technician, a tripod rig and two hours on site — and you still cannot post the result to Instagram. We make the thing that goes in the feed.',
  },
  {
    title: 'Empty rooms are the hardest sell',
    body: 'Vacant stock photographs badly and shows badly. Staging it digitally and then animating it is the single biggest change we can make to a listing.',
  },
  {
    title: 'Distance is irrelevant',
    body: 'The work travels as files. We have filmed houses in Aspen, Knightsbridge, Dubai, Sydney, Cape Town and Lagos without leaving the desk.',
  },
];

export default function AboutPage() {
  const strip = pickDiverse(landscapeClips, 3, 5);

  return (
    <>
      <header className="pt-36 pb-12 sm:pt-44">
        <div className="shell">
          <p className="label text-[var(--ink-3)]">About</p>
          <h1 className="display t-hero mt-5 max-w-[15ch]">
            A studio with
            <br />
            <span className="text-[var(--accent)]">no cameras</span>
          </h1>
        </div>
      </header>

      <section className="pb-16">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="space-y-6">
            <Reveal>
              <p className="lede !text-[var(--ink)]">
                Dave Architectures makes property films out of photographs that
                already exist.
              </p>
            </Reveal>
            <p className="body-text">
              Almost every listing on earth already has a full set of professional
              photographs. They sit in a gallery that a buyer clicks through in
              about eleven seconds. Meanwhile a film of the same house — the kind
              that used to need a videographer, a gimbal and a day on site — costs
              enough that most agents only commission one for the top of their book.
            </p>
            <p className="body-text">
              That gap is the whole business. We take the photographs an agent
              already paid for, give them motion, depth and a route through the
              house, and hand back the film that should have existed all along.
              No second visit, no scheduling around tenants, no weather.
            </p>
            <p className="body-text">
              The reel on this site is the proof. Every film in it was built from
              the public photographs of a real, live listing — from a $62m estate
              in Aspen to a two-bed off Admiralty Way in Lekki — without anyone
              setting foot in a single one of them.
            </p>
          </div>

          <div className="space-y-3">
            {strip.map((clip, i) => (
              <Reveal key={clip.id} delay={i * 0.08}>
                <FilmFrame clip={clip} trigger="inview" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Statement
        eyebrow="What we hold to"
        lines={['Four things', 'we are sure of']}
        accentLine={1}
        tone="night"
      />

      <section className="py-[clamp(4rem,9vh,7rem)]">
        <div className="shell grid gap-x-14 sm:grid-cols-2">
          {beliefs.map((belief, i) => (
            <Reveal key={belief.title} delay={(i % 2) * 0.07}>
              <div className="border-t border-[var(--line)] py-8">
                <p className="label text-[var(--accent-deep)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="display mt-3 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-none">
                  {belief.title}
                </h2>
                <p className="body-text mt-3 max-w-[46ch]">{belief.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Numbers />
      <CallToAction />
    </>
  );
}
