import { useStep } from '@/hooks';
import { geoJsonMapper } from '@/mappers/geojson-mapper';
import { pointsToGeoPoints } from '@/providers';
import { getCached } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';

const getStatistics = (geojson: any) => {
  const regions = (Object.values(geojson)[0] as any)?.regions || {};

  const stats: Record<string, any> = {};

  Object.values(regions).forEach(({ region_attributes, shape_attributes }: any) => {
    const label = region_attributes.label;
    const coordinates: { longitude: number; latitude: number }[] = [];

    shape_attributes.all_points_x.forEach((x: number, index: number) => {
      coordinates.push({ longitude: x, latitude: shape_attributes.all_points_y[index] });
    });
    const currentArea = +getAreaOfPolygon(coordinates);
    if (stats[label]) {
      stats[label] += currentArea;
    } else {
      stats[label] = currentArea;
    }
  });

  const totalArea = getCached.area();

  Object.keys(stats).forEach(key => {
    stats[key] = +((100 / totalArea) * stats[key]).toFixed(2);
  });

  return stats;
};

export const useGeojsonQueryResult = () => {
  const { areaPictureDetails, geoJsonResultUrl } = useStep(({ params }) => params);

  const queryFn = async () => {
    const geojsonText = await fetch(geoJsonResultUrl);
    const geojsonInJson = JSON.parse(await geojsonText.text());
    const converterPayload = geoJsonMapper.toConverterPayloadGeoJSON(geojsonInJson.features, areaPictureDetails?.xTile || 0, areaPictureDetails?.yTile || 0);
    const convertedPayload = await pointsToGeoPoints(converterPayload);

    const stats = getStatistics(convertedPayload);

    // const convertedPoints = await geoPointsToPoins(conveterPayload);
    const polygons: any = [];

    Object.values(converterPayload).forEach(conveterPayload => {
      const currentPolygons = geoJsonMapper.toPolygon(
        conveterPayload as any,
        {
          x: areaPictureDetails?.xOffset || 0,
          y: areaPictureDetails?.yOffset || 0,
        },
        { x: (areaPictureDetails?.xTile || 0) - 1, y: (areaPictureDetails?.yTile || 0) - 1 }
      );
      polygons.push(...currentPolygons);
    });

    // localStorage.clear();

    return { stats, polygons };
  };

  return useQuery({ queryKey: ['geojson-result'], queryFn, enabled: !!geoJsonResultUrl });
};
