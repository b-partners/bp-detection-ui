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
