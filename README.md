# Worknoon Chat Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)

Next.js frontend for the Worknoon real-time chat assessment. It provides the authenticated chat workspace for customers, designers, merchants, agents, and admins.

## Demo Video

- [Worknoon Chat demo walkthrough](https://www.loom.com/share/7f0a051d7c7f46a9bf3c7261adcc0d0f)

## Related Repositories

- [Backend - API and realtime server](https://github.com/Ennygabby01/worknoon-chat-backend)
- [WordPress - plugin integration](https://github.com/Ennygabby01/worknoon-chat-wordpress)

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
make start
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
- The inbox listens for realtime new/updated conversations and joins newly received rooms, so direct chats and support handoffs do not require a refresh.
- User message content is rendered as plain text only.

## WordPress Embed Notes

The WordPress plugin loads this frontend in an iframe. Configure `WORDPRESS_FRAME_ANCESTORS` with the WordPress site origin so the browser allows the embed.

The iframe receives:

- `embed=wordpress`
- `context=support|designer|merchant`
- `sourceUrl`

## Challenges and Tradeoffs

- The support bot originally handed off with a packed context message and could leave agents without the actual prior chat. The frontend now sends the bot/customer transcript to the backend as structured messages, shows a waiting state, and unlocks the customer composer only after an agent claims the case.
- Agents can see escalated support requests in the inbox list and take them from there. If another agent claims first, the UI removes the stale queue item and shows a safe conflict message.
- Mock data was useful for building the UI quickly, but it became a delivery risk. I removed the mock mode and wired admin, directory, orders, inbox, and support handoff screens to real backend APIs so the demo reflects the actual system.
- Chat header role labels depended on a contact cache. A backend pagination cap caused that preload to fail silently, so the UI could show names without roles. The fix was coordinated with the backend and the frontend now relies on the real contact cache.
- Admin users originally landed in the inbox after login because all roles shared one redirect. A role-aware route helper now sends admins to `/secure-end/Admin` and keeps other users on `/inbox`.
- The UI had to balance a polished Dribbble-inspired look with assessment time. I prioritized the core chat, admin, agent, directory, order, and WordPress embed flows; bonus items such as dark mode, file uploads, and push notifications were not implemented.
- Token refresh is handled as a single-flight request so concurrent API failures do not spam refresh calls or cause avoidable logout behavior.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```
