const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let view='overview',courseTab='kids',courses=[],signups=[],photos=[],photosError='';
	let signupFilter={audience:'',courseId:'',month:'',q:''};
const DAYS=['日','一','二','三','四','五','六'];
$$('[data-close-modal]').forEach(button=>button.onclick=()=>{const dialog=$('#modal');if(dialog.open)dialog.close('cancel')});
{const style=document.createElement('link');style.rel='stylesheet';style.href='css/brand.css?v=20260919-admin';document.head.appendChild(style)}$$('.brand').forEach(brand=>brand.innerHTML='<img class="brand-logo" src="assets/images/logo-cropped.png" alt="賞心學堂 Ink House">');
const titles={overview:'營運總覽',courses:'課程管理',photos:'主頁照片',signups:'報名名單'},audienceName={kids:'兒童班',adult:'成人班'};
$('#loginForm').onsubmit=async event=>{event.preventDefault();$('#loginError').textContent='';const data=Object.fromEntries(new FormData(event.target)),button=event.submitter;button.disabled=true;try{await InkData.signIn(data.email,data.password);await showDashboard()}catch(error){$('#loginError').textContent=error.message}finally{button.disabled=false}};
async function loadData(){
  [courses,signups]=await Promise.all([InkData.courses(true),InkData.signups()]);
  const fallback=[
    {id:'sketch',short:'素描',name:'素描班提升班',mode:'學院派系統訓練，分步拆解，強化寫實觀察',learn:'靜物、石膏、明暗透視、質感造形',focus:'紮實素描功底，建立科學的觀察與繪畫邏輯',slots:[{weekday:0,start:'10:30',end:'12:30',label:'素描班'}],teacherWorks:[],studentWorks:[]},
    {id:'anime',short:'動漫',name:'卡通動漫提升班',mode:'技法拆解＋原創創作結合',learn:'人體結構、頭身比例、角色設計、表情動態、場景分鏡',focus:'鍛鍊動漫繪畫技法，學會原創角色與故事畫面',slots:[{weekday:4,start:'17:00',end:'19:00',label:'漫畫班'},{weekday:0,start:'11:00',end:'13:00',label:'動漫班'}],teacherWorks:[],studentWorks:[]},
    {id:'watercolor',short:'水彩',name:'水彩提升班',mode:'材料掌握＋技法練習，完整主題創作',learn:'控水技法、渲染疊色、風景、靜物、人物水彩表現',focus:'掌握水彩媒介特性，提升色彩清美與畫面氛圍表現',slots:[{weekday:3,start:'17:00',end:'19:00',label:'水彩班'}],teacherWorks:[],studentWorks:[]},
    {id:'acrylic',short:'丙烯',name:'丙烯專業提升班',mode:'小班教學，導師示範，針對性指導，色彩運用與表現',learn:'丙烯特性、平塗、渲染、厚塗肌理技法、靜物、動物、風景主題創作',focus:'掌握丙烯材料手感，練習色彩層次，熟練媒介與材料運用，完成完整小幅作品',slots:[{weekday:6,start:'14:30',end:'16:30',label:'丙烯班'}],teacherWorks:[],studentWorks:[]},
    {id:'large-acrylic',short:'大型丙烯',name:'大型丙烯畫創作',mode:'大畫面實操，分步拆解構圖與繪製',learn:'大尺寸構圖規劃、大面積鋪色、大畫布肌理處理，整體畫面統一調整',focus:'訓練大畫面整體把控能力，解決大面積比例結構、色彩失衡問題，獨立完成大型主題創作',slots:[],teacherWorks:[],studentWorks:[]}
  ];
  courses=courses.map(course=>course.slug==='kids-5-14'&&!course.tracks?.length?{...course,tracks:fallback}:course);
  try{photos=await InkData.sitePhotos();photosError=''}catch(error){photos=[];photosError=error.message}
}
async function showDashboard(){$('#loginScreen').hidden=true;$('#dashboard').hidden=false;try{await loadData();render()}catch(error){InkData.signOut();$('#dashboard').hidden=true;$('#loginScreen').hidden=false;$('#loginError').textContent=`無法讀取後台資料：${error.message}`}}
InkData.ready.then(()=>{if(InkData.isSignedIn())showDashboard()}).catch(error=>$('#loginError').textContent=error.message);$('#logout').onclick=()=>{InkData.signOut();location.reload()};
$$('aside nav button').forEach(button=>button.onclick=()=>{$$('aside nav button').forEach(x=>x.classList.remove('active'));button.classList.add('active');view=button.dataset.view;render()});

function slotSummary(slots){
  if(!slots?.length)return '尚未設定時間';
  return slots.map(slot=>`星期${DAYS[slot.weekday]} ${(slot.start||'').slice(0,5)}–${(slot.end||'').slice(0,5)}${slot.label?` ${slot.label}`:''}`).join('、');
}

function courseRows(c){
  const main=`<tr><td><strong>${esc(c.name)}</strong><br><small>${esc(c.className||c.age||c.label||c.teacher||'')}</small></td><td>${esc(c.category)}</td><td>${esc(c.duration)}<br>${esc(c.feeText||`${c.feeLabel} ${c.price}`)}</td><td>${c.isFull?'<span class="badge">已滿</span>':`${c.enrolledCount}/${c.capacity??'—'}`}</td><td class="actions"><button onclick="openCourse('${c.id}')">編輯總覽</button>${c.audience==='kids'?`<button onclick="openTrack('${c.id}','')">＋ 分項</button>`:''}<button class="delete" onclick="removeItem('${c.id}')">刪除</button></td></tr>`;
  if(c.audience!=='kids'||!c.tracks?.length)return main;
  const kids=c.tracks.map(track=>`<tr class="track-row"><td class="track-name"><span>↳</span><strong>${esc(track.name||track.short||'未命名分項')}</strong><br><small>${esc(track.short||'')}</small></td><td>${esc(c.category)}</td><td>${esc(slotSummary(track.slots))}</td><td>—</td><td class="actions"><button onclick="openTrack('${c.id}','${esc(track.id)}')">編輯</button><button class="delete" onclick="removeTrack('${c.id}','${esc(track.id)}')">刪除</button></td></tr>`).join('');
  return main+kids;
}

function courseTable(list){
  if(!list.length)return '<div class="empty">這個分類還沒有課程</div>';
  return `<table><thead><tr><th>課程</th><th>類別</th><th>時間／費用</th><th>報名情況</th><th>操作</th></tr></thead><tbody>${list.map(courseRows).join('')}</tbody></table>`;
}

function renderCourses(){
  const kids=courses.filter(c=>c.audience==='kids'),adults=courses.filter(c=>c.audience==='adult');
  const list=courseTab==='kids'?kids:adults;
  $('#content').innerHTML=`<div class="panel"><div class="panel-head"><div class="admin-tabs"><button type="button" class="${courseTab==='kids'?'active':''}" onclick="setCourseTab('kids')">兒童班（${kids.length}）</button><button type="button" class="${courseTab==='adult'?'active':''}" onclick="setCourseTab('adult')">成人班（${adults.length}）</button></div><button class="add-button" onclick="openCourse('', '${courseTab}')">＋ 新增${courseTab==='kids'?'兒童':'成人'}課程</button></div>${courseTable(list)}</div>`;
}

function render(){
  $('#viewTitle').textContent=titles[view];
  if(view==='overview')$('#content').innerHTML=`<div class="stats"><div class="stat"><span>全部課程</span><strong>${courses.length}</strong></div><div class="stat"><span>兒童／成人</span><strong>${courses.filter(c=>c.audience==='kids').length} / ${courses.filter(c=>c.audience==='adult').length}</strong></div><div class="stat"><span>學生報名</span><strong>${signups.length}</strong></div></div><div class="panel"><div class="panel-head"><h2>最新報名</h2></div>${signupTable(signups.slice(0,5))}</div>`;
  if(view==='courses')renderCourses();
  if(view==='signups')renderSignups();
  if(view==='photos')renderPhotos();
}

window.setCourseTab=tab=>{courseTab=tab;renderCourses()};

	function signupCourses(s){
	  const ids=s.course_ids?.length?s.course_ids:[s.course_id];
	  return ids.map(id=>courses.find(c=>c.id===id)).filter(Boolean);
	}
	function signupNames(s){return signupCourses(s).map(c=>c.className?`${c.name} ${c.className}`:c.name)}
		function signupMonthKey(s){
		  const day=new Date(s.created_at);
		  if(Number.isNaN(day.getTime()))return '';
		  return `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}`;
		}
		function signupMonthChoices(){
		  return [...new Set(signups.map(signupMonthKey).filter(Boolean))].sort().reverse().map(key=>{
		    const [year,month]=key.split('-');
		    return [key,`${year}年${Number(month)}月`];
		  });
		}
	function filteredSignups(){
	  const q=signupFilter.q.trim().toLowerCase();
	  return signups.filter(s=>{
	    const list=signupCourses(s);
	    if(signupFilter.audience&&list.length&&!list.some(c=>c.audience===signupFilter.audience))return false;
	    if(signupFilter.courseId&&s.course_id!==signupFilter.courseId&&!(s.course_ids||[]).includes(signupFilter.courseId))return false;
    if(signupFilter.month&&signupMonthKey(s)!==signupFilter.month)return false;
	    if(q){
	      const hay=[s.student_name,s.phone,s.wechat,s.selected_time,s.preferred_time,...signupNames(s)].join(' ').toLowerCase();
	      if(!hay.includes(q))return false;
	    }
	    return true;
	  });
	}
	function renderSignups(){
	  const list=filteredSignups();
	  const courseChoices=courses.filter(c=>!signupFilter.audience||c.audience===signupFilter.audience);
	  $('#content').innerHTML=`<div class="panel"><div class="panel-head"><h2>報名名單（${list.length}）</h2><button type="button" class="add-button" onclick="downloadSignups()">下載 Excel</button></div>
	    <div class="signup-filters">
	      <label>班別<select id="signupAudience">${[['','全部'],['kids','兒童班'],['adult','成人班']].map(([value,label])=>`<option value="${value}" ${signupFilter.audience===value?'selected':''}>${label}</option>`).join('')}</select></label>
	      <label>課程<select id="signupCourse"><option value="">全部課程</option>${courseChoices.map(c=>`<option value="${c.id}" ${signupFilter.courseId===c.id?'selected':''}>${esc(c.name)}${c.className?` ${esc(c.className)}`:''}</option>`).join('')}</select></label>
	      <label>月份<select id="signupMonth"><option value="">全部月份</option>${signupMonthChoices().map(([value,label])=>`<option value="${value}" ${signupFilter.month===value?'selected':''}>${label}</option>`).join('')}</select></label>
		      <label>搜尋<input id="signupQuery" placeholder="姓名、電話、微信" value="${esc(signupFilter.q)}"></label>
	    </div>
	    ${signupTable(list)}</div>`;
	  $('#signupAudience').onchange=()=>{signupFilter.audience=$('#signupAudience').value;signupFilter.courseId='';renderSignups()};
	  $('#signupCourse').onchange=()=>{signupFilter.courseId=$('#signupCourse').value;renderSignups()};
		  $('#signupMonth').onchange=()=>{signupFilter.month=$('#signupMonth').value;renderSignups()};
	  const query=$('#signupQuery');
	  query.oninput=()=>{signupFilter.q=query.value;const pos=query.selectionStart;renderSignups();const next=$('#signupQuery');if(next){next.focus();next.setSelectionRange(pos,pos)}};
	}
	window.downloadSignups=()=>{
	  const list=filteredSignups();
	  const xmlCell=value=>`<Cell><Data ss:Type="String">${String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</Data></Cell>`;
	  const rows=[['姓名','年齡','電話','微信','課程','時間','其他時間／備註','費用','報名日期'],...list.map(s=>{
	    const fee=s.fee_type?`${s.fee_type}${s.fee_mop!=null?` MOP ${s.fee_mop}`:''}`:'';
	    return [s.student_name||'',s.student_age||'',s.phone||'',s.wechat||'',signupNames(s).join('、'),s.selected_time||'',s.preferred_time&&s.preferred_time!==s.selected_time?s.preferred_time:'',fee,new Date(s.created_at).toLocaleString('zh-HK')];
	  })];
	  const xml=`<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
	<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="報名名單"><Table>${rows.map(row=>`<Row>${row.map(xmlCell).join('')}</Row>`).join('')}</Table></Worksheet></Workbook>`;
	  const blob=new Blob(['﻿'+xml],{type:'application/vnd.ms-excel'});
	  const link=document.createElement('a');
	  const day=new Date();
	  link.href=URL.createObjectURL(blob);
	  link.download=`報名名單-${day.getFullYear()}${String(day.getMonth()+1).padStart(2,'0')}${String(day.getDate()).padStart(2,'0')}.xls`;
	  link.click();
	  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
	};

	function signupTable(list){return list.length?`<table><thead><tr><th>姓名</th><th>聯絡</th><th>報名課程</th><th>時間／備註</th><th>報名日期</th><th>操作</th></tr></thead><tbody>${list.map(s=>`<tr><td><strong>${esc(s.student_name)}</strong>${s.student_age?`<br>${esc(s.student_age)} 歲`:''}</td><td>${esc(s.phone||'')}<br>微信：${esc(s.wechat||'—')}</td><td>${signupNames(s).map(esc).join('<br>')||'—'}</td><td>${esc(s.selected_time||'—')}${s.preferred_time&&s.preferred_time!==s.selected_time?`<br>${esc(s.preferred_time)}`:''}${s.fee_type?`<br>${esc(s.fee_type)} ${s.fee_mop!=null?`MOP ${s.fee_mop}`:''}`:''}</td><td>${new Date(s.created_at).toLocaleString('zh-HK')}</td><td class="actions"><button class="delete" onclick="removeSignup('${s.id}')">刪除</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty">沒有符合條件的報名資料</div>'}

	function editor(title,html,save,wide=false){
  $('#modalTitle').textContent=title;
  $('#formFields').innerHTML=html;
  const dialog=$('#modal');
  dialog.classList.toggle('wide',wide);
  dialog.showModal();
  $('#editorForm').onsubmit=async event=>{
    if(event.submitter?.value==='cancel')return;
    event.preventDefault();
    event.submitter.disabled=true;
    try{
      const formData=new FormData(event.target),data=Object.fromEntries(formData);
      data.weekdays=formData.getAll('weekdays');
      data.sessionDates=formData.getAll('sessionDates').map(value=>String(value).trim()).filter(Boolean).sort();
      data.holdEdu=formData.get('holdEdu')==='on';
      await save(data);
      dialog.close();
      await loadData();
      render();
    }catch(error){alert(`儲存失敗：${error.message}`)}
    finally{event.submitter.disabled=false}
  };
}

window.removeItem=async(id)=>{if(!confirm('確定要刪除這筆課程嗎？相關報名資料也會一併刪除。'))return;try{await InkData.deleteCourse(id);await loadData();render()}catch(error){alert(`刪除失敗：${error.message}`)}};
window.removeSignup=async(id)=>{if(!confirm('確定要刪除這筆報名嗎？'))return;try{await InkData.deleteSignup(id);await loadData();render()}catch(error){alert(`刪除失敗：${error.message}`)}};

function expandCourseDates(c){if(c.sessionDates?.length)return c.sessionDates;if(!c.startDate||!c.endDate||!c.weekdays?.length)return [''];const dates=[];const cursor=new Date(`${c.startDate}T00:00:00`);const end=new Date(`${c.endDate}T00:00:00`);while(cursor<=end){if(c.weekdays.includes(cursor.getDay()))dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`);cursor.setDate(cursor.getDate()+1)}return dates.length?dates:['']}
function dateRowHtml(value=''){return `<div class="date-row"><label>上課日期<input type="date" name="sessionDates" value="${esc(value)}"></label><button type="button" class="remove-date" data-remove-date>移除</button></div>`}
function slotRowHtml(slot={},prefix='slot'){return `<div class="slot-row"><label>星期<select name="${prefix}Weekday">${DAYS.map((day,index)=>`<option value="${index}" ${Number(slot.weekday)===index?'selected':''}>星期${day}</option>`).join('')}</select></label><label>開始<input type="time" name="${prefix}Start" value="${esc(slot.start||'')}"></label><label>結束<input type="time" name="${prefix}End" value="${esc(slot.end||'')}"></label><label>備註<input name="${prefix}Label" placeholder="選填，例如水彩班" value="${esc(slot.label||'')}"></label><button type="button" class="remove-date" data-remove-slot>移除</button></div>`}
function parseImagePos(url){const match=String(url||'').match(/#pos=(\d+),(\d+)/);return match?{x:Number(match[1]),y:Number(match[2])}:{x:50,y:50}}
function cleanImageUrl(url){return String(url||'').replace(/#.*$/,'')}
function withImagePos(url,x,y){const clean=cleanImageUrl(url);if(!clean)return '';x=Number(x);y=Number(y);return (x===50&&y===50)?clean:`${clean}#pos=${x},${y}`}
function asWork(item){if(!item)return null;if(typeof item==='string')return {url:item,y:50};const url=item.url||'';return url?{url,y:Number(item.y??50)}:null}
function thumbsHtml(urls,kind){return (urls||[]).map(asWork).filter(Boolean).map(work=>`<span class="work-thumb" data-kind="${kind}">${InkData.imgTag(work.url,'',`style="object-position:50% ${work.y}%"`)}<label class="thumb-pos">位置<input type="range" min="0" max="100" value="${work.y}" data-pos></label><span class="thumb-tools"><button type="button" data-move-thumb="-1" title="上移">↑</button><button type="button" data-move-thumb="1" title="下移">↓</button><button type="button" data-remove-thumb>×</button></span></span>`).join('')}
function trackCardHtml(track={}){
  const slots=track.slots?.length?track.slots:[{}];
  return `<div class="track-card"><div class="track-card-head"><strong>專業分項</strong><button type="button" class="delete" data-remove-track>刪除分項</button></div><input type="hidden" name="trackId" value="${esc(track.id||'')}"><div class="admin-form-row"><label>短名稱<input name="trackShort" placeholder="素描" value="${esc(track.short||'')}"></label><label>完整名稱<input name="trackName" placeholder="素描班提升班" value="${esc(track.name||'')}"></label></div><label>上課模式<textarea name="trackMode">${esc(track.mode||'')}</textarea></label><label>學習內容<textarea name="trackLearn">${esc(track.learn||'')}</textarea></label><label>教練重點<textarea name="trackFocus">${esc(track.focus||'')}</textarea></label><fieldset class="date-field"><legend>此時段</legend><div class="track-slots">${slots.map(slot=>slotRowHtml(slot,'trackSlot')).join('')}</div><button type="button" class="add-date" data-add-track-slot>＋ 新增時段</button></fieldset><label>老師作品<input type="file" name="trackTeacherFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="teacher">${thumbsHtml(track.teacherWorks,'teacher')}</div></label><label>學生作品<input type="file" name="trackStudentFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="student">${thumbsHtml(track.studentWorks,'student')}</div></label></div>`;
}

function readSlots(root,prefix){
  if(!root)return [];
  const rows=root.id==='weeklySlotList'?[...root.querySelectorAll(':scope > .slot-row')]:[...root.querySelectorAll('.track-slots > .slot-row')];
  return rows.map(row=>{
    const weekday=Number(row.querySelector(`[name="${prefix}Weekday"]`)?.value);
    const start=row.querySelector(`[name="${prefix}Start"]`)?.value||'';
    const end=row.querySelector(`[name="${prefix}End"]`)?.value||'';
    const label=(row.querySelector(`[name="${prefix}Label"]`)?.value||'').trim();
    if(!start||!end)return null;
    return label?{weekday,start,end,label}:{weekday,start,end};
  }).filter(Boolean);
}

function remainingThumbs(scope,kind){
  return [...scope.querySelectorAll(`.work-thumb[data-kind="${kind}"]`)].filter(thumb=>scope.classList.contains('track-card')?true:!thumb.closest('.track-card')).map(thumb=>{
    const img=thumb.querySelector('img');
    const url=img?.dataset.cloud||img?.getAttribute('src')||'';
    if(!url)return null;
    const y=Number(thumb.querySelector('[data-pos]')?.value);
    return Number.isFinite(y)&&y!==50?{url,y}:url;
  }).filter(Boolean);
}

function readTracks(){
  return $$('#trackList .track-card').map((card,index)=>{
    const short=(card.querySelector('[name=trackShort]')?.value||'').trim();
    const name=(card.querySelector('[name=trackName]')?.value||short).trim();
    const id=(card.querySelector('[name=trackId]')?.value||'').trim()||short.toLowerCase().replace(/[^a-z0-9一-鿿-]+/gi,'-')||`track-${index+1}`;
    return {id,short:short||name,name,mode:(card.querySelector('[name=trackMode]')?.value||'').trim(),learn:(card.querySelector('[name=trackLearn]')?.value||'').trim(),focus:(card.querySelector('[name=trackFocus]')?.value||'').trim(),slots:readSlots(card,'trackSlot'),teacherWorks:remainingThumbs(card,'teacher'),studentWorks:remainingThumbs(card,'student'),teacherFiles:card.querySelector('[name=trackTeacherFiles]')?.files,studentFiles:card.querySelector('[name=trackStudentFiles]')?.files};
  }).filter(track=>track.short||track.name);
}

function bindCourseForm(){
  const audience=$('[name=audience]');
  const sync=()=>{
    const kids=audience?.value==='kids';
    const kidsBox=$('#kidsSchedule'),adultBox=$('#adultSchedule'),adultFee=$('#adultFeeFields'),kidsExtra=$('#kidsExtra');
    if(kidsBox)kidsBox.hidden=!kids;
    if(adultBox)adultBox.hidden=kids;
    if(adultFee)adultFee.hidden=!kids?false:true;
    if(kidsExtra)kidsExtra.hidden=!kids;
    $$('#adultSchedule [name=startTime], #adultSchedule [name=endTime]').forEach(input=>{if(input)input.required=!kids});
  };
  audience?.addEventListener('change',sync);
  sync();
  $('#addWeeklySlot')?.addEventListener('click',()=>{$('#weeklySlotList')?.insertAdjacentHTML('beforeend',slotRowHtml());bindRemove()});
  $('#addSessionDate')?.addEventListener('click',()=>{$('#sessionDateList')?.insertAdjacentHTML('beforeend',dateRowHtml());bindRemove()});
  $('#addTrack')?.addEventListener('click',()=>{$('#trackList')?.insertAdjacentHTML('beforeend',trackCardHtml());bindRemove()});
  function bindRemove(){
    $$('[data-remove-date]').forEach(button=>button.onclick=()=>{const list=button.closest('#sessionDateList');const rows=list?$$('#sessionDateList .date-row'):[];if(rows.length<=1){rows[0]?.querySelector('input')&& (rows[0].querySelector('input').value='');return}button.closest('.date-row')?.remove()});
    $$('[data-remove-slot]').forEach(button=>button.onclick=()=>{const row=button.closest('.slot-row');const box=row?.parentElement;if((box?.querySelectorAll('.slot-row')||[]).length<=1){row.querySelectorAll('input,select').forEach(input=>{if(input.type!=='select-one')input.value=''});return}row.remove()});
    $$('[data-remove-track]').forEach(button=>button.onclick=()=>button.closest('.track-card')?.remove());
    $$('[data-add-track-slot]').forEach(button=>button.onclick=()=>{button.parentElement.querySelector('.track-slots')?.insertAdjacentHTML('beforeend',slotRowHtml({},'trackSlot'));bindRemove()});
    $$('[data-remove-thumb]').forEach(button=>button.onclick=()=>button.closest('.work-thumb')?.remove());
    $$('[data-move-thumb]').forEach(button=>button.onclick=()=>{
      const thumb=button.closest('.work-thumb');
      if(!thumb)return;
      if(Number(button.dataset.moveThumb)<0)thumb.previousElementSibling?.before(thumb);
      else thumb.nextElementSibling?.after(thumb);
    });
    $$('[data-pos]').forEach(input=>input.oninput=()=>{
      const img=input.closest('.work-thumb')?.querySelector('img');
      if(img)img.style.objectPosition=`50% ${input.value}%`;
    });
  }
  bindRemove();
  bindImagePreview();
}

window.openCourse=(id,defaultAudience)=>{
  const c=courses.find(x=>x.id===id)||{audience:defaultAudience||courseTab||'kids'};
  const dates=expandCourseDates(c);
  const weekly=c.weeklySlots?.length?c.weeklySlots:[{}];
  const tracks=c.tracks?.length?c.tracks:[];
  editor(id?'編輯課程':'新增課程',`
    <label>課程名稱<input name="name" required value="${esc(c.name||'')}"></label>
    <div class="admin-form-row">
      <label>課程對象<select name="audience"><option value="kids">兒童班</option><option value="adult">成人班</option></select></label>
      <label>課程類別<input name="category" required placeholder="例如：水彩、啟蒙班" value="${esc(c.category||'')}"></label>
    </div>
    <div class="admin-form-row">
      <label>班級名稱（成人，選填）<input name="className" placeholder="例如：F1班" value="${esc(c.className||'')}"></label>
      <label>年齡（兒童，選填）<input name="age" placeholder="例如：3–6 歲" value="${esc(c.age||'')}"></label>
    </div>
    <label>教學特色／堂數（選填）<input name="level" placeholder="例如：4 堂課 · 每堂 3 小時" value="${esc(c.level||'')}"></label>
    <label>一句標語（選填）<input name="label" placeholder="例如：輕鬆趣味引導教學" value="${esc(c.label||'')}"></label>
    <label>上課老師<input name="teacher" value="${esc(c.teacher||'老師待定')}"></label>
    <div class="admin-form-row">
      <label>試堂費／材料費 MOP<input type="number" name="priceMop" min="0" value="${c.priceMop??(c.audience==='kids'?100:'')}"></label>
      <label>名額<input type="number" name="capacity" min="0" placeholder="滿額後顯示已滿" value="${c.capacity??''}"></label>
    </div>
    <p class="slot-label">兒童班此欄為試堂費。成人班此欄為材料費（需自費）。目前報名 ${c.enrolledCount||0} 人${c.capacity?`／${c.capacity}`:''}${c.isFull?'（已滿）':''}</p>
    <div id="adultFeeFields">
      <label>學費 MOP<input type="number" name="tuitionMop" min="0" placeholder="例如：1450" value="${c.tuitionMop??''}"></label>
      <label class="check-inline"><input type="checkbox" name="holdEdu" ${c.holdEdu?'checked':''}><span>學費可用持續進修資助（持教）</span></label>
    </div>
    <div id="kidsSchedule">
      <fieldset class="date-field"><legend>每週上課時段</legend><p class="slot-label">兒童恆常班請按星期新增時段，可同一天兩個時間。</p><div id="weeklySlotList">${weekly.map(slot=>slotRowHtml(slot)).join('')}</div><button type="button" class="add-date" id="addWeeklySlot">＋ 新增時段</button></fieldset>
    </div>
    <div id="adultSchedule">
      <fieldset class="date-field"><legend>上課日期（一天一天新增）</legend><p class="slot-label">成人短期班請逐日輸入實際上課日。</p><div id="sessionDateList">${dates.map(date=>dateRowHtml(date)).join('')}</div><button type="button" class="add-date" id="addSessionDate">＋ 新增上課日</button></fieldset>
      <div class="admin-form-row"><label>上課開始時間<input type="time" name="startTime" value="${esc(c.startTime||'')}"></label><label>上課結束時間<input type="time" name="endTime" value="${esc(c.endTime||'')}"></label></div>
    </div>
    <label>課程簡介<textarea name="desc">${esc(c.desc||'')}</textarea></label>
    <div id="kidsExtra">
      <label>學習內容（一行一項）<textarea name="learnText">${esc((c.learn||[]).join('\n'))}</textarea></label>
      <label>課程注重重點（一行一項）<textarea name="focusText">${esc((c.focus||[]).join('\n'))}</textarea></label>
      ${c.id&&c.audience!=='adult'?`<p class="slot-label">專業分項（素描、動漫、水彩等）請在課程列表分開編輯。目前 ${c.tracks?.length||0} 個分項。</p>`:''}
    </div>
    <label>課程封面<input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp,image/gif"><small>可調整左右／上下位置</small>
      <div class="cover-pos" id="coverPosWrap" ${c.imageUrl?'':'hidden'}>
        <img id="coverPreview" src="${esc(cleanImageUrl(c.imageUrl))}" alt="目前課程圖片" style="display:block;width:100%;max-height:220px;object-fit:cover;margin-top:10px;object-position:${parseImagePos(c.imageUrl).x}% ${parseImagePos(c.imageUrl).y}%">
        <label class="thumb-pos">左右<input type="range" name="imageX" min="0" max="100" value="${parseImagePos(c.imageUrl).x}"></label>
        <label class="thumb-pos">上下<input type="range" name="imageY" min="0" max="100" value="${parseImagePos(c.imageUrl).y}"></label>
      </div>
    </label>
    <label>老師作品（直向顯示，可調位置與順序）<input type="file" name="teacherWorkFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="teacher">${thumbsHtml(c.teacherWorks,'teacher')}</div></label>
    <label>其他照片（顯示在課程資料下方）<input type="file" name="otherWorkFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="other">${thumbsHtml(c.otherWorks,'other')}</div></label>
    <label>學生作品（可多張）<input type="file" name="studentWorkFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="student">${thumbsHtml(c.studentWorks,'student')}</div></label>
  `,async data=>{
    const audience=data.audience;
    const weeklySlots=readSlots($('#weeklySlotList'),'slot');
    const tracks=c.tracks||[];
    if(audience==='adult'&&!data.sessionDates.length)throw new Error('請至少新增一個上課日期');
    if(audience==='kids'&&!weeklySlots.length&&!tracks.some(track=>track.slots?.length))throw new Error('請至少新增一個上課時段，或先新增專業分項');
    const form=$('#editorForm');
    const file=data.imageFile;
    let imageUrl=cleanImageUrl(c.imageUrl||'');
    if(file instanceof File&&file.size>0)imageUrl=await InkData.uploadCourseImage(file,c.slug||'course',{crop:false});
    imageUrl=withImagePos(imageUrl,form.imageX?.value,form.imageY?.value);
    const uploadMany=async(list,folder,existing)=>{
      const files=[...list||[]].filter(item=>item instanceof File&&item.size>0);
      const kept=(existing||[]).filter(Boolean);
      if(!files.length)return kept;
      const urls=[...kept];
      for(const item of files)urls.push(await InkData.uploadCourseImage(item,folder,{crop:false}));
      return urls;
    };
    const teacherWorks=await uploadMany(form.teacherWorkFiles?.files,'teacher',remainingThumbs(form,'teacher'));
    const otherWorks=await uploadMany(form.otherWorkFiles?.files,'other',remainingThumbs(form,'other'));
    const studentWorks=await uploadMany(form.studentWorkFiles?.files,'student',remainingThumbs(form,'student'));
    const lines=value=>(value||'').split(/\n+/).map(item=>item.replace(/^\d+\.\s*/,'').trim()).filter(Boolean);
    await InkData.saveCourse({
      ...data,
      id:c.id,
      slug:c.slug,
      color:c.color,
      icon:c.icon,
      imageUrl,
      teacherWorks,
      otherWorks,
      studentWorks,
      className:data.className,
      age:data.age,
      level:data.level,
      label:data.label,
      teacher:data.teacher||'老師待定',
      learn:lines(data.learnText),
      focus:lines(data.focusText),
      tuitionMop:audience==='adult'?data.tuitionMop:'',
      holdEdu:audience==='adult'&&data.holdEdu,
      sessionDates:audience==='adult'?data.sessionDates:[],
      weeklySlots:audience==='kids'?weeklySlots:[],
      tracks:audience==='kids'?tracks:[],
      startTime:audience==='adult'?data.startTime:'',
      endTime:audience==='adult'?data.endTime:''
    });
  },true);
  if(c.audience)$('[name=audience]').value=c.audience;
  bindCourseForm();
};

window.openTrack=(courseId,trackId)=>{
  const course=courses.find(item=>item.id===courseId);
  if(!course){alert('找不到課程');return}
  const existing=(course.tracks||[]).find(item=>item.id===trackId);
  const track=existing||{id:'',short:'',name:'',mode:'',learn:'',focus:'',slots:[{}],teacherWorks:[],studentWorks:[]};
  const slots=track.slots?.length?track.slots:[{}];
  editor(existing?`編輯分項 · ${track.name||track.short}`:`新增專業分項 · ${course.name}`,`
    <input type="hidden" name="trackId" value="${esc(track.id||'')}">
    <div class="admin-form-row">
      <label>短名稱<input name="short" required placeholder="素描" value="${esc(track.short||'')}"></label>
      <label>完整名稱<input name="name" required placeholder="素描班提升班" value="${esc(track.name||'')}"></label>
    </div>
    <label>上課模式<textarea name="mode">${esc(track.mode||'')}</textarea></label>
    <label>學習內容<textarea name="learn">${esc(track.learn||'')}</textarea></label>
    <label>教練重點<textarea name="focus">${esc(track.focus||'')}</textarea></label>
    <fieldset class="date-field"><legend>每週上課時段</legend><div id="weeklySlotList">${slots.map(slot=>slotRowHtml(slot)).join('')}</div><button type="button" class="add-date" id="addWeeklySlot">＋ 新增時段</button></fieldset>
    <label>老師作品<input type="file" name="teacherWorkFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="teacher">${thumbsHtml(track.teacherWorks,'teacher')}</div></label>
    <label>學生作品<input type="file" name="studentWorkFiles" accept="image/jpeg,image/png,image/webp,image/gif" multiple><div class="thumb-row" data-kind="student">${thumbsHtml(track.studentWorks,'student')}</div></label>
  `,async data=>{
    const form=$('#editorForm');
    const uploadMany=async(list,folder,existing)=>{
      const files=[...list||[]].filter(item=>item instanceof File&&item.size>0);
      const kept=(existing||[]).filter(Boolean);
      if(!files.length)return kept;
      const urls=[...kept];
      for(const item of files)urls.push(await InkData.uploadCourseImage(item,folder,{crop:false}));
      return urls;
    };
    const short=(data.short||'').trim();
    const name=(data.name||short).trim();
    const id=(data.trackId||'').trim()||short.toLowerCase().replace(/[^a-z0-9一-鿿-]+/gi,'-')||`track-${Date.now()}`;
    const next={
      id,
      short:short||name,
      name,
      mode:(data.mode||'').trim(),
      learn:(data.learn||'').trim(),
      focus:(data.focus||'').trim(),
      slots:readSlots($('#weeklySlotList'),'slot'),
      teacherWorks:await uploadMany(form.teacherWorkFiles?.files,`track-${id}-teacher`,remainingThumbs(form,'teacher')),
      studentWorks:await uploadMany(form.studentWorkFiles?.files,`track-${id}-student`,remainingThumbs(form,'student'))
    };
    const tracks=[...(course.tracks||[])];
    const index=tracks.findIndex(item=>item.id===track.id);
    if(index>=0)tracks[index]=next;else tracks.push(next);
    await InkData.saveCourse({...course,tracks,sessionDates:course.sessionDates||[],weeklySlots:course.weeklySlots||[]});
  },true);
  bindCourseForm();
};

window.removeTrack=async(courseId,trackId)=>{
  if(!confirm('確定要刪除這個分項嗎？'))return;
  const course=courses.find(item=>item.id===courseId);
  if(!course)return;
  try{
    await InkData.saveCourse({...course,tracks:(course.tracks||[]).filter(item=>item.id!==trackId),sessionDates:course.sessionDates||[],weeklySlots:course.weeklySlots||[]});
    await loadData();
    render();
  }catch(error){alert(`刪除失敗：${error.message}`)}
};

function slideshowPhotos(){return photos.filter(p=>p.placement==='slideshow').sort((a,b)=>a.sortOrder-b.sortOrder)}
function photoCard(photo,actions,empty){return `<div class="photo-card">${photo?.imageUrl?InkData.imgTag(photo.imageUrl,''):`<div class="photo-empty">${empty}</div>`}<div class="actions">${actions}</div></div>`}
function bindImagePreview(){
  const fileInput=$('[name=imageFile]');
  const preview=$('#coverPreview');
  const wrap=$('#coverPosWrap');
  const syncPos=()=>{
    if(!preview)return;
    const x=$('[name=imageX]')?.value||50;
    const y=$('[name=imageY]')?.value||50;
    preview.style.objectPosition=`${x}% ${y}%`;
  };
  $$('[name=imageX],[name=imageY]').forEach(input=>input.oninput=syncPos);
  if(!fileInput)return;
  fileInput.onchange=()=>{
    if(!fileInput.files[0])return;
    const target=preview||Object.assign(document.createElement('img'),{id:'coverPreview'});
    target.src=URL.createObjectURL(fileInput.files[0]);
    target.style='display:block;width:100%;max-height:220px;object-fit:cover;margin-top:10px';
    if(!preview)fileInput.parentElement.appendChild(target);
    if(wrap)wrap.hidden=false;
    syncPos();
  };
}
function renderPhotos(){
  if(photosError){$('#content').innerHTML=`<div class="panel"><p>無法載入主頁照片。請先在 Supabase SQL Editor 執行 <code>supabase/site-photos.sql</code>。</p><p class="empty">${esc(photosError)}</p></div>`;return}
  const slides=slideshowPhotos(),large=photos.find(p=>p.placement==='about-large'),small=photos.find(p=>p.placement==='about-small');
  $('#content').innerHTML=`<div class="panel"><div class="panel-head"><h2>輪播照片</h2><button class="add-button" onclick="openSlideshowPhoto()">＋ 新增輪播照片</button></div>${slides.length?`<div class="photo-grid">${slides.map((p,i)=>photoCard(p,`<button onclick="movePhoto('${p.id}',-1)" ${i===0?'disabled':''}>上移</button><button onclick="movePhoto('${p.id}',1)" ${i===slides.length-1?'disabled':''}>下移</button><button class="delete" onclick="removePhoto('${p.id}')">刪除</button>`)).join('')}</div>`:'<div class="empty">尚未上傳輪播照片，主頁會繼續顯示目前的預設畫面</div>'}</div><div class="panel"><div class="panel-head"><h2>歡迎區塊照片</h2></div><div class="about-slots"><div><p class="slot-label">大圖 · 學堂空間</p>${photoCard(large,`<button onclick="openAboutPhoto('about-large')">${large?'更換照片':'上傳照片'}</button>${large?`<button class="delete" onclick="removePhoto('${large.id}')">移除</button>`:''}`,'尚未上傳')}</div><div><p class="slot-label">小圖 · 創作過程</p>${photoCard(small,`<button onclick="openAboutPhoto('about-small')">${small?'更換照片':'上傳照片'}</button>${small?`<button class="delete" onclick="removePhoto('${small.id}')">移除</button>`:''}`,'尚未上傳')}</div></div></div>`
}
window.openSlideshowPhoto=()=>{editor('新增輪播照片',`<label>照片<input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp,image/gif" required><small>JPG、PNG、WebP，會自動裁剪壓縮</small></label><label>說明文字（選填）<input name="alt" placeholder="例如：課堂創作"></label>`,async data=>{const file=data.imageFile;if(!(file instanceof File)||!file.size)throw new Error('請選擇照片');const imageUrl=await InkData.uploadCourseImage(file,'homepage');const slides=slideshowPhotos();await InkData.saveSitePhoto({placement:'slideshow',imageUrl,alt:data.alt||'',sortOrder:slides.length?Math.max(...slides.map(p=>p.sortOrder))+10:0})});bindImagePreview()};
window.openAboutPhoto=placement=>{const photo=photos.find(p=>p.placement===placement)||{},title=placement==='about-large'?'學堂空間照片':'創作過程照片';editor(photo.id?`更換${title}`:`上傳${title}`,`<label>照片<input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp,image/gif" ${photo.imageUrl?'':'required'}><small>JPG、PNG、WebP，會自動裁剪壓縮</small>${photo.imageUrl?`<img src="${esc(photo.imageUrl)}" alt="目前照片" style="display:block;width:100%;max-height:220px;object-fit:cover;margin-top:10px">`:''}</label><label>說明文字（選填）<input name="alt" value="${esc(photo.alt)}"></label>`,async data=>{const file=data.imageFile;let imageUrl=photo.imageUrl||'';if(file instanceof File&&file.size>0)imageUrl=await InkData.uploadCourseImage(file,'homepage');if(!imageUrl)throw new Error('請選擇照片');await InkData.saveSitePhoto({id:photo.id,placement,imageUrl,alt:data.alt||'',sortOrder:photo.sortOrder||0})});bindImagePreview()};
window.movePhoto=async(id,dir)=>{const slides=slideshowPhotos();const index=slides.findIndex(p=>p.id===id),next=index+dir;if(index<0||next<0||next>=slides.length)return;try{await Promise.all([InkData.saveSitePhoto({...slides[index],sortOrder:slides[next].sortOrder}),InkData.saveSitePhoto({...slides[next],sortOrder:slides[index].sortOrder})]);await loadData();render()}catch(error){alert(`排序失敗：${error.message}`)}};
window.removePhoto=async id=>{if(!confirm('確定要移除這張照片嗎？'))return;try{await InkData.deleteSitePhoto(id);await loadData();render()}catch(error){alert(`刪除失敗：${error.message}`)}};
