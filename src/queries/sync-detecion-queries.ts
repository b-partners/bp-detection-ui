import { useNotify, useStep } from '@/hooks';
import { syncDetectionProvider } from '@/providers/sync-detection-provider';
import { base64ToFile } from '@/utilities';
import { useMutation } from '@tanstack/react-query';

export const useGetImageFromAddress = () => {
  const { open } = useNotify();
  const { setStep } = useStep();

  const mutationFn = async (address: string) => {
    open({ text: `Récupération de l'image à partir de l'adresse ${address} en cours.`, type: 'info' });

    const imageAsBase64 = await syncDetectionProvider.getImageFromAddress(address);
    await syncDetectionProvider.createDetection(address);
    await syncDetectionProvider.sendImageForDetection(base64ToFile(imageAsBase64, address));

    return imageAsBase64;
  };

  const {
    data: imageAsBase64,
    isPending: isGetImagePending,
    mutate: getImageFromAddress,
  } = useMutation({
    mutationFn,
    mutationKey: ['imageFromAddress'],
    onError(error) {
      open({ text: `L'adresse que vous avez demandée n'est pas encore prise en charge.`, type: 'error' });
      console.log(`useGetImageFromAddress : ` + error.message);
    },
    onSuccess(data) {
      setStep({ actualStep: 1, params: { imageSrc: data } });
    },
  });

  return {
    imageAsBase64,
    isGetImagePending,
    getImageFromAddress,
  };
};
