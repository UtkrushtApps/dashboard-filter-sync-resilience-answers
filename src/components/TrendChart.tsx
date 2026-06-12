import React from 'react';
import { DateRange, Segment, TimeseriesPoint } from '../types';
import { useDashboard } from '../context/DashboardContext';

interface TrendChartProps {
  dateRange: DateRange;
  segment: Segment;
}

const wrapperStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 12,
  padding: '24px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 20,
  color: '#1a1a2e',
};

const skeletonBarStyle: React.CSSProperties = {
  height: 200,
  background: '#e8ecf0',
  borderRadius: 8,
  animation: 'pulse 1.4s ease-in-out infinite',
};

function scalePoints(points: TimeseriesPoint[], width: number, height: number): string {
  if (points.length === 0) return '';

  const maxReq = Math.max(...points.map(point => point.requests), 1);
  const step = points.length > 1 ? width / (points.length - 1) : 0;

  return points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.requests / maxReq) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

const TrendChart: React.FC<TrendChartProps> = () => {
  const {
    filters,
    data: { timeseries },
  } = useDashboard();

  return (
    <div style={wrapperStyle}>
      <h3 style={titleStyle}>Request Volume Over Time</h3>

      {timeseries.loading && <div style={skeletonBarStyle} aria-label="Loading chart" />}

      {!timeseries.loading && timeseries.error && (
        <div
          style={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff5f5',
            borderRadius: 8,
            border: '1px solid #fecaca',
            color: '#c0392b',
            fontSize: 14,
            padding: 16,
          }}
          role="alert"
        >
          Chart unavailable: {timeseries.error}
        </div>
      )}

      {!timeseries.loading && !timeseries.error && timeseries.data && (
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          style={{ width: '100%', height: 200 }}
          role="img"
          aria-label={`Request volume for last ${filters.dateRange}`}
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8ef7" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4f8ef7" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <path
            d={scalePoints(timeseries.data.points, 600, 200)}
            fill="none"
            stroke="#4f8ef7"
            strokeWidth="2.5"
          />
        </svg>
      )}
    </div>
  );
};

export default TrendChart;
