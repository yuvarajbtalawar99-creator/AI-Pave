import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import { Pothole } from '../../types';
import { SeverityBadge } from '../SeverityBadge/SeverityBadge';

interface ResultTableProps {
  potholes: Pothole[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
}

export const ResultTable: React.FC<ResultTableProps> = ({
  potholes,
  selectedId,
  onSelect,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Confidence</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Estimated Width</TableCell>
            <TableCell>Estimated Length</TableCell>
            <TableCell>Surface Area</TableCell>
            <TableCell>Estimated Depth</TableCell>
            <TableCell>Possible Factors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {potholes.map((p) => {
            const isSelected = selectedId === p.pothole_id;
            return (
              <TableRow
                key={p.pothole_id}
                onClick={() => onSelect(p.pothole_id)}
                hover
                sx={{
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#f0f9ff' : 'inherit',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>
                  #{p.pothole_id}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0284c7' }}>
                  {(p.confidence * 100).toFixed(1)}%
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={p.severity} size="small" />
                </TableCell>
                <TableCell>
                  <Tooltip title={p.is_calibrated ? 'Calibrated physical measurement' : 'Pixel measurement (Requires calibration)'}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {p.display_width || 'Not available'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={p.is_calibrated ? 'Calibrated physical measurement' : 'Pixel measurement (Requires calibration)'}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {p.display_length || 'Not available'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                    {p.display_area || 'Not available'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#475569' }}>
                    {p.display_depth || 'Not available'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {p.possible_factors && p.possible_factors.length > 0 ? (
                      p.possible_factors.map((factor, idx) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{
                            backgroundColor: '#f1f5f9',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            color: '#334155',
                            fontSize: '0.7rem',
                            display: 'inline-block',
                          }}
                        >
                          {factor}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        None identified
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
