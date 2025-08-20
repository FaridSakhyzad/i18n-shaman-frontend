import { apiClient } from './client';

export interface IRegisterUserDto {
  email: string;
  password: string;
}

export const registerUser = async ({ email, password }: IRegisterUserDto) => {
  try {
    return (await apiClient.post('auth/register', {
      email,
      password,
    })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export interface ILoginUserDto {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: ILoginUserDto) => {
  try {
    return (await apiClient.post('auth/login', {
      email,
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

export const logout = async (userId: string) => {
  try {
    return (await apiClient.post('auth/logout', { userId })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const resetPasswordRequest = async (email: string) => {
  try {
    return (await apiClient.get(`auth/resetPasswordRequest?email=${email}`)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const validateResetToken = async (resetToken: string) => {
  try {
    return (await apiClient.post('auth/validateResetToken', { resetToken })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const getPasswordResetSecurityToken = async () => {
  try {
    return (await apiClient.get('auth/getPasswordResetSecurityToken')).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export interface ISetNewPasswordDto {
  securityToken: string,
  resetToken: string,
  password: string
}

export const setNewPassword = async (data: ISetNewPasswordDto) => {
  try {
    return (await apiClient.post('auth/setNewPassword', data)).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};

export const setLanguage = async (userId: string, language: string) => {
  try {
    return (await apiClient.post('user/setLanguage', { userId, language })).data;
  } catch (error: any) {
    return error.response && error.response.data;
  }
};
