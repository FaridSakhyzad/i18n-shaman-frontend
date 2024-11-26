import { apiClient } from './client';

interface ISearchParams {
  projectId: string;
  query: string;
  casing?: boolean;
  exact?: boolean;
}

export const search = async ({
  projectId, query, casing, exact,
}: ISearchParams) => {
  try {
    return (await apiClient.get(`/search?projectId=${projectId}&query=${query}&casing=${casing}&exact=${exact}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
