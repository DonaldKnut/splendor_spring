# Local setup guide

## How to run the PostgreSQL setup script

PostgreSQL 17 is already installed as a Windows service on this machine. You need the password you set for the `postgres` user during install.

### Option A — PowerShell script (recommended)

1. Open **PowerShell** in the project root:

```powershell
cd C:\Users\Lenovo\OneDrive\Desktop\Splendor_Project
```

2. Run (replace with your real password):

```powershell
.\scripts\setup-postgres.ps1 -PostgresPassword "YOUR_POSTGRES_PASSWORD"
```

If you get an execution policy error:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-postgres.ps1 -PostgresPassword "YOUR_POSTGRES_PASSWORD"
```

What the script does:

- Creates databases `splendor_school` and `splendor_ngo`
- Writes `DATABASE_URL` into `apps/school/.env` and `apps/ngo/.env`
- Runs `prisma db push` + seed for both apps

### Option B — Manual

1. Open psql:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h 127.0.0.1
```

2. Create DBs:

```sql
CREATE DATABASE splendor_school;
CREATE DATABASE splendor_ngo;
```

3. Put URLs in each `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/splendor_school?schema=public"
```

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/splendor_ngo?schema=public"
```

4. Migrate + seed:

```powershell
cd apps\school
npx prisma generate
npx prisma db push
npm run db:seed

cd ..\ngo
npx prisma generate
npx prisma db push
npm run db:seed
```

## Start the apps

From repo root:

```powershell
npm run dev:school
npm run dev:ngo
```

- School: http://localhost:3000  
- NGO: http://localhost:3001  

Default Head Admins (change password on first login):

| App | Email | Password |
|-----|--------|----------|
| School | `admin@splendorschool.local` | `ChangeMeOnFirstLogin!` |
| NGO | `admin@ngo.local` | `ChangeMeOnFirstLogin!` |

## Email (Resend — OTP, reset, account welcome)

Used by **both** School and NGO for:

- Email verification OTP on first login (unverified accounts)
- Password reset links / tokens
- School admin **account welcome** emails (temporary password when creating students, teachers, parents, sub-admins)

### 1. Create a Resend account

1. Sign up at [https://resend.com](https://resend.com)
2. Create an API key
3. For production, verify your domain and use `EMAIL_FROM` on that domain  
   (dev can keep `onboarding@resend.dev` and send only to your Resend account email)

### 2. Set env in each app

`apps/school/.env`:

```env
RESEND_API_KEY="re_xxxxxxxx"
EMAIL_FROM="Splendor School <onboarding@resend.dev>"
SCHOOL_EMAIL_FROM="Splendor School <onboarding@resend.dev>"
```

`apps/ngo/.env`:

```env
RESEND_API_KEY="re_xxxxxxxx"
EMAIL_FROM="Splendor NGO <onboarding@resend.dev>"
NGO_EMAIL_FROM="Splendor NGO <onboarding@resend.dev>"
```

Restart `npm run dev:school` / `npm run dev:ngo` after changing env.

### 3. SMTP alternative (optional)

```env
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
SMTP_SECURE="false"
EMAIL_FROM="noreply@yourdomain.com"
```

### Without email configured

OTP and reset flows still work: a one-time preview code/token is shown in the UI for local/admin-assisted recovery.
Account creation still works: the temporary password is shown once on the admin screen so you can share it offline.

## Payments (NGO)

```env
PAYMENT_PROVIDER="paystack"
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."
PAYSTACK_WEBHOOK_SECRET="..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."
FLUTTERWAVE_WEBHOOK_SECRET="..."
```

Webhook URLs (point dashboard to your public HTTPS origin):

- `/api/webhooks/paystack`
- `/api/webhooks/flutterwave`
