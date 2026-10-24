import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi, getStoredToken, getStoredUser, clearStoredAuth, setStoredUser, setStoredToken } from '../services/adminApi';
import { authService, type AdminSessionUser } from '../../lib/authService';
import { isFirebaseConfigured } from '../../lib/firebase';

interface AdminAuthContextType {
  user: AdminSessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminSessionUser | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // If Firebase is configured, listen to Firebase Auth state
    if (isFirebaseConfigured()) {
      const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setStoredUser(firebaseUser);
          setStoredToken(firebaseUser.id);
        } else {
          // If Firebase confirms no user is logged in
          const stored = getStoredUser();
          if (!stored) {
            setUser(null);
            clearStoredAuth();
          }
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }

    // Fallback: verify session token
    const verify = async () => {
      const token = getStoredToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const res = await adminApi.verifySession();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          clearStoredAuth();
          setUser(null);
        }
      } catch {
        clearStoredAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, []);

  const login = async (username: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      // 1. Authenticate with Firebase Auth if configured
      if (isFirebaseConfigured()) {
        try {
          const sessionUser = await authService.login(username, password);
          setUser(sessionUser);
          setStoredUser(sessionUser);
          setStoredToken(sessionUser.id);
          return;
        } catch (firebaseErr: any) {
          console.warn('Firebase login attempt:', firebaseErr.message);
          // If Firebase rejected credentials, throw error directly
          throw firebaseErr;
        }
      }

      // 2. Fallback to API login
      const res = await adminApi.login(username, password, rememberMe);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured()) {
        await authService.logout();
      }
      await adminApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearStoredAuth();
      setUser(null);
    }
  };

  const refreshSession = async () => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser({
        id: current.uid,
        email: current.email || '',
        username: (current.email || '').split('@')[0],
        role: 'superadmin',
      });
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
