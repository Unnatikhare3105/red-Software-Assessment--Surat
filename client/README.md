# Frontend — Inventory Management System

Next.js (App Router) + TypeScript + Redux Toolkit + Tailwind CSS.

## Data flow (strict layering)
```
service → thunk → slice → UI
```
- **service**: raw API calls (axios instance with JWT interceptor), one file per domain (`auth.service.ts`, `product.service.ts`, `category.service.ts`, `dashboard.service.ts`).
- **thunk**: `createAsyncThunk` wrappers per domain — calls the service, handles pending/fulfilled/rejected.
- **slice**: Redux Toolkit slice — state shape + `extraReducers` wired to the thunk.
- **UI**: components/pages — dispatch thunks, read state via `useAppSelector`. No direct API calls from components.

## Folder structure

```
frontend/
├── src/
│ ├── app/ # Next.js App Router pages
│ │ ├── (auth)/login, register
│ │ ├── dashboard/
│ │ ├── products/ (+ [uuid]/ detail page)
│ │ └── categories/
│ ├── components/
│ │ ├── ui/ # generic reusable components (Button, Input, Modal, StatusBadge, etc.)
│ │ ├── layout/ # Sidebar, DashboardLayout
│ │ ├── products/ # ProductForm, StockAdjustModal
│ │ └── categories/ # CategoryForm
│ ├── redux/
│ │ ├── store.ts, hooks.ts
│ │ └── slices/ # auth, product, category, dashboard, theme
│ ├── thunks/ # createAsyncThunk per feature
│ ├── services/ # api.service.ts (axios instance) + per-feature services
│ └── types/ # shared TypeScript interfaces
├── .env.example
├── package.json
└── tsconfig.json
```

## Key decisions
- **Routing uses `uuid`**: e.g. `/products/[uuid]`, matching the backend's public ID strategy.
- **Auth tokens**: stored in `localStorage` (`accessToken`, `refreshToken`, `user`) — matches the backend's header-only auth. An axios interceptor attaches the token to every request and auto-refreshes once on a `401`, queueing concurrent requests instead of firing multiple refresh calls.
- **Perceived speed**: Next.js client-side routing (no full reloads), debounced search (400ms) instead of a request per keystroke, and loading states scoped to individual actions rather than blocking the whole page.
- **Theme**: light/dark mode via Tailwind's `dark:` class strategy, toggled from the sidebar and persisted in `localStorage`.
- Loading indicators, success/error toasts (`react-hot-toast`), form validation, and empty states are handled at the UI layer per assignment spec.

## Setup
```bash
cd frontend
cp .env.example .env.local     # set your backend API URL
npm install
npm run dev                     # http://localhost:3000
```

## Env vars
See `.env.example`. Required: `NEXT_PUBLIC_API_BASE_URL` (backend base URL, e.g. `http://localhost:5000/api`).

## Scripts
- `npm run dev` — development server
- `npm run build` / `npm start` — production build + serve
- `npm run lint` — ESLint