// client/src/shared/components/charts/LineChart.jsx
// Line chart — time series, trends, growth.
// SRS refs: §11.2 UserGrowthChart, §11.6 TotalUsersChart.

import React from 'react';
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';

const COLORS = ['#2E7D32', '#1565C0', '#F59E0B', '#DC2626', '#7C3AED'];

export function LineChart({
  data = [],
  xKey = 'label',
  series = [],
  title,
  subtitle,
  height = 300,
  loading,
  error,
  showLegend = true,
  action,
}) {
  return (
    <ChartWrapper
      title={title}
      subtitle={subtitle}
      height={height}
      loading={loading}
      error={error}
      empty={data.length === 0}
      action={action}
    >
      <RLineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #E0E0E0)" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="var(--color-text-muted, #5F6368)" />
        <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted, #5F6368)" />
        <Tooltip
          contentStyle={{
            background: 'var(--color-card, #fff)',
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        {showLegend && series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </RLineChart>
    </ChartWrapper>
  );
}

export default LineChart;