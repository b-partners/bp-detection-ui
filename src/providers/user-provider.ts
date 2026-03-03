import { ParamsUtilities } from '@/utilities';
import { User } from '@bpartners/typescript-client';
import { bpSecurityApi } from './api';

export const userProvider = {
  async whoami() {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { data: whoami } = await bpSecurityApi(apiKey).whoami();
    return whoami?.user;
  },
  async whoamiWithApiKey(apikey: string) {
    const { data: whoami } = await bpSecurityApi(apikey).whoami();
    return whoami?.user as User;
  },
};
