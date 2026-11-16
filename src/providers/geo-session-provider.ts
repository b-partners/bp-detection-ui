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

  // The library's own geocoder, through the Dashboard API; set before it mounts, so the call carries the apiKey.
  setConfig({ apiKey, apiUrl: API_URL });
  const position = await geocodeAddress({ address });

  return { sessionId, position, areaPictureDetails: { ...areaPictureDetails, address: areaPictureDetails?.address ?? address }, prospect };
};
