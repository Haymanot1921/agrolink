// mobile/src/shared/components/feedback/ProgressBar.tsx
// Linear or circular progress. Used for uploads, dashboard completeness.

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  variant?: 'linear' | 'circular';
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  style?: ViewStyle;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function ProgressBar({
  progress,
  variant = 'linear',
  size = 80,
  strokeWidth = 8,
  color = colors.primary,
  showLabel = true,
  label,
  style,
}: ProgressBarProps): React.ReactElement {
  const { language } = useLanguage();
  const fontFamily = pickFontFamily(language, 'bold');
  const pct = clamp01(progress);
  const pctText = `${Math.round(pct * 100)}%`;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [pct, anim]);

  if (variant === 'circular') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - pct);

    return (
      <View style={[styles.circularWrap, { width: size, height: size }, style]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        {showLabel ? (
          <View style={StyleSheet.absoluteFill as ViewStyle}>
            <View style={styles.circularLabelWrap}>
              <Text style={[styles.circularLabel, { fontFamily }]}>{pctText}</Text>
              {label ? <Text style={styles.circularSubLabel}>{label}</Text> : null}
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  // Linear
  return (
    <View style={[styles.linearWrap, style]}>
      <View style={styles.linearTrack}>
        <Animated.View
          style={[
            styles.linearFill,
            {
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      {showLabel ? (
        <Text style={[styles.linearLabel, { fontFamily }]}>{label ?? pctText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Linear
  linearWrap: { width: '100%' },
  linearTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  linearFill: { height: '100%', borderRadius: 4 },
  linearLabel: {
    fontSize: typography.xs + 1,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  // Circular
  circularWrap: { alignItems: 'center', justifyContent: 'center' },
  circularLabelWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circularLabel: { fontSize: typography.lg, color: colors.text },
  circularSubLabel: { fontSize: typography.xs, color: colors.textMuted, marginTop: 2 },
});