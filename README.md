# Worknoon Chat Frontend

Next.js frontend for the Worknoon real-time chat assessment. It provides the user-facing chat workspace for authentication, inbox, realtime messaging, profile management, and admin overview screens.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Socket.IO client

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:3000` by default. Set `NEXT_PUBLIC_API_URL` to the backend origin, for example:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The backend API is versioned under `/api/v1`.

## Features

- Login, signup, email verification, and password reset flows.
- Protected chat workspace shell.
- Inbox and conversation list.
- Realtime chat view with Socket.IO.
- Profile update screen.
- Admin dashboard for platform overview data.

## Architecture

The frontend is organized by product feature and keeps backend communication isolated from view components.

- `src/app`: App Router routes and layouts.
- `src/features/auth`: login, signup, email verification, password reset, session, refresh, logout.
- `src/features/inbox`: conversation list and unread state.
- `src/features/chat`: message history, composer, Socket.IO events.
- `src/features/profile`: current user profile.
- `src/features/admin`: admin dashboard.
- `src/lib/api`: backend API client and safe error mapping.
- `src/lib/realtime`: Socket.IO event contracts.
- `src/lib/session`: shared session types and helpers.
- `src/components/ui`: reusable UI primitives.
- `src/styles`: global CSS and design tokens.
