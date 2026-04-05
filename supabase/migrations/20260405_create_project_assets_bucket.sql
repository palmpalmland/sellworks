insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can upload own project assets'
  ) then
    create policy "Users can upload own project assets"
      on storage.objects for insert
      with check (
        bucket_id = 'project-assets'
        and auth.uid() is not null
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can view own project assets'
  ) then
    create policy "Users can view own project assets"
      on storage.objects for select
      using (
        bucket_id = 'project-assets'
        and auth.uid() is not null
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;
end $$;
