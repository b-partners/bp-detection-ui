import { detectionResultColors } from '@/mappers';

export type DetectionResultInVgg = Record<string, DetectionResult>;

type SlopeAndHeightStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'EXTRACTION_ERROR';

export interface DetectionResult {
  size: null;
  filename: string;
  base64_img_data: null;
  properties: Properties;
  regions: { [key: string]: Region };
}
export type AnnotationCoveringFromAnalyse =
  | 'ROOF_ARDOISE'
  | 'ROOF_ASPHALTE_BITUME'
  | 'ROOF_BAC_ACIER'
  | 'ROOF_BETON_BRUT'
  | 'ROOF_FIBRO_CIMENT'
  | 'ROOF_GRAVIER'
  | 'ROOF_MEMBRANE_SYNTHETIQUE'
  | 'ROOF_TOLE_ONDULEE'
  | 'ROOF_TUILES'
  | 'ROOF_ZINC';

export interface Properties {
  usure_rate: number;
  global_rate_value: number;
  global_rate_type: string;
  moisissure_rate: number;
  humidite_rate: number;
  roof_area_in_m2: number;
  revetement_1: AnnotationCoveringFromAnalyse;
  revetement_2: AnnotationCoveringFromAnalyse;
  roof_height_data_status: SlopeAndHeightStatus;
  roof_slope_data_status: SlopeAndHeightStatus;
  roof_slope_in_degrees: number;
  roof_height_in_meters: number;
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
