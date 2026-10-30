# HealthScan AI — Frontend

React 18 + Vite single-page app for the HealthScan AI medical management
system (doctor, patient, and admin dashboards with FullCalendar scheduling).

## Requirements

* Node.js 20+
* The backend API running locally (see `../backend`) or via `docker-compose`

## Setup

```bash
npm ci
npm run dev          # Vite dev server at http://localhost:5173
```

The API base URL comes from `VITE_BACKEND_URL` (`frontend/.env`, see
`.env.example`; baked in as a Docker build arg, set in Vercel env vars).

## Scripts

| Script           | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Vite dev server with HMR                      |
| `npm run build`  | Production bundle in `dist/`                  |
| `npm run preview`| Serve the production bundle locally           |
| `npm run lint`   | ESLint (flat config, `eslint.config.js`)      |
| `npm test`       | Vitest + Testing Library (jsdom)              |
| `npm run test:watch` | Vitest in watch mode                      |

## Layout

```
src/
  main.jsx           App entry
  App.jsx            Router + auth guard
  Pages/             Route-level screens (auth, doctor, patient, admin)
  components/        Reusable UI (MUI + Tailwind + flowbite)
  api/               Shared axios client (auto token refresh on 401)
  redux/             Toolkit store & auth slice
  Constants/         Shared constants
  test/              Vitest setup & utilities
```

## Deployment

* **Vercel**: `vercel.json` rewrites SPA routes to `index.html`.
* **Docker**: multi-stage build served by nginx (`Dockerfile`, `nginx.conf`).
