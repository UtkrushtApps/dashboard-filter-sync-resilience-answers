import { DateRange, Segment, UsageSummary, TimeseriesData } from '../types';
import { buildSummary, buildTimeseries } from '../data/mockData';

let simulateChartError = false;

export function setSimulateChartError(value: boolean): void {
  simulateChartError = value;
}

export function getSimulateChartError(): boolean {
  return simulateChartError;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchUsageSummary(
  dateRange: DateRange,
  segment: Segment,
  signal?: AbortSignal
): Promise<UsageSummary> {
  await delay(400 + Math.random() * 300);

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  return buildSummary(dateRange, segment);
}

export async function fetchUsageTimeseries(
  dateRange: DateRange,
  segment: Segment,
  signal?: AbortSignal
): Promise<TimeseriesData> {
  await delay(600 + Math.random() * 400);

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (simulateChartError) {
    throw new Error('Internal Server Error (500): timeseries unavailable');
  }

  return {
    points: buildTimeseries(dateRange, segment),
    dateRange,
    segment,
  };
}
