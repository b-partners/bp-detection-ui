import { cache } from '@/utilities';
import { v4 } from 'uuid';
import { buildDemoDetectionResult, demoMercatorResult, demoReferencerResult } from './demo-data';

/**
 * Mock implementations of `src/providers/detection-provider.ts`'s raw-fetch calls to the
 * geo-detection lambda, and `src/providers/polygon-converter-provider.ts`'s raw-fetch calls
 * to the mercator/referencer lambdas.
 */

export const demoProcessDetection = async (address: string) => {
  cache.detectionId(v4());
  return { result: buildDemoDetectionResult(address), geoJson: {} };
};

export const demoSendImageToDetect = async () => ({});
export const demoSendPdfToMail = async () => ({});
export const demoSendRooferInformationsToMail = async () => ({});

export const demoPointsToGeoPoints = async () => demoMercatorResult;
export const demoReferencerPointsToGeoPoints = async () => demoReferencerResult;
