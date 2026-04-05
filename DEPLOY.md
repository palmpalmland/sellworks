# AI Content Factory Deployment Guide

This project is a `Next.js 16` App Router app with server-side API routes for:

- Supabase auth and data access
- Stripe checkout and webhook handling
- AI content generation

Because of that, it should be deployed to a platform that supports a Node.js runtime. For this project, `Vercel` is the fastest path to get online and test with real users.

## Recommended path

Use `Vercel` for the app runtime, `Supabase` for database/auth, and `Stripe` for billing.

Why this is the best first launch setup:

- Native fit for Next.js
- Easy environment variable management
- Simple production domain + HTTPS
- Straightforward webhook target for Stripe

## 1. Prepare environment variables

Create your production environment variables in Vercel based on `.env.example`.

Required values:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ARK_API_KEY`
- `ARK_BASE_URL`
- `ARK_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PRO_MONTHLY`

Production notes:

- `NEXT_PUBLIC_SITE_URL` must be your real deployed domain, for example `https://app.yourdomain.com`
- `STRIPE_SECRET_KEY` should be the live key only when you are ready for live payments
- `STRIPE_WEBHOOK_SECRET` must come from the production Stripe webhook endpoint, not your local CLI forwarding secret

## 2. Deploy to Vercel

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Framework preset: `Next.js`
4. Build command: `npm run build`
5. Output setting: keep the default Next.js setting
6. Add all production environment variables
7. Deploy

The current project already passes `npm run build` in production mode.

## 3. Configure Supabase for production

In Supabase dashboard, update these settings:

- Auth site URL: your production domain
- Auth redirect URLs: include your production domain and preview domain if needed
- Row Level Security: verify policies for `generations`, `usage_limits`, `usage_logs`, `profiles`, `subscriptions`, and `payments`

Before launch, confirm:

- signup works
- login works
- authenticated users can only access their own data
- service-role usage exists only on the server

## 4. Configure Stripe for production

After Vercel gives you a production URL:

1. In Stripe, create the production product/price if you have not already
2. Set `STRIPE_PRICE_PRO_MONTHLY` to the production price id
3. Add a webhook endpoint:
   `https://your-domain.com/api/webhook`
4. Subscribe at least to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`

Do not reuse your local Stripe CLI webhook secret in production.

## 5. Launch checklist

Before sending traffic:

- `npm run build` passes
- Vercel env vars are complete
- Supabase auth URLs are updated
- Stripe webhook points to production
- One real end-to-end payment flow is tested
- The upgrade flow updates `profiles`, `subscriptions`, `payments`, and `usage_limits`
- The AI generation API works with production env vars

## 6. Strongly recommended cleanup before public launch

There is currently a `/test-db` page in the app. It is useful during development, but it should not be public in a real launch.

Suggested options:

- remove it
- protect it behind admin auth
- disable it outside development

Also review any seeded credits and plan numbers so they match your intended product rules.

## 7. Suggested release sequence

Use this order to reduce risk:

1. Deploy with test Stripe keys
2. Run end-to-end sign up, generate, checkout, webhook, and plan upgrade tests
3. Fix any auth or webhook mismatches
4. Switch to live Stripe keys
5. Bind custom domain
6. Invite a few real users

## 8. If you want the fastest route

The simplest real-world path is:

- Host on `Vercel`
- Use your existing `Supabase`
- Start with `Stripe test mode`
- Buy your own plan once
- Verify webhook writes
- Then switch to `Stripe live mode`
