import { fileProvider } from '@/providers/file-provider';
import { useMutation } from '@tanstack/react-query';
import { base64ToFile } from '@/utilities/file-utilities';
import { FileType } from '@bpartners/typescript-client';
import { cache, getCached } from '@/utilities';
import { useStep } from '@/hooks';

const mutationFn = (fileId: string) => async (file: string) => {
  if (getCached.isAnalyzeImageAlreadyUploaded()) return;
  const arrayBuffer = base64ToFile(file, fileId + '.png');
  const result = [await fileProvider.upload(fileId, FileType.AREA_PICTURE, arrayBuffer)]
  cache.isAnalyzeImageAlreadyUploaded();
  return result;
};

interface Params {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useAnnotatorImageUploadQuery = (params?: Params) => {
  const { onError, onSuccess } = params || {};
  const {  areaPictureDetails } = useStep(({ params }) => params);
  return useMutation({ mutationFn: mutationFn(areaPictureDetails?.fileId || ''), onSuccess, onError });
};
