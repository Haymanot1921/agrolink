// mobile/src/shared/components/ui/AppAccordion.tsx
// Expandable section — used for FAQs, filter groups, grouped info.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface AccordionItem {
  key: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  badge?: string | number;
}

export interface AppAccordionProps {
  items: AccordionItem[];
  /** Allow only one item open at a time (default: false). */
  singleOpen?: boolean;
  defaultOpenKeys?: string[];
  style?: ViewStyle;
}

export function AppAccordion({
  items,
  singleOpen = false,
  defaultOpenKeys = [],
  style,
}: AppAccordionProps): React.ReactElement {
  const { language } = useLanguage();
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpenKeys));

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(key) && singleOpen) next.delete(key);
      else if (prev.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <View style={style}>
      {items.map((item) => {
        const isOpen = openKeys.has(item.key);
        return (
          <View key={item.key} style={styles.item}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => toggle(item.key)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              <View style={styles.headerText}>
                <Text style={[styles.title, { fontFamily: pickFontFamily(language, 'bold') }]}>
                  {item.title}
                </Text>
                {item.subtitle ? (
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                ) : null}
              </View>
              {item.badge !== undefined ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
              <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>
                {isOpen ? '▴' : '▾'}
              </Text>
            </TouchableOpacity>
            {isOpen ? <View style={styles.content}>{item.content}</View> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  headerText: { flex: 1 },
  title: { fontSize: typography.md, color: colors.text },
  subtitle: { fontSize: typography.sm, color: colors.textMuted, marginTop: 2 },
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: spacing.xs,
  },
  badgeText: { fontSize: 11, color: colors.primary, fontWeight: '700' },
  chevron: { fontSize: 14, color: colors.textMuted },
  chevronOpen: { color: colors.primary },
  content: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});