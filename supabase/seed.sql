-- Run after schema.sql. Replace sample values through the admin panel later.
insert into public.courses
  (slug, name, english_name, audience, category, age_range, level, duration_minutes, price_mop, description, learning_points, color, icon, featured, sort_order)
values
  ('kids-creative', '兒童創意繪畫', 'Kids Creative Art', 'kids', 'painting', '5–8 歲', '初學', 90, 220, '以故事、色彩和多元素材啟發想像力。', array['色彩與形狀探索','基礎構圖','混合媒材創作'], '#f2cf65', '創', true, 10),
  ('kids-watercolor', '兒童水彩班', 'Kids Watercolour', 'kids', 'painting', '7–12 歲', '初學至進階', 90, 230, '從水分控制到色彩混合，用透明而流動的顏色記錄觀察。', array['水彩用具認識','調色與暈染','主題作品完成'], '#a9dbea', '水', true, 20),
  ('kids-sketch', '兒童素描基礎', 'Kids Sketching', 'kids', 'foundation', '9–14 歲', '基礎', 90, 230, '訓練觀察、比例和光影。', array['線條與比例','明暗關係','靜物寫生'], '#d9d5cc', '素', false, 30),
  ('kids-calligraphy', '兒童書法班', 'Kids Calligraphy', 'kids', 'traditional', '6–12 歲', '初學', 75, 200, '在一筆一畫間培養專注力。', array['執筆與運筆','基本筆畫','字體結構'], '#efceb8', '書', false, 40),
  ('kids-craft', '兒童手作工藝', 'Kids Handcraft', 'kids', 'craft', '5–10 歲', '不限', 90, 240, '運用紙藝、黏土與生活材料進行創作。', array['材料探索','立體造型','主題手作'], '#c5dcae', '作', false, 50),
  ('kids-ink', '兒童趣味水墨', 'Kids Chinese Ink', 'kids', 'traditional', '7–12 歲', '初學', 90, 230, '用輕鬆方式認識水墨濃淡、筆觸和留白。', array['墨色變化','基礎筆法','創意水墨'], '#a8c8c1', '墨', false, 60),
  ('adult-watercolor', '成人水彩班', 'Adult Watercolour', 'adult', 'painting', '成人', '零基礎歡迎', 120, 280, '在水與顏色的流動裡放慢步伐。', array['水分與顏料控制','層次與光感','個人主題作品'], '#90cbdc', '水', true, 110),
  ('adult-sketch', '成人素描班', 'Adult Sketching', 'adult', 'foundation', '成人', '基礎至進階', 120, 280, '從觀察方法開始，逐步掌握比例、結構、空間和明暗。', array['觀察與測量','結構分析','完整靜物作品'], '#c9c4ba', '素', false, 120),
  ('adult-acrylic', '成人丙烯畫', 'Adult Acrylic', 'adult', 'painting', '成人', '零基礎歡迎', 120, 300, '以鮮明色彩和豐富肌理自由表達。', array['丙烯特性','色彩與肌理','主題創作'], '#efb5b3', '彩', true, 130),
  ('adult-ink', '成人水墨畫', 'Adult Chinese Ink', 'adult', 'traditional', '成人', '不同程度', 120, 300, '在墨色濃淡、運筆節奏與留白之間體會寧靜。', array['用筆用墨','花鳥基礎','意境與構圖'], '#8eb5ad', '墨', false, 140),
  ('adult-calligraphy', '成人書法班', 'Adult Calligraphy', 'adult', 'traditional', '成人', '不同程度', 90, 250, '透過規律書寫安定身心。', array['基本筆法','臨帖方法','作品章法'], '#e5bea5', '書', false, 150),
  ('adult-healing', '療癒藝術 Workshop', 'Healing Art Workshop', 'adult', 'workshop', '成人', '無需經驗', 150, null, '在創作中釋放壓力、回歸寧靜。', array['感官練習','自由創作','自我覺察'], '#d5c4df', '心', false, 160)
on conflict (slug) do nothing;

-- Demonstration timetable for the current and following week.
insert into public.class_sessions
  (course_id, teacher, starts_at, ends_at, capacity, available_spots, status)
select c.id, v.teacher,
  date_trunc('week', now() at time zone 'Asia/Macau') + v.day_offset * interval '1 day' + v.start_time,
  date_trunc('week', now() at time zone 'Asia/Macau') + v.day_offset * interval '1 day' + v.end_time,
  v.capacity, v.spots, 'open'
from (values
  ('kids-creative', '導師待定', 1, time '16:30', time '18:00', 8, 6),
  ('adult-watercolor', '導師待定', 1, time '19:30', time '21:30', 8, 5),
  ('kids-watercolor', '導師待定', 3, time '17:00', time '18:30', 8, 4),
  ('adult-sketch', '導師待定', 3, time '19:30', time '21:30', 8, 6),
  ('kids-calligraphy', '導師待定', 5, time '10:30', time '11:45', 8, 5),
  ('adult-acrylic', '導師待定', 5, time '15:00', time '17:00', 8, 4),
  ('kids-craft', '導師待定', 6, time '11:00', time '12:30', 10, 7),
  ('adult-healing', '導師待定', 6, time '15:30', time '18:00', 10, 8)
) as v(slug, teacher, day_offset, start_time, end_time, capacity, spots)
join public.courses c on c.slug = v.slug
where not exists (select 1 from public.class_sessions);
