import { cache, getCached } from '@/utilities';
import { Account } from '@bpartners/typescript-client';
import { bpSecurityApi, bpUserAccountApi } from '.';

const getCurrentAccount = (accounts: Account[]) => {
  return accounts.find(a => a.active) || accounts[0];
};

export const userInfoProvider = async (apiKey: string) => {
  try {
    const userInfo = { ...getCached.userInfo() };
    if (!userInfo.userId) {
      const { data: whoami } = await bpSecurityApi(apiKey).whoami();
      const { user } = whoami;
      userInfo.userId = user?.id ?? '';
    }
    if (!userInfo.accountId) {
      const { data: accounts } = await bpUserAccountApi(apiKey).getAccountsByUserId(userInfo.userId ?? '');
      const currentAccount = getCurrentAccount(accounts);
      userInfo.accountId = currentAccount?.id ?? '';
    }
    cache.userInfo(userInfo.userId ?? '', userInfo.accountId ?? '');
    return { ...userInfo };
  } catch (err) {
    console.log(err);
  }
};
