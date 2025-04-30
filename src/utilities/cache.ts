const USER_ID_ITEM = 'USER_ID_ITEM';
const ACCOUNT_ID_ITEM = 'ACCOUNT_ID_ITEM';
const ACCOUNT_HOLDER_ID_ITEM = 'ACCOUNT_HOLDER_ID_ITEM';
const DETECTION_ID_ITEM = 'DETECTION_ID_ITEM';
const AREA_ITEM = 'AREA_ITEM';
const EMAIL_SENT_ITEM = 'EMAIL_SENT_ITEM';
const ANNOTATION_ID_ITEM = 'ANNOTATION_ID_ITEM';

export const cache = {
  userInfo(userId: string, accountId: string, accountHolderId: string) {
    localStorage.setItem(USER_ID_ITEM, userId);
    localStorage.setItem(ACCOUNT_ID_ITEM, accountId);
    localStorage.setItem(ACCOUNT_HOLDER_ID_ITEM, accountHolderId);
  },
  detectionId(id: string) {
    localStorage.setItem(DETECTION_ID_ITEM, id);
  },
  area(area: number) {
    localStorage.setItem(AREA_ITEM, `${area}`);
  },
  isEmailSent() {
    localStorage.setItem(EMAIL_SENT_ITEM, 'true');
  },
  annotationId(annotationId: string) {
    localStorage.setItem(ANNOTATION_ID_ITEM, annotationId);
  },
};

export const getCached = {
  userInfo() {
    const userId = localStorage.getItem(USER_ID_ITEM);
    const accountId = localStorage.getItem(ACCOUNT_ID_ITEM);
    const accountHolderId = localStorage.getItem(ACCOUNT_HOLDER_ID_ITEM);
    return { userId, accountId, accountHolderId };
  },
  detectionId() {
    return localStorage.getItem(DETECTION_ID_ITEM);
  },
  area() {
    return +(localStorage.getItem(AREA_ITEM) || '0');
  },
  isEmailSent() {
    return !!localStorage.getItem(EMAIL_SENT_ITEM);
  },
  annotationId() {
    return localStorage.getItem(ANNOTATION_ID_ITEM);
  },
};

export const clearCached = {
  detectionId() {
    localStorage.removeItem(DETECTION_ID_ITEM);
  },
  isEmailSent() {
    localStorage.removeItem(EMAIL_SENT_ITEM);
  },
  annotationId() {
    localStorage.removeItem(ANNOTATION_ID_ITEM);
  },
};
