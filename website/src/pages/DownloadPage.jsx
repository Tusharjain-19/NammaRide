import React from 'react';
import { Smartphone, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import googlePlayImg from '../../assets/images/google play.svg';

export default function DownloadPage() {
  return (
    <div className="min-h-screen pt-32 pb-section-gap px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto w-full relative z-10 flex flex-col">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>NammaRide Official App Hub</span>
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            Get NammaRide Android App
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            Get the privacy-first Bengaluru Metro companion app for your Android device. Secure, fast, and 100% offline-ready.
          </p>
        </div>

        {/* Google Play Store & QR Code Scan Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
          
          {/* Play Store Card */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-8 sm:p-10 rounded-[36px] space-y-6 shadow-md relative overflow-hidden select-none h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center text-emerald-500 shadow-sm">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/40">
                  Official Release
                </span>
                <h3 className="font-sans font-extrabold text-xl text-gray-900 dark:text-white mt-2">Get NammaRide on Play Store</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Install NammaRide directly from Google Play to receive automatic background updates and store-verified security scans. Enjoy offline route planning, platform guidance, and accessibility tools.
              </p>
              <div className="text-[11px] text-gray-400 font-mono font-semibold">
                Compatible with Android 7.0+ (Nougat and above)
              </div>
            </div>

            <a
              href="https://play.google.com/store/apps/details?id=site.nammaride.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105 active:scale-95 drop-shadow-lg pt-2"
            >
              <img src={googlePlayImg} alt="Get it on Google Play" className="h-14 sm:h-16 w-auto object-contain" />
            </a>
          </div>

          {/* QR Code Scan Card */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-8 sm:p-10 rounded-[36px] flex flex-col items-center justify-center text-center space-y-4 shadow-md h-full">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
              Scan QR Code
            </div>
            <div className="p-3 bg-gray-50 dark:bg-black rounded-3xl border border-gray-200 dark:border-neutral-800 shadow-lg glow-button">
              <img src="/assets/images/nammaride_qr.png" alt="Scan QR Code to Download NammaRide App" className="w-44 h-44 object-contain rounded-2xl" />
            </div>
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-sm text-gray-900 dark:text-white">Scan with Camera or Lens</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Instant direct download link to Play Store app page</p>
            </div>
          </div>

        </div>

        {/* Web Simulator Promo (Light & Dark Mode) */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-neutral-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Want to test the app online first before downloading?</p>
          <Link
            to="/simulator"
            className="h-12 px-6 rounded-[14px] light-glass-card text-gray-900 dark:text-white font-bold text-xs hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all shadow-xs inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-neutral-800 hover:scale-105"
          >
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Try Live Web App Simulator Now</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
