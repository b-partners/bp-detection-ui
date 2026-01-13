import { getCached } from '@/utilities';
import { base64ToFile } from '@/utilities/file-utilities';
import { FilesApi, FileType } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';

interface MutationParams {
  id: string;
  file: string;
}

const mutationFn = async (params: MutationParams) => {
  if (getCached.isAreaPictureImageUpdated()) return;
  const arrayBuffer = base64ToFile(params.file, params.id + '.png');
  const { accountId } = getCached.userInfo();
  const result = await filesApi()
    .uploadFile(accountId, params.id, arrayBuffer, FileType.AREA_PICTURE, { headers: { 'Content-Type': 'image/png' } })
    .then(({ data }) => [data]);
  cache.isAreaPictureImageUpdated(true);
  return result;
};

interface Params {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useAnnotatorImageUploadQuery = (params?: Params) => {
  const { onError, onSuccess } = params || {};
  return useMutation({ mutationFn, onSuccess, onError });
};
