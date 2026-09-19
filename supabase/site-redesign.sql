-- Homepage redesign: enrollment capacity, work galleries, signup extras.
-- Run once in the Supabase SQL Editor.

alter table public.courses
  add column if not exists capacity integer check (capacity is null or capacity >= 0),
  add column if not exists enrolled_count integer not null default 0,
  add column if not exists teacher_works text[] not null default '{}',
  add column if not exists student_works text[] not null default '{}';

alter table public.registrations
  add column if not exists selected_time text,
  add column if not exists fee_type text,
  add column if not exists fee_mop numeric(10,2);

create or replace function public.refresh_course_enrolled()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  cid := coalesce(new.course_id, old.course_id);
  if cid is not null then
    update public.courses
    set enrolled_count = (
      select count(*) from public.registrations
      where course_id = cid and coalesce(status::text, 'new') is distinct from 'cancelled'
    )
    where id = cid;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists registrations_enrolled_count on public.registrations;
create trigger registrations_enrolled_count
after insert or update or delete on public.registrations
for each row execute function public.refresh_course_enrolled();

insert into public.courses
  (slug, name, audience, category, age_range, price_mop, description, teacher, published, sort_order, capacity)
values
  ('kids-3-6', '啟蒙恆常班', 'kids', '啟蒙班', '3–6 歲', 500, '我們不教「怎麼畫得像」，我們引導孩子「勇敢表達自己」。每堂課以故事、觀察、互動開啟創作，每週不同主題，老師引導學生創作，孩子自主發揮，以培養興趣、想像力為主。', '老師待定', true, 10, 8),
  ('kids-7-12', '進階恆常班', 'kids', '進階班', '7–14 歲', 500, '每週設定多元主題，激發學生藝術潛能。專業導師指導，造型＋色彩＋構圖循序漸進。每堂課有明確學習目標：先理論講解、示範拆解、分步練習、完整成品輸出。注重繪畫基本功和技巧訓練。', '老師待定', true, 20, 8),
  ('kids-5-14', '專業提升班', 'kids', '專業提升班', '6–15 歲', 500, '可依興趣選擇素描、卡通動漫、水彩、丙烯或大型丙烯畫創作，針對性提升專業繪畫能力。', '老師待定', true, 30, 8)
on conflict (slug) do update set
  name = excluded.name,
  audience = excluded.audience,
  category = excluded.category,
  age_range = excluded.age_range,
  published = true;

update public.courses
set published = false
where audience = 'kids'
  and slug not in ('kids-3-6', 'kids-7-12', 'kids-5-14');
