import { apiClient } from './api';
import {
  AuthResponse,
  LoginCredentials,
  SignupData,
  GoogleAuthPayload,
  User,
  AuthConfigResponse,
} from '../types/auth';

export const authApi = {
  /**
   * Fetch backend auth public config (e.g. Google Client ID)
   */
  async getConfig(): Promise<AuthConfigResponse> {
    const response = await apiClient.get<AuthConfigResponse>('/auth/config');
    return response.data;
  },

  /**
   * Log in with local email & password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new account with email & password
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  /**
   * Sign in / sign up using Google ID Token
   */
  async googleAuth(payload: GoogleAuthPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', payload);
    return response.data;
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Update profile information
   */
  async updateProfile(updates: Partial<Pick<User, 'full_name' | 'role' | 'avatar_url'>>): Promise<User> {
    const response = await apiClient.put<User>('/auth/me', updates);
    return response.data;
  },

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
