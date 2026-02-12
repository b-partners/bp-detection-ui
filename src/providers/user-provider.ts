import { ParamsUtilities } from '@/utilities';
import { bpSecurityApi } from './api';

export const userProvider = {
  async whoami() {
    const { apiKey } = ParamsUtilities.getQueryParams();
    const { data: whoami } = await bpSecurityApi(apiKey).whoami();
    return whoami?.user;
  },
};
