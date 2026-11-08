// mobile/src/shared/components/weather/WeatherCard.tsx
// Current weather card for the farmer dashboard.
// SRS refs: §11.7 mobile farmer experience.

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface WeatherData {
  /** e.g. 24 */
  temperatureC: number;
  /** e.g. "Sunny", "Cloudy", "Rainy", "Partly cloudy" */
  condition: string;
  /** Low temp */
  minTempC: number;
  /** High temp */
  maxTempC: number;
  /** e.g. "Addis Ababa" */
  location: string;
  /** Humidity % */
  humidity: number;
  /** km/h */
  windSpeedKph: number;
  /** e.g. "sunny", "cloudy", "rainy", "stormy", "windy", "partly-cloudy" */
  iconKey: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy' | 'partly-cloudy';
}

export interface WeatherCardProps {
  data: WeatherData | null;
  loading?: boolean;
  /** Action tapped (e.g. see forecast). */
  onPress?: () => void;
  style?: ViewStyle;
}

const WEATHER_ICONS: Record<WeatherData['iconKey'], string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧',
  stormy: '⛈',
  windy: '💨',
  'partly-cloudy': '⛅',
};

const GRADIENT_PRESETS: Record<WeatherData['iconKey'], [string, string]> = {
  sunny: ['#FDD835', '#F57C00'],
  cloudy: ['#90A4AE', '#546E7A'],
  rainy: ['#4FC3F7', '#1565C0'],
  stormy: ['#7E57C2', '#4527A0'],
  windy: ['#80DEEA', '#00838F'],
  'partly-cloudy': ['#4FC3F7', '#1976D2'],
};

export function WeatherCard({
  data,
  loading = false,
  onPress,
  style,
}: WeatherCardProps): React.ReactElement | null {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  if (loading) {
    return (
      <View style={[styles.card, styles.loadingCard, style]}>
        <Text style={styles.loadingText}>…</Text>
      </View>
    );
  }
  if (!data) return null;

  const gradient = GRADIENT_PRESETS[data.iconKey];

  return (
    <View style={style}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.row}>
          <View>
            <Text style={[styles.location, { fontFamily: regular }]}>📍 {data.location}</Text>
            <Text style={[styles.temp, { fontFamily: bold }]}>
              {Math.round(data.temperatureC)}°
            </Text>
            <Text style={[styles.condition, { fontFamily: bold }]}>{data.condition}</Text>
          </View>
          <Text style={styles.icon}>{WEATHER_ICONS[data.iconKey]}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { fontFamily: regular }]}>
              H {Math.round(data.maxTempC)}° · L {Math.round(data.minTempC)}°
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { fontFamily: regular }]}>
              💧 {data.humidity}%
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { fontFamily: regular }]}>
              💨 {data.windSpeedKph} km/h
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.md,
    minHeight: 130,
    overflow: 'hidden',
  },
  loadingCard: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.textMuted, fontSize: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  location: { color: 'rgba(255,255,255,0.9)', fontSize: typography.sm },
  temp: { color: '#fff', fontSize: 46, lineHeight: 52 },
  condition: { color: '#fff', fontSize: typography.md, textTransform: 'capitalize' },
  icon: { fontSize: 56, marginTop: spacing.xs },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  footerItem: {},
  footerLabel: { color: 'rgba(255,255,255,0.9)', fontSize: typography.xs + 1 },
});