import Link from 'next/link';
import Image from 'next/image';
import { SITE, mailHref, waHref } from '@/lib/site';

const columns = [
  {
    heading: 'Studio',
    links: [
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'What we make',
    links: [
      { label: '16:9 listing film', href: '/services#listing-film' },
      { label: '9:16 social cuts', href: '/services#social-cuts' },
      { label: 'Virtual staging', href: '/services#included' },
      { label: 'Who we film for', href: '/services#who' },
    ],
  },
];

/** Inline so the site keeps its zero-icon-dependency footprint. */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2A9.94 9.94 0 0 0 2.1 11.94c0 1.75.46 3.46 1.34 4.97L2 22.5l5.72-1.5a9.9 9.9 0 0 0 4.32.99h.01a9.94 9.94 0 0 0 9.94-9.94A9.94 9.94 0 0 0 12.04 2zm0 18.1h-.01a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.4 8.26 8.26 0 1 1 8.26 8.26z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--night)] pt-[clamp(4rem,9vh,7rem)] pb-10 text-[var(--on-night)]">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              {/* White plate so the mark keeps an edge against the dark footer. */}
              <span className="inline-flex items-center justify-center rounded-md bg-white p-1 shadow-lg">
                <Image
                  src="/images/logo-mark-light.png"
                  alt=""
                  width={80}
                  height={80}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <span className="display text-[1.3rem] leading-none">
                Dave
                <br />
                Architectures
              </span>
            </div>

            <p className="body-text mt-6 max-w-[34ch] !text-[var(--on-night-2)]">
              Property films made from the photographs you already have. No crew,
              no scheduling, no second visit.
            </p>

            <a
              href={mailHref()}
              data-cursor="Write"
              className="display mt-8 inline-block break-all text-[clamp(1.15rem,2.2vw,1.9rem)] leading-none underline decoration-[var(--accent)] decoration-2 underline-offset-8 transition-colors duration-300 hover:text-[var(--accent)]"
            >
              {SITE.email}
            </a>

            <a
              href={waHref()}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="Message"
              className="mt-5 flex items-center gap-2.5 text-[var(--on-night-2)] transition-colors duration-300 hover:text-[var(--accent)]"
            >
              <WhatsAppIcon />
              <span className="label">{SITE.whatsapp.display}</span>
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="label text-[var(--on-night-2)]">{column.heading}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[var(--on-night)] transition-colors duration-300 hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* The rest of the group — separate businesses, separate sites. */}
          <div>
            <p className="label text-[var(--on-night-2)]">Also from us</p>
            <ul className="mt-5 space-y-4">
              {SITE.sister.map((site) =>
                site.live ? (
                  <li key={site.href}>
                    <a
                      href={site.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group/sister block"
                    >
                      <span className="flex items-center gap-1.5 text-[var(--on-night)] transition-colors duration-300 group-hover/sister:text-[var(--accent)]">
                        {site.label}
                        <span
                          aria-hidden
                          className="text-[0.8em] transition-transform duration-300 group-hover/sister:translate-x-0.5 group-hover/sister:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-[var(--on-night-2)]">
                        {site.note}
                      </span>
                    </a>
                  </li>
                ) : (
                  <li key={site.href}>
                    <span className="flex items-center gap-2 text-[var(--on-night-2)]">
                      {site.label}
                      <span className="label rounded-full border border-[var(--line-night)] px-2 py-0.5 text-[0.55rem]">
                        Soon
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-[var(--on-night-2)]/70">
                      {site.note}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-[var(--line-night)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-[var(--on-night-2)]">
            © {new Date().getFullYear()} Dave Architectures
          </p>

          <div className="flex gap-7">
            {SITE.social.map((s) =>
              s.href ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="label text-[var(--on-night-2)] transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  {s.label}
                </a>
              ) : (
                <span
                  key={s.label}
                  aria-disabled="true"
                  className="label text-[var(--on-night-2)]/40"
                >
                  {s.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
