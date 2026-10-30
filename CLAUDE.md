# Ferah: Nefes Egzersizleri — geliştirici rehberi

Canlı site: https://ferah.tikvera.com/ (GitHub Pages, özel alan adı; CNAME dosyası. Eski adres emreakpinar1.github.io/nefesapp/ buraya yönlenir) · Yönetim paneli: `/admin.html` (yalnızca emreakpinar46@gmail.com)

## Yapı
- **index.html** — uygulama. Elle düzenlenmez; `python3 tools/build.py` ile üretilir:
  - `tools/shell.html`: HTML + CSS (ekranlar, tasarım, RTL kuralları)
  - çekirdek betik: index.html içindeki ilk `<script>` (nefes motoru, sesler, hatırlatıcı, istatistik). build.py bunu mevcut index.html'den alır; çekirdeği değiştirmek için index.html'deki o bloğu düzenle, sonra build.py çalıştır.
  - `tools/ui.js`: ekran geçişleri, ana sayfa, istatistik, egzersiz penceresi, Premium, dil menüsü
- **defaults.js** — varsayılan içerik: 33 egzersiz (TR/EN/AR/DE), kategoriler, faydalar metni, bildirim metni, fiyatlar, bölge→para birimi
- **i18n.js** — dil katmanı. Kaynak dil Türkçe; EN/DE/AR sözlükleri ekrandaki Türkçe metni çevirir. Arapça `dir="rtl"`.
- **sync.js** — Firebase giriş (Google, e-posta) ve Firestore eşitleme; premium bilgisi (`entitlements/{uid}`)
- **native.js** — Android/iOS (Capacitor) içinde yerel bildirim ve titreşim
- **admin.html** — yönetim paneli (egzersizler, içerik, duyuru, görünüm, bildirim, abonelik, kullanıcılar)
- **gizlilik.html, kosullar.html, hesap-silme.html** — yasal sayfalar (TR/EN; diğer dillerde EN). Ortak stil/dil: legal.css, legal.js. Hesap silme uygulamada Profil → Hesap → Hesabımı sil (sync.js).
- **sw.js** — çevrimdışı önbellek. Bir JS dosyası değişince `?v=` numarasını shell.html, admin.html, sync.js ve sw.js'te birlikte artır.
- **mobile/** — Capacitor Android kabuğu; içerik canlı siteden yüklenir. `mobile/` değişince GitHub Actions APK üretir (Releases → android-latest).

## Veri (Firestore, proje nefesapp-f3778)
- `config/app`: panelden yönetilen her şey (presets, presetsVersion=2, content[_en|_ar|_de], notify[_…], announcement, look, goal, billing, defaults)
- `users/{uid}`: kullanıcının ayarları, istatistikleri, günlük geçmişi, profil
- `entitlements/{uid}`: premium (yalnızca admin yazar; kullanıcı hesabını silerken kendi kaydını silebilir)

## Yayın
`git push` → GitHub Pages 1–2 dakikada yayınlar. Test için: `python3 -m http.server` ve Playwright.

## Henüz yapılmayanlar
Karşılama akışı, iOS derlemesi, mağaza satın alımının Firestore'a (web Premium) yazılması.

## Erişim kuralı
Hesapsız: yalnızca ilk egzersiz, 3 tamamlanan seans. Hesap açılınca 30 günlük deneme başlar (`opts.trialStart`, hesapla eşitlenir). Sonra Premium (Android'de RevenueCat → `ferah_pro`).
