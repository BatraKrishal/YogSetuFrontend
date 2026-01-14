import { create } from "zustand";
import { api, setAccessToken } from "@/lib/api";

/**
 * AUTH STORE
 * ----------------------------------------------------
 * Client-side mirror of authentication state.
 *
 * Source of truth:
 * - Backend (cookies + /me endpoint)
 *
 * This store:
 * - Does NOT store tokens
 * - Does NOT persist to localStorage
 * - Exists only for UX & routing decisions
 */

/* ----------------------------------------------------
   Types
---------------------------------------------------- */

export type User = {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  isEmailVerified: boolean;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  // core flows
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;

  // email verification
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;

  // internal
  clearUser: () => void;
};

/* ----------------------------------------------------
   Store Implementation
---------------------------------------------------- */

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  /* ---------------------------
     Login
  --------------------------- */
  login: async (email, password) => {
    const { accessToken } = await api.login(email, password);
    setAccessToken(accessToken);
    await useAuthStore.getState().bootstrap();
  },

  /* ---------------------------
     Signup
  --------------------------- */
  signup: async (email, password) => {
    const { accessToken } = await api.signup(email, password);
    setAccessToken(accessToken);
    await useAuthStore.getState().bootstrap();
  },

  /* ---------------------------
     Bootstrap
     - Called on app load
     - Uses cookies + /me
  --------------------------- */
  bootstrap: async () => {
    set({ loading: true });
    try {
      const user = await api.getMe();

      // Normalized user logging for debug
      console.log("Auth Bootstrap - User:", user);

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      setAccessToken(null);
    }
  },

  /* ---------------------------
     Logout
  --------------------------- */
  logout: async () => {
    try {
      await api.logout();
    } finally {
      useAuthStore.getState().clearUser();
    }
  },

  /* ---------------------------
     Email Verification
  --------------------------- */
  verifyEmail: async (token: string) => {
    await api.verifyEmail(token);
    await useAuthStore.getState().bootstrap();
  },

  resendVerification: async () => {
    await api.resendVerification();
  },

  /* ---------------------------
     Internal cleanup
  --------------------------- */
  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    setAccessToken(null);
  },
}));
