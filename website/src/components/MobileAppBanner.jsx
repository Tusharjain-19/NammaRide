import React, { useState, useEffect } from 'react';
import { X, PlusSquare, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import googlePlayImg from '../assets/images/google play.svg';
import logoApp from '../assets/images/logo_app.png';
import {
  isStandaloneMode,
  detectWebsitePlatform,
  wasIosBannerDismissed,
  dismissIosBanner,
} from '../utils/pwaInstall';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=site.nammaride.app';

export default function MobileAppBanner() {
  const { t } = useLanguage();
  const [platform] = useState(() => detectWebsitePlatform());
  const [standalone] = useState(() => isStandaloneMode());
  const [visibleAfterDelay, setVisibleAfterDelay] = useState(() => platform.isAndroid);

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
    if (standalone || dismissed || visibleAfterDelay) return;
    const delayMs = platform.isIOS ? 1000 : 1200;
    const timer = setTimeout(() => setVisibleAfterDelay(true), delayMs);
    return () => clearTimeout(timer);
  }, [standalone, dismissed, visibleAfterDelay, platform.isIOS]);

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

  if (standalone || dismissed || !visibleAfterDelay) return null;

  const containerPositionClass =
    'fixed z-50 bottom-2.5 inset-x-2.5 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-2rem)] sm:max-w-md sm:bottom-4 lg:left-auto lg:translate-x-0 lg:right-5 lg:bottom-5 lg:w-[390px] lg:max-w-[calc(100vw-2.5rem)] select-none animate-in fade-in slide-in-from-bottom duration-300';

  // iPhone / iPad (Safari, Chrome, etc.): Guided Add to Home Screen -> /app/?install=ios
  if (platform.isIOS) {
    return (
      <aside
        aria-label="Add NammaRide to Home Screen"
        className={containerPositionClass}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="relative bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-2xl border border-purple-500/30 dark:border-purple-400/25 p-3.5 sm:p-4 rounded-3xl shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-all active:scale-90"
            aria-label="Close installation prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3 pr-7">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#06090F] border border-purple-500/30 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <img
                src="/app/assets/icons/icon-192x192.png"
                onError={(e) => { e.currentTarget.src = logoApp; }}
                alt="NammaRide"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                NammaRide Web App
              </span>
              <h4 className="font-heading font-black text-sm text-gray-900 dark:text-white leading-snug">
                Take NammaRide with you!
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">
                Your Bengaluru Metro companion, always one tap away. Install NammaRide on your {platform.isIPad ? 'iPad' : 'iPhone'} Home Screen for a cleaner, app-like experience.
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            <a
              href="/app/?install=ios"
              className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <PlusSquare className="w-4 h-4 shrink-0" />
              <span>Add NammaRide to Home Screen</span>
            </a>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-1.5 sm:py-2 px-4 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Android (Mobile & Tablet): Google Play ONLY (never PWA install prompt)
  if (platform.isAndroid) {
    return (
      <aside
        aria-label="Download NammaRide App on Google Play"
        className={containerPositionClass}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="relative bg-gray-950/95 dark:bg-black/95 backdrop-blur-xl border border-emerald-500/40 p-2.5 sm:p-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src={logoApp}
                alt="NammaRide App"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <h4 className="font-heading font-black text-[11px] sm:text-xs text-white leading-tight truncate">
                {t('downloadAppMobileBanner')}
              </h4>
              <p className="text-[10px] text-emerald-400 font-semibold truncate leading-tight mt-0.5">
                {t('mobileBannerMessage')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 sm:h-9 transition-transform active:scale-95 drop-shadow-sm"
              aria-label="Download App on Google Play"
            >
              <img
                src={googlePlayImg}
                alt="Get it on Google Play"
                className="h-8 sm:h-9 w-auto object-contain"
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

  // Laptop / Desktop (and responsive smaller desktop windows): Web App + Google Play
  return (
    <aside
      aria-label="Get NammaRide App"
      className={containerPositionClass}
    >
      <div className="relative bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-2xl border border-emerald-500/30 p-3.5 sm:p-4 rounded-2xl shadow-[0_16px_44px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-all active:scale-90"
          aria-label="Close notification"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-3 pr-7">
          <div className="w-10 h-10 rounded-xl bg-[#06090F] border border-emerald-500/30 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            <img
              src="/app/assets/icons/icon-192x192.png"
              onError={(e) => { e.currentTarget.src = logoApp; }}
              alt="NammaRide"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-heading font-black text-xs sm:text-sm text-gray-900 dark:text-white leading-tight truncate">
              {t('downloadAppMobileBanner')}
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate mt-0.5">
              {t('mobileBannerMessage')}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <a
            href="/app/"
            className="flex-1 min-w-[135px] py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span>Open Web App</span>
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 shrink-0 transition-transform hover:scale-[1.02] active:scale-95"
            aria-label="Get it on Google Play"
          >
            <img
              src={googlePlayImg}
              alt="Get it on Google Play"
              className="h-9 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </aside>
  );
}
