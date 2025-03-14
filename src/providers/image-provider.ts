import { ZoomLevel } from '@bpartners/typescript-client';
import { v4 } from 'uuid';
import { bpAnnotationApi } from './api';
import { userInfoProvider } from './user-info-provider';

export const getImageFromAddress = async (apiKey: string, address: string) => {
  const { accountId } = await userInfoProvider(apiKey);
  const { data: areaPictureDetails } = await bpAnnotationApi(apiKey).crupdateAreaPictureDetails(accountId ?? '', v4(), {
    address,
    fileId: v4(),
    filename: `Layer ${address}`,
    zoomLevel: ZoomLevel.HOUSES_0,
  });

  return areaPictureDetails;
};
