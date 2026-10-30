// CI ve yerel derleme için Android projesini hazırlar: platformu ekler, simgeleri üretir, sessiz bildirim sesini kopyalar.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs';
const run = c => execSync(c, { stdio: 'inherit' });
mkdirSync('www', { recursive: true });
writeFileSync('www/index.html', '<!doctype html><meta charset="utf-8"><title>Ferah</title><p>Ferah yükleniyor…</p>');
if(!existsSync('android')) run('npx cap add android');
run("npx capacitor-assets generate --android --iconBackgroundColor '#161813' --iconBackgroundColorDark '#161813' --splashBackgroundColor '#EEF6DC' --splashBackgroundColorDark '#0F110C'");
mkdirSync('android/app/src/main/res/raw', { recursive: true });
copyFileSync('res/silent.wav', 'android/app/src/main/res/raw/nefes_silent.wav');

// Kenardan kenara ekran (Android 15+ zorunlu; eski sürümlerde de aynı görünüm)
const act = 'android/app/src/main/java/com/emreakpinar/nefesapp/MainActivity.java';
writeFileSync(act, `package com.emreakpinar.nefesapp;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
`);

// Hatırlatıcılar dakikası dakikasına olmak zorunda değil: "kesin alarm" iznini kaldır (Play beyanı gerektirmez)
const man = 'android/app/src/main/AndroidManifest.xml';
let m = readFileSync(man, 'utf8');
if(!m.includes('xmlns:tools')) m = m.replace('<manifest xmlns:android="http://schemas.android.com/apk/res/android"', '<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools"');
if(!m.includes('SCHEDULE_EXACT_ALARM')) m = m.replace('<uses-permission android:name="android.permission.INTERNET" />', '<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" tools:node="remove" />');
writeFileSync(man, m);

// Sürüm: VERSION_CODE (CI'da çalıştırma numarası) ve VERSION_NAME
const gb = 'android/app/build.gradle';
let g = readFileSync(gb, 'utf8');
const vc = parseInt(process.env.VERSION_CODE || '1', 10) || 1, vn = process.env.VERSION_NAME || '1.0.' + vc;
g = g.replace(/versionCode \d+/, 'versionCode ' + vc).replace(/versionName "[^"]*"/, 'versionName "' + vn + '"');
writeFileSync(gb, g);

run('npx cap sync android');
