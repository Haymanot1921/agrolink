// client/src/shared/components/charts/PieChart.jsx
// Pie or donut chart — proportion breakdowns.
// SRS refs: §11.6 ModerationQueue, §11.4 rating distribution.

import React from 'react';
import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';

const COLORS = ['#2E7D32', '#1565C0', '#F59E0B', '#DC2626', '#7C3AED', '#0891B2', '#EA580C'];

export function PieChart({
  data = [],
  dataKey = 'value',
  nameKey = 'label',
  title,
  subtitle,
  height = 300,
  loading,
  error,
  donut = false,
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
      <RPieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={donut ? 50 : 0}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
          isAnimationActive
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--color-card, #fff)',
            border: '1px solid var(--color-border, #E0E0E0)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
          />
        )}
      </RPieChart>
    </ChartWrapper>
  );
}

export default PieChart;