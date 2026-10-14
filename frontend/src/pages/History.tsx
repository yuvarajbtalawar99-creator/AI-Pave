import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { SeverityBadge } from '../components/SeverityBadge/SeverityBadge';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { analysisApi } from '../services/analysisApi';
import { AnalysisListItem } from '../types';
import { formatLocalDateTime } from '../utils/dateUtils';

export const History: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    let ignore = false;
    analysisApi
      .listAnalyses(0, 100)
      .then((data) => {
        if (!ignore) {
          setAnalyses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load analyses history', err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm(`Permanently remove inspection analysis ${id}?`)) {
      try {
        await analysisApi.deleteAnalysis(id);
        setAnalyses((prev) => prev.filter((a) => a.analysis_id !== id));
      } catch (err) {
        console.error('Failed to delete analysis record', err);
        alert('Failed to delete inspection record');
      }
    }
  };

  const filteredAnalyses = analyses.filter(
    (a) =>
      a.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.analysis_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.overall_condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={36} sx={{ color: '#0284c7' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Inspection History
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Log of previously analyzed road surface images and dashcam survey videos.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/analyze"
          variant="contained"
          size="medium"
          sx={{ backgroundColor: '#0284c7' }}
        >
          New Analysis
        </Button>
      </Box>

      {analyses.length === 0 ? (
        <EmptyState message="No analysis data available." actionText="Run Pothole Analysis" />
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          {/* Search bar */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <TextField
              size="small"
              placeholder="Filter by filename, condition, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: '100%', sm: 360 }, backgroundColor: '#ffffff' }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Media</TableCell>
                  <TableCell>Filename</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Potholes</TableCell>
                  <TableCell>Road Condition</TableCell>
                  <TableCell>High Severity</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAnalyses.map((a) => (
                  <TableRow key={a.analysis_id} hover>
                    <TableCell sx={{ width: 60 }}>
                      {a.thumbnail_url ? (
                        <Box
                          component="img"
                          src={analysisApi.getMediaUrl(a.thumbnail_url)}
                          alt="Thumbnail"
                          sx={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 1, border: '1px solid #e2e8f0' }}
                        />
                      ) : (
                        <Box sx={{ width: 48, height: 32, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.file_name}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={a.file_type.toUpperCase()}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 20, backgroundColor: '#f1f5f9' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: a.pothole_count > 0 ? '#ea580c' : '#16a34a' }}>
                      {a.pothole_count}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge
                        severity={
                          a.overall_condition === 'Severely Damaged'
                            ? 'CRITICAL'
                            : a.overall_condition === 'Poor'
                            ? 'HIGH'
                            : a.overall_condition === 'Fair'
                            ? 'MEDIUM'
                            : 'LOW'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: a.high_severity_count > 0 ? '#dc2626' : '#64748b' }}>
                      {a.high_severity_count}
                    </TableCell>
                    <TableCell sx={{ color: '#0284c7', fontWeight: 600 }}>
                      {(a.average_confidence * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {formatLocalDateTime(a.created_at)}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <IconButton
                          component="a"
                          href={analysisApi.getPdfReportUrl(a.analysis_id)}
                          target="_blank"
                          download
                          size="small"
                          sx={{ color: '#64748b' }}
                          title="Download PDF"
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={`/results/${a.analysis_id}`}
                          size="small"
                          sx={{ color: '#0284c7' }}
                          title="View Details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(a.analysis_id)}
                          sx={{ color: '#94a3b8', '&:hover': { color: '#dc2626' } }}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};
