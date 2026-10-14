import { apiClient, API_BASE_URL } from './api';
import { AnalysisResponse, AnalysisListItem, DashboardStats } from '../types';

export const analysisApi = {
  analyzeImage: async (
    file: File,
    confThreshold: number = 0.25,
    iouThreshold: number = 0.45,
    calibrationScale?: number | null,
    onProgress?: (progressEvent: any) => void
  ): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence_threshold', confThreshold.toString());
    formData.append('iou_threshold', iouThreshold.toString());
    if (calibrationScale) {
      formData.append('calibration_scale_cm_per_px', calibrationScale.toString());
    }

    const response = await apiClient.post<AnalysisResponse>('/analyze/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
    return response.data;
  },

  analyzeVideo: async (
    file: File,
    confThreshold: number = 0.25,
    iouThreshold: number = 0.45,
    frameStride: number = 2,
    onProgress?: (progressEvent: any) => void
  ): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence_threshold', confThreshold.toString());
    formData.append('iou_threshold', iouThreshold.toString());
    formData.append('frame_stride', frameStride.toString());

    const response = await apiClient.post<AnalysisResponse>('/analyze/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
    return response.data;
  },

  getAnalysis: async (id: string): Promise<AnalysisResponse> => {
    const response = await apiClient.get<AnalysisResponse>(`/analysis/${id}`);
    return response.data;
  },

  listAnalyses: async (skip: number = 0, limit: number = 50): Promise<AnalysisListItem[]> => {
    const response = await apiClient.get<AnalysisListItem[]>('/analyses', {
      params: { skip, limit },
    });
    return response.data;
  },

  deleteAnalysis: async (id: string): Promise<void> => {
    await apiClient.delete(`/analysis/${id}`);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getMediaUrl: (relativeUrl: string | undefined): string => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${API_BASE_URL}${relativeUrl}`;
  },

  getPdfReportUrl: (analysisId: string): string => {
    return `${API_BASE_URL}/api/v1/analysis/${analysisId}/report.pdf`;
  },
};
