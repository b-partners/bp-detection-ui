import { polygonMapper } from '@/mappers/polygon-mapper';
import { pointsToGeoPoints, processDetection } from '@/providers';
import { getImageSize, getQueryParams } from '@/utilities';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';

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
    const result = processDetection(refererGeoJson, receiverEmail, geoDetectionApiKey);
    return result;
  };

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['image from address'],
    mutationFn: mutationFn,
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};
