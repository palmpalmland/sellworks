# AI Content Factory

AI Content Factory is a `Next.js 16` app for generating e-commerce content with:

- `Supabase` for auth and database
- `Stripe` for subscriptions
- server-side API routes for generation, usage tracking, checkout, and webhooks

## Local development

1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. Install dependencies
4. Start the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment variables

Use `.env.example` as the source of truth for required env vars.

Important:

- only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- keep `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` server-only

## Deployment

This app should be deployed to a Node.js-capable platform because it includes dynamic API routes:

- `/api/checkout`
- `/api/generate-text`
- `/api/init-usage`
- `/api/usage`
- `/api/webhook`

Recommended first deployment target: `Vercel`

Detailed launch steps are in [DEPLOY.md](./DEPLOY.md).
