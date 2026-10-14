import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader/ImageUploader';
import { LoadingState, StageName } from '../components/LoadingState/LoadingState';
import { analysisApi } from '../services/analysisApi';

export const Analyze: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<StageName>('Uploading');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartAnalysis = async (file: File, options: {
    confThreshold: number;
    iouThreshold: number;
    calibrationScale?: number | null;
  }) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentStage('Uploading');
    setProgressPercent(15);

    try {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|avi|mov)$/i.test(file.name);

      // Transition stages in coordination with real upload progress
      const onProgress = (e: any) => {
        if (e.total && e.total > 0) {
          const percent = Math.round((e.loaded * 40) / e.total);
          setProgressPercent(percent);
          if (percent > 30) {
            setCurrentStage('Preprocessing');
          }
        }
      };

      // Mid-stage simulation while backend is computing
      const stageTimer = setTimeout(() => {
        setCurrentStage('Detecting potholes');
        setProgressPercent(50);
      }, 800);

      const stageTimer2 = setTimeout(() => {
        setCurrentStage('Generating segmentation');
        setProgressPercent(65);
      }, 1600);

      const stageTimer3 = setTimeout(() => {
        setCurrentStage('Estimating depth');
        setProgressPercent(80);
      }, 2400);

      const stageTimer4 = setTimeout(() => {
        setCurrentStage('Calculating severity');
        setProgressPercent(92);
      }, 3000);

      let result;
      if (isVideo) {
        result = await analysisApi.analyzeVideo(
          file,
          options.confThreshold,
          options.iouThreshold,
          2,
          onProgress
        );
      } else {
        result = await analysisApi.analyzeImage(
          file,
          options.confThreshold,
          options.iouThreshold,
          options.calibrationScale,
          onProgress
        );
      }

      clearTimeout(stageTimer);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(stageTimer4);

      setCurrentStage('Complete');
      setProgressPercent(100);

      // Open result page
      setTimeout(() => {
        navigate(`/results/${result.analysis_id}`);
      }, 600);
    } catch (err: any) {
      console.error('Analysis execution failed', err);
      setErrorMsg(
        err.response?.data?.detail || err.message || 'An error occurred while executing the inspection pipeline.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Execute Pavement Inspection
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Upload high-resolution asphalt imagery or dashcam video to detect potholes, extract polygon masks,
          estimate depth gradients, and formulate structural recommendations.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {isProcessing ? (
        <LoadingState currentStage={currentStage} percent={progressPercent} />
      ) : (
        <ImageUploader onAnalyze={handleStartAnalysis} disabled={isProcessing} />
      )}
    </Box>
  );
};
