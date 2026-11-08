// mobile/src/shared/components/ui/PriceTag.tsx
// Formatted ETB price (EN: "ETB 1,250.00", AM: "ብር 1,250.00").
// SRS refs: every price display, §5.4, §5.5, §5.7.

import React from 'react';
import { Text, StyleSheet, View, TextStyle } from 'react-native';
import { colors } from '@styles/colors';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { formatCurrency } from '@i18n/utils/formatters';

export type PriceSize = 'sm' | 'md' | 'lg' | 'xl';

export interface PriceTagProps {
  amount: number;
  /** Optional currency override — default ETB. */
  currency?: string;
  /** Size preset. */
  size?: PriceSize;
  /** Show strikethrough variant (for discounts). */
  struck?: boolean;
  /** Optional label above (e.g., "Starting from"). */
  label?: string;
  style?: TextStyle;
}

const SIZES: Record<PriceSize, number> = {
  sm: typography.sm,
  md: typography.md,
  lg: typography.xl,
  xl: typography['2xl'],
};

export function PriceTag({
  amount,
  size = 'md',
  struck = false,
  label,
  style,
}: PriceTagProps): React.ReactElement {
  const { language } = useLanguage();
  const fontFamily = pickFontFamily(language, 'bold');
  const formatted = formatCurrency(amount, language);

  return (
    <View>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'regular') }]}>
          {label}
        </Text>
      ) : null}
      <Text
        style={[
          styles.price,
          {
            fontSize: SIZES[size],
            fontFamily,
            color: struck ? colors.textMuted : colors.text,
            textDecorationLine: struck ? 'line-through' : 'none',
          },
          style,
        ]}
      >
        {formatted}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: typography.xs, color: colors.textMuted, marginBottom: 2 },
  price: { fontWeight: '700' },
});