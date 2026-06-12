export type DateRange = '7d' | '14d' | '30d' | '90d';

export type Segment = 'all' | 'free' | 'pro' | 'enterprise';

export interface FilterState {
  dateRange: DateRange;
  segment: Segment;
}

export interface UsageSummary {
  totalRequests: number;
  activeUsers: number;
  errorRate: number;
  avgLatencyMs: number;
  dateRange: DateRange;
  segment: Segment;
}

export interface TimeseriesPoint {
  date: string;
  requests: number;
  activeUsers: number;
  errors: number;
}

export interface TimeseriesData {
  points: TimeseriesPoint[];
  dateRange: DateRange;
  segment: Segment;
}

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface DashboardData {
  summary: ApiResult<UsageSummary>;
  timeseries: ApiResult<TimeseriesData>;
}
