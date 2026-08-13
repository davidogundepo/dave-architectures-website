export const SITE = {
  name: 'Dave Architectures',
  tagline: 'Property films made from the photographs you already have.',
  url: 'https://dave-architectures.web.app',
  email: 'david@nouvellesoft.com.ng',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/dave.architectures' },
    { label: 'TikTok', href: 'https://tiktok.com/@dave.architectures' },
  ],
  /**
   * The rest of the studio group, linked from the footer.
   * `live: false` renders the entry unlinked — flip it the day the site ships,
   * rather than pointing visitors at a 404.
   */
  sister: [
    {
      label: 'Dave Digitals',
      note: 'Websites & digital products',
      href: 'https://dave-digitals.web.app',
      live: true,
    },
    {
      label: 'Dave Studio',
      note: 'AI portrait & graduation shoots',
      href: 'https://dave-studio.web.app',
      live: false,
    },
    {
      label: 'Nouvellesoft',
      note: 'The parent software studio',
      href: 'https://nouvellesoft.com.ng',
      live: true,
    },
  ],
} as const;
