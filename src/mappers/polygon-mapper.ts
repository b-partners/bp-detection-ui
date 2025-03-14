import { ConverterPayloadGeoJSON } from '@/providers';
import { Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { v4 } from 'uuid';

export const polygonMapper = {
  toGeoJson(polygons: Polygon[], image_size: number, areaPicture: AreaPictureDetails): ConverterPayloadGeoJSON {
    const xCoordinates = [];
    const yCoordinates = [];

    polygons.forEach(({ points }) => {
      points.forEach(({ x, y }) => {
        xCoordinates.push(x);
        yCoordinates.push(y);
      });
    });

    return {
      filename: areaPicture.filename ?? '',
      geometry: {
        coordinates: [[[[], []]]],
        type: 'MultiPolygon',
      },
      image_size,
      x_tile: areaPicture.xTile ?? 0,
      y_tile: areaPicture.yTile ?? 0,
      zoom: 20,
      properties: {
        id: v4(),
      },
      region_attributes: {
        label: '',
      },
      type: 'MultiPolygon',
    };
  },
};
