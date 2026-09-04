import { locationProvider } from '@/providers';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLocationQuery = (sessionId: string) => {
  const navigate = useNavigate();

  const mutationFn = async (query: string) => {
    if (!query || query.length === 0) {
      return [];
    }
    const result = await locationProvider(sessionId || '', query);
    return result;
  };

  const { mutate, data, isPending } = useMutation({
    mutationFn,
    mutationKey: ['findlocation'],
    onError: (e: any) => {
      if (e?.status === 403) navigate('/api-key');
    },
  });

  return { mutate, data, isPending };
};
