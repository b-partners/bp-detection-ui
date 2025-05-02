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

const imageDataToBase64 = (imageData: ImageData, width: number, height: number) => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx?.putImageData(imageData, 0, 0);
  return tempCanvas.toDataURL('image/png');
};

const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: 'image/png' });
};

export const createImageFromPolygon = (polygon: DomainPolygonType, canvas: HTMLCanvasElement, image: HTMLImageElement) => {
  const normalSize = 1024;
  const scaledSize = normalSize * 3;

  const { x, y } = getPolygnImageBoundingBox(polygon);

  canvas.width = scaledSize;
  canvas.height = scaledSize;

  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0);
  const imageData = ctx?.getImageData(x, y, normalSize, normalSize);
  if (!imageData) return;

  const toBase64 = () => imageDataToBase64(imageData, normalSize, normalSize);
  const toFile = () => base64ToFile(toBase64(), 'cropped-image.png');

  return {
    data: imageData.data,
    toBase64,
    toFile,
  };
};
