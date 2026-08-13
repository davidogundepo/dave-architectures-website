'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

const formats = ['Both cuts', '16:9 only', '9:16 only'];

/**
 * No backend yet, so the form composes a well-structured mailto rather than
 * pretending to submit somewhere. Swap `handleSubmit` for a real endpoint when
 * one exists — the field names are already the ones a CRM would want.
 */
export default function ContactForm() {
  const [format, setFormat] = useState(formats[0]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const body = [
      `Name: ${data.get('name')}`,
      `Company: ${data.get('company') || '—'}`,
      `Listing: ${data.get('listing')}`,
      `Cuts wanted: ${format}`,
      '',
      `${data.get('message') || ''}`,
    ].join('\n');

    window.location.href =
      `mailto:${SITE.email}` +
      `?subject=${encodeURIComponent(`Film enquiry — ${data.get('listing')}`)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-lg)] bg-[var(--paper-2)] p-[clamp(1.5rem,3.5vw,2.75rem)]"
    >
      <div className="space-y-6">
        <Field name="name" label="Your name" required autoComplete="name" />
        <Field name="company" label="Agency or brokerage" autoComplete="organization" />
        <Field
          name="listing"
          label="Listing link or address"
          required
          placeholder="rightmove.co.uk/properties/… or the address"
        />

        <fieldset>
          <legend className="label text-[var(--ink-3)]">Cuts you need</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {formats.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormat(option)}
                aria-pressed={option === format}
                className={`label rounded-full px-5 py-2.5 transition-colors duration-200 ${
                  option === format
                    ? 'bg-[var(--ink)] text-[var(--paper)]'
                    : 'border border-[var(--line-strong)] hover:border-[var(--ink)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="label text-[var(--ink-3)]">
            Anything we should know
          </span>
          <textarea
            name="message"
            rows={4}
            placeholder="Empty rooms that need staging, a deadline, the shot you really want…"
            className="mt-3 w-full resize-y border-b border-[var(--line-strong)] bg-transparent pb-3 text-[1.05rem] outline-none transition-colors placeholder:text-[var(--ink-3)] focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <button
        type="submit"
        data-cursor="Send"
        className="label mt-9 w-full rounded-full bg-[var(--accent)] py-5 text-white transition-colors duration-300 hover:bg-[var(--accent-deep)]"
      >
        Send the enquiry →
      </button>

      <p className="body-text mt-4 text-center !text-[0.85rem]">
        This opens your mail app with the details filled in.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  ...rest
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label text-[var(--ink-3)]">{label}</span>
      <input
        name={name}
        type="text"
        className="mt-3 w-full border-b border-[var(--line-strong)] bg-transparent pb-3 text-[1.05rem] outline-none transition-colors placeholder:text-[var(--ink-3)] focus:border-[var(--accent)]"
        {...rest}
      />
    </label>
  );
}
