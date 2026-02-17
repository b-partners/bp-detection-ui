import { bpUserAccountApi, userInfoProvider } from '@/providers';
import { arrayBufferToBase64, getCached, ParamsUtilities } from '@/utilities';

const defaultLogo = '/assets/images/bird-ia-lg-logo.png';
const defaultSite = 'https://www.birdia.fr';

export const logoLoader = async () => {
  const url = getCached.rooferLogo();
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { accountId, userId } = await userInfoProvider(apiKey);

  const { data: accountHolders } = await bpUserAccountApi(apiKey).getAccountHolders(userId ?? '', accountId ?? '');
  const website = accountHolders?.[0]?.companyInfo?.website || defaultSite;

  if (!url || url.includes('null')) return defaultLogo;
  await userInfoProvider(apiKey);
  const file = await fetch(url, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
  const imageAsArrayBuffer = await file.arrayBuffer();
  return { image: arrayBufferToBase64(imageAsArrayBuffer), website };
};
