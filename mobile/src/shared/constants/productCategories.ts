// mobile/src/shared/constants/productCategories.ts
// Top-level product categories — mirrors backend `product_categories`.
// ⚠️ Full category tree is fetched from the backend. This list is used
// only for initial UI rendering before fetch completes.

export const PRODUCT_CATEGORY_SLUGS = {
  CEREALS: 'cereals',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  PULSES: 'pulses',
  OILSEEDS: 'oilseeds',
  LIVESTOCK: 'livestock',
} as const;

export type ProductCategorySlug = typeof PRODUCT_CATEGORY_SLUGS[keyof typeof PRODUCT_CATEGORY_SLUGS];

export interface ProductCategory {
  slug: ProductCategorySlug;
  nameEn: string;
  nameAm: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { slug: PRODUCT_CATEGORY_SLUGS.CEREALS, nameEn: 'Cereals', nameAm: 'እህል' },
  { slug: PRODUCT_CATEGORY_SLUGS.VEGETABLES, nameEn: 'Vegetables', nameAm: 'አትክልት' },
  { slug: PRODUCT_CATEGORY_SLUGS.FRUITS, nameEn: 'Fruits', nameAm: 'ፍራፍሬ' },
  { slug: PRODUCT_CATEGORY_SLUGS.PULSES, nameEn: 'Pulses', nameAm: 'ጥራጥሬ' },
  { slug: PRODUCT_CATEGORY_SLUGS.OILSEEDS, nameEn: 'Oilseeds', nameAm: 'ቅባት እህል' },
  { slug: PRODUCT_CATEGORY_SLUGS.LIVESTOCK, nameEn: 'Livestock', nameAm: 'እንስሳት' },
];

/** Units available for product listings. Aligns with backend `unit_type` enum. */
export const PRODUCT_UNITS = {
  KG: 'kg',
  QUINTAL: 'quintal',
  TON: 'ton',
  LITER: 'liter',
  PIECE: 'piece',
  BUNCH: 'bunch',
  BAG: 'bag',
  SET: 'set',
} as const;

export type ProductUnit = typeof PRODUCT_UNITS[keyof typeof PRODUCT_UNITS];

export const PRODUCT_UNIT_LIST: ProductUnit[] = [
  PRODUCT_UNITS.KG,
  PRODUCT_UNITS.QUINTAL,
  PRODUCT_UNITS.TON,
  PRODUCT_UNITS.LITER,
  PRODUCT_UNITS.PIECE,
  PRODUCT_UNITS.BUNCH,
  PRODUCT_UNITS.BAG,
  PRODUCT_UNITS.SET,
];