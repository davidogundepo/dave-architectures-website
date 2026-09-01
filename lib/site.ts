export const SITE = {
  name: 'Dave Architectures',
  tagline: 'Property films made from the photographs you already have.',
  url: 'https://dave-architectures.web.app',
  email: 'david@nouvellesoft.com.ng',
  whatsapp: { href: 'https://wa.me/2347079693500', display: '+234 707 969 3500' },
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
      label: 'Dave Websites',
      note: 'Websites, web apps & dashboards',
      href: 'https://dave-websites.web.app',
      live: true,
    },
    {
      label: 'Dave Studio',
      note: 'AI portrait & graduation shoots',
      href: 'https://dave-studio.web.app',
      live: true,
    },
    {
      label: 'Nouvellesoft',
      note: 'The digital yearbook app',
      href: 'https://nouvellesoft.com.ng',
      live: true,
    },
  ],
} as const;
