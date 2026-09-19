-- Adult class dates, class name, tuition + materials.
-- Run once in the Supabase SQL Editor after site-redesign.sql.

alter table public.courses
  add column if not exists class_name text,
  add column if not exists session_dates date[] not null default '{}',
  add column if not exists tuition_mop numeric(10,2),
  add column if not exists hold_edu boolean not null default false;

insert into public.courses
  (slug, name, audience, category, class_name, price_mop, tuition_mop, hold_edu,
   class_start_time, class_end_time, session_dates, course_start_date, course_end_date, weekdays,
   description, teacher, published, sort_order, capacity)
values
  (
    'adult-watercolor-portrait-f1',
    '水彩時尚人像插畫課程',
    'adult',
    '水彩',
    'F1班',
    200,
    1450,
    true,
    '19:00',
    '22:00',
    array['2026-11-09','2026-11-16','2026-11-23','2026-11-30']::date[],
    '2026-11-09',
    '2026-11-30',
    array[1]::smallint[],
    '水彩時尚人像插畫。學費 MOP 1,450（可用持教），材料費 MOP 200（需自費）。',
    '老師待定',
    true,
    200,
    8
  )
on conflict (slug) do update set
  name = excluded.name,
  audience = excluded.audience,
  category = excluded.category,
  class_name = excluded.class_name,
  price_mop = excluded.price_mop,
  tuition_mop = excluded.tuition_mop,
  hold_edu = excluded.hold_edu,
  class_start_time = excluded.class_start_time,
  class_end_time = excluded.class_end_time,
  session_dates = excluded.session_dates,
  course_start_date = excluded.course_start_date,
  course_end_date = excluded.course_end_date,
  weekdays = excluded.weekdays,
  description = excluded.description,
  published = true;
