import api from './api';
import type { ApiResponse, AuthDTO, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest } from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthDTO>> => {
    const response = await api.post<ApiResponse<AuthDTO>>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthDTO>> => {
    const response = await api.post<ApiResponse<AuthDTO>>('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<boolean>> => {
    const response = await api.post<ApiResponse<boolean>>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<boolean>> => {
    const response = await api.post<ApiResponse<boolean>>('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<boolean>> => {
    const response = await api.patch<ApiResponse<boolean>>('/users/password', data);
    return response.data;
  }
};
