import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { MaintenanceSummary } from '../../types';

interface RecommendationPanelProps {
  summary?: MaintenanceSummary | null;
  overallCondition?: string;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  summary,
  overallCondition = 'Good',
}) => {
  const urgency = summary?.overall_urgency || 'Routine Monitoring';
  const actionItems = summary?.action_items || [];
  const disclaimer =
    summary?.disclaimer ||
    'AI-PAVE automated recommendations are deterministic decision-support heuristics and do not supersede mandatory in-person evaluation by a licensed pavement engineer or authorized municipal highway inspector.';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BuildIcon sx={{ color: '#0284c7' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Maintenance & Engineering Recommendations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`Overall Pavement: ${overallCondition}`}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor:
                overallCondition === 'Severely Damaged'
                  ? '#fef2f2'
                  : overallCondition === 'Poor'
                  ? '#fff7ed'
                  : '#f0fdf4',
              color:
                overallCondition === 'Severely Damaged'
                  ? '#b91c1c'
                  : overallCondition === 'Poor'
                  ? '#c2410c'
                  : '#15803d',
              border: '1px solid #cbd5e1',
            }}
          />
          <Chip
            label={`Urgency: ${urgency}`}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: '#0f172a',
              color: '#ffffff',
            }}
          />
        </Box>
      </Box>

      {/* Engineering Action Items */}
      {actionItems.length === 0 ? (
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No immediate maintenance actions required for this pavement section. Standard monitoring protocol active.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {actionItems.map((item, idx) => (
            <Card
              key={idx}
              elevation={0}
              sx={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 1.5,
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {item.category}
                    </Typography>
                    {item.target_pothole_ids && item.target_pothole_ids.length > 0 && (
                      <Chip
                        label={`Target: #${item.target_pothole_ids.join(', #')}`}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 18, backgroundColor: '#f1f5f9', color: '#475569' }}
                      />
                    )}
                  </Box>
                  <Chip
                    label={item.urgency}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      backgroundColor: item.urgency.includes('Immediate') ? '#fef2f2' : '#f0f9ff',
                      color: item.urgency.includes('Immediate') ? '#b91c1c' : '#0369a1',
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#334155', mb: 1 }}>
                  <strong>Inspection Protocol:</strong> {item.inspection_protocol}
                </Typography>

                <Typography variant="body2" sx={{ color: '#334155', mb: 1 }}>
                  <strong>Maintenance Procedure:</strong> {item.maintenance_procedure}
                </Typography>

                {item.preventive_measures && item.preventive_measures.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Recommended Preventive Actions:
                    </Typography>
                    <List dense disablePadding sx={{ mt: 0.5 }}>
                      {item.preventive_measures.map((prev, pIdx) => (
                        <ListItem key={pIdx} disableGutters sx={{ py: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 20, color: '#0284c7' }}>
                            <ArrowRightIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={prev}
                            slotProps={{
                              primary: { variant: 'caption', color: '#334155' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic', display: 'block' }}>
                  <strong>Engineering Rationale:</strong> {item.engineering_rationale}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Mandatory Engineering Disclaimer */}
      <Alert severity="warning" icon={<WarningAmberIcon fontSize="small" />} sx={{ mt: 3, fontSize: '0.75rem' }}>
        <strong>Mandatory Structural Disclaimer:</strong> {disclaimer}
      </Alert>
    </Paper>
  );
};
