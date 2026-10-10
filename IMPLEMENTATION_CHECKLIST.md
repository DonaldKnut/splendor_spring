# Implementation Checklist

## Audit findings (Phase 1)

- Repository was empty (greenfield). No prior frontend/backend/database existed.
- Chosen stack: npm workspaces monorepo, Next.js 15 App Router, TypeScript, Tailwind CSS v4, Prisma + SQLite (local), NextAuth credentials auth, Paystack (NGO), Vitest.
- Two independently deployable apps: `apps/school` (port 3000) and `apps/ngo` (port 3001), plus `packages/shared`.

## Status

### School platform

- [x] Public website (home, about, contact, announcements, CMS pages)
- [x] Auth (Head Admin, Sub-Admin, Student, Parent)
- [x] RBAC + Sub-Admin permissions
- [x] Password change / reset / temp credentials
- [x] Student & parent management (+ CSV import)
- [x] Classes, subjects, sessions, terms, enrollments
- [x] Result entry, validation, publish, correction audit (+ corrections UI)
- [x] Student/parent result portals + printable sheet
- [x] Admin dashboard modules
- [x] CMS + settings + WhatsApp (configurable)
- [x] Contact form persistence + honeypot + rate limit
- [x] Audit logs
- [x] Production build passes
- [x] Dev smoke routes OK (public 200, admin redirects to login)
- [ ] Dedicated Teacher role (currently Sub-Admin with result permissions)
- [ ] Email delivery for password-reset tokens (ESP integration)

### NGO platform

- [x] Public website (home, about, programmes, contact, donate)
- [x] Admin auth + RBAC (+ permission-aware nav)
- [x] CMS / programmes / campaigns
- [x] Paystack init + verify + webhook signature + idempotency
- [x] Donation ledger + admin filters + CSV export
- [x] WhatsApp (configurable)
- [x] Audit logs
- [x] Production build passes
- [x] Dev smoke routes OK
- [ ] Recurring donations (one-time only for now)

### Shared / ops

- [x] `.env.example`
- [x] README documentation
- [x] Unit tests (grades, whatsapp, paystack helpers) — all passing
- [ ] Live Paystack credentials (external)
- [ ] Confirmed WhatsApp numbers (external)
- [ ] Custom domains / DNS (external)
- [ ] Production PostgreSQL (recommended; SQLite used locally)
- [ ] Client-approved NGO brand/mission content

## Blocked on external dependencies

1. Client-confirmed NGO name/mission/registration details for content.
2. Paystack live/test keys and webhook URL.
3. WhatsApp business numbers for both platforms.
4. Custom domain DNS for school and NGO.
