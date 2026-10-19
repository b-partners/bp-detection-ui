export const getImageDimensions = (src: string) =>
  new Promise<{ width: number; height: number }>(resolve => {
    const newImg = new Image();
    newImg.src = src;
    newImg.onload = () => {
      resolve({ width: newImg.width, height: newImg.height });
    };
  });

export const getImageSize = (src: string) =>
  new Promise<number>(resolve => {
    const newImg = new Image();
    newImg.src = src;
    newImg.onload = () => {
      resolve(newImg.width);
    };
  });
