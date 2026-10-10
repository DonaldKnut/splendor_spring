# Deployment & custom domains

## Architecture

Deploy **two separate apps**:

| App | Package | Suggested domains |
|-----|---------|-------------------|
| School | `apps/school` | `www.splendorschool.ng` (example) |
| NGO | `apps/ngo` | `www.your-ngo.ng` (example) |

Each app needs its **own PostgreSQL database**, auth secret, and public URL.

## Production database

Use managed Postgres (Neon, Supabase, Railway, AWS RDS, etc.):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/splendor_school?schema=public&sslmode=require"
```

Then on the deployment machine / CI:

```bash
npx prisma migrate deploy
# or first bring-up:
npx prisma db push
npm run db:seed
```

Never use SQLite in production.

## Environment checklist (each app)

### School

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (long random)
- `NEXTAUTH_URL` = `https://school-domain`
- `SCHOOL_APP_URL` = same public origin
- Optional: `RESEND_API_KEY` / SMTP_* for password reset email
- Optional: WhatsApp number in admin Settings after launch

### NGO

- `DATABASE_URL` (separate DB)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` / `NGO_APP_URL` = `https://ngo-domain`
- `PAYMENT_PROVIDER`
- Paystack and/or Flutterwave keys + webhook secrets

## Custom domains

1. Deploy each app (Vercel / VPS / Docker).
2. Add custom domain in the host dashboard.
3. Point DNS:
   - `A` / `CNAME` for school domain → school deployment
   - `A` / `CNAME` for NGO domain → NGO deployment
4. Update `NEXTAUTH_URL` and `*_APP_URL` to the HTTPS domains.
5. Update payment provider callback + webhook URLs to the NGO HTTPS domain.
6. Confirm TLS certificates are valid.

Do not claim a custom domain is live until DNS + HTTPS verify successfully.

## Staging

Use preview URLs with:

- separate staging databases
- Paystack/Flutterwave **test** keys
- `NEXTAUTH_URL` set to the preview origin

## Build commands

```bash
npm run build:school
npm run build:ngo
```
