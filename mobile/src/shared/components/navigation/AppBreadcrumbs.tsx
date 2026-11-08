// mobile/src/shared/components/navigation/AppBreadcrumbs.tsx
// Horizontal breadcrumb trail. Scrolls if too wide for the screen.
// SRS refs: §11.7 (mobile deep navigation).

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

export interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Max visible; extra items collapse into a "…" (default 3). */
  maxVisible?: number;
}

export function AppBreadcrumbs({
  items,
  maxVisible = 3,
}: AppBreadcrumbsProps): React.ReactElement | null {
  const { language } = useLanguage();
  const regular = pickFontFamily(language, 'regular');
  const bold = pickFontFamily(language, 'bold');

  if (!items.length) return null;

  const collapsed =
    items.length > maxVisible
      ? [items[0], { label: '…' }, ...items.slice(-(maxVisible - 2))]
      : items;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {collapsed.map((item, idx) => {
        const isLast = idx === collapsed.length - 1;
        return (
          <View key={idx} style={styles.item}>
            {item.onPress && !isLast ? (
              <TouchableOpacity onPress={item.onPress} accessibilityRole="link">
                <Text style={[styles.link, { fontFamily: regular }]}>{item.label}</Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={[
                  styles.label,
                  {
                    fontFamily: isLast ? bold : regular,
                    color: isLast ? colors.text : colors.textMuted,
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            )}
            {!isLast ? <Text style={styles.sep}>›</Text> : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, marginBottom: spacing.sm },
  row: { alignItems: 'center', paddingHorizontal: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center' },
  link: { fontSize: typography.sm, color: colors.primary },
  label: { fontSize: typography.sm },
  sep: { marginHorizontal: spacing.xs, color: colors.textMuted, fontSize: typography.sm },
});