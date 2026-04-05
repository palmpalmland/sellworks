create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null,
  selling_points text not null,
  platform text not null,
  style text,
  product_url text,
  status text not null default 'processing',
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_created_at_idx on public.projects(created_at desc);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_type text not null,
  file_name text,
  mime_type text,
  file_size bigint,
  source_url text,
  storage_path text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists project_assets_project_id_idx on public.project_assets(project_id);

create table if not exists public.project_outputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  output_type text not null,
  title text,
  content text,
  meta jsonb,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create index if not exists project_outputs_project_id_idx on public.project_outputs(project_id);

alter table public.projects enable row level security;
alter table public.project_assets enable row level security;
alter table public.project_outputs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'Users can view own projects'
  ) then
    create policy "Users can view own projects"
      on public.projects for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'Users can insert own projects'
  ) then
    create policy "Users can insert own projects"
      on public.projects for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_assets' and policyname = 'Users can view own project assets'
  ) then
    create policy "Users can view own project assets"
      on public.project_assets for select
      using (
        exists (
          select 1 from public.projects
          where projects.id = project_assets.project_id
          and projects.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_assets' and policyname = 'Users can insert own project assets'
  ) then
    create policy "Users can insert own project assets"
      on public.project_assets for insert
      with check (
        exists (
          select 1 from public.projects
          where projects.id = project_assets.project_id
          and projects.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_outputs' and policyname = 'Users can view own project outputs'
  ) then
    create policy "Users can view own project outputs"
      on public.project_outputs for select
      using (
        exists (
          select 1 from public.projects
          where projects.id = project_outputs.project_id
          and projects.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_outputs' and policyname = 'Users can insert own project outputs'
  ) then
    create policy "Users can insert own project outputs"
      on public.project_outputs for insert
      with check (
        exists (
          select 1 from public.projects
          where projects.id = project_outputs.project_id
          and projects.user_id = auth.uid()
        )
      );
  end if;
end $$;
