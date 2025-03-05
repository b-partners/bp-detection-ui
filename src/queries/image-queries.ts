import { useMutation } from '@tanstack/react-query';
import { getImageFromAddress } from '../providers';

export const useQueryImageFromAddress = () => {
  const { isPending, data, mutate } = useMutation({ mutationKey: ['image from address'], mutationFn: getImageFromAddress });
  return { isQueryImagePending: isPending, imageSrc: data, queryImage: mutate };
};
