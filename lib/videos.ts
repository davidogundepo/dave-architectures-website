import { brands, getBrand } from './brands';
import { clips } from './videos.generated';
import type { Brand, Clip, Orientation, Region } from './types';

export { clips };
export type { Clip, Orientation, Region };

export const landscapeClips = clips.filter((c) => c.orientation === 'landscape');
export const portraitClips = clips.filter((c) => c.orientation === 'portrait');

/** Only brands that actually have footage uploaded — the roster grows as uploads land. */
export const activeBrands: Brand[] = brands.filter((b) =>
  clips.some((c) => c.brandId === b.id),
);

export const regions: Region[] = Array.from(
  new Set(activeBrands.map((b) => b.region)),
);

export function clipsForBrand(brandId: string) {
  return clips.filter((c) => c.brandId === brandId);
}

export function displayTitle(clip: Clip) {
  return clip.title ?? getBrand(clip.brandId).name;
}

export function displayLocation(clip: Clip) {
  return clip.location ?? getBrand(clip.brandId).country;
}

/**
 * Spread a selection across as many different portals as possible, so a grid
 * never shows five cuts of the same house.
 */
export function pickDiverse(pool: Clip[], count: number, offset = 0): Clip[] {
  const byBrand = new Map<string, Clip[]>();
  for (const clip of pool) {
    const list = byBrand.get(clip.brandId) ?? [];
    list.push(clip);
    byBrand.set(clip.brandId, list);
  }

  const lanes = [...byBrand.values()];
  const picked: Clip[] = [];
  let round = 0;

  while (picked.length < count && lanes.some((l) => round < l.length)) {
    for (let i = 0; i < lanes.length && picked.length < count; i++) {
      const lane = lanes[(i + offset) % lanes.length];
      if (round < lane.length) picked.push(lane[round]);
    }
    round++;
  }

  return picked;
}

export const stats = {
  films: clips.length,
  portals: activeBrands.length,
  regions: regions.length,
};
