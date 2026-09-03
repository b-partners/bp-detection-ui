import { DEMO_LOGO_URL, DEMO_ROOF_IMAGE_DATA_URI, isDemoApiKey } from '@/providers/demo';
import { FileType } from '@bpartners/typescript-client';
import { getCached } from './cache';
import { ParamsUtilities } from './get-query-params';

export const getFileUrl = (id: string, type: FileType, accountId?: string) => {
  const { accountId: _accountId } = getCached.userInfo();
  const { apiKey } = ParamsUtilities.getQueryParams();
  if (isDemoApiKey(apiKey)) return type === 'LOGO' ? DEMO_LOGO_URL : DEMO_ROOF_IMAGE_DATA_URI;
  return `${process.env.REACT_APP_BPARTNERS_API_URL}/accounts/${accountId || _accountId}/files/${id}/raw?apiKey=${apiKey}&fileType=${type}`;
};
