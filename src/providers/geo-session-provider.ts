import { cache } from '@/utilities';
import { geocodeAddress, GeoPoint, geoRecordIds, setConfig } from '@bpartners/roof-analyser';
import { AreaPictureAnnotation, AreaPictureDetails, Prospect, ZoomLevel } from '@bpartners/typescript-client';
import { v4 } from 'uuid';
import { bpAnnotationApi, bpProspectApi } from './api';
import { ProspectInfo, toAddressError } from './image-provider';
import { userInfoProvider } from './user-info-provider';

// Same requests as bpartners-web's roof-analyser host (prospect-queries.tsx), authenticated with the url's apiKey
// (`x-api-key`) wherever bpartners-web sends its Cognito bearer token.

const readEnv = (value?: string) => {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const API_URL = readEnv(process.env.REACT_APP_BPARTNERS_API_URL);

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

  // The library's own geocoder, through the Dashboard API; set before it mounts, so the call carries the apiKey.
  setConfig({ apiKey, apiUrl: API_URL });
  const position = await geocodeAddress({ address });

  return { sessionId, position, areaPictureDetails: { ...areaPictureDetails, address: areaPictureDetails?.address ?? address }, prospect };
};
