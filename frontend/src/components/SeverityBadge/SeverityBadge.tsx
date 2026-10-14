import React from 'react';
import { Chip } from '@mui/material';

interface SeverityBadgeProps {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  size?: 'small' | 'medium';
}

const severityConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  CRITICAL: {
    label: 'CRITICAL',
    bg: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca',
  },
  HIGH: {
    label: 'HIGH',
    bg: '#fff7ed',
    color: '#c2410c',
    border: '#ffedd5',
  },
  MEDIUM: {
    label: 'MEDIUM',
    bg: '#f0f9ff',
    color: '#0369a1',
    border: '#bae6fd',
  },
  LOW: {
    label: 'LOW',
    bg: '#f0fdf4',
    color: '#15803d',
    border: '#bbf7d0',
  },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'small' }) => {
  const upper = (severity || 'LOW').toUpperCase();
  const conf = severityConfig[upper] || severityConfig.LOW;

  return (
    <Chip
      label={conf.label}
      size={size}
      sx={{
        backgroundColor: conf.bg,
        color: conf.color,
        border: `1px solid ${conf.border}`,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        height: size === 'small' ? 22 : 28,
        letterSpacing: 0.5,
      }}
    />
  );
};
