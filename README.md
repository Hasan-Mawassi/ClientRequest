# Najahak Client Services

Internal client-request workspace with a React frontend, Express API, and PostgreSQL database. The current slice includes account registration, login, cookie-based sessions, and a starting point for the client-request dashboard.

## Requirements

- Node.js 22 or later
- PostgreSQL

## Backend Setup

```sh
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL` and replace both JWT secrets with independent random values of at least 32 characters. Keep `.env` private; it is git-ignored.

```sh
npx prisma migrate dev --name init
npm run dev
```

The API listens on port `3000` by default. `GET /health` checks availability.

## Frontend Setup

In a second terminal:

```sh
cd my-react-app
npm install
npm run dev
```

The frontend defaults to `http://localhost:3000/api/auth`. Override it with `VITE_API_URL` in `my-react-app/.env.local` when the API uses another address.

## Auth API

- `POST /api/auth/register` accepts `{ "name", "email", "password" }`.
- `POST /api/auth/login` accepts `{ "email", "password" }`.
- `POST /api/auth/refresh` rotates the refresh session and renews both cookies.
- `POST /api/auth/logout` revokes the refresh session and clears cookies.
- `GET /api/auth/me` returns the current user when the access cookie is valid.

Access and refresh tokens are returned only as `HttpOnly` cookies, never in JSON or browser storage. Refresh-token hashes are persisted in `AuthSession`; passwords are stored as bcrypt hashes. Cookies use `Secure` in production and `SameSite=Lax`.

## Structure

```text
backend/src/modules/auth/
	auth.router.ts
	auth.controller.ts
	auth.service.ts
	auth.interface.ts
	auth.repository.ts
	auth.middleware.ts
	auth.password.ts
	auth.tokens.ts
my-react-app/src/features/auth/
	authApi.ts
```
