import { apiClient } from './client';

export interface IRegisterUserDto {
  login: string;
  password: string;
}

export const registerUser = async ({ login, password }: IRegisterUserDto) => {
  try {
    return (await apiClient.post('auth/register', {
      login,
      password,
    })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export interface ILoginUserDto {
  login: string;
  password: string;
}

export const loginUser = async ({ login, password }: ILoginUserDto) => {
  try {
    return (await apiClient.post('auth/login', {
      login,
      password,
    })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const verifyUser = async () => {
  try {
    return (await apiClient.get('auth/verifyUser')).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
