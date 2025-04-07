import { GeometryReturn } from '@bpartners/annotator-component';

export interface ReferencerGeoJSON {
  emailReceiver: string;
  zoneName: string;
  geoServerProperties: GeoServerProperties;
  detectableObjectModel: DetectableObjectModel;
  geoJsonZone: GeoJSONZone[];
}

export interface DetectableObjectModel {
  modelName: string;
  toitureRevetement: boolean;
  arbre: boolean;
  velux: boolean;
  panneauPhotovoltaique: boolean;
  moisissure: boolean;
  usure: boolean;
  fissureCassure: boolean;
  obstacle: boolean;
  cheminee: boolean;
  humidite: boolean;
  risqueFeu: boolean;
}

export interface GeoJSONZone {
  id: string;
  zoom: number;
  geometry: GeometryReturn;
}

export interface GeoServerProperties {
  geoServerUrl: string;
  geoServerParameter: GeoServerParameter;
}

export interface GeoServerParameter {
  service: string;
  request: string;
  layers: string;
  styles: string;
  format: string;
  transparent: boolean;
  version: string;
  width: number;
  height: number;
  srs: string;
}


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

export interface Region {
  id: string;
  shape_attributes: ShapeAttributes;
}

export interface ShapeAttributes {
  all_points_x: number[];
  all_points_y: number[];
  name: string;
}
