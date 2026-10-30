// NefesApp Android/iOS köprüsü: uygulama Capacitor içinde çalışırken hatırlatıcıları telefonun
// bildirim sistemine kurar ve titreşimi yerel olarak verir. Tarayıcıda hiçbir şey yapmaz.
const cap = window.Capacitor;
if(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) init();

async function init(){
  let registerPlugin;
  try{ ({ registerPlugin } = await import('https://cdn.jsdelivr.net/npm/@capacitor/core@6.2.3/dist/index.js')) }
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
      try{ await LN.createChannel({ ...c, description: 'NefesApp nefes hatırlatmaları', visibility: 1, lights: false }) }catch(e){}
    }
    channelsReady = true;
  }
  const toMin = s => { const [h, m] = String(s || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0) };

  let queue = Promise.resolve();
  function sync(r){
    queue = queue.then(() => doSync(r)).catch(e => { console.warn(e); return 'error' });
    return queue;
  }
  async function doSync({ on, start, end, int, days, mode, body }){
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
          id: id++, title: 'Nefes zamanı', body,
          channelId: (CH[mode] || CH.sound).id,
          // Capacitor'da haftanın günleri 1 = Pazar ... 7 = Cumartesi
          schedule: { on: { weekday: d + 1, hour: Math.floor(m / 60), minute: m % 60 }, allowWhileIdle: true },
          extra: { nefes: true },
        });
      }
    }
    if(list.length) await LN.schedule({ notifications: list });
    return list.length;
  }

  LN.addListener('localNotificationActionPerformed', () => window.__nefes && window.__nefes.onNativeAlarm && window.__nefes.onNativeAlarm());
  LN.addListener('localNotificationReceived', () => window.__nefes && window.__nefes.onNativeAlarm && window.__nefes.onNativeAlarm());

  window.__nefesNative = {
    sync,
    haptic: (style = 'MEDIUM') => H.impact({ style }).catch(() => {}),
    vibrate: (duration = 600) => H.vibrate({ duration }).catch(() => {}),
  };
  if(window.__nefes && window.__nefes.onNativeReady) window.__nefes.onNativeReady();
}
