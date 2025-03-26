import { cache, getCached } from '@/utilities';
import { GeojsonReturn } from '@bpartners/annotator-component';
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

export const processDetection = async ({ geometry }: GeojsonReturn, emailReceiver: string, geoDetectionApiKey: string, layers: string) => {
  const detectionId = v4();

  cache.detectionId(detectionId);

  const geoJson = {
    geoServerProperties: geoServerProperties(layers),
    emailReceiver,
    detectableObjectModel: {
      modelName: 'BP_ZAN',
      arbre: false,
      espaceVert: true,
      toiture: false,
      voieCarrosable: false,
      trottoir: true,
      parking: false,
    },
    geoJsonZone: [
      {
        geometry: {
          coordinates: geometry.coordinates,
          type: 'MultiPolygon',
        },
        id: v4(),
        zoom: 20,
      },
    ],
    zoneName: 'HOUSES_0',
  };

  const data = await fetch(`${baseUrl}/detections/${detectionId}/roofer`, {
    headers: { 'x-api-key': geoDetectionApiKey, 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(geoJson),
  });
  const result = await data.json();

  return { result, geoJson };
};

export const getDetectionResult = async (geoDetectionApiKey: string, geoJson: ReferencerGeoJSON) => {
  const detectionId = getCached.detectionId() ?? '';
  const data = await fetch(`${baseUrl}/detections/${detectionId}/roofer`, {
    headers: { 'x-api-key': geoDetectionApiKey, 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(geoJson),
  });
  const result = await data.json();

  if (!result.geoJsonUrl) throw new Error('Not done');

  return result;
};
