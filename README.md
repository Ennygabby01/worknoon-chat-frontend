# Worknoon Chat Frontend

Next.js frontend for the Worknoon real-time chat assessment.

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

The app defaults to `http://localhost:3000` and expects the backend at `NEXT_PUBLIC_API_URL`.
Frontend API calls target the versioned backend path `/api/v1`.

## Project Structure

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

## Notes

- Use `src/proxy.ts`, not `middleware.ts`.
- Tailwind is used as a utility layer with custom CSS tokens/components.
- Public signup only exposes customer, designer, and merchant roles.
- User-facing errors must be safe, human-friendly messages.
- Do not show raw backend JSON, HTTP jargon, stack traces, or parser errors in the UI.
