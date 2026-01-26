import { FileType } from '@bpartners/typescript-client';
import { getCached } from './cache';
import { ParamsUtilities } from './get-query-params';

export const getFileUrl = (id: string, type: FileType) => {
  const { accountId } = getCached.userInfo();
  const { apiKey } = ParamsUtilities.getQueryParams();
  return `${process.env.REACT_APP_BPARTNERS_API_URL}/accounts/${accountId}/files/${id}/raw?apiKey=${apiKey}&fileType=${type}`;
};
