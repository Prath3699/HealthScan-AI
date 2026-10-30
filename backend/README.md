# HealthScan AI — Backend

Express + Mongoose REST API for the HealthScan AI medical management system
(doctors, patients, diseases, reports, appointments, and AI prediction routes).

## Requirements

* Node.js 20+
* MongoDB 7 (local, Docker, or Atlas)

## Setup

```bash
npm ci
cp .env.example .env   # then edit MONGO_URL / JWT_SECRET
npm run dev            # nodemon; with the example env: http://localhost:5000
npm start              # production entry (server.js)
```

The port comes from `PORT` in `.env` (the repo standard is `5000`, matching
docker-compose/render/frontend defaults; server.js falls back to `3003` if
unset). Key environment variables (see `.env.example`): `PORT`, `MONGO_URL`,
`JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CLIENT_URL`,
`CORS_ORIGIN`, and optional `SMTP_*` vars for appointment reminder emails.

## Scripts

| Script          | Description                                        |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Start with nodemon                                  |
| `npm start`     | Start the server                                    |
| `npm run lint`  | ESLint (eslint@8 legacy config, `.eslintrc.yml`)    |
| `npm test`      | Jest suite (runs on mongodb-memory-server)          |

## Layout

```
server.js          App bootstrap: security middleware, routes, scheduler
config/            DB connection (mongoose)
routes/            Express routers per resource
controllers/       Business logic per resource
model/             Mongoose schemas (passwords use select:false)
middleware/        Auth / role guard / error handler
utils/             JWT token service, email service, logger
tests/             Integration tests (supertest + in-memory Mongo)
```

A lightweight health endpoint is served at `GET /healthz`.
