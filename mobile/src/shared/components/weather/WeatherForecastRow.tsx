// mobile/src/shared/components/weather/WeatherForecastRow.tsx
// Horizontal 5-day forecast strip (used below WeatherCard).
// SRS refs: §11.7 mobile farmer experience.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewStyle,
} from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface ForecastDay {
  /** ISO date, e.g. "2025-11-08" */
  date: string;
  /** Human label, e.g. "Mon", "Tomorrow" */
  dayLabel: string;
  minTempC: number;
  maxTempC: number;
  iconKey: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy' | 'partly-cloudy';
}

export interface WeatherForecastRowProps {
  data: ForecastDay[];
  style?: ViewStyle;
}

const ICONS: Record<ForecastDay['iconKey'], string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧',
  stormy: '⛈',
  windy: '💨',
  'partly-cloudy': '⛅',
};

export function WeatherForecastRow({
  data,
  style,
}: WeatherForecastRowProps): React.ReactElement | null {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  if (!data.length) return null;

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(d) => d.date}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.list, style]}
      renderItem={({ item }) => (
        <View style={styles.day}>
          <Text style={[styles.dayLabel, { fontFamily: bold }]}>{item.dayLabel}</Text>
          <Text style={styles.icon}>{ICONS[item.iconKey]}</Text>
          <Text style={[styles.temps, { fontFamily: regular }]}>
            {Math.round(item.maxTempC)}° / {Math.round(item.minTempC)}°
          </Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ width: spacing.sm }} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: spacing.sm },
  day: {
    width: 72,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayLabel: { fontSize: typography.xs + 1, color: colors.text },
  icon: { fontSize: 24, marginVertical: 4 },
  temps: { fontSize: typography.xs, color: colors.textMuted },
});