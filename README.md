# AuthGuard — JWT Authentication & Role-Based Access Control

A full-stack authentication demo implementing JWT-based login/signup,
session persistence, and role-protected routes (RBAC).

## Features

- **JWT authentication** — backend issues signed tokens on login/signup, verified on every protected request
- **Login & signup forms** — client-side validation with error handling
- **Session persistence** — token and user stored in `localStorage`, session restored on page refresh
- **Protected routes** — unauthenticated visitors are redirected to the login page (and returned to their original destination after logging in)
- **Role-based access control (RBAC)** — `user` and `admin` roles; admin-only routes show a 403 page for unauthorized roles, enforced on both client and server

## Tech Stack
   Layer | Technology |
 |---|---|
 | Frontend | React, Vite, React Router, Axios |
 | Backend | Node.js, Express |
 | Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Backend
```bash
cd server
npm install
# create .env with JWT_SECRET=your_secret and PORT=5000
node server.js
```

### 2. Frontend
```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

## Project Structure

```
src/
├── App.jsx             # Routes + navigation
├── auth.js             # Token storage & API client
├── AuthContext.jsx     # Global auth state (React Context)
├── ProtectedRoute.jsx  # Auth + role guard for routes
├── Login.jsx           # Login form
└── Signup.jsx          # Signup form (user/admin role selection)

server/
├── server.js           # Express API: signup, login, protected + admin endpoints
└── .env                # JWT_SECRET, PORT
```

## How It Works

1. **Signup/Login** → backend validates credentials, signs a JWT containing `{ id, email, roles }`, and returns it with the user object.
2. **Persistence** → the frontend stores the token and user in `localStorage`; on refresh, `auth.init()` restores the session and re-attaches the `Authorization: Bearer <token>` header.
3. **Protected routes** → `ProtectedRoute` redirects unauthenticated users to `/login` (remembering the original URL) and renders a 403 view for users lacking the required role.
4. **Server-side enforcement** → `authMiddleware` verifies the JWT and `requireRole("admin")` re-checks roles on every request, so authorization never relies on the client alone.

## Demo Walkthrough
 | Step | Expected result |
 |---|---|
 | Visit `/profile` while logged out | Redirected to `/login` |
 | Sign up as **user**, visit `/admin` | 403 — Access Denied |
 | Sign up as **admin`, visit `/admin` | Admin panel renders |
 | Refresh the page | Session persists, still logged in |
 | Logout | Protected routes block again |

## Security Notes

- Passwords are hashed with **bcrypt** — never stored in plain text
- Roles are re-verified on the **backend** for every request; the frontend guard is UX only
- Demo uses in-memory user storage and `localStorage` for simplicity — for production, use a real database and httpOnly cookies to mitigate XSS token theft

## License

MIT
