==============================
PROJECT STATUS & TODO
==============================

------------------------------
DONE
------------------------------
- Landing page (public entry)
- Auth routes:
  - Login
  - Signup
  - Forgot password
  - Reset password
- Zod validation for all auth forms
- Cookie-based authentication
- Global auth state using Zustand
- Auth bootstrap using GET /me
- Protected dashboard (client-side)
- Logout functionality

------------------------------
TODO (DO NEXT)
------------------------------
1. Profile / Me Page
   - Create /dashboard/profile
   - Call GET /me
   - Show:
     - email
     - role (USER / INSTRUCTOR / ADMIN)
     - email verification status
   - Handle loading state

2. Sessions Listing (Read-only)
   - Create /dashboard/sessions
   - Call GET /sessions
   - Render session cards:
     - instructor
     - start time
     - end time
     - price
     - capacity / current bookings
   - No booking yet

3. Book Session (First Mutation Feature)
   - Add "Book Session" button
   - Call POST /sessions/:sessionId/book
   - Handle errors:
     - already booked
     - session full
   - Refresh session list after booking

4. My Bookings Page
   - Create /dashboard/bookings
   - Call GET /me/bookings
   - Display booking status:
     - BOOKED
     - CANCELLED
     - COMPLETED

------------------------------
TODO (POLISH LATER)
------------------------------
- Redirect logged-in users away from /login and /signup
- Unify loading indicators
- Improve auth error messages
- Minor UI cleanup for auth pages
- Add success redirects for reset password

------------------------------
TODO (LATER / PHASE 2)
------------------------------
- Wallet feature
  - GET /wallet
  - GET /wallet/transactions
- Payments
  - POST /payments/topup
  - GET /payments/history
- Instructor flows
  - Apply as instructor
  - Instructor session creation
- Admin flows
- Role-based access control
- Middleware-based route protection
- SSR / hybrid optimization
- Testing (unit + integration)
- Performance optimizations

------------------------------
NOT DOING NOW (INTENTIONALLY)
------------------------------
- Token decoding on frontend
- LocalStorage auth persistence
- Middleware auth enforcement
- Over-optimizing SSR
- Advanced caching
