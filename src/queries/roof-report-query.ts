import { useStep } from '@/hooks';
import { notifyRooferAfterAnalyze } from '@/providers';
import { cache, getCached } from '@/utilities';
import { GeoExportedPdf } from '@bpartners/roof-analyser';
import { useMutation } from '@tanstack/react-query';

/**
 * Takes the report the roof analyser exports (in place of its own download) and notifies the roofer with it.
 * The user stays on the analyser: the wizard only moves on to the acknowledgement step on `onFinish`.
 */
export const useRoofReportQuery = () => {
  const { setStep } = useStep();
  const prospect = useStep(({ params }) => params.prospect);

  const mutationFn = async ({ blob, filename }: GeoExportedPdf) => {
    const pdfFile = new File([blob], filename, { type: 'application/pdf' });
    try {
      if (!getCached.notificationAlreadySent()) {
        await notifyRooferAfterAnalyze(prospect?.id || getCached.prospectId() || '', pdfFile);
        cache.notificationAlreadySent();
      }
    } catch (error) {
      // The user is never left stuck on the analyser because the notification failed.
      console.error(error);
    }
    setStep({ actualStep: useStep.getState().actualStep, params: { pdfFile } });
  };

  const onFinish = () => setStep({ actualStep: 3, params: {} });

  const { mutateAsync, isPending } = useMutation({ mutationFn, mutationKey: ['roofReportQuery'] });

  return { onPdfExport: mutateAsync, onFinish, isPending };
};
