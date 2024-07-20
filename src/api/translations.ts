import { apiClient } from "./client";

export const getTranslations = async () => {
  return await apiClient.get('/');
}