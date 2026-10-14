import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  TextField,
  Paper,
  Grid,
  Divider,
  Alert,
  Collapse,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TuneIcon from '@mui/icons-material/Tune';
import StraightenIcon from '@mui/icons-material/Straighten';

interface ImageUploaderProps {
  onAnalyze: (file: File, options: {
    confThreshold: number;
    iouThreshold: number;
    calibrationScale?: number | null;
  }) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, disabled = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{
    width?: number;
    height?: number;
    duration?: number;
    sizeMB: string;
  } | null>(null);

  // Settings
  const [confThreshold, setConfThreshold] = useState<number>(0.25);
  const [iouThreshold, setIouThreshold] = useState<number>(0.45);
  const [enableCalibration, setEnableCalibration] = useState<boolean>(false);
  const [scaleFactor, setScaleFactor] = useState<string>('0.5'); // cm per px

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          setFileMeta({ width: img.naturalWidth, height: img.naturalHeight, sizeMB });
        };
        img.src = url;
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          setFileMeta({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: Math.round(video.duration),
            sizeMB,
          });
        };
        video.src = url;
      } else {
        setFileMeta({ sizeMB });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov'],
    },
    maxFiles: 1,
    disabled,
  });

  const handleStartAnalysis = () => {
    if (!selectedFile) return;
    const calScale = enableCalibration && parseFloat(scaleFactor) > 0 ? parseFloat(scaleFactor) : null;
    onAnalyze(selectedFile, {
      confThreshold,
      iouThreshold,
      calibrationScale: calScale,
    });
  };

  return (
    <Box>
      {/* Dropzone Surface */}
      <Paper
        {...getRootProps()}
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f9ff' : '#ffffff',
          border: isDragActive ? '2px dashed #0284c7' : '2px dashed #cbd5e1',
          borderRadius: 2.5,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: disabled ? '#cbd5e1' : '#0284c7',
            backgroundColor: disabled ? '#ffffff' : '#f8fafc',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ color: isDragActive ? '#0284c7' : '#64748b', mb: 2 }}>
          <CloudUploadIcon sx={{ fontSize: 56 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          {isDragActive ? 'Drop road inspection file here' : 'Drag & drop road image or video'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          Supports high-resolution JPG, PNG, WEBP, and MP4/AVI dashcam video
        </Typography>
        <Button variant="outlined" size="small" disabled={disabled} sx={{ borderColor: '#cbd5e1', color: '#334155' }}>
          Browse Files
        </Button>
      </Paper>

      {/* Selected File Details & Preview */}
      {selectedFile && (
        <Paper elevation={0} sx={{ mt: 3, p: 3, border: '1px solid #e2e8f0', borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              {previewUrl && selectedFile.type.startsWith('image/') ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Upload preview"
                  sx={{ width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                />
              ) : previewUrl && selectedFile.type.startsWith('video/') ? (
                <Box
                  component="video"
                  src={previewUrl}
                  controls
                  sx={{ width: '100%', maxHeight: 180, borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>
                {selectedFile.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  <strong>Size:</strong> {fileMeta?.sizeMB || 'Calculating...'}
                </Typography>
                {fileMeta?.width && fileMeta?.height && (
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    <strong>Dimensions:</strong> {fileMeta.width} × {fileMeta.height} px
                  </Typography>
                )}
                {fileMeta?.duration && (
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    <strong>Duration:</strong> {fileMeta.duration}s
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  <strong>Type:</strong> {selectedFile.type.startsWith('video/') ? 'Video (Frame Tracking)' : 'Single RGB Frame'}
                </Typography>
              </Box>

              {/* Advanced Threshold Controls */}
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 1.5, border: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TuneIcon fontSize="small" sx={{ color: '#0284c7' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                    Inference Hyperparameters
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                      Confidence Threshold: {confThreshold}
                    </Typography>
                    <Slider
                      value={confThreshold}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      onChange={(_, val) => setConfThreshold(val as number)}
                      size="small"
                      sx={{ color: '#0284c7' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                      IoU NMS Threshold: {iouThreshold}
                    </Typography>
                    <Slider
                      value={iouThreshold}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      onChange={(_, val) => setIouThreshold(val as number)}
                      size="small"
                      sx={{ color: '#0284c7' }}
                    />
                  </Grid>
                </Grid>

                {/* Optional Calibration Module */}
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StraightenIcon fontSize="small" sx={{ color: '#64748b' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                      Optional Camera Calibration / Known Reference Scale
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={enableCalibration}
                        onChange={(e) => setEnableCalibration(e.target.checked)}
                      />
                    }
                    label={<Typography variant="caption">{enableCalibration ? 'Enabled' : 'Disabled'}</Typography>}
                  />
                </Box>

                <Collapse in={enableCalibration}>
                  <Box sx={{ mt: 1.5 }}>
                    <Alert severity="info" sx={{ py: 0.5, fontSize: '0.75rem', mb: 1.5 }}>
                      When calibration is provided, physical dimensions (meters/cm) are calculated. If disabled,
                      AI-PAVE strictly marks dimensions as "Requires calibration" or "Relative estimate".
                    </Alert>
                    <TextField
                      label="Physical Scale Factor (cm per pixel)"
                      size="small"
                      type="number"
                      value={scaleFactor}
                      onChange={(e) => setScaleFactor(e.target.value)}
                      helperText="e.g., 0.5 cm/px based on known 20cm road stripe or reference marker"
                      sx={{ width: 320 }}
                    />
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setFileMeta(null);
                  }}
                  disabled={disabled}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleStartAnalysis}
                  disabled={disabled}
                  sx={{ backgroundColor: '#0284c7', px: 4 }}
                >
                  Analyze Road Surface
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};
