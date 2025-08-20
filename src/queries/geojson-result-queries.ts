import { createImage, getCropepedImageAndPolygons, useStep } from '@/hooks';
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

export const useGeojsonQueryResult = (imageUrl?: string) => {
  const { geoJsonResultUrl } = useStep(({ params }) => params);

  const queryFnVgg = async () => {
    const detectionResultText = await fetch(geoJsonResultUrl, { headers: { 'content-type': '*/*' } });
    const detectionResultJson: DetectionResultInVgg = await detectionResultText.json();

    const regions = getRegions(detectionResultJson);

    const polygons = detectionResultMapper.toPolygon(regions);
    const obstacle = isThereAnObstacle(regions);

    if (!imageUrl) return null;
    const image = await createImage(imageUrl);
    const { image: createdImage, polygons: mappedPolygons } = getCropepedImageAndPolygons(polygons, image);

    return { properties: { ...Object.values(detectionResultJson)[0].properties, obstacle: obstacle }, polygons: mappedPolygons, createdImage };
  };

  return useQuery({ queryKey: ['geojson-result'], queryFn: queryFnVgg, enabled: !!geoJsonResultUrl });
};
