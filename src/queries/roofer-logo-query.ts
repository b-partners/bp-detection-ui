import { userProvider } from '@/providers';
import { arrayBufferToBase64, getFileUrl, ParamsUtilities } from '@/utilities';
import { useQuery } from '@tanstack/react-query';

export const useGetRooferLogoQuery = (keys = []) => {
  const queryFn = async () => {
    const { logoFileId } = (await userProvider.whoami()) || {};
    if (!logoFileId) return null;
    const { apiKey } = ParamsUtilities.getQueryParams();
    const url = getFileUrl(logoFileId, 'LOGO');
    const file = await fetch(url, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
    const imageAsArrayBuffer = await file.arrayBuffer();

    return arrayBufferToBase64(imageAsArrayBuffer);
  };

  return useQuery({ queryFn, queryKey: [...keys] });
};
