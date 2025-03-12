import { useMutation } from '@tanstack/react-query';

export const useQueryStartDetection = () => {
  const { isPending, data, mutate } = useMutation({
    mutationKey: ['image from address'],
    mutationFn: () => new Promise(res => setTimeout(() => res('done'), 3000)),
  });
  return { isDetectionPending: isPending, geoJsonResult: data, startDetection: mutate };
};
