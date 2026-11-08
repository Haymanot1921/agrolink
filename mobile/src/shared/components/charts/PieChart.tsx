// mobile/src/shared/components/charts/PieChart.tsx
// Pie/donut chart for proportions (order status split, category split).

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { colors } from '@styles/colors';

export interface PieChartSlice {
  x: string;
  y: number;
}

export interface PieChartProps {
  data: PieChartSlice[];
  size?: number;
  innerRadius?: number;
  palette?: string[];
  showLabels?: boolean;
  style?: ViewStyle;
}

const DEFAULT_PALETTE = [
  colors.primary,
  '#7B1FA2',
  '#F9A825',
  '#1976D2',
  '#C2185B',
  '#00796B',
  '#E64A19',
];

export function PieChart({
  data,
  size = 220,
  innerRadius = 50,
  palette = DEFAULT_PALETTE,
  showLabels = true,
  style,
}: PieChartProps): React.ReactElement {
  return (
    <View style={[styles.wrap, { height: size }, style]}>
      <VictoryPie
        height={size}
        width={size}
        data={data}
        innerRadius={innerRadius}
        colorScale={palette}
        labels={({ datum }) => (showLabels ? datum.x : '')}
        labelComponent={
          <VictoryLabel
            style={{ fill: colors.text, fontSize: 10, fontWeight: '600' }}
          />
        }
        style={{
          data: { stroke: colors.background, strokeWidth: 2 },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center', justifyContent: 'center' },
});