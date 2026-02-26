import { useStep } from '@/hooks';
import { exportAnalyzeAsPdf, notifyRooferAfterAnalyze } from '@/providers';
import { cache, getCached } from '@/utilities';
import { jsonToFile } from '@/utilities/file-utilities';
import { ExportAreaPictureAnnotation } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { usePostDetectionQueries } from './post-detection-queries';

export const useNotifyPdfQuery = () => {
  const { prospect } = useStep(p => p.params);
  const [isEmailSent, setIsEmailSent] = useState(getCached.isEmailSent());

  const handleSuccess = () => {
    setIsEmailSent(true);
    cache.isEmailSent();
  };

  const { sendInfoToRoofer, isPending: sendInfoToRooferPending } = usePostDetectionQueries(handleSuccess);

  const mutationFn = async (exportAreaPictureAnnotation: ExportAreaPictureAnnotation) => {
    let counter = 0;
    const fetchPdf = async () => {
      try {
        counter++;
        const fileUrls = await exportAnalyzeAsPdf(jsonToFile(exportAreaPictureAnnotation));
        const response = await fetch(fileUrls.value || '', { headers: { 'content-type': 'application/json' } });
        if (!response.ok) throw new Error('Error ' + response.status);
        return response;
      } catch (err) {
        if (counter === 3) throw err;
        return fetchPdf();
      }
    };

    const result = await fetchPdf();
    const buffer = await result.arrayBuffer();
    const file = new File([new Uint8Array(buffer)], `${exportAreaPictureAnnotation.address}-analyze.pdf`, { type: 'application/pdf' });

    await notifyRooferAfterAnalyze(prospect?.id || '', file);
    if (!isEmailSent) sendInfoToRoofer(file);
    cache.notificationAlreadySent();
  };

  const { mutateAsync, isPending } = useMutation({ mutationFn, mutationKey: ['postDetectionQuery'] });

  return { notifyRoofer: mutateAsync, isPending: isPending || sendInfoToRooferPending, isEmailSent };
};
