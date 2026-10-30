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

/* ---------- home ---------- */
let wOff = 0, selDay = null;
function renderHome(){
  greet();
  const h = hist(), st = N.getState().stats || {};
  const week = weekOf(0);
  const done = week.filter(d => secsOn(h, d) > 0).length;
  $('heroDays').textContent = done;
  $('heroRing').style.strokeDashoffset = 251.3 * (1 - done/7);
  const wkMin = week.reduce((a, d) => a + minsOn(h, d), 0);
  $('heroTitle').textContent = done ? `Bu hafta ${done} gün nefes aldın` : 'Haftaya nefesle başla';
  $('heroSub').textContent = done ? `Toplam ${wkMin} dakika. Hedef her gün 10 dakika.` : 'Günde birkaç dakika yeter. İlk egzersizini aşağıdan seç.';
  $('homeToday').innerHTML = `${Math.floor((st.todaySec || 0)/60)} <small>dk</small>`;
  $('homeStreak').innerHTML = `${streak(h)} <small>gün</small>`;
  renderStrip7(); renderExercises(); renderHomeNext();
}
function renderStrip7(){
  const h = hist(), days = weekOf(wOff);
  const mid = days[3];
  $('weekTitle').textContent = `${MONTHS[mid.getMonth()]} ${mid.getFullYear()}`;
  $('wNext').disabled = wOff >= 0;
  $('days7').innerHTML = days.map((d, i) => {
    const cls = [secsOn(h, d) > 0 ? 'done' : '', isToday(d) ? 'today' : '', selDay === iso(d) ? 'sel' : ''].join(' ');
    return `<button class="${cls}" data-d="${iso(d)}" aria-label="${d.getDate()} ${MONTHS[d.getMonth()]}, ${minsOn(h, d)} dakika"><small>${DAY_SHORT[i]}</small><b>${String(d.getDate()).padStart(2,'0')}</b><i></i></button>`;
  }).join('');
  const sd = selDay ? days.find(d => iso(d) === selDay) : null;
  $('dayInfo').textContent = sd ? `${sd.getDate()} ${MONTHS[sd.getMonth()]}: ${minsOn(h, sd)} dakika egzersiz` : 'Yeşil nokta egzersiz yaptığın günleri gösterir.';
}
$('days7').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; selDay = selDay === b.dataset.d ? null : b.dataset.d; renderStrip7() });
$('wPrev').addEventListener('click', () => { wOff--; selDay = null; renderStrip7() });
$('wNext').addEventListener('click', () => { if(wOff < 0){ wOff++; selDay = null; renderStrip7() } });

function renderExercises(){
  const c = N.getCfg();
  const list = N.getPresets();
  $('exList').innerHTML = list.map(p => {
    const active = ['inhale','hold','exhale','hold2'].every(k => p.cfg[k] === c[k]);
    const len = (p.cfg.inhale + p.cfg.hold + p.cfg.exhale + p.cfg.hold2) * c.rounds;
    return `<button class="ex${active ? ' active' : ''}" data-id="${esc(p.id)}">
      <span class="e-txt"><b>${esc(p.name)}</b>
        <span class="meta"><span class="pill num">${esc(patt(p.cfg))}</span><span class="num">${c.rounds} tur · ${fmtLen(len)} dk</span></span>
      </span>
      <span class="go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg></span>
    </button>`;
  }).join('');
}
$('exList').addEventListener('click', e => {
  const b = e.target.closest('.ex'); if(!b) return;
  if(N.isRunning()){ location.hash = '#nefes'; return }
  N.applyPreset(b.dataset.id);
  location.hash = '#nefes';
  N.start();
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
document.addEventListener('nefes:cfg', () => { if(document.body.dataset.screen === 'ana') renderExercises() });
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
