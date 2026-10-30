/* ---------- ekranlar, ana sayfa ve istatistik (çekirdek mantık yukarıdaki betikte) ---------- */
(() => {
const $ = id => document.getElementById(id);
const N = window.__nefes;
const DAY_SHORT = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GOAL_MIN = 10;
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
const VIEWS = ['ana','istatistik','nefes','hatirlatici','profil'];
function route(){
  const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'ana';
  document.querySelectorAll('section.view[data-view]').forEach(s => s.hidden = s.dataset.view !== v);
  document.querySelectorAll('[data-nav]').forEach(a => { a.classList.toggle('active', a.dataset.nav === v); if(a.dataset.nav === v) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current') });
  document.body.dataset.screen = v;
  if(v === 'nefes') renderSessName();
  const box = $('sessionBox');
  if(v === 'ana'){ $('homeSlot').appendChild(box); box.classList.add('compact') }
  else if(box.parentNode !== $('nefesSlot')){ $('nefesSlot').appendChild(box); box.classList.remove('compact') }
  window.scrollTo(0, 0);
  if(v === 'ana') renderHome();
  if(v === 'istatistik') renderWeek();
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
const INFO = {
  '478': { short: 'Uykuya geçiş ve derin gevşeme',
    desc: 'Dr. Andrew Weil\'in yaygınlaştırdığı 4-7-8 tekniği. Uzun nefes tutma ve ondan da uzun nefes verme, kalp atışını yavaşlatıp vücudu dinlenme moduna geçirir. Yatmadan önce ya da gergin anlarda kullanılır. Bilimsel kanıtlar küçük çalışmalara dayanıyor ama sonuçlar kalp hızı ve kaygıda azalma yönünde.' },
  'box': { short: 'Odaklanma ve baskı altında sakin kalma',
    desc: 'Kutu nefesi: al, tut, ver, bekle; hepsi eşit sürede. Sporcular, pilotlar ve askerler stresli anlarda dikkatini toplamak için kullanır. Eşit ritim zihni sabitler, dağınık düşünceleri toparlamaya yardım eder.' },
  'calm': { short: 'Gün içinde birkaç dakikalık hızlı rahatlama',
    desc: 'Nefes vermenin almaktan uzun olduğu kısa bir düzen. Uzun nefes verme, vücudun sakinleşme tepkisini en güçlü tetikleyen unsurlardan biri. Toplantı öncesi ya da yoğun bir anda birkaç tur yeterli.' },
  'bal': { short: 'Kalp ritmini dengeleyen rezonans nefesi',
    desc: 'Beş saniye al, beş saniye ver: dakikada 6 nefes. Araştırmalarda en çok çalışılan ritim bu. Düzenli yapıldığında kalp hızı değişkenliğini (vücudun strese uyum yeteneğinin göstergesi) artırdığı, bazı çalışmalarda tansiyona olumlu etki ettiği görülmüş. Nefes tutma olmadığı için herkes için uygun.' },
  'deep': { short: 'Meditasyona hazırlık, uzun ve derin nefes',
    desc: 'Yavaş, derin ve uzun bir döngü. Nefes kapasitesini zorlamadan genişletir, meditasyon ya da esneme öncesinde zihni yavaşlatmak için iyi bir başlangıç. Tutma süreleri zor gelirse kısaltabilirsin.' },
};
function infoFor(p){
  if(p && (p.short || p.desc)) return { short: p.short || '', desc: p.desc || (INFO[p.id] || {}).desc || '' };
  if(p && INFO[p.id]) return INFO[p.id];
  const c = p ? p.cfg : N.getCfg();
  const calming = c.exhale > c.inhale;
  return {
    short: calming ? 'Uzun nefes verme ile sakinleşme' : 'Dengeli ritimle odaklanma',
    desc: calming
      ? 'Bu düzende nefes verme, nefes almaktan uzun. Uzun nefes verme kalp atışını yavaşlatır ve vücudu dinlenme moduna geçirir; gerginlik ve kaygı anlarında iyi gelir.'
      : 'Bu düzende nefes alma ve verme birbirine yakın. Eşit ritim zihni sabitler ve dikkati toplamaya yardım eder. Daha fazla sakinleşmek istersen nefes verme süresini uzatabilirsin.',
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
function renderExercises(){
  if(drag) return;
  const c = N.getCfg();
  $('exList').innerHTML = N.getPresets().map(p => {
    const active = ['inhale','hold','exhale','hold2'].every(k => p.cfg[k] === c[k]);
    const len = (p.cfg.inhale + p.cfg.hold + p.cfg.exhale + p.cfg.hold2) * c.rounds;
    return `<div class="ex${active ? ' active' : ''}" data-id="${esc(p.id)}">
      <button class="grip" aria-label="${esc(p.name)} sırasını değiştir (yukarı/aşağı ok tuşları)">${GRIP}</button>
      <button class="e-main" aria-pressed="${active}" aria-label="${esc(p.name)} egzersizini seç">
        <span class="e-txt"><b>${esc(p.name)}</b><span class="short">${esc(infoFor(p).short)}</span>
          <span class="meta"><span class="pill num">${esc(patt(p.cfg))}</span>${p.custom ? '<span class="badge">Düzenlendi</span>' : ''}<span class="num">${c.rounds} tur · ${fmtLen(len)} dk</span></span>
        </span>
        <span class="go" aria-hidden="true">${active ? CHECK : ''}</span>
      </button>
    </div>`;
  }).join('');
}
$('exList').addEventListener('click', e => {
  const b = e.target.closest('.e-main'); if(!b || justDragged) return;
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
  const g = e.target.closest('.grip'); if(!g) return;
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
document.addEventListener('nefes:play', () => document.body.classList.toggle('running', N.isRunning()));

/* ---------- theme ---------- */
const mq = matchMedia('(prefers-color-scheme: dark)');
function applyTheme(p){
  const dark = p === 'dark' || (p === 'system' && mq.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.pref = p;
  const tc = document.getElementById('themeColor'); if(tc) tc.content = dark ? '#0F110E' : '#F1F3EE';
  document.querySelectorAll('#themeSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === p));
}
$('themeSeg').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  try{ localStorage.setItem('nefes-theme', b.dataset.t) }catch(err){}
  applyTheme(b.dataset.t);
});
mq.addEventListener('change', () => { if(document.documentElement.dataset.pref === 'system') applyTheme('system') });
applyTheme(document.documentElement.dataset.pref || 'light');

route();
})();
