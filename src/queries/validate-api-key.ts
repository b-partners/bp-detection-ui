import { userInfoProvider, userProvider } from '@/providers';
import { cache, getFileUrl } from '@/utilities';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useValidateApiKey = () => {
  const navigate = useNavigate();
  const mutationFn = async (apikey: string) => {
    await userInfoProvider(apikey);
    const { logoFileId } = await userProvider.whoamiWithApiKey(apikey);
    const logoUrl = getFileUrl(logoFileId ?? '', 'LOGO');
    cache.rooferLogo(logoUrl);
    navigate(`/?apiKey=${apikey}`);
  };
  const {
    mutate: validate,
    isPending: isValidating,
    error: validationError,
  } = useMutation({
    mutationFn,
  });
  return { validate, isValidating, validationError };
};
