import React, { useMemo, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import SegmentFilter from '../components/SegmentFilter';
import MetricCards from '../components/MetricCards';
import TrendChart from '../components/TrendChart';
import { DashboardProvider } from '../context/DashboardContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { setSimulateChartError, getSimulateChartError } from '../services/localApi';

const pageStyle: React.CSSProperties = {
  padding: '32px',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const filterBarStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 12,
  padding: '16px 24px',
  display: 'flex',
  gap: 24,
  alignItems: 'center',
  flexWrap: 'wrap',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  justifyContent: 'space-between',
};

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const headingStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: '#1a1a2e',
};

const subheadStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#888',
  marginTop: 4,
};

const toggleLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  color: '#c0392b',
  cursor: 'pointer',
  userSelect: 'none',
};

const DashboardPage: React.FC = () => {
  const [chartErrorMode, setChartErrorMode] = useState<boolean>(getSimulateChartError());

  const dashboard = useDashboardData('30d', 'all', {
    timeseriesScopeKey: chartErrorMode ? 'chart-error-on' : 'chart-error-off',
  });

  const handleToggleChartError = () => {
    const next = !chartErrorMode;
    setSimulateChartError(next);
    setChartErrorMode(next);
  };

  const providerValue = useMemo(
    () => dashboard,
    [dashboard]
  );

  return (
    <DashboardProvider value={providerValue}>
      <div style={pageStyle}>
        <div>
          <h1 style={headingStyle}>Platform Usage</h1>
          <p style={subheadStyle}>Monitor request volume, active users, and error rates across your customer segments.</p>
        </div>

        <div style={filterBarStyle}>
          <div style={filterGroupStyle}>
            <DateRangePicker value={dashboard.filters.dateRange} onChange={dashboard.setDateRange} />
            <SegmentFilter value={dashboard.filters.segment} onChange={dashboard.setSegment} />
          </div>
          <label style={toggleLabelStyle}>
            <input
              type="checkbox"
              checked={chartErrorMode}
              onChange={handleToggleChartError}
              aria-label="Simulate chart API error"
            />
            Simulate Chart Error
          </label>
        </div>

        <MetricCards dateRange={dashboard.filters.dateRange} segment={dashboard.filters.segment} />
        <TrendChart dateRange={dashboard.filters.dateRange} segment={dashboard.filters.segment} />
      </div>
    </DashboardProvider>
  );
};

export default DashboardPage;
