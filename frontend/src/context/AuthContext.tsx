import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types/auth';
import { authApi } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  googleClientId: string;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  loginWithGoogle: (credential: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aipave_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('aipave_auth_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [googleClientId, setGoogleClientId] = useState<string>(() => {
    return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '';
  });

  // Handle successful authentication
  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    setToken(response.access_token);
    setUser(response.user);
    localStorage.setItem('aipave_auth_token', response.access_token);
    localStorage.setItem('aipave_user', JSON.stringify(response.user));
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aipave_auth_token');
    localStorage.removeItem('aipave_user');
    authApi.logout().catch(() => {});
  }, []);

  // Update user state locally
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('aipave_user', JSON.stringify(updatedUser));
  }, []);

  // Local Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await authApi.login(credentials);
    handleAuthSuccess(res);
    return res;
  }, [handleAuthSuccess]);

  // Local Signup
  const signup = useCallback(async (data: SignupData): Promise<AuthResponse> => {
    const res = await authApi.signup(data);
    handleAuthSuccess(res);
    return res;
  }, [handleAuthSuccess]);

  // Google Login
  const loginWithGoogle = useCallback(async (credential: string): Promise<AuthResponse> => {
    const res = await authApi.googleAuth({ credential });
    handleAuthSuccess(res);
    return res;
  }, [handleAuthSuccess]);

  // Initial authentication verification & config loading
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // 1. Fetch public auth config
      try {
        const config = await authApi.getConfig();
        if (isMounted && config.google_client_id) {
          setGoogleClientId(config.google_client_id);
        }
      } catch {
        // Backend might still be starting or offline
      }

      // 2. Validate existing token session
      const storedToken = localStorage.getItem('aipave_auth_token');
      if (storedToken) {
        try {
          const profile = await authApi.getCurrentUser();
          if (isMounted) {
            setUser(profile);
            localStorage.setItem('aipave_user', JSON.stringify(profile));
          }
        } catch {
          if (isMounted) {
            // Token is expired or invalid
            setToken(null);
            setUser(null);
            localStorage.removeItem('aipave_auth_token');
            localStorage.removeItem('aipave_user');
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        googleClientId,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
