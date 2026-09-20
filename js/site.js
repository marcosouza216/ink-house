const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const KIDS_SLUGS = ['kids-3-6', 'kids-7-12', 'kids-5-14'];
const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
const COURSE_COPY = {
  'kids-3-6': {
    name: '啟蒙恆常班',
    age: '3–6 歲',
    category: '啟蒙班',
    level: '綜合材料創作，多元化教學模式',
    label: '輕鬆趣味引導教學',
    desc: '我們不教「怎麼畫得像」，我們引導孩子「勇敢表達自己」。每堂課以故事、觀察、互動開啟創作，每週不同主題，老師引導學生創作，孩子自主發揮，以培養興趣、想像力為主。',
    shortName: '啟蒙班',
    learn: ['基礎線條、點線面訓練', '色彩認知、配色感覺、混色練習', '簡單造型、動物、植物、場景創作', '黏土、拼貼、水彩、馬克筆、綜合材料體驗'],
    focus: ['培養興趣為第一，讓孩子喜歡畫畫、不怕動筆', '訓練專注力、耐心、手眼協調、手部精細動作', '解放想像力，鼓勵原創、不限制畫風'],
    weeklySlots: [
      { weekday: 2, start: '15:30', end: '17:30' },
      { weekday: 2, start: '17:00', end: '18:30' },
      { weekday: 3, start: '17:00', end: '18:30' },
      { weekday: 4, start: '17:00', end: '18:30' },
      { weekday: 5, start: '17:00', end: '18:30' },
      { weekday: 6, start: '11:00', end: '12:30' },
      { weekday: 6, start: '14:00', end: '15:30' },
      { weekday: 0, start: '11:00', end: '12:30' },
      { weekday: 0, start: '15:00', end: '16:30' }
    ]
  },
  'kids-7-12': {
    name: '進階恆常班',
    age: '7–14 歲',
    category: '進階班',
    level: '造型＋色彩＋構圖循序漸進',
    label: '注重繪畫基本功和技巧訓練',
    descTitle: '上課模式',
    desc: '每週設定多元主題，激發學生藝術潛能。專業導師指導，造型＋色彩＋構圖循序漸進。每堂課有明確學習目標：先理論講解、示範拆解、分步練習、完整成品輸出。注重繪畫基本功和技巧訓練。',
    learn: ['丙烯／水彩／馬克筆／彩鉛完整技法', '藝術鑑賞，認識藝術家風格，培育美感', '透視原理、比例結構、形體造型訓練', '色彩理論、明暗光影、立體塑造、質感表現'],
    focus: ['提升專業繪畫能力，打好美術基礎', '訓練觀察力、邏輯思維、空間思維', '培養獨立構圖、獨立完成完整作品的能力', '提升審美能力，穩定畫風、提升作品精細度'],
    shortName: '進階班',
    compare: [
      { age: '3–6 歲', text: '重興趣、重習慣、重想像、玩中學' },
      { age: '7–14 歲', text: '重基礎、重技法、重邏輯、系統進階' }
    ],
    weeklySlots: [
      { weekday: 2, start: '17:00', end: '18:30' },
      { weekday: 5, start: '17:00', end: '18:30' },
      { weekday: 6, start: '11:30', end: '13:00' },
      { weekday: 6, start: '16:30', end: '18:00' },
      { weekday: 0, start: '14:00', end: '15:30' },
      { weekday: 0, start: '17:00', end: '18:30' }
    ]
  },
  'kids-5-14': {
    name: '專業提升班',
    age: '6–15 歲',
    category: '專業提升班',
    level: '學院派方向',
    label: '',
    desc: '可依興趣選擇素描、卡通動漫、水彩、丙烯或大型丙烯畫創作，針對性提升專業繪畫能力。',
    learn: ['素描班提升班', '卡通動漫提升班', '水彩提升班', '丙烯專業提升班', '大型丙烯畫創作'],
    tracks: [
      { id: 'sketch', short: '素描', name: '素描班提升班', mode: '學院派系統訓練，分步拆解，強化寫實觀察', learn: '靜物、石膏、明暗透視、質感造形', focus: '紮實素描功底，建立科學的觀察與繪畫邏輯', slots: [{ weekday: 0, start: '10:30', end: '12:30', label: '素描班' }] },
      { id: 'anime', short: '動漫', name: '卡通動漫提升班', mode: '技法拆解＋原創創作結合', learn: '人體結構、頭身比例、角色設計、表情動態、場景分鏡', focus: '鍛鍊動漫繪畫技法，學會原創角色與故事畫面', slots: [{ weekday: 4, start: '17:00', end: '19:00', label: '漫畫班' }, { weekday: 0, start: '11:00', end: '13:00', label: '動漫班' }] },
      { id: 'watercolor', short: '水彩', name: '水彩提升班', mode: '材料掌握＋技法練習，完整主題創作', learn: '控水技法、渲染疊色、風景、靜物、人物水彩表現', focus: '掌握水彩媒介特性，提升色彩清美與畫面氛圍表現', slots: [{ weekday: 3, start: '17:00', end: '19:00', label: '水彩班' }] },
      { id: 'acrylic', short: '丙烯', name: '丙烯專業提升班', mode: '小班教學，導師示範，針對性指導，色彩運用與表現', learn: '丙烯特性、平塗、渲染、厚塗肌理技法、靜物、動物、風景主題創作', focus: '掌握丙烯材料手感，練習色彩層次，熟練媒介與材料運用，完成完整小幅作品', slots: [{ weekday: 6, start: '14:30', end: '16:30', label: '丙烯班' }] },
      { id: 'large-acrylic', short: '大型丙烯', name: '大型丙烯畫創作', mode: '大畫面實操，分步拆解構圖與繪製', learn: '大尺寸構圖規劃、大面積鋪色、大畫布肌理處理，整體畫面統一調整', focus: '訓練大畫面整體把控能力，解決大面積比例結構、色彩失衡問題，獨立完成大型主題創作' }
    ]
  }
};

function mergeTracks(stored, extra) {
  if (!extra?.length) return stored || [];
  const byId = Object.fromEntries((stored || []).map((track) => [track.id, track]));
  return extra.map((track) => {
    const saved = byId[track.id] || {};
    const merged = (saved.name || saved.mode || saved.slots?.length) ? { ...track, ...saved } : track;
    return {
      ...merged,
      id: saved.id || track.id,
      teacherWorks: saved.teacherWorks?.length ? saved.teacherWorks : (track.teacherWorks || []),
      studentWorks: saved.studentWorks?.length ? saved.studentWorks : (track.studentWorks || [])
    };
  }).concat((stored || []).filter((track) => !extra.some((item) => item.id === track.id)));
}

function hydrateCourse(course) {
  const extra = COURSE_COPY[course.slug];
  if (!extra) return course;
  const hasCopy = Boolean(course.learn?.length);
  return {
    ...course,
    name: hasCopy ? course.name : extra.name,
    age: course.age || extra.age,
    category: hasCopy ? course.category : extra.category,
    level: course.level || extra.level,
    label: extra.label != null && extra.label !== undefined ? (course.label || extra.label) : course.label,
    descTitle: extra.descTitle || '',
    desc: hasCopy ? course.desc : extra.desc,
    learn: course.learn?.length ? course.learn : extra.learn,
    focus: course.focus?.length ? course.focus : extra.focus,
    compare: extra.compare,
    shortName: extra.shortName || course.shortName,
    weeklySlots: course.weeklySlots?.length ? course.weeklySlots : (extra.weeklySlots || []),
    tracks: extra.tracks ? mergeTracks(course.tracks, extra.tracks) : course.tracks
  };
}
function applyKidsFee(course) {
  if (course.audience !== 'kids' || Number(course.priceMop) !== 500) return course;
  return { ...course, priceMop: 100, price: 'MOP 100', feeText: '試堂費 MOP 100' };
}

const HIDDEN_COURSE_SLUGS = new Set(['adult-watercolor', 'adult-sketch', 'adult-acrylic', '694cfd5d-a10d-42de-811d-008d2d28f6f8']);

function makeAdultCourse(row) {
  const dates = row.sessionDates || [];
  const tuition = row.tuitionMop;
  const materials = row.priceMop;
  return {
    id: row.id || row.slug,
    slug: row.slug,
    name: row.name,
    className: row.className,
    audience: 'adult',
    category: row.category,
    teacher: row.teacher,
    sessionDates: dates,
    startDate: dates[0] || '',
    endDate: dates[dates.length - 1] || '',
    startTime: row.startTime,
    endTime: row.endTime,
    weekdays: [...new Set(dates.map((iso) => new Date(`${iso}T00:00:00`).getDay()))].sort(),
    tuitionMop: tuition,
    priceMop: materials,
    holdEdu: true,
    feeLabel: '材料費',
    price: `MOP ${Number(materials).toLocaleString('en-US')}`,
    feeText: `學費 MOP ${Number(tuition).toLocaleString('en-US')}（可用持教）<br>材料費 MOP ${Number(materials).toLocaleString('en-US')}（需自費）`,
    desc: row.desc,
    level: row.level,
    sortOrder: row.sortOrder,
    capacity: row.capacity ?? 8,
    enrolledCount: row.enrolledCount || 0,
    isFull: false,
    published: true,
    imageUrl: row.imageUrl || '',
    teacherWorks: row.teacherWorks || [],
    studentWorks: row.studentWorks || [],
    otherWorks: row.otherWorks || [],
    learn: [],
    focus: [],
    tracks: [],
    weeklySlots: [],
    color: '#c5dcae',
    icon: '藝',
    label: '',
    age: ''
  };
}

const ADULT_TERM = [
  { slug: 'adult-floral-home-a1', name: '創意家居花藝全能班', className: 'A1班', category: '花藝', teacher: 'Eva', sessionDates: ['2026-10-16','2026-10-23','2026-10-30','2026-11-06'], startTime: '19:00', endTime: '22:00', tuitionMop: 1300, priceMop: 1080, sortOrder: 201, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 1,080（需自費）。' },
  { slug: 'adult-ikebana-b1', name: '日式現代花道班', className: 'B1班', category: '花道', teacher: 'Eva', sessionDates: ['2026-10-17','2026-10-24','2026-10-31','2026-11-07'], startTime: '19:00', endTime: '22:00', tuitionMop: 1300, priceMop: 980, sortOrder: 202, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 980（需自費）。' },
  { slug: 'adult-clay-mini-c1', name: '黏土微型手作班', className: 'C1班', category: '手作', teacher: 'Zoe', sessionDates: ['2026-11-20','2026-12-04','2026-12-11','2026-12-18'], startTime: '19:30', endTime: '22:00', tuitionMop: 1250, priceMop: 330, sortOrder: 203, level: '4 堂課 · 每堂 2.5 小時', desc: '4 堂課，每堂 2.5 小時。學費 MOP 1,250（可用持教），材料費 MOP 330（需自費）。' },
  { slug: 'adult-macao-watercolor-d1', name: '澳門風景水彩課程', className: 'D1班', category: '水彩', teacher: 'Alice', sessionDates: ['2026-10-04','2026-10-11','2026-10-25','2026-11-01'], startTime: '10:30', endTime: '13:30', tuitionMop: 1280, priceMop: 180, sortOrder: 204, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,280（可用持教），材料費 MOP 180（需自費）。' },
  { slug: 'adult-macao-watercolor-d2', name: '澳門風景水彩課程', className: 'D2班', category: '水彩', teacher: 'Alice', sessionDates: ['2026-10-06','2026-10-08','2026-10-13','2026-10-15'], startTime: '19:00', endTime: '22:00', tuitionMop: 1280, priceMop: 180, sortOrder: 205, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,280（可用持教），材料費 MOP 180（需自費）。' },
  { slug: 'adult-macao-watercolor-d3', name: '澳門風景水彩課程', className: 'D3班', category: '水彩', teacher: 'Alice', sessionDates: ['2026-10-20','2026-10-22','2026-10-27','2026-10-29'], startTime: '19:00', endTime: '22:00', tuitionMop: 1280, priceMop: 180, sortOrder: 206, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,280（可用持教），材料費 MOP 180（需自費）。' },
  { slug: 'adult-pet-watercolor-e1', name: '水彩寵物肖像課程', className: 'E1班', category: '水彩', teacher: 'Ayabie', sessionDates: ['2026-10-12','2026-10-19','2026-10-26','2026-11-02'], startTime: '19:00', endTime: '22:00', tuitionMop: 1320, priceMop: 200, sortOrder: 207, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,320（可用持教），材料費 MOP 200（需自費）。' },
  { slug: 'adult-watercolor-portrait-f1', name: '水彩時尚人像插畫課程', className: 'F1班', category: '水彩', teacher: 'Ayabie', sessionDates: ['2026-11-09','2026-11-16','2026-11-23','2026-11-30'], startTime: '19:00', endTime: '22:00', tuitionMop: 1450, priceMop: 200, sortOrder: 208, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,450（可用持教），材料費 MOP 200（需自費）。' },
  { slug: 'adult-copperplate-g1', name: '銅板體小草課程', className: 'G1班', category: '書法', teacher: 'Belinda', sessionDates: ['2026-11-09','2026-11-16','2026-11-23','2026-11-30'], startTime: '19:00', endTime: '22:00', tuitionMop: 1550, priceMop: 350, sortOrder: 209, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,550（可用持教），材料費 MOP 350（需自費）。' },
  { slug: 'adult-zentangle-h1', name: '禪繞畫初級入門課程', className: 'H1班', category: '禪繞', teacher: 'Fish', sessionDates: ['2026-10-06','2026-10-13','2026-10-20','2026-10-27','2026-11-03','2026-11-10'], startTime: '11:00', endTime: '13:00', tuitionMop: 1200, priceMop: 250, sortOrder: 210, level: '每堂 2 小時', desc: '逢星期二，每堂 2 小時。學費 MOP 1,200（可用持教），材料費 MOP 250（需自費）。' },
  { slug: 'adult-pet-acrylic-i1', name: '寵物丙烯畫課程', className: 'I1班', category: '丙烯', teacher: 'Hazel', sessionDates: ['2026-10-21','2026-10-23','2026-10-28','2026-10-30'], startTime: '19:00', endTime: '22:00', tuitionMop: 1300, priceMop: 180, sortOrder: 211, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 180（需自費）。' },
  { slug: 'adult-pet-acrylic-i2', name: '寵物丙烯畫課程', className: 'I2班', category: '丙烯', teacher: 'Hazel', sessionDates: ['2026-11-04','2026-11-06','2026-11-11','2026-11-13'], startTime: '19:00', endTime: '22:00', tuitionMop: 1300, priceMop: 180, sortOrder: 212, level: '4 堂課 · 每堂 3 小時', desc: '4 堂課，每堂 3 小時。學費 MOP 1,300（可用持教），材料費 MOP 180（需自費）。' }
];

function loadCatalog(courses) {
  const extras = ADULT_TERM.map(makeAdultCourse);
  const list = courses
    .filter((course) => !HIDDEN_COURSE_SLUGS.has(course.slug) && course.name !== 'Test-918')
    .map(hydrateCourse)
    .map(applyKidsFee);
  const have = new Set(list.map((course) => course.slug));
  extras.filter((course) => !have.has(course.slug)).forEach((course) => list.push(course));
  list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return list;
}

let homeAudience = 'kids';
let calendarAudience = 'kids';
let redrawCatalog = () => {};
let redrawCalendar = () => {};

function scrollToId(id) {
  const section = document.getElementById(id);
  if (!section) return;
  const url = new URL(location.href);
  url.hash = id;
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setHomeAudience(next) {
  if (!['kids', 'adult'].includes(next)) return;
  homeAudience = next;
  calendarAudience = next;
  $$('#courses [data-audience], .home-courses [data-audience]').forEach((item) => item.classList.toggle('active', item.dataset.audience === next));
  $$('[data-calendar-audience]').forEach((item) => item.classList.toggle('active', item.dataset.calendarAudience === next));
  const url = new URL(location.href);
  url.searchParams.set('audience', next);
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  redrawCatalog();
  redrawCalendar();
}

function setCalendarAudience(next) {
  if (!['kids', 'adult'].includes(next)) return;
  calendarAudience = next;
  $$('[data-calendar-audience]').forEach((item) => item.classList.toggle('active', item.dataset.calendarAudience === next));
  redrawCalendar();
  scrollToId('schedule');
}

['images.css', 'ui-refresh.css', 'brand.css'].forEach((href) => {
  if (document.querySelector(`link[href^="${href}"]`)) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = `css/${href}?v=20260920-homecrop`;
  document.head.appendChild(stylesheet);
});

function setupChrome() {
  $$('.brand').forEach((brand) => { brand.innerHTML = '<img class="brand-logo" src="assets/images/logo-cropped.png" alt="賞心學堂 Ink House">'; });
  $('.menu-button')?.addEventListener('click', () => $('.site-header nav')?.classList.toggle('open'));
  $$('.site-header nav a').forEach((link) => link.addEventListener('click', () => $('.site-header nav')?.classList.remove('open')));
  document.querySelector('footer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<footer id="contact">
    <a class="brand" href="index.html#home"><img class="brand-logo" src="assets/images/logo-cropped.png" alt="賞心學堂 Ink House"></a>
    <a class="footer-address" href="https://maps.google.com/?q=澳門皇朝建興龍廣場" target="_blank" rel="noreferrer">澳門皇朝建興龍廣場 22 樓 LM 座</a>
    <div class="footer-icons">
      <a class="footer-icon" href="tel:+85362754126">
        <span class="icon-disk">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3.8h2.4c.4 0 .7.3.8.7l.4 2c.1.3 0 .7-.3.9L9.1 8.6a12.7 12.7 0 0 0 5.3 5.3l1.2-1.2c.2-.3.6-.4.9-.3l2 .4c.4.1.7.4.7.8V16c0 .6-.5 1.1-1.1 1A15.2 15.2 0 0 1 6 6.9c-.1-.6.4-1.1 1-1.1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>
        </span>
        <span class="icon-label">電話</span>
        <span class="icon-value">+853 6275 4126</span>
      </a>
      <button type="button" class="footer-icon wechat copy-contact" data-copy="inkhouse_macao">
        <span class="icon-disk">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.05 3.3C5.2 3.3 2 5.95 2 9.2c0 1.85.95 3.5 2.45 4.65l-.4 1.55c-.08.3.22.55.5.4l1.95-1.05c.7.2 1.45.3 2.25.3.25 0 .5 0 .75-.05-.15-.5-.25-1.05-.25-1.6 0-3.15 2.9-5.7 6.5-5.7h.2C15.6 5.15 12.55 3.3 9.05 3.3zm-1.9 3.55a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm3.95 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/><path fill="currentColor" d="M16.35 9.55c-3.15 0-5.7 2.1-5.7 4.7s2.55 4.7 5.7 4.7c.55 0 1.1-.05 1.6-.2l1.7.9c.25.15.55-.1.45-.4l-.35-1.35c1.2-.85 2-2.1 2-3.55 0-2.6-2.55-4.7-5.4-4.7zm-1.55 3.05a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3.2 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>
        </span>
        <span class="icon-label">微信</span>
        <span class="icon-value">inkhouse_macao</span>
      </button>
      <a class="footer-icon" href="https://www.instagram.com/inkhouse.macao/" target="_blank" rel="noreferrer">
        <span class="icon-disk">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.45" stroke="currentColor" stroke-width="1.7"/><circle cx="17.15" cy="6.85" r="1" fill="currentColor"/></svg>
        </span>
        <span class="icon-label">Instagram</span>
        <span class="icon-value">@inkhouse.macao</span>
      </a>
    </div>
    <p class="copy-status" id="copyStatus"></p>
    <hr class="footer-rule">
    <div class="footer-bottom">
      <div class="footer-nav">
        <a href="index.html#home">主頁</a>
        <a href="index.html?audience=kids#courses">兒童課程</a>
        <a href="index.html?audience=adult#courses">成人課程</a>
        <a href="index.html#schedule">時間表</a>
        <a href="admin.html">登入後台</a>
      </div>
      <small>© 2026 INK HOUSE MACAO</small>
    </div>
  </footer>`);
  $$('.copy-contact').forEach((button) => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.copy); $('#copyStatus').textContent = '微信帳號已複製。'; }
    catch { $('#copyStatus').textContent = `微信帳號：${button.dataset.copy}`; }
  }));
}

function setupHomeSlideshow() {
  const slideshow = $('.home-slideshow');
  if (!slideshow) return;
  const slides = $$('.hero-slide');
  const dots = $('.slide-dots');
  const prev = $('.slide-arrow.previous');
  const next = $('.slide-arrow.next');
  if (dots) dots.innerHTML = '';
  if (!slides.length) return;
  const showControls = slides.length > 1;
  if (prev) prev.hidden = !showControls;
  if (next) next.hidden = !showControls;
  if (dots) dots.hidden = !showControls;
  let current = 0;
  let timer;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
    $$('.slide-dots button').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
    clearInterval(timer);
    if (showControls) timer = setInterval(() => show(current + 1), 5000);
  };
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `查看第 ${index + 1} 張照片`);
    dot.addEventListener('click', () => show(index));
    if (dots) dots.appendChild(dot);
  });
  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  slideshow.addEventListener('mouseenter', () => clearInterval(timer));
  slideshow.addEventListener('mouseleave', () => { if (showControls) timer = setInterval(() => show(current + 1), 5000); });
  show(0);
}

function applyHomePhotos(photos) {
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slides = photos.filter((photo) => photo.placement === 'slideshow').sort((a, b) => a.sortOrder - b.sortOrder);
  const slidesWrap = $('.hero-slides');
  if (slidesWrap && slides.length) {
    slidesWrap.innerHTML = slides.map((photo, index) => `<div class="hero-slide${index === 0 ? ' active' : ''}">${InkData.imgTag(photo.imageUrl, photo.alt || '賞心學堂')}</div>`).join('');
  }
  const fillBlank = (element, photo, fallback) => {
    if (!element || !photo?.imageUrl) return;
    element.classList.add('has-image');
    element.innerHTML = InkData.imgTag(photo.imageUrl, photo.alt || fallback);
  };
  fillBlank($('.about-pics .large'), photos.find((photo) => photo.placement === 'about-large'), '學堂空間');
  fillBlank($('.about-pics .small'), photos.find((photo) => photo.placement === 'about-small'), '創作過程');
}

function clock(value) {
  return String(value || '').slice(0, 5);
}

function clockDate(value) {
  if (!value) return '';
  if (/^\d{1,2}:\d{2}/.test(String(value))) return clock(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return clock(value);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function timeRange(start, end) {
  const from = clockDate(start) || clock(start);
  const to = clockDate(end) || clock(end);
  return from && to ? `${from}–${to}` : from;
}

const EVENT_PALETTE = [
  ['#F94144', '#fffaf0'],
  ['#2D9CDB', '#fffaf0'],
  ['#9B5DE5', '#fffaf0'],
  ['#2A9D8F', '#fffaf0'],
  ['#F3722C', '#fffaf0'],
  ['#F15BB5', '#fffaf0'],
  ['#4361EE', '#fffaf0'],
  ['#E63946', '#fffaf0'],
  ['#00B4D8', '#fffaf0'],
  ['#FB8500', '#fffaf0'],
  ['#06D6A0', '#14332c'],
  ['#FFD166', '#3a2a10']
];

function eventKey(course, trackId) {
  return trackId ? `${course.id}:${trackId}` : String(course.id || course.slug || '');
}

function eventTone(key, used) {
  let hash = 0;
  const text = String(key);
  for (let i = 0; i < text.length; i += 1) hash = (hash * 33 + text.charCodeAt(i)) >>> 0;
  let index = hash % EVENT_PALETTE.length;
  let tries = 0;
  while (used.has(index) && tries < EVENT_PALETTE.length) {
    index = (index + 1) % EVENT_PALETTE.length;
    tries += 1;
  }
  used.add(index);
  const [bg, fg] = EVENT_PALETTE[index];
  return `--event:${bg};--event-ink:${fg}`;
}

function eventStyleMap(sessions, courses) {
  const used = new Set();
  const map = {};
  sessions.forEach((session) => {
    const course = courses.find((item) => item.id === session.courseId);
    if (!course) return;
    const key = eventKey(course, session.trackId);
    if (!map[key]) map[key] = eventTone(key, used);
  });
  return map;
}

function weeklySlots(course) {
  const own = course.weeklySlots || [];
  const fromTracks = (course.tracks || []).flatMap((track) => (track.slots || []).map((slot) => ({
    ...slot,
    label: slot.label || track.short,
    trackId: track.id
  })));
  return [...own, ...fromTracks];
}

function slotLabel(course, slot) {
  return slot.label || course.shortName || course.name;
}

function weeklyTimetableHtml(course) {
  const slots = weeklySlots(course);
  if (!slots.length) return '';
  const byDay = {};
  slots.forEach((slot) => { (byDay[slot.weekday] ||= []).push(slot); });
  const days = Object.keys(byDay).map(Number).sort();
  return `<div class="course-list course-timetable"><h3>每週上課時間</h3>${days.map((day) => `<div class="timetable-day"><strong>星期${weekdayNames[day]}</strong><ul>${byDay[day].map((slot) => `<li>${clock(slot.start)}–${clock(slot.end)}${slot.label ? `　${slot.label}` : ''}</li>`).join('')}</ul></div>`).join('')}</div>`;
}

function formatSessionDates(dates) {
  const parts = (dates || []).map((iso) => String(iso).slice(0, 10).split('-'));
  if (!parts.length) return '';
  const years = new Set(parts.map((part) => part[0]));
  return parts.map(([year, month, day]) => (years.size > 1 ? `${Number(day)}/${Number(month)}/${year}` : `${Number(day)}/${Number(month)}`)).join('、');
}

function courseScheduleText(course) {
  const slots = weeklySlots(course);
  if (slots.length) {
    const days = [...new Set(slots.map((slot) => slot.weekday))].sort();
    return `逢${days.map((day) => `星期${weekdayNames[day]}`).join('、')}`;
  }
  const time = course.startTime && course.endTime ? `${course.startTime}–${course.endTime}` : '';
  if (course.sessionDates?.length) {
    const days = [...new Set(course.sessionDates.map((iso) => new Date(`${iso}T00:00:00`).getDay()))].sort();
    const dayText = days.length ? `（逢${days.map((day) => `星期${weekdayNames[day]}`).join('、')}）` : '';
    return `${formatSessionDates(course.sessionDates)}${dayText}${time ? ` ${time}` : ''}`;
  }
  if (!course.startDate || !course.endDate || !course.weekdays?.length) return '時間待定';
  const days = course.weekdays.map((day) => `星期${weekdayNames[day]}`).join('、');
  return `${course.startDate} 至 ${course.endDate} · 逢${days}${time ? ` · ${time}` : ''}`;
}

function courseTimeOptions(course) {
  const slots = weeklySlots(course);
  if (slots.length) {
    return slots.map((slot) => `星期${weekdayNames[slot.weekday]} ${clock(slot.start)}–${clock(slot.end)}${slot.label ? ` ${slot.label}` : ''}`);
  }
  if (course.sessionDates?.length && course.startTime && course.endTime) {
    return [`${formatSessionDates(course.sessionDates)} ${course.startTime}–${course.endTime}`];
  }
  if (!course.weekdays?.length || !course.startTime || !course.endTime) return [];
  return course.weekdays.map((day) => `星期${weekdayNames[day]} ${course.startTime}–${course.endTime}`);
}

function feeAmount(course) {
  return course.priceMop == null ? '詳情請查詢' : `MOP ${Number(course.priceMop).toLocaleString('en-US')}`;
}

function money(value) {
  return `MOP ${Number(value).toLocaleString('en-US')}`;
}

function feeText(course) {
  if (course.audience === 'adult') {
    const parts = [];
    if (course.tuitionMop != null && course.tuitionMop !== '') parts.push(`學費 ${money(course.tuitionMop)}${course.holdEdu ? '（可用持教）' : ''}`);
    if (course.priceMop != null && course.priceMop !== '') parts.push(`材料費 ${money(course.priceMop)}（需自費）`);
    return parts.join('<br>') || '詳情請查詢';
  }
  return `${course.feeLabel} ${feeAmount(course)}`;
}

function courseHasDates(course) {
  return Boolean(weeklySlots(course).length || (course.sessionDates?.length && course.startTime && course.endTime) || (course.startDate && course.endDate && course.weekdays?.length && course.startTime && course.endTime));
}

function kidsCourses(courses) {
  const mapped = KIDS_SLUGS.map((slug) => courses.find((course) => course.slug === slug)).filter(Boolean);
  return mapped.length ? mapped : courses.filter((course) => course.audience === 'kids');
}

function courseCover(course) {
  return course.imageUrl || '';
}

function courseWorks(course, kind) {
  if (kind === 'teacher') return course.teacherWorks || [];
  if (kind === 'other') return course.otherWorks || [];
  return course.studentWorks || [];
}

function otherPhotosHtml(course) {
  const works = courseWorks(course, 'other');
  if (!works.map(asWork).filter(Boolean).length) return '';
  return workStack(works);
}

function courseCard(course) {
  const cover = courseCover(course);
  const visual = cover ? `<div class="course-art has-image">${InkData.imgTag(cover, course.name, 'loading="lazy"')}</div>` : `<div class="course-art" style="--card:${course.color}"><span>${course.icon}</span></div>`;
  const full = course.isFull ? '<span class="full-badge">已滿</span>' : '';
  const className = (course.className || course.age) ? `<span class="course-class">${course.className || course.age}</span>` : '';
  return `<article class="catalog-card" data-id="${course.id}">${visual}<div class="course-body">${full}<span class="audience-badge">${course.audience === 'kids' ? '兒童班' : '成人班'}</span><span class="course-meta">${course.category}</span><h3>${course.name}</h3>${className}<p>${course.tracks?.length ? course.tracks.map((track) => track.short).join('、') : (course.level || course.desc)}</p><div class="course-footer"><span>${course.teacher || '老師待定'}<br>${courseScheduleText(course)}<br>${feeText(course)}</span><strong>查看 →</strong></div></div></article>`;
}

function bindCourseCards() {
  $$('.catalog-card').forEach((card) => card.addEventListener('click', () => { location.href = `course.html?id=${card.dataset.id}`; }));
}

function renderCatalog(courses) {
  if (!$('#catalogGrid')) return;
  const requested = new URLSearchParams(location.search).get('audience');
  if (['kids', 'adult'].includes(requested)) {
    homeAudience = requested;
    calendarAudience = requested;
  }
  const render = () => {
    const list = homeAudience === 'kids' ? kidsCourses(courses) : courses.filter((course) => course.audience === 'adult');
    $('#catalogGrid').innerHTML = list.length ? list.map(courseCard).join('') : '<p class="empty-state">暫時沒有課程。</p>';
    if ($('#resultCount')) $('#resultCount').textContent = `共 ${list.length} 個課程`;
    bindCourseCards();
    $$('#courses [data-audience], .home-courses [data-audience]').forEach((item) => item.classList.toggle('active', item.dataset.audience === homeAudience));
  };
  redrawCatalog = render;
  $$('#courses [data-audience], .home-courses [data-audience]').forEach((button) => {
    button.addEventListener('click', () => setHomeAudience(button.dataset.audience));
  });
  $$('[data-jump-audience]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const next = link.dataset.jumpAudience;
      if (!next) return;
      event.preventDefault();
      setHomeAudience(next);
      scrollToId('courses');
    });
  });
  render();
}

function asWork(item) {
  if (!item) return null;
  if (typeof item === 'string') return { url: item, x: 50, y: 50, s: 1 };
  const url = item.url || item.src || '';
  return url ? { url, x: Number(item.x ?? 50), y: Number(item.y ?? 50), s: Number(item.s ?? 1) } : null;
}

function workFitStyle(work) {
  const x = work.x ?? 50, y = work.y ?? 50, s = work.s ?? 1;
  return `object-position:${x}% ${y}%;transform:scale(${s});transform-origin:${x}% ${y}%`;
}

function workStack(items, title) {
  const works = (items || []).map(asWork).filter(Boolean);
  if (!works.length) return '';
  const slides = works.map((work) => `<div class="work-slide">${InkData.imgTag(work.url, '', `draggable="false" style="${workFitStyle(work)}"`)}</div>`).join('');
  const many = works.length > 1;
  const dots = many ? `<div class="work-dots">${works.map((_, index) => `<button type="button" data-dot="${index}" aria-label="第 ${index + 1} 張"></button>`).join('')}</div>` : '';
  const controls = many ? `<button type="button" class="work-arrow previous" data-prev aria-label="上一張">‹</button><button type="button" class="work-arrow next" data-next aria-label="下一張">›</button>` : '';
  return `<section class="work-block work-vertical">${title ? `<h3>${title}</h3>` : ''}<div class="work-slider" data-work-slider><div class="work-track">${slides}</div>${controls}${dots}</div></section>`;
}

function workSlider(title, urls, emptyText) {
  const works = (urls || []).map(asWork).filter(Boolean);
  const slides = works.length
    ? works.map((work) => `<div class="work-slide">${InkData.imgTag(work.url, title, 'draggable="false"')}</div>`).join('')
    : `<div class="work-slide work-empty"><span>${emptyText}</span></div>`;
  const many = works.length > 1;
  const dots = many ? `<div class="work-dots">${works.map((_, index) => `<button type="button" data-dot="${index}" aria-label="第 ${index + 1} 張"></button>`).join('')}</div>` : '';
  const controls = many ? `<button type="button" class="work-arrow previous" data-prev aria-label="上一張">‹</button><button type="button" class="work-arrow next" data-next aria-label="下一張">›</button>` : '';
  return `<section class="work-block"><h3>${title}</h3><div class="work-slider" data-work-slider><div class="work-track">${slides}</div>${controls}${dots}</div></section>`;
}

function bindWorkSliders() {
  $$('[data-work-slider]').forEach((root) => {
    const track = root.querySelector('.work-track');
    const slides = [...root.querySelectorAll('.work-slide')];
    const dots = [...root.querySelectorAll('[data-dot]')];
    if (!track || slides.length < 2) return;
    const go = (dir) => track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
    root.querySelector('[data-prev]')?.addEventListener('click', (event) => { event.preventDefault(); go(-1); });
    root.querySelector('[data-next]')?.addEventListener('click', (event) => { event.preventDefault(); go(1); });
    const sync = () => {
      const index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
    };
    track.addEventListener('scroll', sync, { passive: true });
    dots.forEach((dot, index) => dot.addEventListener('click', () => {
      track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
    }));
    sync();
  });
}

function trackSwitchLabel(track) {
  if (track.id === 'acrylic' || track.id === 'large-acrylic') return '丙烯/大型丙烯';
  return track.short;
}

function trackSwitchTracks(tracks) {
  return (tracks || []).filter((track) => track.id !== 'large-acrylic');
}

function trackPanelHtml(track) {
  const time = (track.slots || []).map((slot) => `星期${weekdayNames[slot.weekday]} ${clock(slot.start)}–${clock(slot.end)}`).join('、');
  return `
    <h2>${track.name}</h2>
    ${time ? `<p class="course-tagline">${time}</p>` : ''}
    <div class="course-list"><h3>上課模式</h3><p>${track.mode}</p></div>
    <div class="course-list"><h3>學習內容</h3><p>${track.learn}</p></div>
    <div class="course-list"><h3>教練重點</h3><p>${track.focus}</p></div>
  `;
}

function bindTrackSwitch(course) {
  const buttons = $$('[data-track]');
  const panel = $('#trackPanel');
  if (!buttons.length || !panel) return;
  const show = (id) => {
    const track = course.tracks.find((item) => item.id === id) || course.tracks[0];
    buttons.forEach((button) => button.classList.toggle('active', button.dataset.track === track.id || (button.dataset.track === 'acrylic' && track.id === 'large-acrylic')));
    const teacher = $('#teacherWorksTop');
    const student = $('#studentWorksBottom');
    if (teacher) teacher.innerHTML = workStack(track.teacherWorks);
    panel.innerHTML = trackPanelHtml(track);
    if (student) student.innerHTML = workStack(track.studentWorks, '學生作品');
    bindWorkSliders();
    const url = new URL(location.href);
    url.searchParams.set('track', track.id);
    history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };
  buttons.forEach((button) => button.addEventListener('click', () => show(button.dataset.track)));
}

function renderDetail(courses) {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const course = courses.find((item) => item.id === id) || courses[0];
  if (!course) { $('#courseDetail').innerHTML = '<p>暫時沒有課程資料。</p>'; return; }
  document.title = `${course.name}｜賞心學堂 Ink House`;
  const full = course.isFull ? '<span class="full-badge">已滿</span>' : '';
  const cta = course.isFull
    ? '<span class="button dark" style="opacity:.55;pointer-events:none">已滿</span>'
    : `<a class="button coral" href="signup.html?audience=${course.audience}&course=${course.id}">${course.audience === 'adult' ? '立即報名' : '預約試堂'} →</a>`;
  const meta = `
      <div class="detail-meta">
        <div><span>課程對象</span><strong>${course.audience === 'kids' ? (course.age || '兒童') : '成人'}</strong></div>
        ${course.audience === 'adult' ? `<div><span>上課老師</span><strong>${course.teacher || '待定'}</strong></div>` : ''}
        ${course.audience === 'adult' && course.tuitionMop != null ? `<div><span>學費</span><strong>${money(course.tuitionMop)}${course.holdEdu ? '（可用持教）' : ''}</strong></div>` : ''}
        <div><span>${course.feeLabel}${course.audience === 'adult' ? '（需自費）' : ''}</span><strong>${feeAmount(course)}</strong></div>
      </div>
      ${weeklySlots(course).length ? weeklyTimetableHtml(course) : `<h3>上課時間</h3><p>${courseScheduleText(course)}</p>`}`;
  const calendar = `
    <section class="course-cal">
      <h3>本課月曆</h3>
      <div class="calendar-toolbar">
        <div class="month-switch">
          <button type="button" id="courseCalPrev" aria-label="上個月">←</button>
          <strong id="courseCalMonth">本月</strong>
          <button type="button" id="courseCalNext" aria-label="下個月">→</button>
        </div>
      </div>
      <div id="courseCalGrid"></div>
    </section>
    <div class="detail-actions course-cta">${cta}</div>`;

  if (course.tracks?.length) {
    const current = course.tracks.find((track) => track.id === params.get('track')) || course.tracks[0];
    $('#courseDetail').innerHTML = `
    <div id="teacherWorksTop">${workStack(current.teacherWorks)}</div>
    <div class="detail-info">
      ${full}
      <span class="audience-badge">${course.audience === 'kids' ? '兒童班' : '成人班'}</span>
      <p class="kicker">${course.category}${course.age ? ` · ${course.age}` : ''}</p>
      <h1>${course.name}</h1>
      ${course.level ? `<p class="course-tagline">${course.level}</p>` : ''}
      <p class="course-intro">${course.desc}</p>
      <div class="audience-switch track-switch">
        ${trackSwitchTracks(course.tracks).map((track) => `<button type="button" data-track="${track.id}" class="${track.id === current.id || (track.id === 'acrylic' && current.id === 'large-acrylic') ? 'active' : ''}">${trackSwitchLabel(track)}</button>`).join('')}
      </div>
      <div id="trackPanel">${trackPanelHtml(current)}</div>
      ${meta}
    </div>
    ${otherPhotosHtml(course)}
    <div id="studentWorksBottom">${workStack(current.studentWorks, '學生作品')}</div>
    ${calendar}`;
    bindTrackSwitch(course);
    bindWorkSliders();
    bindCourseCalendar(course);
    return;
  }

  $('#courseDetail').innerHTML = `
    ${workStack(courseWorks(course, 'teacher'))}
    <div class="detail-info">
      ${full}
      <span class="audience-badge">${course.audience === 'kids' ? '兒童班' : '成人班'}</span>
      <p class="kicker">${course.category}${course.age ? ` · ${course.age}` : ''}</p>
      <h1>${course.name}</h1>
      ${course.level ? `<p class="course-tagline">${course.level}</p>` : ''}
      ${course.descTitle ? `<h3>${course.descTitle}</h3>` : ''}
      <p class="course-intro">${course.desc}</p>
      ${course.learn?.length ? `<div class="course-list"><h3>學習內容</h3><ol>${course.learn.map((item) => `<li>${item}</li>`).join('')}</ol></div>` : ''}
      ${course.focus?.length ? `<div class="course-list"><h3>課程注重重點</h3><ol>${course.focus.map((item) => `<li>${item}</li>`).join('')}</ol></div>` : ''}
      ${course.compare?.length ? `<div class="course-list course-compare"><h3>年齡階段學習重點比較</h3><ul>${course.compare.map((item) => `<li><strong>${item.age}</strong> ${item.text}</li>`).join('')}</ul></div>` : ''}
      ${course.label ? `<p class="course-motto">${course.label}</p>` : ''}
      ${meta}
    </div>
    ${otherPhotosHtml(course)}
    ${workStack(courseWorks(course, 'student'), '學生作品')}
    ${calendar}`;
  bindWorkSliders();
  bindCourseCalendar(course);
}

function bindCourseCalendar(course) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const now = new Date();
  let monthOffset = 0;
  const slots = weeklySlots(course);
  const firstDate = course.sessionDates?.[0] || course.startDate;
  if (!slots.length && firstDate) {
    const start = new Date(`${firstDate}T00:00:00`);
    monthOffset = (start.getFullYear() - now.getFullYear()) * 12 + (start.getMonth() - now.getMonth());
    if (monthOffset < 0) monthOffset = 0;
  }
  const paint = () => {
    const shown = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = shown.getFullYear();
    const month = shown.getMonth();
    const gridStart = new Date(year, month, 1 - shown.getDay());
    const dateSet = new Set((course.sessionDates || []).map((iso) => String(iso).slice(0, 10)));
    const rangeStart = course.startDate ? new Date(`${course.startDate}T00:00:00`) : null;
    const rangeEnd = course.endDate ? new Date(`${course.endDate}T23:59:59`) : null;
    const timeLabel = course.startTime && course.endTime ? `${course.startTime}–${course.endTime}` : '';
    const ymd = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const usedTones = new Set();
    const tones = {};
    const styleFor = (trackId) => {
      const key = eventKey(course, trackId);
      if (!tones[key]) tones[key] = eventTone(key, usedTones);
      return tones[key];
    };
    $('#courseCalMonth').textContent = `${year} 年 ${month + 1} 月`;
    let cells = '';
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const inMonth = date.getMonth() === month;
      const daySlots = inMonth ? slots.filter((slot) => slot.weekday === date.getDay()) : [];
      const onClass = inMonth && (daySlots.length ? true : dateSet.size ? dateSet.has(ymd(date)) : rangeStart && rangeEnd && course.weekdays?.includes(date.getDay()) && date >= rangeStart && date <= rangeEnd);
      const events = daySlots.length
        ? daySlots.map((slot) => `<span class="calendar-event" style="${styleFor(slot.trackId)}"><b>${slotLabel(course, slot)}</b><small>${clock(slot.start)}–${clock(slot.end)}${course.isFull ? ' · 已滿' : ''}</small></span>`).join('')
        : (onClass ? `<span class="calendar-event" style="${styleFor()}"><b>${course.name}</b><small>${timeLabel}${course.isFull ? ' · 已滿' : ''}</small></span>` : '');
      cells += `<div class="calendar-day${inMonth ? '' : ' outside'}"><span class="day-number">${date.getDate()}</span>${events}</div>`;
    }
    $('#courseCalGrid').innerHTML = `<section class="calendar-panel ${course.audience}"><header><h3>${course.name}</h3><span>${year}.${String(month + 1).padStart(2, '0')}</span></header><div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join('')}</div><div class="calendar-grid">${cells}</div></section>`;
  };
  $('#courseCalPrev')?.addEventListener('click', () => { monthOffset -= 1; paint(); });
  $('#courseCalNext')?.addEventListener('click', () => { monthOffset += 1; paint(); });
  paint();
}

async function renderTimetable(courses) {
  if (!$('#scheduleList')) return;
  const sessions = await InkData.schedule().catch(() => []);
  let monthOffset = 0;
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const render = () => {
    const audience = calendarAudience;
    const today = new Date();
    const shownMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const year = shownMonth.getFullYear();
    const month = shownMonth.getMonth();
    const gridStart = new Date(year, month, 1 - new Date(year, month, 1).getDay());
    const recurringCourseIds = new Set(courses.filter(courseHasDates).map((course) => course.id));
    const manual = sessions.filter((session) => {
      const course = courses.find((item) => item.id === session.courseId);
      const date = new Date(session.startsAt);
      return !recurringCourseIds.has(session.courseId) && course?.audience === audience && date.getFullYear() === year && date.getMonth() === month;
    });
    const recurring = [];
    courses.filter((course) => course.audience === audience && recurringCourseIds.has(course.id)).forEach((course) => {
      const slots = weeklySlots(course);
      if (slots.length) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= lastDay; day += 1) {
          const date = new Date(year, month, day);
          slots.filter((slot) => slot.weekday === date.getDay()).forEach((slot) => {
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            recurring.push({ courseId: course.id, startsAt: `${iso}T${clock(slot.start)}:00`, endsAt: `${iso}T${clock(slot.end)}:00`, title: slotLabel(course, slot), trackId: slot.trackId, teacher: course.teacher });
          });
        }
        return;
      }
      if (course.sessionDates?.length) {
        course.sessionDates.forEach((iso) => {
          const [sessionYear, sessionMonth] = iso.split('-').map(Number);
          if (sessionYear === year && sessionMonth === month + 1) {
            recurring.push({ courseId: course.id, startsAt: `${iso}T${clock(course.startTime)}:00`, endsAt: `${iso}T${clock(course.endTime)}:00`, teacher: course.teacher });
          }
        });
        return;
      }
      const rangeStart = new Date(`${course.startDate}T00:00:00`);
      const rangeEnd = new Date(`${course.endDate}T23:59:59`);
      const lastDay = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= lastDay; day += 1) {
        const date = new Date(year, month, day);
        if (date >= rangeStart && date <= rangeEnd && course.weekdays.includes(date.getDay())) {
          recurring.push({ courseId: course.id, startsAt: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${clock(course.startTime)}:00`, endsAt: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${clock(course.endTime)}:00`, teacher: course.teacher });
        }
      }
    });
    const matching = [...manual, ...recurring];
    const tones = eventStyleMap(matching, courses);
    $('#calendarMonth').textContent = `${year} 年 ${month + 1} 月`;
    $('#emptySchedule').hidden = matching.length > 0;
    let cells = '';
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const events = matching.filter((session) => {
        const eventDate = new Date(session.startsAt);
        return eventDate.getFullYear() === date.getFullYear() && eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate();
      });
      cells += `<div class="calendar-day${date.getMonth() !== month ? ' outside' : ''}"><span class="day-number">${date.getDate()}</span>${events.map((session) => {
        const course = courses.find((item) => item.id === session.courseId);
        if (!course) return '';
        const time = timeRange(session.startsAt, session.endsAt || course.endTime);
        const href = session.trackId ? `course.html?id=${course.id}&track=${session.trackId}` : `course.html?id=${course.id}`;
        return `<a class="calendar-event" href="${href}" style="${tones[eventKey(course, session.trackId)] || ''}"><b>${session.title || course.shortName || course.name}</b><small>${time}${course.isFull ? ' · 已滿' : ''}</small></a>`;
      }).join('')}</div>`;
    }
    $('#scheduleList').innerHTML = `<section class="calendar-panel ${audience}"><header><h3>${audience === 'adult' ? '成人班月曆' : '兒童班月曆'}</h3><span>${year}.${String(month + 1).padStart(2, '0')}</span></header><div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join('')}</div><div class="calendar-grid">${cells}</div></section>`;
  };
  $('#prevWeek')?.addEventListener('click', () => { monthOffset -= 1; render(); });
  $('#nextWeek')?.addEventListener('click', () => { monthOffset += 1; render(); });
  $$('[data-calendar-audience]').forEach((button) => button.addEventListener('click', () => setCalendarAudience(button.dataset.calendarAudience)));
  redrawCalendar = render;
  $$('[data-calendar-audience]').forEach((item) => item.classList.toggle('active', item.dataset.calendarAudience === calendarAudience));
  render();
}

function paymentHtml({ name, courseName, feeLabel, amount, extra }) {
  return `<div class="pay-box">
    <p>應付${feeLabel}：<strong>${amount}</strong></p>
    ${extra || ''}
    <p>Boc （賞****心）<br><b>183800375221287</b></p>
    <p>Mpay (Ink House)<br><b>62330533</b></p>
    <p>麻煩付款後截圖發給中心💕感謝</p>
    <p class="pay-note">付款備注請填：${name || '姓名'} 和 ${courseName || '報名班'}</p>
  </div>`;
}

function setupRegistration(courses) {
  const params = new URLSearchParams(location.search);
  const requested = params.get('course') || '';
  const seed = courses.find((item) => item.id === requested);
  let mode = params.get('audience');
  if (!['kids', 'adult'].includes(mode)) mode = seed?.audience === 'adult' ? 'adult' : 'kids';
  const kids = kidsCourses(courses).filter((course) => !course.isFull);
  const adults = courses.filter((course) => course.audience === 'adult' && !course.isFull);
  const kidsSelect = $('#kidsCourse');
  const adultSelect = $('#adultCourse');
  if (kidsSelect) kidsSelect.innerHTML = kids.map((course) => `<option value="${course.id}" ${course.id === requested ? 'selected' : ''}>${course.name}</option>`).join('');
  if (adultSelect) {
    const related = seed?.audience === 'adult' ? adults.filter((item) => item.name === seed.name) : adults;
    const compact = seed?.audience === 'adult';
    const list = related.length ? related : adults;
    adultSelect.innerHTML = list.map((course) => {
      const klass = course.className || course.name;
      const when = [formatSessionDates(course.sessionDates || []), course.startTime && course.endTime ? `${clock(course.startTime)}–${clock(course.endTime)}` : ''].filter(Boolean).join(' ');
      const label = compact ? (when ? `${klass}（${when}）` : klass) : `${course.name}${course.className ? ` ${course.className}` : ''}${when ? `（${when}）` : ''}`;
      return `<option value="${course.id}" ${course.id === requested ? 'selected' : ''}>${label}</option>`;
    }).join('');
  }

  const setMode = (next) => {
    mode = next;
    $('#signupMode').value = next;
    $('#kidsFields').hidden = next !== 'kids';
    $('#adultFields').hidden = next !== 'adult';
    const adult = next === 'adult';
    document.title = adult ? '立即報名｜賞心學堂' : '預約試堂｜賞心學堂';
    if ($('#signupKicker')) $('#signupKicker').textContent = adult ? 'ENROLL NOW' : 'TRIAL BOOKING';
    if ($('#signupTitle')) $('#signupTitle').textContent = adult ? '立即報名' : '預約試堂';
    if ($('#signupHeading')) $('#signupHeading').textContent = adult ? '開始報名。' : '開始預約試堂。';
    if ($('#signupSubmit')) $('#signupSubmit').textContent = adult ? '立即報名 →' : '立即預約 →';
    $$('#signupAudience [data-signup-audience]').forEach((button) => button.classList.toggle('active', button.dataset.signupAudience === next));
    ['name', 'age', 'phone', 'wechat', 'courseId', 'selectedTime'].forEach((field) => {
      const input = $(`#kidsFields [name="${field}"]`);
      if (input) input.required = next === 'kids';
    });
    $$('#kidsFields [name="drawingExperience"]').forEach((input) => { input.required = next === 'kids'; });
    ['adultName', 'adultPhone', 'adultWechat', 'adultCourseId', 'adultNotice'].forEach((field) => {
      const input = $(`#adultFields [name="${field}"]`);
      if (input) input.required = next === 'adult';
    });
    update();
  };

  const selectedCourse = () => {
    if (mode === 'kids') return courses.find((course) => course.id === $('#kidsCourse')?.value);
    if (mode === 'adult') return courses.find((course) => course.id === $('#adultCourse')?.value);
    return null;
  };

  const update = () => {
    const course = selectedCourse();
    if (mode === 'kids' && course) {
      const times = courseTimeOptions(course);
      $('#kidsTime').innerHTML = times.length ? times.map((time) => `<option>${time}</option>`).join('') : '<option value="">時間待定，稍後由中心通知</option>';
      $('#kidsFee').innerHTML = `${course.feeLabel}：${feeAmount(course)}`;
    }
    if (mode === 'adult' && course) $('#adultFee').innerHTML = feeText(course);
    $('#selectedCourse').innerHTML = course ? `<span>${course.audience === 'kids' ? '兒童班' : '成人班'}${course.className ? ` · ${course.className}` : ''}</span><h3>${course.name}</h3><p>${courseScheduleText(course)}</p><p>${feeText(course)}</p>` : '請選擇課程';
  };

  $$('#signupAudience [data-signup-audience]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.signupAudience)));
  kidsSelect?.addEventListener('change', update);
  adultSelect?.addEventListener('change', update);
  setMode(mode);

  const qr = $('#wechatQr');
  if (qr) {
    qr.addEventListener('load', () => { qr.hidden = false; $('#qrPlaceholder').hidden = true; });
    qr.addEventListener('error', () => { qr.hidden = true; $('#qrPlaceholder').hidden = false; });
    if (qr.complete) { qr.hidden = !qr.naturalWidth; $('#qrPlaceholder').hidden = Boolean(qr.naturalWidth); }
  }

  $('#registrationForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!mode) { $('#formStatus').textContent = '請選擇課程。'; return; }
    const course = selectedCourse();
    if (!course) { $('#formStatus').textContent = '請選擇課程。'; return; }
    if (course.isFull) { $('#formStatus').textContent = '此課程已滿。'; return; }
    const form = event.target;
    const name = mode === 'kids' ? form.name.value.trim() : form.adultName.value.trim();
    const phone = mode === 'kids' ? form.phone.value.trim() : form.adultPhone.value.trim();
    const wechat = mode === 'kids' ? form.wechat.value.trim() : form.adultWechat.value.trim();
    const age = mode === 'kids' ? form.age.value.trim() : '';
    const extraTime = (mode === 'kids' ? form.preferredTime.value : form.adultPreferredTime.value).trim();
    const drawing = mode === 'kids' ? (form.drawingExperience.value || '') : '';
    if (!wechat) { $('#formStatus').textContent = '請填寫正確的微信帳號。'; return; }
    if (mode === 'kids' && !age) { $('#formStatus').textContent = '請填寫學生年齡。'; return; }
    if (mode === 'kids' && !drawing) { $('#formStatus').textContent = '請選擇有沒有接觸過畫畫。'; return; }
    const selectedTime = mode === 'kids' ? form.selectedTime.value : courseScheduleText(course);
    const preferredParts = [];
    if (extraTime) preferredParts.push(`其他合適時間：${extraTime}`);
    if (drawing) preferredParts.push(`畫畫經驗：${drawing}`);
    const button = event.submitter;
    button.disabled = true;
    try {
      await InkData.submitRegistration({
        name,
        age,
        phone,
        wechat,
        courseIds: [course.id],
        selectedTime,
        preferredTime: preferredParts.join('；') || selectedTime,
        feeType: course.feeLabel,
        feeMop: course.priceMop
      });
      form.hidden = true;
      $('#signupIntro') && ($('#signupIntro').hidden = true);
      $('#selectedCourse').hidden = true;
      $('.registration-layout')?.classList.add('success-only');
      $('#paymentDetails').innerHTML = paymentHtml({
        name,
        courseName: course.className ? `${course.name} ${course.className}` : course.name,
        feeLabel: course.feeLabel,
        amount: feeAmount(course),
        extra: course.audience === 'adult' && course.tuitionMop != null ? `<p>學費 ${money(course.tuitionMop)}${course.holdEdu ? '（可用持教）' : ''} 請另行確認繳交方式。</p>` : ''
      });
      if ($('#successTitle')) $('#successTitle').textContent = mode === 'adult' ? '報名已收到！' : '預約成功！';
      if ($('#successLead')) $('#successLead').textContent = mode === 'adult'
        ? '交了材料費才算報名成功。我們有專人聯繫你，或者你亦可加下方微信，並把付款截圖發給我們。'
        : '我們有專人聯繫你，或者你亦可加下方微信，並把付款截圖發給我們。';
      $('#registrationSuccess').hidden = false;
      $('#registrationSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      $('#formStatus').textContent = `送出失敗：${error.message}`;
    } finally {
      button.disabled = false;
    }
  });
}

async function init() {
  setupChrome();
  try {
    await InkData.ready;
    if ($('.home-slideshow') || $('.about-pics')) {
      try { applyHomePhotos(await InkData.sitePhotos()); } catch {}
    }
  } catch {}
  setupHomeSlideshow();
  try {
    await InkData.ready;
    const courses = loadCatalog(await InkData.courses());
    renderCatalog(courses);
    if ($('#courseDetail')) renderDetail(courses);
    await renderTimetable(courses);
    if ($('#registrationForm')) setupRegistration(courses);
    if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  } catch (error) {
    const target = $('#catalogGrid') || $('#scheduleList') || $('#courseDetail') || $('#formStatus');
    if (target) target.innerHTML = `<p class="empty-state">暫時無法連接課程資料：${error.message}</p>`;
  }
}

init();
