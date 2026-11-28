const IOS_DISMISS_KEY = 'nammaride_ios_install_dismissed_at';
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export function isStandaloneMode() {
  try {
    const mqStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone = window.navigator.standalone === true;
    const twaReferrer = typeof document !== 'undefined' && document.referrer.startsWith('android-app://');
    return Boolean(mqStandalone || iosStandalone || twaReferrer);
  } catch (e) {
    return false;
  }
}

export function detectWebsitePlatform() {
  if (typeof navigator === 'undefined') {
    return { isIOS: false, isAndroid: false, isDesktop: true };
  }
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const touchPoints = navigator.maxTouchPoints || 0;

  const isAndroid = /Android/i.test(ua);
  const isIPad = /iPad/i.test(ua) || (platform === 'MacIntel' && touchPoints > 1);
  const isIPhone = /iPhone|iPod/i.test(ua);
  const isIOS = !isAndroid && (isIPhone || isIPad);

  return {
    isIOS,
    isIPhone,
    isIPad,
    isAndroid,
    isDesktop: !isIOS && !isAndroid,
  };
}

export function wasIosBannerDismissed() {
  try {
    const raw = localStorage.getItem(IOS_DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_COOLDOWN_MS;
  } catch (e) {
    return false;
  }
}

export function dismissIosBanner() {
  try {
    localStorage.setItem(IOS_DISMISS_KEY, String(Date.now()));
  } catch (e) {}
}
