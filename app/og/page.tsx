import Image from 'next/image';
import { portraitClips, stats } from '@/lib/videos';

/**
 * Source artwork for the social share card, not a page anyone browses to.
 *
 * It renders at exactly 1200×630 using the real fonts, colours and posters, and
 * is captured to public/og-image.jpg by scripts/capture_og.md. Keeping it as a
 * route means the card can be regenerated whenever the branding moves, instead
 * of drifting away from the site as a hand-made file would.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function OgCard() {
  // Hand-picked rather than offset-derived: these three read well at thumbnail
  // size and carry no portal watermark in frame.
  const frames = ['christiesrealestate-com-3', 'savills-co-uk-5', 'pamgolding-co-za-3']
    .map((id) => portraitClips.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div
      id="og-card"
      className="fixed inset-0 z-[2000] flex bg-[var(--paper)]"
      style={{ width: 1200, height: 630 }}
    >
      <div className="flex flex-1 flex-col justify-center gap-9 p-[58px]">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-mark-light.png"
            alt=""
            width={80}
            height={80}
            className="h-11 w-11 object-contain mix-blend-multiply"
          />
          <span className="display text-[1.4rem] leading-[0.9]">
            Dave
            <br />
            Architectures
          </span>
        </div>

        <div>
          <h1 className="display text-[5.6rem] leading-[0.82]">
            Stills in.
            <br />
            <span className="text-[var(--accent)]">Film</span> out.
          </h1>
          <p className="mt-6 max-w-[30ch] text-[1.15rem] leading-snug text-[var(--ink-2)]">
            We turn the listing photos you already have into property films —
            16:9 for the listing, 9:16 for the feed.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <span className="label rounded-full bg-[var(--accent)] px-5 py-2.5 text-white">
            {stats.films} films · {stats.portals} portals
          </span>
          <span className="label text-[var(--ink-3)]">dave-architectures.web.app</span>
        </div>
      </div>

      {/* Three frames butted together, echoing the hero. */}
      <div className="flex w-[492px] shrink-0 gap-[3px]">
        {frames.map((clip) => (
          <div key={clip.id} className="relative flex-1 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clip.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
