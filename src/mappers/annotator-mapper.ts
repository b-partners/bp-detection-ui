import { DomainPolygonType } from '@/components';
import { Polygon } from '@bpartners/annotator-component';

const shiftNbPrefix = 'SHIFT_NB';
const shiftNbPattern = /SHIFT_NB_([\d]+)_([\d]+)/;

const getShiftNbFromId = (id: string, shiftNb: DomainPolygonType['shiftNb']) => {
  const result = id.match(shiftNbPattern);
  if (!result) return shiftNb;
  return { x: +result[1], y: +result[2] };
};

const removeIdPrefix = (id: string) => id.split('_' + shiftNbPrefix)[0];

const setShiftNbToId = (id: string, shiftNb: DomainPolygonType['shiftNb']) => {
  const { x = 0, y = 0 } = getShiftNbFromId(id, shiftNb) || {};
  return `${id}_${shiftNbPrefix}_${x}_${y}`;
};

export const annotatorMapper = {
  toDomainPolygon(polygon: Polygon, shiftNb: DomainPolygonType['shiftNb']): DomainPolygonType {
    const customShiftNb = getShiftNbFromId(polygon.id, shiftNb);
    const customId = removeIdPrefix(polygon.id);
    const result = { ...polygon, shiftNb: customShiftNb, id: customId };
    return result;
  },
  toPolygonRest(_polygon: DomainPolygonType, shiftNb: DomainPolygonType['shiftNb']): Polygon {
    const polygon = { ..._polygon };
    const id = setShiftNbToId(polygon.id, shiftNb);
    delete polygon.shiftNb;
    const result: Polygon = { ...polygon, id };
    return result;
  },
};
