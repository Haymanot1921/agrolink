// mobile/src/shared/components/ui/StarRating.tsx
// Display-only or interactive 5-star rating.
// SRS refs: §5.14 (reviews), FR-REVIEW-001.

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  style?: ViewStyle;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 22,
  interactive = false,
  onChange,
  style,
}: StarRatingProps): React.ReactElement {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <View style={[styles.row, style]}>
      {stars.map((star) => {
        const filled = star <= Math.round(rating);
        const Star = interactive ? TouchableOpacity : View;

        return (
          <Star
            key={star}
            onPress={interactive ? () => onChange?.(star) : undefined}
            accessibilityRole={interactive ? 'button' : 'text'}
            accessibilityLabel={interactive ? `${star} star${star > 1 ? 's' : ''}` : undefined}
            style={{ padding: interactive ? 2 : 0 }}
          >
            <View
              style={{
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.9,
                  height: size * 0.9,
                  borderRadius: size * 0.45,
                  backgroundColor: filled ? '#F9A825' : '#E0E0E0',
                  transform: [{ rotate: '45deg' }],
                }}
              />
            </View>
          </Star>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});