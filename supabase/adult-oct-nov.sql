-- 10～11 月成人持續進修課程，以及兒童班報名費 MOP 100。
-- Run in the Supabase SQL Editor after kids-enlighten.sql.

update public.courses
set price_mop = 100
where audience = 'kids';

update public.courses
set published = false
where slug in ('adult-watercolor', 'adult-sketch', 'adult-acrylic')
   or name = 'Test-918';

insert into public.courses (
  slug, name, audience, category, class_name, teacher,
  price_mop, tuition_mop, hold_edu, duration_minutes,
  class_start_time, class_end_time, session_dates,
  course_start_date, course_end_date, weekdays,
  description, published, sort_order, capacity, level
) values
(
  'adult-floral-home-a1', '創意家居花藝全能班', 'adult', '花藝', 'A1班', 'Eva',
  1080, 1300, true, 180, '19:00', '22:00',
  array['2026-10-16','2026-10-23','2026-10-30','2026-11-06']::date[],
  '2026-10-16', '2026-11-06', array[5]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 1,080（需自費）。',
  true, 201, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-ikebana-b1', '日式現代花道班', 'adult', '花道', 'B1班', 'Eva',
  980, 1300, true, 180, '19:00', '22:00',
  array['2026-10-17','2026-10-24','2026-10-31','2026-11-07']::date[],
  '2026-10-17', '2026-11-07', array[6]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 980（需自費）。',
  true, 202, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-clay-mini-c1', '黏土微型手作班', 'adult', '手作', 'C1班', 'Zoe',
  330, 1250, true, 150, '19:30', '22:00',
  array['2026-11-20','2026-12-04','2026-12-11','2026-12-18']::date[],
  '2026-11-20', '2026-12-18', array[5]::smallint[],
  '4 堂課，每堂 2.5 小時。學費 MOP 1,250（可用持教），材料費 MOP 330（需自費）。',
  true, 203, 8, '4 堂課 · 每堂 2.5 小時'
),
(
  'adult-macao-watercolor-d1', '澳門風景水彩課程', 'adult', '水彩', 'D1班', 'Alice',
  180, 1280, true, 180, '10:30', '13:30',
  array['2026-10-04','2026-10-11','2026-10-25','2026-11-01']::date[],
  '2026-10-04', '2026-11-01', array[0]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,280（可用持教），材料費 MOP 180（需自費）。',
  true, 204, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-macao-watercolor-d2', '澳門風景水彩課程', 'adult', '水彩', 'D2班', 'Alice',
  180, 1280, true, 180, '19:00', '22:00',
  array['2026-10-06','2026-10-08','2026-10-13','2026-10-15']::date[],
  '2026-10-06', '2026-10-15', array[2,4]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,280（可用持教），材料費 MOP 180（需自費）。',
  true, 205, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-macao-watercolor-d3', '澳門風景水彩課程', 'adult', '水彩', 'D3班', 'Alice',
  180, 1280, true, 180, '19:00', '22:00',
  array['2026-10-20','2026-10-22','2026-10-27','2026-10-29']::date[],
  '2026-10-20', '2026-10-29', array[2,4]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,280（可用持教），材料費 MOP 180（需自費）。',
  true, 206, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-pet-watercolor-e1', '水彩寵物肖像課程', 'adult', '水彩', 'E1班', 'Ayabie',
  200, 1320, true, 180, '19:00', '22:00',
  array['2026-10-12','2026-10-19','2026-10-26','2026-11-02']::date[],
  '2026-10-12', '2026-11-02', array[1]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,320（可用持教），材料費 MOP 200（需自費）。',
  true, 207, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-watercolor-portrait-f1', '水彩時尚人像插畫課程', 'adult', '水彩', 'F1班', 'Ayabie',
  200, 1450, true, 180, '19:00', '22:00',
  array['2026-11-09','2026-11-16','2026-11-23','2026-11-30']::date[],
  '2026-11-09', '2026-11-30', array[1]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,450（可用持教），材料費 MOP 200（需自費）。',
  true, 208, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-copperplate-g1', '銅板體小草課程', 'adult', '書法', 'G1班', 'Belinda',
  350, 1550, true, 180, '19:00', '22:00',
  array['2026-11-09','2026-11-16','2026-11-23','2026-11-30']::date[],
  '2026-11-09', '2026-11-30', array[1]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,550（可用持教），材料費 MOP 350（需自費）。',
  true, 209, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-zentangle-h1', '禪繞畫初級入門課程', 'adult', '禪繞', 'H1班', 'Fish',
  250, 1200, true, 120, '11:00', '13:00',
  array['2026-10-06','2026-10-13','2026-10-20','2026-10-27','2026-11-03','2026-11-10']::date[],
  '2026-10-06', '2026-11-10', array[2]::smallint[],
  '逢星期二，每堂 2 小時。學費 MOP 1,200（可用持教），材料費 MOP 250（需自費）。',
  true, 210, 8, '每堂 2 小時'
),
(
  'adult-pet-acrylic-i1', '寵物丙烯畫課程', 'adult', '丙烯', 'I1班', 'Hazel',
  180, 1300, true, 180, '19:00', '22:00',
  array['2026-10-21','2026-10-23','2026-10-28','2026-10-30']::date[],
  '2026-10-21', '2026-10-30', array[3,5]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 180（需自費）。',
  true, 211, 8, '4 堂課 · 每堂 3 小時'
),
(
  'adult-pet-acrylic-i2', '寵物丙烯畫課程', 'adult', '丙烯', 'I2班', 'Hazel',
  180, 1300, true, 180, '19:00', '22:00',
  array['2026-11-04','2026-11-06','2026-11-11','2026-11-13']::date[],
  '2026-11-04', '2026-11-13', array[3,5]::smallint[],
  '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 180（需自費）。',
  true, 212, 8, '4 堂課 · 每堂 3 小時'
)
on conflict (slug) do update set
  name = excluded.name,
  audience = excluded.audience,
  category = excluded.category,
  class_name = excluded.class_name,
  teacher = excluded.teacher,
  price_mop = excluded.price_mop,
  tuition_mop = excluded.tuition_mop,
  hold_edu = excluded.hold_edu,
  duration_minutes = excluded.duration_minutes,
  class_start_time = excluded.class_start_time,
  class_end_time = excluded.class_end_time,
  session_dates = excluded.session_dates,
  course_start_date = excluded.course_start_date,
  course_end_date = excluded.course_end_date,
  weekdays = excluded.weekdays,
  description = excluded.description,
  published = true,
  sort_order = excluded.sort_order,
  level = excluded.level;
