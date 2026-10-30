// NefesApp hesap ve eşitleme (Firebase Auth + Firestore)
import { firebaseConfig } from './firebase-config.js?v=8';

const $ = id => document.getElementById(id);
const panel = $('accPanel');
const hhmm = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const setStatus = t => { $('accStatus').textContent = t };
const setMsg = (t, bad) => { const m = $('accMsg'); m.textContent = t || ''; m.classList.toggle('bad', !!bad) };

const ERR = {
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/wrong-password': 'E-posta veya şifre hatalı.',
  'auth/user-not-found': 'Bu e-postayla kayıtlı hesap yok. Önce kayıt ol.',
  'auth/email-already-in-use': 'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/invalid-email': 'Geçerli bir e-posta adresi yaz.',
  'auth/missing-password': 'Şifreni yaz.',
  'auth/popup-closed-by-user': 'Google girişi yarıda kaldı.',
  'auth/cancelled-popup-request': 'Google girişi yarıda kaldı.',
  'auth/popup-blocked': 'Açılır pencere engellendi. E-posta ile giriş yapabilirsin.',
  'auth/operation-not-supported-in-this-environment': 'Bu ekranda Google girişi açılamıyor. E-posta ile giriş yapabilirsin.',
  'auth/unauthorized-domain': 'Bu adres Firebase\'de yetkili alan adı olarak eklenmemiş.',
  'auth/operation-not-allowed': 'Bu giriş yöntemi Firebase\'de açılmamış.',
  'auth/network-request-failed': 'İnternet bağlantısı yok. Bağlanınca tekrar dene.',
  'auth/too-many-requests': 'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.',
  'permission-denied': 'Veritabanı izinleri ayarlı değil.',
  'unavailable': 'Sunucuya ulaşılamıyor. Bağlantı gelince eşitlenecek.',
};
const trErr = e => ERR[e && e.code] || `Bir sorun oluştu (${(e && e.code) || 'bilinmiyor'}).`;

function mergeStats(l, r){
  if(!r) return l; if(!l) return r;
  return {
    date: l.date,
    todaySec: Math.max(l.todaySec || 0, r.date === l.date ? (r.todaySec || 0) : 0),
    sessions: Math.max(l.sessions || 0, r.sessions || 0),
    totalSec: Math.max(l.totalSec || 0, r.totalSec || 0),
  };
}

function mergeHist(l, r){
  const out = { ...(r || {}) };
  for(const [d, v] of Object.entries(l || {})) out[d] = Math.max(v || 0, out[d] || 0);
  return out;
}

if(firebaseConfig && panel && window.__nefes) init();

async function init(){
  const B = 'https://www.gstatic.com/firebasejs/10.12.2/';
  let A, AU, FS;
  panel.hidden = false;
  // Google, uygulama içi tarayıcılarda (WebView) girişe izin vermiyor; Android uygulamasında e-posta girişi kullanılır
  if(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()){
    $('gBtn').hidden = true;
    const or = panel.querySelector('.or'); if(or) or.hidden = true;
  }
  try{
    [A, AU, FS] = await Promise.all([import(B + 'firebase-app.js'), import(B + 'firebase-auth.js'), import(B + 'firebase-firestore.js')]);
  }catch(e){
    setMsg('Hesap sistemi yüklenemedi. İnternete bağlanınca sayfayı yenile.', true);
    $('accOut').hidden = true;
    return;
  }

  const app = A.initializeApp(firebaseConfig);
  const auth = AU.getAuth(app);
  auth.languageCode = 'tr';
  let db;
  try{ db = FS.initializeFirestore(app, { localCache: FS.persistentLocalCache({ tabManager: FS.persistentMultipleTabManager() }) }) }
  catch(e){ db = FS.getFirestore(app) }

  // Yönetim panelinden gelen hazır egzersizler, duyuru ve varsayılanlar (herkese açık)
  FS.onSnapshot(FS.doc(db, 'config', 'app'), s => { if(s.exists()) window.__nefes.setRemoteConfig(s.data()) }, () => {});

  let entUnsub = null;
  let ref = null, ready = false, unsub = null, timer = null, signup = false, me = null, isNew = false;

  async function push(){
    if(!ref) return;
    try{
      const data = {
        ...window.__nefes.getState(),
        profile: { email: (me && me.email) || '', name: (me && me.displayName) || '', photo: (me && me.photoURL) || '' },
        lastSeen: FS.serverTimestamp(), updatedAt: FS.serverTimestamp(),
      };
      if(isNew){ data.createdAt = FS.serverTimestamp(); isNew = false }
      await FS.setDoc(ref, data, { merge: true });
      setStatus('Eşitlendi · ' + hhmm());
    }catch(e){ setStatus('Kaydedilemedi'); setMsg(trErr(e), true) }
  }
  window.__nefesSync = () => {
    if(!ref || !ready) return;
    clearTimeout(timer); setStatus('Kaydediliyor…');
    timer = setTimeout(push, 1200);
  };
  function applyRemote(r){
    const l = window.__nefes.getState();
    window.__nefes.applyState({ cfg: r.cfg, opts: r.opts, rem: r.rem, stats: mergeStats(l.stats, r.stats), hist: mergeHist(l.hist, r.hist) });
  }

  function renderUser(u){
    $('accOut').hidden = !!u; $('accIn').hidden = !u;
    document.dispatchEvent(new CustomEvent('nefes:user', { detail: { signedIn: !!u } }));
    const al = $('adminLink'); if(al) al.hidden = !(u && u.email === 'emreakpinar46@gmail.com');
    const hello = $('topHello'), logo = $('topLogo');
    if(!u){
      $('topName').textContent = 'Misafir'; setStatus('');
      logo.innerHTML = logo.dataset.svg || logo.innerHTML;
      return;
    }
    const name = u.displayName || (u.email || '').split('@')[0] || 'Hoş geldin';
    $('accName').textContent = name;
    $('accMail').textContent = u.email || '';
    $('topName').textContent = name.split(' ')[0];
    const av = $('accAvatar');
    av.textContent = '';
    if(!logo.dataset.svg) logo.dataset.svg = logo.innerHTML;
    if(u.photoURL){
      const img = new Image(); img.src = u.photoURL; img.alt = ''; img.referrerPolicy = 'no-referrer';
      av.appendChild(img);
      const img2 = img.cloneNode(); logo.innerHTML = ''; logo.appendChild(img2);
    }else{
      av.textContent = name.charAt(0).toUpperCase();
      logo.innerHTML = logo.dataset.svg;
    }
  }

  AU.onAuthStateChanged(auth, async user => {
    if(unsub){ unsub(); unsub = null }
    if(entUnsub){ entUnsub(); entUnsub = null }
    if(!user){ window.__nefesEnt = null; try{ localStorage.removeItem('nefes-ent') }catch(e){} document.dispatchEvent(new Event('nefes:ent')) }
    ready = false; ref = null; me = user;
    renderUser(user);
    if(!user) return;
    setStatus('Eşitleniyor…');
    ref = FS.doc(db, 'users', user.uid);
    entUnsub = FS.onSnapshot(FS.doc(db, 'entitlements', user.uid), s => {
      const d = s.exists() ? s.data() : null;
      window.__nefesEnt = d ? { plan: d.plan, until: d.until && d.until.toMillis ? d.until.toMillis() : (d.until || null) } : null;
      try{ localStorage.setItem('nefes-ent', JSON.stringify(window.__nefesEnt)) }catch(e){}
      document.dispatchEvent(new Event('nefes:ent'));
    }, () => {});
    try{
      const snap = await FS.getDoc(ref);
      if(snap.exists()) applyRemote(snap.data()); else isNew = true;
      ready = true;
      await push();
      unsub = FS.onSnapshot(ref, s => {
        if(!s.exists() || s.metadata.hasPendingWrites) return;
        applyRemote(s.data());
        setStatus('Eşitlendi · ' + hhmm());
      }, e => { setStatus('Eşitleme durdu'); setMsg(trErr(e), true) });
    }catch(e){ setStatus('Eşitlenemedi'); setMsg(trErr(e), true) }
  });

  // --- events ---
  $('gBtn').addEventListener('click', async () => {
    setMsg('');
    try{ await AU.signInWithPopup(auth, new AU.GoogleAuthProvider()) }
    catch(e){ setMsg(trErr(e), true) }
  });
  $('accMode').addEventListener('click', () => {
    signup = !signup;
    $('accSubmit').textContent = signup ? 'Hesap oluştur' : 'Giriş yap';
    $('accMode').textContent = signup ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol';
    $('accPass').autocomplete = signup ? 'new-password' : 'current-password';
    setMsg('');
  });
  $('emailForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('accEmail').value.trim(), pass = $('accPass').value;
    const btn = $('accSubmit'); btn.disabled = true; setMsg('');
    try{
      if(signup) await AU.createUserWithEmailAndPassword(auth, email, pass);
      else await AU.signInWithEmailAndPassword(auth, email, pass);
      $('accPass').value = '';
    }catch(err){ setMsg(trErr(err), true) }
    btn.disabled = false;
  });
  $('accReset').addEventListener('click', async () => {
    const email = $('accEmail').value.trim();
    if(!email){ setMsg('Önce e-posta adresini yaz, sonra "Şifremi unuttum"a dokun.', true); return }
    try{ await AU.sendPasswordResetEmail(auth, email); setMsg('Şifre sıfırlama bağlantısını e-postana gönderdik.') }
    catch(err){ setMsg(trErr(err), true) }
  });
  $('accOutBtn').addEventListener('click', async () => {
    await AU.signOut(auth);
    setMsg('Çıkış yaptın. Ayarların bu cihazda kalmaya devam ediyor.');
  });
}
