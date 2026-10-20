import { bpUserAccountApi, resolveUserInfo, userProvider } from '@/providers';
import { getFileUrl, ParamsUtilities } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

export const defaultLogo = '/assets/images/bird-ia-lg-logo.png';
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
    const user = await userProvider.whoami();
    const { accountId, userId, accountHolders: resolvedHolders } = await resolveUserInfo(apiKey, user?.id);
    const accountHolders = resolvedHolders ?? (await bpUserAccountApi(apiKey).getAccountHolders(userId ?? '', accountId ?? '')).data;
    const url = getFileUrl(user?.logoFileId ?? '', 'LOGO', accountId ?? '');
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

    // The browser loads the logo itself (apiKey is in the URL), so the card no longer waits for the download.
    useAccountInfoStore.getState().setAccountInfo({ image: url, website, feedbackLink, ...companyInfo });
  } catch {
    useAccountInfoStore.getState().setAccountInfo(defaultReturnValue);
  }
};

export const useAccountInfoQuery = () => {
  const { feedbackLink, image, website } = useAccountInfoStore();
  const { isLoading } = useQuery({ queryFn, queryKey: ['accountInfo'], enabled: !feedbackLink && !image && !website });
  return isLoading;
};
