-- Public course image bucket with staff-only write access.
-- Run once in the Supabase SQL Editor after schema.sql.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('course-images', 'course-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view course images" on storage.objects;
drop policy if exists "Staff can upload course images" on storage.objects;
drop policy if exists "Staff can update course images" on storage.objects;
drop policy if exists "Staff can delete course images" on storage.objects;

create policy "Public can view course images"
on storage.objects for select
using (bucket_id = 'course-images');

create policy "Staff can upload course images"
on storage.objects for insert to authenticated
with check (bucket_id = 'course-images' and public.is_staff());

create policy "Staff can update course images"
on storage.objects for update to authenticated
using (bucket_id = 'course-images' and public.is_staff())
with check (bucket_id = 'course-images' and public.is_staff());

create policy "Staff can delete course images"
on storage.objects for delete to authenticated
using (bucket_id = 'course-images' and public.is_staff());
