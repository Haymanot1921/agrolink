// mobile/src/shared/components/shopping/CartBadge.tsx
// Floating cart button with item count badge (used on marketplace screens).
// SRS refs: §11.7 mobile buyer, FR-ORDER-001 (cart → order).

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';

export interface CartBadgeProps {
  count: number;
  onPress: () => void;
  /** Show as floating action button (default: true). */
  floating?: boolean;
  style?: ViewStyle;
}

export function CartBadge({
  count,
  onPress,
  floating = true,
  style,
}: CartBadgeProps): React.ReactElement {
  const { t } = useTranslation('common');
  const scale = useSharedValue(1);
  const prevCount = React.useRef(count);

  // Bump when count changes
  React.useEffect(() => {
    if (count !== prevCount.current && count > 0) {
      scale.value = withSequence(
        withSpring(1.25, { damping: 6 }),
        withSpring(1, { damping: 8 }),
      );
    }
    prevCount.current = count;
  }, [count, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[floating && styles.floating, animatedStyle, style]}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t('cart.title')}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>🛒</Text>
        {count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});