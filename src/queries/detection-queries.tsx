import { DomainPolygonType, ErrorMessageDialog } from '@/components';
import { useDialog, useStep } from '@/hooks';
import { polygonMapper } from '@/mappers/polygon-mapper';
import { pointsToGeoPoints, processDetection } from '@/providers';
import { cache, getImageSize } from '@/utilities';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import { useQueryHeightAndSlope } from './height-and-slope-query';

interface MutationProps {
  polygons: DomainPolygonType[];
  receiverEmail: string;
}

export const useQueryStartDetection = (src: string, areaPictureDetails: AreaPictureDetails) => {
  const { setStep, actualStep } = useStep();
  const { open: openDialog } = useDialog();
  const { start: startPropertiesQuery, end: endPropertiesQuery } = useQueryHeightAndSlope(false);

  const mutationFn = async ({ polygons, receiverEmail }: MutationProps) => {
    const imageSize = await getImageSize(src);
    cache.roofDelimiterPolygon(polygons[0]);
    const geoJson = polygonMapper.toRefererGeoJson(polygons[0], imageSize, areaPictureDetails);
    const refererGeoJson: any = (await pointsToGeoPoints(geoJson as any)) || {};

    const regions = (Object.values(refererGeoJson)[0] as any)?.regions;
    const { all_points_x: xpoints, all_points_y } = (Object.values(regions)[0] as any)?.shape_attributes || {};
    const all_points_x = xpoints.slice(0, xpoints.length - 1);
    const coordinates: any[] = [];

    (all_points_x as any[])?.forEach((latitude, index) => {
      coordinates.push({ latitude, longitude: all_points_y[index] });
    });

    const area = getAreaOfPolygon(coordinates);

    cache.area(area);

    if (!refererGeoJson) return null;

    const mappedCoordinates: number[][] = [];

    (all_points_x as any[])?.forEach((x, index) => {
      mappedCoordinates.push([all_points_y[index], x]);
    });

    startPropertiesQuery();
    return await processDetection(areaPictureDetails.actualLayer?.name ?? '', `${areaPictureDetails.address}`, [mappedCoordinates], receiverEmail);
  };

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['detection', 'processing'],
    mutationFn: mutationFn,
    onError: e => {
      endPropertiesQuery();
      let errorMessage = 'La détection sur cette zone a échoué, veuillez réessayer';
      if (e.message === 'featureNotAllowed') errorMessage = "Vous n'êtes pas autorisé à effectuer une detection sur cette zone.";
      if (e.message === 'polygonTooBig') errorMessage = 'La délimitation que vous avez faite est trop grande et ne peut pas encore être prise en charge.';
      if (e.message === 'detectionLimitExceeded') errorMessage = 'La limite des analyses gratuites a été atteinte.';
      openDialog(<ErrorMessageDialog message={errorMessage} />);
    },
    onSuccess(data) {
      setStep({ params: { detection: data?.result }, actualStep });
    },
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};
