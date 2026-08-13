import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every route on this site prerenders to static HTML, so we export a plain
  // directory of files for Firebase Hosting rather than running a Node server.
  output: 'export',
  images: {
    // No image optimizer on static hosting. The only next/image uses are the
    // two small logo marks; posters are plain <img> and already sized.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
