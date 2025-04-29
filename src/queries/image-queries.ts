import { useStep } from '@/hooks';
import { arrayBufferToBase64, arrayBuffeToFile, getFileUrl, ParamsUtilities } from '@/utilities';
import { AreaPictureDetails, FileType } from '@bpartners/typescript-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { v4 } from 'uuid';
import { getImageFromAddress, processDetection, sendImageToDetect, updateAreaPicture } from '../providers';

const getImageFile = async (areaPictureDetails: AreaPictureDetails) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const fileUrl = getFileUrl(areaPictureDetails?.fileId ?? '', FileType.AREA_PICTURE);
  const file = await fetch(fileUrl, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  const imageAsArrayBuffer = await file.arrayBuffer();

  const imageAsBase64 = arrayBufferToBase64(imageAsArrayBuffer);

  return {
    imageAsBase64,
    imageAsArrayBuffer,
    imageUrl: fileUrl,
    image: file,
  };
};

const mutationFn = (actualStep: number) => async (address: string) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { areaPictureDetails, prospect } = await getImageFromAddress(apiKey, address);

  const { imageAsArrayBuffer, imageAsBase64, imageUrl, image } = await getImageFile(areaPictureDetails);

  // create the detection without polygon
  await processDetection(areaPictureDetails.actualLayer?.name ?? '', address);

  try {
    // send the received image as file to the backend
    if (actualStep === 0) {
      const filename = `${v4().replace(/\-/gi, '')}_20_${(areaPictureDetails?.xTile || 0) - 1}_${(areaPictureDetails?.yTile || 0) - 1}.jpg`;
      const imageAsFile = arrayBuffeToFile(imageAsArrayBuffer, filename, image.headers.get('Content-Type') || 'application/octet-stream');
      await sendImageToDetect(imageAsFile);
    }
    // send the received image as file to the backend
  } catch (err) {
    console.log({ err });
  }

  return {
    areaPictureDetails,
    fileUrl: imageUrl,
    fileArrayBuffer: imageAsBase64,
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

export const useQueryUpdateAreaPicture = () => {
  const {
    params: { areaPictureDetails },
  } = useStep();

  const mutationFn = async (areaPictureDetailsParams: Partial<AreaPictureDetails>) => {
    const updatedAreaPictureDetails = await updateAreaPicture({ ...areaPictureDetails, ...areaPictureDetailsParams });
    return getImageFile(updatedAreaPictureDetails);
  };

  return useMutation({ mutationFn, mutationKey: ['updateAreaPicture'] });
};
