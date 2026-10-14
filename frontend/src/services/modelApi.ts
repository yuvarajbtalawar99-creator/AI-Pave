import { apiClient, API_BASE_URL } from './api';
import { ModelRegistryData, EvaluationData } from '../types';

export const modelApi = {
  getModels: async (): Promise<ModelRegistryData> => {
    const response = await apiClient.get<ModelRegistryData>('/models');
    return response.data;
  },

  getEvaluationData: async (): Promise<EvaluationData> => {
    const response = await apiClient.get<EvaluationData>('/evaluation');
    return response.data;
  },

  getChartUrl: (chartName: string): string => {
    return `${API_BASE_URL}/api/v1/evaluation/charts/${chartName}`;
  },
};
