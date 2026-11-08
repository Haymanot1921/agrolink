// mobile/src/shared/constants/inputTypes.ts
// Agricultural input types (SRS §5.5 FR-INPUT-002).

export const INPUT_TYPES = {
  SEED: 'seed',
  FERTILIZER: 'fertilizer',
  TOOL: 'tool',
  EQUIPMENT: 'equipment',
  PESTICIDE: 'pesticide',
  OTHER: 'other',
} as const;

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];

export const INPUT_TYPE_LIST: InputType[] = [
  INPUT_TYPES.SEED,
  INPUT_TYPES.FERTILIZER,
  INPUT_TYPES.PESTICIDE,
  INPUT_TYPES.TOOL,
  INPUT_TYPES.EQUIPMENT,
  INPUT_TYPES.OTHER,
];

export const INPUT_TYPE_ICON_KEY: Record<InputType, 'seeds' | 'fertilizer' | 'pesticide' | 'tools' | 'equipment' | 'placeholder'> = {
  seed: 'seeds',
  fertilizer: 'fertilizer',
  pesticide: 'pesticide',
  tool: 'tools',
  equipment: 'equipment',
  other: 'placeholder',
};