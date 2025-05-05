import { cache, getCached, localDb, ParamsUtilities } from '@/utilities';
import { v4 as uuid } from 'uuid';
import { DetectionPayload, DetectionResult, SyncAreaPictureDetails } from './detection-types';

const baseUrl = process.env.REACT_APP_GEO_DETECTION_API ?? '';

const geoServerProperties = (address: string, emailReceiver: string): DetectionPayload => ({
  geoServerProperties: {
    geoServerUrl: 'http://35.181.83.111/geoserver/cite/wms',
    geoServerParameter: {
      service: 'WMS',
      request: 'GetMap',
      layers: null,
      styles: '',
      format: 'image/jpeg',
      transparent: true,
      version: '1.0.0',
      width: 1024,
      height: 1024,
      srs: 'EPSG:3857',
    },
  },
  detectableObjectModel: {
    modelName: 'BP_TOITURE',
  },
  emailReceiver,
  geoJsonZone: [
    {
      geometry: { coordinates: [], type: 'Feature' },
      properties: {
        additionalProp1: {},
      },
      type: 'Feature',
    },
  ],
  zoneName: address,
});

const createDetection = async (address: string, emailReceiver: string) => {
  const detectionId = uuid();
  cache.detectionId(detectionId);
  const { apiKey } = ParamsUtilities.getQueryParams();

  const body = geoServerProperties(address, emailReceiver);

  const result = await fetch(`${baseUrl}/detections/${detectionId}/sync`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-api-key': apiKey,
    },
  });

  return (await result.json()) as DetectionResult;
};

const getImageFromAddress = async (address: string) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const result = await fetch(`${baseUrl}/areaPictureDetails?address=${address}`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json', 'x-api-key': apiKey },
  });
  const { imageBase64 } = (await result.json()) as SyncAreaPictureDetails;
  await localDb.setImageSrc(imageBase64, { x: 0, y: 0 });
  return imageBase64;
};

const getImageAsBuffer = async (url: string) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const result = await fetch(url || '', { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  return await result.arrayBuffer();
};

const sendImageForDetection = async (image: File) => {
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

export const syncDetectionProvider = {
  createDetection,
  getImageFromAddress,
  getImageAsBuffer,
  sendImageForDetection,
};
