# NefesApp Android

Capacitor kabuğu. Uygulama içeriği canlı siteden (`server.url`) yüklenir; web tarafındaki her değişiklik
uygulamayı yeniden kurmadan görünür. Bu klasör değiştiğinde GitHub Actions yeni bir APK üretir ve
**Releases → android-latest** altına koyar.

## Google Play (imzalı AAB)
GitHub Secrets'ta `FERAH_KEYSTORE_B64` ve `FERAH_KEYSTORE_PASSWORD` varsa her derleme imzalı bir AAB üretir:
Actions → son "Android" çalıştırması → Artifacts → **Ferah-playstore-aab**. Bu dosya Play Console'a yüklenir.
Sürüm kodu GitHub çalıştırma numarasıdır (her derlemede artar). Anahtar: alias `upload`, Play App Signing ile kullanılır.
