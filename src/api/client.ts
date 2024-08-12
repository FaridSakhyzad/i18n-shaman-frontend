import axios from 'axios';
import getAppConfig from '../config/appConfig';

const { API_URL } = getAppConfig();

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default apiClient;
