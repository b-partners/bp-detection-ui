import { locationProvider } from '@/providers';
import { useMutation } from '@tanstack/react-query';

export const useLocationQuery = (sessionId: string) => {
  const mutationFn = async (query: string) => {
    if (!query || query.length === 0) {
      return [];
    }
    const result = await locationProvider(sessionId || '', query);
    return result;
  };

  const { mutate, data } = useMutation({ mutationFn, mutationKey: ['findlocation'] });

  return { mutate, data };
};
