import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, AuthResponse } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Context
// Provides global authentication state across the entire React app.
// Uses localStorage to persist the session across page refreshes.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Load persisted user from localStorage on app start */
function loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/** Provides authentication state to all child components */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUserFromStorage);

  /** Called after successful login/register — persists auth state */
  const login = useCallback((authResponse: AuthResponse) => {
    const userData: User = {
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role,
      token: authResponse.token,
    };
    // Persist in localStorage so the session survives page refreshes
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  /** Clears auth state and removes token from localStorage */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Custom hook to access auth context — throws if used outside AuthProvider */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
