import { useStep } from '@/hooks';
import { detectionResultMapper, geoJsonMapper } from '@/mappers';
import { geoPointsToPoins } from '@/providers';
import { getCached } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { getAreaOfPolygon } from 'geolib';
import { DetectionResult, DetectionResultInVgg, Region } from '.';

const getRegions = (detectionResult: DetectionResultInVgg) => {
  const detections = Object.values(detectionResult);

  const regions: Region[] = [];

  detections.forEach(({ regions: currentRegion }) => {
    const regionsValues = Object.values(currentRegion);
    regions.push(...regionsValues);
  });

  return regions;
};

const isThereAnObstacle = (regions: Region[]) => {
  for (const region of regions) {
    if (['OBSTACLE', 'VELUX', 'CHEMINEE'].includes(region.region_attributes.label)) {
      return true;
    }
  }

  return false;
};

type TLabels =
  | 'ARBRE'
  | 'TOITURE_REVETEMENT'
  | 'PANNEAU_PHOTOVOLTAIQUE'
  | 'MOISISSURE_NOIRCIE'
  | 'MOISISSURE_CLAIR'
  | 'MOISISSURE_COULEUR'
  | 'MOISISSURE'
  | 'USURE_IMPORTANTE'
  | 'USURE_LEGER'
  | 'USURE'
  | 'FISSURE_CASSURE'
  | 'OBSTACLE'
  | 'CHEMINEE'
  | 'HUMIDITE_INTENSE'
  | 'HUMIDITE_CLAIR'
  | 'HUMIDITE'
  | 'RISQUE_FEU';

const labelingToRateLabeling = (currentLabel: TLabels) => {
  if (['MOISISSURE_NOIRCIE', 'MOISISSURE_CLAIR', 'MOISISSURE_COULEUR', 'MOISISSURE'].includes(currentLabel)) {
    return 'moisissure_rate';
  }

  if (['HUMIDITE_INTENSE', 'HUMIDITE_CLAIR', 'HUMIDITE'].includes(currentLabel)) {
    return 'humidite_rate';
  }

  if (['USURE_IMPORTANTE', 'USURE_LEGER', 'USURE', 'FISSURE_CASSURE'].includes(currentLabel)) {
    return 'usure_rate';
  }

  if (currentLabel === 'OBSTACLE') {
    return 'obstacle';
  }

  return 'unkown';
};

const getStatistics = (geojson: any) => {
  const areas: Record<string, any> = {};

  const stats: any = {};

  geojson.features.map(({ geometry, properties }: any) => {
    const { label } = properties;
    const coordinates = geometry.coordinates[0][0].map(([x, y]: any) => ({ longitude: x, latitude: y }));
    const currentArea = +getAreaOfPolygon(coordinates);
    if (areas[label]) {
      areas[label] += currentArea;
    } else {
      areas[label] = currentArea;
    }
  });

  const totalArea = getCached.area();

  Object.keys(areas).forEach(key => {
    (stats as any)[labelingToRateLabeling(key as TLabels)] = +((100 / totalArea) * areas[key]).toFixed(2);
  });

  return stats as DetectionResult['properties'];
};

export const useGeojsonQueryResult = () => {
  const { geoJsonResultUrl, areaPictureDetails, useGeoJson } = useStep(({ params }) => params);

  const queryFnVgg = async () => {
    const detectionResultText = await fetch(geoJsonResultUrl, { headers: { 'content-type': '*/*' } });
    const detectionResultJson: DetectionResultInVgg = await detectionResultText.json();

    const regions = getRegions(detectionResultJson);

    const polygons = detectionResultMapper.toPolygon(regions);
    const obstacle = isThereAnObstacle(regions);

    return { properties: { ...Object.values(detectionResultJson)[0].properties, obstacle: obstacle }, polygons };
  };

  const queryFnGeoJson = async () => {
    const geojsonText = await fetch(geoJsonResultUrl);
    const geojsonInJson = JSON.parse(await geojsonText.text());

    const stats = getStatistics(geojsonInJson);

    const conveterPayload = geoJsonMapper.toConverterPayloadGeoJSON(geojsonInJson.features, areaPictureDetails?.xTile || 0, areaPictureDetails?.yTile || 0);

    const convertedPoints = await geoPointsToPoins(conveterPayload);

    const polygons = geoJsonMapper.toPolygon(Object.values(convertedPoints)?.[0] as any);

    return {
      properties: { ...stats },
      polygons,
    };
  };
  return useQuery({ queryKey: ['geojson-result'], queryFn: useGeoJson ? queryFnGeoJson : queryFnVgg, enabled: !!geoJsonResultUrl });
};
