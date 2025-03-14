import { polygonMapper } from '@/mappers/polygon-mapper';
import { pointsToGeoPoints } from '@/providers';
import { getImageSize } from '@/utilities';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';

export const useQueryStartDetection = (src: string, areaPictureDetails: AreaPictureDetails) => {
  const mutationFn = async (polygons: Polygon[]) => {
    const imageSize = await getImageSize(src);
    const geoJson = polygonMapper.toRefererGeoJson(polygons[0], imageSize, areaPictureDetails);
    const refererGeoJson = (await pointsToGeoPoints(geoJson))?.[0];
    return refererGeoJson;
  };

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['image from address'],
    mutationFn: mutationFn,
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};
