import { bpUserAccountApi, userInfoProvider, userProvider } from '@/providers';
import { arrayBufferToBase64, getFileUrl, ParamsUtilities } from '@/utilities';

const defaultLogo = '/assets/images/bird-ia-lg-logo.png';
const defaultSite = 'https://www.birdia.fr';

export const logoLoader = async () => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { accountId, userId } = await userInfoProvider(apiKey);
  const { logoFileId } = await userProvider.whoamiWithApiKey(apiKey);
  const url = getFileUrl(logoFileId ?? '', 'LOGO', accountId ?? '');

  const { data: accountHolders } = await bpUserAccountApi(apiKey).getAccountHolders(userId ?? '', accountId ?? '');
  const website = accountHolders?.[0]?.companyInfo?.website || defaultSite;

  if (url.includes('null') || url.includes('undefined') || url.includes('//')) return { image: defaultLogo, website };

  const file = await fetch(url, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  const imageAsArrayBuffer = await file.arrayBuffer();
  return { image: arrayBufferToBase64(imageAsArrayBuffer), website };
};
