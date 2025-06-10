import { DomainPolygonType, ErrorMessageDialog } from '@/components';
import { useDialog, useStep } from '@/hooks';
import { polygonMapper } from '@/mappers/polygon-mapper';
import { bpProspectApi, getDetectionResult, pointsToGeoPoints, processDetection } from '@/providers';
import { base64ToArrayBuffer, cache, getCached, getImageSize, ParamsUtilities } from '@/utilities';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import { sendImageQuery } from './image-queries';

interface MutationProps {
  polygons: DomainPolygonType[];
  receiverEmail: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  isExtended?: boolean;
  isExtendedImage?: Promise<{ image?: ArrayBuffer; polygons?: DomainPolygonType[] }>;
  withoutImage?: boolean;
}

export const useQueryStartDetection = (src: string, areaPictureDetails: AreaPictureDetails) => {
  const {
    params: { prospect },
    setStep,
    actualStep,
  } = useStep();
  const { open: openDialog } = useDialog();

  const mutationFn = async ({
    polygons: noCroppedPolygons,
    receiverEmail,
    phone,
    firstName,
    lastName,
    isExtended,
    isExtendedImage,
    image,
    withoutImage = false,
  }: MutationProps) => {
    const { apiKey } = ParamsUtilities.getQueryParams();

    const { image: croppedImage, polygons: croppedPolygons } = (await isExtendedImage) || {};

    if (isExtended && croppedImage && !withoutImage) {
      await sendImageQuery(areaPictureDetails, croppedImage, 'image/*');
    } else if (!isExtended && image && !withoutImage) {
      await sendImageQuery(areaPictureDetails, base64ToArrayBuffer(image), 'image/*');
    }

    const polygons = isExtended ? (croppedPolygons as any as DomainPolygonType[]) : noCroppedPolygons;

    const imageSize = await getImageSize(src);
    const geoJson = polygonMapper.toRefererGeoJson(polygons[0], imageSize, areaPictureDetails);
    const refererGeoJson: any = (await pointsToGeoPoints(geoJson as any)) || {};

    const regions = (Object.values(refererGeoJson)[0] as any)?.regions;
    const { all_points_x, all_points_y } = (Object.values(regions)[0] as any)?.shape_attributes || {};

    const coordinates: any[] = [];

    (all_points_x as any[])?.forEach((latitude, index) => {
      coordinates.push({ latitude, longitude: all_points_y[index] });
    });

    const area = getAreaOfPolygon(coordinates);

    cache.area(area);

    if (!refererGeoJson) return null;

    const mappedCoordinates: number[][] = [];

    if (!withoutImage) {
      polygons[0].points.forEach(({ x, y }) => {
        mappedCoordinates.push([y, x]);
      });
    } else {
      (all_points_x as any[])?.forEach((x, index) => {
        mappedCoordinates.push([all_points_y[index], x]);
      });
    }

    if (prospect) {
      const { data } = await bpProspectApi(apiKey).updateProspects(getCached.userInfo().accountHolderId || '', [
        { ...prospect, email: receiverEmail, firstName, name: lastName, phone },
      ]);
      setStep({ params: { prospect: data[0], polygons }, actualStep });
    }

    return await processDetection(
      areaPictureDetails.actualLayer?.name ?? '',
      `${areaPictureDetails.address}`,
      [[mappedCoordinates]],
      receiverEmail,
      withoutImage
    );
  };

  const { isPending, data, mutate } = useMutation({
    mutationKey: ['detection', 'processing'],
    mutationFn: mutationFn,
    onError: e => {
      let errorMessage = 'La détection sur cette zone a échoué, veuillez réessayer';
      if (e.message === 'polygonTooBig') errorMessage = 'La délimitation que vous avez faite est trop grande et ne peut pas encore être prise en charge.';
      openDialog(<ErrorMessageDialog message={errorMessage} />);
    },
    onSuccess(data) {
      setStep({ params: { detection: data?.result }, actualStep });
    },
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};

export const useQueryDetectionResult = () => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const {
    params: { useGeoJson, detection },
  } = useStep();

  const { data, isPending } = useQuery({
    queryKey: ['detection', 'result'],
    enabled: !useGeoJson,
    queryFn: () => {
      return getDetectionResult(apiKey);
    },
    retryDelay: 8000,
    retry: Number.MAX_SAFE_INTEGER,
  });

  return { data: useGeoJson ? detection : data, isPending };
};
