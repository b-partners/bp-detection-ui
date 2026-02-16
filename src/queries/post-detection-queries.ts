import { useStep } from '@/hooks';
import { sendPdfToMail, sendRooferInformationsToMail } from '@/providers';
import { cache } from '@/utilities';
import { useMutation } from '@tanstack/react-query';

export const usePostDetectionQueries = (onSuccess?: () => void) => {
  const {
    params: { areaPictureDetails, prospect },
  } = useStep();

  const mutationFn = async (file: File) => {
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

  const { mutateAsync: postDetection, isPending } = useMutation({ mutationFn, mutationKey: ['postDetectionQuery'], onSuccess });

  return { sendInfoToRoofer: postDetection, isPending };
};
