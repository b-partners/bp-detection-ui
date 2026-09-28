import { cache, ParamsUtilities } from '@/utilities';
import { GeoPoint, geoRecordIds, WmsLayerOption } from '@bpartners/roof-analyser';
import { AreaPictureDetails, Prospect, ZoomLevel } from '@bpartners/typescript-client';
import L from 'leaflet';
import { v4 } from 'uuid';
import { bpAnnotationApi, bpProspectApi } from './api';
import { ProspectInfo, toAddressError } from './image-provider';
import { userInfoProvider } from './user-info-provider';

const API_URL = (process.env.REACT_APP_BPARTNERS_API_URL ?? '').replace(/\/$/g, '');
// Overrides the GeoServer the map-layer endpoints hand back, e.g. to go through a same-origin proxy.
const WMS_TILE_BASE_URL = process.env.REACT_APP_WMS_TILE_BASE_URL;

export interface GeoSession {
  sessionId: string;
  position: GeoPoint;
  areaPictureDetails: AreaPictureDetails;
  prospect?: Prospect;
}

/**
 * The records the roof-analyser lon/lat flow expects its host to create before mounting it: the prospect,
 * its area picture under the ids `geoRecordIds` derives from the session, and a draft annotation on it.
 * The area picture's own geo position is the position the map locks onto.
 */
export const createGeoSession = async (apiKey: string, userInfo: ProspectInfo): Promise<GeoSession> => {
  try {
    return await createGeoSessionRecords(apiKey, userInfo);
  } catch (error: any) {
    throw toAddressError(error);
  }
};

const createGeoSessionRecords = async (apiKey: string, userInfo: ProspectInfo): Promise<GeoSession> => {
  const { accountId = '', accountHolderId = '' } = await userInfoProvider(apiKey);
  const { address, email, firstName, lastName, phone, comment } = userInfo;
  const sessionId = v4();
  const { areaPictureId, annotationId, fileId } = geoRecordIds(sessionId);

  const { data: prospects } = await bpProspectApi(apiKey).createProspects(accountHolderId ?? '', [
    { address, id: v4(), status: 'TO_CONTACT', firstName, email, phone, name: lastName, comment } as any,
  ]);
  const prospect: Prospect | undefined = prospects?.[0];
  cache.prospectId(prospect?.id || '');

  const annotationApi = bpAnnotationApi(apiKey);
  const { data: areaPictureDetails } = await annotationApi.crupdateAreaPictureDetails(accountId ?? '', areaPictureId, {
    address,
    fileId,
    filename: `Layer ${address}`,
    zoomLevel: ZoomLevel.BUILDING,
    prospectId: prospect?.id,
    isExtended: true,
    zoom: { level: ZoomLevel.BUILDING, number: 20 },
    isOpaque: true,
  });

  await annotationApi.annotateAreaPicture(accountId ?? '', areaPictureId, annotationId, {
    id: annotationId,
    idAreaPicture: areaPictureId,
    creationDatetime: new Date(),
    annotations: [],
    properties: { geoSessionId: sessionId },
    isDraft: true,
  } as any);

  const { latitude, longitude } = areaPictureDetails?.geoPositions?.[0] ?? {};
  if (typeof latitude !== 'number' || typeof longitude !== 'number') throw new Error('getImageError');

  return { sessionId, position: { latitude, longitude }, areaPictureDetails, prospect };
};

interface AreaPictureMapLayer {
  name: string;
  year?: number;
  precisionLevelInCm?: number;
}

interface SecureLinkToken {
  value: string;
  expiresAtEpochSecond: number;
}

interface MapLayerActual {
  wmsBaseUrl: string;
  layer?: AreaPictureMapLayer;
  secureLinkToken: SecureLinkToken;
}

interface MapLayersReachability {
  wmsBaseUrl: string;
  layers: { layer: AreaPictureMapLayer; reachable: boolean }[];
  secureLinkToken: SecureLinkToken;
}

// Authenticated with the apiKey from the url, like every other bpartners call of this app.
const fetchMapLayers = async <T>(path: string, latitude: number, longitude: number): Promise<T> => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const response = await fetch(`${API_URL}${path}?lat=${latitude}&lon=${longitude}`, { headers: { 'x-api-key': apiKey } });
  if (!response.ok) throw new Error(`${response.status} — ${(await response.text()).slice(0, 200)}`);
  return response.json();
};

const secureLinkOrThrow = (secureLinkToken?: SecureLinkToken) => {
  if (!secureLinkToken?.value) throw new Error("Aucun jeton d'accès à l'imagerie renvoyé par l'API.");
  return secureLinkToken;
};

const buildLayer = (
  { name, year, precisionLevelInCm }: AreaPictureMapLayer,
  wmsBaseUrl: string,
  { value, expiresAtEpochSecond }: SecureLinkToken,
  reachable?: boolean
): WmsLayerOption => ({
  name,
  year,
  precisionLevelInCm,
  reachable,
  create: () =>
    L.tileLayer.wms(WMS_TILE_BASE_URL || wmsBaseUrl, {
      layers: name,
      format: 'image/jpeg',
      transparent: true,
      version: '1.1.1',
      token: value,
      expires: expiresAtEpochSecond,
      attribution: 'GeoServer WMS',
      tileSize: 1024,
      maxZoom: 24,
      maxNativeZoom: 21,
    } as L.WMSOptions),
});

export const resolveActiveWmsLayer = async (latitude: number, longitude: number): Promise<WmsLayerOption> => {
  const { wmsBaseUrl, layer, secureLinkToken } = await fetchMapLayers<MapLayerActual>('/map/layers/actual', latitude, longitude);
  if (!layer?.name) throw new Error('Aucune couche aérienne ne couvre cette position.');
  return buildLayer(layer, wmsBaseUrl, secureLinkOrThrow(secureLinkToken));
};

export const resolveWmsLayers = async (latitude: number, longitude: number): Promise<WmsLayerOption[]> => {
  const { wmsBaseUrl, layers, secureLinkToken } = await fetchMapLayers<MapLayersReachability>('/map/layers', latitude, longitude);
  const token = secureLinkOrThrow(secureLinkToken);
  return (layers ?? []).map(({ layer, reachable }) => buildLayer(layer, wmsBaseUrl, token, reachable));
};
