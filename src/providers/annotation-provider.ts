import { ParamsUtilities } from '@/utilities';
import { AreaPictureAnnotation } from '@bpartners/typescript-client';
import { bpAnnotationApi } from './api';
import { userInfoProvider } from './user-info-provider';

export const saveAnnotations = async (areaPictureId: string, annotation: AreaPictureAnnotation) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { accountId } = await userInfoProvider(apiKey);
  const { data } = await bpAnnotationApi(apiKey).annotateAreaPicture(accountId ?? '', areaPictureId, annotation.id || '', annotation);
  return data;
};
