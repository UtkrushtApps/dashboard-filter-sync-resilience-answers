import React from 'react';
import { Segment } from '../types';

interface SegmentFilterProps {
  value: Segment;
  onChange: (segment: Segment) => void;
  disabled?: boolean;
}

const SEGMENTS: { label: string; value: Segment }[] = [
  { label: 'All Users',   value: 'all' },
  { label: 'Free',        value: 'free' },
  { label: 'Pro',         value: 'pro' },
  { label: 'Enterprise',  value: 'enterprise' },
];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  alignItems: 'center',
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: '#555',
};

const btnBase: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: 20,
  border: '1px solid #d0d7de',
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  background: '#ffffff',
  color: '#333',
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: '#1a1a2e',
  color: '#ffffff',
  borderColor: '#1a1a2e',
};

const SegmentFilter: React.FC<SegmentFilterProps> = ({ value, onChange, disabled }) => {
  return (
    <div style={containerStyle} role="group" aria-label="Segment filter">
      <span style={labelStyle}>Segment:</span>
      {SEGMENTS.map(seg => (
        <button
          key={seg.value}
          style={value === seg.value ? btnActive : btnBase}
          onClick={() => onChange(seg.value)}
          disabled={disabled}
          aria-pressed={value === seg.value}
        >
          {seg.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentFilter;
