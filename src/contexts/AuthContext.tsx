import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { UserProfileDTO, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import i18n from '@/i18n';
import { AuthContext } from './AuthContextDefs';
import { normalizeLanguageCode } from '@/utils/i18nUtils';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... implementation remains same
  const [user, setUser] = useState<UserProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!user;

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  // Function to fetch the user profile using the token
  const fetchUser = useCallback(async (syncLanguage = true) => {
    try {
      if (localStorage.getItem('accessToken')) {
        const response = await userService.getMe();
        if (response.success) {
           setUser(response.data);
           // Sync language with user settings immediately, but only if requested (e.g. login/initial load)
           if (syncLanguage && response.data.settings?.uiLanguage) {
             const userLang = normalizeLanguageCode(response.data.settings.uiLanguage);
             if (userLang !== i18n.language) {
               i18n.changeLanguage(userLang);
             }
           }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      // If fetch fails (token expired etc), logout
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        // Also save refresh token if needed
        localStorage.setItem('refreshToken', response.data.refreshToken);
        await fetchUser(true);
      }
    } catch (error) {
       console.error(error);
       throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        await fetchUser(true);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    // skip language sync on background refresh to avoid overwriting user's current session language
    await fetchUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
