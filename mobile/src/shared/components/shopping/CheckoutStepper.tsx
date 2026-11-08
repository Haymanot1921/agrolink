// mobile/src/shared/components/shopping/CheckoutStepper.tsx
// Horizontal step indicator for checkout flow.
// SRS refs: §5.7 FR-ORDER-001..004 (order creation flow).
// §2.4 exclusion: no delivery step — physical transport is arranged off-platform.

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface CheckoutStep {
  key: string;
  label: string;
}

export interface CheckoutStepperProps {
  steps: CheckoutStep[];
  activeStep: number;
  style?: ViewStyle;
}

export function CheckoutStepper({
  steps,
  activeStep,
  style,
}: CheckoutStepperProps): React.ReactElement {
  const { language } = useLanguage();
  const regular = pickFontFamily(language, 'regular');
  const bold = pickFontFamily(language, 'bold');

  return (
    <View style={[styles.wrap, style]}>
      {steps.map((step, idx) => {
        const done = idx < activeStep;
        const active = idx === activeStep;

        return (
          <View key={step.key} style={styles.stepWrap}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.circle,
                  done && styles.circleDone,
                  active && styles.circleActive,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (done || active) && styles.circleTextActive,
                    { fontFamily: bold },
                  ]}
                >
                  {done ? '✓' : idx + 1}
                </Text>
              </View>
              {idx < steps.length - 1 ? (
                <View style={[styles.connector, done && styles.connectorDone]} />
              ) : null}
            </View>
            <Text
              style={[
                styles.label,
                {
                  fontFamily: active ? bold : regular,
                  color: active || done ? colors.text : colors.textMuted,
                },
              ]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepWrap: { flex: 1, alignItems: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  circleDone: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  circleText: { fontSize: typography.xs + 1, color: colors.textMuted, fontWeight: '700' },
  circleTextActive: { color: '#fff' },
  connector: {
    height: 2,
    width: 40,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  connectorDone: { backgroundColor: colors.primary },
  label: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});