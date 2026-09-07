import { ParamsUtilities } from '@/utilities';

/** Entering this exact apiKey switches the whole app to demo mode — mocked data, no network calls. */
export const DEMO_API_KEY = '1111';

export const isDemoApiKey = (apiKey?: string): boolean => {
  const key = apiKey ?? ParamsUtilities.getQueryParams().apiKey;
  return key === DEMO_API_KEY;
};
