import { useStep } from '@/hooks';
import { arrayBufferToBase64, arrayBuffeToFile, getFileUrl, ParamsUtilities } from '@/utilities';
import { FileType } from '@bpartners/typescript-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { v4 } from 'uuid';
import { getImageFromAddress, processDetection, sendImageToDetect } from '../providers';

const mutationFn = (actualStep: number) => async (address: string) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { areaPictureDetails, prospect } = await getImageFromAddress(apiKey, address);
  const fileUrl = getFileUrl(areaPictureDetails?.fileId ?? '', FileType.AREA_PICTURE);
  const file = await fetch(fileUrl, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  const imageAsArrayBuffer = await file.arrayBuffer();

  const fileArrayBuffer = arrayBufferToBase64(imageAsArrayBuffer);
  // create the detection without polygon
  await processDetection(areaPictureDetails.actualLayer?.name ?? '');

  try {
    // send the received image as file to the backend
    if (actualStep === 0) {
      const filename = `${v4().replace(/\-/gi, '')}_20_${(areaPictureDetails?.xTile || 0) - 1}_${(areaPictureDetails?.yTile || 0) - 1}.jpg`;
      const imageAsFile = arrayBuffeToFile(imageAsArrayBuffer, filename, file.headers.get('Content-Type') || 'application/octet-stream');
      await sendImageToDetect(imageAsFile);
    }
    // send the received image as file to the backend
  } catch (err) {
    console.log({ err });
  }

  return {
    areaPictureDetails,
    fileUrl,
    fileArrayBuffer,
    prospect,
  };
};

export const useQueryImageFromAddress = () => {
  const { actualStep } = useStep();
  const { isPending, data, mutate } = useMutation({ mutationKey: ['image from address'], mutationFn: mutationFn(actualStep) });

  return {
    isQueryImagePending: isPending,
    imageSrc: data?.fileArrayBuffer ?? '',
    areaPictureDetails: data?.areaPictureDetails,
    prospect: data?.prospect,
    queryImage: mutate,
  };
};

export const useQueryImageFromUrl = (url?: string) => {
  const queryUrlFn = async () => {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const result = await fetch(url || '', { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
    const imageAsArrayBuffer = await result.arrayBuffer();

    return arrayBufferToBase64(imageAsArrayBuffer);
  };

  return useQuery({ queryFn: queryUrlFn, queryKey: [url], enabled: !!url });
};
