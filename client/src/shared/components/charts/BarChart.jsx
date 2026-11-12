// client/src/shared/components/charts/BarChart.jsx
// Bar chart — comparisons, distributions.
// SRS refs: §11.2 SalesOverview, §11.4 RevenueAnalytics.

import React from 'react';
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';

const COLORS = ['#2E7D32', '#1565C0', '#F59E0B', '#DC2626', '#7C3AED'];

export function BarChart({
  data = [],
  xKey = 'label',
  series = [],
  title,
  subtitle,
  height = 300,
  loading,
  error,
  showLegend = true,
  stacked = false,
  horizontal = false,
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
      <RBarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #E0E0E0)" />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--color-text-muted, #5F6368)" />
            <YAxis type="category" dataKey={xKey} tick={{ fontSize: 12 }} stroke="var(--color-text-muted, #5F6368)" />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="var(--color-text-muted, #5F6368)" />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted, #5F6368)" />
          </>
        )}
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
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId={stacked ? 'stack' : undefined}
            fill={s.color ?? COLORS[i % COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RBarChart>
    </ChartWrapper>
  );
}

export default BarChart;