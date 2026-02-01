# Better API Monorepo

A modern, high-performance monorepo using **Bun**, **Hono**, **Better Auth**, **Prisma**, and **React**.

## Project Structure

- `backend/`: The API server built with Hono and Bun.
  - Authentication: [Better Auth](https://better-auth.com)
  - ORM: [Prisma](https://prisma.io)
  - Database: PostgreSQL
- `frontend/`: The UI built with Vite, React, and TypeScript.
  - Client: Better Auth React Client

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or newer)
- [PostgreSQL](https://www.postgresql.org/download/)

### Backend Setup

1. `cd backend`
2. `bun install`
3. Configure `.env` (use `.env.example` as a template)
4. Update Prisma schema and generate client:
   ```bash
   bunx prisma generate
   ```
5. Run the dev server:
   ```bash
   bun dev
   ```

### Frontend Setup

1. `cd frontend`
2. `bun install`
3. Run the dev server:
   ```bash
   bun dev
   ```

## Key Technologies

- **Bun**: Fast JavaScript runtime & package manager.
- **Hono**: Ultrafast web framework.
- **Better Auth**: Comprehensive authentication library.
- **Prisma**: Type-safe ORM for PostgreSQL.
- **Vite & React**: Modern frontend development.

## License

MIT
