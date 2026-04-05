# Task Management System

A production-ready, full-stack Task Management System built with Node.js/Express, TypeScript, Prisma, PostgreSQL, and React.

## Features

-   **🔐 Authentication**: Secure login/register with JWT Access & Refresh Tokens.
-   **📝 Task Management**: CRUD operations, filtering by status, and real-time search.
-   **⚡ Modern UI**: Responsive SaaS-style dashboard built with Tailwind CSS.
-   **🔄 Auto-Refresh**: Automatic token refresh via Axios interceptors.
-   **📦 Modular Architecture**: Clean, scalable backend following service/controller patterns.

---

## 🚀 Getting Started

### 1. Prerequisites

-   Node.js (v18+)
-   PostgreSQL instance running.

### 2. Backend Setup

1.  Navigate to `backend/`.
2.  Install dependencies: `npm install`.
3.  Configure `.env` using `.env.example`.
4.  Initialize Database:
    -   `npx prisma migrate dev --name init`
5.  Generate Prisma Client: `npx prisma generate`.
6.  Start the server: `npm run dev`.

### 3. Frontend Setup

1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Create `.env` file with `VITE_API_URL=http://localhost:5000`.
4.  Start development server: `npm run dev`.

---

## 🛠 Tech Stack

-   **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, Zod.
-   **Frontend**: React, Vite, Tailwind CSS, TanStack Query, Axios, Lucide React.
-   **Aesthetics**: Glassmorphism, Modern ShadCN-like components.

---

## 🧪 API Endpoints

-   `POST /auth/register` - Create new user.
-   `POST /auth/login` - Authenticate & get tokens.
-   `POST /auth/refresh` - Get new access token.
-   `GET /tasks` - Fetch user tasks with pagination & filters.
-   `POST /tasks` - Create new task.
-   `PATCH /tasks/:id/toggle` - Toggle task completion status.
-   `DELETE /tasks/:id` - Remove task.

---

## 🎨 UI Design

The design is inspired by modern SaaS applications like **Linear** and **Notion**, focusing on minimalist typography, subtle shadows, and smooth transitions.
<img src="c:\Users\acer\Pictures\Screenshots\Screenshot 2026-04-05 070047.png" alt="Screenshot 2026-04-05 070047.png" width="200" height="200">
<img src="c:\Users\acer\Pictures\Screenshots\Screenshot 2026-04-05 081924.png" alt="Screenshot 2026-04-05 081924.png" width="200" height="200">
<img src="c:\Users\acer\Pictures\Screenshots\Screenshot 2026-04-05 081857.png" alt="Screenshot 2026-04-05 081857.png" width="200" height="200">
<img src="c:\Users\acer\Pictures\Screenshots\Screenshot 2026-04-05 081849.png" alt="Screenshot 2026-04-05 081849.png" width="200" height="200">
<img src="c:\Users\acer\Pictures\Screenshots\Screenshot 2026-04-05 081823.png" alt="Screenshot 2026-04-05 081823.png" width="200" height="200">
