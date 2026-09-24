import { ParamsUtilities, wait } from '@/utilities';

const baseUrl = (process.env.REACT_APP_GEO_DETECTION_API ?? '').replace(/\/$/g, '');

// The CityJSON shape is large and mostly opaque to this app (it is only ever parsed by
// the three.js renderer) — keep it untyped here rather than modelling every field.
export type CityJSONData = any;

export interface CityJsonFileUrl {
  id: string;
  url: string;
}

export enum ProgressionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
}

export enum HealthStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  UNKNOWN = 'UNKNOWN',
  RETRYING = 'RETRYING',
}

export interface ThreeDResponseStatus {
  id: string;
  step: string;
  status: {
    progression: ProgressionStatus;
    health: HealthStatus;
  };
  delimitations: object[];
  cityJsonFileUrls: CityJsonFileUrl[];
}

interface ProcessCityJSONRequestParams {
  id: string;
  roofDelimiter: [number, number][][];
  imageUrl?: string;
  tileX?: number;
  tileY?: number;
  tileImageSizePx?: number;
  imageWidth?: number;
  imageHeight?: number;
  zoom?: number;
}

const retryUntilReady = async <T>(params: {
  fetcher: () => Promise<T>;
  isReady: (result: T) => boolean;
  maxAttemps: number;
  sleepDelay: number;
  signal?: AbortSignal;
}): Promise<T> => {
  const { fetcher, isReady, maxAttemps, sleepDelay, signal } = params;
  for (let attempt = 0; attempt < maxAttemps; attempt++) {
    if (signal?.aborted) throw new Error('AbortError');
    const result = await fetcher();
    if (isReady(result)) return result;
    await wait(sleepDelay);
  }
  throw new Error('[ThreeD] Status: FAILED — CityJSON generation timed out.');
};

const processCityJSONRequest = async (params: ProcessCityJSONRequestParams, signal?: AbortSignal) => {
  const { id, imageUrl, roofDelimiter, imageHeight, imageWidth, zoom, tileX, tileY, tileImageSizePx } = params;
  const { apiKey } = ParamsUtilities.getQueryParams();

  const response = await fetch(`${baseUrl}/city-jsons/${id}/process`, {
    method: 'PUT',
    signal,
    headers: {
      'x-api-key': apiKey || '',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id,
      delimitationObjectType: 'BUILDING_ROOF',
      delimitations: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: roofDelimiter,
          },
        },
      ],
      threeDTextureInfo: {
        tileX,
        tileY,
        tileImageSizePx,
        imageWidth,
        imageHeight,
        zoom,
        imageUri: imageUrl,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('[CityJSONRequest] Status: FAILED — Unable to generate CityJSON.');
  }
};

const getThreeDStatus = async (id: string, signal?: AbortSignal) => {
  const { apiKey } = ParamsUtilities.getQueryParams();

  const response = await fetch(`${baseUrl}/3d/${id}`, {
    method: 'GET',
    signal,
    headers: {
      'x-api-key': apiKey || '',
    },
  });

  if (!response.ok) {
    throw new Error('[ThreeD] Status: FAILED — Unable to get 3D status.');
  }

  return (await response.json()) as ThreeDResponseStatus;
};

const resolveCityJsonFromStatus = (threeDResponse: ThreeDResponseStatus) => {
  if (threeDResponse.status.health === HealthStatus.FAILED) {
    throw new Error('[ThreeD] Status: FAILED — Unable to generate CityJSON.');
  }
  if (threeDResponse.status.health === HealthStatus.UNKNOWN) {
    throw new Error('[ThreeD] Status: UNAVAILABLE — CityJSON is currently unavailable.');
  }
  if (!threeDResponse.cityJsonFileUrls?.length) {
    throw new Error('[ThreeD] Status: FAILED — No CityJSON files available.');
  }
  return threeDResponse.cityJsonFileUrls[0].url;
};

export const getCityJSON = async (params: ProcessCityJSONRequestParams, signal?: AbortSignal): Promise<CityJSONData> => {
  await retryUntilReady({
    maxAttemps: 5,
    sleepDelay: 3_000,
    signal,
    fetcher: async () => {
      await processCityJSONRequest(params, signal);
      return true;
    },
    isReady: () => true,
  });

  const threeDResponse = await retryUntilReady({
    maxAttemps: 20,
    sleepDelay: 7_000,
    signal,
    fetcher: () => getThreeDStatus(params.id, signal),
    isReady: response => response.status.progression !== ProgressionStatus.PROCESSING && response.status.progression !== ProgressionStatus.PENDING,
  });

  const fileUrl = resolveCityJsonFromStatus(threeDResponse);
  const urlResponse = await fetch(fileUrl, { method: 'GET', signal });
  return (await urlResponse.json()) as CityJSONData;
};
