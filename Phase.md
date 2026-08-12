# RED Software Assignment — Phase Tracker

**Project:** Inventory Management System (CRUD)
**Deadline:** within 2 days of receipt (assignment shared Aug 11, 2026)
**Status legend:** ⬜ Not started · 🟨 In progress · ✅ Done

This file is the single source of truth for progress. Update it after every response so work can resume in a fresh chat/session without re-explaining anything. Read this + `README.md` (root/backend/frontend) first in any new session.

---

## Build order
Backend fully → Frontend fully. No parallel work.

---

## BACKEND PHASES

### Phase B0 — Project Setup ✅
- TypeScript + Node(20 LTS target) + Express init — `package.json`, `tsconfig.json`
- Folder structure created: `routes/ middlewares/ controllers/ services/ repositories/ models/ validations/ utils/ types/`
- `config/env.config.ts` — all env vars read once, wrapped in `Object.freeze` (nested freeze for sub-objects too)
- `config/db.config.ts` — Mongo connect
- `config/redis.config.ts` — ioredis client
- `utils/logger.ts` — Winston (console + file transports, dev/prod formats)
- `utils/ApiError.ts` + `middlewares/errorHandler.middleware.ts` — centralized error handling, standard status codes
- `utils/generateUuid.ts` — single source for public `uuid` generation
- `app.ts` (helmet, cors, compression, mongo-sanitize, `/health` route) + `server.ts` (bootstrap, graceful shutdown)
- ESLint + Prettier config, `.gitignore`, `.env.example`, `nodemon.json`
- **Not yet run**: `npm install` (do this locally — network/package install not run in this session)

### Phase B1 — DB & Core Models ✅
- User, Product, Category models created with `uuid` + timestamps
- Product: per-user unique SKU (`userId+sku` compound index), per-product `lowStockThreshold` (default 10)
- Repository layer: every Product/Category function requires `userId` param — ownership enforced at data-access level

### Phase B2 — Auth ✅
- Register/Login/Logout/Refresh — token via Authorization header only (no cookies)
- Redis: refresh token rotation (`refreshToken:{uuid}`, 7d TTL) + access token blacklist on logout (exact remaining TTL)
- JWT payload includes uuid + role (avoids DB hit per request for ownership/authorization checks)

### Phase B3 — Product & Category CRUD ✅
- Full CRUD for Product & Category, all ownership-scoped via req.user.uuid
- categoryId made optional on Product; category delete unassigns (sets categoryId: null) instead of blocking
- Stock status derived server-side (deriveStatus), never client-settable
- SKU duplicate (E11000) mapped to 409 Conflict

### Phase B4 — Inventory Features ✅
- Search (name/SKU regex), filter (category/status), sort, pagination — GET /products?search=&categoryId=&status=&sortBy=&sortOrder=&page=&limit=
- Dashboard aggregation ($group) — GET /dashboard/stats
- Stock increase/reduce — PATCH /products/:uuid/stock/increase|reduce — negative guard at service AND DB (atomic $gte condition, race-safe)

### Phase B5 — Cross-cutting ✅
- Fixed: removed unused cookie-parser from app.ts (contradicted header-only auth decision); fixed ApiError import case-mismatch in errorHandler.middleware.ts
- Request logging: morgan → winston stream, wired in app.ts before routes
- Swagger/OpenAPI: swaggerJsdoc reads route JSDoc comments, mounted at /api-docs (annotated core routes; rest covered via Postman collection)
- S3 product image upload (bonus): multer memoryStorage → S3Client PutObjectCommand, PATCH /products/:uuid/image

### Phase B6 — Later / Bonus (explicitly deferred) ✅
- Docker added (docker-compose: app + mongo + redis)
---

## FRONTEND PHASES (starts after backend core is functional)

### Phase F0 — Project Setup ✅
- Next.js (App Router) + TS + Tailwind + Redux Toolkit initialized
- axios instance with token interceptor + 401 auto-refresh (queued for concurrent requests)

### Phase F1 — Auth UI ✅
- Login/Register pages, ProtectedRoute wrapper, auth slice + thunks + service
- Tokens in localStorage (accessToken, refreshToken, user)
- UI theme: indigo→violet gradient, card-based layout

### Phase F2 — Dashboard ✅
- 5 stat cards wired to /api/dashboard/stats

### Phase F3 — Product & Category Management ✅
- Products: list (search debounce 400ms, category/status filter, sort, pagination), detail page, add/edit modal, delete confirm
- Categories: list, add/edit modal, delete confirm (with unassign warning)

### Phase F4 — Stock Management UI ✅
- StockAdjustModal: increase/reduce with frontend + backend double guard against negative stock, toasts for success/error

### Phase F5 — Polish ✅
- Loading states, empty states, responsive layout, form validation, dark mode (bonus)

---

## Current position
**We are here:** Frontend F0-F4 done (core CRUD + dashboard + auth complete end-to-end). Next: Phase F5 (Polish — empty states already done, remaining: dark mode bonus, final responsive check).

## Notes / assumptions (fill in as we go)
- Node 20 LTS targeted via `package.json` engines field, even though the dev container itself runs Node 22 — no functional impact, just a deployment/consistency lock.
- Path aliases (`@config/*` etc.) were considered but dropped in favor of plain relative imports, to avoid needing `tsconfig-paths`/`module-alias` at runtime — one less moving part given the 2-day deadline.
- `logs/` folder is gitignored; only `.gitkeep` is committed.


