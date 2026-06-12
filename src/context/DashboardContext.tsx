import React, { createContext, useContext } from 'react';
import { DashboardData, DateRange, FilterState, Segment } from '../types';

export interface DashboardContextValue {
  filters: FilterState;
  setDateRange: (range: DateRange) => void;
  setSegment: (segment: Segment) => void;
  data: DashboardData;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  value: DashboardContextValue;
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ value, children }) => {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardContext.Provider');
  }
  return ctx;
}
