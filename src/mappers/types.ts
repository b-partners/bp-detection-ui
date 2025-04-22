import { ShapeAttributes } from "@/providers";

export type GeoCoordinates = Array<Array<Array<number[]>>>;

export interface Feature {
  type: 'Feature';
  properties: {
    confidence: number;
    label: string;
  };
  geometry: {
    type: 'MultiPolygon';
    coordinates: GeoCoordinates;
  };
}

export interface GeoJson {
  features: Feature[];
  type: 'FeatureCollection';
}

export interface ConverterPayload {
  size: number;
  filename: string;
  zoom: number;
  regions: Record<
    string,
    {
      shape_attributes: ShapeAttributes;
      region_attributes: {
        label: string;
        confidence: number;
      };
    }
  >;
  base64_img_data: any;
}
