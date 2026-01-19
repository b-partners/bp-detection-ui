import { saveAnnotations } from '@/providers';
import { cache } from '@/utilities';
import { AreaPictureAnnotation } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';

export const useSaveAnnotationQuery = () => {
  const mutationFn = async (areaPictureAnnotation: AreaPictureAnnotation) => {
    const result = await saveAnnotations(areaPictureAnnotation.idAreaPicture || '', areaPictureAnnotation);
    cache.isAnnotationAlreadySaved();
    return result;
  };
  return useMutation({ mutationFn });
};
