# M-Pesa Rent CRM

Lightweight SaaS CRM for small landlords to:
- Track rent collection via M-Pesa (Daraja API)
- Flag defaulters automatically
- Generate eRITS-ready monthly rental tax reports (7.5% MRI)

## Stack
- Next.js (App Router)
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS

## Quick Start
1. Install dependencies:
   - `npm install`
2. Configure env:
   - Copy `.env.example` to `.env.local` and fill values.
3. Prepare database:
   - `npm run db:generate`
   - `npm run db:migrate`
   - `npm run db:seed`
4. Run app:
   - `npm run dev`

## Scaffold Command
This repo includes a scaffold helper for baseline placeholder modules:

- `npm run scaffold`

It creates/ensures route folders, domain libraries, docs, tests, and infra placeholders matching the requested SaaS architecture.
