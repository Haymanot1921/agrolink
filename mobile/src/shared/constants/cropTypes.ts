// mobile/src/shared/constants/cropTypes.ts
// Ethiopian crop reference catalog — used in farmer profiles and expert advice.

export interface CropType {
  slug: string;
  nameEn: string;
  nameAm: string;
  /** Scientific name (optional). */
  scientificName?: string;
}

export const CROP_TYPES: CropType[] = [
  { slug: 'teff', nameEn: 'Teff', nameAm: 'ጤፍ', scientificName: 'Eragrostis tef' },
  { slug: 'wheat', nameEn: 'Wheat', nameAm: 'ስንዴ', scientificName: 'Triticum aestivum' },
  { slug: 'maize', nameEn: 'Maize', nameAm: 'በቆሎ', scientificName: 'Zea mays' },
  { slug: 'sorghum', nameEn: 'Sorghum', nameAm: 'ማሽላ', scientificName: 'Sorghum bicolor' },
  { slug: 'barley', nameEn: 'Barley', nameAm: 'ገብስ', scientificName: 'Hordeum vulgare' },
  { slug: 'coffee', nameEn: 'Coffee', nameAm: 'ቡና', scientificName: 'Coffea arabica' },
  { slug: 'sesame', nameEn: 'Sesame', nameAm: 'ሰሊጥ', scientificName: 'Sesamum indicum' },
  { slug: 'chickpea', nameEn: 'Chickpea', nameAm: 'ሽምብራ', scientificName: 'Cicer arietinum' },
  { slug: 'lentil', nameEn: 'Lentil', nameAm: 'ምስር', scientificName: 'Lens culinaris' },
  { slug: 'beans', nameEn: 'Common beans', nameAm: 'ቦሎቄ', scientificName: 'Phaseolus vulgaris' },
];

export type CropSlug = typeof CROP_TYPES[number]['slug'];

export function getCropBySlug(slug: string): CropType | undefined {
  return CROP_TYPES.find((c) => c.slug === slug);
}

/** Common livestock types (used in expert case management). */
export const LIVESTOCK_TYPES = [
  { slug: 'cattle', nameEn: 'Cattle', nameAm: 'ከብት' },
  { slug: 'sheep', nameEn: 'Sheep', nameAm: 'በግ' },
  { slug: 'goat', nameEn: 'Goat', nameAm: 'ፍየል' },
  { slug: 'poultry', nameEn: 'Poultry', nameAm: 'ዶሮ' },
  { slug: 'camel', nameEn: 'Camel', nameAm: 'ግመል' },
] as const;