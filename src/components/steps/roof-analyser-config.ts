import { RoofAnalyserConfig } from '@bpartners/roof-analyser';

const readEnv = (value?: string) => {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

/**
 * Same config bpartners-web hands the roof analyser, read off the same env names. Auth is the url's apiKey. The
 * Dashboard API is the only url: the library reaches the geocoder, the imagery, the detection, the 3D and the
 * report through its bridges.
 */
export const ROOF_ANALYSER_CONFIG: Omit<RoofAnalyserConfig, 'apiKey'> = {
  apiUrl: readEnv(process.env.REACT_APP_BPARTNERS_API_URL),
  geojsonBaseUrl: readEnv(process.env.REACT_APP_GEOJSON_BASEURL),
};
