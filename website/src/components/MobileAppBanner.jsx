import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import googlePlayImg from '../assets/images/google play.svg';
import logoApp from '../assets/images/logo_app.png';

export default function MobileAppBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('nammaride_mobile_banner_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('nammaride_mobile_banner_dismissed', 'true');
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Download NammaRide App Notification"
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden animate-in fade-in slide-in-from-bottom duration-300 select-none"
    >
      <div className="relative bg-gray-950/95 dark:bg-black/95 backdrop-blur-xl border border-emerald-500/40 p-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5">
        
        {/* Left: App Icon & Info */}
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
              Download NammaRide App
            </h4>
            <p className="text-[10px] text-emerald-400 font-semibold truncate leading-tight mt-0.5">
              100% Offline Maps & Live Alerts
            </p>
          </div>
        </div>

        {/* Right: Google Play SVG Badge & Cross Close Button */}
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
