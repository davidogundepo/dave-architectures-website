import type { Metadata } from "next";
import { Bebas_Neue, DM_Serif_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-editorial",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Nouvelle Architectures | Cinematic AI Video",
  description: "Automated AI Cinema & Cinematic Video Pipelines for High-End Real Estate Listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${dmSerif.variable} ${spaceMono.variable}`}>
      <body className="antialiased font-editorial bg-[var(--bg-void)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
