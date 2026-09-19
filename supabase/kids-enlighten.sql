-- 兒童三班文案：啟蒙恆常班、進階恆常班、專業提升班（含分項）。
-- Run once in the Supabase SQL Editor after adult-class-dates.sql.

alter table public.courses
  add column if not exists focus_points text[] not null default '{}';

update public.courses
set
  name = '啟蒙恆常班',
  category = '啟蒙班',
  age_range = '3–6 歲',
  level = '綜合材料創作，多元化教學模式',
  english_name = '輕鬆趣味引導教學',
  description = '我們不教「怎麼畫得像」，我們引導孩子「勇敢表達自己」。每堂課以故事、觀察、互動開啟創作，每週不同主題，老師引導學生創作，孩子自主發揮，以培養興趣、想像力為主。',
  learning_points = array[
    '基礎線條、點線面訓練',
    '色彩認知、配色感覺、混色練習',
    '簡單造型、動物、植物、場景創作',
    '黏土、拼貼、水彩、馬克筆、綜合材料體驗'
  ],
  focus_points = array[
    '培養興趣為第一，讓孩子喜歡畫畫、不怕動筆',
    '訓練專注力、耐心、手眼協調、手部精細動作',
    '解放想像力，鼓勵原創、不限制畫風'
  ],
  published = true
where slug = 'kids-3-6';

update public.courses
set
  name = '進階恆常班',
  category = '進階班',
  age_range = '7–14 歲',
  level = '造型＋色彩＋構圖循序漸進',
  english_name = '注重繪畫基本功和技巧訓練',
  description = '每週設定多元主題，激發學生藝術潛能。專業導師指導，造型＋色彩＋構圖循序漸進。每堂課有明確學習目標：先理論講解、示範拆解、分步練習、完整成品輸出。注重繪畫基本功和技巧訓練。',
  learning_points = array[
    '丙烯／水彩／馬克筆／彩鉛完整技法',
    '藝術鑑賞，認識藝術家風格，培育美感',
    '透視原理、比例結構、形體造型訓練',
    '色彩理論、明暗光影、立體塑造、質感表現'
  ],
  focus_points = array[
    '提升專業繪畫能力，打好美術基礎',
    '訓練觀察力、邏輯思維、空間思維',
    '培養獨立構圖、獨立完成完整作品的能力',
    '提升審美能力，穩定畫風、提升作品精細度'
  ],
  published = true
where slug = 'kids-7-12';

alter table public.courses
  add column if not exists tracks jsonb not null default '[]';

update public.courses
set
  name = '專業提升班',
  category = '專業提升班',
  age_range = '6–15 歲',
  level = '學院派方向',
  english_name = null,
  description = '可依興趣選擇素描、卡通動漫、水彩、丙烯或大型丙烯畫創作，針對性提升專業繪畫能力。',
  learning_points = array[
    '素描班提升班',
    '卡通動漫提升班',
    '水彩提升班',
    '丙烯專業提升班',
    '大型丙烯畫創作'
  ],
  focus_points = '{}',
  tracks = '[
    {"id":"sketch","short":"素描","name":"素描班提升班","mode":"學院派系統訓練，分步拆解，強化寫實觀察","learn":"靜物、石膏、明暗透視、質感造形","focus":"紮實素描功底，建立科學的觀察與繪畫邏輯","teacherWorks":[],"studentWorks":[],"slots":[{"weekday":0,"start":"10:30","end":"12:30","label":"素描班"}]},
    {"id":"anime","short":"動漫","name":"卡通動漫提升班","mode":"技法拆解＋原創創作結合","learn":"人體結構、頭身比例、角色設計、表情動態、場景分鏡","focus":"鍛鍊動漫繪畫技法，學會原創角色與故事畫面","teacherWorks":[],"studentWorks":[],"slots":[{"weekday":4,"start":"17:00","end":"19:00","label":"漫畫班"},{"weekday":0,"start":"11:00","end":"13:00","label":"動漫班"}]},
    {"id":"watercolor","short":"水彩","name":"水彩提升班","mode":"材料掌握＋技法練習，完整主題創作","learn":"控水技法、渲染疊色、風景、靜物、人物水彩表現","focus":"掌握水彩媒介特性，提升色彩清美與畫面氛圍表現","teacherWorks":[],"studentWorks":[],"slots":[{"weekday":3,"start":"17:00","end":"19:00","label":"水彩班"}]},
    {"id":"acrylic","short":"丙烯","name":"丙烯專業提升班","mode":"小班教學，導師示範，針對性指導，色彩運用與表現","learn":"丙烯特性、平塗、渲染、厚塗肌理技法、靜物、動物、風景主題創作","focus":"掌握丙烯材料手感，練習色彩層次，熟練媒介與材料運用，完成完整小幅作品","teacherWorks":[],"studentWorks":[],"slots":[{"weekday":6,"start":"14:30","end":"16:30","label":"丙烯班"}]},
    {"id":"large-acrylic","short":"大型丙烯","name":"大型丙烯畫創作","mode":"大畫面實操，分步拆解構圖與繪製","learn":"大尺寸構圖規劃、大面積鋪色、大畫布肌理處理，整體畫面統一調整","focus":"訓練大畫面整體把控能力，解決大面積比例結構、色彩失衡問題，獨立完成大型主題創作","teacherWorks":[],"studentWorks":[]}
  ]'::jsonb,
  published = true
where slug = 'kids-5-14';

alter table public.courses
  add column if not exists weekly_slots jsonb not null default '[]';

update public.courses
set weekly_slots = '[
  {"weekday":2,"start":"15:30","end":"17:30"},
  {"weekday":2,"start":"17:00","end":"18:30"},
  {"weekday":3,"start":"17:00","end":"18:30"},
  {"weekday":4,"start":"17:00","end":"18:30"},
  {"weekday":5,"start":"17:00","end":"18:30"},
  {"weekday":6,"start":"11:00","end":"12:30"},
  {"weekday":6,"start":"14:00","end":"15:30"},
  {"weekday":0,"start":"11:00","end":"12:30"},
  {"weekday":0,"start":"15:00","end":"16:30"}
]'::jsonb
where slug = 'kids-3-6';

update public.courses
set weekly_slots = '[
  {"weekday":2,"start":"17:00","end":"18:30"},
  {"weekday":5,"start":"17:00","end":"18:30"},
  {"weekday":6,"start":"11:30","end":"13:00"},
  {"weekday":6,"start":"16:30","end":"18:00"},
  {"weekday":0,"start":"14:00","end":"15:30"},
  {"weekday":0,"start":"17:00","end":"18:30"}
]'::jsonb
where slug = 'kids-7-12';
