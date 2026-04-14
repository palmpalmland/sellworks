alter table public.projects
  alter column user_id drop not null;

do $$
declare
  existing_constraint text;
begin
  select tc.constraint_name into existing_constraint
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name
   and tc.table_schema = kcu.table_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'projects'
    and tc.constraint_type = 'FOREIGN KEY'
    and kcu.column_name = 'user_id'
  limit 1;

  if existing_constraint is not null then
    execute format('alter table public.projects drop constraint %I', existing_constraint);
  end if;
end $$;

alter table public.projects
  add constraint projects_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete set null;
