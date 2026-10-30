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

import android.content.res.Configuration;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(FerahWindow.class);
        // Önce uygulama teması kurulsun (BridgeActivity), pencere süslemesi açılış temasıyla oluşmasın
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        FerahWindow.reapply(this);
    }

    // SystemBars eklentisi stil değişince zemini temanın rengine sıfırlıyor; ardından bizim rengimizi geri koy
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        FerahWindow.reapply(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        FerahWindow.reapply(this);
    }
}
`);
writeFileSync(jdir + 'FerahWindow.java', `package com.emreakpinar.nefesapp;

import android.app.Activity;
import android.graphics.Color;
import android.view.View;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "FerahWindow")
public class FerahWindow extends Plugin {
    static int color = Color.parseColor("#DDE2D6");
    static View webView;

    @Override
    public void load() {
        webView = getBridge().getWebView();
        reapply(getActivity());
    }

    static void paint(Activity a) {
        try {
            View d = a.getWindow().getDecorView();
            d.setBackgroundColor(color);
            // Sistemin durum/gezinme çubuğu arka plan görünümleri (açılış görseli burada kalabiliyordu)
            View sb = d.findViewById(android.R.id.statusBarBackground);
            if (sb != null) sb.setBackgroundColor(color);
            View nb = d.findViewById(android.R.id.navigationBarBackground);
            if (nb != null) nb.setBackgroundColor(color);
            View content = d.findViewById(android.R.id.content);
            for (View v = content; v != null && v != d; v = (v.getParent() instanceof View) ? (View) v.getParent() : null) v.setBackgroundColor(color);
            if (webView != null) webView.setBackgroundColor(color);
        } catch (Exception e) { }
    }

    // Hemen ve SystemBars'ın ana iş parçacığına koyduğu sıfırlamadan sonra tekrar boya
    static void reapply(final Activity a) {
        final View d = a.getWindow().getDecorView();
        d.post(() -> paint(a));
        d.postDelayed(() -> paint(a), 150);
        d.postDelayed(() -> paint(a), 600);
    }

    @PluginMethod
    public void setBackground(PluginCall call) {
        try { color = Color.parseColor(call.getString("color", "#DDE2D6")); } catch (Exception e) { }
        reapply(getActivity());
        call.resolve();
    }
}
`);

// Uygulama teması: zemin rengi sabit (DayNight teması koyu modda siyah veriyordu)
const vals = 'android/app/src/main/res/values/';
writeFileSync(vals + 'ferah_colors.xml', '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ferah_bg">#DDE2D6</color>\n</resources>\n');
let st = readFileSync(vals + 'styles.xml', 'utf8');
// Açılış teması: "android:background" tema özniteliği tüm görünümlere miras geçer (üstteki koyu şerit). Yalnızca pencere zemini olsun.
st = st.replace('<item name="android:background">@drawable/splash</item>', '<item name="android:windowBackground">@drawable/splash</item>\n        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>');
if(!st.includes('ferah_bg')) st = st.replace('<item name="android:background">@null</item>', '<item name="android:background">@null</item>\n        <item name="android:windowBackground">@color/ferah_bg</item>\n        <item name="android:statusBarColor">@android:color/transparent</item>');
writeFileSync(vals + 'styles.xml', st);

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
