// mobile/src/shared/components/shopping/MiniCartSheet.tsx
// Slide-up mini cart preview from any marketplace screen.
// SRS refs: §5.7 FR-ORDER-001..002 (cart → order), §11.7 mobile buyer.
// §2.4 exclusion: no delivery option, no shipping calculator — physical transport
// is arranged outside the platform.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { BottomSheet } from '@components/ui/BottomSheet';
import { QuantityStepper } from '@components/ui/QuantityStepper';
import { PriceTag } from '@components/ui/PriceTag';
import { EmptyState } from '@components/ui/EmptyState';
import { AppButton } from '@components/ui/AppButton';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface MiniCartItem {
  id: string;
  productName: string;
  imageUrl?: string;
  unitPriceEtb: number;
  unit: string;
  quantity: number;
  maxQuantity: number;
  sellerName: string;
}

export interface MiniCartSheetProps {
  visible: boolean;
  items: MiniCartItem[];
  onClose: () => void;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function MiniCartSheet({
  visible,
  items,
  onClose,
  onChangeQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}: MiniCartSheetProps): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('buyer');
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  const subtotal = items.reduce((sum, i) => sum + i.unitPriceEtb * i.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightRatio={0.85}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: bold }]}>{t('cart.title')}</Text>
        <TouchableOpacity onPress={onClose} accessibilityRole="button">
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title={t('cart.empty')}
            subtitle={t('cart.emptyCta')}
            actionLabel={t('marketplace.title')}
            onAction={onContinueShopping}
          />
        </View>
      ) : (
        <>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.id} style={styles.item}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                ) : (
                  <View style={styles.thumbPlaceholder}>
                    <Text style={styles.placeholderIcon}>🛒</Text>
                  </View>
                )}
                <View style={styles.itemBody}>
                  <Text style={[styles.itemName, { fontFamily: bold }]} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={[styles.seller, { fontFamily: regular }]} numberOfLines={1}>
                    {t('marketplace.product.seller')}: {item.sellerName}
                  </Text>
                  <View style={styles.itemRow}>
                    <PriceTag amount={item.unitPriceEtb} size="sm" />
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => onChangeQuantity(item.id, q)}
                      max={item.maxQuantity}
                      size="sm"
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => onRemoveItem(item.id)}
                  style={styles.removeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t('cart.removeItem')}
                >
                  <Text style={styles.removeIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { fontFamily: regular }]}>
                {t('cart.total')}
              </Text>
              <PriceTag amount={subtotal} size="lg" />
            </View>
            <AppButton
              title={t('cart.checkout')}
              onPress={onCheckout}
              fullWidth
              variant="primary"
            />
            <TouchableOpacity onPress={onContinueShopping} style={styles.continue}>
              <Text style={[styles.continueText, { fontFamily: regular }]}>
                {t('actions.continue', { ns: 'common' })}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: typography.lg, color: colors.text },
  close: { fontSize: 20, color: colors.textMuted },
  emptyWrap: { minHeight: 240 },
  list: { maxHeight: 360 },
  item: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  thumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: { fontSize: 24 },
  itemBody: { flex: 1, justifyContent: 'space-between' },
  itemName: { fontSize: typography.sm + 1, color: colors.text },
  seller: { fontSize: typography.xs, color: colors.textMuted, marginTop: 2 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  removeBtn: { paddingHorizontal: spacing.xs },
  removeIcon: { fontSize: 16 },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  totalLabel: { fontSize: typography.md, color: colors.text },
  continue: { alignItems: 'center', paddingVertical: spacing.sm },
  continueText: { fontSize: typography.sm, color: colors.primary },
});