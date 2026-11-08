// mobile/src/shared/constants/providerTypes.ts
// Service Provider has 2 types (SRS §4.1.3, BR-026).

import type { AuthUser } from '@hooks/useAuth';

export const PROVIDER_TYPES = {
  INPUT_SUPPLIER: 'input_supplier',
  AGRICULTURAL_EXPERT: 'agricultural_expert',
} as const;

export type ProviderType = typeof PROVIDER_TYPES[keyof typeof PROVIDER_TYPES];

export const PROVIDER_TYPE_LIST: ProviderType[] = [
  PROVIDER_TYPES.INPUT_SUPPLIER,
  PROVIDER_TYPES.AGRICULTURAL_EXPERT,
];

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  input_supplier: 'Input Supplier',
  agricultural_expert: 'Agricultural Expert',
};

export const PROVIDER_TYPE_DESCRIPTIONS: Record<ProviderType, string> = {
  input_supplier: 'Sell seeds, fertilizers, tools, and equipment',
  agricultural_expert: 'Provide professional consultations to farmers',
};

/** Icon keys — align with `@assets/assets.ts` `ActorIcons`. */
export const PROVIDER_TYPE_ICONS: Record<ProviderType, 'input-supplier' | 'agricultural-expert'> = {
  input_supplier: 'input-supplier',
  agricultural_expert: 'agricultural-expert',
};

export function isInputSupplier(user: AuthUser | null): boolean {
  return user?.role === 'service_provider' && user?.providerType === PROVIDER_TYPES.INPUT_SUPPLIER;
}

export function isAgriculturalExpert(user: AuthUser | null): boolean {
  return user?.role === 'service_provider' && user?.providerType === PROVIDER_TYPES.AGRICULTURAL_EXPERT;
}