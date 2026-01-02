import { create } from "zustand";

/**
 * AUTH STORE
 * ----------------------------------------------------
 * This store is a CLIENT-SIDE mirror of authentication state.
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

type User = {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  isEmailVerified: boolean;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  // actions
  setUser: (user: User) => void;
  clearUser: () => void;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
};

/* ----------------------------------------------------
   Config
---------------------------------------------------- */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

/* ----------------------------------------------------
   Store Implementation
---------------------------------------------------- */

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  /**
   * Sets authenticated user
   */
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  /**
   * Clears auth state (used on logout / 401)
   */
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),

  /**
   * Bootstrap auth state on app load
   * --------------------------------------------------
   * Calls GET /me using cookies
   * - 200 → user authenticated
   * - 401 → user not logged in
   */
  bootstrap: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Not authenticated");
      }

      const user: User = await res.json();
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
    }
  },

  logout: async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // even if this fails, we still clear local state
  }

  set({
    user: null,
    isAuthenticated: false,
    loading: false,
  });
},

}));
