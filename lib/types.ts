export type Orientation = 'landscape' | 'portrait';

/** A single finished film. One row per file in Firebase Storage. */
export interface Clip {
  id: string;
  brandId: string;
  /** 1–2 are the 16:9 cuts, 3–5 the 9:16 cuts, straight from the export naming. */
  index: number;
  orientation: Orientation;
  /** Full web-weight cut on Firebase Storage (~10–15 MB). Loaded on demand. */
  src: string;
  /** ~0.3 MB silent 10s loop served from /public. This is what grids autoplay. */
  preview?: string;
  /** 720p silent loop for the few places a frame is shown large (the hero). */
  previewHd?: string;
  poster?: string;
  width?: number;
  height?: number;
  duration?: number;
  /** Property name burned into the opening title card. */
  title?: string;
  location?: string;
  note?: string;
}

export interface Brand {
  id: string;
  /** How the portal is written on the site. */
  name: string;
  domain: string;
  region: Region;
  country: string;
  /** One line on the kind of stock this portal carries. */
  blurb: string;
}

export type Region = 'North America' | 'United Kingdom' | 'Australia' | 'Middle East' | 'Africa' | 'Global';
