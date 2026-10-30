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
