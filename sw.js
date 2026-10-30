const CACHE='nefesapp-v14';
const CORE=['./','./index.html','./defaults.js?v=13','./i18n.js?v=13','./native.js?v=14','./sync.js?v=13','./firebase-config.js?v=13','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(req,res)=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res};
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const url=new URL(r.url);
  // Uygulamanın kendi dosyaları: önce ağ (güncellemeler hemen gelsin), çevrimdışıysa önbellek
  if(r.mode==='navigate'){e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>put('./index.html',res)).catch(()=>caches.match('./index.html')));return}
  if(url.origin===location.origin){e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>put(r,res)).catch(()=>caches.match(r)));return}
  // Yazı tipleri ve Firebase kütüphanesi: sürümlü, önbellekten
  if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.host)||(url.host==='www.gstatic.com'&&url.pathname.startsWith('/firebasejs/'))||(url.host==='cdn.jsdelivr.net'&&url.pathname.startsWith('/npm/@capacitor/'))){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>put(r,res))));
  }
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c)return c.focus()}return self.clients.openWindow('./')}))});
