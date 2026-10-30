# index.html'i tools/shell.html + çekirdek betik + tools/ui.js'den üretir.
import re, sys
src = open('index.html', encoding='utf8').read()
core = re.findall(r'<script>\n?(\(\(\) => \{.*?\}\)\(\);)\s*</script>', src, re.S)
assert len(core) >= 1, 'core not found'
core = core[0]
def rep(a, b):
    global core
    assert core.count(a) == 1, (core.count(a), a[:80])
    core = core.replace(a, b)
if 'nefes:stats' not in core:
    rep("  $('dots').innerHTML = Array.from({length:10}, (_,i) => `<i class=\"${i < m ? 'on':''}\"></i>`).join('');\n}",
        "  $('dots').innerHTML = Array.from({length:10}, (_,i) => `<i class=\"${i < m ? 'on':''}\"></i>`).join('');\n  document.dispatchEvent(new Event('nefes:stats'));\n}")
    rep("  store.set('nefes-cfg', cfg);\n}", "  store.set('nefes-cfg', cfg);\n  document.dispatchEvent(new Event('nefes:cfg'));\n}")
    rep("ayarla'}</span></button>`;\n}", "ayarla'}</span></button>`;\n  document.dispatchEvent(new Event('nefes:cfg'));\n}")
    rep("function renderNext(){", "function renderNext(){\n  queueMicrotask(() => document.dispatchEvent(new Event('nefes:rem')));")
    rep("function setPlayIcon(){", "function setPlayIcon(){\n  queueMicrotask(() => document.dispatchEvent(new Event('nefes:play')));")
    rep("  onNativeReady(){", """  getPresets(){ return PRESETS.map(p => ({ ...p, cfg: { ...p.cfg } })) },
  getCfg(){ return { ...cfg } },
  applyPreset(id){ const p = PRESETS.find(x => x.id === id); if(!p) return; touched = true; Object.assign(cfg, p.cfg); refreshAll() },
  start(){ if(!S.running) start(); else if(S.paused) resume() },
  isRunning(){ return S.running && !S.paused },
  getNext(){ return { k: $('nextK').textContent, v: $('nextV').textContent, on: rem.on } },
  onNativeReady(){""")
    # header no longer has a dedicated alarm-focus button style change; nothing else needed
ui = open('tools/ui.js', encoding='utf8').read()
shell = open('tools/shell.html', encoding='utf8').read()
out = shell.replace('{{CORE}}', core).replace('{{UI}}', ui)
open('index.html', 'w', encoding='utf8').write(out)
print('ok', len(out))
