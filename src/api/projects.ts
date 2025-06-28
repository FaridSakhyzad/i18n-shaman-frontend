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

interface IGetUserProjectById {
  projectId: string;
  subFolderId?: string;
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  sortDirection?: string;
  filters?: string[] | null;
}

export const getUserProjectById = async (params: IGetUserProjectById) => {
  const {
    projectId,
    subFolderId,
    page = 0,
    itemsPerPage = 50,
    sortBy,
    sortDirection = 'asc',
    filters,
  } = params;

  let queryString = `getUserProjectById?projectId=${projectId}`;

  if (subFolderId) {
    queryString += `&subFolderId=${subFolderId}`;
  }

  if (page) {
    queryString += `&page=${page}`;
  }

  if (itemsPerPage) {
    queryString += `&itemsPerPage=${itemsPerPage}`;
  }

  if (sortBy) {
    queryString += `&sortBy=${sortBy}`;

    if (sortDirection) {
      queryString += `&sortDirection=${sortDirection}`;
    }
  }

  if (filters && filters.length > 0) {
    queryString += `&filters=${filters.join(',')}`;
  }

  try {
    return (await apiClient.get(queryString)).data;
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

interface IgetEntityContent {
  projectId: string;
  userId: string;
  componentId: string;
}

export const getEntityContent = async ({ userId, projectId, componentId }: IgetEntityContent) => {
  try {
    return (await apiClient.get(`getEntityContent?userId=${userId}&projectId=${projectId}&componentId=${componentId}`)).data;
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

interface IGetMultipleEntitiesDataByParentId {
  projectId: string;
  parentId: string;
}

export const getMultipleEntitiesDataByParentId = async ({ projectId, parentId }: IGetMultipleEntitiesDataByParentId) => {
  try {
    return (await apiClient.get(`getMultipleEntitiesDataByParentId?projectId=${projectId}&parentId=${parentId}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export enum EExportFormats {
  json = 'json',
  androidXml = 'android_xml',
  appleStrings = 'apple_string',
  phpArray = 'php_array',
}

export interface IExportProject {
  projectId: string;
  format: EExportFormats
}

export const exportProject = async ({ projectId, format }: IExportProject) => {
  return apiClient.get(`/exportProject?projectId=${projectId}&format=${format}`, {
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

export const importComponentsToProject = async (data: any) => {
  try {
    return (await apiClient.post('importComponentsDataToProject', data)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
