import { GeojsonReturn, GeoShapeAttributes, Point, Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { v4 } from 'uuid';
import { ConverterPayload } from './types';

const toGeoShapeAttributes = (polygon: Polygon, offsets: Point): GeoShapeAttributes => {
  const shapeAttributes: GeoShapeAttributes = {
    all_points_x: [],
    all_points_y: [],
    name: 'polygon',
  };
  polygon.points.forEach(({ x, y }) => {
    shapeAttributes.all_points_x.push(x + offsets.x);
    shapeAttributes.all_points_y.push(y + offsets.y);
  });
  return shapeAttributes;
};

export const polygonMapper = {
  toRefererGeoJson(polygon: Polygon, image_size: number, areaPicture: AreaPictureDetails) {
    const filename = `${v4().replace(/\-/gi, '')}_20_${(areaPicture.xTile || 0) - 1}_${(areaPicture.yTile || 0) - 1}.jpg`;

    const result: ConverterPayload = {
      size: image_size,
      filename,
      zoom: 20,
      regions: {},
      base64_img_data: null,
    };

    const offsets = { x: areaPicture.xOffset || 0, y: areaPicture.yOffset || 0 };

    result.regions = {
      '1': {
        shape_attributes: toGeoShapeAttributes(polygon, !areaPicture.isExtended ? offsets : { x: 0, y: 0 }),
        region_attributes: {
          label: 'polygon',
          confidence: 0.7055366635322571,
        },
      },
    };

    return {
      [filename]: result,
    };
  },
  toGeoJsonZone(refererGeojson: GeojsonReturn) {
    const {
      geometry: { coordinates },
    } = refererGeojson;
    const geoJsonZone = {
      id: v4(),
      zoom: 20,
      geometry: {
        type: 'MultiPolygone',
        coordinates,
      },
    };

    return geoJsonZone;
  },
};
