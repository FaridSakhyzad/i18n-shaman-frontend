import { apiClient } from './client';
import { IKeyValue } from '../pages/Editor/interfaces';

interface ICreateProject {
  projectName: string
  projectId: string
}

export const createUserProject = async ({ projectName, projectId }: ICreateProject) => {
  return apiClient.post('/createProject', {
    projectName,
    projectId,
  });
};

export const getUserProjects = () => apiClient.get('getUserProjects');

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
