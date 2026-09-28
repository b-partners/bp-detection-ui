import { cache, ParamsUtilities } from '@/utilities';
import { GeoPoint, geoRecordIds, WmsLayerOption } from '@bpartners/roof-analyser';
import { AreaPictureAnnotation, AreaPictureDetails, Prospect, ZoomLevel } from '@bpartners/typescript-client';
import L from 'leaflet';
import { v4 } from 'uuid';
import { bpAnnotationApi, bpProspectApi } from './api';
import { ProspectInfo, toAddressError } from './image-provider';
import { userInfoProvider } from './user-info-provider';

// Same requests as bpartners-web's roof-analyser host (prospect-queries.tsx / wms-resolver.ts), authenticated
// with the url's apiKey (`x-api-key`) wherever bpartners-web sends its Cognito bearer token.

const readEnv = (value?: string) => {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const API_URL = readEnv(process.env.REACT_APP_BPARTNERS_API_URL);
/** The GeoData lambda — the address geocoder. */
const GEODATA_API_URL = readEnv(process.env.REACT_APP_GEODATA_API_URL);
const GEODATA_API_KEY = readEnv(process.env.REACT_APP_GEODATA_API_KEY);
/**
 * Where tiles are fetched from — never the `wmsBaseUrl` the MapLayer endpoints hand back: the library reads
 * every cell with `fetch` + `createImageBitmap`, which needs a CORS-clean url. `/wms-proxy` is the Vite dev
 * server's own proxy (vite.config.ts); a deployed build points this at a proxy of its own.
 */
const WMS_TILE_BASE_URL = readEnv(process.env.REACT_APP_WMS_TILE_BASE_URL) ?? '/wms-proxy';

const apiKeyOrThrow = () => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  if (!apiKey) throw new Error('Aucune clé API.');
  return apiKey as string;
};

export interface GeoSession {
  sessionId: string;
  position: GeoPoint;
  areaPictureDetails: AreaPictureDetails;
  prospect?: Prospect;
}

/**
 * The records the roof analyser expects its host to create before it mounts: the prospect, then an area
 * picture linked to it and a draft annotation, both under the ids the library derives from the session id.
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

  const { data: prospects } = await bpProspectApi(apiKey).createProspects(accountHolderId ?? '', [
    { address, id: v4(), status: 'TO_CONTACT', firstName, email, phone, name: lastName, comment } as any,
  ]);
  const prospect: Prospect | undefined = prospects?.[0];
  const prospectId = prospect?.id ?? '';
  cache.prospectId(prospectId);

  const sessionId = v4();
  const { areaPictureId, annotationId, fileId } = geoRecordIds(sessionId);
  const annotationApi = bpAnnotationApi(apiKey);

  const { data: areaPictureDetails } = await annotationApi.crupdateAreaPictureDetails(accountId ?? '', areaPictureId, {
    shiftNb: 0,
    address,
    fileId,
    filename: `Layer ${address}`,
    prospectId,
    zoomLevel: ZoomLevel.BUILDING,
    isExtended: true,
    downloadImage: false,
    isOpaque: false,
  } as any);

  const draftAnnotation: AreaPictureAnnotation = {
    id: annotationId,
    idAreaPicture: areaPictureId,
    creationDatetime: new Date(),
    annotations: [],
    properties: { geoSessionId: sessionId },
    isDraft: true,
  };
  await annotationApi.annotateAreaPicture(accountId ?? '', areaPictureId, annotationId, draftAnnotation);

  const position = await geocodeAddress(address);

  return { sessionId, position, areaPictureDetails: { ...areaPictureDetails, address: areaPictureDetails?.address ?? address }, prospect };
};

/** The GeoData lambda, on an `x-api-key` — turns the address into the position the lon/lat flow needs. */
export const geocodeAddress = async (address: string): Promise<GeoPoint> => {
  if (!GEODATA_API_URL) throw new Error("Le géocodage n'est pas configuré — REACT_APP_GEODATA_API_URL est absent du .env.");
  const response = await fetch(`${GEODATA_API_URL}/geocode?address=${encodeURIComponent(address)}`, {
    headers: { 'x-api-key': GEODATA_API_KEY || apiKeyOrThrow() },
  });
  if (!response.ok) throw new Error(`${response.status} — ${(await response.text()).slice(0, 200)}`);
  const { longitude, latitude }: GeoPoint = await response.json();
  if (typeof latitude !== 'number' || typeof longitude !== 'number') throw new Error(`Aucune géoposition renvoyée pour « ${address} »`);
  return { latitude, longitude };
};

interface AreaPictureMapLayer {
  id: string;
  name: string;
  year?: number;
  precisionLevelInCm?: number;
}

/** `value` goes on every GetMap as `token`, `expiresAtEpochSecond` as `expires`. */
interface SecureLinkToken {
  value: string;
  expiresAt?: string;
  expiresAtEpochSecond: number;
}

interface MapLayerReachability {
  layer: AreaPictureMapLayer;
  reachable: boolean;
}

interface MapLayersReachability {
  layers: MapLayerReachability[];
  secureLinkToken: SecureLinkToken;
}

interface MapLayerActual {
  layer?: AreaPictureMapLayer;
  secureLinkToken: SecureLinkToken;
}

const fetchMapLayers = async <T>(path: string, latitude: number, longitude: number): Promise<T> => {
  if (!API_URL) throw new Error("L'imagerie n'est pas configurée — REACT_APP_BPARTNERS_API_URL est absent du .env.");
  const response = await fetch(`${API_URL}${path}?lat=${latitude}&lon=${longitude}`, { headers: { 'x-api-key': apiKeyOrThrow() } });
  if (!response.ok) throw new Error(`${response.status} — ${(await response.text()).slice(0, 200)}`);
  return response.json();
};

const secureLinkOrThrow = (secureLinkToken?: SecureLinkToken) => {
  if (!secureLinkToken?.value) throw new Error("Aucun jeton d'accès à l'imagerie renvoyé par l'API.");
  return secureLinkToken;
};

const buildLayer = (
  { name, year, precisionLevelInCm }: AreaPictureMapLayer,
  { value, expiresAtEpochSecond }: SecureLinkToken,
  reachable?: boolean
): WmsLayerOption => ({
  name,
  year,
  precisionLevelInCm,
  reachable,
  create: () =>
    L.tileLayer.wms(WMS_TILE_BASE_URL, {
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

const MERCATOR_HALF_WORLD = 20037508.34;
const PROBE_HALF_SIZE_M = 64;

const toMercator = ({ latitude, longitude }: GeoPoint) => ({
  x: (longitude * MERCATOR_HALF_WORLD) / 180,
  y: (Math.log(Math.tan(((90 + latitude) * Math.PI) / 360)) / (Math.PI / 180)) * (MERCATOR_HALF_WORLD / 180),
});

// Built off the very layer the map fetches its cells from, and read the same way, with `fetch`.
const probeUrl = (layer: L.TileLayer.WMS, position: GeoPoint) => {
  const { x, y } = toMercator(position);
  const params = new URLSearchParams({
    ...Object.fromEntries(Object.entries(layer.wmsParams).map(([key, value]) => [key, String(value)])),
    srs: 'EPSG:3857',
    bbox: `${x - PROBE_HALF_SIZE_M},${y - PROBE_HALF_SIZE_M},${x + PROBE_HALF_SIZE_M},${y + PROBE_HALF_SIZE_M}`,
    width: '64',
    height: '64',
  });
  return `${(layer as unknown as { _url: string })._url}?${params.toString()}`;
};

// The content type is checked as well: a build with no proxy behind the tile url answers 200 with its index.html.
const assertImageryReadable = async (layer: WmsLayerOption, position: GeoPoint) => {
  const response = await fetch(probeUrl(layer.create(), position));
  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok || !contentType.startsWith('image/')) {
    throw new Error(`L'imagerie n'a pas pu être chargée (HTTP ${response.status}) — vérifiez le proxy WMS (REACT_APP_WMS_TILE_BASE_URL).`);
  }
};

const imageryChecks = new Map<string, Promise<void>>();

/** One check per position and secure link, shared by both resolvers; a failed check is forgotten. */
const checkImagery = (layer: WmsLayerOption, position: GeoPoint, secureLink: string) => {
  const key = `${WMS_TILE_BASE_URL}|${secureLink}|${position.latitude},${position.longitude}`;
  const pending = imageryChecks.get(key);
  if (pending) return pending;
  const checking = assertImageryReadable(layer, position).catch(error => {
    imageryChecks.delete(key);
    throw error;
  });
  imageryChecks.set(key, checking);
  return checking;
};

/** The single layer the map opens on, off `/map/layers/actual`. A bare layer is accepted too, provided a token comes with it. */
export const resolveActiveWmsLayer = async (latitude: number, longitude: number): Promise<WmsLayerOption> => {
  const body: MapLayerActual & Partial<AreaPictureMapLayer> = await fetchMapLayers('/map/layers/actual', latitude, longitude);
  const layer = body.layer ?? (body as AreaPictureMapLayer);
  if (!layer?.name) throw new Error('Aucune couche aérienne ne couvre cette position.');

  const secureLinkToken = secureLinkOrThrow(body.secureLinkToken);
  const option = buildLayer(layer, secureLinkToken);
  await checkImagery(option, { latitude, longitude }, secureLinkToken.value);
  return option;
};

/** Every candidate layer, off `/map/layers`, unreachable ones included; one secure link covers them all. */
export const resolveWmsLayers = async (latitude: number, longitude: number): Promise<WmsLayerOption[]> => {
  const { layers, secureLinkToken }: MapLayersReachability = await fetchMapLayers('/map/layers', latitude, longitude);
  const secureLink = secureLinkOrThrow(secureLinkToken);
  const options = (layers ?? []).map(({ layer, reachable }) => buildLayer(layer, secureLink, reachable));

  const fallback = options.find(option => option.reachable !== false) ?? options[0];
  if (fallback) await checkImagery(fallback, { latitude, longitude }, secureLink.value);
  return options;
};
