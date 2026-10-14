export type UserRole = 'inspector' | 'engineer' | 'contractor' | 'admin' | string;

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  auth_provider: 'local' | 'google';
  created_at: string;
  last_login?: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}

export interface GoogleAuthPayload {
  credential: string;
  client_id?: string;
}

export interface AuthConfigResponse {
  google_client_id: string;
  project_name: string;
  version: string;
}
