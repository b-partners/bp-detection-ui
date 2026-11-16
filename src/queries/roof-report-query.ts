import { useStep } from '@/hooks';
import { GeoExportedPdf } from '@bpartners/roof-analyser';
import { useMutation } from '@tanstack/react-query';

/**
 * Keeps the report the roof analyser exports (in place of its own download). The roofer is notified with it by the
 * library itself, on the prospect passed as `analysisProject.prospectId`, right after this returns.
 * The user stays on the analyser: the wizard only moves on to the acknowledgement step on `onFinish`.
 */
export const useRoofReportQuery = () => {
  const { setStep } = useStep();

  const mutationFn = async ({ blob, filename }: GeoExportedPdf) => {
    const pdfFile = new File([blob], filename, { type: 'application/pdf' });
    setStep({ actualStep: useStep.getState().actualStep, params: { pdfFile } });
  };

  const onFinish = () => setStep({ actualStep: 3, params: {} });

  const { mutateAsync, isPending } = useMutation({ mutationFn, mutationKey: ['roofReportQuery'] });

  return { onPdfExport: mutateAsync, onFinish, isPending };
};
