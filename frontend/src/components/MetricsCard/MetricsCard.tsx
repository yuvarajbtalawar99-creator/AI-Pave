import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
}) => {
  return (
    <Card elevation={0} sx={{ height: '100%', backgroundColor: '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ color: '#0284c7', backgroundColor: '#f0f9ff', p: 0.75, borderRadius: 1.5, display: 'flex' }}>
              {icon}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: -0.5 }}>
            {value}
          </Typography>
          {badge}
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
