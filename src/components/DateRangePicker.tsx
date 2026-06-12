import React from 'react';
import { DateRange } from '../types';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
}

const OPTIONS: { label: string; value: DateRange }[] = [
  { label: 'Last 7 days',  value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: '#555',
};

const selectStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #d0d7de',
  fontSize: 14,
  background: '#ffffff',
  cursor: 'pointer',
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange, disabled }) => {
  return (
    <div style={containerStyle}>
      <label htmlFor="date-range-select" style={labelStyle}>Date Range:</label>
      <select
        id="date-range-select"
        style={selectStyle}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value as DateRange)}
        aria-label="Select date range"
      >
        {OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default DateRangePicker;
