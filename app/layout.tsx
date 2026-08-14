import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Serif_Display, Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/cursor/CustomCursor';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/footer/Footer';
import { SITE } from '@/lib/site';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Property films from still photographs`,
    template: `%s — ${SITE.name}`,
  },
  description:
    'We turn the listing photos you already have into cinematic property films — a 16:9 cut for the listing and 9:16 cuts for the feed. No crew, no site visit.',
  openGraph: {
    title: `${SITE.name} — Property films from still photographs`,
    description: SITE.tagline,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dave Architectures — stills in, film out',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Property films from still photographs`,
    description: SITE.tagline,
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${dmSerif.variable} ${spaceMono.variable} ${inter.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          <CustomCursor />
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
