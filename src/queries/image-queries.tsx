import { ErrorMessageDialog, LegalFilesPdfRenderer } from '@/components';
import { useCheckApiKey, useDialog, useStep } from '@/hooks';
import { arrayBufferToBase64, arrayBuffeToFile, getFileUrl, localDb, ParamsUtilities } from '@/utilities';
import { AreaPictureDetails, FileType } from '@bpartners/typescript-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { v4 } from 'uuid';
import { getImageFromAddress, sendImageToDetect, updateAreaPicture } from '../providers';

const getImageFile = async (areaPictureDetails: AreaPictureDetails) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const fileUrl = getFileUrl(areaPictureDetails?.fileId ?? '', FileType.AREA_PICTURE);
  const file = await fetch(fileUrl, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  const imageAsArrayBuffer = await file.arrayBuffer();

  const imageAsBase64 = arrayBufferToBase64(imageAsArrayBuffer);

  if (areaPictureDetails.isExtended) {
    // todo: use backend shift number for the y too
    const shiftNb = { x: areaPictureDetails?.shiftNb || 0, y: 0 };
    await localDb.setImageSrc(imageAsBase64, shiftNb);
  }
  return {
    imageAsBase64,
    imageAsArrayBuffer,
    imageUrl: fileUrl,
    image: file,
  };
};

export const sendImageQuery = async (areaPictureDetails: AreaPictureDetails, imageAsArrayBuffer: ArrayBuffer, mimeType: string | null) => {
  const filename = `${v4().replace(/\-/gi, '')}_20_${(areaPictureDetails?.xTile || 0) - 1}_${(areaPictureDetails?.yTile || 0) - 1}.jpg`;
  const imageAsFile = arrayBuffeToFile(imageAsArrayBuffer, filename, mimeType || 'application/octet-stream');
  await sendImageToDetect(imageAsFile);
};

const mutationFn = async (address: string) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { areaPictureDetails, prospect } = await getImageFromAddress(apiKey, address);

  if (areaPictureDetails.actualLayer?.precisionLevelInCm !== 5) {
    throw new Error('areaPicturePrecision');
  }

  const { imageAsBase64, imageUrl } = await getImageFile(areaPictureDetails);

  return {
    areaPictureDetails,
    fileUrl: imageUrl,
    fileArrayBuffer: imageAsBase64,
    prospect,
  };
};

export const useQueryImageFromAddress = () => {
  const checkApiKey = useCheckApiKey();
  const { open } = useDialog();

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['image from address'],
    mutationFn,
    onError: (e: any) => {
      if (e?.status === 404 || e.message === 'Network Error') return checkApiKey();
      let errorMessage = '';

      if (e.message === 'zoneNotSupported') errorMessage = "La zone contenant cette adresse n'est pas encore supporté.";
      if (e.message === 'areaPicturePrecision') errorMessage = 'Adresse momentanément indisponible.';
      else if (e.message === 'detectionLimitExceeded') errorMessage = 'La limite des analyses gratuites a été atteinte.';
      else if (e.message === 'legalFileNotApproved') {
        open(<LegalFilesPdfRenderer />);

        return;
      } else if (e.message === 'getImageError') errorMessage = "Erreur lors de la récupération de l'image.";
      else if (e.message === 'Roofer error') errorMessage = "Erreur lors de l'initialisation de la détection.";
      else errorMessage = "Une erreur s'est produite, veuillez réessayer.";

      open(<ErrorMessageDialog message={errorMessage} />);
    },
  });

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
    setStep,
    actualStep,
  } = useStep();

  const { apiKey } = ParamsUtilities.getQueryParams();
  const mutationFn = async (areaPictureDetailsParams?: Partial<AreaPictureDetails>) => {
    let updatedAreaPictureDetails: AreaPictureDetails = areaPictureDetails as AreaPictureDetails;
    if (areaPictureDetailsParams) {
      updatedAreaPictureDetails = await updateAreaPicture({ ...areaPictureDetails, ...areaPictureDetailsParams });
    } else {
      const { areaPictureDetails: newAreaPictureDetails } = await getImageFromAddress(apiKey, areaPictureDetails?.address || '');
      updatedAreaPictureDetails = newAreaPictureDetails;
    }
    setStep({ actualStep, params: { areaPictureDetails: updatedAreaPictureDetails } });
    return getImageFile(updatedAreaPictureDetails);
  };

  const { isPending, data, mutate } = useMutation({ mutationFn, mutationKey: ['updateAreaPicture'] });

  const extendImageToggle = () => !isPending && mutate({ isExtended: !areaPictureDetails?.isExtended });
  const updateXShift = (n: number) => !isPending && mutate({ shiftNb: (areaPictureDetails?.shiftNb || 0) + n });
  const nextXShift = () => !isPending && updateXShift(1);
  const prevXShift = () => !isPending && updateXShift(-1);
  const refetchImage = () => !isPending && mutate(undefined);

  return {
    isPending,
    data,
    extendImageToggle,
    nextXShift,
    prevXShift,
    refetchImage,
    shift: {
      x: areaPictureDetails?.shiftNb,
      y: 0,
    },
    isExtended: areaPictureDetails?.isExtended,
  };
};
