import { DomainPolygonResultType } from '@/components';
import { Region } from '@/queries';
import { getColorFromMain } from '@bpartners/annotator-component';
import { v4 } from 'uuid';
import { detectionResultColors } from './constants';

export const detectionResultMapper = {
  toPolygon(regions: Region[], filterByLabel = true) {
    const polygons: DomainPolygonResultType[] = [];

    const availableLabels = Object.keys(detectionResultColors);

    const filteredRegions = filterByLabel ? regions.filter(({ region_attributes: { label } }) => availableLabels.includes(label)) : regions;

    filteredRegions.forEach(({ shape_attributes: { all_points_x, all_points_y }, region_attributes: { label } }) => {
      const points: DomainPolygonResultType['points'] = all_points_x.map((x, yIndex) => ({ x, y: all_points_y[yIndex] }));

      const polygon: DomainPolygonResultType = {
        id: v4(),
        label,
        points,
        ...getColorFromMain(detectionResultColors[label]),
      };

      polygons.push(polygon);
    });

    return polygons;
  },
};
