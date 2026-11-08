// mobile/src/shared/components/charts/AreaChart.tsx
// Filled area chart for cumulative metrics (revenue over time).

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  VictoryArea,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
import { colors } from '@styles/colors';

export interface AreaChartDataPoint {
  x: number | string;
  y: number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export function AreaChart({
  data,
  height = 220,
  color = colors.primary,
  style,
}: AreaChartProps): React.ReactElement {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <VictoryChart
        height={height}
        theme={VictoryTheme.material}
        padding={{ top: 16, bottom: 40, left: 50, right: 16 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textMuted, fontSize: 10 },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textMuted, fontSize: 10 },
            grid: { stroke: colors.border, strokeDasharray: '4,4' },
          }}
        />
        <VictoryArea
          data={data}
          interpolation="monotoneX"
          style={{
            data: {
              fill: color,
              fillOpacity: 0.25,
              stroke: color,
              strokeWidth: 2.5,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { width: '100%' } });