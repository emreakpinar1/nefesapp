// NefesApp Android/iOS köprüsü: uygulama Capacitor içinde çalışırken hatırlatıcıları telefonun
// bildirim sistemine kurar ve titreşimi yerel olarak verir. Tarayıcıda hiçbir şey yapmaz.
const cap = window.Capacitor;
if(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) init();

async function init(){
  let registerPlugin;
  try{ ({ registerPlugin } = await import('https://cdn.jsdelivr.net/npm/@capacitor/core@8.5.3/dist/index.js')) }
  catch(e){ console.warn('Capacitor çekirdeği yüklenemedi', e); return }
  const LN = registerPlugin('LocalNotifications');
  const H = registerPlugin('Haptics');

  const CH = {
    sound:   { id: 'nefes-sound',   name: 'Hatırlatıcı · sesli',    importance: 5, vibration: true },
    vibrate: { id: 'nefes-vibrate', name: 'Hatırlatıcı · titreşim', importance: 4, vibration: true,  sound: 'nefes_silent.wav' },
    silent:  { id: 'nefes-silent',  name: 'Hatırlatıcı · sessiz',   importance: 3, vibration: false, sound: 'nefes_silent.wav' },
  };
  let channelsReady = false;
  async function channels(){
    if(channelsReady) return;
    for(const c of Object.values(CH)){
      try{ await LN.createChannel({ ...c, description: 'Ferah nefes hatırlatmaları', visibility: 1, lights: false }) }catch(e){}
    }
    channelsReady = true;
  }
  const toMin = s => { const [h, m] = String(s || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0) };

  let queue = Promise.resolve();
  function sync(r){
    queue = queue.then(() => doSync(r)).catch(e => { console.warn(e); return 'error' });
    return queue;
  }
  async function doSync({ on, start, end, int, days, mode, title, body }){
    const pend = await LN.getPending();
    if(pend.notifications && pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
    if(!on) return 'off';
    let p = await LN.checkPermissions();
    if(p.display !== 'granted') p = await LN.requestPermissions();
    if(p.display !== 'granted') return 'denied';
    await channels();
    const s = toMin(start), e = toMin(end), step = Math.max(5, +int || 60), list = [];
    let id = 1001;
    for(const d of (days || [])){
      for(let m = s; m <= e && list.length < 400; m += step){
        list.push({
          id: id++, title: title || 'Nefes zamanı', body,
          channelId: (CH[mode] || CH.sound).id,
          // Capacitor'da haftanın günleri 1 = Pazar ... 7 = Cumartesi
          schedule: { on: { weekday: d + 1, hour: Math.floor(m / 60), minute: m % 60 }, allowWhileIdle: true },
          isExactNotification: false, // kesin alarm izni istemeden kur (birkaç dakika sapabilir)
          extra: { nefes: true },
        });
      }
    }
    if(list.length) await LN.schedule({ notifications: list });
    return list.length;
  }

  LN.addListener('localNotificationActionPerformed', () => window.__nefes && window.__nefes.onNativeAlarm && window.__nefes.onNativeAlarm());
  LN.addListener('localNotificationReceived', () => window.__nefes && window.__nefes.onNativeAlarm && window.__nefes.onNativeAlarm());

  // --- Google Play satın alma (RevenueCat) ---
  // Anahtar ve yetki kimliği yönetim panelinden gelir: config/app.billing.rcAndroid / rcEntitlement
  const RC = registerPlugin('Purchases');
  const remote = () => { try{ return JSON.parse(localStorage.getItem('nefes-remote') || '{}') || {} }catch(e){ return {} } };
  const bcfg = () => remote().billing || {};
  let rcOn = false, rcBusy = null, rcUser = window.__nefesUid || null, pkgs = {};
  function applyCI(ci){
    const id = bcfg().rcEntitlement || 'premium';
    const e = ci && ci.entitlements && ci.entitlements.active && ci.entitlements.active[id];
    if(!e){ window.__nefesStoreEnt = null }
    else{
      const until = e.expirationDateMillis || (e.expirationDate ? Date.parse(e.expirationDate) : null);
      const pid = String(e.productIdentifier || '');
      window.__nefesStoreEnt = { plan: !until ? 'lifetime' : /year|annual|yil/i.test(pid) ? 'yearly' : 'monthly', until: until || null, store: true };
    }
    document.dispatchEvent(new Event('nefes:ent'));
  }
  async function loadOfferings(){
    try{
      const o = await RC.getOfferings();
      const list = (o && o.current && o.current.availablePackages) || [];
      pkgs = {};
      for(const p of list){ const k = { MONTHLY: 'monthly', ANNUAL: 'yearly', LIFETIME: 'lifetime' }[p.packageType]; if(k) pkgs[k] = p }
      const prices = {};
      for(const [k, p] of Object.entries(pkgs)) prices[k] = { text: p.product.priceString, amount: p.product.price, currency: p.product.currencyCode };
      window.__nefesStorePrices = Object.keys(prices).length ? prices : null;
      document.dispatchEvent(new Event('nefes:prices'));
    }catch(e){ console.warn('Teklifler alınamadı', e) }
  }
  async function rcRefresh(){ try{ const r = await RC.getCustomerInfo(); applyCI(r.customerInfo) }catch(e){} }
  function rcInit(){
    if(rcOn) return Promise.resolve(true);
    if(rcBusy) return rcBusy;
    const key = bcfg().rcAndroid;
    if(!key) return Promise.resolve(false);
    rcBusy = (async () => {
      try{
        await RC.configure(rcUser ? { apiKey: key, appUserID: rcUser } : { apiKey: key });
        rcOn = true;
        await Promise.all([rcRefresh(), loadOfferings()]);
      }catch(e){ console.warn('RevenueCat başlatılamadı', e) }
      rcBusy = null;
      return rcOn;
    })();
    return rcBusy;
  }
  window.__nefesStore = {
    ready: () => rcOn && Object.keys(pkgs).length > 0,
    async buy(plan){
      if(!(await rcInit())) throw { code: 'not-configured' };
      if(!pkgs[plan]) await loadOfferings();
      const p = pkgs[plan]; if(!p) throw { code: 'no-product' };
      const r = await RC.purchasePackage({ aPackage: p });
      applyCI(r.customerInfo);
      return !!window.__nefesStoreEnt;
    },
    async restore(){
      if(!(await rcInit())) throw { code: 'not-configured' };
      const r = await RC.restorePurchases();
      applyCI(r.customerInfo);
      return !!window.__nefesStoreEnt;
    },
  };
  document.addEventListener('nefes:user', async e => {
    const uid = (e.detail && e.detail.uid) || null;
    if(uid === rcUser) return;
    rcUser = uid;
    if(!rcOn){ rcInit(); return }
    try{ const r = uid ? await RC.logIn({ appUserID: uid }) : await RC.logOut(); applyCI(r.customerInfo) }catch(err){}
  });
  document.addEventListener('nefes:remote', () => { if(!rcOn) rcInit() });
  document.addEventListener('visibilitychange', () => { if(!document.hidden && rcOn) rcRefresh() });
  rcInit();

  window.__nefesNative = {
    sync,
    haptic: (style = 'MEDIUM') => H.impact({ style }).catch(() => {}),
    vibrate: (duration = 600) => H.vibrate({ duration }).catch(() => {}),
  };
  if(window.__nefes && window.__nefes.onNativeReady) window.__nefes.onNativeReady();
}
