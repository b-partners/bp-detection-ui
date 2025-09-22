import { ErrorMessageDialog } from '@/components';
import { useDialog } from '@/hooks';
import { initiateRoofProperties } from '@/providers';
import { ParamsUtilities } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useQueryHeightAndSlope = (enabled: boolean = true) => {
  const [shouldRetry, setShouldRetry] = useState(enabled);
  const { open } = useDialog();

  const { apiKey } = ParamsUtilities.getQueryParams();
  const { data, isPending } = useQuery({
    queryKey: ['detection', 'result'],
    queryFn: async () => {
      const data = await initiateRoofProperties(apiKey);

      const roofDelimiter = data?.roofDelimiter;

      if (isNaN(roofDelimiter?.roofHeightInMeter)) throw new Error('RoofDelimiter is missing');
      setShouldRetry(false);
      if (roofDelimiter.roofHeightInMeter === 0) {
        open(<ErrorMessageDialog message='Les données de hauteur et de pente seront disponibles prochainement.' />);
      }
      return { slope: roofDelimiter?.roofSlopeInDegree || 0, height: roofDelimiter?.roofHeightInMeter };
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
