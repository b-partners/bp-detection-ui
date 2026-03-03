import { bpUserAccountApi, userInfoProvider, userProvider } from '@/providers';
import { arrayBufferToBase64, getFileUrl, ParamsUtilities } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

const defaultLogo = '/assets/images/bird-ia-lg-logo.png';
const defaultSite = 'https://www.birdia.fr';
const defaultFeedbackLink = 'https://www.bpartners.app/contact';

export interface AccountInfo {
  image: string;
  website: string;
  feedbackLink: string;
}
interface AccountInfoAction {
  setAccountInfo: (data: AccountInfo) => void;
}

export const useAccountInfoStore = create<AccountInfo & AccountInfoAction>(set => ({
  image: '',
  website: '',
  feedbackLink: '',
  setAccountInfo(data) {
    set(data);
  },
}));

export const queryFn = async () => {
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

    if (url.includes('null') || url.includes('undefined') || url.split('://')[1].includes('//')) throw new Error();

    const file = await fetch(url, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
    const imageAsArrayBuffer = await file.arrayBuffer();
    if (imageAsArrayBuffer.byteLength === 0) throw new Error('There is no roofer logo available');
    const imageAsBase64 = arrayBufferToBase64(imageAsArrayBuffer);

    useAccountInfoStore.getState().setAccountInfo({ image: imageAsBase64, website, feedbackLink });
  } catch {
    useAccountInfoStore.getState().setAccountInfo(defaultReturnValue);
  }
};

export const useAccountInfoQuery = () => {
  const { feedbackLink, image, website } = useAccountInfoStore();
  const { isLoading } = useQuery({ queryFn, queryKey: ['accountInfo'], enabled: !feedbackLink && !image && !website });
  return isLoading;
};
