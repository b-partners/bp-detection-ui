import axios from 'axios';

export interface ConverterPayloadGeoJSON {
  properties: Properties;
  type: string;
  filename: string;
  x_tile: number;
  y_tile: number;
  geometry: Geometry;
  region_attributes: RegionAttributes;
  image_size: number;
  zoom: number;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<Array<number[]>>>;
}

export interface Properties {
  id: string;
}

export interface RegionAttributes {
  label: string;
}

export interface ConverterResultGeoJSON {
  filename: string;
  regions: Record<string, Region>;
  image_size: number;
  zoom: number;
  region_attributes: RegionAttributes;
  x_tile: number;
  y_tile: number;
}

export interface RegionAttributes {
  label: string;
}

export interface Region {
  id: string;
  shape_attributes: ShapeAttributes;
}

export interface ShapeAttributes {
  all_points_x: number[];
  all_points_y: number[];
  name: string;
}

export const coordinatesToPixel = async (geojson: ConverterPayloadGeoJSON): Promise<ConverterResultGeoJSON[]> => {
  const { data } = await axios.post(`${process.env.REACT_APP_ANNOTATOR_PIXEL_CONVERTER_API_URL}/converter`, geojson);
  return data;
};
