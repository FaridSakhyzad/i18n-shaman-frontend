import { apiClient } from './client';

interface ISearchParams {
  projectId: string;
  value: string;
  casing?: boolean;
  exact?: boolean;
}

export const search = async ({
  projectId, value, casing, exact,
}: ISearchParams) => {
  try {
    return (await apiClient.get(`/search?projectId=${projectId}&value=${value}&casing=${casing}&exact=${exact}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
