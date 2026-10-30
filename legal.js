// Yasal sayfalar: uygulamada seçili dil Türkçe ise TR, değilse EN gösterilir. ?lang=tr|en ile zorlanabilir.
(function(){
  var q = (location.search.match(/[?&]lang=(tr|en)\b/) || [])[1], l = q;
  if(!l){ try{ l = localStorage.getItem('nefes-lang') }catch(e){} }
  if(!l) l = (navigator.language || '').toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
  if(l !== 'tr') l = 'en';
  function set(x){
    document.documentElement.lang = x;
    document.querySelectorAll('[data-l]').forEach(function(el){ el.hidden = el.getAttribute('data-l') !== x });
    document.querySelectorAll('.langs button').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.set === x) });
    var t = document.querySelector('article[data-l="' + x + '"] h1');
    if(t) document.title = t.textContent + ' · Ferah';
  }
  document.addEventListener('DOMContentLoaded', function(){
    set(l);
    document.querySelectorAll('.langs button').forEach(function(b){ b.addEventListener('click', function(){ set(b.dataset.set) }) });
  });
})();
