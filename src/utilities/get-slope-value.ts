const degToRad = (degrees: number) => degrees * (Math.PI / 180);

interface RoofDelimiter {
  roofSlopeInDegree: number;
  roofHeightInMeter: number;
  polygon?: any;
}

export const getSlopeValue = (roofDelimiter: RoofDelimiter) => {
  const roofHalfWidth = roofDelimiter.roofHeightInMeter / Math.tan(degToRad(roofDelimiter.roofSlopeInDegree));
  const result = roofDelimiter.roofHeightInMeter * (12 / roofHalfWidth);
  return Math.round(result);
};
