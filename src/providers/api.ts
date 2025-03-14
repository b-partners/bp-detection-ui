import { AreaPictureApi, Configuration, SecurityApi, UserAccountsApi } from '@bpartners/typescript-client';

export const bpSecurityApi = (apiKey: string) => new SecurityApi(new Configuration({ apiKey }));
export const bpUserAccountApi = (apiKey: string) => new UserAccountsApi(new Configuration({ apiKey }));
export const bpAnnotationApi = (apiKey: string) => new AreaPictureApi(new Configuration({ apiKey }));
