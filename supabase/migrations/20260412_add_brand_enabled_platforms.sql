alter table public.brands
  add column if not exists enabled_platforms text[];
