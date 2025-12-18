import api from './api';
import type { ApiResponse, UserProfileDTO, UserSettingsDTO, UpdateProfileRequest } from '@/types';

export const userService = {
  getMe: async (): Promise<ApiResponse<UserProfileDTO>> => {
    const response = await api.get<ApiResponse<UserProfileDTO>>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<boolean>> => {
    const response = await api.patch<ApiResponse<boolean>>('/users/info', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<string>>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<UserSettingsDTO>> => {
    const response = await api.get<ApiResponse<UserSettingsDTO>>('/settings');
    return response.data;
  },

  updateGhostMode: async (enabled: boolean): Promise<ApiResponse<boolean>> => {
    const response = await api.patch<ApiResponse<boolean>>('/settings/ghost-mode', { enabled });
    return response.data;
  },

  updateDailyGoal: async (goal: number): Promise<ApiResponse<boolean>> => {
    const response = await api.patch<ApiResponse<boolean>>('/settings/daily-goal', { goal });
    return response.data;
  },

  updateLanguage: async (language: string): Promise<ApiResponse<boolean>> => {
    const response = await api.patch<ApiResponse<boolean>>('/settings/language', { language });
    return response.data;
  },
};
