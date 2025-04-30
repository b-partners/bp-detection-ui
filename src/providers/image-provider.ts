import { ParamsUtilities } from '@/utilities';
import { AreaPictureDetails, ZoomLevel } from '@bpartners/typescript-client';
import { v4 } from 'uuid';
import { bpAnnotationApi, bpProspectApi } from './api';
import { userInfoProvider } from './user-info-provider';

export const getImageFromAddress = async (apiKey: string, address: string) => {
  const { accountId, accountHolderId } = await userInfoProvider(apiKey);
  const { data: prospect } = await bpProspectApi(apiKey).updateProspects(accountHolderId ?? '', [
    {
      address,
      id: v4(),
      status: 'TO_CONTACT',
    },
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
  });

  return { areaPictureDetails, prospect: prospect?.[0] };
};

export const updateAreaPicture = async (areaPictureDetails: AreaPictureDetails) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { accountId } = await userInfoProvider(apiKey);
  const { data } = await bpAnnotationApi(apiKey).crupdateAreaPictureDetails(accountId ?? '', areaPictureDetails.id || v4(), { ...areaPictureDetails });
  return data;
};
