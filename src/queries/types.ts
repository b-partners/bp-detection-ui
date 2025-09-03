import { detectionResultColors } from '@/mappers';

export type DetectionResultInVgg = Record<string, DetectionResult>;

export interface DetectionResult {
  size: null;
  filename: string;
  base64_img_data: null;
  properties: Properties;
  regions: { [key: string]: Region };
}
export type AnnotationCoveringFromAnalyse = 'BATI_TUILES' | 'BATI_BETON' | 'BATI_ARDOISE' | 'BATI_AUTRES';

export interface Properties {
  usure_rate: number;
  global_rate_value: number;
  global_rate_type: string;
  moisissure_rate: number;
  humidite_rate: number;
  revetement_1: AnnotationCoveringFromAnalyse;
  revetement_2: AnnotationCoveringFromAnalyse;
}

export interface Region {
  shape_attributes: ShapeAttributes;
  region_attributes: RegionAttributes;
}

export interface RegionAttributes {
  label: keyof typeof detectionResultColors;
  confidence: null;
}

export interface ShapeAttributes {
  name: string;
  all_points_x: number[];
  all_points_y: number[];
}
