import { IKeyValue, IProject } from 'interfaces';
import { apiClient } from './client';

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
  values: { [key: string]: string }[]
}

export const addProjectKey = async ({
  projectId, id, label, values, description,
}: IAddKey) => apiClient.post('/addProjectKey', {
  projectId,
  id,
  label,
  values,
  description,
});

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
