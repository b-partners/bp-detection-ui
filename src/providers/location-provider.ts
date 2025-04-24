import { ParamsUtilities } from '@/utilities';
import { autocompleteApi } from './api';

export const locationProvider = async (_sessionId: string, query: string) => {
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { data } = await autocompleteApi(apiKey).autoCompleteAddress(query);
  return data;
};
