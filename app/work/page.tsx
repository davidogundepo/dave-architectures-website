import type { Metadata } from 'next';
import WorkBrowser from '@/components/work/WorkBrowser';
import CallToAction from '@/components/sections/CallToAction';
import { activeBrands, clips, regions } from '@/lib/videos';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Every film in the reel — property films built from listing photographs across 13 portals and six regions, in 16:9 and 9:16.',
};

export default function WorkPage() {
  return (
    <>
      <header className="pt-36 pb-12 sm:pt-44">
        <div className="shell">
          <p className="label text-[var(--ink-3)]">The reel</p>
          <h1 className="display t-hero mt-5 max-w-[13ch]">
            {clips.length} films.
            <br />
            No cameras.
          </h1>
          <p className="lede mt-8 max-w-[52ch]">
            Every one of these started as a set of still photographs from a live
            listing on {activeBrands.length} portals across {regions.length}{' '}
            regions. Nobody visited a single property.
          </p>
        </div>
      </header>

      <WorkBrowser />
      <CallToAction />
    </>
  );
}
