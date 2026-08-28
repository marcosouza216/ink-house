-- Run once in Supabase SQL Editor for an existing project.
alter table public.courses
  alter column category type text using category::text,
  add column if not exists teacher text,
  add column if not exists course_start_date date,
  add column if not exists course_end_date date,
  add column if not exists weekdays smallint[] not null default '{}',
  add column if not exists class_start_time time,
  add column if not exists class_end_time time;

alter table public.courses drop constraint if exists courses_date_range_check;
alter table public.courses add constraint courses_date_range_check
  check (course_end_date is null or course_start_date is null or course_end_date >= course_start_date);

alter table public.courses drop constraint if exists courses_time_range_check;
alter table public.courses add constraint courses_time_range_check
  check (class_end_time is null or class_start_time is null or class_end_time > class_start_time);
