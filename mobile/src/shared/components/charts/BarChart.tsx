// mobile/src/shared/components/charts/BarChart.tsx
// Bar chart for categorical comparisons (top products, ticket volume).

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { colors } from '@styles/colors';

export interface BarChartDataPoint {
  x: string;
  y: number;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  color?: string;
  barWidth?: number;
  style?: ViewStyle;
}

export function BarChart({
  data,
  height = 220,
  color = colors.primary,
  barWidth = 18,
  style,
}: BarChartProps): React.ReactElement {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <VictoryChart
        height={height}
        theme={VictoryTheme.material}
        padding={{ top: 16, bottom: 50, left: 50, right: 16 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textMuted, fontSize: 10, angle: -30 },
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
        <VictoryBar
          data={data}
          barWidth={barWidth}
          cornerRadius={{ top: 4 }}
          style={{ data: { fill: color } }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { width: '100%' } });