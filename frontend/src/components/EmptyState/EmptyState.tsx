import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  message?: string;
  actionText?: string;
  actionPath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No analysis data available.',
  actionText = 'Start New Inspection',
  actionPath = '/analyze',
}) => {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        backgroundColor: '#ffffff',
        border: '1px dashed #cbd5e1',
        borderRadius: 2,
        my: 2,
      }}
    >
      <Box sx={{ color: '#94a3b8', mb: 2 }}>
        <InboxOutlinedIcon sx={{ fontSize: 48 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
        {message}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mb: 3, maxWidth: 400, mx: 'auto' }}>
        Upload a road surface image or dashcam video to run the AI-PAVE inspection and recommendation engine.
      </Typography>
      {actionPath && (
        <Button
          component={Link}
          to={actionPath}
          variant="contained"
          size="medium"
          sx={{ backgroundColor: '#0284c7' }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};
