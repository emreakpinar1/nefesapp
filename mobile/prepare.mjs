// CI ve yerel derleme için Android projesini hazırlar: platformu ekler, simgeleri üretir, sessiz bildirim sesini kopyalar.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
const run = c => execSync(c, { stdio: 'inherit' });
mkdirSync('www', { recursive: true });
writeFileSync('www/index.html', '<!doctype html><meta charset="utf-8"><title>NefesApp</title><p>NefesApp yükleniyor…</p>');
if(!existsSync('android')) run('npx cap add android');
run("npx capacitor-assets generate --android --iconBackgroundColor '#161813' --iconBackgroundColorDark '#161813' --splashBackgroundColor '#EEF6DC' --splashBackgroundColorDark '#0F110C'");
mkdirSync('android/app/src/main/res/raw', { recursive: true });
copyFileSync('res/silent.wav', 'android/app/src/main/res/raw/nefes_silent.wav');
run('npx cap sync android');
