import { v4 } from 'uuid';
import { DEMO_PDF_DATA_URI } from './demo-assets';
import { buildDemoAreaPictureDetails, demoAccount, demoAccountHolder, demoConverterResult, demoLegalFiles, demoWhoami } from './demo-data';

/**
 * Mock implementations of the exact SDK methods `src/providers/api.ts` calls elsewhere in
 * the app (SecurityApi, UserAccountsApi, AreaPictureApi, ProspectingApi, AddressAutocompletionApi,
 * FilesApi) — one plain object per client, each method resolving `{ data }` like the real SDK.
 */

export const demoSecurityApi = {
  whoami: async () => ({ data: demoWhoami }),
};

export const demoUserAccountApi = {
  getAccountsByUserId: async () => ({ data: [demoAccount] }),
  getAccountHolders: async () => ({ data: [demoAccountHolder] }),
  getLegalFiles: async () => ({ data: demoLegalFiles }),
  approveLegalFile: async () => ({ data: {} }),
};

export const demoAnnotationApi = {
  crupdateAreaPictureDetails: async (accountId: string, id: string, body: any) => ({ data: buildDemoAreaPictureDetails(accountId, id, body) }),
  annotateAreaPicture: async (_accountId: string, _areaPictureId: string, _annotationId: string, annotation: any) => ({ data: annotation }),
  convertAreaPictureAnnotationsToPixel: async () => ({ data: demoConverterResult }),
  exportAreaPictureAnnotationToPdf: async () => ({ data: { value: DEMO_PDF_DATA_URI } }),
};

export const demoProspectApi = {
  createProspects: async (_accountHolderId: string, prospects: any[]) => ({ data: prospects.map(p => ({ ...p, id: p.id || v4() })) }),
  notifyProspects: async () => ({ data: {} }),
};

const demoAddressSuffixes = ['75001 Paris', '69001 Lyon', '13001 Marseille'];

export const demoAutocompleteApi = {
  autoCompleteAddress: async (query: string) => ({
    data: query ? demoAddressSuffixes.map(suffix => ({ description: `${query} ${suffix}` })) : [],
  }),
};

export const demoFilesApi = {
  uploadFile: async () => ({ data: {} }),
};
