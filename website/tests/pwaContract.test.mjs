import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

if (!globalThis.window) globalThis.window = globalThis;

const { detectPlatform } = await import('../public/simulator/js/pwa/installPrompt.js');

test('manifest.webmanifest defines standalone NammaRide app scoped strictly to /app/', () => {
    const manifestPath = path.resolve('public/simulator/manifest.webmanifest');
    assert.ok(fs.existsSync(manifestPath), 'Missing public/simulator/manifest.webmanifest');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    assert.equal(manifest.name, 'NammaRide');
    assert.equal(manifest.short_name, 'NammaRide');
    assert.equal(manifest.description, 'Bengaluru Metro Journey Companion');
    assert.equal(manifest.id, '/app/');
    assert.equal(manifest.start_url, '/app/');
    assert.equal(manifest.scope, '/app/');
    assert.equal(manifest.display, 'standalone');
    assert.equal(manifest.orientation, 'portrait');

    const iconEntries = manifest.icons || [];
    const has192 = iconEntries.some(i => i.sizes === '192x192' && i.type === 'image/png' && (i.purpose || 'any').includes('any'));
    const has512 = iconEntries.some(i => i.sizes === '512x512' && i.type === 'image/png' && (i.purpose || 'any').includes('any'));
    const hasMaskable = iconEntries.some(i => i.sizes === '512x512' && i.type === 'image/png' && i.purpose === 'maskable');
    assert.ok(has192, 'Expected 192x192 PNG icon');
    assert.ok(has512, 'Expected 512x512 PNG icon');
    assert.ok(hasMaskable, 'Expected 512x512 maskable PNG icon');

    for (const icon of iconEntries) {
        const iconFile = path.resolve('public/simulator', icon.src);
        assert.ok(fs.existsSync(iconFile), `Missing icon file: ${iconFile}`);
    }
    const appleIcon = path.resolve('public/simulator/assets/icons/apple-touch-icon.png');
    assert.ok(fs.existsSync(appleIcon), 'Missing 180x180 apple-touch-icon.png');
});

test('Generated PWA and Apple icons have exact PNG dimensions', () => {
    const expected = [
        ['public/simulator/assets/icons/icon-192x192.png', 192, 192],
        ['public/simulator/assets/icons/icon-512x512.png', 512, 512],
        ['public/simulator/assets/icons/icon-512x512-maskable.png', 512, 512],
        ['public/simulator/assets/icons/apple-touch-icon.png', 180, 180],
    ];
    for (const [relPath, w, h] of expected) {
        const buf = fs.readFileSync(path.resolve(relPath));
        assert.equal(buf.readUInt32BE(16), w, `${relPath} width mismatch`);
        assert.equal(buf.readUInt32BE(20), h, `${relPath} height mismatch`);
    }
});

test('vercel.json routes /app/ to dedicated simulator app shell and isolates marketing SPA', () => {
    for (const cfgPath of [path.resolve('vercel.json'), path.resolve('../vercel.json')]) {
        const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
        assert.ok(cfg.redirects?.some(r => r.source === '/app' && r.destination === '/app/'), `Missing /app redirect in ${cfgPath}`);
        assert.ok(cfg.rewrites?.some(r => r.source === '/app/' && r.destination === '/simulator/index.html'), `Missing /app/ rewrite in ${cfgPath}`);
        assert.ok(cfg.rewrites?.some(r => r.source === '/app/(.*)' && r.destination === '/simulator/index.html'), `Missing /app/(.*) deep-route fallback in ${cfgPath}`);
    }
});

test('simulator/index.html configures iOS standalone meta, viewport-fit=cover, and manifest.webmanifest', () => {
    const html = fs.readFileSync(path.resolve('public/simulator/index.html'), 'utf8');
    assert.match(html, /viewport-fit=cover/);
    assert.match(html, /name="apple-mobile-web-app-capable"\s+content="yes"/);
    assert.match(html, /name="apple-mobile-web-app-title"\s+content="NammaRide"/);
    assert.match(html, /name="apple-mobile-web-app-status-bar-style"\s+content="black-translucent"/);
    assert.match(html, /rel="apple-touch-icon"\s+sizes="180x180"\s+href="assets\/icons\/apple-touch-icon\.png"/);
    assert.match(html, /rel="manifest"\s+href="manifest\.webmanifest"/);
    assert.match(html, /id="pwa-install-sheet-root"/);
});

test('sw.js precaches manifest.webmanifest, icons, installPrompt.js, and handles navigation offline', () => {
    const sw = fs.readFileSync(path.resolve('public/simulator/sw.js'), 'utf8');
    assert.match(sw, /manifest\.webmanifest/);
    assert.match(sw, /installPrompt\.js/);
    assert.match(sw, /icon-192x192\.png/);
    assert.match(sw, /apple-touch-icon\.png/);
    assert.match(sw, /event\.request\.mode === 'navigate'/);
});

test('Platform detection distinguishes iOS Safari, iOS Chrome, Android (Play Store only), and Desktop', () => {
    const iosSafari = detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1', 'iPhone', 5);
    assert.equal(iosSafari.isIOS, true);
    assert.equal(iosSafari.isAndroid, false);
    assert.equal(iosSafari.iosBrowser, 'safari');

    const iosChrome = detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.0.0 Mobile/15E148 Safari/604.1', 'iPhone', 5);
    assert.equal(iosChrome.isIOS, true);
    assert.equal(iosChrome.iosBrowser, 'chrome');

    const ipadDesktopUa = detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', 'MacIntel', 5);
    assert.equal(ipadDesktopUa.isIOS, true);
    assert.equal(ipadDesktopUa.isIPad, true);

    const androidChrome = detectPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36', 'Linux armv8l', 5);
    assert.equal(androidChrome.isAndroid, true);
    assert.equal(androidChrome.isIOS, false);

    const desktopChrome = detectPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'Win32', 0);
    assert.equal(desktopChrome.isDesktop, true);
    assert.equal(desktopChrome.isIOS, false);
    assert.equal(desktopChrome.isAndroid, false);
});

test('Android web UX enforces Google Play only and website banner is responsive across mobile, tablet, and laptop', () => {
    const installPromptSrc = fs.readFileSync(path.resolve('public/simulator/js/pwa/installPrompt.js'), 'utf8');
    const mobileBannerSrc = fs.readFileSync(path.resolve('src/components/MobileAppBanner.jsx'), 'utf8');
    assert.match(installPromptSrc, /play\.google\.com\/store\/apps\/details\?id=site\.nammaride\.app/);
    assert.match(installPromptSrc, /if \(plat\.isAndroid\)[\s\S]*PLAY_STORE_URL[\s\S]*return;/);
    assert.match(mobileBannerSrc, /if \(platform\.isAndroid\)/);
    assert.match(mobileBannerSrc, /if \(platform\.isIOS\)/);
    assert.doesNotMatch(mobileBannerSrc, /\bmd:hidden\b/);
    assert.match(mobileBannerSrc, /sm:max-w-md/);
    assert.match(mobileBannerSrc, /lg:right-5/);
});

test('Web/PWA notifications use ServiceWorker showNotification + notificationclick and support web alarm timers', async () => {
    const sw = fs.readFileSync(path.resolve('public/simulator/sw.js'), 'utf8');
    assert.match(sw, /addEventListener\('notificationclick'/);

    const hud = fs.readFileSync(path.resolve('public/simulator/js/ui/boardingHud.js'), 'utf8');
    assert.match(hud, /id="set-alarm-btn"/);
    assert.match(hud, /id="set-tomorrow-alarm-btn"/);
    assert.match(hud, /id="dismiss-alarm-btn"/);

    const notifSrc = fs.readFileSync(path.resolve('public/simulator/js/logic/notificationEngine.js'), 'utf8');
    assert.match(notifSrc, /showNotification/);
    assert.match(notifSrc, /scheduleCustomAlarm/);

    const installPromptSrc = fs.readFileSync(path.resolve('public/simulator/js/pwa/installPrompt.js'), 'utf8');
    assert.match(installPromptSrc, /navigator\.share\(/);
    assert.match(installPromptSrc, /id="nr-pwa-share-now-btn"/);

    const { notificationController } = await import('../public/simulator/js/logic/notificationEngine.js');
    notificationController.resetAll();
    const scheduled = await notificationController.scheduleCustomAlarm({
        id: 1005,
        dedupKey: 'test_web_alarm',
        targetMs: Date.now() + 60000,
        title: 'Test Station Alarm',
        body: 'Arriving soon',
        repeatChime: true,
    });
    assert.equal(scheduled, true);
    assert.equal(notificationController.webTimers.has(1005), true);
    await notificationController.cancelPendingAlerts([1005]);
    assert.equal(notificationController.webTimers.has(1005), false);
    notificationController.resetAll();
});
