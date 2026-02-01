# better-auth-postgres-starter

A premium, high-performance authentication boilerplate built with **Bun**, **Hono**, **Prisma**, and **Better Auth**. Optimized for developer experience and production-ready security.

Developed with ❤️ by **Sai Akash Neela**.

## 🚀 Features

- **🛡️ Full Auth Suite**: Email/Password, Magic Link, and Social Logins (GitHub, Google).
- **🐘 PostgreSQL Core**: Robust data persistence with Prisma ORM.
- **⚡ Bun & Hono**: Blazing fast runtime and minimalist API framework.
- **📧 Local Email Testing**: catch-all email capture with **Maildev**.
- **📦 Optimized Responses**: Gzip compression and secure CORS enabled.
- **🔍 Type Safety**: End-to-end TypeScript for robust development.
- **🛡️ RBAC**: Built-in Admin/User roles and protected route middleware.

## 📁 Project Structure

```bash
├── backend/            # Hono API + Prisma + Better Auth
└── frontend/           # Vite + React + Better Auth Client
```

## 🛠️ Getting Started

### 1. Environment Configuration
Copy `.env.example` to `.env` in the `backend/` folder and fill in your PostgreSQL credentials and provider secrets.

### 2. Database Setup
```bash
cd backend
bun install
bunx prisma db push
```

### 3. Start Development
```bash
# In backend/
bun dev

# In frontend/
bun dev
```

## 📬 Local Email Testing
This boilerplate is configured to work with **Maildev** on port `1025`. All verification and magic link emails will be captured locally during development.

---

## 👨‍💻 Credits
Created and maintained by **Sai Akash Neela** ([@SaiAkashNeela](https://github.com/SaiAkashNeela)).
