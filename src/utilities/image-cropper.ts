import { DomainPolygonType } from '@/components';

const getPolygonSize = (polygon: DomainPolygonType) => {
  const size = {
    minX: polygon.points[0].x,
    maxX: 0,
    minY: polygon.points[0].y,
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

  size.dx = 1024 - (size.maxX - size.minX);
  size.dy = 1024 - (size.maxY - size.minY);

  if (size.dx < 0 || size.dy < 0) {
    console.log(size.dx, size.dy);
  }

  return size;
};

export const getPolygonImageBoundingBox = (polygon: DomainPolygonType) => {
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

const setupTempCanvas = (imageData: ImageData, width: number, height: number) => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx?.putImageData(imageData, 0, 0);
  return tempCanvas;
};

const imageDataToBase64 = (imageData: ImageData, width: number, height: number) => {
  const tempCanvas = setupTempCanvas(imageData, width, height);
  return tempCanvas.toDataURL('image/png');
};

const imageDataToArrayBuffer = async (imageData: ImageData, width: number, height: number): Promise<ArrayBuffer> => {
  const tempCanvas = setupTempCanvas(imageData, width, height);

  const blob: Blob = await new Promise((resolve, reject) => {
    tempCanvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob.'));
      }
    }, 'image/png');
  });

  return await blob.arrayBuffer();
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

  const { x, y } = getPolygonImageBoundingBox(polygon);

  canvas.width = scaledSize;
  canvas.height = scaledSize;

  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0);
  const imageData = ctx!.getImageData(x, y, normalSize, normalSize);

  const toBase64 = () => imageDataToBase64(imageData, normalSize, normalSize);
  const toFile = () => base64ToFile(toBase64(), 'cropped-image.png');
  const toArrayBuffer = () => imageDataToArrayBuffer(imageData, normalSize, normalSize);

  return {
    data: imageData.data,
    boundingBox: { x, y },
    toBase64,
    toFile,
    toArrayBuffer,
  };
};
