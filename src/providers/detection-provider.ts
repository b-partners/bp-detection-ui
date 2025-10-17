import { cache, getCached, ParamsUtilities } from '@/utilities';
import { v4 } from 'uuid';
import { RooferInformations } from './type';

const baseUrl = (process.env.REACT_APP_GEO_DETECTION_API ?? '').replace(/\/$/g, '');

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

const getGeoJsonTemlate = (layers: string, zoneName: string, emailReceiver?: string, geoJsonZone?: any) => {
  return {
    needsImageOutput: true,
    geoServerProperties: geoServerProperties(layers),
    emailReceiver,
    detectableObjectModel: {
      modelName: 'BP_TOITURE',
    },
    geoJsonZone,
    zoneName,
    geoJsonDelimitationType: 'ROOF',
  };
};

export const processDetection = async (layers: string, address: string, coordinates?: Array<Array<Array<number>>>, emailReceiver?: string) => {
  const detectionId = v4();
  const { apiKey } = ParamsUtilities.getQueryParams();
  cache.detectionId(detectionId);

  const geoJson = getGeoJsonTemlate(
    layers,
    address,
    emailReceiver,
    coordinates
      ? [
          {
            geometry: {
              coordinates,
              type: 'Polygon',
            },
            properties: {
              zoom: 20,
              id: v4(),
            },
            type: 'Feature',
          },
        ]
      : []
  );

  let url = `${baseUrl}/detections/${detectionId}/sync`;
  const data = await fetch(url, {
    headers: { 'x-api-key': apiKey || '', 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(geoJson),
  });

  const throwRooferError = () => {
    const error = new Error('Roofer error');
    error.name = data.statusText;
    throw error;
  };

  if (data.status !== 200 && data.status !== 400 && data.status !== 501 && data.status !== 403) throwRooferError();

  const result = await data.json();

  if (data.status === 403 && result?.message?.includes('Some given feature is not allowed for your community.name')) throw new Error('featureNotAllowed');
  if (
    data.status === 400 &&
    result?.message?.includes('Roof analysis consumption ') &&
    result?.message?.includes(' limit exceeded for free trial period for User.id=')
  ) {
    throw new Error('detectionLimitExceeded');
  }

  if (result?.message?.includes('Provided geojson polygon is too large to be processed synchronously')) throw new Error('polygonTooBig');
  if (data.status !== 200) throwRooferError();

  return { result, geoJson };
};

export const getDetectionResult = async (apiKey: string) => {
  const detectionId = getCached.detectionId() ?? '';
  const data = await fetch(`${baseUrl}/detections/${detectionId}`, {
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    method: 'GET',
  });
  const result = await data.json();

  if (!result.geoJsonZone[0]?.properties?.vgg_file_url) throw new Error('Not done');

  return result;
};

export const initiateRoofProperties = async (apiKey: string) => {
  const detectionId = getCached.detectionId() ?? '';
  const result = await fetch(`${baseUrl}/detections/${detectionId}/roofs/properties`, {
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    method: 'PUT',
  });
  const data = await result.json();

  if (result.status !== 200) throw new Error('Not done');
  cache.isRoofPropertiesRequestDone(true);
  return data;
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

export const sendPdfToMail = async (pdf: File) => {
  const detectionId = getCached.detectionId();
  const { apiKey } = ParamsUtilities.getQueryParams();
  const result = await fetch(`${baseUrl}/detections/${detectionId}/pdf`, {
    method: 'POST',
    body: pdf,
    headers: {
      'x-api-key': apiKey,
      'content-type': pdf.type,
    },
  });

  return await result.json();
};

export const sendRooferInformationsToMail = async (info: RooferInformations) => {
  const detectionId = getCached.detectionId();
  const { apiKey } = ParamsUtilities.getQueryParams();
  const result = await fetch(`${baseUrl}/detections/${detectionId}/roofer/email`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
    },
  });

  return await result.json();
};
