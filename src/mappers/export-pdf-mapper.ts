import { DomainPolygonResultType } from '@/components';
import { DetectionResultInVgg } from '@/queries';
import { getFileUrl } from '@/utilities';
import {
  AreaPictureDetails,
  ExportAreaPictureAnnotation,
  ExportAreaPictureAnnotationInstance,
  ExportAreaPictureAnnotationMeasurement,
  FileType,
} from '@bpartners/typescript-client';
import { coveringTypeMap } from './constants';

export const EMPTY_ANNOTATION_INFO_VALUE = 'Non renseigné';
type FormatInfoArgs<T extends object = any, K extends keyof T = any> = {
  label: string;
  value?: K;
  translator?: T;
  unit?: string;
};
const formatInfo = <T extends object = any, K extends keyof T = any>({ label, translator, value, unit = '' }: FormatInfoArgs<T, K>) => {
  if (!value) return { label, value: EMPTY_ANNOTATION_INFO_VALUE };
  const translatedValue = translator ? translator[value] : value;
  return { label, value: translatedValue ? (translatedValue as string) + unit : EMPTY_ANNOTATION_INFO_VALUE };
};

type ExportPdfMapperParams = {
  areaPictureDetails: AreaPictureDetails;
  llm: string;
  polygons: DomainPolygonResultType[];
  properties: DetectionResultInVgg['properties']['properties'] & { obstacle: string };
  measurements: ExportAreaPictureAnnotationMeasurement[];
};

export const exportPdfMapper = (params: ExportPdfMapperParams): ExportAreaPictureAnnotation => {
  const imageUrl = getFileUrl(params.areaPictureDetails.fileId || '', FileType.AREA_PICTURE);

  const roofPolygonProperties = params.properties;

  const roofPolygon = params.polygons[0];
  const roofAnnotation: ExportAreaPictureAnnotationInstance = {
    fillColor: roofPolygon.fillColor,
    strokeColor: roofPolygon.strokeColor,
    labelName: "Résultats de l'analyse de la toiture",
    polygon: { points: roofPolygon.points },
    measurements: params.measurements,
    infos: [
      { label: 'key', value: "Résultats de l'analyse de la toiture" },
      { label: 'Surface', value: `${roofPolygonProperties.roof_area_in_m2}m²` },
      { label: 'Type', value: `Toit` },
      formatInfo({ label: 'Revêtement', value: roofPolygonProperties?.revetement_1, translator: coveringTypeMap }),
      formatInfo({ label: "Taux d'usure", value: roofPolygonProperties.usure_rate, unit: '%' }),
      formatInfo({ label: 'Taux de moisissure', value: roofPolygonProperties.moisissure_rate, unit: '%' }),
      formatInfo({ label: "Taux d'humidité", value: roofPolygonProperties.humidite_rate, unit: '%' }),
      formatInfo({ label: 'Obstacle', value: roofPolygonProperties.obstacle }),
    ],
  };

  const annotations = params.polygons.slice(1).map(p => {
    const exportPdfAnnotation: ExportAreaPictureAnnotationInstance = {
      fillColor: p.fillColor,
      strokeColor: p.strokeColor,
      polygon: {
        points: p.points,
      },
      labelName: p.label as string,
      infos: [{ label: 'key', value: p.label as string }, formatInfo({ label: 'Surface', value: p.surface, unit: 'm²' })],
      measurements: new Array(p.points.length + 1).fill(0).map(() => ({ isInvisible: true, unit: 'm', value: 0 })),
    };

    return exportPdfAnnotation;
  });

  return {
    address: params.areaPictureDetails.address || '',
    imageUrl,
    llm: params.llm,
    globalRateValue: params.properties.global_rate_value,
    globalRateType: params.properties.global_rate_type,
    annotations: [roofAnnotation, ...annotations],
  };
};
