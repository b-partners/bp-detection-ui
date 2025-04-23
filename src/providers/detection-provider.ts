import { cache, getCached, ParamsUtilities } from '@/utilities';
import { v4 } from 'uuid';
import { ReferencerGeoJSON } from './type';

const baseUrl = process.env.REACT_APP_GEO_DETECTION_API ?? '';

const geoServerProperties = (layers: string) => ({
  geoServerUrl: 'http://35.181.83.111/geoserver/cite/wms',
  geoServerParameter: {
    service: 'WMS',
    request: 'GetMap',
    layers,
    styles: '',
    format: 'image/jpeg',
    transparent: true,
    version: '1.0.0',
    width: 1024,
    height: 1024,
    srs: 'EPSG:3857',
  },
});

const getGeoJsonTemlate = (layers: string, emailReceiver?: string, geoJsonZone?: any) => {
  return {
    geoServerProperties: geoServerProperties(layers),
    emailReceiver,
    detectableObjectModel: {
      modelName: 'BP_TOITURE',
      toitureRevetement: false,
      arbre: false,
      velux: true,
      panneauPhotovoltaique: false,
      moisissure: true,
      usure: true,
      fissureCassure: false,
      obstacle: true,
      cheminee: false,
      humidite: true,
      risqueFeu: false,
    },
    geoJsonZone,
    zoneName: 'HOUSES_0',
  };
};

export const processDetection = async (layers: string, coordinates?: Array<Array<Array<Array<number>>>>, emailReceiver?: string) => {
  const cachedDetectionId = getCached.detectionId();
  const detectionId = cachedDetectionId || v4();
  const { apiKey } = ParamsUtilities.getQueryParams();
  cache.detectionId(detectionId);

  const geoJson = getGeoJsonTemlate(
    layers,
    emailReceiver,
    coordinates
      ? [
          {
            geometry: {
              coordinates,
              type: 'MultiPolygon',
            },
            id: v4(),
            zoom: 21,
          },
        ]
      : []
  );

  const data = await fetch(`${baseUrl}/detections/${detectionId}/roofer`, {
    headers: { 'x-api-key': apiKey || '', 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(geoJson),
  });
  const result = await data.json();

  return { result, geoJson };
};

export const getDetectionResult = async (apiKey: string, geoJson: ReferencerGeoJSON) => {
  const detectionId = getCached.detectionId() ?? '';
  const data = await fetch(`${baseUrl}/detections/${detectionId}/roofer`, {
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(geoJson),
  });
  const result = await data.json();

  if (!result.geoJsonUrl) throw new Error('Not done');

  return result;
};

export const sendImageToDetect = async (image: File) => {
  const detectionId = getCached.detectionId();
  const { apiKey } = ParamsUtilities.getQueryParams();
  const result = await fetch(`${baseUrl}/detections/${detectionId}/image`, {
    method: 'POST',
    body: image,
    headers: {
      'x-api-key': apiKey,
      'content-type': image.type,
    },
  });

  return await result.json();
};
