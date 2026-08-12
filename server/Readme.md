# Backend — Inventory Management System

## Request flow (strict layering)
```
routes → middlewares → controller → services → repository → models
```
- **routes**: define endpoints, attach middlewares, call controller method. No logic.
- **middlewares**: auth (JWT verify + Redis blacklist check), validation (Joi/express-validator), error handler, rate limiting.
- **controller**: parses request, calls service, shapes HTTP response. No business logic, no direct DB calls.
- **services**: business logic (e.g. compute stock status, orchestrate multi-step operations). Calls repository, never the model directly.
- **repository**: only place that talks to Mongoose models — search/create/update/delete functions per entity.
- **models**: Mongoose schemas.

## Folder structure (target)
```
backend/
├── src/
│   ├── config/            # env config, wrapped in Object.freeze
│   ├── routes/
│   ├── middlewares/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── types/express/       # Express Request type augmentation (req.user, req.token)
│   ├── validations/        # Joi schemas
│   ├── utils/               # logger (winston), uuid helper, etc.
│   └── app.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Key architectural decisions
- **IDs**: Every schema has an auto-generated `uuid` field (public ID) in addition to Mongo `_id`. Routes/params always use `uuid`; internal joins/lookups may use `_id`. Cross-schema references also store the `uuid` (e.g. `Product.userId` stores the owning user's `uuid`, not their `_id`).
- **Auth**: JWT signed with `{ _id, uuid, email, role }`, sent via `Authorization: Bearer <token>` header only (no cookies/cookie-parser). Access token (15m) + refresh token (7d, rotated in Redis on each use). Redis also blacklists access tokens on logout for their exact remaining TTL.
- **Authorization**: every Product/Category repository function requires `userId` as a parameter — ownership is enforced at the data-access layer, not just in controllers, so it can't be accidentally bypassed.
- **Validation**: double layer — Joi for schema/body shape, express-validator for route/param-level checks. Input is sanitized (strip unsafe input) and normalized (e.g. lowercase/trim email) before validation.
- **Config**: all env values read once into a config object wrapped in `Object.freeze`; no `process.env.X` scattered through the codebase.
- **Logging**: Winston, structured logs, separate error/combined log transports.
- **DB**: indexes on SKU (unique), category, status; aggregation pipelines for dashboard stats (totals, low/out-of-stock counts) instead of pulling all documents and computing in JS.
- **Stock status**: derived server-side from quantity — never trusted as client input.
- **Deferred**: Docker and Kafka are intentionally not part of the initial build; added once core CRUD + auth is complete.

## Setup
```bash
cd backend
cp .env.example .env      # fill in real values (Mongo URI, JWT secrets, etc.)
npm install
npm run dev                # starts on PORT from .env, default 5000
```
Requires a running MongoDB instance and Redis instance reachable at the URIs in `.env`.

- `npm run dev` — nodemon + ts-node, hot reload
- `npm run build` — compiles to `dist/`
- `npm start` — runs compiled build
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` — Prettier

`GET /health` returns `{ status: "ok" }` once the server is up — use this to sanity check before wiring the frontend.

## API docs
Swagger UI is live at `/api-docs` once the server is running. Core routes (auth,
product/category CRUD) are annotated with OpenAPI JSDoc comments; a Postman
collection covers the remaining routes as an alternative reference.

## Env vars
See `.env.example`. Required: `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`. Everything else has a sane default for local dev.

## Assumptions & Trade-offs

- **SKU uniqueness**: scoped per-user (`{userId, sku}` compound index), not global —
  two different users can use the same SKU. Chosen because in real multi-tenant
  inventory tools, SKUs are business-specific, not globally reserved.
- **Category deletion**: does not cascade-delete products. Products are unassigned
  (`categoryId: null`) instead, since `categoryId` is optional. Avoids accidental
  data loss from a routine category cleanup.
- **Low stock threshold**: configurable per-product (`lowStockThreshold`, default 10)
  rather than one fixed system-wide number — a single item and a bulk commodity
  shouldn't share the same "low stock" definition.
- **Auth token transport**: `Authorization: Bearer <token>` header only — no cookies,
  no `cookie-parser`. Refresh token is returned in the response body and sent back
  the same way (header, on the refresh call), matching the frontend's localStorage
  strategy.
- **Refresh token strategy**: single active refresh token per user, stored in Redis
  with a 7-day TTL and rotated on every refresh/login. Access token blacklist on
  logout uses the token's *exact remaining TTL* rather than a fixed value.
- **Docker**: implemented — multi-stage `Dockerfile` (build → slim production
  image) for both backend and frontend, orchestrated via root `docker-compose.yml`
  (mongo + redis + backend + frontend on a shared network).
- **Kafka**: intentionally not implemented. This system has no async/event-driven
  requirement — every operation (CRUD, stock adjust, auth) is a synchronous
  request/response with no downstream consumers or cross-service notifications.
  Introducing a message broker here would add operational complexity with no
  corresponding use case, so it was left out rather than added for its own sake.