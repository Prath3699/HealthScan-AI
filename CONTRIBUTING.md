# Contributing to HealthScan AI

Thanks for your interest in improving HealthScan AI! This guide covers the
basics so your first contribution goes smoothly.

## Before you start

1. Make sure the project runs locally (see the root [README](README.md) —
   Quick Start section).
2. Node.js 20+ and MongoDB 7 (or Docker) are required.

## Development workflow

* Work on a feature branch off `main` (e.g. `feat/appointment-reminders`).
* Keep changes focused; one logical change per PR.
* Both packages have their own tooling:

  ```bash
  # Backend
  cd backend
  npm run lint     # ESLint (must pass before opening a PR)
  npm test         # Jest + mongodb-memory-server

  # Frontend
  cd frontend
  npm run lint     # ESLint flat config
  npm test         # Vitest + Testing Library
  npm run build    # production bundle must build cleanly
  ```

* CI runs these same checks on every push/PR — please make them pass locally
  first.

## Code style

* Formatting conventions live in `.editorconfig` (UTF-8, LF, 2-space indent,
  final newline). Most editors respect it natively or via a plugin.
* Backend is CommonJS; frontend uses ESM/JSX.
* Prefer small modules; put business logic in `controllers/`, data shapes in
  `model/`, and cross-cutting concerns in `middleware/` or `utils/`.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add appointment reschedule endpoint
fix: prevent duplicate report uploads for same patient
chore(ci): pin mongo service image to 7.0
docs: update .env.example with CORS_ORIGIN
```

## Reporting issues

Include: steps to reproduce, expected vs. actual behaviour, relevant logs
(set `LOG_LEVEL=debug`), and your environment (OS, Node version). Never post
real patient data or secrets in issues.

## Security notes

* Never commit secrets or `.env` files (gitignored). Use `.env.example` to
  document new variables.
* Passwords must stay `select: false` in Mongoose schemas; new endpoints
  returning user documents must not leak hashes or tokens.

## Pull requests

Fill in the PR template, link related issues, and include tests for new
behaviour. Two maintainer review is not required — one approving review and
green CI is enough.
