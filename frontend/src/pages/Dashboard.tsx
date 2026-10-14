import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';

import { MetricsCard } from '../components/MetricsCard/MetricsCard';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { SeverityBadge } from '../components/SeverityBadge/SeverityBadge';
import { analysisApi } from '../services/analysisApi';
import { DashboardStats, AnalysisListItem } from '../types';
import { formatLocalDate } from '../utils/dateUtils';

const SEVERITY_COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#0284c7',
  LOW: '#16a34a',
};

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      analysisApi.getDashboardStats(),
      analysisApi.listAnalyses(0, 5),
    ])
      .then(([statsData, analysesData]) => {
        if (!ignore) {
          setStats(statsData);
          setRecentAnalyses(analysesData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load dashboard data', err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={36} sx={{ color: '#0284c7' }} />
      </Box>
    );
  }

  if (!stats || !stats.has_data || stats.total_analyses === 0) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Inspection Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Real-time telemetry and defect analytics from roadway inspection surveys.
          </Typography>
        </Box>
        <EmptyState message="No analysis data available." actionText="Perform First Inspection" />
      </Box>
    );
  }

  // Format data for severity bar chart
  const severityChartData = [
    { name: 'Critical', count: stats.severity_distribution.CRITICAL || 0, key: 'CRITICAL' },
    { name: 'High', count: stats.severity_distribution.HIGH || 0, key: 'HIGH' },
    { name: 'Medium', count: stats.severity_distribution.MEDIUM || 0, key: 'MEDIUM' },
    { name: 'Low', count: stats.severity_distribution.LOW || 0, key: 'LOW' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Inspection Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Real-time telemetry and defect analytics from verified roadway surveys.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/analyze"
          variant="contained"
          size="medium"
          sx={{ backgroundColor: '#0284c7', px: 2.5 }}
        >
          New Analysis
        </Button>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Total Analyses"
            value={stats.total_analyses}
            subtitle="Completed inspection runs"
            icon={<AssignmentIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Total Potholes"
            value={stats.total_potholes_detected}
            subtitle="Detected defect instances"
            icon={<WarningIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="High Severity"
            value={stats.high_severity_potholes}
            subtitle="High & Critical priority"
            icon={<WarningIcon fontSize="small" sx={{ color: '#dc2626' }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Avg Confidence"
            value={`${(stats.average_confidence * 100).toFixed(1)}%`}
            subtitle="Mean neural detector score"
            icon={<SpeedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricsCard
            title="Avg Latency"
            value={`${Math.round(stats.average_processing_time_ms)} ms`}
            subtitle="End-to-end processing"
            icon={<TimerIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              Severity Distribution
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
              Breakdown of detected pavement depressions by severity tier.
            </Typography>
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {severityChartData.map((entry) => (
                      <Cell key={entry.key} fill={SEVERITY_COLORS[entry.key as keyof typeof SEVERITY_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              Inspection Chronology Trend
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
              Potholes identified across sequential road inspection batches.
            </Typography>
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.detection_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="potholes" stroke="#0284c7" strokeWidth={2} dot={{ r: 4, fill: '#0284c7' }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Analyses Table */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Recent Analyses
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Most recent image and video road inspection runs.
            </Typography>
          </Box>
          <Button component={Link} to="/history" endIcon={<ArrowForwardIcon fontSize="small" />} size="small">
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Analysis ID</TableCell>
                <TableCell>Source File</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Potholes Found</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Avg Confidence</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentAnalyses.map((a) => (
                <TableRow key={a.analysis_id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {a.analysis_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  <TableCell sx={{ color: '#0284c7', fontWeight: 600 }}>
                    {(a.average_confidence * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {formatLocalDate(a.created_at)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      to={`/results/${a.analysis_id}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem', py: 0.25 }}
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
