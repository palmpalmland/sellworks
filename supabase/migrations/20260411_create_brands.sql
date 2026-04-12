create extension if not exists pgcrypto;

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  website text,
  logo_url text,
  voice_tone text,
  target_audience text,
  primary_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brands_owner_user_id_idx on public.brands(owner_user_id);

create table if not exists public.brand_members (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  unique (brand_id, user_id)
);

create index if not exists brand_members_user_id_idx on public.brand_members(user_id);
create index if not exists brand_members_brand_id_idx on public.brand_members(brand_id);

create table if not exists public.brand_invites (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  email text not null,
  role text not null default 'editor',
  token uuid not null default gen_random_uuid(),
  status text not null default 'pending',
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists brand_invites_brand_id_idx on public.brand_invites(brand_id);
create index if not exists brand_invites_email_idx on public.brand_invites(email);

alter table public.projects
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

do $$
declare
  user_row record;
  default_brand_id uuid;
  default_brand_name text;
  default_slug text;
begin
  for user_row in
    select distinct users.id, users.raw_user_meta_data
    from auth.users as users
  loop
    default_brand_name := coalesce(
      nullif(trim(user_row.raw_user_meta_data ->> 'display_name'), ''),
      'My Brand'
    );
    default_slug := lower(
      regexp_replace(default_brand_name, '[^a-zA-Z0-9]+', '-', 'g')
    );
    default_slug := trim(both '-' from default_slug);
    default_slug := case
      when default_slug = '' then 'brand'
      else default_slug
    end;
    default_slug := default_slug || '-' || left(replace(user_row.id::text, '-', ''), 8);

    insert into public.brands (owner_user_id, name, slug, description, primary_color)
    values (
      user_row.id,
      default_brand_name,
      default_slug,
      'Primary workspace for generated content, assets, and campaign outputs.',
      '#6d7cff'
    )
    on conflict (slug) do nothing
    returning id into default_brand_id;

    if default_brand_id is null then
      select id into default_brand_id
      from public.brands
      where owner_user_id = user_row.id
      order by created_at asc
      limit 1;
    end if;

    if default_brand_id is not null then
      insert into public.brand_members (brand_id, user_id, role)
      values (default_brand_id, user_row.id, 'owner')
      on conflict (brand_id, user_id) do nothing;

      update public.projects
      set brand_id = default_brand_id
      where user_id = user_row.id and brand_id is null;
    end if;
  end loop;
end $$;

alter table public.brands enable row level security;
alter table public.brand_members enable row level security;
alter table public.brand_invites enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'brands' and policyname = 'Users can view member brands'
  ) then
    create policy "Users can view member brands"
      on public.brands for select
      using (
        exists (
          select 1 from public.brand_members
          where brand_members.brand_id = brands.id
          and brand_members.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'brands' and policyname = 'Users can insert owned brands'
  ) then
    create policy "Users can insert owned brands"
      on public.brands for insert
      with check (owner_user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'brands' and policyname = 'Owners can update brands'
  ) then
    create policy "Owners can update brands"
      on public.brands for update
      using (
        exists (
          select 1 from public.brand_members
          where brand_members.brand_id = brands.id
          and brand_members.user_id = auth.uid()
          and brand_members.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1 from public.brand_members
          where brand_members.brand_id = brands.id
          and brand_members.user_id = auth.uid()
          and brand_members.role in ('owner', 'admin')
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'brand_members' and policyname = 'Users can view members of joined brands'
  ) then
    create policy "Users can view members of joined brands"
      on public.brand_members for select
      using (
        exists (
          select 1 from public.brand_members as memberships
          where memberships.brand_id = brand_members.brand_id
          and memberships.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'brand_invites' and policyname = 'Admins can manage invites'
  ) then
    create policy "Admins can manage invites"
      on public.brand_invites for all
      using (
        exists (
          select 1 from public.brand_members
          where brand_members.brand_id = brand_invites.brand_id
          and brand_members.user_id = auth.uid()
          and brand_members.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1 from public.brand_members
          where brand_members.brand_id = brand_invites.brand_id
          and brand_members.user_id = auth.uid()
          and brand_members.role in ('owner', 'admin')
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'Users can view brand projects'
  ) then
    create policy "Users can view brand projects"
      on public.projects for select
      using (
        exists (
          select 1 from public.brand_members
          where brand_members.brand_id = projects.brand_id
          and brand_members.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'Users can insert brand projects'
  ) then
    create policy "Users can insert brand projects"
      on public.projects for insert
      with check (
        auth.uid() = user_id
        and exists (
          select 1 from public.brand_members
          where brand_members.brand_id = projects.brand_id
          and brand_members.user_id = auth.uid()
        )
      );
  end if;
end $$;
