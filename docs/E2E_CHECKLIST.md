# End-to-end QA checklist

Run after Postgres is set up and both apps are running.

## School flow

1. Open http://localhost:3000 — home slider, megamenu, animations load.
2. Login as Head Admin (`admin@splendorschool.local` / `ChangeMeOnFirstLogin!`).
3. Change password when prompted.
4. **Admin → Sessions** — current session exists (or create one).
5. **Classes / Subjects** — baseline classes exist from seed.
6. **Students** — create a student; confirm temp password shown once and (if Resend configured) welcome email sent; otherwise emailed=false fallback.
7. **Parents** — create a parent and link the student; same credential email behaviour.
8. **Administrators** — create a Teacher; confirm welcome email / on-screen temp password; teacher only sees Students + Results. Use **Resend credentials** and confirm a new temp password is issued.
9. **Results** — enter CA/Exam for class+subject; save drafts.
10. **Publish Results** — publish that set.
11. **Corrections** — apply an audited correction.
12. Logout → login as student → view published result sheet / print.
13. Login as parent → only linked child visible → view results.
14. Try parent URL with another student id → should 404/forbidden.
15. Contact form → appears under Contact Submissions.
16. Forgot password → with email configured, inbox gets link; without, token shown once.

## NGO flow

1. Open http://localhost:3001 — hero slider, megamenu.
2. Login as NGO Head Admin; change password.
3. Publish a programme + campaign from Content.
4. Settings — set org name / WhatsApp when available.
5. Donate page — select Paystack or Flutterwave, one-time or monthly.
6. With **test keys**, complete sandbox checkout.
7. Confirm `/donate/verify` only shows SUCCESS after server verification.
8. Webhook (test) hits `/api/webhooks/paystack` or `/flutterwave` without duplicates.
9. Admin donations list shows SUCCESS; CSV export works.
10. Confirmed totals exclude PENDING/FAILED.

## Scripted smoke (no browser)

From repo root after DB is ready:

```powershell
npm run test
node scripts/e2e-smoke.mjs
```
