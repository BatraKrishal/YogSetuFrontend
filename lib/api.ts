import { Booking, Session, User } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

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

  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, options, false);
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error(`API Error: ${options.method || 'GET'} ${path} - ${res.status}`, errorBody);
    throw errorBody;
  }

  return res.json();
}

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
      name?: string;
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

  /* ---------- DASHBOARD ---------- */

  getWalletBalance() {
    return request<{ balance: number }>("/wallet");
  },

  getWalletTransactions() {
    return request<import("@/types").Transaction[]>("/wallet/transactions");
  },

  topUpWallet(amount: number) {
    return request<{ clientSecret: string }>("/payments/topup", {
      method: "POST",
      body: JSON.stringify({ amount })
    });
  },

  getBookings() {
    return request<{ bookings: Booking[]; total: number }>("/me/bookings");
  },

  getSessions() {
    return request<Session[]>("/sessions");
  },

  bookSession(sessionId: string) {
    return request<{ bookingId: string; clientSecret: string; bookingStatus: string }>(
      `/sessions/${sessionId}/book/stripe`,
      { method: "POST" }
    );
  },

  cancelBooking(bookingId: string) {
    return request<{ message: string }>(
      `/sessions/bookings/${bookingId}/cancel`,
      { method: "POST" }
    );
  },

  /* ---------- STUDENT FEATURES ---------- */

  getMyPayments() {
    return request<import("@/types").Payment[]>("/me/payments");
  },

  /* ---------- INSTRUCTOR FEATURES ---------- */

  createSession(data: {
    startTime: string;
    endTime: string;
    price: number;
    capacity?: number;
  }) {
    return request<Session>("/instructor/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  completeSession(sessionId: string) {
    return request<{ message: string }>(
      `/instructor/sessions/${sessionId}/complete`,
      { method: "POST" }
    );
  },

  getInstructorSessions(instructorId?: string) {
    const query = instructorId ? `?instructorId=${instructorId}` : "";
    return request<Session[]>(`/sessions${query}`);
  },

  /* ---------- PROFILE MANAGEMENT ---------- */

  updateProfile(data: {
    fullName?: string;
    avatarUrl?: string;
    phone?: string;
    bio?: string;
  }) {
    return request<User>("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /* ---------- INSTRUCTOR APPLICATION ---------- */

  applyToBecomeInstructor(data: {
    bio: string;
    certificates: string[];
    demoVideos: string[];
  }) {
    return request<{ id: string; status: string }>("/instructor/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /* ---------- ADMIN FUNCTIONS ---------- */

  getInstructorApplications() {
    return request<
      {
        id: string;
        user: { id: string; email: string };
        bio: string;
        certificates: string[];
        demoVideos: string[];
        status: "PENDING" | "APPROVED" | "REJECTED";
        reviewNotes?: string;
        createdAt: string;
      }[]
    >("/admin/instructor-applications");
  },

  approveInstructorApplication(id: string) {
    return request<{ message: string; userId: string }>(
      `/admin/instructor-applications/${id}/approve`,
      { method: "POST" }
    );
  },

  rejectInstructorApplication(id: string, reviewNotes?: string) {
    return request<{ message: string; userId: string }>(
      `/admin/instructor-applications/${id}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reviewNotes }),
      }
    );
  },

  getPaymentReconciliation(from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    return request<{
      stripeSucceededCount: number;
      stripeSucceededAmount: string;
      walletCreditedAmount: string;
      difference: string;
      healthy: boolean;
    }>(`/admin/payments/reconciliation?${params.toString()}`);
  },

  getPaymentIntents(
    from?: string,
    to?: string,
    page = 1,
    limit = 50
  ) {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    return request<import("@/types").Payment[]>(
      `/admin/payments/payment-intents?${params.toString()}`
    );
  },
};
