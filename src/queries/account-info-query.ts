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
  name: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
}
interface AccountInfoAction {
  setAccountInfo: (data: AccountInfo) => void;
}

const emptyCompanyInfo = { name: '', address: '', city: '', postalCode: '', email: '', phone: '' };

export const useAccountInfoStore = create<AccountInfo & AccountInfoAction>(set => ({
  image: '',
  website: '',
  feedbackLink: '',
  ...emptyCompanyInfo,
  setAccountInfo(data) {
    set(data);
  },
}));

export const queryFn = async () => {
  let defaultReturnValue: AccountInfo = { image: defaultLogo, website: defaultSite, feedbackLink: defaultFeedbackLink, ...emptyCompanyInfo };
  try {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { accountId, userId } = await userInfoProvider(apiKey);
    const { logoFileId } = (await userProvider.whoami()) || {};

    const url = getFileUrl(logoFileId ?? '', 'LOGO', accountId ?? '');

    const { data: accountHolders } = await bpUserAccountApi(apiKey).getAccountHolders(userId ?? '', accountId ?? '');
    const accountHolder = accountHolders?.[0];
    const website = accountHolder?.companyInfo?.website || defaultSite;
    const feedbackLink = accountHolder?.feedback?.feedbackLink || defaultFeedbackLink;
    const companyInfo = {
      name: accountHolder?.name || '',
      address: accountHolder?.contactAddress?.address || accountHolder?.address || '',
      city: accountHolder?.contactAddress?.city || accountHolder?.city || '',
      postalCode: accountHolder?.contactAddress?.postalCode || accountHolder?.postalCode || '',
      email: accountHolder?.companyInfo?.email || '',
      phone: accountHolder?.companyInfo?.phone || '',
    };

    defaultReturnValue = { image: defaultLogo, website, feedbackLink, ...companyInfo };

    if (url.includes('null') || url.includes('undefined') || url.split('://')[1].includes('//')) throw new Error();

    const file = await fetch(url, { headers: { 'x-api-key': apiKey, 'content-type': '*/*' } });
    const imageAsArrayBuffer = await file.arrayBuffer();
    if (imageAsArrayBuffer.byteLength === 0) throw new Error('There is no roofer logo available');
    const imageAsBase64 = arrayBufferToBase64(imageAsArrayBuffer);

    useAccountInfoStore.getState().setAccountInfo({ image: imageAsBase64, website, feedbackLink, ...companyInfo });
  } catch {
    useAccountInfoStore.getState().setAccountInfo(defaultReturnValue);
  }
};

export const useAccountInfoQuery = () => {
  const { feedbackLink, image, website } = useAccountInfoStore();
  const { isLoading } = useQuery({ queryFn, queryKey: ['accountInfo'], enabled: !feedbackLink && !image && !website });
  return isLoading;
};
