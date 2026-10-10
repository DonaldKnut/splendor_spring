# Splendor Project — School Platform + NGO Platform

Production-oriented dual-platform system for:

1. **Splendor Spring School** (`apps/school`) — Makoko, Lagos
2. **NGO Platform** (`apps/ngo`)

Client: Mrs. Opeyemi Elebiju Josephine (Splendor Spring School Ltd)  
Developer: Ibrahim Openiyi (Dealo)

## Architecture overview

```
splendor-project/
  apps/school/     # Independently deployable school web app (port 3000)
  apps/ngo/        # Independently deployable NGO web app (port 3001)
  packages/shared/ # Shared validation, sanitization, WhatsApp helpers
```

- Each app has its **own database**, auth secret, admin area, and domain configuration.
- School users cannot access NGO administration (and vice versa) because the apps are separate deployments with isolated auth/databases.
- Shared UI utilities live in `packages/shared` only; domain data is not shared.

### Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + GSAP motion (`@splendor/ui`) |
| ORM / DB | Prisma + **PostgreSQL** (separate DBs per platform) |
| Auth | NextAuth (credentials) + JWT sessions |
| Payments (NGO) | `@splendor/payments` — Paystack **and** Flutterwave adapters |
| Shared packages | `@splendor/shared`, `@splendor/ui`, `@splendor/payments` |
| Tests | Vitest |

### PostgreSQL setup (Windows)

Full steps: [`docs/SETUP.md`](docs/SETUP.md)

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\Splendor_Project
.\scripts\setup-postgres.ps1 -PostgresPassword "YOUR_POSTGRES_PASSWORD"
```

If PowerShell blocks scripts:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-postgres.ps1 -PostgresPassword "YOUR_POSTGRES_PASSWORD"
```

This creates `splendor_school` + `splendor_ngo`, updates both app `.env` files, runs `prisma db push`, and seeds Head Admins.

Deployment / custom domains: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)  
E2E checklist: [`docs/E2E_CHECKLIST.md`](docs/E2E_CHECKLIST.md)

### Payment keys (NGO)

Set in `apps/ngo/.env` — no code changes needed:

- `PAYMENT_PROVIDER` = `paystack` or `flutterwave` (default)
- `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` / `PAYSTACK_WEBHOOK_SECRET`
- `FLUTTERWAVE_SECRET_KEY` / `FLUTTERWAVE_PUBLIC_KEY` / `FLUTTERWAVE_WEBHOOK_SECRET`

Webhooks:

- `POST /api/webhooks/paystack` (header `x-paystack-signature`)
- `POST /api/webhooks/flutterwave` (header `verif-hash`)

## Local development

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Environment files

Copy values from root `.env.example` into:

- `apps/school/.env`
- `apps/ngo/.env`

Starter local env files are already present for development. **Change all secrets before production.**

### Database setup (school)

```bash
cd apps/school
npx prisma db push
npm run db:seed
```

### Database setup (NGO)

```bash
cd apps/ngo
npx prisma generate
npx prisma db push
npm run db:seed
```

### Run apps

From repo root:

```bash
npm run dev:school
npm run dev:ngo
```

- School: http://localhost:3000
- NGO: http://localhost:3001

## Head Admin bootstrap

### School

Seed creates Head Admin from:

- `SCHOOL_HEAD_ADMIN_EMAIL`
- `SCHOOL_HEAD_ADMIN_PASSWORD`
- `SCHOOL_HEAD_ADMIN_NAME`

Default local values are in `apps/school/.env`. First login requires password change (`mustChangePassword`).

### NGO

Same pattern with `NGO_HEAD_ADMIN_*` in `apps/ngo/.env`.

## School workflows

### Create student / teacher / parent accounts

1. Sign in as Head Admin (or Sub-Admin with `manage_students` / `manage_parents`).
2. Admin home → **Issue accounts**, or go to Students / Parents / Staff & administrators.
3. Create the account. The system generates a **temporary password**.
4. If Resend/SMTP is configured, a welcome email is sent with the login URL, email, and temp password. The same temp password is also shown once in the admin UI (fallback if email is not configured).
5. User signs in → **must change password** on first login → continues with email OTP as usual.
6. Use **Resend credentials** on a student or staff card to rotate the temp password and email it again (never re-sends an old password).
7. Link parents to students during/after creation. Only Head Admin can create Teachers / Sub-Admins.

### Result entry and publication

1. Configure Classes, Subjects, Academic Session/Terms.
2. Enroll students (auto-enrolled into current session when class assigned on create, if a current session exists).
3. Admin → Results: select session/term/class/subject, enter CA/Exam, save drafts.
4. Admin → Publish Results: publish draft set.
5. Students/parents can view only **published/corrected** results for authorized records.
6. Published results cannot be silently edited; use correction workflow (audited).

### Assessment configuration

Settings keys `ca_max` and `exam_max` plus `GradingScale` rows control totals/grades.

## NGO workflows

### Content

Admin → Content / Programmes / Campaigns / Settings. Publish only verified organisational information. Do not invent impact claims.

### Donations (Paystack)

1. Set `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, and optionally `PAYSTACK_WEBHOOK_SECRET`.
2. Configure webhook URL: `https://<ngo-domain>/api/webhooks/paystack`.
3. Public Donate page initializes a pending donation + Paystack checkout.
4. Return URL (`/donate/verify`) and webhook both re-verify with Paystack server-side.
5. Only verified `SUCCESS` donations count toward totals.
6. Admins cannot mark unverified payments as successful.

## WhatsApp

Configured via settings:

- School: `whatsapp_number`, `whatsapp_default_message`
- NGO: same keys

Use E.164 digits without `+` (example: `2348012345678`). Floating button appears only when a number is set.

## Environment variable reference

See `.env.example` for the full list. Critical variables:

| Variable | App | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | both | Prisma DB connection |
| `NEXTAUTH_SECRET` | both | Auth encryption/signing |
| `NEXTAUTH_URL` / `*_APP_URL` | both | Absolute app URL |
| `SCHOOL_HEAD_ADMIN_*` | school | Bootstrap admin |
| `NGO_HEAD_ADMIN_*` | ngo | Bootstrap admin |
| `PAYSTACK_*` | ngo | Payment provider |
| `*_WHATSAPP_*` | both | Click-to-chat defaults |

## Custom domains and deployment

Deploy each app separately (Vercel, VPS, etc.):

1. Point school domain DNS to school deployment.
2. Point NGO domain DNS to NGO deployment.
3. Set `NEXTAUTH_URL` / `SCHOOL_APP_URL` / `NGO_APP_URL` to the public HTTPS origins.
4. Use PostgreSQL in production (`DATABASE_URL=postgresql://...`) and run migrations.
5. Configure Paystack callback + webhook URLs for the NGO domain.
6. Rotate all secrets; never reuse local defaults.

Staging can use preview URLs with separate databases and Paystack test keys.

### Production PostgreSQL note

Local development uses SQLite for zero-Docker setup. For production:

1. Create two databases (school + ngo).
2. Update each app `prisma/schema.prisma` datasource provider to `postgresql` (or keep dual schema files).
3. Set production `DATABASE_URL`.
4. Run `prisma migrate deploy` (recommended) or `db push` for first bring-up.

## Test commands

```bash
npm run test:school
npm run test:ngo
```

## Build

```bash
npm run build:school
npm run build:ngo
```

## Security notes

- Passwords hashed with bcrypt (12 rounds).
- Server-side RBAC on actions/pages.
- Rich text sanitized with `sanitize-html`.
- Contact honeypot + basic rate limiting (school).
- Paystack webhook HMAC verification + idempotent event keys.
- Unpublished school results are not exposed to student/parent portals.
- Parent access restricted to linked children only.

## Known limitations / external dependencies

- Live/custom domain DNS must be configured by the client/hosting provider.
- Paystack account credentials required for real payments.
- Confirmed WhatsApp numbers required before enabling chat buttons.
- NGO public copy must be supplied/approved by the client (no invented mission/impact stats).
- Email delivery for password reset tokens is not wired to an ESP yet; tokens are issued for admin-assisted recovery / local display. Integrate an email provider when SMTP/API credentials are available.
- Recurring donations not enabled (one-time Paystack charges only).

## Project agreement context

This repository implements the school + NGO platforms covered by the existing project agreement between Mrs. Elebu Opegemi Josephine and Ibrahim Openiyi (Dealo).
