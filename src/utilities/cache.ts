const USER_ID_ITEM = 'USER_ID_ITEM';
const ACCOUNT_ID_ITEM = 'ACCOUNT_ID_ITEM';
const ACCOUNT_HOLDER_ID_ITEM = 'ACCOUNT_HOLDER_ID_ITEM';

export const cache = {
  userInfo(userId: string, accountId: string, accountHolderId: string) {
    localStorage.setItem(USER_ID_ITEM, userId);
    localStorage.setItem(ACCOUNT_ID_ITEM, accountId);
    localStorage.setItem(ACCOUNT_HOLDER_ID_ITEM, accountHolderId);
  },
};

export const getCached = {
  userInfo() {
    const userId = localStorage.getItem(USER_ID_ITEM);
    const accountId = localStorage.getItem(ACCOUNT_ID_ITEM);
    const accountHolderId = localStorage.getItem(ACCOUNT_HOLDER_ID_ITEM);
    return { userId, accountId, accountHolderId };
  },
};
