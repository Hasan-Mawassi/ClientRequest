# Najahak Client Services

Najahak Client Services is a client-request management application. Users can register and sign in, create and track requests through `New`, `In Progress`, and `Done`, filter and manage requests, and view dashboard statistics and monthly activity.

The project contains a React and TypeScript frontend, an Express 5 and TypeScript API, Prisma 7, and PostgreSQL. Docker Compose can run the complete application, or you can run the frontend and API locally.

## Requirements

- Docker Desktop with Docker Compose, for the quickest setup
- Or Node.js 22+, npm, and PostgreSQL for local development

## Quick Start with Docker

1. Clone the repository and open its root directory:

   ```sh
   git clone https://github.com/Hasan-Mawassi/ClientRequest.git
   cd ClientRequest
   ```

2. Create a `.env` file in the repository root with local development values:

   ```dotenv
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/client_dashboard
   JWT_ACCESS_SECRET=replace_with_a_random_secret_at_least_32_characters
   JWT_REFRESH_SECRET=replace_with_a_different_random_secret_at_least_32_characters
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   FRONTEND_URL=http://localhost:8080
   ```

   Use different random values for the two JWT secrets. Do not use these example values in a deployed environment, and do not commit `.env`.

3. Build and start the services:

   ```sh
   docker compose up --build
   ```

4. Open the application and API health check:
   - Frontend: <http://localhost:8080>
   - API health: <http://localhost:4000/health>
   - PostgreSQL from your host: `localhost:5433`

The API container waits for PostgreSQL, applies migrations, runs the development seed, and then starts the API. The seed creates a demo account: `demo@example.com` / `Password123`.

**Seed behavior:** each API container start re-runs the seed. It resets the demo user’s password and deletes and recreates that demo user’s requests. This is sample-data behavior for development; do not use the seed with real user data.

Stop the services with `docker compose down`. The database volume is retained. To delete the local database volume as well, use `docker compose down -v`; this permanently removes the database data.

## Local Development

These steps run the API and frontend on your machine and PostgreSQL separately.

1. Create a PostgreSQL database, then configure the backend:

   ```sh
   cd backend
   cp .env.example .env
   ```

   Set `DATABASE_URL` to your local PostgreSQL connection string, for example:

   ```dotenv
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/client_dashboard
   ```

   Keep the JWT secrets at least 32 characters long. The example backend configuration uses port `3001` and allows the frontend at `http://localhost:5173`.

2. Install backend dependencies, generate the Prisma client, apply migrations, and start the API:

   ```sh
   
   npx prisma generate 
   npx prisma migrate dev 
   npm run dev
   ```

   The API is available at <http://localhost:3001>; check <http://localhost:3001/health>.

3. In a second terminal, configure and start the frontend:

   ```sh
   cd my-react-app
   npm ci
   ```

   Create `my-react-app/.env.local` with:

   ```dotenv
   VITE_BASE_URL=http://localhost:3001/v1/api
   ```

   Then run:

   ```sh
   npm run dev
   ```

   Open the local Vite URL printed in the terminal, usually <http://localhost:5173>.

To add or refresh the development demo data manually, run from `backend/`:

```sh
npx prisma db seed --config prisma7.config.ts
```

The seed behavior described above applies to this command too.

## API Overview

The API prefix is `/v1/api`. Authentication endpoints are:

| Method | Endpoint                | Purpose                                          |
| ------ | ----------------------- | ------------------------------------------------ |
| `POST` | `/v1/api/auth/register` | Register an account                              |
| `POST` | `/v1/api/auth/login`    | Sign in and receive an access token              |
| `POST` | `/v1/api/auth/refresh`  | Refresh an access token using the refresh cookie |
| `POST` | `/v1/api/auth/logout`   | Sign out and clear the refresh cookie            |
| `GET`  | `/v1/api/auth/check`    | Check the current authenticated user             |

Authenticated request and dashboard endpoints are:

| Method   | Endpoint                             | Purpose                                                                |
| -------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `GET`    | `/v1/api/requests`                   | List requests; supports `page`, `limit`, and `status` query parameters |
| `POST`   | `/v1/api/requests`                   | Create a request                                                       |
| `GET`    | `/v1/api/requests/:id`               | Get one request                                                        |
| `PATCH`  | `/v1/api/requests/:id/status`        | Advance a request status                                               |
| `DELETE` | `/v1/api/requests/:id`               | Delete a request                                                       |
| `GET`    | `/v1/api/requests/dashboard/stats`   | Get request totals by status                                           |
| `GET`    | `/v1/api/requests/dashboard/monthly` | Get monthly request counts                                             |

## Useful Commands

Run these from the relevant project directory:

| Directory       | Command                     | Purpose                               |
| --------------- | --------------------------- | ------------------------------------- |
| `backend/`      | `npm run dev`               | Start the API in watch mode           |
| `backend/`      | `npm run build`             | Compile the API                       |
| `my-react-app/` | `npm run dev`               | Start the frontend development server |
| `my-react-app/` | `npm run build`             | Type-check and build the frontend     |                   |
| Repository root | `docker compose up --build` | Build and start the full stack        |


