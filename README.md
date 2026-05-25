# Worknoon Chat Frontend

Next.js frontend for the Worknoon real-time chat assessment. It provides the authenticated chat workspace for customers, designers, merchants, agents, and admins.

## Technologies

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Socket.IO client

## What It Provides

- Signup, login, email verification, forgot password, and reset password flows.
- Role-aware authenticated workspace shell.
- Inbox and real-time chat view.
- Support bot flow with human-agent handoff.
- Designer and merchant browsing for direct conversations.
- Profile/settings screen.
- Orders page connected to backend order data.
- Admin dashboard, users, agents, and conversations views.
- Agent queue and assigned-case views.
- WordPress iframe embedding support through `WORDPRESS_FRAME_ANCESTORS`.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:3000` by default.

Set the backend origin in `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
WORDPRESS_FRAME_ANCESTORS=http://localhost:8080
```

The backend API is versioned under `/api/v1`.

Useful local commands:

```bash
make dev
make lint
make typecheck
make build
```

## Demo Login

Run the backend demo seed first:

```bash
cd ../worknoon-chat-backend
npm run seed:demo
```

All demo users use the backend `SEED_DEMO_PASSWORD`.

Useful demo emails:

- `bamiduroeniolagabriel@gmail.com` - admin
- `gabriel@example.com` - customer
- `alice@example.com` - designer
- `hello@techstore.com` - merchant
- `amara.osei@worknoon.io` - support agent

Admins are routed to `/secure-end/Admin` after login. Non-admin users land on `/inbox`.

## Architecture

The frontend is organized by product feature and keeps backend communication isolated from view components.

- `src/app` - App Router routes and layouts.
- `src/features/auth` - auth screens and account actions.
- `src/features/inbox` - conversation list, search, filtering, and unread state.
- `src/features/chat` - message history, composer, optimistic sends, and Socket.IO events.
- `src/features/support-bot` - guided support flow and agent handoff.
- `src/features/new-conversation` - designer/merchant browsing and direct chat creation.
- `src/features/orders` - current-user order list and conversation links.
- `src/features/profile` - current-user profile/settings.
- `src/features/admin` - admin dashboard, users, agents, and conversations.
- `src/features/agent` - support queue and assigned cases.
- `src/lib/api` - typed backend API calls and safe error mapping.
- `src/lib/realtime` - Socket.IO setup and event contracts.
- `src/lib/session` - session provider, access-token store, and route helpers.
- `src/components/ui` - reusable UI primitives.
- `src/styles` - global CSS and design tokens.

## Auth and Realtime Notes

- Protected API calls use `Authorization: Bearer <access-token>`.
- Refresh uses the backend-managed `httpOnly` cookie.
- Token refresh is single-flight so concurrent `401` responses share one refresh request.
- Socket.IO authenticates with the current access token and joins conversation rooms as needed.
- User message content is rendered as plain text only.

## WordPress Embed Notes

The WordPress plugin loads this frontend in an iframe. Configure `WORDPRESS_FRAME_ANCESTORS` with the WordPress site origin so the browser allows the embed.

The iframe receives:

- `embed=wordpress`
- `context=support|designer|merchant`
- `sourceUrl`

## Challenges and Tradeoffs

- The support bot initially created a conversation before an agent was assigned, which could leave the user in a self-chat. The final frontend calls the backend support endpoint so assignment and opening message creation happen together.
- Mock data was removed late in the build, which required wiring admin, directory, orders, inbox, and support handoff screens to real backend APIs while preserving the UI.
- Contact role labels in the chat header depended on preloading user metadata. A backend pagination limit mismatch blocked that cache until the shared limit was raised.
- Admin login originally redirected to the inbox like every other role. The final route helper sends admins directly to the admin dashboard.
- The interface favors a clean SaaS workspace over a marketing page so repeated chat/admin workflows stay practical.

## Validation

```bash
npm run typecheck
npm run lint
```
