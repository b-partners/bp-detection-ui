import { getDetectionResult, initiateRoofProperties } from '@/providers';
import { getCached, ParamsUtilities } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DetectionResultInVgg } from './types';

interface UseQueryHeightAndSlopeResult {
  slope?: number;
  height?: number;
}

export const useQueryHeightAndSlope = (enabled: boolean = true) => {
  const [shouldRetry, setShouldRetry] = useState(enabled);

  const { apiKey } = ParamsUtilities.getQueryParams();
  const { data, isPending } = useQuery({
    queryKey: ['detection', 'result'],
    queryFn: async () => {
      const isRoofPropertiesRequestDone = getCached.isRoofPropertiesRequestDone();

      if (!isRoofPropertiesRequestDone) await initiateRoofProperties(apiKey);
      else {
        const { properties } = await getDetectionResult(apiKey);
        const vgg_file_url = properties || {};
        const detectionResultText = await fetch(vgg_file_url, { headers: { 'content-type': '*/*' } });
        const _detectionResultJson: any = await detectionResultText.json();
        const detectionResultJson: DetectionResultInVgg = Array.isArray(_detectionResultJson) ? _detectionResultJson[0] : _detectionResultJson;
        const { roof_height_data_status, roof_slope_in_degrees, roof_height_in_meters, roof_slope_data_status } = Object.values(detectionResultJson)[0] || {};
        if (!roof_height_data_status || !roof_slope_data_status) throw new Error('Get slope not done');
        return {
          slope: roof_slope_in_degrees,
          height: roof_height_in_meters,
          slopeStatus: roof_slope_data_status,
          heightStatus: roof_height_data_status,
        };
      }

      return { slope: undefined, height: undefined } as UseQueryHeightAndSlopeResult;
    },
    enabled: shouldRetry,
    retryDelay: 5000,
    retry: shouldRetry ? Number.MAX_SAFE_INTEGER : undefined,
  });

  const start = () => {
    setShouldRetry(true);
  };

  return { data, isPending, start };
};
