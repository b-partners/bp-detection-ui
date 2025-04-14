import { ShapeAttributes } from '@/providers';
import { GeoShapeAttributes, getColorFromMain, Point, Polygon } from '@bpartners/annotator-component';
import { v4 } from 'uuid';

interface Feature {
  type: 'Feature';
  properties: {
    confidence: number;
    label: string;
  };
  geometry: {
    type: 'MultiPolygon';
    coordinates: Array<Array<Array<number[]>>>;
  };
}
export interface GeoJson {
  features: Feature[];
  type: 'FeatureCollection';
}

interface ConverterPayload {
  size: number;
  filename: string;
  zoom: number;
  regions: Record<
    string,
    {
      shape_attributes: ShapeAttributes;
      region_attributes: {
        label: string;
        confidence: number;
      };
    }
  >;
  base64_img_data: any;
}

const coordinatesToShapeAttributes = (coordinates: Feature['geometry']['coordinates']) => {
  const res: GeoShapeAttributes = { all_points_x: [], all_points_y: [], name: 'polygon' };

  coordinates[0][0].forEach(([lng, lat]) => {
    res.all_points_x.push(lng);
    res.all_points_y.push(lat);
  });

  return res;
};

export const geoShapeAttributesToPoints = (shapeAttributes: ShapeAttributes, offsets: Point) => {
  const points: Point[] = [];

  shapeAttributes.all_points_x.forEach((x, index) => {
    points.push({ x: x + offsets.x, y: shapeAttributes.all_points_y[index] + offsets.y });
  });

  return points;
};

const colors = {
  PASSAGE_PIETON: '#0000ff',
  BATI_TUILES: '#ff0000',
  LINE: '#f0f0f0',
  ESPACE_VERT: '#00ff00',
};

export const geoJsonMapper = {
  toConverterPayloadGeoJSON(feature: Feature[], x: number, y: number) {
    const filename = `${v4().replace(/\-/gi, '')}_20_${x - 1}_${y - 1}.jpg`;
    const result: ConverterPayload = {
      size: 1024,
      filename,
      zoom: 20,
      regions: {},
      base64_img_data: null,
    };

    feature.forEach(({ geometry: { coordinates }, properties: { label } }, index) => {
      const region = {
        shape_attributes: coordinatesToShapeAttributes(coordinates),
        region_attributes: {
          label,
          confidence: 0.7055366635322571,
        },
      };
      result.regions[index] = region;
    });

    return {
      [filename]: result,
    };
  },
  toPolygon(geoJson: ConverterPayload, offsets: Point, tiles: Point) {
    const regions = geoJson.regions;

    const [_, currentXTile, currentYTile] = geoJson.filename.match(/\d+_(\d+)_(\d+)/) || [0, 0, 0];
    const polygons: Polygon[] = [];

    Object.values(regions).forEach(({ shape_attributes, region_attributes: { label } }) => {
      const { fillColor, strokeColor } = getColorFromMain(colors[label as keyof typeof colors]);
      polygons.push({
        id: v4(),
        fillColor,
        strokeColor,
        points: geoShapeAttributesToPoints(shape_attributes, {
          x: 1024 * Math.abs(tiles.x - +currentXTile) - offsets.x,
          y: 1024 * Math.abs(tiles.y - +currentYTile) - offsets.y,
        }),
      });
    });

    return polygons;
  },
};
