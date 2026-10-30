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
const jdir = 'android/app/src/main/java/com/emreakpinar/nefesapp/';
writeFileSync(jdir + 'MainActivity.java', `package com.emreakpinar.nefesapp;

import android.graphics.Color;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(FerahWindow.class);
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        // Durum çubuğu boşluğunda açılış görseli yerine uygulamanın zemin rengi görünsün
        getWindow().getDecorView().setBackgroundColor(Color.parseColor("#DDE2D6"));
    }
}
`);
writeFileSync(jdir + 'FerahWindow.java', `package com.emreakpinar.nefesapp;

import android.graphics.Color;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "FerahWindow")
public class FerahWindow extends Plugin {
    @PluginMethod
    public void setBackground(PluginCall call) {
        final String c = call.getString("color", "#DDE2D6");
        getActivity().runOnUiThread(() -> {
            try {
                int col = Color.parseColor(c);
                getActivity().getWindow().getDecorView().setBackgroundColor(col);
                if (getBridge().getWebView() != null) getBridge().getWebView().setBackgroundColor(col);
            } catch (Exception e) { }
            call.resolve();
        });
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
