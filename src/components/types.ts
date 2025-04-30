import { detectionResultColors } from '@/mappers';
import { Point, Polygon } from '@bpartners/annotator-component';

export type ShiftNbDomainType = Point;

export type DomainPolygonType = Polygon & { shiftNb?: ShiftNbDomainType };

export type DomainPolygonResultType = Polygon & { label: keyof typeof detectionResultColors };
