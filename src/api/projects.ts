import { apiClient } from './client';
import { IKeyValue } from '../interfaces';

interface ICreateProject {
  userId: string;
  projectName: string
  projectId: string
}

export const createUserProject = async ({ userId, projectName, projectId }: ICreateProject) => {
  return (await apiClient.post('/createProject', {
    userId,
    projectName,
    projectId,
  })).data;
};

export const getUserProjects = async (userId: string) => {
  try {
    return (await apiClient.get(`getUserProjects?userId=${userId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const getUserProjectsById = (projectId: string) => apiClient.get(`getUserProjectById?projectId=${projectId}`);

interface IAddLanguage {
  projectId: string
  id: string
  label: string
  baseLanguage: boolean
}

export const addProjectLanguage = async ({
  projectId,
  id,
  label,
  baseLanguage,
}: IAddLanguage) => apiClient.post('/addProjectLanguage', {
  projectId,
  id,
  label,
  baseLanguage,
});

interface IAddKey {
  projectId: string
  id: string
  label: string
  values: []
}

export const addProjectKey = async ({ projectId, id, label }: IAddKey) => {
  return apiClient.post('/addProjectKey', {
    projectId,
    id,
    label,
  });
};

interface IUpdateKey {
  id: string
  label: string
  values: IKeyValue[]
}

export const updateKey = async ({ id, label, values }: IUpdateKey) => {
  return apiClient.post('/updateKey', {
    id,
    label,
    values,
  });
};
