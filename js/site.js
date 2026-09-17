const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

['images.css', 'ui-refresh.css', 'brand.css'].forEach((href) => {
  if (document.querySelector(`link[href^="${href}"]`)) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = `css/${href}?v=20260917-2`;
  document.head.appendChild(stylesheet);
});

function setupChrome() {
  $$('.brand').forEach((brand) => { brand.innerHTML = '<img class="brand-logo" src="assets/images/logo-cropped.png" alt="賞心學堂 Ink House">'; });
  $$('.site-header nav').forEach((nav) => {
    const courseLink = nav.querySelector('a[href="courses.html"]');
    if (courseLink && !nav.querySelector('a[href="courses.html?audience=kids"]')) {
      courseLink.href = 'courses.html?audience=kids';
      courseLink.textContent = '兒童課程';
      const adultLink = document.createElement('a');
      adultLink.href = 'courses.html?audience=adult';
      adultLink.textContent = '成人課程';
      courseLink.insertAdjacentElement('afterend', adultLink);
    }
    nav.querySelector('a[href="about.html"]')?.remove();
    if (!nav.querySelector('a[href="contact.html"]')) {
      const link = document.createElement('a'); link.href = 'contact.html'; link.textContent = '聯絡我們';
      nav.insertBefore(link, nav.querySelector('.nav-cta'));
    }
  });
  $('.menu-button')?.addEventListener('click', () => $('.site-header nav')?.classList.toggle('open'));
  $$('.site-header nav a').forEach((link) => link.addEventListener('click', () => $('.site-header nav')?.classList.remove('open')));
  document.querySelector('footer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<footer><a class="brand" href="index.html"><img class="brand-logo" src="assets/images/logo-cropped.png" alt="賞心學堂 Ink House"></a><div><a href="index.html">主頁</a><a href="courses.html">藝術課程</a><a href="schedule.html">時間表</a><a href="contact.html">聯絡我們</a><a href="signup.html">立即報名</a><a href="admin.html">登入後台</a></div><small>© 2026 INK HOUSE MACAO</small></footer>`);
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
    slidesWrap.innerHTML = slides.map((photo, index) => `<div class="hero-slide${index === 0 ? ' active' : ''}"><img src="${escape(photo.imageUrl)}" alt="${escape(photo.alt || '賞心學堂')}"></div>`).join('');
  }
  const fillBlank = (element, photo, fallback) => {
    if (!element || !photo?.imageUrl) return;
    element.classList.add('has-image');
    element.innerHTML = `<img src="${escape(photo.imageUrl)}" alt="${escape(photo.alt || fallback)}">`;
  };
  fillBlank($('.about-pics .large'), photos.find((photo) => photo.placement === 'about-large'), '學堂空間');
  fillBlank($('.about-pics .small'), photos.find((photo) => photo.placement === 'about-small'), '創作過程');
}

const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
function courseScheduleText(course) {
  if (!course.startDate || !course.endDate || !course.weekdays?.length) return '時間待定';
  const days = course.weekdays.map((day) => `星期${weekdayNames[day]}`).join('、');
  return `${course.startDate} 至 ${course.endDate} · 逢${days} · ${course.startTime}–${course.endTime}`;
}

function courseCard(course) {
  const visual = course.imageUrl ? `<div class="course-art has-image"><img src="${course.imageUrl}" alt="${course.name}" loading="lazy"></div>` : `<div class="course-art" style="--card:${course.color}"><span>${course.icon}</span></div>`;
  return `<article class="catalog-card" data-id="${course.id}">${visual}<div class="course-body"><span class="audience-badge">${course.audience === 'kids' ? '兒童班' : '成人班'}</span><span class="course-meta">${course.category}</span><h3>${course.name}</h3><p>${course.desc}</p><div class="course-footer"><span>${course.teacher || '老師待定'}<br>${courseScheduleText(course)}<br>${course.price}</span><strong>查看 →</strong></div></div></article>`;
}

function bindCourseCards() { $$('.catalog-card').forEach((card) => card.addEventListener('click', () => { location.href = `course.html?id=${card.dataset.id}`; })); }

function renderCatalog(courses) {
  let audience = 'all'; let category = 'all';
  const requested = new URLSearchParams(location.search).get('audience');
  if (['kids', 'adult'].includes(requested)) audience = requested;
  const categories = [...new Set(courses.map((course) => course.category).filter(Boolean))];
  const categoryFilter = $('.category-filter');
  if (categoryFilter) categoryFilter.innerHTML = `<button class="active" data-category="all">所有類別</button>${categories.map((item) => `<button data-category="${item}">${item}</button>`).join('')}`;
  const render = () => {
    const list = courses.filter((course) => (audience === 'all' || course.audience === audience) && (category === 'all' || course.category === category));
    $('#catalogGrid').innerHTML = list.map(courseCard).join(''); $('#resultCount').textContent = `共 ${list.length} 個課程`; bindCourseCards();
  };
  $$('[data-audience]').forEach((button) => {
    button.classList.toggle('active', button.dataset.audience === audience);
    button.addEventListener('click', () => { $$('[data-audience]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); audience = button.dataset.audience; render(); });
  });
  $$('[data-category]').forEach((button) => button.addEventListener('click', () => { $$('[data-category]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); category = button.dataset.category; render(); }));
  render();
}

function renderDetail(courses) {
  const id = new URLSearchParams(location.search).get('id'); const course = courses.find((item) => item.id === id) || courses[0];
  if (!course) { $('#courseDetail').innerHTML = '<p>暫時沒有課程資料。</p>'; return; }
  document.title = `${course.name}｜賞心學堂 Ink House`;
  const visual = course.imageUrl ? `<div class="blank-photo detail-placeholder has-image"><img src="${course.imageUrl}" alt="${course.name}"></div>` : `<div class="blank-photo detail-placeholder"><span>${course.name} 課堂照片</span></div>`;
  $('#courseDetail').innerHTML = `${visual}<div class="detail-info"><span class="audience-badge">${course.audience === 'kids' ? '兒童班' : '成人班'}</span><p class="kicker">${course.category}</p><h1>${course.name}</h1><p>${course.desc}</p><div class="detail-meta"><div><span>課程對象</span><strong>${course.audience === 'kids' ? '兒童' : '成人'}</strong></div><div><span>課程類別</span><strong>${course.category}</strong></div><div><span>上課老師</span><strong>${course.teacher || '待定'}</strong></div><div><span>價錢</span><strong>${course.price}</strong></div></div><h3>上課時間</h3><p>${courseScheduleText(course)}</p><div class="detail-actions"><a class="button coral" href="signup.html?course=${course.id}">立即報名 →</a><a class="underlink" href="schedule.html?course=${course.id}">查看月曆</a></div></div>`;
}

async function renderTimetable(courses) {
  const sessions = await InkData.schedule(); let monthOffset = 0; let audience = 'adult';
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const render = () => {
    const today = new Date(); const shownMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const year = shownMonth.getFullYear(); const month = shownMonth.getMonth();
    const gridStart = new Date(year, month, 1 - new Date(year, month, 1).getDay());
    const recurringCourseIds = new Set(courses.filter((course) => course.startDate && course.endDate && course.weekdays?.length && course.startTime && course.endTime).map((course) => course.id));
    const manual = sessions.filter((session) => { const course = courses.find((item) => item.id === session.courseId); const date = new Date(session.startsAt); return !recurringCourseIds.has(session.courseId) && course?.audience === audience && date.getFullYear() === year && date.getMonth() === month; });
    const recurring = [];
    courses.filter((course) => course.audience === audience && recurringCourseIds.has(course.id)).forEach((course) => {
      const rangeStart = new Date(`${course.startDate}T00:00:00`), rangeEnd = new Date(`${course.endDate}T23:59:59`);
      const lastDay = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= lastDay; day += 1) {
        const date = new Date(year, month, day);
        if (date >= rangeStart && date <= rangeEnd && course.weekdays.includes(date.getDay())) recurring.push({ id: `recurring-${course.id}-${year}-${month}-${day}`, courseId: course.id, startsAt: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${course.startTime}:00`, endsAt: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${course.endTime}:00`, teacher: course.teacher, recurring: true });
      }
    });
    const matching = [...manual, ...recurring];
    $('#calendarMonth').textContent = `${year} 年 ${month + 1} 月 · ${audience === 'adult' ? '成人班' : '兒童班'}`;
    $('#emptySchedule').hidden = matching.length > 0;
    let cells = '';
    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart); date.setDate(gridStart.getDate() + index);
      const events = matching.filter((session) => { const eventDate = new Date(session.startsAt); return eventDate.getFullYear() === date.getFullYear() && eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate(); });
      cells += `<div class="calendar-day${date.getMonth() !== month ? ' outside' : ''}"><span class="day-number">${date.getDate()}</span>${events.map((session) => { const course = courses.find((item) => item.id === session.courseId); const time = new Date(session.startsAt).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit', hour12: false }); const detail = session.recurring ? `${time} · ${course.teacher || '老師待定'}` : `${time} · 餘 ${session.spots} 位`; return `<a class="calendar-event" href="signup.html?course=${course.id}${session.recurring ? '' : `&schedule=${session.id}`}"><b>${course.name}</b><small>${detail}</small></a>`; }).join('')}</div>`;
    }
    $('#scheduleList').innerHTML = `<section class="calendar-panel ${audience}"><header><h3>${audience === 'adult' ? '成人班月曆' : '兒童班月曆'}</h3><span>${year}.${String(month + 1).padStart(2, '0')}</span></header><div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join('')}</div><div class="calendar-grid">${cells}</div></section>`;
  };
  $('#prevWeek').addEventListener('click', () => { monthOffset -= 1; render(); }); $('#nextWeek').addEventListener('click', () => { monthOffset += 1; render(); });
  $$('[data-calendar-audience]').forEach((button) => button.addEventListener('click', () => { $$('[data-calendar-audience]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); audience = button.dataset.calendarAudience; render(); }));
  render();
}

function setupRegistration(courses) {
  const params = new URLSearchParams(location.search);
  const requestedCourse = params.get('course') || '';
  $('#courseOptions').innerHTML = courses.map((course) => `<label class="course-check"><input type="checkbox" name="courses" value="${course.id}" ${course.id === requestedCourse ? 'checked' : ''}><span><b>${course.name}</b><small>${course.audience === 'kids' ? '兒童班' : '成人班'} · ${course.duration} · ${course.price}</small></span></label>`).join('');
  const update = () => {
    const selectedIds = new FormData($('#registrationForm')).getAll('courses');
    const selected = courses.filter((course) => selectedIds.includes(course.id));
    $('#selectedCourse').innerHTML = selected.length ? `<span>已選擇 ${selected.length} 項課程</span>${selected.map((course) => `<h3>${course.name}</h3>`).join('')}` : '尚未選擇課程';
  };
  $$('#courseOptions input').forEach((input) => input.addEventListener('change', update)); update();
  const qr = $('#wechatQr');
  qr.addEventListener('load', () => { qr.hidden = false; $('#qrPlaceholder').hidden = true; });
  qr.addEventListener('error', () => { qr.hidden = true; $('#qrPlaceholder').hidden = false; });
  if (qr.complete) { qr.hidden = !qr.naturalWidth; $('#qrPlaceholder').hidden = Boolean(qr.naturalWidth); }
  $('#registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); const formData = new FormData(event.target); const courseIds = formData.getAll('courses');
    if (!courseIds.length) { $('#formStatus').textContent = '請至少選擇一項課程。'; return; }
    const button = event.submitter; button.disabled = true;
    try {
      const data = Object.fromEntries(formData); data.courseIds = courseIds; data.scheduleId = params.get('schedule') || '';
      await InkData.submitRegistration(data);
      event.target.hidden = true; $('#selectedCourse').hidden = true; $('#registrationSuccess').hidden = false;
      $('#registrationSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) { $('#formStatus').textContent = `送出失敗：${error.message}`; }
    finally { button.disabled = false; }
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
    const courses = await InkData.courses();
    if ($('#featuredGrid')) { $('#featuredGrid').innerHTML = courses.filter((course) => course.featured).slice(0, 4).map(courseCard).join(''); bindCourseCards(); }
    if ($('#catalogGrid')) renderCatalog(courses); if ($('#courseDetail')) renderDetail(courses); if ($('#scheduleList')) await renderTimetable(courses); if ($('#registrationForm')) setupRegistration(courses);
  } catch (error) {
    const target = $('#catalogGrid') || $('#featuredGrid') || $('#scheduleList') || $('#courseDetail') || $('#formStatus'); if (target) target.innerHTML = `<p class="empty-state">暫時無法連接課程資料：${error.message}</p>`;
  }
}

init();
