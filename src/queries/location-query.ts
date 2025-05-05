import { useStep } from '@/hooks';
import { locationProvider } from '@/providers';
import { useMutation } from '@tanstack/react-query';

export const useLocationQuery = () => {
  const { sessionId } = useStep(({ params }) => params);

  const mutationFn = async (query: string) => {
    if (!query || query.length === 0) {
      return [];
    }
    const result = await locationProvider(sessionId || '', query);
    return result;
  };

  const { mutate: findLocation, data: locationData, isPending: isFindLocationPending } = useMutation({ mutationFn, mutationKey: ['findlocation'] });

  return { findLocation, locationData, isFindLocationPending };
};
