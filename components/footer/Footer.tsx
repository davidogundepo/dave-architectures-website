import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/lib/site';

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

export default function Footer() {
  return (
    <footer className="bg-[var(--night)] pt-[clamp(4rem,9vh,7rem)] pb-10 text-[var(--on-night)]">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-mark-dark.png"
                alt=""
                width={80}
                height={80}
                className="h-10 w-10 rounded-md object-contain"
              />
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
              href={`mailto:${SITE.email}`}
              data-cursor="Write"
              className="display mt-8 inline-block break-all text-[clamp(1.15rem,2.2vw,1.9rem)] leading-none underline decoration-[var(--accent)] decoration-2 underline-offset-8 transition-colors duration-300 hover:text-[var(--accent)]"
            >
              {SITE.email}
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
            {SITE.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="label text-[var(--on-night-2)] transition-colors duration-300 hover:text-[var(--accent)]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
