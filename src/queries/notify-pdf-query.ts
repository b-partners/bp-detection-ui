import { useStep } from '@/hooks';
import { exportAnalyzeAsPdf, notifyRooferAfterAnalyze } from '@/providers';
import { cache } from '@/utilities';
import { jsonToFile } from '@/utilities/file-utilities';
import { ExportAreaPictureAnnotation } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';

export const useNotifyPdfQuery = () => {
  const { prospect } = useStep(p => p.params);

  const mutationFn = async (exportAreaPictureAnnotation: ExportAreaPictureAnnotation) => {
    const fileUrls = await exportAnalyzeAsPdf(jsonToFile(exportAreaPictureAnnotation));
    const result = await fetch(fileUrls.value || '', { headers: { 'content-type': 'application/json' } });
    const buffer = await result.arrayBuffer();
    const file = new File([new Uint8Array(buffer)], `${exportAreaPictureAnnotation.address}-analyze.pdf`, { type: 'application/pdf' });
    await notifyRooferAfterAnalyze(prospect?.id || '', file);
    cache.notificationAlreadySent();
  };

  const { mutateAsync, isPending } = useMutation({ mutationFn, mutationKey: ['postDetectionQuery'] });

  return { notifyRoofer: mutateAsync, isPending };
};
