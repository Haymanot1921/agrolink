// client/src/shared/components/charts/AreaChart.jsx
// Area chart — cumulative totals, volume.
// SRS refs: §11.2 SalesOverviewChart, §11.4 EarningsOverviewChart.

import React from 'react';
import {
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';

const COLORS = ['#2E7D32', '#1565C0', '#F59E0B', '#DC2626', '#7C3AED'];

export function AreaChart({
  data = [],
  xKey = 'label',
  series = [],
  title,
  subtitle,
  height = 300,
  loading,
  error,
  stacked = false,
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
      <RAreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color ?? COLORS[i % COLORS.length]} stopOpacity={0.7} />
              <stop offset="95%" stopColor={s.color ?? COLORS[i % COLORS.length]} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
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
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stackId={stacked ? 'stack' : undefined}
            stroke={s.color ?? COLORS[i % COLORS.length]}
            fill={`url(#grad-${s.key})`}
            strokeWidth={2}
          />
        ))}
      </RAreaChart>
    </ChartWrapper>
  );
}

export default AreaChart;