const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/**
 * In-memory access token (NOT persisted)
 * Cleared on refresh / logout
 */
let accessToken: string | null = null;

/**
 * Called by auth store after login / refresh
 */
export function setAccessToken(token: string | null) {
  accessToken = token;
}

/**
 * Core request wrapper
 * - Sends cookies (refreshToken)
 * - Attaches Authorization header
 * - Auto-refreshes access token on 401
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...options.headers,
    },
    credentials: "include",
  });

  // Access token expired → try refresh once
  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, options, false);
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw error;
  }

  return res.json();
}

/**
 * Refresh access token using refreshToken cookie
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

/* ======================================================
   API FUNCTIONS (NO LOGIC, JUST HTTP)
   ====================================================== */

export const api = {
  /* ---------- AUTH ---------- */

  login(email: string, password: string) {
    return request<{ accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup(email: string, password: string) {
    return request<{ accessToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return request<{ success: true }>("/auth/logout", {
      method: "POST",
    });
  },

  getMe() {
    return request<{
      id: string;
      email: string;
      role: "USER" | "INSTRUCTOR" | "ADMIN";
      isEmailVerified: boolean;
    }>("/me");
  },

  /* ---------- EMAIL VERIFICATION ---------- */

  verifyEmail(token: string) {
    return request<{ message: string }>(
      `/auth/verify-email?token=${token}`,
      { method: "GET" }
    );
  },

  resendVerification() {
    return request<{ message: string }>("/auth/resend-verification", {
      method: "POST",
    });
  },

  /* ---------- PASSWORD ---------- */

  forgotPassword(email: string) {
    return request<{ success: true }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(token: string, newPassword: string) {
    return request<{ success: true }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
