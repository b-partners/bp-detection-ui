import { useStep } from '@/hooks';
import { geoJsonMapper } from '@/mappers/geojson-mapper';
import { geoPointsToPoins } from '@/providers';
import { getCached } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';

const getStatistics = (geojson: any) => {
  const areas: Record<string, any> = {};
  const stats: { percentage: number; label: string }[] = [];
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
    stats.push({ percentage: +((100 / totalArea) * areas[key]).toFixed(2), label: key });
  });

  return stats;
};

export const useGeojsonQueryResult = () => {
  const { areaPictureDetails, geoJsonResultUrl } = useStep(({ params }) => params);

  const queryFn = async () => {
    const geojsonText = await fetch(geoJsonResultUrl);
    const geojsonInJson = JSON.parse(await geojsonText.text());

    const stats = getStatistics(geojsonInJson);

    const conveterPayload = geoJsonMapper.toConverterPayloadGeoJSON(geojsonInJson.features, areaPictureDetails?.xTile || 0, areaPictureDetails?.yTile || 0);

    const convertedPoints = await geoPointsToPoins(conveterPayload);
    const polygons: any = [];

    Object.values(convertedPoints).forEach(conveterPayload => {
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

    return { stats, polygons };
  };

  return useQuery({ queryKey: ['geojson-result'], queryFn, enabled: !!geoJsonResultUrl });
};
