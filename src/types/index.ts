export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
  metaData?: {
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: number | string; // Adjusted to handle both number (0) and string ("User") as seen in docs
  avatarUrl?: string;
}

export interface AuthDTO {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UserSettingsDTO {
  enableGhostMode: boolean;
  dailyGoal: number;
  uiLanguage: string;
}

export interface UserProfileDTO extends User {
  settings: UserSettingsDTO;
}

// Request Types
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword?: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileRequest {
  username?: string;
}

export interface UpdateGhostModeRequest {
  enabled: boolean;
}

export interface UpdateDailyGoalRequest {
  goal: number;
}

export interface UpdateLanguageRequest {
  language: string;
}

// Store types
export * from './store';

// Deck types
export * from './deck';
