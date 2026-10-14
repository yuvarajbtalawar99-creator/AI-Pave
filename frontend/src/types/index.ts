export interface Pothole {
  analysis_id: string;
  pothole_id: number;
  confidence: number;
  bbox: number[]; // [x1, y1, x2, y2]
  polygon?: number[][]; // [[x, y], ...]
  area_pixels: number;
  perimeter_pixels: number;
  width_pixels: number;
  length_pixels: number;
  aspect_ratio: number;
  circularity: number;
  centroid: number[];
  bounding_box_area: number;
  mask_area_ratio: number;
  road_area_ratio_pct: number;
  is_calibrated: boolean;
  physical_area_m2?: number | null;
  physical_width_m?: number | null;
  physical_length_m?: number | null;
  physical_depth_m?: number | null;
  display_area: string;
  display_width: string;
  display_length: string;
  display_depth: string;
  depth_status: string;
  relative_depth_index: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_level: string;
  severity_score: number;
  possible_factors: string[];
  recommendations: string[];
  explainability?: Record<string, any>;
}

export interface RecommendationItem {
  category: string;
  urgency: string;
  inspection_protocol: string;
  maintenance_procedure: string;
  preventive_measures: string[];
  engineering_rationale: string;
  target_pothole_ids: number[];
}

export interface MaintenanceSummary {
  overall_urgency: string;
  action_items: RecommendationItem[];
  disclaimer: string;
}

export interface CalibrationData {
  is_calibrated: boolean;
  pixel_scale_factor?: number | null;
  camera_height_m?: number | null;
  camera_tilt_deg?: number | null;
}

export interface AnalysisResponse {
  analysis_id: string;
  file_name: string;
  file_type: 'image' | 'video';
  model_version: string;
  created_at: string;
  processing_time_ms: number;
  original_media_url: string;
  annotated_media_url?: string;
  detection_media_url?: string;
  segmentation_media_url?: string;
  depth_media_url?: string;
  report_pdf_url?: string;
  media_dimensions: number[];
  frame_count?: number;
  fps?: number;
  duration_seconds?: number;
  pothole_count: number;
  overall_condition: 'Good' | 'Fair' | 'Poor' | 'Severely Damaged';
  road_condition_source: string;
  severity_breakdown: Record<string, number>;
  average_confidence: number;
  potholes: Pothole[];
  recommendations: MaintenanceSummary;
  calibration?: CalibrationData;
  tracking_metadata?: Record<string, any>;
  evaluation?: AnalysisEvaluation;
}

export interface AnalysisEvaluationMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  detection_iou: number;
  dice_score: number;
  mask_iou: number;
  depression_index: number;
  severity_score: number;
  inference_time_ms: number;
  fps: number;
}

export interface FeatureBreakdownItem {
  feature: string;
  score: number;
  weight: string;
}

export interface AnalysisEvaluation {
  metrics: AnalysisEvaluationMetrics;
  feature_breakdown: FeatureBreakdownItem[];
  charts: {
    confusion_matrix_url: string;
    pr_curve_url: string;
    feature_plot_url?: string;
  };
}

export interface AnalysisListItem {
  analysis_id: string;
  file_name: string;
  file_type: 'image' | 'video';
  model_version: string;
  created_at: string;
  processing_time_ms: number;
  pothole_count: number;
  overall_condition: string;
  high_severity_count: number;
  average_confidence: number;
  thumbnail_url?: string;
}

export interface DashboardStats {
  total_analyses: number;
  total_potholes_detected: number;
  high_severity_potholes: number;
  average_confidence: number;
  average_processing_time_ms: number;
  severity_distribution: Record<string, number>;
  detection_trend: Array<{ date: string; potholes: number; severity_score: number }>;
  has_data: boolean;
}

export interface ModelRegistryData {
  active_models: Record<string, any>;
  available_models: Array<{
    id: string;
    type: string;
    name: string;
    mAP50?: number;
    speed_ms?: number;
    weights_path: string;
  }>;
  latest_training_metadata?: Record<string, any>;
}

export interface EvaluationData {
  evaluation_metrics: {
    dataset?: string;
    dataset_size?: number;
    test_images_count?: number;
    model_version?: string;
    evaluation_timestamp?: string;
    metrics?: {
      precision: number;
      recall: number;
      f1_score: number;
      mAP50: number;
      mAP50_95: number;
      detection_iou: number;
      mask_iou: number;
      dice_score: number;
      mask_precision: number;
      mask_recall: number;
      inference_time_ms: number;
      fps: number;
    };
    counts?: {
      true_positives: number;
      false_positives: number;
      false_negatives: number;
      total_ground_truth: number;
      total_predictions: number;
    };
    confusion_matrix?: {
      matrix: number[][];
      labels: string[];
    };
  };
  dataset_integrity?: Record<string, any>;
  error_analysis?: {
    false_positives?: any[];
    false_negatives?: any[];
    low_confidence_detections?: any[];
    small_potholes?: any[];
    dark_potholes?: any[];
  };
  charts?: {
    confusion_matrix_url: string;
    pr_curve_url: string;
  };
}
