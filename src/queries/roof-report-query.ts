import { useStep } from '@/hooks';
import { notifyRooferAfterAnalyze } from '@/providers';
import { cache, getCached } from '@/utilities';
import { GeoExportedPdf } from '@bpartners/roof-analyser';
import { useMutation } from '@tanstack/react-query';

/**
 * Takes the report the roof analyser exports (in place of its own download), notifies the roofer with it
 * and moves the wizard on to the acknowledgement step.
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
    setStep({ actualStep: 3, params: { pdfFile } });
  };

  const { mutateAsync, isPending } = useMutation({ mutationFn, mutationKey: ['roofReportQuery'] });

  return { onPdfExport: mutateAsync, isPending };
};
