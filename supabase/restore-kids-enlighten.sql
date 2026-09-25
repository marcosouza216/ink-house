-- 還原誤刪的啟蒙恆常班、進階恆常班。
-- 在 Supabase SQL Editor 執行一次。已存在的同 slug 會更新文字與時段，不會清掉圖片。
-- 刪除時一併清掉的報名紀錄無法用這段還原。

insert into public.courses (
  slug, name, english_name, audience, category, age_range, level,
  price_mop, teacher, weekdays, class_start_time, class_end_time,
  description, learning_points, focus_points, weekly_slots,
  published, sort_order, capacity
) values
(
  'kids-3-6',
  '啟蒙恆常班',
  '輕鬆趣味引導教學',
  'kids',
  '啟蒙班',
  '3–6 歲',
  '綜合材料創作，多元化教學模式',
  100,
  '老師待定',
  array[0,2,3,4,5,6]::smallint[],
  '15:30',
  '17:30',
  '我們不教「怎麼畫得像」，我們引導孩子「勇敢表達自己」。每堂課以故事、觀察、互動開啟創作，每週不同主題，老師引導學生創作，孩子自主發揮，以培養興趣、想像力為主。',
  array[
    '基礎線條、點線面訓練',
    '色彩認知、配色感覺、混色練習',
    '簡單造型、動物、植物、場景創作',
    '黏土、拼貼、水彩、馬克筆、綜合材料體驗'
  ],
  array[
    '培養興趣為第一，讓孩子喜歡畫畫、不怕動筆',
    '訓練專注力、耐心、手眼協調、手部精細動作',
    '解放想像力，鼓勵原創、不限制畫風'
  ],
  '[
    {"weekday":2,"start":"15:30","end":"17:30"},
    {"weekday":2,"start":"17:00","end":"18:30"},
    {"weekday":3,"start":"17:00","end":"18:30"},
    {"weekday":4,"start":"17:00","end":"18:30"},
    {"weekday":5,"start":"17:00","end":"18:30"},
    {"weekday":6,"start":"11:00","end":"12:30"},
    {"weekday":6,"start":"14:00","end":"15:30"},
    {"weekday":0,"start":"11:00","end":"12:30"},
    {"weekday":0,"start":"15:00","end":"16:30"}
  ]'::jsonb,
  true,
  10,
  8
),
(
  'kids-7-12',
  '進階恆常班',
  '注重繪畫基本功和技巧訓練',
  'kids',
  '進階班',
  '7–14 歲',
  '造型＋色彩＋構圖循序漸進',
  100,
  '老師待定',
  array[0,2,5,6]::smallint[],
  '17:00',
  '18:30',
  '每週設定多元主題，激發學生藝術潛能。專業導師指導，造型＋色彩＋構圖循序漸進。每堂課有明確學習目標：先理論講解、示範拆解、分步練習、完整成品輸出。注重繪畫基本功和技巧訓練。',
  array[
    '丙烯／水彩／馬克筆／彩鉛完整技法',
    '藝術鑑賞，認識藝術家風格，培育美感',
    '透視原理、比例結構、形體造型訓練',
    '色彩理論、明暗光影、立體塑造、質感表現'
  ],
  array[
    '提升專業繪畫能力，打好美術基礎',
    '訓練觀察力、邏輯思維、空間思維',
    '培養獨立構圖、獨立完成完整作品的能力',
    '提升審美能力，穩定畫風、提升作品精細度'
  ],
  '[
    {"weekday":2,"start":"17:00","end":"18:30"},
    {"weekday":5,"start":"17:00","end":"18:30"},
    {"weekday":6,"start":"11:30","end":"13:00"},
    {"weekday":6,"start":"16:30","end":"18:00"},
    {"weekday":0,"start":"14:00","end":"15:30"},
    {"weekday":0,"start":"17:00","end":"18:30"}
  ]'::jsonb,
  true,
  20,
  8
)
on conflict (slug) do update set
  name = excluded.name,
  english_name = excluded.english_name,
  audience = excluded.audience,
  category = excluded.category,
  age_range = excluded.age_range,
  level = excluded.level,
  price_mop = excluded.price_mop,
  teacher = excluded.teacher,
  weekdays = excluded.weekdays,
  class_start_time = excluded.class_start_time,
  class_end_time = excluded.class_end_time,
  description = excluded.description,
  learning_points = excluded.learning_points,
  focus_points = excluded.focus_points,
  weekly_slots = excluded.weekly_slots,
  published = true,
  sort_order = excluded.sort_order,
  capacity = excluded.capacity;
