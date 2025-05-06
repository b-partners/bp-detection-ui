import { DomainPolygonType, ErrorMessageDialog } from '@/components';
import { useDialog } from '@/hooks';
import { getDetectionResult, syncDetectionProvider } from '@/providers';
import { ParamsUtilities } from '@/utilities';
import { useMutation, useQuery } from '@tanstack/react-query';

interface MutationProps {
  polygons: DomainPolygonType[];
  receiverEmail: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export const useQueryStartDetection = () => {
  const { open: openDialog } = useDialog();

  const mutationFn = async ({ polygons }: MutationProps) => {
    return await syncDetectionProvider.sendRoofDelimiterForDetection({ polygon: polygons[0].points.map(({ x, y }) => [x, y]) });
  };

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['detection', 'processing'],
    mutationFn: mutationFn,
    onError: () => {
      openDialog(<ErrorMessageDialog message="Une erreur s'est produite, veuillez réessayer." />);
    },
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};

export const useQueryDetectionResult = () => {
  const { apiKey } = ParamsUtilities.getQueryParams();

  const { data, isPending } = useQuery({
    queryKey: ['detection', 'result'],
    queryFn: () => {
      return getDetectionResult(apiKey);
    },
    retryDelay: 8000,
    retry: Number.MAX_SAFE_INTEGER,
  });

  return { data, isPending };
};
