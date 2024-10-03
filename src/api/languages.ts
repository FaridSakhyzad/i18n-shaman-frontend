import { ILanguage, IProject, IProjectUpdateError } from 'interfaces';

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

interface IUpdateMultipleLanguages {
  projectId: string,
  languages: ILanguage[],
}

export const addMultipleLanguages = async (data: IUpdateMultipleLanguages) => {
  try {
    return (await apiClient.post('/addMultipleLanguages', data)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
}

export const hideAllLanguages = async (): Promise<void> => {
  try {
    return (await apiClient.post('/hideAllLanguages')).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const setLanguageVisibility = async (projectId: string, languageId: string, visible: boolean): Promise<IProject | IProjectUpdateError> => {
  try {
    return (await apiClient.post('/setLanguageVisibility', { projectId, languageId, visible })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const deleteLanguage = async (projectId: string, languageId: string): Promise<IProject | IProjectUpdateError> => {
  try {
    return (await apiClient.delete(`/deleteLanguage?projectId=${projectId}&languageId=${languageId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
