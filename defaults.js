/* NefesApp varsayılan içerikleri. Yönetim panelinde bir alan boş bırakılırsa bunlar kullanılır.
   Hem uygulama (index.html) hem yönetim paneli (admin.html) bu dosyayı okur. */
window.NEFES_DEFAULTS = {
  content: {
    homeTitle: 'Egzersizler',
    homeHint: 'Egzersize dokunarak süresini ayarla; sağdaki daireyle hemen seç. Sırayı değiştirmek için soldaki tutamaktan sürükle.',
    benefitsTitle: 'Nefes egzersizleri ne işe yarar?',
    benefits: [
      'Nefes, vücudun bilinçli olarak kontrol edebildiğimiz birkaç otomatik işlevinden biri. Nefesi yavaşlatmak ve özellikle nefes vermeyi uzatmak, vücudun dinlenme ve toparlanma sistemini (parasempatik sinir sistemi) öne çıkarır. Bunun sonucunda kalp atışı yavaşlar, kaslar gevşer ve zihin sakinleşir.',
      '',
      '## Araştırmalar ne söylüyor?',
      "- **Stres ve kaygı:** Stanford Üniversitesi'nin 2023 çalışmasında, bir ay boyunca günde 5 dakika nefes egzersizi yapanların ruh hali iyileşti ve kaygı düzeyleri düştü. Nefes vermenin uzun olduğu düzen en güçlü etkiyi gösterdi.",
      '- **Kalp ve dolaşım:** Dakikada yaklaşık 6 nefese inen yavaş nefes, çok sayıda çalışmanın ortak sonucuna göre kalp hızı değişkenliğini artırıyor. Bu değer, vücudun strese uyum sağlama yeteneğinin bir göstergesi.',
      '- **Uyku:** Yatmadan önce yapılan yavaş nefes, zihni sakinleştirerek uykuya geçişi kolaylaştırabilir.',
      '- **Odak:** Eşit ritimli nefes (kutu nefesi gibi) dikkati toplamaya ve baskı altında sakin kalmaya yardımcı olur.',
      '',
      '## Nasıl yapmalı?',
      '- Rahat bir pozisyonda otur ya da uzan, omuzlarını gevşet.',
      '- Mümkünse burundan al, nefes verirken dudaklarını hafifçe aralayabilirsin.',
      '- Göğüs yerine karnını şişirmeye çalış.',
      '- Günde birkaç dakika ile başla. Düzenli yapmak, uzun yapmaktan daha önemli.',
    ].join('\n'),
    warning: '**Dikkat:** Baş dönmesi, karıncalanma ya da nefes darlığı hissedersen egzersizi bırak ve normal nefesine dön. Hamileysen, kalp veya akciğer hastalığın, yüksek tansiyonun ya da panik bozukluğun varsa nefes tutma sürelerini kısa tut (ya da 0 yap) ve doktoruna danış. Bu uygulama bilgilendirme amaçlıdır, tıbbi tedavinin yerine geçmez.',
    sources: 'Kaynaklar: Balban ve ark., Cell Reports Medicine (2023), [Stanford Medicine](https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html); Laborde ve ark., yavaş nefes ve kalp hızı değişkenliği üzerine meta-analiz (2022); [Mindfulness (2023)](https://link.springer.com/article/10.1007/s12671-023-02294-2).',
  },
  goal: { dailyMin: 10 },
  notify: {
    title: 'Nefes zamanı',
    body: '{duzen} düzeninde {tur} tur, yaklaşık {sure} dakika.',
  },
  look: { breath: '#3F5C42', accent: '#84AE48', theme: 'light' },
  info: {
    '478': { short: 'Uykuya geçiş ve derin gevşeme',
      desc: "Dr. Andrew Weil'in yaygınlaştırdığı 4-7-8 tekniği. Uzun nefes tutma ve ondan da uzun nefes verme, kalp atışını yavaşlatıp vücudu dinlenme moduna geçirir. Yatmadan önce ya da gergin anlarda kullanılır. Bilimsel kanıtlar küçük çalışmalara dayanıyor ama sonuçlar kalp hızı ve kaygıda azalma yönünde." },
    'box': { short: 'Odaklanma ve baskı altında sakin kalma',
      desc: 'Kutu nefesi: al, tut, ver, bekle; hepsi eşit sürede. Sporcular, pilotlar ve askerler stresli anlarda dikkatini toplamak için kullanır. Eşit ritim zihni sabitler, dağınık düşünceleri toparlamaya yardım eder.' },
    'calm': { short: 'Gün içinde birkaç dakikalık hızlı rahatlama',
      desc: 'Nefes vermenin almaktan uzun olduğu kısa bir düzen. Uzun nefes verme, vücudun sakinleşme tepkisini en güçlü tetikleyen unsurlardan biri. Toplantı öncesi ya da yoğun bir anda birkaç tur yeterli.' },
    'bal': { short: 'Kalp ritmini dengeleyen rezonans nefesi',
      desc: 'Beş saniye al, beş saniye ver: dakikada 6 nefes. Araştırmalarda en çok çalışılan ritim bu. Düzenli yapıldığında kalp hızı değişkenliğini (vücudun strese uyum yeteneğinin göstergesi) artırdığı, bazı çalışmalarda tansiyona olumlu etki ettiği görülmüş. Nefes tutma olmadığı için herkes için uygun.' },
    'deep': { short: 'Meditasyona hazırlık, uzun ve derin nefes',
      desc: 'Yavaş, derin ve uzun bir döngü. Nefes kapasitesini zorlamadan genişletir, meditasyon ya da esneme öncesinde zihni yavaşlatmak için iyi bir başlangıç. Tutma süreleri zor gelirse kısaltabilirsin.' },
  },
};

/* Basit metin biçimi: boş satır = yeni paragraf, "## " = ara başlık, "- " = madde, **kalın**, [metin](https://adres) */
window.nefesMd = function(text){
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  let html = '', list = false, para = [];
  const flush = () => { if(para.length){ html += '<p>' + inline(para.join(' ')) + '</p>'; para = [] } };
  const endList = () => { if(list){ html += '</ul>'; list = false } };
  for(const raw of String(text || '').split(/\r?\n/)){
    const t = raw.trim();
    if(!t){ flush(); endList(); continue }
    if(t.startsWith('## ')){ flush(); endList(); html += '<h3>' + inline(t.slice(3)) + '</h3>'; continue }
    if(/^[-*] /.test(t)){ flush(); if(!list){ html += '<ul>'; list = true } html += '<li>' + inline(t.slice(2)) + '</li>'; continue }
    endList(); para.push(t);
  }
  flush(); endList();
  return html;
};

/* Panelden gelen ayarı varsayılanlarla birleştirir (boş alanlar varsayılana düşer) */
window.nefesMerge = function(def, over){
  const out = { ...def };
  for(const [k, v] of Object.entries(over || {})) if(v !== '' && v !== null && v !== undefined) out[k] = v;
  return out;
};

/* ---------- Egzersiz kataloğu ----------
   Deneme bittikten sonra hiçbir egzersiz ücretsiz değildir (free alanı yalnızca eski kayıtlarla uyum için). Süreler saniye. */
window.NEFES_CATEGORIES = [
  { id: 'calm',   tr: 'Sakinleş',          en: 'Calm' },
  { id: 'sleep',  tr: 'Uyku',              en: 'Sleep' },
  { id: 'focus',  tr: 'Odak',              en: 'Focus' },
  { id: 'energy', tr: 'Enerji',            en: 'Energy' },
  { id: 'stress', tr: 'Kaygı ve stres',    en: 'Anxiety & stress' },
  { id: 'lung',   tr: 'Akciğer antrenmanı', en: 'Lung training' },
  { id: 'voice',  tr: 'Ses ve şarkı',      en: 'Voice & singing' },
];
(function(){
  const X = (id, cat, free, name, name_en, p, short, short_en, desc, desc_en) =>
    ({ id, cat, free, name, name_en, inhale: p[0], hold: p[1], exhale: p[2], hold2: p[3], short, short_en, desc, desc_en });
  window.NEFES_DEFAULTS.exercises = [
    X('478','calm',true,'Rahatla','Relax',[4,7,8,0],'Uykuya geçiş ve derin gevşeme','Deep relaxation and drifting off',
      "Dr. Andrew Weil'in yaygınlaştırdığı 4-7-8 tekniği. Uzun nefes tutma ve ondan da uzun nefes verme, kalp atışını yavaşlatıp vücudu dinlenme moduna geçirir. Kanıtlar küçük çalışmalara dayanıyor ama sonuçlar kalp hızı ve kaygıda azalma yönünde.",
      'The 4-7-8 technique popularised by Dr. Andrew Weil. A long hold and an even longer exhale slow the heart and shift the body into rest mode. Evidence comes from small studies, which point to lower heart rate and anxiety.'),
    X('calm','calm',true,'Sakin','Calm',[4,2,6,0],'Gün içinde birkaç dakikalık hızlı rahatlama','A quick reset in a few minutes',
      'Nefes vermenin almaktan uzun olduğu kısa bir düzen. Uzun nefes verme, vücudun sakinleşme tepkisini en güçlü tetikleyen unsurlardan biri.',
      'A short pattern where the exhale is longer than the inhale. A long exhale is one of the strongest triggers of the body\'s calming response.'),
    X('bal','calm',true,'Denge','Balance',[5,0,5,0],'Kalp ritmini dengeleyen rezonans nefesi','Resonance breathing for a steady heart',
      'Beş saniye al, beş saniye ver: dakikada 6 nefes. Araştırmalarda en çok çalışılan ritim bu; düzenli yapıldığında kalp hızı değişkenliğini artırdığı görülmüş. Nefes tutma yok, herkes için uygun.',
      'Five seconds in, five seconds out: six breaths a minute. The most studied rhythm in research; practised regularly it raises heart rate variability. No breath holds, so it suits everyone.'),
    X('eq','calm',true,'Eşit nefes','Equal breath',[4,0,4,0],'Başlangıç için en sade ritim','The simplest rhythm to start with',
      'Alış ve veriş eşit. Nefese dikkat vermeyi öğrenmek ve zihni toparlamak için iyi bir başlangıç.',
      'Inhale and exhale are equal. A good first step for learning to notice your breath and gather your thoughts.'),
    X('long','calm',false,'Uzun veriş','Long exhale',[4,0,8,0],'Nefesi uzatarak yavaşlama','Slow down by lengthening the out-breath',
      'Veriş, alışın iki katı. Gergin bir anda vücudun frenine basmak gibi çalışır.',
      'The exhale is twice the inhale. Works like gently pressing the body\'s brake in a tense moment.'),
    X('711','calm',false,'7/11 nefes','7/11 breath',[7,0,11,0],'Yavaş ve uzun bir döngü','A slow, long cycle',
      'Yedi saniye al, on bir saniye ver. Nefesi çok yavaşlatır; zor gelirse önce Uzun veriş ile başla.',
      'Seven seconds in, eleven out. Slows breathing a lot; if it feels hard, start with Long exhale.'),
    X('wave','calm',false,'Yumuşak dalga','Soft wave',[5,2,7,0],'Akıcı, dalga gibi bir ritim','A flowing, wave-like rhythm',
      'Kısa bir duraklamayla yumuşak bir alış ve uzun bir veriş. Gün içinde zihni dinlendirmek için.',
      'A soft inhale, a brief pause and a long exhale. For resting the mind during the day.'),
    X('deep','calm',false,'Derin','Deep',[6,6,8,2],'Meditasyona hazırlık, uzun ve derin nefes','Long, deep breaths before meditation',
      'Yavaş, derin ve uzun bir döngü. Meditasyon ya da esneme öncesinde zihni yavaşlatmak için iyi bir başlangıç.',
      'A slow, deep, long cycle. A good way to quieten the mind before meditation or stretching.'),
    X('sleep','sleep',true,'Uykuya dalış','Drift off',[4,4,8,0],'Yatmadan önce birkaç dakika','A few minutes before bed',
      'Uzun veriş ve kısa bir tutma ile vücudu uyku moduna hazırlar. Işıklar kapalı, yatakta yapılabilir.',
      'A long exhale and a short hold prepare the body for sleep. Do it in bed with the lights off.'),
    X('sleep2','sleep',false,'Derin uyku','Deep sleep',[5,5,10,0],'Uykuya geçişi kolaylaştıran yavaş döngü','A slow cycle to ease into sleep',
      'Çok yavaş bir ritim. Gece uyandığında yeniden uykuya dalmak için de kullanılabilir.',
      'A very slow rhythm. Also useful for falling back asleep if you wake at night.'),
    X('night','sleep',false,'Gece sakinliği','Night calm',[4,2,8,2],'Günü geride bırakmak için','To leave the day behind',
      'Veriş sonrası kısa bekleme ile nefesin doğal duraklamasını taklit eder; zihni yavaşlatır.',
      'A short pause after the exhale mimics the breath\'s natural rest and slows the mind.'),
    X('box','focus',true,'Kutu','Box',[4,4,4,4],'Odaklanma ve baskı altında sakin kalma','Focus and stay calm under pressure',
      'Al, tut, ver, bekle; hepsi eşit. Sporcular, pilotlar ve askerler stresli anlarda dikkatini toplamak için kullanır.',
      'In, hold, out, hold; all equal. Used by athletes, pilots and soldiers to stay focused under pressure.'),
    X('box6','focus',false,'Büyük kutu','Big box',[6,6,6,6],'Daha uzun ve derin bir kutu nefesi','A longer, deeper box breath',
      'Kutu nefesinin daha yavaş hali. Kutu nefesine alıştıktan sonra dene.',
      'A slower version of box breathing. Try it once box breathing feels easy.'),
    X('focus','focus',false,'Odak','Focus',[4,4,4,0],'Çalışmaya başlamadan önce','Before you start working',
      'Eşit alış, tutma ve veriş. Dağınık düşünceleri toplayıp işe odaklanmaya yardım eder.',
      'Equal inhale, hold and exhale. Helps gather scattered thoughts before deep work.'),
    X('clear','focus',false,'Berrak zihin','Clear mind',[5,3,5,3],'Zihni toparlamak için kısa mola','A short break to clear your head',
      'Yumuşak tutmalarla dengeli bir ritim. Uzun bir çalışmanın ortasında iyi gelir.',
      'A balanced rhythm with gentle holds. Good in the middle of a long work session.'),
    X('study','focus',false,'Çalışma molası','Study break',[4,2,4,2],'Ders ya da toplantı arasında','Between classes or meetings',
      'Kısa ve hafif bir döngü. Birkaç tur, dikkati yeniden toplamak için yeterli.',
      'A short, light cycle. A few rounds are enough to reset your attention.'),
    X('wake','energy',true,'Uyanış','Wake up',[4,0,2,0],'Sabah zihni açmak için','To clear your head in the morning',
      'Alış, verişten uzun. Bu düzen vücudu hafifçe uyarır; sabah ya da öğleden sonra yorgunluğunda dene.',
      'The inhale is longer than the exhale. This gently energises the body; try it in the morning or during the afternoon slump.'),
    X('morning','energy',false,'Sabah tazeliği','Morning refresh',[6,2,3,0],'Güne canlı başlangıç','A fresh start to the day',
      'Derin bir alış, kısa bir tutma ve hızlı bir veriş. Kahveden önce birkaç tur.',
      'A deep inhale, a short hold and a quick exhale. A few rounds before your coffee.'),
    X('boost','energy',false,'Enerji ver','Energise',[3,0,3,0],'Kısa sürede canlanma','A quick lift',
      'Hızlı ve eşit nefesler. Baş dönmesi olursa dur ve normal nefese dön.',
      'Fast, even breaths. If you feel dizzy, stop and return to normal breathing.'),
    X('quick','energy',false,'Hızlı canlanma','Quick boost',[2,0,2,0],'Bir dakikalık enerji molası','A one-minute energy break',
      'Çok kısa ve hızlı bir döngü. Oturarak yap, birkaç turla sınırlı tut.',
      'A very short, fast cycle. Do it seated and keep it to a few rounds.'),
    X('sos','stress',true,'Kaygı SOS','Anxiety SOS',[4,1,8,0],'Kaygı yükseldiğinde hemen','Right when anxiety rises',
      'Kısa bir alış ve iki kat uzun bir veriş. Kalbin hızlandığını hissettiğinde en hızlı sakinleşme yolu.',
      'A short inhale and an exhale twice as long. The fastest way to settle when your heart starts racing.'),
    X('stress','stress',false,'Stresi azalt','Ease stress',[4,4,6,2],'Yoğun bir günün ortasında','In the middle of a busy day',
      'Tutmalarla desteklenen uzun veriş. Omuzlarını gevşet ve yalnızca nefese odaklan.',
      'A long exhale supported by holds. Drop your shoulders and focus only on the breath.'),
    X('body','stress',false,'Rahat beden','Body ease',[4,0,6,2],'Gerginliği bedenden bırakmak','Release tension from the body',
      'Her verişte gergin bir bölgeyi (çene, omuz, karın) gevşettiğini düşün. Ağrının tedavisi değildir ama gevşemeye yardım eder.',
      'With each exhale imagine releasing a tense area (jaw, shoulders, belly). Not a treatment for pain, but it helps you relax.'),
    X('urge','stress',false,'Dürtü molası','Urge break',[4,4,8,0],'Ani istekleri atlatmak için','To ride out a sudden craving',
      'Bir istek geldiğinde birkaç dakika bu ritimle nefes al; dürtü genelde dalga gibi gelip geçer.',
      'When a craving hits, breathe with this rhythm for a few minutes; urges usually rise and pass like a wave.'),
    X('reset','stress',false,'Tazelen','Reset',[4,2,6,2],'Tartışma ya da zor bir konuşma sonrası','After an argument or a hard conversation',
      'Dengeli bir döngüyle vücudu yeniden sakin bir ritme getirir.',
      'A balanced cycle that brings the body back to a calm rhythm.'),
    X('lung1','lung',false,'Akciğer · Kolay','Lungs · Easy',[4,4,4,0],'Nefes kapasitesine giriş','An introduction to breath capacity',
      'Rahat tutmalarla nefes kaslarını çalıştırır. Her gün birkaç tur yap.',
      'Works the breathing muscles with comfortable holds. Do a few rounds every day.'),
    X('lung2','lung',false,'Akciğer · Orta','Lungs · Medium',[6,8,6,0],'Tutma süresini artırma','Building longer holds',
      'Daha uzun tutma ile akciğer kapasitesini zorlar. Zorlanırsan Kolay seviyeye dön.',
      'Longer holds challenge your capacity. Go back to Easy if it feels like a strain.'),
    X('lung3','lung',false,'Akciğer · Zor','Lungs · Hard',[8,12,8,0],'Deneyimliler için uzun tutma','Long holds for experienced users',
      'Uzun nefes tutma içerir. Hamilelik, kalp, akciğer ya da tansiyon sorunlarında yapma.',
      'Includes long breath holds. Avoid if pregnant or if you have heart, lung or blood pressure conditions.'),
    X('end1','lung',false,'Dayanıklılık · Kolay','Endurance · Easy',[5,5,5,5],'Uzun ve dengeli nefes çalışması','Long, steady breath practice',
      'Dört eşit adım. Koşu ya da yüzme gibi sporlara nefes desteği için.',
      'Four equal steps. Breath support for running, swimming and similar sports.'),
    X('end2','lung',false,'Dayanıklılık · Orta','Endurance · Medium',[7,7,7,7],'Daha uzun eşit döngüler','Longer equal cycles',
      'Kolay seviyeye göre her adım daha uzun. Nefesi zorlamadan sürdürmeye çalış.',
      'Each step is longer than Easy. Try to keep it going without forcing.'),
    X('end3','lung',false,'Dayanıklılık · Zor','Endurance · Hard',[8,8,8,8],'Sabır ve kontrol gerektirir','Takes patience and control',
      'Uzun eşit adımlar. Baş dönmesi hissedersen hemen bırak.',
      'Long, equal steps. Stop right away if you feel dizzy.'),
    X('sing1','voice',false,'Şarkıcılar · Geniş','Singers · Wide',[4,2,12,0],'Uzun ve kontrollü veriş','Long, controlled exhale',
      'Uzun cümleleri tek nefeste söylemek için verişi kontrol etmeyi çalıştırır. Verirken "sss" sesi çıkarabilirsin.',
      'Trains a controlled exhale for singing long phrases in one breath. Try a soft "sss" as you breathe out.'),
    X('sing2','voice',false,'Şarkıcılar · Hızlı','Singers · Quick',[1,0,8,0],'Hızlı alış, uzun veriş','Quick inhale, long exhale',
      'Şarkı arasında hızlıca nefes alıp uzun süre kullanmayı çalıştırır.',
      'Practises catching a quick breath between lines and making it last.'),
  ];
  // eski kod uyumluluğu: info haritası katalogdan
  window.NEFES_DEFAULTS.info = Object.fromEntries(window.NEFES_DEFAULTS.exercises.map(e => [e.id, { short: e.short, desc: e.desc }]));
})();

/* ---------- İngilizce içerik ---------- */
window.NEFES_DEFAULTS.content_en = {
  homeTitle: 'Exercises',
  homeHint: 'Tap an exercise to adjust its timing; use the circle on the right to select it. Drag the handle on the left to reorder.',
  benefitsTitle: 'What do breathing exercises do?',
  benefits: [
    'Breathing is one of the few automatic body functions we can control on purpose. Slowing the breath, and especially lengthening the exhale, brings forward the body\'s rest-and-recover system (the parasympathetic nervous system). The heart slows, muscles relax and the mind settles.',
    '',
    '## What does the research say?',
    '- **Stress and anxiety:** In a 2023 Stanford University study, people who did 5 minutes of breathwork a day for a month had better mood and lower anxiety. The pattern with a longer exhale had the strongest effect.',
    '- **Heart and circulation:** Slow breathing at about six breaths a minute raises heart rate variability across many studies, a sign of how well the body adapts to stress.',
    '- **Sleep:** Slow breathing before bed calms the mind and can make it easier to fall asleep.',
    '- **Focus:** An even rhythm (such as box breathing) helps you gather attention and stay calm under pressure.',
    '',
    '## How to do it',
    '- Sit or lie down comfortably and relax your shoulders.',
    '- Breathe in through your nose if you can; you can part your lips slightly as you breathe out.',
    '- Let your belly rise rather than your chest.',
    '- Start with a few minutes a day. Doing it regularly matters more than doing it for long.',
  ].join('\n'),
  warning: '**Caution:** If you feel dizzy, tingling or short of breath, stop and return to normal breathing. If you are pregnant or have a heart or lung condition, high blood pressure or panic disorder, keep breath holds short (or set them to 0) and talk to your doctor. This app is for information only and is not a substitute for medical treatment.',
  sources: 'Sources: Balban et al., Cell Reports Medicine (2023), [Stanford Medicine](https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html); Laborde et al., meta-analysis on slow breathing and heart rate variability (2022); [Mindfulness (2023)](https://link.springer.com/article/10.1007/s12671-023-02294-2).',
};
window.NEFES_DEFAULTS.notify_en = { title: 'Time to breathe', body: '{duzen} pattern, {tur} rounds, about {sure} minutes.' };

/* ---------- Abonelik ---------- */
window.NEFES_DEFAULTS.billing = {
  trialDays: 30,
  // Google Play'deki fiyatlarla aynı (vergi dahil, Play'in yuvarlamasıyla)
  TRY: { monthly: 68.99, yearly: 499.99, lifetime: 4989.99 },
  USD: { monthly: 3.99, yearly: 28.99, lifetime: 149.99 },
};

/* ---------- Arapça içerik ---------- */
(function(){
  const AR_CATS = { calm: 'الهدوء', sleep: 'النوم', focus: 'التركيز', energy: 'الطاقة', stress: 'القلق والتوتر', lung: 'تمارين الرئة', voice: 'الصوت والغناء' };
  window.NEFES_CATEGORIES.forEach(c => { c.ar = AR_CATS[c.id] });
  const AR = {
    '478':   ['استرخِ', 'استرخاء عميق وسهولة في النوم', 'تقنية 4-7-8 التي نشرها الدكتور أندرو ويل. حبس النفس الطويل ثم زفير أطول يبطئ ضربات القلب وينقل الجسم إلى وضع الراحة. الأدلة مأخوذة من دراسات صغيرة، وتشير إلى انخفاض معدل ضربات القلب والقلق.'],
    'calm':  ['هدوء', 'استعادة الهدوء في دقائق قليلة', 'نمط قصير يكون فيه الزفير أطول من الشهيق. الزفير الطويل من أقوى ما يحفّز استجابة الجسم للهدوء.'],
    'bal':   ['توازن', 'تنفس الرنين لإيقاع قلب متوازن', 'خمس ثوانٍ شهيق وخمس ثوانٍ زفير: ست أنفاس في الدقيقة. أكثر إيقاع تمت دراسته، ومع الممارسة المنتظمة يرفع تقلّب معدل ضربات القلب. لا يتضمن حبس النفس، لذا يناسب الجميع.'],
    'eq':    ['تنفس متساوٍ', 'أبسط إيقاع للبداية', 'الشهيق والزفير متساويان. بداية جيدة لتعلّم الانتباه إلى نفَسك وجمع أفكارك.'],
    'long':  ['زفير طويل', 'إبطاء الإيقاع بإطالة الزفير', 'الزفير ضعف الشهيق. يعمل كأنك تضغط برفق على مكابح الجسم في لحظة توتر.'],
    '711':   ['تنفس 7/11', 'دورة بطيئة وطويلة', 'سبع ثوانٍ شهيق وإحدى عشرة ثانية زفير. يبطئ التنفس كثيرًا؛ إن وجدته صعبًا فابدأ بتمرين الزفير الطويل.'],
    'wave':  ['موجة هادئة', 'إيقاع متدفق كالموج', 'شهيق ناعم وتوقف قصير ثم زفير طويل. لإراحة الذهن خلال اليوم.'],
    'deep':  ['عميق', 'أنفاس عميقة وطويلة قبل التأمل', 'دورة بطيئة وعميقة وطويلة. طريقة جيدة لتهدئة الذهن قبل التأمل أو التمدد.'],
    'sleep': ['الاستغراق في النوم', 'دقائق قليلة قبل النوم', 'زفير طويل وحبس قصير يهيئان الجسم للنوم. مارسه في السرير والأضواء مطفأة.'],
    'sleep2':['نوم عميق', 'دورة بطيئة تسهّل الدخول في النوم', 'إيقاع بطيء جدًا. مفيد أيضًا للعودة إلى النوم إذا استيقظت ليلًا.'],
    'night': ['سكينة الليل', 'لتترك يومك خلفك', 'توقف قصير بعد الزفير يحاكي الراحة الطبيعية للنفَس ويبطئ الذهن.'],
    'box':   ['المربع', 'التركيز والهدوء تحت الضغط', 'شهيق، حبس، زفير، حبس؛ كلها متساوية. يستخدمه الرياضيون والطيارون والجنود للحفاظ على التركيز تحت الضغط.'],
    'box6':  ['المربع الكبير', 'تنفس مربع أطول وأعمق', 'نسخة أبطأ من تنفس المربع. جرّبها عندما يصبح تنفس المربع سهلًا.'],
    'focus': ['تركيز', 'قبل أن تبدأ العمل', 'شهيق وحبس وزفير متساوية. يساعد على جمع الأفكار المشتتة قبل العمل العميق.'],
    'clear': ['ذهن صافٍ', 'استراحة قصيرة لتصفية الذهن', 'إيقاع متوازن مع حبس خفيف. مفيد في منتصف جلسة عمل طويلة.'],
    'study': ['استراحة الدراسة', 'بين الحصص أو الاجتماعات', 'دورة قصيرة وخفيفة. بضع جولات تكفي لاستعادة انتباهك.'],
    'wake':  ['استيقاظ', 'لتصفية الذهن صباحًا', 'الشهيق أطول من الزفير. هذا النمط ينشّط الجسم بلطف؛ جرّبه صباحًا أو عند الخمول بعد الظهر.'],
    'morning':['انتعاش الصباح', 'بداية منعشة لليوم', 'شهيق عميق وحبس قصير وزفير سريع. بضع جولات قبل قهوتك.'],
    'boost': ['نشاط', 'دفعة سريعة من الطاقة', 'أنفاس سريعة ومتساوية. إذا شعرت بالدوار فتوقف وعد إلى تنفسك الطبيعي.'],
    'quick': ['تنشيط سريع', 'استراحة طاقة لمدة دقيقة', 'دورة قصيرة وسريعة جدًا. مارسها جالسًا واكتفِ ببضع جولات.'],
    'sos':   ['إسعاف القلق', 'فور ارتفاع القلق', 'شهيق قصير وزفير بضعف طوله. أسرع طريقة للهدوء عندما تبدأ ضربات قلبك بالتسارع.'],
    'stress':['تخفيف التوتر', 'في منتصف يوم مزدحم', 'زفير طويل مدعوم بفترات حبس. أرخِ كتفيك وركّز على نفَسك فقط.'],
    'body':  ['جسد مرتاح', 'تحرير التوتر من الجسد', 'مع كل زفير تخيّل أنك ترخي منطقة متوترة (الفك، الكتفين، البطن). ليس علاجًا للألم لكنه يساعد على الاسترخاء.'],
    'urge':  ['استراحة الرغبة', 'لتجاوز رغبة مفاجئة', 'عندما تأتيك رغبة ملحّة تنفّس بهذا الإيقاع لبضع دقائق؛ الرغبات عادةً ترتفع ثم تمضي كالموج.'],
    'reset': ['تجدّد', 'بعد جدال أو حديث صعب', 'دورة متوازنة تعيد الجسم إلى إيقاع هادئ.'],
    'lung1': ['الرئة · سهل', 'مدخل إلى سعة التنفس', 'يقوّي عضلات التنفس مع فترات حبس مريحة. مارس بضع جولات يوميًا.'],
    'lung2': ['الرئة · متوسط', 'إطالة فترة الحبس', 'حبس أطول يتحدى سعة رئتيك. عد إلى المستوى السهل إن شعرت بإجهاد.'],
    'lung3': ['الرئة · صعب', 'حبس طويل لأصحاب الخبرة', 'يتضمن حبسًا طويلًا للنفَس. تجنّبه أثناء الحمل أو إن كانت لديك مشكلات في القلب أو الرئة أو ضغط الدم.'],
    'end1':  ['التحمّل · سهل', 'تمرين تنفس طويل ومتوازن', 'أربع خطوات متساوية. دعم للتنفس في الجري والسباحة والرياضات المشابهة.'],
    'end2':  ['التحمّل · متوسط', 'دورات متساوية أطول', 'كل خطوة أطول من المستوى السهل. حاول الاستمرار دون إجهاد.'],
    'end3':  ['التحمّل · صعب', 'يتطلب صبرًا وتحكمًا', 'خطوات طويلة ومتساوية. توقّف فورًا إذا شعرت بالدوار.'],
    'sing1': ['للمغنّين · واسع', 'زفير طويل ومتحكَّم به', 'يدرّب على التحكم في الزفير لغناء جمل طويلة بنفَس واحد. جرّب صوت "سسس" خفيفًا أثناء الزفير.'],
    'sing2': ['للمغنّين · سريع', 'شهيق سريع وزفير طويل', 'يدرّب على أخذ نفَس سريع بين المقاطع وجعله يدوم طويلًا.'],
  };
  window.NEFES_DEFAULTS.exercises.forEach(e => { const a = AR[e.id]; if(a){ e.name_ar = a[0]; e.short_ar = a[1]; e.desc_ar = a[2] } });

  window.NEFES_DEFAULTS.content_ar = {
    homeTitle: 'التمارين',
    homeHint: 'اضغط على تمرين لضبط مدّته، واستخدم الدائرة لاختياره مباشرة. اسحب المقبض لتغيير الترتيب.',
    benefitsTitle: 'ما فائدة تمارين التنفس؟',
    benefits: [
      'التنفس من الوظائف التلقائية القليلة في الجسم التي يمكننا التحكم فيها بوعي. إبطاء التنفس، وخاصة إطالة الزفير، يُبرز نظام الراحة والتعافي في الجسم (الجهاز العصبي الباراسمبثاوي). فتتباطأ ضربات القلب وتسترخي العضلات ويهدأ الذهن.',
      '',
      '## ماذا تقول الأبحاث؟',
      '- **التوتر والقلق:** في دراسة لجامعة ستانفورد عام 2023، تحسّن مزاج من مارسوا تمارين التنفس 5 دقائق يوميًا لمدة شهر وانخفض قلقهم. وكان للنمط ذي الزفير الأطول التأثير الأقوى.',
      '- **القلب والدورة الدموية:** التنفس البطيء بمعدل ست أنفاس تقريبًا في الدقيقة يرفع تقلّب معدل ضربات القلب في دراسات كثيرة، وهو مؤشر على قدرة الجسم على التكيّف مع التوتر.',
      '- **النوم:** التنفس البطيء قبل النوم يهدئ الذهن وقد يسهّل الاستغراق في النوم.',
      '- **التركيز:** الإيقاع المتساوي (مثل تنفس المربع) يساعد على جمع الانتباه والهدوء تحت الضغط.',
      '',
      '## كيف تمارسها؟',
      '- اجلس أو استلقِ بشكل مريح وأرخِ كتفيك.',
      '- تنفّس من أنفك إن أمكن، ويمكنك فتح شفتيك قليلًا أثناء الزفير.',
      '- اجعل بطنك يرتفع بدلًا من صدرك.',
      '- ابدأ ببضع دقائق يوميًا. الانتظام أهم من طول المدة.',
    ].join('\n'),
    warning: '**تنبيه:** إذا شعرت بدوار أو تنميل أو ضيق في التنفس فتوقف وعد إلى تنفسك الطبيعي. إذا كنتِ حاملًا أو لديك مرض في القلب أو الرئة أو ارتفاع في ضغط الدم أو اضطراب الهلع، فاجعل فترات الحبس قصيرة (أو صفرًا) واستشر طبيبك. هذا التطبيق للمعلومات فقط ولا يغني عن العلاج الطبي.',
    sources: 'المصادر: Balban وآخرون، Cell Reports Medicine ‏(2023)، [Stanford Medicine](https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html)؛ Laborde وآخرون، تحليل تلوي حول التنفس البطيء وتقلّب معدل ضربات القلب (2022)؛ [Mindfulness (2023)](https://link.springer.com/article/10.1007/s12671-023-02294-2).',
  };
  window.NEFES_DEFAULTS.notify_ar = { title: 'حان وقت التنفس', body: 'نمط {duzen}، {tur} جولات، حوالي {sure} دقيقة.' };
})();

/* ---------- Almanca içerik ---------- */
(function(){
  const DE_CATS = { calm: 'Ruhe', sleep: 'Schlaf', focus: 'Fokus', energy: 'Energie', stress: 'Angst & Stress', lung: 'Lungentraining', voice: 'Stimme & Gesang' };
  window.NEFES_CATEGORIES.forEach(c => { c.de = DE_CATS[c.id] });
  const DE = {
    '478':   ['Entspannen', 'Tiefe Entspannung und leichter Einschlafen', 'Die 4-7-8-Technik, bekannt gemacht von Dr. Andrew Weil. Langes Halten und ein noch längeres Ausatmen verlangsamen den Herzschlag und bringen den Körper in den Ruhemodus. Die Belege stammen aus kleinen Studien und deuten auf niedrigeren Puls und weniger Angst hin.'],
    'calm':  ['Ruhe', 'Schnell zur Ruhe kommen in wenigen Minuten', 'Ein kurzes Muster, bei dem das Ausatmen länger ist als das Einatmen. Langes Ausatmen gehört zu den stärksten Auslösern der Beruhigungsreaktion des Körpers.'],
    'bal':   ['Balance', 'Resonanzatmung für einen ruhigen Herzschlag', 'Fünf Sekunden ein, fünf Sekunden aus: sechs Atemzüge pro Minute. Der am besten untersuchte Rhythmus; regelmäßig geübt erhöht er die Herzratenvariabilität. Ohne Atemhalten, daher für alle geeignet.'],
    'eq':    ['Gleichmäßiges Atmen', 'Der einfachste Rhythmus zum Einstieg', 'Ein- und Ausatmen sind gleich lang. Ein guter erster Schritt, um den Atem wahrzunehmen und die Gedanken zu sammeln.'],
    'long':  ['Langes Ausatmen', 'Durch längeres Ausatmen zur Ruhe kommen', 'Das Ausatmen ist doppelt so lang wie das Einatmen. Wirkt in angespannten Momenten wie ein sanfter Druck auf die Bremse des Körpers.'],
    '711':   ['7/11-Atmung', 'Ein langsamer, langer Zyklus', 'Sieben Sekunden ein, elf aus. Verlangsamt den Atem stark; wenn es schwerfällt, beginne mit Langes Ausatmen.'],
    'wave':  ['Sanfte Welle', 'Ein fließender Rhythmus wie eine Welle', 'Sanftes Einatmen, kurze Pause, langes Ausatmen. Zum Ausruhen des Kopfes zwischendurch.'],
    'deep':  ['Tief', 'Lange, tiefe Atemzüge vor der Meditation', 'Ein langsamer, tiefer, langer Zyklus. Gut, um den Geist vor Meditation oder Dehnen zu beruhigen.'],
    'sleep': ['Einschlafen', 'Ein paar Minuten vor dem Schlafengehen', 'Langes Ausatmen und kurzes Halten bereiten den Körper auf den Schlaf vor. Im Bett bei ausgeschaltetem Licht.'],
    'sleep2':['Tiefschlaf', 'Ein langsamer Zyklus zum Einschlafen', 'Ein sehr langsamer Rhythmus. Auch hilfreich, um nachts wieder einzuschlafen.'],
    'night': ['Nachtruhe', 'Den Tag hinter dir lassen', 'Eine kurze Pause nach dem Ausatmen ahmt die natürliche Atempause nach und verlangsamt den Geist.'],
    'box':   ['Box', 'Fokus und Ruhe unter Druck', 'Ein, halten, aus, halten; alles gleich lang. Sportler, Piloten und Soldaten nutzen sie, um unter Druck fokussiert zu bleiben.'],
    'box6':  ['Große Box', 'Eine längere, tiefere Box-Atmung', 'Eine langsamere Version der Box-Atmung. Probiere sie, wenn dir die Box-Atmung leichtfällt.'],
    'focus': ['Fokus', 'Bevor du mit der Arbeit beginnst', 'Gleich langes Ein-, Halten und Ausatmen. Hilft, verstreute Gedanken vor konzentrierter Arbeit zu sammeln.'],
    'clear': ['Klarer Kopf', 'Eine kurze Pause zum Durchatmen', 'Ein ausgewogener Rhythmus mit sanftem Halten. Gut mitten in einer langen Arbeitsphase.'],
    'study': ['Lernpause', 'Zwischen Unterricht oder Meetings', 'Ein kurzer, leichter Zyklus. Ein paar Runden reichen, um die Aufmerksamkeit neu auszurichten.'],
    'wake':  ['Aufwachen', 'Morgens den Kopf frei bekommen', 'Das Einatmen ist länger als das Ausatmen. Das belebt sanft; probiere es morgens oder beim Nachmittagstief.'],
    'morning':['Morgenfrische', 'Ein frischer Start in den Tag', 'Tiefes Einatmen, kurzes Halten, schnelles Ausatmen. Ein paar Runden vor dem Kaffee.'],
    'boost': ['Energie', 'Ein schneller Energieschub', 'Schnelle, gleichmäßige Atemzüge. Wenn dir schwindlig wird, hör auf und atme normal weiter.'],
    'quick': ['Schneller Kick', 'Eine Energiepause in einer Minute', 'Ein sehr kurzer, schneller Zyklus. Im Sitzen und nur wenige Runden.'],
    'sos':   ['Angst-SOS', 'Sofort, wenn die Angst steigt', 'Kurzes Einatmen und doppelt so langes Ausatmen. Der schnellste Weg zur Ruhe, wenn das Herz zu rasen beginnt.'],
    'stress':['Stress abbauen', 'Mitten in einem vollen Tag', 'Langes Ausatmen mit Haltephasen. Lass die Schultern sinken und konzentriere dich nur auf den Atem.'],
    'body':  ['Entspannter Körper', 'Anspannung aus dem Körper lösen', 'Stell dir bei jedem Ausatmen vor, wie sich ein angespannter Bereich (Kiefer, Schultern, Bauch) löst. Keine Schmerzbehandlung, aber eine Hilfe zur Entspannung.'],
    'urge':  ['Impulspause', 'Ein plötzliches Verlangen überstehen', 'Atme bei einem starken Verlangen einige Minuten in diesem Rhythmus; solche Impulse kommen und gehen meist wie eine Welle.'],
    'reset': ['Neustart', 'Nach einem Streit oder schwierigen Gespräch', 'Ein ausgewogener Zyklus, der den Körper zurück in einen ruhigen Rhythmus bringt.'],
    'lung1': ['Lunge · Leicht', 'Einstieg in die Atemkapazität', 'Trainiert die Atemmuskulatur mit angenehmen Haltephasen. Täglich ein paar Runden.'],
    'lung2': ['Lunge · Mittel', 'Längeres Halten aufbauen', 'Längeres Halten fordert deine Kapazität. Geh zurück zu Leicht, wenn es anstrengend wird.'],
    'lung3': ['Lunge · Schwer', 'Langes Halten für Erfahrene', 'Enthält langes Atemhalten. Nicht in der Schwangerschaft oder bei Herz-, Lungen- oder Blutdruckproblemen.'],
    'end1':  ['Ausdauer · Leicht', 'Lange, gleichmäßige Atemübung', 'Vier gleich lange Schritte. Atemunterstützung für Laufen, Schwimmen und ähnliche Sportarten.'],
    'end2':  ['Ausdauer · Mittel', 'Längere gleichmäßige Zyklen', 'Jeder Schritt ist länger als bei Leicht. Versuche durchzuhalten, ohne zu forcieren.'],
    'end3':  ['Ausdauer · Schwer', 'Erfordert Geduld und Kontrolle', 'Lange, gleiche Schritte. Sofort aufhören, wenn dir schwindlig wird.'],
    'sing1': ['Für Sänger · Weit', 'Langes, kontrolliertes Ausatmen', 'Trainiert kontrolliertes Ausatmen, um lange Phrasen in einem Atemzug zu singen. Probiere beim Ausatmen ein leises „sss“.'],
    'sing2': ['Für Sänger · Schnell', 'Schnell ein, lange aus', 'Übt, zwischen Zeilen schnell Luft zu holen und sie lange zu nutzen.'],
  };
  window.NEFES_DEFAULTS.exercises.forEach(e => { const a = DE[e.id]; if(a){ e.name_de = a[0]; e.short_de = a[1]; e.desc_de = a[2] } });

  window.NEFES_DEFAULTS.content_de = {
    homeTitle: 'Übungen',
    homeHint: 'Tippe auf eine Übung, um die Zeiten anzupassen; mit dem Kreis rechts wählst du sie direkt aus. Zum Sortieren am Griff links ziehen.',
    benefitsTitle: 'Was bewirken Atemübungen?',
    benefits: [
      'Die Atmung ist eine der wenigen automatischen Körperfunktionen, die wir bewusst steuern können. Langsameres Atmen und vor allem ein längeres Ausatmen stärken das Ruhe- und Erholungssystem des Körpers (den Parasympathikus). Das Herz schlägt langsamer, die Muskeln entspannen sich und der Geist wird ruhiger.',
      '',
      '## Was sagt die Forschung?',
      '- **Stress und Angst:** In einer Studie der Stanford University von 2023 hatten Menschen, die einen Monat lang täglich 5 Minuten Atemübungen machten, bessere Stimmung und weniger Angst. Das Muster mit längerem Ausatmen wirkte am stärksten.',
      '- **Herz und Kreislauf:** Langsames Atmen mit etwa sechs Atemzügen pro Minute erhöht in vielen Studien die Herzratenvariabilität, ein Zeichen dafür, wie gut sich der Körper an Stress anpasst.',
      '- **Schlaf:** Langsames Atmen vor dem Schlafengehen beruhigt den Geist und kann das Einschlafen erleichtern.',
      '- **Fokus:** Ein gleichmäßiger Rhythmus (etwa die Box-Atmung) hilft, die Aufmerksamkeit zu bündeln und unter Druck ruhig zu bleiben.',
      '',
      '## So geht es',
      '- Setz oder leg dich bequem hin und entspanne die Schultern.',
      '- Atme wenn möglich durch die Nase ein; beim Ausatmen kannst du die Lippen leicht öffnen.',
      '- Lass den Bauch statt der Brust sich heben.',
      '- Beginne mit wenigen Minuten am Tag. Regelmäßigkeit ist wichtiger als Dauer.',
    ].join('\n'),
    warning: '**Hinweis:** Wenn dir schwindlig wird, du Kribbeln oder Atemnot spürst, hör auf und atme normal weiter. Bei Schwangerschaft, Herz- oder Lungenerkrankungen, Bluthochdruck oder Panikstörung halte die Haltephasen kurz (oder auf 0) und sprich mit deiner Ärztin oder deinem Arzt. Diese App dient nur der Information und ersetzt keine medizinische Behandlung.',
    sources: 'Quellen: Balban et al., Cell Reports Medicine (2023), [Stanford Medicine](https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html); Laborde et al., Metaanalyse zu langsamem Atmen und Herzratenvariabilität (2022); [Mindfulness (2023)](https://link.springer.com/article/10.1007/s12671-023-02294-2).',
  };
  window.NEFES_DEFAULTS.notify_de = { title: 'Zeit zum Atmen', body: '{duzen}-Muster, {tur} Runden, etwa {sure} Minuten.' };
})();

/* ---------- Bölgeye göre para birimi ---------- */
Object.assign(window.NEFES_DEFAULTS.billing, {
  EUR: { monthly: 4.29, yearly: 30.99, lifetime: 159.99 },
  SAR: { monthly: 16.99, yearly: 124.99, lifetime: 639.99 },
  AED: { monthly: 14.99, yearly: 109.99, lifetime: 569.99 },
});
window.NEFES_CURRENCIES = ['TRY','EUR','SAR','AED','USD'];
/* Ülke: önce telefonun bölge ayarı (ör. ar-SA, de-DE), yoksa saat dilimi. Para birimi: TR→TRY, SA→SAR, AE→AED, euro bölgesi→EUR, diğerleri→USD */
window.nefesCountry = function(){
  const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
  for(const l of langs){ const m = String(l).match(/[-_]([A-Za-z]{2})\b/); if(m) return m[1].toUpperCase() }
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  const TZ = { 'Europe/Istanbul':'TR', 'Asia/Istanbul':'TR', 'Asia/Riyadh':'SA', 'Asia/Dubai':'AE', 'Europe/Berlin':'DE', 'Europe/Vienna':'AT', 'Europe/Paris':'FR', 'Europe/Amsterdam':'NL', 'Europe/Brussels':'BE', 'Europe/Rome':'IT', 'Europe/Madrid':'ES', 'Europe/Dublin':'IE', 'Europe/Helsinki':'FI', 'Europe/Lisbon':'PT', 'Europe/Athens':'GR', 'Europe/Luxembourg':'LU', 'Europe/Bratislava':'SK', 'Europe/Ljubljana':'SI', 'Europe/Tallinn':'EE', 'Europe/Riga':'LV', 'Europe/Vilnius':'LT', 'Europe/Malta':'MT', 'Asia/Nicosia':'CY', 'Europe/Zagreb':'HR' };
  return TZ[tz] || '';
};
window.nefesCurrency = function(){
  const c = window.nefesCountry();
  const EURO = ['DE','AT','FR','NL','BE','IT','ES','IE','FI','PT','GR','LU','SK','SI','EE','LV','LT','MT','CY','HR'];
  if(c === 'TR') return 'TRY';
  if(c === 'SA') return 'SAR';
  if(c === 'AE') return 'AED';
  if(EURO.includes(c)) return 'EUR';
  if(!c && window.nefesLang === 'tr') return 'TRY';
  if(!c && window.nefesLang === 'de') return 'EUR';
  return 'USD';
};
