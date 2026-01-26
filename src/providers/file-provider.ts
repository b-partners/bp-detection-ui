import { ParamsUtilities } from '@/utilities';
import { FileType } from '@bpartners/typescript-client';
import { filesApi } from './api';
import { userInfoProvider } from './user-info-provider';

export const fileProvider = {
  async upload(fileId: string, fileType: FileType, file: File) {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { accountId } = await userInfoProvider(apiKey);
    const response = await filesApi(apiKey).uploadFile(accountId || '', fileId, file, fileType, { headers: { 'Content-Type': 'image/png' } });
    return response.data;
  },
};
