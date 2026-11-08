// mobile/src/shared/components/weather/WeatherAlertBanner.tsx
// Inline warning for extreme weather (heavy rain, drought, frost).
// SRS refs: §11.7, NFR-USE-006 (understandable messages).

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export type WeatherAlertSeverity = 'info' | 'warning' | 'severe';

export interface WeatherAlertBannerProps {
  severity: WeatherAlertSeverity;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  style?: ViewStyle;
}

const PRESETS: Record<
  WeatherAlertSeverity,
  { bg: string; border: string; text: string; icon: string }
> = {
  info: { bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF', icon: 'ℹ️' },
  warning: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', icon: '⚠️' },
  severe: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', icon: '🚨' },
};

export function WeatherAlertBanner({
  severity,
  title,
  message,
  actionLabel,
  onAction,
  onDismiss,
  style,
}: WeatherAlertBannerProps): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');
  const preset = PRESETS[severity];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: preset.bg, borderColor: preset.border },
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.icon}>{preset.icon}</Text>
      <View style={styles.body}>
        <Text style={[styles.title, { color: preset.text, fontFamily: bold }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: preset.text, fontFamily: regular }]}>
          {message}
        </Text>
        {actionLabel && onAction ? (
          <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
            <Text style={[styles.actionText, { color: preset.text, fontFamily: bold }]}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeBtn}
          accessibilityRole="button"
        >
          <Text style={[styles.closeText, { color: preset.text }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.sm,
  },
  icon: { fontSize: 16 },
  body: { flex: 1 },
  title: { fontSize: typography.md, fontWeight: '700', marginBottom: 2 },
  message: { fontSize: typography.sm + 1, lineHeight: 20 },
  actionBtn: { marginTop: spacing.sm, alignSelf: 'flex-start' },
  actionText: { fontSize: typography.sm, fontWeight: '700', textDecorationLine: 'underline' },
  closeBtn: { padding: 2 },
  closeText: { fontSize: 14 },
});