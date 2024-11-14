import { IKey, IKeyUpdateError, IKeyValue, IProject } from 'interfaces';
import { apiClient } from './client';

interface ICreateProject {
  userId: string;
  projectName: string;
  projectId: string;
}

export const createUserProject = async ({ userId, projectName, projectId }: ICreateProject) => {
  return (await apiClient.post('/createProject', {
    userId,
    projectName,
    projectId,
  })).data;
};

export const updateUserProject = async (data: IProject) => {
  try {
    return (await apiClient.post('/updateProject', data)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const deleteUserProject = async (projectId: string) => {
  try {
    return (await apiClient.delete(`/deleteProject?projectId=${projectId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const getUserProjects = async (userId: string) => {
  try {
    return (await apiClient.get(`getUserProjects?userId=${userId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const getUserProjectsById = async (projectId: string) => {
  try {
    return (await apiClient.get(`getUserProjectById?projectId=${projectId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

interface IAddKey {
  projectId: string;
  id: string;
  label: string;
  description: string;
  values: IKeyValue[]
}

export const createProjectKey = async ({
  projectId, id, label, values, description,
}: IAddKey) => apiClient.post('/createProjectKey', {
  projectId,
  id,
  label,
  values,
  description,
});

interface IUpdateKey {
  id: string;
  userId?: string;
  label: string;
  values: IKeyValue[];
  description: string;
}

export const updateKey = async ({
  id,
  userId,
  label,
  values,
  description,
}: IUpdateKey): Promise<IKey | IKeyUpdateError> => {
  return apiClient.post('/updateKey', {
    id,
    userId,
    label,
    values,
    description,
  });
};

export const exportProjectToJson = async (projectId: string) => {
  return apiClient.get(`/exportProjectToJson?projectId=${projectId}`, {
    responseType: 'blob',
  });
};

export const importDataToProject = async (data: any) => {
  try {
    return (await apiClient.post('importJsonDataToProject', data)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
