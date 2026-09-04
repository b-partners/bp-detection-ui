import { DomainPolygonResultType } from '@/components';
import { Properties } from '@/queries';
import { getCached } from '@/utilities';
import { AreaPictureAnnotation, AreaPictureAnnotationInstance, AreaPictureDetails, Wearness } from '@bpartners/typescript-client';
import { v4 } from 'uuid';

const getWearness = (wearLevel: number) => {
  if (wearLevel <= 10) return Wearness.LOW;
  if (wearLevel <= 50) return Wearness.PARTIAL;
  if (wearLevel <= 90) return Wearness.ADVANCED;
  return Wearness.EXTREME;
};

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
    labelName: "Résultats de l'analyse de la toiture",
    labelType: 'roof',
    areaPictureId: areaPictureDetails.id,
    polygon: {
      points: roofPolygon.points,
    },
    userId: userId || '',
    metadata: {
      area: roofPolygon.surface || +getCached.area().toFixed(2),
      covering: properties.revetement_1,
      wearLevel: properties.usure_rate,
      wearness: getWearness(properties.usure_rate || 0),
      moldRate: properties.moisissure_rate,
      revetement1: properties.revetement_1,
      humidityLevel: properties.humidite_rate,
      obstacle: properties.obstacle,
      fillColor: '#00ff0000',
      strokeColor: '#00ff00',
    },
  };

  const annotations: AreaPictureAnnotationInstance[] = polygons.slice(1).map(polygon => {
    const annotation: AreaPictureAnnotationInstance = {
      annotationId: annotationId,
      id: polygon.id,
      labelName: polygon.label,
      labelType: 'roof',
      areaPictureId: areaPictureDetails.id,
      polygon: {
        points: polygon.points,
      },
      userId: userId || '',
      metadata: {
        area: properties.roof_area_in_m2,
        fillColor: polygon.fillColor,
        strokeColor: polygon.strokeColor,
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
      llm,
      roofDelimiter: getCached.roofDelimiterLongLat(),
    },
  };

  return result;
};
