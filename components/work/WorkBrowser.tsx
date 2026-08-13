'use client';

import { useMemo, useState } from 'react';
import FilmFrame from '@/components/media/FilmFrame';
import FilmPlayer from '@/components/work/FilmPlayer';
import { getBrand } from '@/lib/brands';
import { activeBrands, clips, displayLocation, displayTitle, regions } from '@/lib/videos';
import type { Clip, Orientation, Region } from '@/lib/types';

type FormatFilter = 'all' | Orientation;
type RegionFilter = 'all' | Region;

export default function WorkBrowser() {
  const [format, setFormat] = useState<FormatFilter>('all');
  const [region, setRegion] = useState<RegionFilter>('all');
  const [brandId, setBrandId] = useState<string>('all');
  const [open, setOpen] = useState<Clip | null>(null);

  const shown = useMemo(
    () =>
      clips.filter((clip) => {
        if (format !== 'all' && clip.orientation !== format) return false;
        if (brandId !== 'all' && clip.brandId !== brandId) return false;
        if (region !== 'all' && getBrand(clip.brandId).region !== region) return false;
        return true;
      }),
    [format, region, brandId],
  );

  const brandsInRegion =
    region === 'all'
      ? activeBrands
      : activeBrands.filter((b) => b.region === region);

  return (
    <section className="pb-[clamp(4rem,9vh,7rem)]">
      <div className="shell">
        {/* Filters */}
        <div className="sticky top-[68px] z-[500] -mx-[var(--gutter)] mb-10 border-y border-[var(--line)] bg-[var(--paper)] px-[var(--gutter)] py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <FilterGroup
                legend="Format"
                value={format}
                onChange={(v) => setFormat(v as FormatFilter)}
                options={[
                  { value: 'all', label: 'Both' },
                  { value: 'landscape', label: '16:9' },
                  { value: 'portrait', label: '9:16' },
                ]}
              />

              <FilterGroup
                legend="Region"
                value={region}
                onChange={(v) => {
                  setRegion(v as RegionFilter);
                  setBrandId('all');
                }}
                options={[
                  { value: 'all', label: 'Everywhere' },
                  ...regions.map((r) => ({ value: r, label: r })),
                ]}
              />
            </div>

            <label className="flex items-center gap-3">
              <span className="label text-[var(--ink-3)]">Portal</span>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="label rounded-full border border-[var(--line-strong)] bg-transparent px-4 py-2 transition-colors hover:border-[var(--ink)]"
              >
                <option value="all">All portals</option>
                {brandsInRegion.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="label mb-6 text-[var(--ink-3)]">
          {shown.length} {shown.length === 1 ? 'film' : 'films'}
        </p>

        {shown.length === 0 ? (
          <p className="body-text py-16 text-center">
            Nothing matches that combination yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {shown.map((clip, i) => {
              const brand = getBrand(clip.brandId);
              return (
                <button
                  key={clip.id}
                  id={clip.id}
                  onClick={() => setOpen(clip)}
                  data-cursor="Play"
                  className="group/tile scroll-mt-40 text-left"
                >
                  <FilmFrame
                    clip={clip}
                    trigger="hover"
                    scrim
                    ratio="4 / 5"
                    priority={i < 4}
                  >
                    <span className="label absolute left-3 top-3 z-10 rounded-full bg-black/45 px-3 py-1.5 text-white backdrop-blur-sm">
                      {clip.orientation === 'portrait' ? '9:16' : '16:9'}
                    </span>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4">
                      <p className="display text-[clamp(0.95rem,1.3vw,1.3rem)] leading-tight text-white">
                        {displayTitle(clip)}
                      </p>
                      <p className="mt-1 text-xs text-white/75">
                        {displayLocation(clip)}
                      </p>
                      <p className="label mt-2 text-white/55">{brand.domain}</p>
                    </div>
                  </FilmFrame>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <FilmPlayer clip={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function FilterGroup({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="label mt-3 text-[var(--ink-3)]">{legend}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`label rounded-full px-4 py-2 transition-colors duration-200 ${
                active
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'border border-[var(--line)] hover:border-[var(--ink)]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
