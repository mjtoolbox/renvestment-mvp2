# Minimal-Risk Plan: Connect Next.js (Prisma) to Vercel PostgreSQL

This document describes a minimal-risk approach to connect the PoC Next.js app to Vercel PostgreSQL using Prisma. It focuses on safe local development, secure secret management, and a smooth deployment path.

## Goals

- Use Vercel PostgreSQL as the production database.
- Keep local development easy and safe (use SQLite locally or Prisma Data Proxy).
- Avoid leaking secrets; provide clear env var instructions.
- Ensure migrations and schema changes are tested before applying to production.

## High-level strategy

1. Local development uses SQLite (fast, zero-config) or Prisma Data Proxy for direct access to Vercel Postgres during development.
2. Use `.env` for local secrets; never commit secrets. Add `.env.example` to show required variables.
3. Use Prisma for schema, migrations, and type-safe DB access.
4. On Vercel, set the `DATABASE_URL` environment variable to the Vercel Postgres connection string.
5. Optionally enable Prisma Data Proxy or run migrations via a CI step to avoid running migrations directly on production.

## Files to add (low-risk)

- `prisma/schema.prisma` (or update if already present).
- `prisma/.env.example` (or project root `.env.example`) listing `DATABASE_URL` and other vars.
- `spec/riskplan.md` (this file).
- `.gitattributes` to normalize line endings for markdown files.

## Recommended local setup (safe)

1. In your local repo, continue using SQLite for day-to-day development:

```cmd
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
```

2. When ready to test against Vercel Postgres, use one of the options below:

Option A — Prisma Data Proxy (recommended for minimal risk):
- Pros: No direct DB credentials stored locally; reduces risk. Works well with Vercel.
- Cons: Extra configuration and potential cost.

Option B — Use Vercel Postgres connection string locally (less recommended):
- Export `DATABASE_URL` from Vercel (never commit):

```cmd
set DATABASE_URL="postgresql://...your-connection-string..."
```

## Applying schema changes and migrations (safe flow)

1. Make schema changes locally using SQLite and test thoroughly:

```cmd
# generate client
npx prisma generate
# create migration (local sqlite)
npx prisma migrate dev --name init
```

2. Review generated SQL in `prisma/migrations`.
3. For production (Vercel Postgres), apply migrations via CI or run `prisma migrate deploy` on a safe environment that has `DATABASE_URL` set:

```cmd
# CI or deployment environment (Vercel build step, or a one-off runner with DATABASE_URL set)
npx prisma migrate deploy
npx prisma generate
```

## Environment variables

- `DATABASE_URL` — Vercel Postgres connection string (set in Vercel dashboard). Use `DATABASE_URL` in Vercel and `DATABASE_URL` locally when intentionally testing against Postgres.
- `NEXTAUTH_SECRET` — used by Auth.js/NextAuth.
- Other (e.g., `VERCEL_ENV`) as required.

Add a `./.env.example` with the names (no values) so developers know what to provide.

## Rollback & backup plan

- Take DB backups or use Vercel Postgres backups before applying migrations to production.
- Test migrations on a staging database mirroring production before applying to prod.

## Additional recommendations

- Consider using Prisma Data Proxy for Vercel to avoid exposing DB credentials locally.
- Protect sensitive pages and APIs with server-side checks; never leak credentials in client bundles.
- Use feature flags or environment-based toggles to gate risky migrations or features.

---

Created automatically to provide a minimal-risk path for connecting to Vercel Postgres. Edit as needed.