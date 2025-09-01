import { cache, getCached, ParamsUtilities } from '@/utilities';
import { Account, LegalFile } from '@bpartners/typescript-client';
import { bpSecurityApi, bpUserAccountApi } from '.';

const getCurrentAccount = (accounts: Account[]) => {
  return accounts.find(a => a.active) || accounts[0];
};

export const userInfoProvider = async (apiKey: string) => {
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
  if (!userInfo.accountHolderId) {
    const { data: accountHolders } = await bpUserAccountApi(apiKey).getAccountHolders(userInfo.userId ?? '', userInfo.accountId ?? '');
    const currentAccountHolder = accountHolders[0];
    userInfo.accountHolderId = currentAccountHolder?.id ?? '';
  }
  cache.userInfo(userInfo.userId ?? '', userInfo.accountId ?? '', userInfo.accountHolderId ?? '');

  const { approved, legalFiles } = await legalFilesProvider.checkLegalFiles(apiKey, userInfo.userId);

  if (!approved) throw new Error('legalFileNotApproved');

  return { ...userInfo, legalFiles };
};

export const legalFilesProvider = {
  acceptLegalFiles: async (legalFileId: string) => {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { userId } = getCached.userInfo();
    if (!userId || !apiKey) throw new Error('User id or apikey is undefined');

    const { data } = await bpUserAccountApi(apiKey).approveLegalFile(userId, legalFileId);
    return data;
  },
  checkLegalFiles: async (providedApiKey?: string, providedUserId?: string) => {
    const { apiKey: urlApikey } = ParamsUtilities.getQueryParams();
    const apiKey = providedApiKey || urlApikey;
    const { userId: cachedUserId } = getCached.userInfo();
    const userId = providedUserId || cachedUserId;
    const result: { approved: boolean; legalFiles: LegalFile[] } = { approved: false, legalFiles: [] };

    const { data: lfTemp } = await bpUserAccountApi(apiKey).getLegalFiles(userId || '');

    const notApprovedLegalFiles = lfTemp.filter(legalFile => legalFile.toBeConfirmed || !legalFile.approvalDatetime);
    console.log(notApprovedLegalFiles, lfTemp);

    if (notApprovedLegalFiles.length === 0) {
      result.legalFiles = lfTemp;
      result.approved = true;
      return result;
    }
    result.legalFiles = notApprovedLegalFiles;

    return result;
  },
};
