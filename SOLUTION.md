# Solution Steps

1. Lift the active filter state out of MetricCards and TrendChart into a single shared owner so both widgets always read the same dateRange and segment values.

2. Implement a shared dashboard data hook that owns both filter state and both API results. Keep summary and timeseries as separate ApiResult objects so each widget can load or fail independently.

3. Move all fetching logic into the shared hook. Start one summary request and one timeseries request per active filter state instead of letting each widget fetch for itself.

4. Add request coordination inside the hook with module-level caches and in-flight promise maps keyed by filter state. This prevents duplicate concurrent requests and allows already-fetched results to be reused on remounts.

5. Guard against stale async responses by tracking a request id per endpoint in the hook. When filters change rapidly, only commit the response if it still matches the latest request id; otherwise ignore it.

6. When filters change, clear widget data for any uncached next state and show loading for that endpoint. This prevents old data from remaining visible while a newer filter selection is already active.

7. Keep summary and timeseries error handling isolated. A timeseries failure should only update data.timeseries.error and must not overwrite or clear a successfully loaded summary result.

8. Use the existing DashboardContext to provide filters, setters, and fetched data to the dashboard subtree. This keeps the widgets presentational and avoids local copies of dashboard state.

9. Refactor MetricCards and TrendChart to consume shared dashboard data from context instead of using their own local state/effects. Keep their current TypeScript prop interfaces so existing usage is not broken.

10. Make the chart error simulation affect only the timeseries request scope so toggling the checkbox triggers a timeseries refresh without disturbing summary data.

11. Preserve the existing DateRangePicker and SegmentFilter APIs, but wire them directly to the shared hook setters from DashboardPage.

12. Verify the behavior: both widgets stay aligned to the same active filters, rapid changes do not allow stale responses into the UI, and a chart 500 only breaks the chart area while metric cards remain visible.

