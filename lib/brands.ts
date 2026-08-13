import type { Brand } from './types';

/**
 * Every film in the reel starts as a set of still listing photos pulled from one
 * of these portals. The portal is the provenance of the stills, not a client —
 * the work is shown as "listing from X, filmed by us".
 */
export const brands: Brand[] = [
  {
    id: 'zillow',
    name: 'Zillow',
    domain: 'zillow.com',
    region: 'North America',
    country: 'United States',
    blurb: 'New builds and master-planned communities across the US sunbelt.',
  },
  {
    id: 'rightmove',
    name: 'Rightmove',
    domain: 'rightmove.co.uk',
    region: 'United Kingdom',
    country: 'United Kingdom',
    blurb: 'Period homes, new developments and city apartments across Britain.',
  },
  {
    id: 'savills',
    name: 'Savills',
    domain: 'savills.co.uk',
    region: 'United Kingdom',
    country: 'United Kingdom',
    blurb: 'Country estates and prime central London stock.',
  },
  {
    id: 'sothebys',
    name: "Sotheby's International Realty",
    domain: 'sothebysrealty.com',
    region: 'Global',
    country: 'Global',
    blurb: 'Trophy homes and architectural landmarks worldwide.',
  },
  {
    id: 'christies',
    name: "Christie's International Real Estate",
    domain: 'christiesrealestate.com',
    region: 'Global',
    country: 'Global',
    blurb: 'Auction-house pedigree applied to residential property.',
  },
  {
    id: 'mansion-global',
    name: 'Mansion Global',
    domain: 'mansionglobal.com',
    region: 'Global',
    country: 'Global',
    blurb: 'The upper end of the market, wherever it happens to be.',
  },
  {
    id: 'coldwell-banker',
    name: 'Coldwell Banker Luxury',
    domain: 'coldwellbankerluxury.com',
    region: 'North America',
    country: 'United States',
    blurb: 'Coastal and resort property across North America.',
  },
  {
    id: 'domain',
    name: 'Domain',
    domain: 'domain.com.au',
    region: 'Australia',
    country: 'Australia',
    blurb: 'Sydney and Melbourne family homes with strong indoor–outdoor flow.',
  },
  {
    id: 'realestate-au',
    name: 'realestate.com.au',
    domain: 'realestate.com.au',
    region: 'Australia',
    country: 'Australia',
    blurb: "Australia's broadest residential listing pool.",
  },
  {
    id: 'property-finder',
    name: 'Property Finder',
    domain: 'propertyfinder.ae',
    region: 'Middle East',
    country: 'United Arab Emirates',
    blurb: 'Dubai and Abu Dhabi towers, villas and waterfront developments.',
  },
  {
    id: 'bayut',
    name: 'Bayut',
    domain: 'bayut.com',
    region: 'Middle East',
    country: 'United Arab Emirates',
    blurb: 'Emirates-wide stock from studio apartments to signature villas.',
  },
  {
    id: 'pam-golding',
    name: 'Pam Golding',
    domain: 'pamgolding.co.za',
    region: 'Africa',
    country: 'South Africa',
    blurb: 'Cape winelands, Atlantic seaboard and Johannesburg estates.',
  },
  {
    id: 'npc',
    name: 'Nigeria Property Centre',
    domain: 'nigeriapropertycentre.com',
    region: 'Africa',
    country: 'Nigeria',
    blurb: 'Lagos and Abuja duplexes, terraces and gated developments.',
  },
];

export const brandById = new Map(brands.map((b) => [b.id, b]));

export function getBrand(id: string): Brand {
  const brand = brandById.get(id);
  if (!brand) throw new Error(`Unknown brand: ${id}`);
  return brand;
}
