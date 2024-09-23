import { IProject, IDeleteError } from 'interfaces';

import { apiClient } from './client';

interface IAddLanguage {
  projectId: string
  id: string
  label: string
  baseLanguage: boolean
}

export const addLanguage = async ({
  projectId,
  id,
  label,
  baseLanguage,
}: IAddLanguage) => apiClient.post('/addLanguage', {
  projectId,
  id,
  label,
  baseLanguage,
});

export const hideAllLanguages = async (): Promise<void> => {
  try {
    return (await apiClient.post('/hideAllLanguages')).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const hideLanguage = async (languageId: string): Promise<void> => {
  try {
    return (await apiClient.post('/hideLanguage', { languageId })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const deleteLanguage = async (projectId: string, languageId: string): Promise<IProject | IDeleteError> => {
  try {
    return (await apiClient.delete(`/deleteLanguage?projectId=${projectId}&languageId=${languageId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
