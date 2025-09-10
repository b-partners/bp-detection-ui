import { initiateRoofProperties } from '@/providers';
import { ParamsUtilities } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useQueryHeightAndSlope = (enabled: boolean = true) => {
  const [shouldRetry, setShouldRetry] = useState(enabled);

  const { apiKey } = ParamsUtilities.getQueryParams();
  const { data, isPending } = useQuery({
    queryKey: ['detection', 'result'],
    queryFn: async () => {
      const data = await initiateRoofProperties(apiKey);

      const roofDelimiter = data?.roofDelimiter;

      if (!roofDelimiter?.roofHeightInMeter) throw new Error('RoofDelimiter is missing');
      setShouldRetry(false);
      return { slope: roofDelimiter?.roofSlopeInDegree || 0, height: roofDelimiter?.roofHeightInMeter };
    },
    enabled: shouldRetry,
    retryDelay: 5000,
    retry: shouldRetry ? Number.MAX_SAFE_INTEGER : undefined,
  });

  return { data, isPending };
};
