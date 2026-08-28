-- Run this once in Supabase SQL Editor for an existing Ink House project.
alter table public.registrations
  add column if not exists course_ids uuid[] not null default '{}',
  add column if not exists wechat text;

-- Preserve existing single-course registrations in the new multi-course field.
update public.registrations
set course_ids = array[course_id]
where cardinality(course_ids) = 0 and course_id is not null;
