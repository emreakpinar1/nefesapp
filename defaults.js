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
  TRY: { monthly: 69, yearly: 499, lifetime: 4990 },
  USD: { monthly: 3.99, yearly: 29, lifetime: 149 },
};
