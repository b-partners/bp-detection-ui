import { useStep } from '@/hooks';
import { detectionResultMapper } from '@/mappers';
import { useQuery } from '@tanstack/react-query';
import { DetectionResultInVgg, Region } from '.';

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

export const useGeojsonQueryResult = () => {
  const { geoJsonResultUrl } = useStep(({ params }) => params);

  const queryFn = async () => {
    const detectionResultText = await fetch(geoJsonResultUrl, { headers: { 'content-type': '*/*' } });
    const detectionResultJson: DetectionResultInVgg = await detectionResultText.json();

    const regions = getRegions(detectionResultJson);

    const polygons = detectionResultMapper.toPolygon(regions);
    const obstacle = isThereAnObstacle(regions);

    return { properties: { ...Object.values(detectionResultJson)[0].properties, obstacle: obstacle }, polygons };
  };

  return useQuery({ queryKey: ['geojson-result'], queryFn, enabled: !!geoJsonResultUrl });
};
