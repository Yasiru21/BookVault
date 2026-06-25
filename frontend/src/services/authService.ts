import api from './api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Auth API Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Register a new user account.
 * Corresponds to: POST /api/auth/register
 */
export async function register(data: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

/**
 * Log in with email and password, receive a JWT token.
 * Corresponds to: POST /api/auth/login
 */
export async function login(data: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}
