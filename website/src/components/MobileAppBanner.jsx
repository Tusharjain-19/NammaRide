import React, { useState, useEffect } from 'react';
import { X, PlusSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import googlePlayImg from '../assets/images/google play.svg';
import logoApp from '../assets/images/logo_app.png';
import {
  isStandaloneMode,
  detectWebsitePlatform,
  wasIosBannerDismissed,
  dismissIosBanner,
} from '../utils/pwaInstall';

export default function MobileAppBanner() {
  const { t } = useLanguage();
  const [platform] = useState(() => detectWebsitePlatform());
  const [standalone] = useState(() => isStandaloneMode());
  const [iosReady, setIosReady] = useState(false);

  const [dismissed, setDismissed] = useState(() => {
    if (platform.isIOS) {
      return wasIosBannerDismissed();
    }
    try {
      return sessionStorage.getItem('nammaride_mobile_banner_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (standalone || !platform.isIOS || dismissed) return;
    const timer = setTimeout(() => setIosReady(true), 1100);
    return () => clearTimeout(timer);
  }, [standalone, platform.isIOS, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    if (platform.isIOS) {
      dismissIosBanner();
      return;
    }
    try {
      sessionStorage.setItem('nammaride_mobile_banner_dismissed', 'true');
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
  };

  if (standalone || dismissed) return null;

  // iPhone / iPad: Branded NammaRide PWA installation bottom sheet -> routes to /app/?install=ios
  if (platform.isIOS) {
    if (!iosReady) return null;
    return (
      <aside
        aria-label="Add NammaRide to Home Screen"
        className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 sm:px-4 md:hidden select-none animate-in fade-in slide-in-from-bottom duration-300"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="relative bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-2xl border border-purple-500/30 dark:border-purple-400/25 p-4 rounded-3xl shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-all active:scale-90"
            aria-label="Close installation prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3 pr-7">
            <div className="w-12 h-12 rounded-2xl bg-[#06090F] border border-purple-500/30 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <img
                src="/app/assets/icons/icon-192x192.png"
                onError={(e) => { e.currentTarget.src = logoApp; }}
                alt="NammaRide"
                className="w-12 h-12 object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                NammaRide Web App
              </span>
              <h4 className="font-heading font-black text-sm text-gray-900 dark:text-white leading-snug">
                Take NammaRide with you!
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">
                Your Bengaluru Metro companion, always one tap away. Install NammaRide on your {platform.isIPad ? 'iPad' : 'iPhone'} Home Screen for a cleaner, app-like experience.
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex flex-col gap-2">
            <a
              href="/app/?install=ios"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <PlusSquare className="w-4 h-4 shrink-0" />
              <span>Add NammaRide to Home Screen</span>
            </a>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2 px-4 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Android ONLY: Show Google Play Store badge (never show PWA install on Android)
  if (!platform.isAndroid) {
    return null;
  }

  return (
    <aside
      aria-label="Download NammaRide App Notification"
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden animate-in fade-in slide-in-from-bottom duration-300 select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="relative bg-gray-950/95 dark:bg-black/95 backdrop-blur-xl border border-emerald-500/40 p-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <img
              src={logoApp}
              alt="NammaRide App"
              className="w-7 h-7 object-contain"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <h4 className="font-heading font-black text-xs text-white leading-tight truncate">
              {t('downloadAppMobileBanner')}
            </h4>
            <p className="text-[10px] text-emerald-400 font-semibold truncate leading-tight mt-0.5">
              {t('mobileBannerMessage')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://play.google.com/store/apps/details?id=site.nammaride.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 transition-transform active:scale-95 drop-shadow-sm"
            aria-label="Download App on Google Play"
          >
            <img
              src={googlePlayImg}
              alt="Get it on Google Play"
              className="h-9 w-auto object-contain"
            />
          </a>

          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all border border-white/10"
            aria-label="Close notification"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
