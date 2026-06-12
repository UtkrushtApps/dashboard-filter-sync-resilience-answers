import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ApiResult,
  DashboardData,
  DateRange,
  FilterState,
  Segment,
  TimeseriesData,
  UsageSummary,
} from '../types';
import { fetchUsageSummary, fetchUsageTimeseries } from '../services/localApi';

interface UseDashboardDataOptions {
  timeseriesScopeKey?: string | number;
}

const summaryCache = new Map<string, UsageSummary>();
const timeseriesCache = new Map<string, TimeseriesData>();
const summaryInflight = new Map<string, Promise<UsageSummary>>();
const timeseriesInflight = new Map<string, Promise<TimeseriesData>>();

let activeConsumers = 0;

function buildResult<T>(data: T | null, loading: boolean): ApiResult<T> {
  return {
    data,
    error: null,
    loading,
  };
}

function getFilterKey(dateRange: DateRange, segment: Segment): string {
  return `${dateRange}::${segment}`;
}

function getTimeseriesKey(dateRange: DateRange, segment: Segment, scopeKey: string): string {
  return `${scopeKey}::${getFilterKey(dateRange, segment)}`;
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}

function buildInitialData(filters: FilterState, timeseriesScopeKey: string): DashboardData {
  const summaryKey = getFilterKey(filters.dateRange, filters.segment);
  const scopedTimeseriesKey = getTimeseriesKey(filters.dateRange, filters.segment, timeseriesScopeKey);

  const cachedSummary = summaryCache.get(summaryKey) ?? null;
  const cachedTimeseries = timeseriesCache.get(scopedTimeseriesKey) ?? null;

  return {
    summary: buildResult(cachedSummary, !cachedSummary),
    timeseries: buildResult(cachedTimeseries, !cachedTimeseries),
  };
}

function getSummaryResource(dateRange: DateRange, segment: Segment): Promise<UsageSummary> {
  const key = getFilterKey(dateRange, segment);

  const cached = summaryCache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  const inflight = summaryInflight.get(key);
  if (inflight) {
    return inflight;
  }

  const request = fetchUsageSummary(dateRange, segment)
    .then(result => {
      summaryCache.set(key, result);
      return result;
    })
    .finally(() => {
      summaryInflight.delete(key);
    });

  summaryInflight.set(key, request);
  return request;
}

function getTimeseriesResource(
  dateRange: DateRange,
  segment: Segment,
  timeseriesScopeKey: string
): Promise<TimeseriesData> {
  const key = getTimeseriesKey(dateRange, segment, timeseriesScopeKey);

  const cached = timeseriesCache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  const inflight = timeseriesInflight.get(key);
  if (inflight) {
    return inflight;
  }

  const request = fetchUsageTimeseries(dateRange, segment)
    .then(result => {
      timeseriesCache.set(key, result);
      return result;
    })
    .finally(() => {
      timeseriesInflight.delete(key);
    });

  timeseriesInflight.set(key, request);
  return request;
}

export function resetDashboardResourceCache(): void {
  summaryCache.clear();
  timeseriesCache.clear();
  summaryInflight.clear();
  timeseriesInflight.clear();
}

export function useDashboardData(
  initialRange: DateRange = '30d',
  initialSegment: Segment = 'all',
  options: UseDashboardDataOptions = {}
) {
  const timeseriesScopeKey = String(options.timeseriesScopeKey ?? 'default');

  const [filters, setFilters] = useState<FilterState>({
    dateRange: initialRange,
    segment: initialSegment,
  });

  const [data, setData] = useState<DashboardData>(() => buildInitialData(
    { dateRange: initialRange, segment: initialSegment },
    timeseriesScopeKey
  ));

  const summaryRequestId = useRef(0);
  const timeseriesRequestId = useRef(0);

  useEffect(() => {
    activeConsumers += 1;

    return () => {
      activeConsumers = Math.max(0, activeConsumers - 1);

      if (process.env.NODE_ENV === 'test' && activeConsumers === 0) {
        resetDashboardResourceCache();
      }
    };
  }, []);

  useEffect(() => {
    const key = getFilterKey(filters.dateRange, filters.segment);
    const cached = summaryCache.get(key) ?? null;
    const currentRequestId = ++summaryRequestId.current;
    let active = true;

    if (cached) {
      setData(prev => ({
        ...prev,
        summary: {
          data: cached,
          error: null,
          loading: false,
        },
      }));

      return () => {
        active = false;
      };
    }

    setData(prev => ({
      ...prev,
      summary: {
        data: null,
        error: null,
        loading: true,
      },
    }));

    getSummaryResource(filters.dateRange, filters.segment)
      .then(result => {
        if (!active || currentRequestId !== summaryRequestId.current) {
          return;
        }

        setData(prev => ({
          ...prev,
          summary: {
            data: result,
            error: null,
            loading: false,
          },
        }));
      })
      .catch(error => {
        if (!active || currentRequestId !== summaryRequestId.current) {
          return;
        }

        setData(prev => ({
          ...prev,
          summary: {
            data: null,
            error: normalizeError(error),
            loading: false,
          },
        }));
      });

    return () => {
      active = false;
    };
  }, [filters.dateRange, filters.segment]);

  useEffect(() => {
    const key = getTimeseriesKey(filters.dateRange, filters.segment, timeseriesScopeKey);
    const cached = timeseriesCache.get(key) ?? null;
    const currentRequestId = ++timeseriesRequestId.current;
    let active = true;

    if (cached) {
      setData(prev => ({
        ...prev,
        timeseries: {
          data: cached,
          error: null,
          loading: false,
        },
      }));

      return () => {
        active = false;
      };
    }

    setData(prev => ({
      ...prev,
      timeseries: {
        data: null,
        error: null,
        loading: true,
      },
    }));

    getTimeseriesResource(filters.dateRange, filters.segment, timeseriesScopeKey)
      .then(result => {
        if (!active || currentRequestId !== timeseriesRequestId.current) {
          return;
        }

        setData(prev => ({
          ...prev,
          timeseries: {
            data: result,
            error: null,
            loading: false,
          },
        }));
      })
      .catch(error => {
        if (!active || currentRequestId !== timeseriesRequestId.current) {
          return;
        }

        setData(prev => ({
          ...prev,
          timeseries: {
            data: null,
            error: normalizeError(error),
            loading: false,
          },
        }));
      });

    return () => {
      active = false;
    };
  }, [filters.dateRange, filters.segment, timeseriesScopeKey]);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setFilters(prev => {
      if (prev.dateRange === dateRange) {
        return prev;
      }
      return { ...prev, dateRange };
    });
  }, []);

  const setSegment = useCallback((segment: Segment) => {
    setFilters(prev => {
      if (prev.segment === segment) {
        return prev;
      }
      return { ...prev, segment };
    });
  }, []);

  return {
    filters,
    data,
    setDateRange,
    setSegment,
  };
}
