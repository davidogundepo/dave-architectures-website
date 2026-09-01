export const SITE = {
  name: 'Dave Architectures',
  tagline: 'Property films made from the photographs you already have.',
  url: 'https://dave-architectures.web.app',
  email: 'david@nouvellesoft.com.ng',
  whatsapp: { href: 'https://wa.me/2347079693500', display: '+234 707 969 3500' },
  /** `href: null` renders unlinked — plain text, no anchor — until there's a
   *  real page to point at. Swap it in the moment the account exists. */
  social: [
    { label: 'Instagram', href: 'https://instagram.com/dave.architectures' },
    { label: 'TikTok', href: 'https://tiktok.com/@dave.architectures' },
    { label: 'Facebook', href: null },
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

/**
 * A wa.me link with no `?text=` opens to a blank compose box — no way to tell
 * it apart from a cold message to David's personal number. Every WhatsApp
 * link on the site should go through this rather than build its own href.
 */
export function waHref(message = "Hi David, I'm reaching out from the Dave Architectures website.") {
  return `${SITE.whatsapp.href}?text=${encodeURIComponent(message)}`;
}

/**
 * Same idea for email: a bare mailto gives no clue in the inbox which site it
 * came from. Only for the plain "write to me" links — the actual enquiry form
 * (ContactForm.tsx) already builds a subject and body from what was typed in
 * it, which identifies the source far better than this generic one would.
 */
export function mailHref(subject = 'Enquiry from the Dave Architectures website') {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}
