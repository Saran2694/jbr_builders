import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export interface AdminSessionUser {
  id: string;
  email: string;
  username: string;
  role: 'superadmin' | 'admin';
}

export const authService = {
  /**
   * Signs in an administrator using Firebase Authentication.
   * Supports input as either full email or username (e.g. 'admin' -> 'admin@jbrbuilders.in').
   */
  async login(usernameOrEmail: string, password: string): Promise<AdminSessionUser> {
    if (!isFirebaseConfigured()) {
      // Local development fallback if Firebase is not yet configured
      if (
        (usernameOrEmail === 'admin' || usernameOrEmail === 'admin@jbrbuilders.in') &&
        password.length >= 6
      ) {
        return {
          id: 'dev-admin-id',
          email: 'admin@jbrbuilders.in',
          username: 'admin',
          role: 'superadmin',
        };
      }
      throw new Error(
        'Firebase credentials are not configured in .env. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID.'
      );
    }

    const email = usernameOrEmail.includes('@')
      ? usernameOrEmail.trim()
      : `${usernameOrEmail.trim()}@jbrbuilders.in`;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      id: user.uid,
      email: user.email || email,
      username: (user.email || email).split('@')[0],
      role: 'superadmin',
    };
  },

  /**
   * Signs out the current administrator
   */
  async logout(): Promise<void> {
    if (isFirebaseConfigured()) {
      await signOut(auth);
    }
  },

  /**
   * Subscribes to Firebase Authentication state changes
   */
  onAuthStateChanged(callback: (user: AdminSessionUser | null) => void): () => void {
    if (!isFirebaseConfigured()) {
      return () => {};
    }

    return onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        callback({
          id: user.uid,
          email: user.email || '',
          username: (user.email || '').split('@')[0] || 'admin',
          role: 'superadmin',
        });
      } else {
        callback(null);
      }
    });
  },

  getCurrentUser(): User | null {
    if (!isFirebaseConfigured()) return null;
    return auth.currentUser;
  },
};
