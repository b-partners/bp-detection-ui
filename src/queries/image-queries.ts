import { getQueryParams } from '@/utilities';
import { useMutation } from '@tanstack/react-query';
import { getImageFromAddress } from '../providers';

const mutationFn = (address: string) => {
  const { apiKey } = getQueryParams();
  return getImageFromAddress(apiKey, address);
};

export const useQueryImageFromAddress = () => {
  const { isPending, data, mutate } = useMutation({ mutationKey: ['image from address'], mutationFn });
  return { isQueryImagePending: isPending, imageSrc: data, queryImage: mutate };
};
