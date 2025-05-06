export interface DetectionResult {
  emailReceiver: string;
  zoneName: string;
  geoServerProperties: GeoServerProperties;
  detectableObjectModel: DetectableObjectModel;
  geoJsonZone: GeoJSONZone[];
  id: string;
  step: Step;
  geoJsonUrl: string;
  shapeUrl: string;
  excelUrl: string;
  imageUrl: string;
  pdfUrl: string;
  addresses: string[];
  roofDelimiter: RoofDelimiter;
}

interface DetectableObjectModel {
  modelName: string;
}

interface GeoJSONZone {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  additionalProp1: AdditionalProp1;
}

interface AdditionalProp1 {}

interface GeoServerProperties {
  geoServerUrl: string;
  geoServerParameter: GeoServerParameter;
}

interface GeoServerParameter {
  service: string;
  request: string;
  layers: string | null;
  styles: string;
  format: string;
  transparent: boolean;
  version: string;
  width: number;
  height: number;
  srs: string;
}

interface RoofDelimiter {
  polygon: Array<number[]>;
}

interface Step {
  name: string;
  status: Status;
  statistics: Statistic[];
  updatedAt: Date;
}

interface Statistic {
  progression: string;
  healthStatistics: HealthStatistic[];
}

interface HealthStatistic {
  health: string;
  count: number;
}

interface Status {
  progression: string;
  health: string;
  creationDatetime: Date;
}

export interface DetectionPayload {
  emailReceiver: string;
  zoneName: string;
  geoServerProperties: GeoServerProperties;
  detectableObjectModel: DetectableObjectModel;
  geoJsonZone: GeoJSONZone[];
}

export interface SyncAreaPictureDetails {
  address: string;
  imageBase64: string;
}

export interface RoofDelimiterPolygon {
  polygon: [number, number][];
}
