export interface SignupRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    uid: string;
    email: string;
    displayName?: string;
    token?: string;
  };
  error?: string;
}

export interface TokenValidationRequest {
  token: string;
}

export interface TokenValidationResponse {
  success: boolean;
  message: string;
  data?: {
    uid: string;
    email: string;
    displayName?: string;
  };
  error?: string;
}
