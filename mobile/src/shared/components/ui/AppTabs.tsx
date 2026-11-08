// mobile/src/shared/components/ui/AppTabs.tsx
// Horizontal tab bar. Used for segmented content (Overview / Details / History).

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface Tab<T extends string> {
  key: T;
  label: string;
  badge?: string | number;
}

export interface AppTabsProps<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (key: T) => void;
  variant?: 'underline' | 'pill';
  scrollable?: boolean;
  style?: ViewStyle;
}

export function AppTabs<T extends string>({
  tabs,
  value,
  onChange,
  variant = 'underline',
  scrollable = false,
  style,
}: AppTabsProps<T>): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');

  const Content = (
    <View style={[styles.row, variant === 'pill' && styles.pillRow]}>
      {tabs.map((tab) => {
        const isActive = tab.key === value;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              variant === 'underline' ? styles.tabUnderline : styles.tabPill,
              variant === 'pill' && isActive && styles.tabPillActive,
            ]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.label,
                { fontFamily: bold },
                isActive && styles.labelActive,
                variant === 'pill' && isActive && styles.labelPillActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.badge !== undefined ? (
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {tab.badge}
                </Text>
              </View>
            ) : null}
            {variant === 'underline' && isActive ? (
              <View style={styles.activeUnderline} />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scroll, style]}
      >
        {Content}
      </ScrollView>
    );
  }

  return <View style={style}>{Content}</View>;
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: { flexDirection: 'row', alignItems: 'center' },
  pillRow: {
    backgroundColor: colors.card,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  tabUnderline: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    position: 'relative',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  tabPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabPillActive: { backgroundColor: colors.primary },
  label: { fontSize: typography.md, color: colors.textMuted },
  labelActive: { color: colors.text },
  labelPillActive: { color: '#fff' },
  badge: {
    marginLeft: spacing.xs,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: '#fff' },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  badgeTextActive: { color: colors.primary },
});