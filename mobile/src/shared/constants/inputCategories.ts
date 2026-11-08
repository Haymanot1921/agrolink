// mobile/src/shared/constants/inputCategories.ts
// Input category defaults — mirrors backend `input_categories`.
// ⚠️ Fetched from backend at runtime. This list is for initial UI.

import { INPUT_TYPES, type InputType } from './inputTypes';

export interface InputCategory {
  slug: string;
  nameEn: string;
  nameAm: string;
  inputType: InputType;
}

export const INPUT_CATEGORIES: InputCategory[] = [
  { slug: 'seeds', nameEn: 'Seeds', nameAm: 'ዘር', inputType: INPUT_TYPES.SEED },
  { slug: 'fertilizers', nameEn: 'Fertilizers', nameAm: 'ማዳበሪያ', inputType: INPUT_TYPES.FERTILIZER },
  { slug: 'pesticides', nameEn: 'Pesticides', nameAm: 'ፀረ-ተባይ', inputType: INPUT_TYPES.PESTICIDE },
  { slug: 'tools', nameEn: 'Tools', nameAm: 'መሳሪያዎች', inputType: INPUT_TYPES.TOOL },
  { slug: 'equipment', nameEn: 'Equipment', nameAm: 'ውቅር', inputType: INPUT_TYPES.EQUIPMENT },
];

export const INPUT_UNITS = {
  KG: 'kg',
  LITER: 'liter',
  PIECE: 'piece',
  BAG: 'bag',
  SET: 'set',
} as const;

export type InputUnit = typeof INPUT_UNITS[keyof typeof INPUT_UNITS];

export const INPUT_UNIT_LIST: InputUnit[] = [
  INPUT_UNITS.KG,
  INPUT_UNITS.LITER,
  INPUT_UNITS.PIECE,
  INPUT_UNITS.BAG,
  INPUT_UNITS.SET,
];

export const INVENTORY_MOVEMENT_TYPES = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
} as const;

export type InventoryMovementType = typeof INVENTORY_MOVEMENT_TYPES[keyof typeof INVENTORY_MOVEMENT_TYPES];