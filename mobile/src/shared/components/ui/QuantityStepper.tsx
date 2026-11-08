// mobile/src/shared/components/ui/QuantityStepper.tsx
// Decrement / increment quantity with min/max clamping.
// SRS refs: §5.7 FR-ORDER-010 (no overselling), FR-MARKET-012.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';

export interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  step = 1,
  unit,
  disabled = false,
  size = 'md',
  style,
}: QuantityStepperProps): React.ReactElement {
  const sizeStyle = SIZES[size];
  const canDec = !disabled && value > min;
  const canInc = !disabled && value < max;

  const handleDec = () => canDec && onChange(Math.max(min, +(value - step).toFixed(3)));
  const handleInc = () => canInc && onChange(Math.min(max, +(value + step).toFixed(3)));

  return (
    <View style={[styles.row, style, disabled && { opacity: 0.5 }]}>
      <TouchableOpacity
        onPress={handleDec}
        disabled={!canDec}
        style={[styles.btn, sizeStyle.btn, !canDec && styles.btnDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Text style={[styles.btnText, sizeStyle.btnText]}>−</Text>
      </TouchableOpacity>

      <View style={[styles.valueWrap, sizeStyle.valueWrap]}>
        <Text style={[styles.value, sizeStyle.valueText]}>
          {value}
          {unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleInc}
        disabled={!canInc}
        style={[styles.btn, sizeStyle.btn, !canInc && styles.btnDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Text style={[styles.btnText, sizeStyle.btnText]}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const SIZES = {
  sm: {
    btn: { width: 28, height: 28, borderRadius: 14 },
    btnText: { fontSize: 16 },
    valueWrap: { minWidth: 44, paddingHorizontal: 6 },
    valueText: { fontSize: typography.sm },
  },
  md: {
    btn: { width: 36, height: 36, borderRadius: 18 },
    btnText: { fontSize: 18 },
    valueWrap: { minWidth: 60, paddingHorizontal: 8 },
    valueText: { fontSize: typography.md },
  },
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: colors.border },
  btnText: { color: colors.primary, fontWeight: '700' },
  valueWrap: { alignItems: 'center', justifyContent: 'center' },
  value: { fontWeight: '700', color: colors.text, textAlign: 'center' },
  unit: { fontSize: typography.xs, color: colors.textMuted, fontWeight: '400' },
});