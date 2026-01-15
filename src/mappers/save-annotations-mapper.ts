import { DomainPolygonResultType } from '@/components';
import { Properties } from '@/queries';
import { getCached } from '@/utilities';
import { AreaPictureAnnotation, AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import { v4 } from 'uuid';

export const saveAnnotationsMappers = (
  areaPictureDetails: AreaPictureDetails,
  polygons: DomainPolygonResultType[],
  properties: Properties & { obstacle: string },
  slope: number,
  height: number
) => {
  const annotationId = v4();
  const { userId } = getCached.userInfo();

  const roofAnnotation = [];

  const annotations: AreaPictureAnnotationInstance[] = polygons.slice(1).map(polygon => {
    const annotation: AreaPictureAnnotationInstance = {
      annotationId: annotationId,
      id: polygon.id,
      labelName: polygon.label,
      areaPictureId: areaPictureDetails.id,
      polygon: {
        points: polygon.points,
      },
      userId: userId || '',
      metadata: {
        area: polygon.surface,
      },
    };

    return annotation;
  });

  const result: AreaPictureAnnotation = {
    annotations,
    id: '',
    idAreaPicture: '',
    isDraft: true,
    properties: {},
  };

  return result;
};
