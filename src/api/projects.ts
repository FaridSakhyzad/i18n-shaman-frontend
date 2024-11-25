import {
  IKey,
  IKeyUpdateError,
  IKeyValue,
  IProject,
} from 'interfaces';
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

interface ICreateEntity {
  id: string;
  projectId: string;
  parentId: string;
  pathCache: string;
  label: string;
  description: string;
  values: IKeyValue[];
  type: string;
}

export const createProjectEntity = async (data: ICreateEntity) => apiClient.post('/createProjectEntity', data);

export const deleteProjectEntity = async (id: string) => {
  try {
    return (await apiClient.delete(`/deleteProjectEntity?id=${id}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

interface IUpdateKey {
  id: string;
  userId?: string;
  projectId: string;
  parentId: string;
  label: string;
  values: IKeyValue[];
  description: string;
}

export const updateKey = async (data: IUpdateKey): Promise<IKey | IKeyUpdateError> => {
  try {
    return (await apiClient.post('/updateKey', data)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

interface IGetComponentData {
  projectId: string;
  userId: string;
  componentId: string;
}

export const getComponentData = async ({ userId, projectId, componentId }: IGetComponentData) => {
  try {
    return (await apiClient.get(`getComponentData?userId=${userId}&projectId=${projectId}&componentId=${componentId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

interface IGetKeyData {
  projectId: string;
  userId: string;
  keyId: string;
}

export const getKeyData = async ({ userId, projectId, keyId }: IGetKeyData) => {
  try {
    return (await apiClient.get(`getKeyData?userId=${userId}&projectId=${projectId}&keyId=${keyId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
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
