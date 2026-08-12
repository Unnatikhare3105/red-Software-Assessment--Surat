# Inventory Management System — RED Software Assignment

Full-stack CRUD Inventory Management System built for the RED Software Full Stack Developer technical assessment.

> Progress tracking lives in [`phase.md`](./phase.md) — always check that file first for current status.

## Repo structure
```
red-inventory-system/
├── phase.md               # build progress tracker (source of truth)
├── README.md               # this file
├── DATABASE_SCHEMA.md       # ER diagram + indexing/design notes
├── backend/
│   └── README.md            # backend architecture + setup
└── frontend/
    └── README.md             # frontend architecture + setup
```

## Tech stack summary

| Layer | Choice |
|---|---|
| Frontend | Next.js + TypeScript + Redux Toolkit |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB (Mongoose) |
| Cache / token blacklist | Redis |
| Auth | JWT, header-based (`Authorization: Bearer`, no cookies), Redis-backed refresh rotation |
| Validation | Joi + express-validator |
| Logging | Winston |
| Docs | Swagger / OpenAPI |
| File storage | AWS S3 (product images — bonus) |
| Containerization | Docker (later phase) |
| Messaging | Kafka (later phase, bonus) |

## Build order
1. **Backend** — full CRUD + auth + validation + docs, complete and tested first.
2. **Frontend** — Next.js UI wired to the backend once backend is stable.

## ID strategy
Every document has both:
- MongoDB `_id` (ObjectId) — internal use only, never exposed in routes.
- `uuid` (public ID) — used in all route params and cross-schema references (e.g. `userId` on a Product references a user's `uuid`).

## Quick start
```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend (new terminal)
cd frontend && cp .env.example .env.local && npm install && npm run dev
```
Requires MongoDB and Redis reachable at the URIs set in `backend/.env`.

- Backend: `http://localhost:5000` (health check: `/health`, API docs: `/api-docs`)
- Frontend: `http://localhost:3000`

See `backend/README.md` and `frontend/README.md` for full architecture and env var details.

## Status
Backend (B0–B5) and Frontend (F0–F5) complete, including Docker.

## Docker
```bash
docker compose up --build
```
Runs MongoDB, Redis, backend, and frontend as containers. Requires a root `.env`
with `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (see `.env.example` if present).
Frontend: `http://localhost:3000`, Backend: `http://localhost:5000`.

## Kafka
Not implemented — evaluated and intentionally skipped. This is a single-tenant
CRUD application with no cross-service or asynchronous event flow (no order
pipelines, notifications, or downstream consumers) that would justify an event
broker. Adding Kafka here would be complexity without a corresponding use case.




