import { DomainPolygonType } from '@/components';

const getPolygonSize = (polygon: DomainPolygonType) => {
  const size = {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    dx: 0,
    dy: 0,
  };

  for (const point of polygon.points) {
    size.minX = Math.min(size.minX, point.x);
    size.maxX = Math.max(size.maxX, point.x);
    size.minY = Math.min(size.minY, point.y);
    size.maxY = Math.max(size.maxY, point.y);
  }

  size.dx = size.maxX - size.minX;
  size.dy = size.maxY - size.minY;

  if (size.dx > 1024 || size.dy > 1024) {
    console.log(size.dx, size.dy);
  }

  return size;
};

export const getPolygnImageBoundingBox = (polygon: DomainPolygonType) => {
  const { dx, dy, minX, minY, maxX, maxY } = getPolygonSize(polygon);
  const paddingX = dx / 2;
  const paddingY = dy / 2;
  const imageSize = 1024 * 3;

  const boundingBox = {
    x: minX - paddingX,
    y: minY - paddingY,
  };

  if (boundingBox.x < 0) boundingBox.x = 0;
  const imageXSizeWithPadding = maxX + paddingX;
  if (imageXSizeWithPadding > imageSize) {
    boundingBox.x -= imageXSizeWithPadding - imageSize;
  }

  if (boundingBox.y < 0) boundingBox.y = 0;
  const imageYSizeWithPadding = maxY + paddingY;
  if (imageYSizeWithPadding > imageSize) {
    boundingBox.y -= imageYSizeWithPadding - imageSize;
  }

  return boundingBox;
};
