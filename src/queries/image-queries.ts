import { arrayBufferToBase64, getFileUrl, getQueryParams } from '@/utilities';
import { FileType } from '@bpartners/typescript-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getImageFromAddress } from '../providers';

const mutationFn = async (address: string) => {
  const { apiKey } = getQueryParams();
  const areaPictureDetails = await getImageFromAddress(apiKey, address);
  const fileUrl = getFileUrl(areaPictureDetails?.fileId ?? '', FileType.AREA_PICTURE);
  const file = await fetch(fileUrl, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  const fileArrayBuffer = arrayBufferToBase64(await file.arrayBuffer());

  return {
    areaPictureDetails,
    fileUrl,
    fileArrayBuffer,
  };
};

export const useQueryImageFromAddress = () => {
  const { isPending, data, mutate } = useMutation({ mutationKey: ['image from address'], mutationFn });

  return {
    isQueryImagePending: isPending,
    imageSrc: data?.fileArrayBuffer ?? '',
    areaPictureDetails: data?.areaPictureDetails,
    queryImage: mutate,
  };
};

export const useQueryImageFromUrl = (url?: string) => {
  const queryUrlFn = async () => {
    const { apiKey } = getQueryParams();
    const file = await fetch(url || '', { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
    const base64 = arrayBufferToBase64(await file.arrayBuffer());
    return base64;
  };

  return useQuery({ queryFn: queryUrlFn, queryKey: [url], enabled: !!url });
};
