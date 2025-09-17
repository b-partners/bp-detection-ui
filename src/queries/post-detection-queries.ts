import { useStep } from '@/hooks';
import { sendPdfToMail, sendRooferInformationsToMail } from '@/providers';
import { cache } from '@/utilities';
import { useMutation } from '@tanstack/react-query';
import { RefObject } from 'react';
import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf';

const generateLocalPdf = async (ref: RefObject<HTMLDivElement | null>, address: string) => {
  const options: Options = {
    filename: 'res.pdf',
    method: 'build',
    resolution: Resolution.MEDIUM,
    page: { orientation: 'landscape', margin: Margin.MEDIUM },
    canvas: { mimeType: 'image/png', qualityRatio: 1 },
    overrides: {
      pdf: {
        compress: true,
      },
    },
  };
  // wait fo the image in the annotator board to load before geenrate the pdf
  await new Promise(resolve => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(timeoutId);
    }, 1000);
  });
  const res = await generatePDF(ref, options);
  const blob = res.output('blob');
  return new File([blob], `${address}.pdf`, { lastModified: Date.now(), type: 'application/pdf' });
};

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
