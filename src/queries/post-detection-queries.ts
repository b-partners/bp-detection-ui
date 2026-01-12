import { useStep } from '@/hooks';
import { sendPdfToMail, sendRooferInformationsToMail } from '@/providers';
import { cache } from '@/utilities';
import { generateLocalPdf } from '@/utilities/generate-local-pdf';
import { useMutation } from '@tanstack/react-query';
import { RefObject } from 'react';

export const usePostDetectionQueries = () => {
  const {
    params: { areaPictureDetails, prospect },
  } = useStep();

  const mutationFn = async (ref: RefObject<HTMLDivElement | null>) => {
    const file = await generateLocalPdf(ref, areaPictureDetails?.address || '');
    await sendPdfToMail(file);
    await sendRooferInformationsToMail({
      address: areaPictureDetails?.address,
      email: prospect?.email,
      firstName: prospect?.firstName,
      lastName: prospect?.name,
      phone: prospect?.phone,
    });
    cache.isEmailSent();
  };

  const { mutateAsync: postDetection, isPending } = useMutation({ mutationFn, mutationKey: ['postDetectionQuery'] });

  return { sendInfoToRoofer: postDetection, isPending };
};
