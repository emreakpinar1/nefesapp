/* Ferah dil katmanı. Kaynak dil Türkçe; İngilizce seçiliyse ekrandaki Türkçe metinler bu sözlükle çevrilir.
   Dil: localStorage 'nefes-lang' ('tr' | 'en'); yoksa cihaz dili. */
(function(){
  let lang = 'tr';
  try{ lang = localStorage.getItem('nefes-lang') || '' }catch(e){}
  if(!['tr','en','ar','de'].includes(lang)){ const nl = navigator.language || ''; lang = /^tr\b/i.test(nl) ? 'tr' : /^ar\b/i.test(nl) ? 'ar' : /^de\b/i.test(nl) ? 'de' : 'en' }
  window.nefesLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  window.nefesSetLang = l => { try{ localStorage.setItem('nefes-lang', l) }catch(e){} location.reload() };

  const EN = {
    // genel / menü
    'Ana sayfa':'Home','İstatistik':'Stats','Nefes':'Breathe','Hatırlatıcı':'Reminders','Profil':'Profile','Ana menü':'Main menu',
    'Merhaba':'Hello','Misafir':'Guest','Günaydın':'Good morning','İyi günler':'Good afternoon','İyi akşamlar':'Good evening','İyi geceler':'Good night',
    'Egzersizler':'Exercises','Süreleri ayarla':'Adjust timing','Dil':'Language','Dili değiştir':'Change language',
    'Nefes egzersizleri ne işe yarar?':'What do breathing exercises do?','Sağlığa faydaları ve dikkat edilmesi gerekenler':'Health benefits and things to keep in mind',
    'Nefes egzersizlerinin faydaları':'Benefits of breathing exercises','Bu egzersiz ne işe yarar?':'What is this exercise for?','Bu düzen ne işe yarar?':'What is this pattern for?',
    'Tümü':'All','Duyuruyu kapat':'Close announcement','Kapat':'Close','Kontroller':'Controls',
    // egzersiz ekranı
    'Nefes egzersizi':'Breathing exercise','Hazır':'Ready','Hazırlan':'Get ready','Egzersiz sürüyor':'In progress','Duraklatıldı':'Paused','Tamamlandı':'Done','Harika iş':'Well done',
    'Nefes Al':'Breathe in','Nefes Tut':'Hold','Nefes Ver':'Breathe out','Bekle':'Rest','Al':'In','Tut':'Hold','Ver':'Out',
    'Tur':'Round','Kalan süre':'Time left','Sıfırla':'Reset','Başlat':'Start','Duraklat':'Pause','Sonraki aşama':'Next phase','Sesleri aç veya kapat':'Sound on or off',
    'Hazır egzersizler':'Exercises','Özel':'Custom','ayarla':'adjust','Özel düzen':'Custom pattern',
    'Nefes al':'Breathe in','Nefes tut':'Hold','Nefes ver':'Breathe out','Tur sayısı':'Rounds','saniye':'seconds',
    'Burundan yavaşça':'Slowly through the nose','Ciğerler dolu':'Lungs full','Ağızdan, uzun':'Long, through the mouth','Ciğerler boş (0 = kapalı)':'Lungs empty (0 = off)','Kaç döngü yapılacak':'How many cycles',
    'Yeni süreler bir sonraki aşamada geçerli olur':'New timings apply from the next phase','Egzersiz sıfırlandı':'Exercise reset','Tebrikler, egzersiz tamamlandı':'Well done, exercise complete',
    'Sesler açık':'Sound on','Sesler kapalı':'Sound off','Bu tarayıcı sesli yönlendirmeyi desteklemiyor':'This browser does not support voice guidance',
    // egzersiz penceresi
    'Egzersiz':'Exercise','Düzen':'Pattern','Bir tur':'One round','Toplam':'Total','Varsayılan sürelere dön':'Reset to default timing',
    'Egzersiz sürerken değişiklik yapılamaz. Önce durdur ya da sıfırla.':'You can\'t make changes during an exercise. Pause or reset first.',
    'Kaydet ve seç':'Save and select','Egzersiz seçildi':'Exercise selected','Düzenlendi':'Edited','Premium':'Premium',
    // istatistik
    'Bu hafta':'This week','Geçen hafta':'Last week','Hedef:':'Goal:','Egzersiz süresi':'Exercise time','Haftalık egzersiz dakikaları':'Weekly exercise minutes',
    'Bugün':'Today','Seans':'Sessions','Tamamlanan egzersizler':'Completed exercises','Toplam süre':'Total time','Bugüne kadar':'All time','Seri':'Streak',
    'Önceki hafta':'Previous week','Sonraki hafta':'Next week',
    // hatırlatıcı
    'Nefes hatırlatıcısı':'Breathing reminder','Hatırlatıcıyı aç veya kapat':'Turn reminders on or off','Hatırlatıcı kapalı':'Reminders off','Dene':'Test',
    'Açmak için düğmeye dokun':'Tap the switch to turn on','Yukarıdaki düğmeyle aç':'Turn on with the switch above','Hatırlatma kur':'Set a reminder','Gün içinde hatırlatma kur':'Set reminders for the day',
    'Hatırlatıcı bu sayfa açıkken çalışır. Sekme arka planda kalabilir ama kapatılmamalı.':'Reminders work while this page is open. The tab can stay in the background but shouldn\'t be closed.',
    'Hatırlatmalar telefonun bildirim sistemiyle gelir; uygulama kapalıyken de çalışır.':'Reminders use your phone\'s notifications and work even when the app is closed.',
    'Saat aralığı':'Time window','Başlangıç':'Start','Bitiş':'End','Sıklık':'Frequency','Ne kadar arayla hatırlatsın':'How often to remind you','Sıklığı azalt':'Less often','Sıklığı artır':'More often',
    'Günler':'Days','Alarm türü':'Alert type','Sesli':'Sound','Titreşim':'Vibrate','Sessiz':'Silent','Alarm sesi':'Alert sound','Çan':'Bell','Yumuşak':'Soft','Kuş':'Bird',
    'Sistem bildirimi':'System notifications','Bildirimlere izin ver':'Allow notifications',
    'Alarm sesi, sen kapatana kadar yaklaşık 1 dakika çalar. Sayfayı açtıktan sonra bir kez dokunman sesin çalmasını sağlar.':'The alert sounds for about a minute until you dismiss it. Tap the page once after opening it so sound can play.',
    'Telefon titrer, ses çalmaz.':'Your phone vibrates, no sound.','Telefon titrer, ses çalmaz. Titreşim Android tarayıcılarda çalışır.':'Your phone vibrates, no sound. Vibration works in Android browsers.',
    'Bu cihaz titreşimi desteklemiyor (iPhone ve bilgisayarlarda tarayıcı titreşimi yok). Ekranda sessiz bildirim gösterilir.':'This device doesn\'t support vibration (iPhone and desktop browsers can\'t vibrate). A silent on-screen alert is shown.',
    'Ses ve titreşim yok. Ekranda bildirim ve sekme başlığında yanıp sönen uyarı görünür.':'No sound or vibration. An on-screen alert appears and the tab title flashes.',
    'Telefonun bildirim sesiyle çalar ve titrer.':'Plays your phone\'s notification sound and vibrates.','Ses ve titreşim olmadan bildirim gösterilir.':'Shows a notification without sound or vibration.',
    'Açık. Sekme arka plandayken de ekranın köşesinde bildirim görünür.':'On. Notifications appear in the corner of the screen even when the tab is in the background.',
    'İzin verirsen sekme arka plandayken de bildirim alırsın.':'Allow this to get notifications while the tab is in the background.',
    'Sistem bildirimi kapalı. Uygulama içindeki alarm yine çalışır. Claude içinde açılan sayfalarda bildirimler engelli olabilir; kendi sitende yayınladığında izin verebilirsin.':'System notifications are off. The in-app alert still works.',
    'Bu tarayıcı sistem bildirimlerini desteklemiyor. Uygulama içindeki alarm yine çalışır.':'This browser doesn\'t support system notifications. The in-app alert still works.',
    'Bildirim izni verilmedi. Telefon ayarlarından Ferah bildirimlerini açabilirsin.':'Notification permission was denied. You can enable Ferah notifications in your phone settings.',
    'Sonraki hatırlatma yok':'No upcoming reminder','En az bir gün seç':'Pick at least one day','Bitiş, başlangıçtan sonra olmalı':'End must be after start','Bitiş saati başlangıçtan sonra olmalı':'End time must be after start time',
    'Hatırlatıcı açık':'Reminders on','10 dakika sonra tekrar hatırlatırım':'I\'ll remind you again in 10 minutes',
    'Nefes zamanı':'Time to breathe','⏰ Nefes zamanı':'⏰ Time to breathe','Birkaç dakikanı ayır.':'Take a few minutes.','Egzersize başla':'Start exercise','10 dk ertele':'Snooze 10 min',
    'Pt':'Mo','Sa':'Tu','Ça':'We','Pe':'Th','Cu':'Fr','Ct':'Sa','Pz':'Su',
    'Pazartesi':'Monday','Salı':'Tuesday','Çarşamba':'Wednesday','Perşembe':'Thursday','Cuma':'Friday','Cumartesi':'Saturday','Pazar':'Sunday',
    // profil / hesap
    'Hesap':'Account','Giriş yaparsan süre ayarların, hatırlatıcıların ve istatistiklerin tüm cihazlarında eşitlenir.':'Sign in to sync your timings, reminders and stats across all your devices.',
    'Google ile devam et':'Continue with Google','veya e-posta ile':'or with email','E-posta':'Email','Şifre':'Password','En az 6 karakter':'At least 6 characters','ornek@mail.com':'you@example.com',
    'Giriş yap':'Sign in','Hesabın yok mu? Kayıt ol':'No account? Sign up','Zaten hesabın var mı? Giriş yap':'Already have an account? Sign in','Hesap oluştur':'Create account','Şifremi unuttum':'Forgot password',
    'Çıkış yap':'Sign out','Yönetim paneline git':'Open admin panel','Ayarların bu cihazda saklanır. Giriş yaparsan tüm cihazlarında eşitlenir.':'Your settings are stored on this device. Sign in to sync them across devices.',
    'Görünüm':'Appearance','Açık':'Light','Koyu':'Dark','Sistem':'System',
    'Ses ayarları':'Sound','Geçiş sesleri':'Transition sounds','Her aşama değişiminde ton':'A tone at each phase change','Sesli yönlendirme':'Voice guidance','"Nefes al", "Tut", "Ver" der':'Says "Breathe in", "Hold", "Breathe out"',
    'Saniye tıkı':'Second tick','Her saniyede hafif tık':'A soft tick every second','Ses seviyesi':'Volume',
    'Eşitleniyor…':'Syncing…','Eşitlenemedi':'Sync failed','Eşitleme durdu':'Sync stopped','Kaydediliyor…':'Saving…','Kaydedilemedi':'Couldn\'t save',
    'E-posta veya şifre hatalı.':'Wrong email or password.','Bu e-postayla kayıtlı hesap yok. Önce kayıt ol.':'No account with this email. Sign up first.',
    'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.':'An account with this email already exists. Try signing in.','Şifre en az 6 karakter olmalı.':'Password must be at least 6 characters.',
    'Geçerli bir e-posta adresi yaz.':'Enter a valid email address.','Şifreni yaz.':'Enter your password.','Google girişi yarıda kaldı.':'Google sign-in was cancelled.',
    'Açılır pencere engellendi. E-posta ile giriş yapabilirsin.':'The pop-up was blocked. You can sign in with email.','Bu ekranda Google girişi açılamıyor. E-posta ile giriş yapabilirsin.':'Google sign-in isn\'t available here. You can sign in with email.',
    'İnternet bağlantısı yok. Bağlanınca tekrar dene.':'No internet connection. Try again when you\'re online.','Çok fazla deneme yapıldı. Biraz sonra tekrar dene.':'Too many attempts. Try again later.',
    'Veritabanı izinleri ayarlı değil.':'Database permissions are not set.','Sunucuya ulaşılamıyor. Bağlantı gelince eşitlenecek.':'Can\'t reach the server. Will sync when you\'re back online.',
    'Hesap sistemi yüklenemedi. İnternete bağlanınca sayfayı yenile.':'Couldn\'t load accounts. Refresh the page when you\'re online.',
    'Şifre sıfırlama bağlantısını e-postana gönderdik.':'We sent a password reset link to your email.','Önce e-posta adresini yaz, sonra "Şifremi unuttum"a dokun.':'Enter your email first, then tap "Forgot password".',
    'Çıkış yaptın. Ayarların bu cihazda kalmaya devam ediyor.':'You\'re signed out. Your settings stay on this device.',
    // abonelik
    'Ferah Premium':'Ferah Premium','Ferah: Nefes Egzersizleri':'Ferah: Breathe & Relax','Tüm egzersizlerin kilidini aç':'Unlock every exercise','Ücretsiz deneme':'Free trial','Deneme süren bitti':'Your trial has ended',
    'Premium üyesin':'You\'re a Premium member','Premium\'a geç':'Go Premium','Planları gör':'See plans','Aylık':'Monthly','Yıllık':'Yearly','Ömür boyu':'Lifetime',
    'En popüler':'Most popular','En avantajlı':'Best value','tek seferlik ödeme':'one-time payment','ay':'month','yıl':'year','Abone ol':'Subscribe','Satın al':'Buy',
    'Satın alma, uygulama Google Play ve App Store\'da yayınlandığında açılacak.':'Purchases will open when the app launches on Google Play and the App Store.',
    'Bu egzersiz Premium\'a dahil':'This exercise is included in Premium','Kilitli':'Locked','İptal etmek kolay; istediğin zaman mağaza ayarlarından iptal edebilirsin.':'Easy to cancel anytime from your store settings.',
    'Tüm egzersizler ve programlar':'All exercises and programs','Akciğer ve dayanıklılık antrenmanları':'Lung and endurance training','Uyku, odak ve enerji programları':'Sleep, focus and energy programs','Sınırsız özel düzen ve tüm istatistikler':'Unlimited custom patterns and full stats',
    'Ücretsiz sürümde':'In the free version','temel egzersiz':'core exercises',
  };

  const AR = {
    'Ana sayfa':'الرئيسية','İstatistik':'الإحصاءات','Nefes':'تنفّس','Hatırlatıcı':'التذكير','Profil':'الملف الشخصي','Ana menü':'القائمة الرئيسية',
    'Merhaba':'مرحبًا','Misafir':'ضيف','Günaydın':'صباح الخير','İyi günler':'نهارك سعيد','İyi akşamlar':'مساء الخير','İyi geceler':'تصبح على خير',
    'Egzersizler':'التمارين','Süreleri ayarla':'ضبط المدة','Dil':'اللغة','Dili değiştir':'تغيير اللغة',
    'Nefes egzersizleri ne işe yarar?':'ما فائدة تمارين التنفس؟','Sağlığa faydaları ve dikkat edilmesi gerekenler':'الفوائد الصحية وما يجب الانتباه إليه',
    'Nefes egzersizlerinin faydaları':'فوائد تمارين التنفس','Bu egzersiz ne işe yarar?':'ما فائدة هذا التمرين؟','Bu düzen ne işe yarar?':'ما فائدة هذا النمط؟',
    'Tümü':'الكل','Duyuruyu kapat':'إغلاق الإعلان','Kapat':'إغلاق','Kontroller':'عناصر التحكم',
    'Nefes egzersizi':'تمرين التنفس','Hazır':'جاهز','Hazırlan':'استعد','Egzersiz sürüyor':'جارٍ التمرين','Duraklatıldı':'متوقف مؤقتًا','Tamamlandı':'اكتمل','Harika iş':'أحسنت',
    'Nefes Al':'شهيق','Nefes Tut':'احبس','Nefes Ver':'زفير','Bekle':'انتظر','Al':'شهيق','Tut':'حبس','Ver':'زفير',
    'Tur':'الجولة','Kalan süre':'الوقت المتبقي','Sıfırla':'إعادة','Başlat':'ابدأ','Duraklat':'إيقاف مؤقت','Sonraki aşama':'المرحلة التالية','Sesleri aç veya kapat':'تشغيل الصوت أو إيقافه',
    'Hazır egzersizler':'التمارين','Özel':'مخصص','ayarla':'اضبط','Özel düzen':'نمط مخصص',
    'Nefes al':'شهيق','Nefes tut':'حبس النفس','Nefes ver':'زفير','Tur sayısı':'عدد الجولات','saniye':'ثانية',
    'Burundan yavaşça':'ببطء من الأنف','Ciğerler dolu':'الرئتان ممتلئتان','Ağızdan, uzun':'طويل، من الفم','Ciğerler boş (0 = kapalı)':'الرئتان فارغتان (0 = إيقاف)','Kaç döngü yapılacak':'كم دورة',
    'Yeni süreler bir sonraki aşamada geçerli olur':'تُطبَّق المدد الجديدة من المرحلة التالية','Egzersiz sıfırlandı':'تمت إعادة التمرين','Tebrikler, egzersiz tamamlandı':'أحسنت، اكتمل التمرين',
    'Sesler açık':'الصوت مفعّل','Sesler kapalı':'الصوت متوقف','Bu tarayıcı sesli yönlendirmeyi desteklemiyor':'هذا المتصفح لا يدعم التوجيه الصوتي',
    'Egzersiz':'تمرين','Düzen':'النمط','Bir tur':'جولة واحدة','Toplam':'المجموع','Varsayılan sürelere dön':'العودة إلى المدد الافتراضية',
    'Egzersiz sürerken değişiklik yapılamaz. Önce durdur ya da sıfırla.':'لا يمكن التعديل أثناء التمرين. أوقفه مؤقتًا أو أعده أولًا.',
    'Kaydet ve seç':'حفظ واختيار','Egzersiz seçildi':'تم اختيار التمرين','Düzenlendi':'معدّل','Premium':'Premium',
    'Bu hafta':'هذا الأسبوع','Geçen hafta':'الأسبوع الماضي','Hedef:':'الهدف:','Egzersiz süresi':'مدة التمرين','Haftalık egzersiz dakikaları':'دقائق التمرين الأسبوعية',
    'Bugün':'اليوم','Seans':'الجلسات','Tamamlanan egzersizler':'التمارين المكتملة','Toplam süre':'المدة الإجمالية','Bugüne kadar':'حتى الآن','Seri':'أيام متتالية',
    'Önceki hafta':'الأسبوع السابق','Sonraki hafta':'الأسبوع التالي',
    'Nefes hatırlatıcısı':'تذكير التنفس','Hatırlatıcıyı aç veya kapat':'تشغيل التذكير أو إيقافه','Hatırlatıcı kapalı':'التذكير متوقف','Dene':'تجربة',
    'Açmak için düğmeye dokun':'اضغط على المفتاح للتشغيل','Yukarıdaki düğmeyle aç':'شغّله من المفتاح أعلاه','Hatırlatma kur':'ضبط تذكير','Gün içinde hatırlatma kur':'اضبط تذكيرات خلال اليوم',
    'Hatırlatıcı bu sayfa açıkken çalışır. Sekme arka planda kalabilir ama kapatılmamalı.':'يعمل التذكير أثناء فتح هذه الصفحة. يمكن أن تبقى في الخلفية لكن لا تغلقها.',
    'Hatırlatmalar telefonun bildirim sistemiyle gelir; uygulama kapalıyken de çalışır.':'تصل التذكيرات عبر إشعارات هاتفك وتعمل حتى عند إغلاق التطبيق.',
    'Saat aralığı':'الفترة الزمنية','Başlangıç':'البداية','Bitiş':'النهاية','Sıklık':'التكرار','Ne kadar arayla hatırlatsın':'كل كم يذكّرك','Sıklığı azalt':'تقليل التكرار','Sıklığı artır':'زيادة التكرار',
    'Günler':'الأيام','Alarm türü':'نوع التنبيه','Sesli':'بصوت','Titreşim':'اهتزاز','Sessiz':'صامت','Alarm sesi':'صوت التنبيه','Çan':'جرس','Yumuşak':'ناعم','Kuş':'عصفور',
    'Sistem bildirimi':'إشعارات النظام','Bildirimlere izin ver':'السماح بالإشعارات',
    'Alarm sesi, sen kapatana kadar yaklaşık 1 dakika çalar. Sayfayı açtıktan sonra bir kez dokunman sesin çalmasını sağlar.':'يرنّ التنبيه نحو دقيقة حتى تغلقه. المس الصفحة مرة بعد فتحها ليعمل الصوت.',
    'Telefon titrer, ses çalmaz.':'يهتز الهاتف دون صوت.','Telefon titrer, ses çalmaz. Titreşim Android tarayıcılarda çalışır.':'يهتز الهاتف دون صوت. يعمل الاهتزاز في متصفحات أندرويد.',
    'Bu cihaz titreşimi desteklemiyor (iPhone ve bilgisayarlarda tarayıcı titreşimi yok). Ekranda sessiz bildirim gösterilir.':'هذا الجهاز لا يدعم الاهتزاز. يظهر تنبيه صامت على الشاشة.',
    'Ses ve titreşim yok. Ekranda bildirim ve sekme başlığında yanıp sönen uyarı görünür.':'بلا صوت أو اهتزاز. يظهر تنبيه على الشاشة ويومض عنوان الصفحة.',
    'Telefonun bildirim sesiyle çalar ve titrer.':'يرنّ بصوت إشعارات هاتفك ويهتز.','Ses ve titreşim olmadan bildirim gösterilir.':'يظهر إشعار بلا صوت أو اهتزاز.',
    'Açık. Sekme arka plandayken de ekranın köşesinde bildirim görünür.':'مفعّل. تظهر الإشعارات حتى عندما تكون الصفحة في الخلفية.',
    'İzin verirsen sekme arka plandayken de bildirim alırsın.':'اسمح بذلك لتصلك الإشعارات والصفحة في الخلفية.',
    'Sistem bildirimi kapalı. Uygulama içindeki alarm yine çalışır. Claude içinde açılan sayfalarda bildirimler engelli olabilir; kendi sitende yayınladığında izin verebilirsin.':'إشعارات النظام متوقفة. التنبيه داخل التطبيق يعمل.',
    'Bu tarayıcı sistem bildirimlerini desteklemiyor. Uygulama içindeki alarm yine çalışır.':'هذا المتصفح لا يدعم إشعارات النظام. التنبيه داخل التطبيق يعمل.',
    'Bildirim izni verilmedi. Telefon ayarlarından Ferah bildirimlerini açabilirsin.':'لم يُمنح إذن الإشعارات. يمكنك تفعيل إشعارات Ferah من إعدادات الهاتف.',
    'Sonraki hatırlatma yok':'لا يوجد تذكير قادم','En az bir gün seç':'اختر يومًا واحدًا على الأقل','Bitiş, başlangıçtan sonra olmalı':'يجب أن تكون النهاية بعد البداية','Bitiş saati başlangıçtan sonra olmalı':'يجب أن يكون وقت النهاية بعد البداية',
    'Hatırlatıcı açık':'التذكير مفعّل','10 dakika sonra tekrar hatırlatırım':'سأذكّرك مجددًا بعد 10 دقائق',
    'Nefes zamanı':'حان وقت التنفس','⏰ Nefes zamanı':'⏰ حان وقت التنفس','Birkaç dakikanı ayır.':'خصّص بضع دقائق.','Egzersize başla':'ابدأ التمرين','10 dk ertele':'تأجيل 10 دقائق',
    'Pt':'ن','Sa':'ث','Ça':'ر','Pe':'خ','Cu':'ج','Ct':'س','Pz':'ح',
    'Pazartesi':'الإثنين','Salı':'الثلاثاء','Çarşamba':'الأربعاء','Perşembe':'الخميس','Cuma':'الجمعة','Cumartesi':'السبت','Pazar':'الأحد',
    'Hesap':'الحساب','Giriş yaparsan süre ayarların, hatırlatıcıların ve istatistiklerin tüm cihazlarında eşitlenir.':'سجّل الدخول لمزامنة إعداداتك وتذكيراتك وإحصاءاتك على جميع أجهزتك.',
    'Google ile devam et':'المتابعة باستخدام Google','veya e-posta ile':'أو بالبريد الإلكتروني','E-posta':'البريد الإلكتروني','Şifre':'كلمة المرور','En az 6 karakter':'6 أحرف على الأقل','ornek@mail.com':'you@example.com',
    'Giriş yap':'تسجيل الدخول','Hesabın yok mu? Kayıt ol':'ليس لديك حساب؟ أنشئ حسابًا','Zaten hesabın var mı? Giriş yap':'لديك حساب؟ سجّل الدخول','Hesap oluştur':'إنشاء حساب','Şifremi unuttum':'نسيت كلمة المرور',
    'Çıkış yap':'تسجيل الخروج','Yönetim paneline git':'لوحة الإدارة','Ayarların bu cihazda saklanır. Giriş yaparsan tüm cihazlarında eşitlenir.':'تُحفظ إعداداتك على هذا الجهاز. سجّل الدخول لمزامنتها على أجهزتك.',
    'Ferah: Nefes Egzersizleri':'Ferah: تمارين التنفس','Görünüm':'المظهر','Açık':'فاتح','Koyu':'داكن','Sistem':'النظام',
    'Ses ayarları':'الصوت','Geçiş sesleri':'أصوات الانتقال','Her aşama değişiminde ton':'نغمة عند كل تغيير في المرحلة','Sesli yönlendirme':'التوجيه الصوتي','"Nefes al", "Tut", "Ver" der':'يقول "شهيق"، "احبس"، "زفير"',
    'Saniye tıkı':'نقرة كل ثانية','Her saniyede hafif tık':'نقرة خفيفة كل ثانية','Ses seviyesi':'مستوى الصوت',
    'Eşitleniyor…':'جارٍ المزامنة…','Eşitlenemedi':'فشلت المزامنة','Eşitleme durdu':'توقفت المزامنة','Kaydediliyor…':'جارٍ الحفظ…','Kaydedilemedi':'تعذّر الحفظ',
    'E-posta veya şifre hatalı.':'البريد الإلكتروني أو كلمة المرور غير صحيحة.','Bu e-postayla kayıtlı hesap yok. Önce kayıt ol.':'لا يوجد حساب بهذا البريد. أنشئ حسابًا أولًا.',
    'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.':'يوجد حساب بهذا البريد بالفعل. جرّب تسجيل الدخول.','Şifre en az 6 karakter olmalı.':'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
    'Geçerli bir e-posta adresi yaz.':'أدخل بريدًا إلكترونيًا صحيحًا.','Şifreni yaz.':'أدخل كلمة المرور.','Google girişi yarıda kaldı.':'تم إلغاء تسجيل الدخول عبر Google.',
    'Açılır pencere engellendi. E-posta ile giriş yapabilirsin.':'تم حظر النافذة المنبثقة. يمكنك الدخول بالبريد الإلكتروني.','Bu ekranda Google girişi açılamıyor. E-posta ile giriş yapabilirsin.':'تسجيل الدخول عبر Google غير متاح هنا. يمكنك الدخول بالبريد الإلكتروني.',
    'İnternet bağlantısı yok. Bağlanınca tekrar dene.':'لا يوجد اتصال بالإنترنت. حاول مجددًا عند الاتصال.','Çok fazla deneme yapıldı. Biraz sonra tekrar dene.':'محاولات كثيرة. حاول لاحقًا.',
    'Veritabanı izinleri ayarlı değil.':'أذونات قاعدة البيانات غير مضبوطة.','Sunucuya ulaşılamıyor. Bağlantı gelince eşitlenecek.':'تعذّر الوصول إلى الخادم. ستتم المزامنة عند عودة الاتصال.',
    'Hesap sistemi yüklenemedi. İnternete bağlanınca sayfayı yenile.':'تعذّر تحميل الحسابات. حدّث الصفحة عند الاتصال بالإنترنت.',
    'Şifre sıfırlama bağlantısını e-postana gönderdik.':'أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك.','Önce e-posta adresini yaz, sonra "Şifremi unuttum"a dokun.':'أدخل بريدك أولًا ثم اضغط "نسيت كلمة المرور".',
    'Çıkış yaptın. Ayarların bu cihazda kalmaya devam ediyor.':'سجّلت الخروج. تبقى إعداداتك على هذا الجهاز.',
    'Ferah Premium':'Ferah Premium','Tüm egzersizlerin kilidini aç':'افتح جميع التمارين','Ücretsiz deneme':'تجربة مجانية','Planları gör':'عرض الخطط',
    'Tüm egzersizler ve programlar':'جميع التمارين والبرامج','Akciğer ve dayanıklılık antrenmanları':'تمارين الرئة والتحمّل','Uyku, odak ve enerji programları':'برامج النوم والتركيز والطاقة','Sınırsız özel düzen ve tüm istatistikler':'أنماط مخصصة بلا حدود وإحصاءات كاملة',
    'İptal etmek kolay; istediğin zaman mağaza ayarlarından iptal edebilirsin.':'الإلغاء سهل في أي وقت من إعدادات المتجر.','Abone ol':'اشترك',
  };
  const DE = {"Ana sayfa": "Start", "İstatistik": "Statistik", "Nefes": "Atmen", "Hatırlatıcı": "Erinnerungen", "Profil": "Profil", "Ana menü": "Hauptmenü", "Merhaba": "Hallo", "Misafir": "Gast", "Günaydın": "Guten Morgen", "İyi günler": "Guten Tag", "İyi akşamlar": "Guten Abend", "İyi geceler": "Gute Nacht", "Egzersizler": "Übungen", "Süreleri ayarla": "Zeiten anpassen", "Dil": "Sprache", "Dili değiştir": "Sprache ändern", "Nefes egzersizleri ne işe yarar?": "Was bewirken Atemübungen?", "Sağlığa faydaları ve dikkat edilmesi gerekenler": "Gesundheitliche Vorteile und Hinweise", "Nefes egzersizlerinin faydaları": "Vorteile von Atemübungen", "Bu egzersiz ne işe yarar?": "Wofür ist diese Übung?", "Bu düzen ne işe yarar?": "Wofür ist dieses Muster?", "Tümü": "Alle", "Duyuruyu kapat": "Mitteilung schließen", "Kapat": "Schließen", "Kontroller": "Steuerung", "Nefes egzersizi": "Atemübung", "Hazır": "Bereit", "Hazırlan": "Mach dich bereit", "Egzersiz sürüyor": "Läuft", "Duraklatıldı": "Pausiert", "Tamamlandı": "Fertig", "Harika iş": "Gut gemacht", "Nefes Al": "Einatmen", "Nefes Tut": "Halten", "Nefes Ver": "Ausatmen", "Bekle": "Pause", "Al": "Ein", "Tut": "Halten", "Ver": "Aus", "Tur": "Runde", "Kalan süre": "Restzeit", "Sıfırla": "Zurücksetzen", "Başlat": "Starten", "Duraklat": "Pausieren", "Sonraki aşama": "Nächste Phase", "Sesleri aç veya kapat": "Ton an oder aus", "Hazır egzersizler": "Übungen", "Özel": "Eigene", "ayarla": "anpassen", "Özel düzen": "Eigenes Muster", "Nefes al": "Einatmen", "Nefes tut": "Halten", "Nefes ver": "Ausatmen", "Tur sayısı": "Runden", "saniye": "Sekunden", "Burundan yavaşça": "Langsam durch die Nase", "Ciğerler dolu": "Lunge voll", "Ağızdan, uzun": "Lang, durch den Mund", "Ciğerler boş (0 = kapalı)": "Lunge leer (0 = aus)", "Kaç döngü yapılacak": "Wie viele Zyklen", "Yeni süreler bir sonraki aşamada geçerli olur": "Neue Zeiten gelten ab der nächsten Phase", "Egzersiz sıfırlandı": "Übung zurückgesetzt", "Tebrikler, egzersiz tamamlandı": "Gut gemacht, Übung abgeschlossen", "Sesler açık": "Ton an", "Sesler kapalı": "Ton aus", "Bu tarayıcı sesli yönlendirmeyi desteklemiyor": "Dieser Browser unterstützt keine Sprachführung", "Egzersiz": "Übung", "Düzen": "Muster", "Bir tur": "Eine Runde", "Toplam": "Gesamt", "Varsayılan sürelere dön": "Standardzeiten wiederherstellen", "Egzersiz sürerken değişiklik yapılamaz. Önce durdur ya da sıfırla.": "Während einer Übung sind keine Änderungen möglich. Pausiere oder setze sie zuerst zurück.", "Kaydet ve seç": "Speichern und auswählen", "Egzersiz seçildi": "Übung ausgewählt", "Düzenlendi": "Bearbeitet", "Premium": "Premium", "Bu hafta": "Diese Woche", "Geçen hafta": "Letzte Woche", "Hedef:": "Ziel:", "Egzersiz süresi": "Übungszeit", "Haftalık egzersiz dakikaları": "Wöchentliche Übungsminuten", "Bugün": "Heute", "Seans": "Einheiten", "Tamamlanan egzersizler": "Abgeschlossene Übungen", "Toplam süre": "Gesamtzeit", "Bugüne kadar": "Bisher", "Seri": "Serie", "Önceki hafta": "Vorherige Woche", "Sonraki hafta": "Nächste Woche", "Nefes hatırlatıcısı": "Atem-Erinnerung", "Hatırlatıcıyı aç veya kapat": "Erinnerungen ein- oder ausschalten", "Hatırlatıcı kapalı": "Erinnerungen aus", "Dene": "Testen", "Açmak için düğmeye dokun": "Zum Einschalten auf den Schalter tippen", "Yukarıdaki düğmeyle aç": "Mit dem Schalter oben einschalten", "Hatırlatma kur": "Erinnerung einrichten", "Gün içinde hatırlatma kur": "Erinnerungen für den Tag einrichten", "Hatırlatıcı bu sayfa açıkken çalışır. Sekme arka planda kalabilir ama kapatılmamalı.": "Erinnerungen funktionieren, solange diese Seite geöffnet ist. Der Tab kann im Hintergrund bleiben, sollte aber nicht geschlossen werden.", "Hatırlatmalar telefonun bildirim sistemiyle gelir; uygulama kapalıyken de çalışır.": "Erinnerungen nutzen die Mitteilungen deines Telefons und funktionieren auch bei geschlossener App.", "Saat aralığı": "Zeitfenster", "Başlangıç": "Beginn", "Bitiş": "Ende", "Sıklık": "Häufigkeit", "Ne kadar arayla hatırlatsın": "Wie oft du erinnert wirst", "Sıklığı azalt": "Seltener", "Sıklığı artır": "Häufiger", "Günler": "Tage", "Alarm türü": "Art der Erinnerung", "Sesli": "Ton", "Titreşim": "Vibration", "Sessiz": "Lautlos", "Alarm sesi": "Erinnerungston", "Çan": "Glocke", "Yumuşak": "Sanft", "Kuş": "Vogel", "Sistem bildirimi": "Systemmitteilungen", "Bildirimlere izin ver": "Mitteilungen erlauben", "Alarm sesi, sen kapatana kadar yaklaşık 1 dakika çalar. Sayfayı açtıktan sonra bir kez dokunman sesin çalmasını sağlar.": "Der Ton spielt etwa eine Minute, bis du ihn schließt. Tippe nach dem Öffnen einmal auf die Seite, damit Ton abgespielt werden kann.", "Telefon titrer, ses çalmaz.": "Dein Telefon vibriert, ohne Ton.", "Telefon titrer, ses çalmaz. Titreşim Android tarayıcılarda çalışır.": "Dein Telefon vibriert, ohne Ton. Vibration funktioniert in Android-Browsern.", "Bu cihaz titreşimi desteklemiyor (iPhone ve bilgisayarlarda tarayıcı titreşimi yok). Ekranda sessiz bildirim gösterilir.": "Dieses Gerät unterstützt keine Vibration. Es wird eine lautlose Bildschirmmeldung angezeigt.", "Ses ve titreşim yok. Ekranda bildirim ve sekme başlığında yanıp sönen uyarı görünür.": "Kein Ton, keine Vibration. Eine Bildschirmmeldung erscheint und der Tab-Titel blinkt.", "Telefonun bildirim sesiyle çalar ve titrer.": "Spielt den Mitteilungston deines Telefons und vibriert.", "Ses ve titreşim olmadan bildirim gösterilir.": "Zeigt eine Mitteilung ohne Ton und Vibration.", "Açık. Sekme arka plandayken de ekranın köşesinde bildirim görünür.": "An. Mitteilungen erscheinen auch dann, wenn der Tab im Hintergrund ist.", "İzin verirsen sekme arka plandayken de bildirim alırsın.": "Erlaube dies, um Mitteilungen zu erhalten, während der Tab im Hintergrund ist.", "Sistem bildirimi kapalı. Uygulama içindeki alarm yine çalışır. Claude içinde açılan sayfalarda bildirimler engelli olabilir; kendi sitende yayınladığında izin verebilirsin.": "Systemmitteilungen sind aus. Die Erinnerung in der App funktioniert trotzdem.", "Bu tarayıcı sistem bildirimlerini desteklemiyor. Uygulama içindeki alarm yine çalışır.": "Dieser Browser unterstützt keine Systemmitteilungen. Die Erinnerung in der App funktioniert trotzdem.", "Bildirim izni verilmedi. Telefon ayarlarından Ferah bildirimlerini açabilirsin.": "Mitteilungen wurden nicht erlaubt. Du kannst Ferah-Mitteilungen in den Telefoneinstellungen aktivieren.", "Sonraki hatırlatma yok": "Keine anstehende Erinnerung", "En az bir gün seç": "Wähle mindestens einen Tag", "Bitiş, başlangıçtan sonra olmalı": "Ende muss nach Beginn liegen", "Bitiş saati başlangıçtan sonra olmalı": "Endzeit muss nach der Startzeit liegen", "Hatırlatıcı açık": "Erinnerungen an", "10 dakika sonra tekrar hatırlatırım": "Ich erinnere dich in 10 Minuten erneut", "Nefes zamanı": "Zeit zum Atmen", "⏰ Nefes zamanı": "⏰ Zeit zum Atmen", "Birkaç dakikanı ayır.": "Nimm dir ein paar Minuten.", "Egzersize başla": "Übung starten", "10 dk ertele": "10 Min. später", "Pt": "Mo", "Sa": "Di", "Ça": "Mi", "Pe": "Do", "Cu": "Fr", "Ct": "Sa", "Pz": "So", "Pazartesi": "Montag", "Salı": "Dienstag", "Çarşamba": "Mittwoch", "Perşembe": "Donnerstag", "Cuma": "Freitag", "Cumartesi": "Samstag", "Pazar": "Sonntag", "Hesap": "Konto", "Giriş yaparsan süre ayarların, hatırlatıcıların ve istatistiklerin tüm cihazlarında eşitlenir.": "Melde dich an, um Zeiten, Erinnerungen und Statistiken auf all deinen Geräten zu synchronisieren.", "Google ile devam et": "Weiter mit Google", "veya e-posta ile": "oder mit E-Mail", "E-posta": "E-Mail", "Şifre": "Passwort", "En az 6 karakter": "Mindestens 6 Zeichen", "ornek@mail.com": "du@beispiel.de", "Giriş yap": "Anmelden", "Hesabın yok mu? Kayıt ol": "Kein Konto? Registrieren", "Zaten hesabın var mı? Giriş yap": "Schon ein Konto? Anmelden", "Hesap oluştur": "Konto erstellen", "Şifremi unuttum": "Passwort vergessen", "Çıkış yap": "Abmelden", "Yönetim paneline git": "Admin-Bereich öffnen", "Ayarların bu cihazda saklanır. Giriş yaparsan tüm cihazlarında eşitlenir.": "Deine Einstellungen werden auf diesem Gerät gespeichert. Melde dich an, um sie geräteübergreifend zu synchronisieren.", "Görünüm": "Darstellung", "Açık": "Hell", "Koyu": "Dunkel", "Sistem": "System", "Ses ayarları": "Ton", "Geçiş sesleri": "Übergangstöne", "Her aşama değişiminde ton": "Ein Ton bei jedem Phasenwechsel", "Sesli yönlendirme": "Sprachführung", "\"Nefes al\", \"Tut\", \"Ver\" der": "Sagt \"Einatmen\", \"Halten\", \"Ausatmen\"", "Saniye tıkı": "Sekundenklick", "Her saniyede hafif tık": "Ein leiser Klick jede Sekunde", "Ses seviyesi": "Lautstärke", "Eşitleniyor…": "Synchronisiere…", "Eşitlenemedi": "Synchronisierung fehlgeschlagen", "Eşitleme durdu": "Synchronisierung gestoppt", "Kaydediliyor…": "Speichere…", "Kaydedilemedi": "Speichern fehlgeschlagen", "E-posta veya şifre hatalı.": "E-Mail oder Passwort falsch.", "Bu e-postayla kayıtlı hesap yok. Önce kayıt ol.": "Kein Konto mit dieser E-Mail. Registriere dich zuerst.", "Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.": "Mit dieser E-Mail gibt es bereits ein Konto. Versuche dich anzumelden.", "Şifre en az 6 karakter olmalı.": "Das Passwort muss mindestens 6 Zeichen haben.", "Geçerli bir e-posta adresi yaz.": "Gib eine gültige E-Mail-Adresse ein.", "Şifreni yaz.": "Gib dein Passwort ein.", "Google girişi yarıda kaldı.": "Google-Anmeldung abgebrochen.", "Açılır pencere engellendi. E-posta ile giriş yapabilirsin.": "Das Pop-up wurde blockiert. Du kannst dich mit E-Mail anmelden.", "Bu ekranda Google girişi açılamıyor. E-posta ile giriş yapabilirsin.": "Google-Anmeldung ist hier nicht verfügbar. Du kannst dich mit E-Mail anmelden.", "İnternet bağlantısı yok. Bağlanınca tekrar dene.": "Keine Internetverbindung. Versuche es erneut, wenn du online bist.", "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.": "Zu viele Versuche. Versuche es später erneut.", "Veritabanı izinleri ayarlı değil.": "Datenbankberechtigungen sind nicht eingerichtet.", "Sunucuya ulaşılamıyor. Bağlantı gelince eşitlenecek.": "Server nicht erreichbar. Synchronisierung erfolgt, sobald du wieder online bist.", "Hesap sistemi yüklenemedi. İnternete bağlanınca sayfayı yenile.": "Konten konnten nicht geladen werden. Lade die Seite neu, wenn du online bist.", "Şifre sıfırlama bağlantısını e-postana gönderdik.": "Wir haben dir einen Link zum Zurücksetzen des Passworts geschickt.", "Önce e-posta adresini yaz, sonra \"Şifremi unuttum\"a dokun.": "Gib zuerst deine E-Mail ein und tippe dann auf \"Passwort vergessen\".", "Çıkış yaptın. Ayarların bu cihazda kalmaya devam ediyor.": "Du bist abgemeldet. Deine Einstellungen bleiben auf diesem Gerät.", "Ferah Premium": "Ferah Premium", "Ferah: Nefes Egzersizleri": "Ferah: Atemübungen", "Tüm egzersizlerin kilidini aç": "Alle Übungen freischalten", "Ücretsiz deneme": "Kostenlose Testphase", "Deneme süren bitti": "Deine Testphase ist beendet", "Premium üyesin": "Du bist Premium-Mitglied", "Premium'a geç": "Premium holen", "Planları gör": "Pläne ansehen", "Aylık": "Monatlich", "Yıllık": "Jährlich", "Ömür boyu": "Lebenslang", "En popüler": "Am beliebtesten", "En avantajlı": "Bester Wert", "tek seferlik ödeme": "Einmalzahlung", "ay": "Monat", "yıl": "Jahr", "Abone ol": "Abonnieren", "Satın al": "Kaufen", "Satın alma, uygulama Google Play ve App Store'da yayınlandığında açılacak.": "Käufe sind möglich, sobald die App bei Google Play und im App Store erscheint.", "Bu egzersiz Premium'a dahil": "Diese Übung ist in Premium enthalten", "Kilitli": "Gesperrt", "İptal etmek kolay; istediğin zaman mağaza ayarlarından iptal edebilirsin.": "Jederzeit einfach in den Store-Einstellungen kündbar.", "Tüm egzersizler ve programlar": "Alle Übungen und Programme", "Akciğer ve dayanıklılık antrenmanları": "Lungen- und Ausdauertraining", "Uyku, odak ve enerji programları": "Programme für Schlaf, Fokus und Energie", "Sınırsız özel düzen ve tüm istatistikler": "Unbegrenzt eigene Muster und alle Statistiken", "Ücretsiz sürümde": "In der kostenlosen Version", "temel egzersiz": "Basisübungen"};
  Object.assign(EN, {"Hesabımı sil": "Delete my account", "Hesabın kalıcı olarak silinsin mi?": "Permanently delete your account?", "Hesabın ve sunucuda eşitlenen ayarların, istatistiklerin ve geçmişin silinir. Bu işlem geri alınamaz.": "Your account and the settings, statistics and history synced to our server will be deleted. This cannot be undone.", "Mağazadan aldığın bir abonelik varsa onu Google Play veya App Store ayarlarından ayrıca iptal etmelisin.": "If you bought a subscription in a store, cancel it separately in Google Play or App Store settings.", "Onaylamak için şifren": "Your password to confirm", "Vazgeç": "Cancel", "Kalıcı olarak sil": "Delete permanently", "Siliniyor…": "Deleting…", "Onaylamak için şifreni yaz.": "Enter your password to confirm.", "Şifre hatalı.": "Incorrect password.", "Hesabın ve sunucudaki tüm verilerin silindi.": "Your account and all your data on our server have been deleted.", "Güvenlik için yeniden giriş yapman gerekiyor. Çıkış yapıp tekrar giriş yap, sonra yeniden dene.": "For security, please sign in again. Sign out, sign back in, then try again.", "Farklı bir hesapla doğrulama yapıldı. Bu hesabın Google hesabını seç.": "You verified with a different account. Choose the Google account for this profile.", "Gizlilik politikası": "Privacy policy", "Kullanım koşulları": "Terms of use", "Hesap silme": "Account deletion"});
  Object.assign(AR, {"Hesabımı sil": "حذف حسابي", "Hesabın kalıcı olarak silinsin mi?": "هل تريد حذف حسابك نهائيًا؟", "Hesabın ve sunucuda eşitlenen ayarların, istatistiklerin ve geçmişin silinir. Bu işlem geri alınamaz.": "سيتم حذف حسابك والإعدادات والإحصاءات والسجل المتزامنة على الخادم. لا يمكن التراجع عن ذلك.", "Mağazadan aldığın bir abonelik varsa onu Google Play veya App Store ayarlarından ayrıca iptal etmelisin.": "إذا اشتريت اشتراكًا من المتجر، فألغِه بشكل منفصل من إعدادات Google Play أو App Store.", "Onaylamak için şifren": "كلمة المرور للتأكيد", "Vazgeç": "إلغاء", "Kalıcı olarak sil": "حذف نهائي", "Siliniyor…": "جارٍ الحذف…", "Onaylamak için şifreni yaz.": "أدخل كلمة المرور للتأكيد.", "Şifre hatalı.": "كلمة المرور غير صحيحة.", "Hesabın ve sunucudaki tüm verilerin silindi.": "تم حذف حسابك وجميع بياناتك على الخادم.", "Güvenlik için yeniden giriş yapman gerekiyor. Çıkış yapıp tekrar giriş yap, sonra yeniden dene.": "لأسباب أمنية، يجب تسجيل الدخول مجددًا. سجّل الخروج ثم الدخول وحاول مرة أخرى.", "Farklı bir hesapla doğrulama yapıldı. Bu hesabın Google hesabını seç.": "تم التحقق بحساب مختلف. اختر حساب Google الخاص بهذا الحساب.", "Gizlilik politikası": "سياسة الخصوصية", "Kullanım koşulları": "شروط الاستخدام", "Hesap silme": "حذف الحساب"});
  Object.assign(DE, {"Hesabımı sil": "Konto löschen", "Hesabın kalıcı olarak silinsin mi?": "Konto endgültig löschen?", "Hesabın ve sunucuda eşitlenen ayarların, istatistiklerin ve geçmişin silinir. Bu işlem geri alınamaz.": "Dein Konto sowie die auf dem Server synchronisierten Einstellungen, Statistiken und Verläufe werden gelöscht. Das kann nicht rückgängig gemacht werden.", "Mağazadan aldığın bir abonelik varsa onu Google Play veya App Store ayarlarından ayrıca iptal etmelisin.": "Falls du ein Abo im Store abgeschlossen hast, kündige es separat in den Einstellungen von Google Play oder App Store.", "Onaylamak için şifren": "Passwort zur Bestätigung", "Vazgeç": "Abbrechen", "Kalıcı olarak sil": "Endgültig löschen", "Siliniyor…": "Wird gelöscht…", "Onaylamak için şifreni yaz.": "Gib zur Bestätigung dein Passwort ein.", "Şifre hatalı.": "Falsches Passwort.", "Hesabın ve sunucudaki tüm verilerin silindi.": "Dein Konto und alle deine Daten auf dem Server wurden gelöscht.", "Güvenlik için yeniden giriş yapman gerekiyor. Çıkış yapıp tekrar giriş yap, sonra yeniden dene.": "Aus Sicherheitsgründen musst du dich erneut anmelden. Melde dich ab und wieder an und versuche es dann erneut.", "Farklı bir hesapla doğrulama yapıldı. Bu hesabın Google hesabını seç.": "Du hast dich mit einem anderen Konto bestätigt. Wähle das Google-Konto dieses Profils.", "Gizlilik politikası": "Datenschutzerklärung", "Kullanım koşulları": "Nutzungsbedingungen", "Hesap silme": "Konto löschen"});

  const RULES_DE = [
    [/^(\d+) tur · (\d+:\d+) dk$/, '$1 Runden · $2 Min.'], [/^(\d+) tur$/, '$1 Runden'],
    [/^(\d+) tur tamamlandı\. (\d+:\d+) dakika nefes egzersizi\.$/, '$1 Runden geschafft. $2 Minuten Atemübung.'],
    [/^(\d+) sn$/, '$1 Sek.'], [/^(\d+) dk$/, '$1 Min.'], [/^(\d+) sa (\d+) dk$/, '$1 Std. $2 Min.'], [/^(\d+(?:,\d+)?) sa$/, '$1 Std.'], [/^(\d+:\d+) dk$/, '$1 Min.'],
    [/^dk$/, 'Min.'], [/^gün$/, 'Tage'], [/^seans$/, 'Einheiten'],
    [/^Günlük hedef (\d+) dakika$/, 'Tagesziel: $1 Minuten'], [/^Günlük hedef \((\d+) dk\)$/, 'Tagesziel ($1 Min.)'],
    [/^Son 4 haftada ortalama (\d+) dk\/hafta$/, 'Durchschnitt $1 Min./Woche in den letzten 4 Wochen'],
    [/^Sonraki · (.+)$/, m => 'Nächste · ' + tr(m[1])], [/^Ertelendi · (.+)$/, m => 'Verschoben · ' + tr(m[1])],
    [/^(\d+) dk sonra$/, 'in $1 Min.'], [/^(\d+) sa (\d+) dk sonra$/, 'in $1 Std. $2 Min.'], [/^birazdan$/, 'gleich'],
    [/^(Bugün|Yarın|Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar) (\d\d:\d\d)$/, m => ({ Bugün: 'Heute', Yarın: 'Morgen' }[m[1]] || DE[m[1]] || m[1]) + ' ' + m[2]],
    [/^Hatırlatıcı açık · (.+)$/, m => 'Erinnerungen an · ' + tr(m[1])], [/^Eşitlendi · (.+)$/, 'Synchronisiert · $1'],
    [/^(.+) ne işe yarar\?$/, 'Wofür ist $1?'],
    [/^(.+) egzersizini seç$/, '$1 auswählen'], [/^(.+): süreleri ayarla$/, '$1: Zeiten anpassen'], [/^(.+) sırasını değiştir \(yukarı\/aşağı ok tuşları\)$/, '$1 verschieben (Pfeiltasten)'],
    [/^(.+) azalt$/, m => tr(m[1]) + ' verringern'], [/^(.+) artır$/, m => tr(m[1]) + ' erhöhen'],
    [/^Bir sorun oluştu \((.+)\)\.$/, 'Etwas ist schiefgelaufen ($1).'], [/^%(\d+)$/, '$1 %'], [/^Merhaba, (.+)$/, 'Hallo, $1'],
  ];
  const RULES_AR = [
    [/^(\d+) tur · (\d+:\d+) dk$/, '$1 جولات · $2 د'], [/^(\d+) tur$/, '$1 جولات'],
    [/^(\d+) tur tamamlandı\. (\d+:\d+) dakika nefes egzersizi\.$/, 'اكتملت $1 جولات. $2 دقيقة من التنفس.'],
    [/^(\d+) sn$/, '$1 ث'], [/^(\d+) dk$/, '$1 د'], [/^(\d+) sa (\d+) dk$/, '$1 س $2 د'], [/^(\d+(?:,\d+)?) sa$/, '$1 س'], [/^(\d+:\d+) dk$/, '$1 د'],
    [/^dk$/, 'د'], [/^gün$/, 'يوم'], [/^seans$/, 'جلسة'],
    [/^Günlük hedef (\d+) dakika$/, 'الهدف اليومي: $1 دقيقة'], [/^Günlük hedef \((\d+) dk\)$/, 'الهدف اليومي ($1 د)'],
    [/^Son 4 haftada ortalama (\d+) dk\/hafta$/, 'المتوسط $1 د/أسبوع في آخر 4 أسابيع'],
    [/^Sonraki · (.+)$/, m => 'التالي · ' + tr(m[1])], [/^Ertelendi · (.+)$/, m => 'مؤجَّل · ' + tr(m[1])],
    [/^(\d+) dk sonra$/, 'بعد $1 د'], [/^(\d+) sa (\d+) dk sonra$/, 'بعد $1 س $2 د'], [/^birazdan$/, 'قريبًا'],
    [/^(Bugün|Yarın|Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar) (\d\d:\d\d)$/, m => ({ Bugün: 'اليوم', Yarın: 'غدًا' }[m[1]] || AR[m[1]] || m[1]) + ' ' + m[2]],
    [/^Hatırlatıcı açık · (.+)$/, m => 'التذكير مفعّل · ' + tr(m[1])], [/^Eşitlendi · (.+)$/, 'تمت المزامنة · $1'],
    [/^(.+) ne işe yarar\?$/, 'ما فائدة $1؟'],
    [/^(.+) egzersizini seç$/, 'اختر $1'], [/^(.+): süreleri ayarla$/, '$1: ضبط المدة'], [/^(.+) sırasını değiştir \(yukarı\/aşağı ok tuşları\)$/, 'تغيير ترتيب $1'],
    [/^(.+) azalt$/, m => 'تقليل ' + tr(m[1])], [/^(.+) artır$/, m => 'زيادة ' + tr(m[1])],
    [/^Bir sorun oluştu \((.+)\)\.$/, 'حدث خطأ ($1).'], [/^%(\d+)$/, '$1%'], [/^Merhaba, (.+)$/, 'مرحبًا، $1'],
  ];
  const RULES = [
    [/^(\d+) tur · (\d+:\d+) dk$/, '$1 rounds · $2 min'],
    [/^(\d+) tur$/, '$1 rounds'],
    [/^(\d+) tur tamamlandı\. (\d+:\d+) dakika nefes egzersizi\.$/, '$1 rounds done. $2 minutes of breathing.'],
    [/^(\d+) sn$/, '$1 s'], [/^(\d+) dk$/, '$1 min'], [/^(\d+) sa (\d+) dk$/, '$1 h $2 min'], [/^(\d+(?:,\d+)?) sa$/, '$1 h'],
    [/^(\d+:\d+) dk$/, '$1 min'],
    [/^dk$/, 'min'], [/^gün$/, 'days'], [/^seans$/, 'sessions'],
    [/^Günlük hedef (\d+) dakika$/, 'Daily goal: $1 minutes'], [/^Günlük hedef \((\d+) dk\)$/, 'Daily goal ($1 min)'],
    [/^Son 4 haftada ortalama (\d+) dk\/hafta$/, 'Average $1 min/week over the last 4 weeks'],
    [/^Sonraki · (.+)$/, m => 'Next · ' + tr(m[1])], [/^Ertelendi · (.+)$/, m => 'Snoozed · ' + tr(m[1])],
    [/^(\d+) dk sonra$/, 'in $1 min'], [/^(\d+) sa (\d+) dk sonra$/, 'in $1 h $2 min'], [/^birazdan$/, 'shortly'],
    [/^(Bugün|Yarın|Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar) (\d\d:\d\d)$/, m => (EN[m[1]] || {Yarın:'Tomorrow'}[m[1]] || m[1]) + ' ' + m[2]],
    [/^Hatırlatıcı açık · (.+)$/, m => 'Reminders on · ' + tr(m[1])],
    [/^Eşitlendi · (.+)$/, 'Synced · $1'],
    [/^(.+) düzeninde (\d+) tur, yaklaşık (\d+:\d+) dakika\.$/, '$1 pattern, $2 rounds, about $3 minutes.'],
    [/^(.+) düzeninde (\d+) tur$/, '$1 pattern, $2 rounds'],
    [/^(.+) ne işe yarar\?$/, 'What is $1 for?'],
    [/^(.+) egzersizini seç$/, 'Select $1'], [/^(.+): süreleri ayarla$/, '$1: adjust timing'], [/^(.+) sırasını değiştir \(yukarı\/aşağı ok tuşları\)$/, 'Reorder $1 (up/down arrow keys)'],
    [/^(.+) azalt$/, m => 'Decrease ' + tr(m[1]).toLowerCase()], [/^(.+) artır$/, m => 'Increase ' + tr(m[1]).toLowerCase()],
    [/^Bir sorun oluştu \((.+)\)\.$/, 'Something went wrong ($1).'],
    [/^%(\d+)$/, '$1%'],
    [/^Merhaba, (.+)$/, 'Hello, $1'],
    [/^(\d+) gün kaldı$/, '$1 days left'], [/^Deneme: (\d+) gün kaldı$/, 'Trial: $1 days left'],
    [/^Ayda (.+)$/, '$1 per month'], [/^Aylığa göre %(\d+) tasarruf$/, 'Save $1% vs monthly'], [/^(\d+(?:[.,]\d+)?) yıllık fiyatına, sonsuza kadar$/, 'The price of $1 years, forever'],
    [/^(\d+) gün ücretsiz dene$/, 'Try free for $1 days'], [/^(\d+) gün ücretsiz, sonra (.+)$/, '$1 days free, then $2'],
    [/^Ekim (\d{4})$/, 'October $1'],
  ];
  const DICT = { ar: AR, de: DE }[lang] || EN, RL = { ar: RULES_AR, de: RULES_DE }[lang] || RULES;
  function tr(s){
    if(lang === 'tr' || !s) return s;
    const t = s.trim(); if(!t) return s;
    let out = DICT[t];
    if(out === undefined){
      for(const [re, rep] of RL){ const m = t.match(re); if(m){ out = typeof rep === 'function' ? rep(m) : t.replace(re, rep); break } }
    }
    if(out === undefined) return s;
    return s.replace(t, out);
  }
  window.nefesT = tr;
  if(lang === 'tr') return;

  const done = new WeakMap();
  const ATTRS = ['aria-label','placeholder','title'];
  function textNode(n){
    if(done.get(n) === n.data) return;
    const p = n.parentNode; if(!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
    const v = tr(n.data); if(v !== n.data) n.data = v;
    done.set(n, n.data);
  }
  function el(e){
    for(const a of ATTRS){ const v = e.getAttribute && e.getAttribute(a); if(v){ const t = tr(v); if(t !== v) e.setAttribute(a, t) } }
  }
  function walk(root){
    if(root.nodeType === 3){ textNode(root); return }
    if(root.nodeType !== 1) return;
    if(root.closest && root.closest('[data-no-i18n]')) return;
    el(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeType === 1 && n.hasAttribute('data-no-i18n')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while((n = w.nextNode())){ if(n.nodeType === 3) textNode(n); else el(n) }
  }
  const tt = document.title; document.title = tr(tt);
  const start = () => {
    walk(document.body);
    new MutationObserver(ms => {
      for(const m of ms){
        if(m.type === 'characterData') textNode(m.target);
        else if(m.type === 'attributes') el(m.target);
        else m.addedNodes.forEach(walk);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };
  if(document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
