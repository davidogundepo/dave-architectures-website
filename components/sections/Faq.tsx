'use client';

import { useState } from 'react';
import Reveal from '@/components/ui/Reveal';

const questions = [
  {
    q: 'Do you need to visit the property?',
    a: 'No. That is the whole point. You send the photographs you already have — the agency shoot, a phone set, whatever exists — and everything happens from there. No access arrangements, no tenants to work around, no waiting on weather.',
  },
  {
    q: 'How is this different from a Matterport tour?',
    a: 'A 3D scan needs a technician on site with a tripod rig for a couple of hours, and the result is a web link a buyer clicks through like Street View. You cannot post it to Instagram, you cannot run it as pre-roll, and it does not play on the screen in your office window. We make the film that goes everywhere the scan cannot.',
  },
  {
    q: 'What if the house is empty?',
    a: 'Empty is where this helps most. We stage the rooms digitally — furniture, rugs, lighting — and then animate the staged version. A vacant listing that photographs cold ends up looking lived in.',
  },
  {
    q: 'How many photos do you need?',
    a: 'Around ten to twelve good ones covers a whole house: exterior, living, kitchen, main bedroom, bathroom, and whatever the property is actually selling on. Fewer is fine for an apartment. We will tell you if a set is too thin before starting.',
  },
  {
    q: 'How long does it take?',
    a: 'About five working days from the photos landing to both cuts coming back. Rush turnarounds are possible when a listing is going live on a fixed date.',
  },
  {
    q: 'Whose branding goes on it?',
    a: 'Yours. Your logo, your contact details, the address and key specs burned in. The film is yours to post, embed, send and run as an ad.',
  },
  {
    q: 'Can I see one made from my own listing first?',
    a: 'Yes. Send one property and we will build it. Every film in the reel on this site was made exactly that way — from the public photographs of a live listing.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-[clamp(5rem,11vh,9rem)]">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
        <div>
          <Reveal>
            <span className="label inline-block -rotate-6 bg-[var(--accent)] px-4 py-2.5 text-white">
              Questions
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="mt-7 text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              The things agents
              <br />
              ask first
            </h2>
          </Reveal>
        </div>

        <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--accent)]/25 bg-[var(--accent-soft)]">
          {questions.map((item, i) => {
            const expanded = open === i;
            return (
              <div
                key={item.q}
                className="border-b border-[var(--accent)]/20 last:border-0"
              >
                <h3>
                  <button
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between gap-6 px-5 py-6 text-left sm:px-7"
                  >
                    <span
                      className="text-[clamp(1.1rem,1.9vw,1.6rem)] leading-tight"
                      style={{ fontFamily: 'var(--font-editorial)' }}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded border border-[var(--accent)]/50 text-[var(--accent-deep)] transition-transform duration-300 ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    >
                      ⌄
                    </span>
                  </button>
                </h3>

                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease)]"
                  style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="body-text max-w-[68ch] px-5 pb-7 !text-[var(--ink)] sm:px-7">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
