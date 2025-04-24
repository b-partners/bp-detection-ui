import { FileType } from '@bpartners/typescript-client';
import { getCached } from './cache';

export const getFileUrl = (id: string, type: FileType) => {
  const { accountId } = getCached.userInfo();
  return `${process.env.REACT_APP_BPARTNERS_API_URL}/accounts/${accountId}/files/${id}/raw?accessToken=''&fileType=${type}`;
};
