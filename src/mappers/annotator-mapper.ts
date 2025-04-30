import { DomainPolygonType, ShiftNbDomainType } from '@/components';
import { Point, Polygon } from '@bpartners/annotator-component';

const shiftNbPrefix = 'SHIFT_NB';
const shiftNbPattern = /SHIFT_NB_([\d]+)_([\d]+)/;

const getShiftNbFromId = (id: string, shiftNb: ShiftNbDomainType) => {
  const result = id.match(shiftNbPattern);
  if (!result) return shiftNb;
  return { x: +result[1], y: +result[2] };
};

const removeIdPrefix = (id: string) => id.split('_' + shiftNbPrefix)[0];

const setShiftNbToId = (id: string, shiftNb: ShiftNbDomainType) => {
  const { x = 0, y = 0 } = getShiftNbFromId(id, shiftNb) || {};
  return `${id}_${shiftNbPrefix}_${x}_${y}`;
};

const polygonPointsMapper = {
  addShift(points: Point[], currentShiftNb: ShiftNbDomainType, shiftNb: ShiftNbDomainType) {
    const offset = {
      x: (shiftNb.x - currentShiftNb.x) * 1024,
      y: (shiftNb.y - currentShiftNb.y) * 1024,
    };

    return points.map(({ x, y }) => ({ x: offset.x + x, y: offset.y + y }));
  },
  removeShift(points: Point[], currentShiftNb: ShiftNbDomainType, shiftNb: ShiftNbDomainType) {
    const offset = {
      x: (shiftNb.x - currentShiftNb.x) * 1024,
      y: (shiftNb.y - currentShiftNb.y) * 1024,
    };
    return points.map(({ x, y }) => ({ x: x - offset.x, y: y - offset.y }));
  },
};

export const annotatorMapper = {
  toDomainPolygon(polygon: Polygon, shiftNb: ShiftNbDomainType): DomainPolygonType {
    const customShiftNb = getShiftNbFromId(polygon.id, shiftNb);

    const points = polygonPointsMapper.removeShift(polygon.points, shiftNb, customShiftNb);
    const customId = removeIdPrefix(polygon.id);
    const result = { ...polygon, points, shiftNb: customShiftNb, id: customId };
    return result;
  },
  toPolygonRest(_polygon: DomainPolygonType, shiftNb: ShiftNbDomainType): Polygon {
    const polygon = { ..._polygon };

    const customShiftNb = polygon.shiftNb || shiftNb;
    const points = polygonPointsMapper.addShift(polygon.points, shiftNb, customShiftNb);

    const id = setShiftNbToId(polygon.id, customShiftNb);
    delete polygon.shiftNb;
    const result: Polygon = { ...polygon, points, id };
    return result;
  },
};
