import { DomainPolygonResultType } from '@/components';
import { Properties } from '@/queries';
import { getCached } from '@/utilities';
import { AreaPictureAnnotation, AreaPictureAnnotationInstance, AreaPictureDetails } from '@bpartners/typescript-client';
import { v4 } from 'uuid';

export const saveAnnotationsMapper = (
  areaPictureDetails: AreaPictureDetails,
  polygons: DomainPolygonResultType[],
  properties: Properties & { obstacle: string },
  llm: string
) => {
  const annotationId = v4();
  const { userId } = getCached.userInfo();

  const roofPolygon = polygons[0];
  const roofAnnotation: AreaPictureAnnotationInstance = {
    annotationId: annotationId,
    id: roofPolygon.id,
    labelName: roofPolygon.label,
    areaPictureId: areaPictureDetails.id,
    polygon: {
      points: roofPolygon.points,
    },
    userId: userId || '',
    metadata: {
      area: roofPolygon.surface,
    },
  };

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
        area: properties.roof_area_in_m2,
        covering: properties.revetement_1,
        fillColor: roofPolygon.fillColor,
        strokeColor: roofPolygon.strokeColor,
        height: properties.roof_height_in_meters,
        slope: properties.roof_slope_in_degrees,
        moldRate: properties.moisissure_rate,
        revetement1: properties.revetement_1,
        revetement2: properties.revetement_2,
        humidityLevel: properties.humidite_rate,
        obstacle: properties.obstacle,
      },
    };

    return annotation;
  });

  const result: AreaPictureAnnotation = {
    annotations: [roofAnnotation, ...annotations],
    id: annotationId,
    idAreaPicture: areaPictureDetails.id || '',
    isDraft: true,
    properties: {
      global_rate_type: properties.global_rate_type,
      global_rate_value: properties.global_rate_value,
      roofHeight: properties.roof_height_in_meters,
      llm,
    },
  };

  return result;
};
