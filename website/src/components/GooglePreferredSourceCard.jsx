import React from 'react';
import { Star, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function GooglePreferredSourceCard({ variant = 'default', className = '' }) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const domain = 'nammaride.vercel.app';
  const returnUrl = typeof window !== 'undefined' ? window.location.href : 'https://nammaride.vercel.app';

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>Prioritize NammaRide on Google</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-500 font-bold rounded-full uppercase">Official</span>
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                Save us as a preferred source for Bengaluru Metro search results, Discover & AI Overviews.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 self-end sm:self-center">
            <div 
              className="g-preferred-source"
              data-site={domain}
              data-theme={theme === 'dark' ? 'dark' : 'light'}
              data-size="medium"
              data-return-url={returnUrl}
              data-auto-return="true"
            >
              {/* Fallback button if Google script is loading/blocked */}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent('NammaRide Bengaluru Metro')}&preferred_source=${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>⭐ Save as Preferred Source</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-emerald-500/10 via-neutral-900/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-black dark:to-teal-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Search & AI Overviews</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Domain</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[var(--text-primary)] leading-snug">
          ⭐ Never Miss Namma Metro Live Updates & Fare Discounts!
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
          Add <strong>NammaRide</strong> as your <strong>Google Preferred Source</strong> so Google Search, AI Overviews, and Google Discover prioritize our offline Geo GPS guides, Majestic interchange routes, and fare calculator whenever you search for Bengaluru Metro!
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>1-Click Google Account Sync • Instant Auto-Return</span>
        </div>

        <div className="shrink-0">
          <div 
            className="g-preferred-source"
            data-site={domain}
            data-theme={theme === 'dark' ? 'dark' : 'light'}
            data-size="medium"
            data-return-url={returnUrl}
            data-auto-return="true"
          >
            {/* Fallback button */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent('NammaRide Bengaluru Metro')}&preferred_source=${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>⭐ Save NammaRide on Google</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
