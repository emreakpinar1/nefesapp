/* ---------- ekranlar, ana sayfa ve istatistik (çekirdek mantık yukarıdaki betikte) ---------- */
(() => {
const $ = id => document.getElementById(id);
const N = window.__nefes;
const LANG = ['en','ar'].includes(window.nefesLang) ? window.nefesLang : 'tr';
const T3 = (tr, en, ar) => LANG === 'en' ? en : LANG === 'ar' ? ar : tr;
const DAY_SHORT = T3(['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'], ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], ['الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد']);
const MONTHS = T3(['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'], ['January','February','March','April','May','June','July','August','September','October','November','December'], ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']);
let GOAL_MIN = 10;
const DEF = window.NEFES_DEFAULTS;
let REMOTE = {};
try{ REMOTE = JSON.parse(localStorage.getItem('nefes-remote') || '{}') || {} }catch(e){}
const iso = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hist = () => (N.getState().hist) || {};
const minsOn = (h, d) => Math.round(((h[iso(d)] || 0)) / 60);
const secsOn = (h, d) => h[iso(d)] || 0;

function weekOf(offset){
  const t = new Date(); t.setHours(0,0,0,0);
  const mon = new Date(t); mon.setDate(t.getDate() - ((t.getDay() + 6) % 7) + offset*7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d });
}
function streak(h){
  const d = new Date(); d.setHours(0,0,0,0);
  if(!secsOn(h, d)) d.setDate(d.getDate() - 1);
  let n = 0;
  while(secsOn(h, d) > 0){ n++; d.setDate(d.getDate() - 1) }
  return n;
}
const isToday = d => iso(d) === iso(new Date());
const fmtLen = s => Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
const patt = c => [c.inhale, c.hold, c.exhale, c.hold2].filter((v,i) => v || i % 2 === 0).join(' · ');

/* ---------- routing ---------- */
const VIEWS = ['ana','istatistik','nefes','hatirlatici','profil','premium'];
function route(){
  const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'ana';
  document.querySelectorAll('section.view[data-view]').forEach(s => s.hidden = s.dataset.view !== v);
  document.querySelectorAll('[data-nav]').forEach(a => { a.classList.toggle('active', a.dataset.nav === v); if(a.dataset.nav === v) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current') });
  document.body.dataset.screen = v;
  ['exSheet','infoSheet'].forEach(id => { const s = $(id); if(s && !s.hidden){ s.hidden = true; document.body.style.overflow = '' } });
  if(v === 'nefes') renderSessName();
  const box = $('sessionBox');
  if(v === 'ana'){ $('homeSlot').appendChild(box); box.classList.add('compact') }
  else if(box.parentNode !== $('nefesSlot')){ $('nefesSlot').appendChild(box); box.classList.remove('compact') }
  window.scrollTo(0, 0);
  if(v === 'ana'){ renderHome(); renderAccess() }
  if(v === 'istatistik') renderWeek();
  if(v === 'premium') renderPaywall();
  if(v === 'profil') renderAccess();
}
addEventListener('hashchange', route);
$('navNefes').addEventListener('click', e => {
  if(document.body.dataset.screen === 'nefes'){ e.preventDefault(); $('playBtn').click() }
});

/* ---------- greeting ---------- */
function greet(){
  const h = new Date().getHours();
  $('topHello').textContent = h < 6 ? 'İyi geceler' : h < 12 ? 'Günaydın' : h < 18 ? 'İyi günler' : 'İyi akşamlar';
}

/* ---------- egzersiz açıklamaları ---------- */
const INFO = DEF.info;
function infoFor(p){
  if(p && (p.short || p.desc)) return { short: p.short || '', desc: p.desc || (INFO[p.id] || {}).desc || '' };
  if(p && INFO[p.id] && LANG === 'tr') return INFO[p.id];
  const c = p ? p.cfg : N.getCfg();
  const calming = c.exhale > c.inhale;
  return {
    short: T3(calming ? 'Uzun nefes verme ile sakinleşme' : 'Dengeli ritimle odaklanma', calming ? 'Calm down with a long exhale' : 'Focus with an even rhythm', calming ? 'الهدوء بزفير طويل' : 'التركيز بإيقاع متوازن'),
    desc: calming
      ? T3('Bu düzende nefes verme, nefes almaktan uzun. Uzun nefes verme kalp atışını yavaşlatır ve vücudu dinlenme moduna geçirir; gerginlik ve kaygı anlarında iyi gelir.',
           'In this pattern the exhale is longer than the inhale. A long exhale slows the heart and shifts the body into rest mode; it helps in tense and anxious moments.',
           'في هذا النمط يكون الزفير أطول من الشهيق. الزفير الطويل يبطئ ضربات القلب وينقل الجسم إلى وضع الراحة، ويفيد في لحظات التوتر والقلق.')
      : T3('Bu düzende nefes alma ve verme birbirine yakın. Eşit ritim zihni sabitler ve dikkati toplamaya yardım eder. Daha fazla sakinleşmek istersen nefes verme süresini uzatabilirsin.',
           'In this pattern the inhale and exhale are close in length. An even rhythm steadies the mind and helps you focus. Lengthen the exhale if you want to calm down more.',
           'في هذا النمط يتقارب طول الشهيق والزفير. الإيقاع المتوازن يثبّت الذهن ويساعد على التركيز. يمكنك إطالة الزفير إذا أردت مزيدًا من الهدوء.'),
  };
}
function currentPreset(){
  const c = N.getCfg();
  return N.getPresets().find(p => ['inhale','hold','exhale','hold2'].every(k => p.cfg[k] === c[k])) || null;
}
function renderInfo(){
  const p = currentPreset(), inf = infoFor(p);
  $('infoTitle').textContent = p ? `${p.name} ne işe yarar?` : 'Bu düzen ne işe yarar?';
  $('infoText').textContent = inf.desc;
  $('sessTag').textContent = inf.short;
}
/* faydalar sayfası */
let lastFocus = null;
function openSheet(){ lastFocus = document.activeElement; $('infoSheet').hidden = false; document.body.style.overflow = 'hidden'; $('sheetClose').focus() }
function closeSheet(){ $('infoSheet').hidden = true; document.body.style.overflow = ''; if(lastFocus) lastFocus.focus() }
document.addEventListener('click', e => { if(e.target.closest('[data-open-info]')) openSheet() });
$('sheetClose').addEventListener('click', closeSheet);
$('infoSheet').addEventListener('click', e => { if(e.target === $('infoSheet')) closeSheet() });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && !$('infoSheet').hidden) closeSheet() });

/* ---------- home ---------- */
function renderHome(){ greet(); renderExercises(); renderHomeNext(); renderSessName() }
function renderSessName(){
  const p = currentPreset();
  $('sessName').textContent = p ? p.name : 'Özel düzen';
  renderInfo();
}

const GRIP = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
let catSel = 'all';
function renderCats(list){
  const present = new Set(list.map(p => p.cat));
  const cats = (window.NEFES_CATEGORIES || []).filter(c => present.has(c.id));
  if(catSel !== 'all' && !present.has(catSel)) catSel = 'all';
  $('cats').hidden = cats.length < 2;
  $('cats').innerHTML = `<button data-c="all" aria-pressed="${catSel === 'all'}">${T3('Tümü', 'All', 'الكل')}</button>` +
    cats.map(c => `<button data-c="${c.id}" aria-pressed="${catSel === c.id}" data-no-i18n>${esc(T3(c.tr, c.en, c.ar || c.en))}</button>`).join('');
}
$('cats').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; catSel = b.dataset.c; renderExercises() });
function renderExercises(){
  if(drag) return;
  const c = N.getCfg(), all = N.getPresets();
  renderCats(all);
  const list = catSel === 'all' ? all : all.filter(p => p.cat === catSel);
  $('exList').innerHTML = list.map(p => {
    const active = ['inhale','hold','exhale','hold2'].every(k => p.cfg[k] === c[k]);
    const locked = window.__nefesLocked(p);
    const len = (p.cfg.inhale + p.cfg.hold + p.cfg.exhale + p.cfg.hold2) * c.rounds;
    return `<div class="ex${active ? ' active' : ''}${locked ? ' locked' : ''}${catSel !== 'all' ? ' nodrag' : ''}" data-id="${esc(p.id)}">
      <button class="grip" aria-label="${esc(p.name)} sırasını değiştir (yukarı/aşağı ok tuşları)">${GRIP}</button>
      <button class="e-main" aria-label="${esc(p.name)}: süreleri ayarla">
        <span class="e-txt"><b data-no-i18n>${esc(p.name)}</b><span class="short" data-no-i18n>${esc(infoFor(p).short)}</span>
          <span class="meta"><span class="pill num">${esc(patt(p.cfg))}</span>${p.custom ? '<span class="badge">Düzenlendi</span>' : ''}${locked ? `<span class="lock">${LOCK}Premium</span>` : ''}<span class="num">${c.rounds} tur · ${fmtLen(len)} dk</span></span>
        </span>
      </button>
      <button class="go" data-act="select" aria-pressed="${active}" aria-label="${esc(p.name)} egzersizini seç" ${N.isRunning() ? 'disabled' : ''}>${active ? CHECK : (locked ? LOCK : '')}</button>
    </div>`;
  }).join('');
}
$('exList').addEventListener('click', e => {
  const s = e.target.closest('[data-act="select"]');
  if(s && !justDragged){
    if(N.isRunning()) return;
    const sp = N.getPresets().find(x => x.id === s.closest('.ex').dataset.id);
    if(sp && window.__nefesLocked(sp)){ location.hash = '#premium'; return }
    N.applyPreset(s.closest('.ex').dataset.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const b = e.target.closest('.e-main'); if(!b || justDragged) return;
  const bp = N.getPresets().find(x => x.id === b.closest('.ex').dataset.id);
  if(bp && window.__nefesLocked(bp)){ location.hash = '#premium'; return }
  openEx(b.closest('.ex').dataset.id);
});

/* egzersiz penceresi: süreleri ayarla, seç, başlat */
const EXF = [
  ['inhale','Nefes al','Burundan yavaşça',1,30,'sn'],
  ['hold','Nefes tut','Ciğerler dolu',0,30,'sn'],
  ['exhale','Nefes ver','Ağızdan, uzun',1,30,'sn'],
  ['hold2','Bekle','Ciğerler boş (0 = kapalı)',0,30,'sn'],
  ['rounds','Tur sayısı','Kaç döngü yapılacak',1,50,''],
];
let exD = null, exLast = null;
function openEx(id){
  const p = N.getPresets().find(x => x.id === id); if(!p) return;
  exD = { id, name: p.name, base: p.base, ...p.cfg, rounds: N.getCfg().rounds };
  $('exT').textContent = p.name;
  const inf = infoFor(p);
  $('exShort').textContent = inf.short; $('exDesc').textContent = inf.desc;
  renderExSheet();
  exLast = document.activeElement;
  $('exSheet').hidden = false; document.body.style.overflow = 'hidden';
  $('exClose').focus();
}
function closeEx(){ $('exSheet').hidden = true; document.body.style.overflow = ''; exD = null; if(exLast) exLast.focus() }
function renderExSheet(){
  const d = exD, running = N.isRunning();
  const cyc = d.inhale + d.hold + d.exhale + d.hold2;
  $('exPat').textContent = patt(d);
  $('exCycle').textContent = cyc + ' sn';
  $('exTotal').textContent = fmtLen(cyc * d.rounds) + ' dk';
  $('exRows').innerHTML = EXF.map(([k, lab, sub, , , unit]) => `
    <div class="row">
      <div class="lab"><b>${lab}</b><small>${sub}</small></div>
      <div class="stepper">
        <button data-k="${k}" data-d="-1" aria-label="${lab} azalt" ${running ? 'disabled' : ''}>−</button>
        <output>${d[k]}${unit ? ' ' + unit : ''}</output>
        <button data-k="${k}" data-d="1" aria-label="${lab} artır" ${running ? 'disabled' : ''}>+</button>
      </div>
    </div>`).join('');
  const changed = ['inhale','hold','exhale','hold2'].some(k => d[k] !== d.base[k]);
  $('exReset').hidden = !changed || running;
  $('exRunNote').hidden = !running;
  $('exSelect').disabled = running; $('exStart').disabled = running;
}
$('exRows').addEventListener('click', e => {
  const b = e.target.closest('button[data-k]'); if(!b || !exD) return;
  const f = EXF.find(x => x[0] === b.dataset.k);
  const v = Math.max(f[3], Math.min(f[4], exD[f[0]] + Number(b.dataset.d)));
  exD[f[0]] = v; renderExSheet();
});
$('exReset').addEventListener('click', () => { Object.assign(exD, exD.base); renderExSheet() });
function saveEx(){
  const d = exD;
  const changed = ['inhale','hold','exhale','hold2'].some(k => d[k] !== d.base[k]);
  N.setCustom(d.id, changed ? d : null);
  N.setRounds(d.rounds);
  N.applyPreset(d.id);
}
$('exSelect').addEventListener('click', () => { saveEx(); closeEx(); window.scrollTo({ top: 0, behavior: 'smooth' }); toast2('Egzersiz seçildi') });
$('exStart').addEventListener('click', () => { saveEx(); closeEx(); window.scrollTo({ top: 0, behavior: 'smooth' }); N.start() });
$('exClose').addEventListener('click', closeEx);
$('exSheet').addEventListener('click', e => { if(e.target === $('exSheet')) closeEx() });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && !$('exSheet').hidden) closeEx() });
let t2; function toast2(m){ const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(t2); t2 = setTimeout(() => t.hidden = true, 2000) }

/* sürükleyerek sıralama (dokunmatik ve fare) */
let drag = null, justDragged = false;
const ids = () => [...$('exList').querySelectorAll('.ex')].map(x => x.dataset.id);
function saveOrder(list){ N.setOrder(list); renderExercises() }
$('exList').addEventListener('pointerdown', e => {
  const g = e.target.closest('.grip'); if(!g || catSel !== 'all') return;
  e.preventDefault();
  const item = g.closest('.ex'), items = [...$('exList').querySelectorAll('.ex')];
  const r = item.getBoundingClientRect();
  drag = { item, items, idx: items.indexOf(item), t: items.indexOf(item), y0: e.clientY, step: r.height + 10, moved: false };
  item.classList.add('dragging'); document.body.classList.add('dragging-list');
  try{ g.setPointerCapture(e.pointerId) }catch(err){}
});
$('exList').addEventListener('pointermove', e => {
  if(!drag) return;
  const dy = e.clientY - drag.y0;
  if(Math.abs(dy) > 4) drag.moved = true;
  const n = drag.items.length;
  const min = -drag.idx * drag.step, max = (n - 1 - drag.idx) * drag.step;
  const cy = Math.max(min - 12, Math.min(max + 12, dy));
  drag.item.style.transform = `translateY(${cy}px)`;
  const t = Math.max(0, Math.min(n - 1, drag.idx + Math.round(cy / drag.step)));
  drag.t = t;
  drag.items.forEach((it, i) => {
    if(it === drag.item) return;
    const shift = (i > drag.idx && i <= t) ? -drag.step : (i < drag.idx && i >= t) ? drag.step : 0;
    it.style.transform = shift ? `translateY(${shift}px)` : '';
  });
});
function endDrag(){
  if(!drag) return;
  const { idx, t, moved, items } = drag;
  items.forEach(it => { it.style.transform = ''; it.classList.remove('dragging') });
  document.body.classList.remove('dragging-list');
  drag = null;
  if(moved){ justDragged = true; setTimeout(() => justDragged = false, 50) }
  if(t !== idx){
    const list = ids(); const [m] = list.splice(idx, 1); list.splice(t, 0, m);
    saveOrder(list);
  }
}
$('exList').addEventListener('pointerup', endDrag);
$('exList').addEventListener('pointercancel', endDrag);
$('exList').addEventListener('keydown', e => {
  const g = e.target.closest('.grip'); if(!g || !['ArrowUp','ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  const list = ids(), id = g.closest('.ex').dataset.id, i = list.indexOf(id), t = i + (e.key === 'ArrowUp' ? -1 : 1);
  if(t < 0 || t >= list.length) return;
  list.splice(i, 1); list.splice(t, 0, id);
  saveOrder(list);
  $('exList').querySelector(`.ex[data-id="${CSS.escape(id)}"] .grip`).focus();
});

function renderHomeNext(){
  const n = N.getNext();
  $('homeNextK').textContent = n.on ? n.k : 'Hatırlatıcı kapalı';
  $('homeNextV').textContent = n.on ? n.v : 'Gün içinde hatırlatma kur';
  $('bellDot').hidden = !n.on;
}

/* ---------- stats ---------- */
let sOff = 0;
function renderWeek(){
  const h = hist(), days = weekOf(sOff);
  const vals = days.map(d => minsOn(h, d));
  const total = vals.reduce((a, b) => a + b, 0);
  $('sTotal').textContent = total;
  $('sNext').disabled = sOff >= 0;
  const a = days[0], z = days[6];
  $('sWeekTitle').textContent = sOff === 0 ? 'Bu hafta' : sOff === -1 ? 'Geçen hafta' : `${a.getDate()} ${MONTHS[a.getMonth()].slice(0,3)} – ${z.getDate()} ${MONTHS[z.getMonth()].slice(0,3)}`;
  const scale = Math.max(GOAL_MIN, ...vals) * 1.12;
  $('bars').innerHTML = days.map((d, i) => {
    const v = vals[i], pct = Math.round(v / GOAL_MIN * 100);
    return `<div class="bar-col${isToday(d) ? ' today' : ''}" title="${DAY_SHORT[i]} ${d.getDate()} ${MONTHS[d.getMonth()]}: ${v} dk">
      <div class="track"><span class="pct" style="bottom:calc(${(Math.max(v, GOAL_MIN)/scale*100).toFixed(1)}% + 6px)">${v ? pct + '%' : ''}</span><span class="goal" style="height:${(GOAL_MIN/scale*100).toFixed(1)}%"></span><span class="val" style="height:${(v/scale*100).toFixed(1)}%"></span></div>
      <small>${DAY_SHORT[i]}</small>
    </div>`;
  }).join('');
  $('bars').setAttribute('aria-label', `${$('sWeekTitle').textContent}: ` + days.map((d, i) => `${DAY_SHORT[i]} ${vals[i]} dakika`).join(', '));
  $('sStreak').innerHTML = `${streak(h)}<small> gün</small>`;
  const weeks = [0,-1,-2,-3].map(o => weekOf(o).reduce((s, d) => s + minsOn(h, d), 0));
  $('sAvg').textContent = `Son 4 haftada ortalama ${Math.round(weeks.reduce((s, x) => s + x, 0) / 4)} dk/hafta`;
}
$('sPrev').addEventListener('click', () => { sOff--; renderWeek() });
$('sNext').addEventListener('click', () => { if(sOff < 0){ sOff++; renderWeek() } });

/* ---------- events from core ---------- */
const refresh = () => { const v = document.body.dataset.screen; if(v === 'ana') renderHome(); if(v === 'istatistik') renderWeek() };
document.addEventListener('nefes:stats', refresh);
document.addEventListener('nefes:cfg', () => { renderSessName(); if(document.body.dataset.screen === 'ana') renderExercises() });
document.addEventListener('nefes:rem', () => { if(document.body.dataset.screen === 'ana') renderHomeNext(); else $('bellDot').hidden = !N.getNext().on });
document.addEventListener('nefes:play', () => { document.body.classList.toggle('running', N.isRunning()); if(document.body.dataset.screen === 'ana') renderExercises() });

/* ---------- theme ---------- */
const mq = matchMedia('(prefers-color-scheme: dark)');
function applyTheme(p){
  const dark = p === 'dark' || (p === 'system' && mq.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.pref = p;
  const tc = document.getElementById('themeColor'); if(tc) tc.content = dark ? '#0F110E' : '#F1F3EE';
  document.querySelectorAll('#themeSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === p));
  if(typeof applyLook === 'function') applyLook();
}
$('themeSeg').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  try{ localStorage.setItem('nefes-theme', b.dataset.t) }catch(err){}
  applyTheme(b.dataset.t);
});
mq.addEventListener('change', () => { if(document.documentElement.dataset.pref === 'system') applyTheme('system') });
applyTheme(document.documentElement.dataset.pref || 'light');

/* ---------- abonelik: deneme, premium, planlar ---------- */
try{ if(!window.__nefesEnt) window.__nefesEnt = JSON.parse(localStorage.getItem('nefes-ent') || 'null') }catch(e){}
const bill = () => { const b = REMOTE.billing || {}, d = DEF.billing; return { trialDays: +b.trialDays || d.trialDays, TRY: { ...d.TRY, ...(b.TRY || {}) }, USD: { ...d.USD, ...(b.USD || {}) } } };
function trialStart(){ let t = +N.getOpt('trialStart'); if(!t){ t = Date.now(); N.setOpt('trialStart', t) } return t }
function trialLeft(){ return Math.max(0, Math.ceil((trialStart() + bill().trialDays * 864e5 - Date.now()) / 864e5)) }
function isPremium(){ const e = window.__nefesEnt; return !!(e && e.plan && (e.plan === 'lifetime' || !e.until || e.until > Date.now())) }
function hasAccess(){ return isPremium() || trialLeft() > 0 }
window.__nefesLocked = p => !!p && !hasAccess();
window.__nefesNoAccess = () => !hasAccess();
window.__nefesPaywall = () => { location.hash = '#premium' };
const cur = () => LANG === 'tr' ? 'TRY' : 'USD';
const money = v => new Intl.NumberFormat(LANG === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: cur(), maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);
let plan = 'yearly';
function renderAccess(){
  const prem = isPremium(), left = trialLeft();
  const txt = prem ? T3('Premium üyesin', "You're a Premium member", 'أنت مشترك في Premium')
    : left > 0 ? T3(`Ücretsiz deneme · ${left} gün kaldı`, `Free trial · ${left} days left`, `تجربة مجانية · متبقٍ ${left} يومًا`)
    : T3('Deneme süren bitti', 'Your trial has ended', 'انتهت الفترة التجريبية');
  $('premState').textContent = txt; $('premState').setAttribute('data-no-i18n', '');
  $('premBtn').textContent = prem ? T3('Ayrıntılar', 'Details', 'التفاصيل') : T3('Planları gör', 'See plans', 'عرض الخطط');
  const chip = $('trialChip');
  chip.hidden = prem;
  chip.setAttribute('data-no-i18n', '');
  chip.textContent = left > 0 ? T3(`Deneme: ${left} gün kaldı`, `Trial: ${left} days left`, `التجربة: متبقٍ ${left} يومًا`) : T3("Premium'a geç", 'Go Premium', 'اشترك في Premium');
}
function renderPaywall(){
  const b = bill(), P = b[cur()], prem = isPremium(), left = trialLeft();
  const save = Math.max(0, Math.round((1 - P.yearly / (P.monthly * 12)) * 100));
  const years = Math.round(P.lifetime / P.yearly * 10) / 10;
  $('pwStatus').textContent = prem ? T3('Premium aktif', 'Premium active', 'Premium مفعّل') : left > 0 ? T3(`Ücretsiz deneme · ${left} gün kaldı`, `Free trial · ${left} days left`, `تجربة مجانية · متبقٍ ${left} يومًا`) : T3('Deneme bitti', 'Trial ended', 'انتهت التجربة');
  $('pwStatus').setAttribute('data-no-i18n', '');
  const plans = [
    { id: 'monthly', name: T3('Aylık', 'Monthly', 'شهري'), sub: T3('İstediğin zaman iptal', 'Cancel anytime', 'إلغاء في أي وقت'), price: money(P.monthly), per: T3('/ ay', '/ month', '/ شهر') },
    { id: 'yearly', name: T3('Yıllık', 'Yearly', 'سنوي'), sub: T3(`Ayda ${money(P.yearly / 12)} · %${save} tasarruf`, `${money(P.yearly / 12)} per month · save ${save}%`, `${money(P.yearly / 12)} شهريًا · وفّر ${save}%`), price: money(P.yearly), per: T3('/ yıl', '/ year', '/ سنة'), tag: T3('En popüler', 'Most popular', 'الأكثر شيوعًا') },
    { id: 'lifetime', name: T3('Ömür boyu', 'Lifetime', 'مدى الحياة'), sub: T3('Tek ödeme, abonelik yok', 'One payment, no subscription', 'دفعة واحدة، بلا اشتراك'), price: money(P.lifetime), per: T3('tek seferlik', 'one-time', 'مرة واحدة'), tag: T3('En avantajlı', 'Best value', 'الأفضل قيمة'), alt: true },
  ];
  $('plans').innerHTML = plans.map(p => `<button class="plan" role="radio" data-p="${p.id}" aria-checked="${plan === p.id}" data-no-i18n>
      ${p.tag ? `<span class="tag${p.alt ? ' alt' : ''}">${p.tag}</span>` : ''}
      <span class="radio"></span>
      <span class="p-txt"><b>${p.name}</b><small>${p.sub}</small></span>
      <span class="price">${p.price}<small>${p.per}</small></span>
    </button>`).join('');
  $('pwBuy').textContent = prem ? T3('Zaten Premium üyesin', 'You already have Premium', 'لديك Premium بالفعل') : plan === 'lifetime' ? T3('Satın al', 'Buy', 'شراء') : T3('Abone ol', 'Subscribe', 'اشترك');
  $('pwBuy').disabled = prem;
  const total = N.getPresets().length;
  $('pwFree').textContent = prem ? '' : left > 0
    ? T3(`Deneme süresince ${total} egzersizin hepsi açık. Deneme bitince egzersizlere devam etmek için bir plan gerekir.`, `All ${total} exercises are open during your trial. After it ends, a plan is needed to keep breathing with Ferah.`, `جميع التمارين الـ${total} متاحة خلال الفترة التجريبية. بعد انتهائها تحتاج إلى خطة لمواصلة التنفس مع Ferah.`)
    : T3(`Deneme süren bitti. ${total} egzersizin kilidini açmak için bir plan seç.`, `Your trial has ended. Choose a plan to unlock all ${total} exercises.`, `انتهت الفترة التجريبية. اختر خطة لفتح جميع التمارين الـ${total}.`);
  $('pwFree').setAttribute('data-no-i18n', '');
}
$('plans').addEventListener('click', e => { const b = e.target.closest('.plan'); if(b){ plan = b.dataset.p; renderPaywall() } });
$('pwBuy').addEventListener('click', () => toast2(T3("Satın alma, uygulama Google Play ve App Store'da yayınlandığında açılacak.", 'Purchases will open when the app launches on Google Play and the App Store.', 'سيتاح الشراء عند إطلاق التطبيق على Google Play وApp Store.')));
function accessChanged(){ renderAccess(); N.rerender(); refresh(); if(document.body.dataset.screen === 'premium') renderPaywall() }
document.addEventListener('nefes:ent', accessChanged);
setInterval(renderAccess, 60 * 60 * 1000);

/* ---------- dil ---------- */
$('langCode').textContent = { tr: 'TR', en: 'EN', ar: 'ع' }[LANG];
$('langBtn').addEventListener('click', e => { e.stopPropagation(); $('langMenu').hidden = !$('langMenu').hidden });
$('langMenu').addEventListener('click', e => { const b = e.target.closest('button[data-l]'); if(b && b.dataset.l !== LANG) window.nefesSetLang(b.dataset.l); $('langMenu').hidden = true });
document.addEventListener('click', e => { if(!e.target.closest('#langMenu')) $('langMenu').hidden = true });
document.querySelectorAll('#langMenu button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === LANG));

/* ---------- panelden gelen içerik ve görünüm ---------- */
function shade(hex, f){
  const n = parseInt(String(hex).replace('#',''), 16); if(isNaN(n)) return hex;
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f));
  return '#' + ch.map(c => c.toString(16).padStart(2, '0')).join('');
}
function applyLook(){
  const look = nefesMerge(DEF.look, REMOTE.look), r = document.documentElement, dark = r.dataset.theme === 'dark';
  if(REMOTE.look && (REMOTE.look.breath || REMOTE.look.accent)){
    const b = dark ? shade(look.breath, -.35) : look.breath;
    r.style.setProperty('--breath-bg', `linear-gradient(160deg, ${b} 0%, ${shade(b, -.28)} 100%)`);
    r.style.setProperty('--green', dark ? shade(look.accent, .2) : look.accent);
    r.style.setProperty('--green-strong', dark ? shade(look.accent, .35) : shade(look.accent, -.32));
  }else{ ['--breath-bg','--green','--green-strong'].forEach(v => r.style.removeProperty(v)) }
}
function applyRemote(c){
  REMOTE = c || {};
  const ct = LANG === 'en' ? nefesMerge(DEF.content_en, REMOTE.content_en) : LANG === 'ar' ? nefesMerge(DEF.content_ar, REMOTE.content_ar) : nefesMerge(DEF.content, REMOTE.content);
  $('homeTitle').textContent = ct.homeTitle;
  $('homeHint').textContent = ct.homeHint;
  $('learnTitle').textContent = ct.benefitsTitle;
  $('sheetT').textContent = ct.benefitsTitle;
  $('sheetBody').innerHTML = nefesMd(ct.benefits) + (ct.warning ? `<div class="warn">${nefesMd(ct.warning)}</div>` : '') + (ct.sources ? `<div class="src">${nefesMd(ct.sources)}</div>` : '');
  GOAL_MIN = Math.max(1, Math.min(120, +(nefesMerge(DEF.goal, REMOTE.goal).dailyMin) || 10));
  window.__nefesGoal = GOAL_MIN;
  $('goalTxt').textContent = `Günlük hedef ${GOAL_MIN} dakika`;
  $('weekGoal').textContent = `${GOAL_MIN * 7} dk`;
  $('legendGoal').textContent = `Günlük hedef (${GOAL_MIN} dk)`;
  let userTheme = null; try{ userTheme = localStorage.getItem('nefes-theme') }catch(e){}
  if(!userTheme){ const t = nefesMerge(DEF.look, REMOTE.look).theme; applyTheme(['light','dark','system'].includes(t) ? t : 'light') }
  applyLook();
  refresh(); renderSessName();
}
document.addEventListener('nefes:remote', e => applyRemote(e.detail));
applyRemote(REMOTE);
N.rerender();

route();
})();
