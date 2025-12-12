import { ParamsUtilities } from '@/utilities';
import { AreaPictureDetails, ZoomLevel } from '@bpartners/typescript-client';
import { v4 } from 'uuid';
import { bpAnnotationApi, bpProspectApi } from './api';
import { userInfoProvider } from './user-info-provider';

export type ProspectInfo = {
  lastName?: string;
  firstName?: string;
  phone?: string;
  email?: string;
  address: string;
};

export const getImageFromAddress = async (apiKey: string, userInfo: ProspectInfo) => {
  try {
    const { accountId, accountHolderId } = await userInfoProvider(apiKey);
    const { address, email, firstName, lastName, phone } = userInfo;
    const { data: prospect } = await bpProspectApi(apiKey).updateProspects(accountHolderId ?? '', [
      { address, id: v4(), status: 'TO_CONTACT', firstName, email, phone, name: lastName },
    ]);
    const { data: areaPictureDetails } = await bpAnnotationApi(apiKey).crupdateAreaPictureDetails(accountId ?? '', v4(), {
      address,
      fileId: v4(),
      filename: `Layer ${address}`,
      zoomLevel: ZoomLevel.HOUSES_0,
      prospectId: prospect?.[0]?.id,
      shiftNb: 0,
      zoom: {
        level: ZoomLevel.HOUSES_0,
        number: 20,
      },
      isOpaque: true,
    });

    return { areaPictureDetails, prospect: prospect?.[0] };
  } catch (error: any) {
    const notSupportedPattern = /Address or zone [\s\S]* not yet supported/i;
    const temporarilyUnavailablePattern = /Address or zone [\s\S]* temporarily unavailable/i;
    const mailProspectAlreadyExist = /Prospect with mail [\s\S]* already exists./i;

    if (temporarilyUnavailablePattern.test(error.message)) throw new Error('areaPicturePrecision');
    if (notSupportedPattern.test(error.message)) throw new Error('zoneNotSupported');
    if (mailProspectAlreadyExist.test(error.message)) throw new Error('prospectMailAlreadyExist');

    if (error?.response?.data?.message?.includes('Provided geojson polygon is too large to be processed synchronously')) {
      throw new Error('polygonTooBig');
    }
    if (
      error.status === 400 &&
      error?.response?.data?.message?.includes('Roof analysis consumption ') &&
      error?.response?.data?.message?.includes(' limit exceeded for free trial period for User.id=')
    ) {
      throw new Error('detectionLimitExceeded');
    } else if (error?.message?.includes('legalFileNotApproved')) {
      throw new Error('legalFileNotApproved');
    } else if (error.status === 404) {
      throw error;
    } else {
      throw new Error('getImageError');
    }
  }
};

export const updateAreaPicture = async (areaPictureDetails: AreaPictureDetails) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { accountId } = await userInfoProvider(apiKey);
  const { data } = await bpAnnotationApi(apiKey).crupdateAreaPictureDetails(accountId ?? '', areaPictureDetails.id || v4(), {
    ...areaPictureDetails,
    isOpaque: true,
  });
  return data;
};
