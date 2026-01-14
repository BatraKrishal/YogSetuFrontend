/**
 * User Role type definition matching backend roles.
 */
export type UserRole = 'USER' | 'INSTRUCTOR' | 'ADMIN';

/**
 * User interface matching backend /me response.
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  name?: string; // Optional display name
}

/**
 * Session status enum matching backend.
 */
export type SessionStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

/**
 * Yoga Session interface matching backend DTO.
 */
export interface Session {
  id: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  price: number;
  instructorId: string;
  capacity: number;
  currentBookings: number;
  status: SessionStatus;
  instructor?: User; // Optional expanded instructor details
  title?: string; // Frontend-specific field for display (since backend doesn't seem to have a title in the docs? - adding for UI)
  description?: string; // Frontend-specific
  image?: string; // Frontend-specific
}

/**
 * Booking status enum.
 */
export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'REFUND_PENDING' | 'REFUNDED' | 'FAILED';

/**
 * Booking interface matching backend DTO.
 */
export interface Booking {
  id: string;
  sessionId: string;
  userId: string;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  bookingStatus: BookingStatus;
  pricePaid: number;
  createdAt: string;
  session?: Session; // Expanded session details
}

/**
 * Payment interface matching backend DTO.
 */
export interface Payment {
  id: string;
  amount: string;
  currency: string; // Add currency field
  status: 'CREATED' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  provider: string;
  providerPaymentId: string | null;
  createdAt: string;
  type: 'TOPUP' | 'SESSION_BOOKING';
  bookingId: string | null;
  walletCredited: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  description?: string;
  createdAt: string;
}

/**
 * Wallet Transaction interface.
 */
export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  description?: string;
  createdAt: string;
}
