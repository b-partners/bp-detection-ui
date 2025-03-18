import { polygonMapper } from '@/mappers/polygon-mapper';
import { getDetectionResult, pointsToGeoPoints, processDetection } from '@/providers';
import { getImageSize, getQueryParams } from '@/utilities';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { useMutation, useQuery } from '@tanstack/react-query';

interface MutationProps {
  polygons: Polygon[];
  receiverEmail: string;
}

export const useQueryStartDetection = (src: string, areaPictureDetails: AreaPictureDetails) => {
  const mutationFn = async ({ polygons, receiverEmail }: MutationProps) => {
    const imageSize = await getImageSize(src);
    const geoJson = polygonMapper.toRefererGeoJson(polygons[0], imageSize, areaPictureDetails);
    const refererGeoJson = (await pointsToGeoPoints(geoJson))?.[0];
    if (!refererGeoJson) return null;
    const { geoDetectionApiKey } = getQueryParams();
    const result = processDetection(refererGeoJson, receiverEmail, geoDetectionApiKey, areaPictureDetails.actualLayer?.name ?? '');
    return result;
  };

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['detection', 'processing'],
    mutationFn: mutationFn,
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};

export const useQueryDetectionResult = () => {
  const { geoDetectionApiKey } = getQueryParams();
  const { data, isPending } = useQuery({
    queryKey: ['detection', 'result'],
    queryFn: () => getDetectionResult(geoDetectionApiKey),
    retryDelay: 8000,
    retry: Number.MAX_SAFE_INTEGER,
  });

  return { data, isPending };
};
