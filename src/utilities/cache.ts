import { DomainPolygonType } from '@/components';

const USER_ID_ITEM = 'USER_ID_ITEM';
const ACCOUNT_ID_ITEM = 'ACCOUNT_ID_ITEM';
const ACCOUNT_HOLDER_ID_ITEM = 'ACCOUNT_HOLDER_ID_ITEM';
const DETECTION_ID_ITEM = 'DETECTION_ID_ITEM';
const AREA_ITEM = 'AREA_ITEM';
const EMAIL_SENT_ITEM = 'EMAIL_SENT_ITEM';
const ANNOTATION_ID_ITEM = 'ANNOTATION_ID_ITEM';
const ROOF_DELIMITER_POLYGON_ITEM = 'ROOF_DELIMITER_POLYGON_ITEM';
const LLM_RESULT = 'LLM_HTML_RESULT';
const LEGAL_FILES_STATUS_APPROVED = 'LEGAL_FILES_STATUS_APPROVED';

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
  roofDelimiterPolygon(polygon: DomainPolygonType) {
    localStorage.setItem(ROOF_DELIMITER_POLYGON_ITEM, JSON.stringify(polygon));
    return polygon;
  },
  llmResult(html: string) {
    localStorage.setItem(LLM_RESULT, html);
    return html;
  },
  legalFilesAlreadyApproved(value: boolean) {
    localStorage.setItem(LEGAL_FILES_STATUS_APPROVED, JSON.stringify(LEGAL_FILES_STATUS_APPROVED));
    return value;
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
    return JSON.parse(localStorage.getItem(EMAIL_SENT_ITEM) || 'false');
  },
  annotationId() {
    return localStorage.getItem(ANNOTATION_ID_ITEM);
  },
  roofDelimiterPolygon() {
    const res = localStorage.getItem(ROOF_DELIMITER_POLYGON_ITEM) || 'undefined';
    try {
      return JSON.parse(res);
    } catch {
      return undefined;
    }
  },
  llmResult() {
    return localStorage.getItem(LLM_RESULT);
  },
  legalFilesAlreadyApproved() {
    const value = localStorage.getItem(LEGAL_FILES_STATUS_APPROVED);
    return JSON.parse(value || 'false');
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
  all() {
    localStorage.clear();
  },
};
