// mobile/src/shared/components/charts/ChartWrapper.tsx
// Card wrapper around any chart: title, subtitle, right action, legend.

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface LegendItem {
  label: string;
  color: string;
}

export interface ChartWrapperProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  legend?: LegendItem[];
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ChartWrapper({
  title,
  subtitle,
  actionLabel,
  onAction,
  legend,
  children,
  style,
}: ChartWrapperProps): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  return (
    <View style={[styles.card, style]}>
      {(title || actionLabel) && (
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            {title ? (
              <Text style={[styles.title, { fontFamily: bold }]}>{title}</Text>
            ) : null}
            {subtitle ? (
              <Text style={[styles.subtitle, { fontFamily: regular }]}>{subtitle}</Text>
            ) : null}
          </View>
          {actionLabel && onAction ? (
            <TouchableOpacity onPress={onAction} accessibilityRole="button">
              <Text style={[styles.action, { fontFamily: bold }]}>{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      <View style={styles.chartArea}>{children}</View>

      {legend && legend.length > 0 ? (
        <View style={styles.legend}>
          {legend.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendLabel, { fontFamily: regular }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: { fontSize: typography.md + 1, color: colors.text },
  subtitle: { fontSize: typography.sm, color: colors.textMuted, marginTop: 2 },
  action: { fontSize: typography.sm, color: colors.primary },
  chartArea: { alignItems: 'center' },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendLabel: { fontSize: typography.xs + 1, color: colors.textMuted },
});