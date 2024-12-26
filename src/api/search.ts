import { apiClient } from './client';

interface ISearchParams {
  projectId: string;
  query: string;
  caseSensitive?: boolean;
  exact?: boolean;
}

export const search = async ({
  projectId, query, caseSensitive, exact,
}: ISearchParams) => {
  try {
    return (await apiClient.get(`/search?projectId=${projectId}&query=${query}&caseSensitive=${caseSensitive}&exact=${exact}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
