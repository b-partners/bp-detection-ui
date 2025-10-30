import { ParamsUtilities } from '@/utilities';
import { GeojsonReturn } from '@bpartners/annotator-component';
import { bpAnnotationApi } from './api';
import { userInfoProvider } from './user-info-provider';

export const pointsToGeoPoints = async (body: any) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ANNOTATOR_GEO_MERCATOR_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await res.json()) as GeojsonReturn[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const geoPointsToPoins = async (geoJson: any) => {
  try {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { accountId } = await userInfoProvider(apiKey);

    if (!accountId) throw new Error('Account id unavailable');

    const { data } = await bpAnnotationApi(apiKey).convertAreaPictureAnnotationsToPixel(accountId, geoJson);
    return data;
  } catch (error) {
    console.log(error);
  }
};
