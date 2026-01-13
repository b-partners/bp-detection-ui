import { useStep } from '@/hooks';
import { notifyRooferAfterAnalyze } from '@/providers';
import { cache } from '@/utilities';
import { generateLocalPdf } from '@/utilities/generate-local-pdf';
import { useMutation } from '@tanstack/react-query';
import { RefObject } from 'react';

export const useNotifyPdfQuery = () => {
  const {
    params: { areaPictureDetails, prospect },
  } = useStep();

  const mutationFn = async (ref: RefObject<HTMLDivElement | null>) => {
    const file = await generateLocalPdf(ref, areaPictureDetails?.address || '');
    await notifyRooferAfterAnalyze(prospect?.id || '', file);
    cache.notificationAlreadySent();
  };

  const { mutateAsync, isPending } = useMutation({ mutationFn, mutationKey: ['postDetectionQuery'] });

  return { notifyRoofer: mutateAsync, isPending };
};
