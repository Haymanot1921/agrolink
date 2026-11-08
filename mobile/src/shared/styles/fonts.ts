// mobile/src/shared/styles/fonts.ts
// Central font family names — use these everywhere instead of raw strings.

export const fontFamily = {
  regular: 'NotoSans-Regular',
  bold: 'NotoSans-Bold',
  ethiopicRegular: 'NotoSansEthiopic-Regular',
  ethiopicBold: 'NotoSansEthiopic-Bold',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;

export const lineHeights = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 42,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Helper — pick the right font family based on language
export const pickFontFamily = (
  language: 'en' | 'am',
  weight: 'regular' | 'bold' = 'regular',
): string => {
  if (language === 'am') {
    return weight === 'bold' ? fontFamily.ethiopicBold : fontFamily.ethiopicRegular;
  }
  return weight === 'bold' ? fontFamily.bold : fontFamily.regular;
};