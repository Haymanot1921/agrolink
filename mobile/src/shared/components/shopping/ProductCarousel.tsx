// mobile/src/shared/components/shopping/ProductCarousel.tsx
// Horizontal product carousel — "Recommended", "Featured farmers", "Near you".
// SRS refs: §11.7 mobile buyer experience, FR-MARKET-007 (browse).

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ViewStyle,
} from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { PriceTag } from '@components/ui/PriceTag';
import { Badge } from '@components/ui/Badge';

const CARD_WIDTH = Math.min(180, Dimensions.get('window').width * 0.44);

export interface ProductCardData {
  id: string;
  name: string;
  imageUrl: string;
  priceEtb: number;
  unit: string;
  location?: string;
  /** Optional small label (e.g. "New", "Organic", "Best seller"). */
  tag?: string;
  /** Original price for discount badge. */
  originalPriceEtb?: number;
}

export interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  data: ProductCardData[];
  onPressProduct: (product: ProductCardData) => void;
  onPressSeeAll?: () => void;
  /** Compact = shorter cards (default: false). */
  compact?: boolean;
  style?: ViewStyle;
}

export function ProductCarousel({
  title,
  subtitle,
  data,
  onPressProduct,
  onPressSeeAll,
  compact = false,
  style,
}: ProductCarouselProps): React.ReactElement | null {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  const renderItem = useCallback(
    ({ item }: { item: ProductCardData }) => {
      const discount =
        item.originalPriceEtb && item.originalPriceEtb > item.priceEtb
          ? Math.round(
              ((item.originalPriceEtb - item.priceEtb) / item.originalPriceEtb) * 100,
            )
          : null;

      return (
        <TouchableOpacity
          style={[styles.card, compact && styles.cardCompact]}
          onPress={() => onPressProduct(item)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={item.name}
        >
          <View style={styles.imageWrap}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            {item.tag ? (
              <View style={styles.tagWrap}>
                <Badge label={item.tag} variant="warning" size="sm" />
              </View>
            ) : null}
            {discount !== null ? (
              <View style={styles.discountWrap}>
                <Badge label={`-${discount}%`} variant="danger" size="sm" />
              </View>
            ) : null}
          </View>

          <View style={styles.body}>
            <Text style={[styles.name, { fontFamily: bold }]} numberOfLines={2}>
              {item.name}
            </Text>
            {item.location ? (
              <Text style={[styles.location, { fontFamily: regular }]} numberOfLines={1}>
                📍 {item.location}
              </Text>
            ) : null}

            <View style={styles.priceRow}>
              <PriceTag amount={item.priceEtb} size="sm" />
              {item.originalPriceEtb && item.originalPriceEtb > item.priceEtb ? (
                <PriceTag amount={item.originalPriceEtb} size="sm" struck />
              ) : null}
            </View>
            <Text style={[styles.unit, { fontFamily: regular }]}>/ {item.unit}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [compact, language, bold, regular, onPressProduct],
  );

  if (!data.length) return null;

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontFamily: bold }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { fontFamily: regular }]}>{subtitle}</Text>
          ) : null}
        </View>
        {onPressSeeAll ? (
          <TouchableOpacity onPress={onPressSeeAll} accessibilityRole="button">
            <Text style={[styles.seeAll, { fontFamily: bold }]}>
              {t('actions.viewAll')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: spacing.sm }} />}
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: { fontSize: typography.lg, color: colors.text },
  subtitle: { fontSize: typography.sm, color: colors.textMuted, marginTop: 2 },
  seeAll: { fontSize: typography.sm, color: colors.primary },
  listContent: { paddingHorizontal: spacing.md },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardCompact: { width: CARD_WIDTH * 0.85 },
  imageWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#eee', position: 'relative' },
  image: { width: '100%', height: '100%' },
  tagWrap: { position: 'absolute', top: spacing.xs, left: spacing.xs },
  discountWrap: { position: 'absolute', top: spacing.xs, right: spacing.xs },
  body: { padding: spacing.sm },
  name: { fontSize: typography.sm + 1, color: colors.text, minHeight: 36 },
  location: { fontSize: typography.xs, color: colors.textMuted, marginTop: 2 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  unit: { fontSize: typography.xs, color: colors.textMuted },
});