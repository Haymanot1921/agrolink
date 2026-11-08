// mobile/src/shared/components/charts/LineChart.tsx
// Line/area chart for time series (sales, consultations, revenue).
// SRS refs: §11.6 admin dashboard, §11.4 supplier revenue.

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { colors } from '@styles/colors';

export interface LineChartDataPoint {
  x: number | string;
  y: number;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showArea?: boolean;
  xLabel?: string;
  yLabel?: string;
  style?: ViewStyle;
}

export function LineChart({
  data,
  height = 220,
  color = colors.primary,
  showGrid = true,
  xLabel,
  yLabel,
  style,
}: LineChartProps): React.ReactElement {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <VictoryChart
        height={height}
        width={undefined}
        theme={VictoryTheme.material}
        padding={{ top: 16, bottom: 40, left: 50, right: 16 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textMuted, fontSize: 10 },
            grid: { stroke: showGrid ? colors.border : 'transparent' },
          }}
          label={xLabel}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textMuted, fontSize: 10 },
            grid: { stroke: showGrid ? colors.border : 'transparent', strokeDasharray: '4,4' },
          }}
          label={yLabel}
        />
        <VictoryLine
          data={data}
          interpolation="monotoneX"
          style={{ data: { stroke: color, strokeWidth: 2.5 } }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { width: '100%' } });