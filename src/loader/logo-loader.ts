import { bpUserAccountApi, userInfoProvider, userProvider } from '@/providers';
import { arrayBufferToBase64, getFileUrl, ParamsUtilities } from '@/utilities';

const defaultLogo = '/assets/images/bird-ia-lg-logo.png';
const defaultSite = 'https://www.birdia.fr';
const defaultFeedbackLink = 'https://www.bpartners.app/contact';

export const logoLoader = async () => {
  let defaultReturnValue = { image: defaultLogo, website: defaultSite, feedbackLink: defaultFeedbackLink };
  try {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { accountId, userId } = await userInfoProvider(apiKey);
    const { logoFileId } = await userProvider.whoamiWithApiKey(apiKey);
    const url = getFileUrl(logoFileId ?? '', 'LOGO', accountId ?? '');

    const { data: accountHolders } = await bpUserAccountApi(apiKey).getAccountHolders(userId ?? '', accountId ?? '');
    const website = accountHolders?.[0]?.companyInfo?.website || defaultSite;
    const feedbackLink = accountHolders?.[0]?.feedback?.feedbackLink || defaultFeedbackLink;

    defaultReturnValue = { image: defaultLogo, website, feedbackLink };

    if (url.includes('null') || url.includes('undefined') || url.split('://').includes('//')) return defaultReturnValue;

    const file = await fetch(url, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
    const imageAsArrayBuffer = await file.arrayBuffer();
    if (imageAsArrayBuffer.byteLength === 0) throw new Error('There is no roofer logo available');
    const imageAsBase64 = arrayBufferToBase64(imageAsArrayBuffer);

    return { image: imageAsBase64, website, feedbackLink };
  } catch {
    return defaultReturnValue;
  }
};
