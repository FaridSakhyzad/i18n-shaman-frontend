import { apiClient } from './client';

export const getTranslations = async () => {
  const result = await apiClient.get('/');

  return result;
};

export default getTranslations;
