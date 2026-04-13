create table if not exists public.billing_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  billing_scope text not null default 'brand' check (billing_scope in ('brand', 'organization')),
  plan_key text not null default 'free' check (plan_key in ('free', 'pro', 'team')),
  status text not null default 'active',
  credits_total integer not null default 100,
  credits_used integer not null default 0,
  member_limit integer not null default 1,
  brand_limit integer not null default 1,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_account_brands (
  id uuid primary key default gen_random_uuid(),
  billing_account_id uuid not null references public.billing_accounts(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (billing_account_id, brand_id),
  unique (brand_id)
);

alter table public.payments
  add column if not exists billing_account_id uuid references public.billing_accounts(id) on delete set null;

alter table public.payments
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

alter table public.subscriptions
  add column if not exists billing_account_id uuid references public.billing_accounts(id) on delete set null;

alter table public.subscriptions
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

alter table public.subscriptions
  add column if not exists plan_key text;

alter table public.usage_logs
  add column if not exists billing_account_id uuid references public.billing_accounts(id) on delete set null;

alter table public.usage_logs
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

insert into public.billing_accounts (
  owner_user_id,
  name,
  billing_scope,
  plan_key,
  status,
  credits_total,
  credits_used,
  member_limit,
  brand_limit
)
select
  b.owner_user_id,
  concat(b.name, ' Billing ', substr(replace(b.id::text, '-', ''), 1, 8)),
  'brand',
  'free',
  'active',
  100,
  0,
  1,
  1
from public.brands b
where not exists (
  select 1
  from public.billing_account_brands bab
  where bab.brand_id = b.id
);

insert into public.billing_account_brands (billing_account_id, brand_id)
select
  ba.id,
  b.id
from public.brands b
join public.billing_accounts ba
  on ba.owner_user_id = b.owner_user_id
 and ba.name = concat(b.name, ' Billing ', substr(replace(b.id::text, '-', ''), 1, 8))
where not exists (
  select 1
  from public.billing_account_brands bab
  where bab.brand_id = b.id
);
