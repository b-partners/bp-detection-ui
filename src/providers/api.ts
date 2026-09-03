import { AddressAutocompletionApi, AreaPictureApi, Configuration, FilesApi, ProspectingApi, SecurityApi, UserAccountsApi } from '@bpartners/typescript-client';
import { demoAnnotationApi, demoAutocompleteApi, demoFilesApi, demoProspectApi, demoSecurityApi, demoUserAccountApi, isDemoApiKey } from './demo';

export const bpSecurityApi = (apiKey: string) => (isDemoApiKey(apiKey) ? (demoSecurityApi as any) : new SecurityApi(new Configuration({ apiKey })));
export const bpUserAccountApi = (apiKey: string) => (isDemoApiKey(apiKey) ? (demoUserAccountApi as any) : new UserAccountsApi(new Configuration({ apiKey })));
export const bpAnnotationApi = (apiKey: string) => (isDemoApiKey(apiKey) ? (demoAnnotationApi as any) : new AreaPictureApi(new Configuration({ apiKey })));
export const bpProspectApi = (apiKey: string) => (isDemoApiKey(apiKey) ? (demoProspectApi as any) : new ProspectingApi(new Configuration({ apiKey })));
export const autocompleteApi = (apiKey: string) =>
  isDemoApiKey(apiKey) ? (demoAutocompleteApi as any) : new AddressAutocompletionApi(new Configuration({ apiKey }));
export const filesApi = (apiKey: string) => (isDemoApiKey(apiKey) ? (demoFilesApi as any) : new FilesApi(new Configuration({ apiKey })));
