import Hero from '@/components/sections/Hero';
import PortalMarquee from '@/components/sections/PortalMarquee';
import Statement from '@/components/sections/Statement';
import CinemaWall from '@/components/sections/CinemaWall';
import VerticalReels from '@/components/sections/VerticalReels';
import HorizontalReel from '@/components/sections/HorizontalReel';
import Process from '@/components/sections/Process';
import Numbers from '@/components/sections/Numbers';
import PropertyTypes from '@/components/sections/PropertyTypes';
import Mosaic from '@/components/sections/Mosaic';
import Faq from '@/components/sections/Faq';
import CallToAction from '@/components/sections/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <PortalMarquee />

      <Statement
        eyebrow="What we actually do"
        lines={['A house sells', 'twice. Once', 'in the photos.']}
        accentLine={2}
        sub="The second time is in the film — the one that shows how the rooms connect, where the light lands, and what it feels like to walk in."
      />

      <CinemaWall />
      <VerticalReels />
      <HorizontalReel />
      <PropertyTypes />
      <Process />
      <Mosaic />
      <Numbers />
      <Faq />
      <CallToAction />
    </>
  );
}
