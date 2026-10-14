import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export type StageName =
  | 'Uploading'
  | 'Preprocessing'
  | 'Detecting potholes'
  | 'Generating segmentation'
  | 'Estimating depth'
  | 'Calculating measurements'
  | 'Calculating severity'
  | 'Generating recommendations'
  | 'Complete';

interface LoadingStateProps {
  currentStage: StageName;
  percent: number;
}

const STAGES: StageName[] = [
  'Uploading',
  'Preprocessing',
  'Detecting potholes',
  'Generating segmentation',
  'Estimating depth',
  'Calculating measurements',
  'Calculating severity',
  'Generating recommendations',
  'Complete',
];

export const LoadingState: React.FC<LoadingStateProps> = ({ currentStage, percent }) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', maxWidth: 640, mx: 'auto', my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Executing Inspection Pipeline
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Processing media through neural vision, geometric, and depth estimation models...
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#0284c7' }}>
            {currentStage}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
            {Math.round(percent)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#f1f5f9',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#0284c7',
            },
          }}
        />
      </Box>

      {/* Stage Checklist */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 1.5 }}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex || currentStage === 'Complete';
          const isCurrent = idx === currentIndex && currentStage !== 'Complete';

          return (
            <Box
              key={stage}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.25,
                borderRadius: 1.5,
                backgroundColor: isCurrent ? '#f0f9ff' : 'transparent',
                border: isCurrent ? '1px solid #bae6fd' : '1px solid transparent',
              }}
            >
              {isDone ? (
                <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
              ) : isCurrent ? (
                <AutorenewIcon
                  sx={{
                    fontSize: 18,
                    color: '#0284c7',
                    animation: 'spin 1.5s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#cbd5e1' }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isCurrent ? 700 : isDone ? 500 : 400,
                  color: isCurrent ? '#0369a1' : isDone ? '#1e293b' : '#94a3b8',
                }}
              >
                {stage}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
