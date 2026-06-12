import { DateRange, Segment, UsageSummary, TimeseriesPoint } from '../types';

const BASE_METRICS: Record<DateRange, Record<Segment, Omit<UsageSummary, 'dateRange' | 'segment'>>> = {
  '7d': {
    all:        { totalRequests: 142_800, activeUsers: 3_420, errorRate: 1.2, avgLatencyMs: 87 },
    free:       { totalRequests:  58_100, activeUsers: 2_100, errorRate: 2.1, avgLatencyMs: 112 },
    pro:        { totalRequests:  61_400, activeUsers:   980, errorRate: 0.9, avgLatencyMs: 74 },
    enterprise: { totalRequests:  23_300, activeUsers:   340, errorRate: 0.4, avgLatencyMs: 48 },
  },
  '14d': {
    all:        { totalRequests: 298_500, activeUsers: 4_810, errorRate: 1.4, avgLatencyMs: 91 },
    free:       { totalRequests: 120_200, activeUsers: 2_980, errorRate: 2.3, avgLatencyMs: 118 },
    pro:        { totalRequests: 128_700, activeUsers: 1_420, errorRate: 1.0, avgLatencyMs: 78 },
    enterprise: { totalRequests:  49_600, activeUsers:   410, errorRate: 0.5, avgLatencyMs: 51 },
  },
  '30d': {
    all:        { totalRequests: 641_200, activeUsers: 6_230, errorRate: 1.6, avgLatencyMs: 95 },
    free:       { totalRequests: 258_300, activeUsers: 3_890, errorRate: 2.5, avgLatencyMs: 124 },
    pro:        { totalRequests: 276_800, activeUsers: 1_810, errorRate: 1.1, avgLatencyMs: 82 },
    enterprise: { totalRequests: 106_100, activeUsers:   530, errorRate: 0.6, avgLatencyMs: 54 },
  },
  '90d': {
    all:        { totalRequests: 1_924_400, activeUsers: 8_900, errorRate: 1.8, avgLatencyMs: 99 },
    free:       { totalRequests:   775_600, activeUsers: 5_620, errorRate: 2.8, avgLatencyMs: 131 },
    pro:        { totalRequests:   831_200, activeUsers: 2_540, errorRate: 1.3, avgLatencyMs: 85 },
    enterprise: { totalRequests:   317_600, activeUsers:   740, errorRate: 0.7, avgLatencyMs: 58 },
  },
};

export function buildSummary(dateRange: DateRange, segment: Segment): UsageSummary {
  return { ...BASE_METRICS[dateRange][segment], dateRange, segment };
}

export function buildTimeseries(dateRange: DateRange, segment: Segment): TimeseriesPoint[] {
  const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : dateRange === '30d' ? 30 : 90;
  const base = BASE_METRICS[dateRange][segment];
  const points: TimeseriesPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const jitter = 0.7 + Math.random() * 0.6;
    points.push({
      date: d.toISOString().split('T')[0],
      requests: Math.round((base.totalRequests / days) * jitter),
      activeUsers: Math.round((base.activeUsers / days) * 3 * jitter),
      errors: Math.round((base.totalRequests / days) * (base.errorRate / 100) * jitter),
    });
  }

  return points;
}
