'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

// Contact is deliberately absent — "Start a film" is the route to it.
const links = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[900] transition-colors duration-300 ${
          lifted
            ? 'border-b border-[var(--line)] bg-[var(--paper)]/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Dave Architectures — home">
            <Image
              src="/images/logo-mark-light.png"
              alt=""
              width={80}
              height={80}
              priority
              className="h-9 w-9 object-contain mix-blend-multiply"
            />
            <span className="display text-[1.15rem] leading-none tracking-[0.04em]">
              Dave
              <br />
              Architectures
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor="Go"
                  className={`label relative py-1 transition-colors duration-300 ${
                    active ? 'text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--accent)]" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/contact"
              data-cursor="Let's go"
              className="label rounded-full bg-[var(--ink)] px-6 py-3 text-[var(--paper)] transition-colors duration-300 hover:bg-[var(--accent)]"
            >
              Start a film
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="label">{open ? 'Close' : 'Menu'}</span>
            <span className="flex w-6 flex-col gap-[5px]">
              <motion.span
                animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-full origin-center bg-[var(--ink)]"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[1.5px] w-full bg-[var(--ink)]"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-full origin-center bg-[var(--ink)]"
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[890] bg-[var(--paper)] pt-[68px] md:hidden"
          >
            <div className="shell flex h-full flex-col pb-10">
              <nav className="flex-1 pt-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className="display block border-b border-[var(--line)] py-5 text-[clamp(2.4rem,11vw,3.6rem)] leading-none"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <Link
                href="/contact"
                className="label block rounded-full bg-[var(--accent)] py-5 text-center text-white"
              >
                Start a film →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
