import { Geojson, GeojsonReturn, GeoShapeAttributes, Polygon } from '@bpartners/annotator-component';
import { AreaPictureDetails } from '@bpartners/typescript-client';
import { v4 } from 'uuid';

const toGeoShapeAttributes = (polygon: Polygon): GeoShapeAttributes => {
  const shapeAttributes: GeoShapeAttributes = {
    all_points_x: [],
    all_points_y: [],
    name: 'polygon',
  };
  polygon.points.forEach(({ x, y }) => {
    shapeAttributes.all_points_x.push(x);
    shapeAttributes.all_points_y.push(y);
  });
  return shapeAttributes;
};

export const polygonMapper = {
  toRefererGeoJson(polygon: Polygon, image_size: number, areaPicture: AreaPictureDetails) {
    const currentGeoJson: Geojson = {
      filename: areaPicture.filename ?? '',
      regions: {},
      region_attributes: {
        label: 'pathway',
      },
      image_size,
      zoom: 20,
    };

    currentGeoJson.regions[polygon.id] = {
      id: polygon.id,
      shape_attributes: toGeoShapeAttributes(polygon),
    };

    return currentGeoJson;
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
