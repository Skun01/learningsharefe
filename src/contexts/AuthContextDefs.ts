import { createContext } from 'react';
import type { UserProfileDTO, LoginRequest, RegisterRequest } from '@/types';

export interface AuthContextType {
  user: UserProfileDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
