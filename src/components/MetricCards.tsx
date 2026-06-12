import React from 'react';
import { DateRange, Segment } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { formatMs, formatNumber, formatPercent } from '../utils/formatters';

interface MetricCardsProps {
  dateRange: DateRange;
  segment: Segment;
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 12,
  padding: '20px 24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  color: '#888',
};

const cardValueStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: '#1a1a2e',
};

const skeletonStyle: React.CSSProperties = {
  ...cardStyle,
  background: '#e8ecf0',
  animation: 'pulse 1.4s ease-in-out infinite',
};

const MetricCards: React.FC<MetricCardsProps> = () => {
  const {
    data: { summary },
  } = useDashboard();

  if (summary.loading) {
    return (
      <div style={gridStyle}>
        {[0, 1, 2, 3].map(i => <div key={i} style={skeletonStyle} aria-hidden="true" />)}
      </div>
    );
  }

  if (summary.error) {
    return (
      <div style={{ ...cardStyle, gridColumn: '1 / -1', color: '#c0392b' }} role="alert">
        Failed to load summary: {summary.error}
      </div>
    );
  }

  if (!summary.data) {
    return null;
  }

  const metrics: { label: string; value: string }[] = [
    { label: 'Total Requests', value: formatNumber(summary.data.totalRequests) },
    { label: 'Active Users', value: formatNumber(summary.data.activeUsers) },
    { label: 'Error Rate', value: formatPercent(summary.data.errorRate) },
    { label: 'Avg Latency', value: formatMs(summary.data.avgLatencyMs) },
  ];

  return (
    <div style={gridStyle}>
      {metrics.map(metric => (
        <div key={metric.label} style={cardStyle}>
          <span style={cardLabelStyle}>{metric.label}</span>
          <span style={cardValueStyle}>{metric.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
