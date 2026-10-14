import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import { analysisApi } from '../../services/analysisApi';

interface VideoPlayerProps {
  videoUrl: string;
  frameCount?: number;
  fps?: number;
  duration?: number;
  trackedCount?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  frameCount,
  fps,
  duration,
  trackedCount,
}) => {
  const fullUrl = analysisApi.getMediaUrl(videoUrl);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideocamIcon sx={{ color: '#0284c7' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Annotated Tracking Video
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {trackedCount !== undefined && (
            <Chip
              label={`${trackedCount} Unique Potholes Tracked`}
              size="small"
              sx={{ fontWeight: 700, backgroundColor: '#f0f9ff', color: '#0284c7' }}
            />
          )}
          {fps && (
            <Chip
              label={`${fps} FPS`}
              size="small"
              sx={{ fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569' }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: '#0f172a',
          borderRadius: 1.5,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          component="video"
          src={fullUrl}
          controls
          playsInline
          sx={{
            width: '100%',
            maxHeight: 520,
            display: 'block',
          }}
        />
      </Box>

      {duration !== undefined && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            <strong>Duration:</strong> {duration}s ({frameCount || 0} frames)
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Multi-Object Tracking Algorithm: ByteTrack-Compatible IoU Association
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
