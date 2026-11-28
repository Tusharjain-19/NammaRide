/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */

const DISMISS_KEY = 'nammaride_pwa_install_dismissed_at';
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=site.nammaride.app';

export function isEmbeddedIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

export function isCapacitorNative() {
    try {
        return Boolean(window.Capacitor?.isNativePlatform?.());
    } catch (e) {
        return false;
    }
}

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

export function detectPlatform(uaInput, platformInput, maxTouchPointsInput) {
    const ua = uaInput ?? (typeof navigator !== 'undefined' ? navigator.userAgent || '' : '');
    const platform = platformInput ?? (typeof navigator !== 'undefined' ? navigator.platform || '' : '');
    const touchPoints = maxTouchPointsInput ?? (typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0);

    const isAndroid = /Android/i.test(ua);
    const isIPad = /iPad/i.test(ua) || (platform === 'MacIntel' && touchPoints > 1);
    const isIPhone = /iPhone|iPod/i.test(ua);
    const isIOS = !isAndroid && (isIPhone || isIPad);

    let iosBrowser = 'safari';
    if (isIOS) {
        if (/CriOS/i.test(ua)) iosBrowser = 'chrome';
        else if (/EdgiOS/i.test(ua)) iosBrowser = 'edge';
        else if (/FxiOS/i.test(ua)) iosBrowser = 'firefox';
        else iosBrowser = 'safari';
    }

    return {
        isIOS,
        isIPhone,
        isIPad,
        isAndroid,
        isDesktop: !isIOS && !isAndroid,
        iosBrowser,
    };
}

function wasRecentlyDismissed() {
    try {
        const raw = localStorage.getItem(DISMISS_KEY);
        if (!raw) return false;
        const ts = Number(raw);
        if (!Number.isFinite(ts)) return false;
        return Date.now() - ts < DISMISS_COOLDOWN_MS;
    } catch (e) {
        return false;
    }
}

function recordDismissal() {
    try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch (e) {}
}

function getIosShareSvg() {
    return `<svg class="w-4 h-4 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>`;
}

function getIosAddHomeSvg() {
    return `<svg class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;
}

export function initPwaInstallExperience({ isBusy } = {}) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (isEmbeddedIframe() || isCapacitorNative() || isStandaloneMode()) return;

    const plat = detectPlatform();
    const headerBtn = document.getElementById('pwa-install-header-btn');
    const footerSlot = document.getElementById('pwa-install-footer-slot');
    const sheetRoot = document.getElementById('pwa-install-sheet-root');

    let deferredDesktopPrompt = null;
    let isSheetOpen = false;

    const hideAllPwaTriggers = () => {
        if (headerBtn) headerBtn.classList.add('hidden');
        if (footerSlot) {
            footerSlot.classList.add('hidden');
            footerSlot.innerHTML = '';
        }
        closeSheet();
    };

    const closeSheet = (remember = false) => {
        if (remember) recordDismissal();
        isSheetOpen = false;
        if (!sheetRoot) return;
        const card = sheetRoot.querySelector('[data-pwa-card]');
        sheetRoot.classList.add('opacity-0', 'pointer-events-none');
        if (card) {
            card.classList.add('translate-y-8', 'opacity-0');
            card.classList.remove('translate-y-0', 'opacity-100');
        }
        setTimeout(() => {
            if (!isSheetOpen) {
                sheetRoot.classList.add('hidden');
                sheetRoot.innerHTML = '';
            }
        }, 260);
    };

    const renderIosSheet = (startInGuide = false) => {
        if (!sheetRoot || isStandaloneMode()) return;
        isSheetOpen = true;
        const deviceWord = plat.isIPad ? 'iPad' : 'iPhone';
        const shareLocationHint = plat.iosBrowser === 'chrome'
            ? 'in Chrome\'s top-right address bar'
            : plat.iosBrowser === 'edge'
                ? 'in Edge\'s bottom menu'
                : 'at the bottom of Safari';

        const promptBodyHtml = `
            <div class="flex items-start gap-3.5">
                <img src="assets/icons/icon-192x192.png" alt="NammaRide" class="w-12 h-12 rounded-2xl shadow-md border border-white/15 shrink-0 object-cover">
                <div class="min-w-0 flex-1 pr-6">
                    <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-500 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                        <span>NammaRide App</span>
                    </div>
                    <h3 class="text-base font-black text-primary tracking-tight leading-snug">Take NammaRide with you!</h3>
                    <p class="text-xs text-secondary leading-relaxed mt-1">Your Bengaluru Metro companion, always one tap away. Install NammaRide on your ${deviceWord} Home Screen for a cleaner, app-like experience.</p>
                </div>
            </div>
            <div class="mt-4 flex flex-col gap-2">
                <button type="button" id="nr-pwa-open-guide-btn" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    ${getIosAddHomeSvg().replace('text-emerald-500', 'text-white')}
                    <span>Add to Home Screen</span>
                </button>
                <button type="button" id="nr-pwa-later-btn" class="w-full py-2.5 px-4 rounded-xl bg-card-subtle hover:bg-card-hover text-secondary hover:text-primary font-bold text-xs border border-subtle transition-all active:scale-[0.98]">
                    Maybe later
                </button>
            </div>
        `;

        const guideBodyHtml = `
            <div class="flex items-center justify-between gap-3 pb-3 border-b border-subtle">
                <div class="flex items-center gap-2.5 min-w-0">
                    <img src="assets/icons/icon-192x192.png" alt="NammaRide" class="w-9 h-9 rounded-xl shadow-sm border border-white/15 shrink-0">
                    <div class="min-w-0">
                        <h3 class="text-sm font-black text-primary tracking-tight truncate">Add NammaRide to Home Screen</h3>
                        <p class="text-[11px] text-secondary truncate">3 quick steps on ${deviceWord}</p>
                    </div>
                </div>
                <button type="button" id="nr-pwa-close-guide-x" class="w-8 h-8 rounded-full bg-card-subtle hover:bg-card-hover border border-subtle text-secondary hover:text-primary flex items-center justify-center shrink-0" aria-label="Close">
                    <span class="text-sm font-bold leading-none">&times;</span>
                </button>
            </div>
            <div class="mt-3.5 space-y-2.5">
                <div class="p-3 rounded-2xl bg-card-subtle border border-subtle flex items-center gap-3">
                    <div class="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-500 dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0">1</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-extrabold text-primary flex items-center gap-1.5 flex-wrap">
                            <span>Tap the</span>
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 font-bold text-[11px]">${getIosShareSvg()} Share</span>
                            <span>button</span>
                        </div>
                        <p class="text-[11px] text-secondary mt-0.5">Look ${shareLocationHint}.</p>
                    </div>
                </div>

                <div class="p-3 rounded-2xl bg-card-subtle border border-subtle flex items-center gap-3">
                    <div class="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">2</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-extrabold text-primary flex items-center gap-1.5 flex-wrap">
                            <span>Select</span>
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-bold text-[11px]">${getIosAddHomeSvg()} Add to Home Screen</span>
                        </div>
                        <p class="text-[11px] text-secondary mt-0.5">Scroll down in the share sheet if needed.</p>
                    </div>
                </div>

                <div class="p-3 rounded-2xl bg-card-subtle border border-subtle flex items-center gap-3">
                    <div class="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-500 dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0">3</div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-extrabold text-primary flex items-center gap-1.5 flex-wrap">
                            <span>Enable</span>
                            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-bold text-[11px]">Open as Web App <span class="inline-block w-5 h-3 rounded-full bg-emerald-500 relative"><span class="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-white"></span></span></span>
                            <span>if shown, then tap <strong>Add</strong></span>
                        </div>
                        <p class="text-[11px] text-secondary mt-0.5">NammaRide will appear on your Home Screen and open full-screen.</p>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <button type="button" id="nr-pwa-guide-done-btn" class="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all">
                    Got it
                </button>
            </div>
        `;

        sheetRoot.innerHTML = `
            <div class="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-2.5 sm:p-5 bg-black/55 backdrop-blur-sm transition-opacity duration-200" style="padding-bottom: max(0.75rem, calc(0.5rem + env(safe-area-inset-bottom, 0px)));">
                <div data-pwa-card class="w-full max-w-md max-h-[88dvh] overflow-y-auto custom-scrollbar rounded-3xl bg-card border border-subtle shadow-2xl p-3.5 sm:p-5 relative transform translate-y-8 opacity-0 transition-all duration-300">
                    ${startInGuide ? '' : `<button type="button" id="nr-pwa-close-x" class="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-card-subtle hover:bg-card-hover border border-subtle text-secondary hover:text-primary flex items-center justify-center" aria-label="Dismiss"><span class="text-sm font-bold leading-none">&times;</span></button>`}
                    <div id="nr-pwa-sheet-body">${startInGuide ? guideBodyHtml : promptBodyHtml}</div>
                </div>
            </div>
        `;

        sheetRoot.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        requestAnimationFrame(() => {
            const card = sheetRoot.querySelector('[data-pwa-card]');
            if (card) {
                card.classList.remove('translate-y-8', 'opacity-0');
                card.classList.add('translate-y-0', 'opacity-100');
            }
        });

        const backdrop = sheetRoot.firstElementChild;
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) closeSheet(true);
            });
        }

        const bindGuideHandlers = () => {
            document.getElementById('nr-pwa-close-guide-x')?.addEventListener('click', () => closeSheet(true));
            document.getElementById('nr-pwa-guide-done-btn')?.addEventListener('click', () => closeSheet(true));
        };

        if (startInGuide) {
            bindGuideHandlers();
        } else {
            document.getElementById('nr-pwa-close-x')?.addEventListener('click', () => closeSheet(true));
            document.getElementById('nr-pwa-later-btn')?.addEventListener('click', () => closeSheet(true));
            document.getElementById('nr-pwa-open-guide-btn')?.addEventListener('click', () => {
                const body = document.getElementById('nr-pwa-sheet-body');
                const closeX = document.getElementById('nr-pwa-close-x');
                if (closeX) closeX.remove();
                if (body) {
                    body.innerHTML = guideBodyHtml;
                    bindGuideHandlers();
                }
            });
        }
    };

    // ─── ANDROID WEB: Google Play ONLY (never PWA install prompt) ───
    if (plat.isAndroid) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
        });
        if (headerBtn) headerBtn.classList.add('hidden');
        if (footerSlot) {
            footerSlot.classList.remove('hidden');
            footerSlot.innerHTML = `
                <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer"
                   class="w-full py-2.5 px-4 rounded-2xl bg-card-subtle hover:bg-card-hover border border-emerald-500/30 flex items-center justify-between gap-3 transition-all active:scale-[0.98] shadow-xs">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <img src="assets/icons/icon-192x192.png" alt="NammaRide" class="w-8 h-8 rounded-xl shrink-0">
                        <div class="min-w-0 text-left">
                            <div class="text-xs font-extrabold text-primary truncate">Get NammaRide Android App</div>
                            <div class="text-[10px] text-emerald-500 font-semibold truncate">Official app on Google Play</div>
                        </div>
                    </div>
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[11px] font-black shrink-0">Google Play</span>
                </a>
            `;
        }
        return;
    }

    // ─── iOS (iPhone / iPad): High-priority guided installation ───
    if (plat.isIOS) {
        if (headerBtn) {
            headerBtn.classList.remove('hidden');
            headerBtn.setAttribute('title', 'Add NammaRide to Home Screen');
            headerBtn.setAttribute('aria-label', 'Add NammaRide to Home Screen');
            headerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                renderIosSheet(true);
            });
        }
        if (footerSlot) {
            footerSlot.classList.remove('hidden');
            footerSlot.innerHTML = `
                <button type="button" id="nr-pwa-footer-install-btn"
                   class="w-full py-2.5 px-4 rounded-2xl bg-card-subtle hover:bg-card-hover border border-purple-500/30 flex items-center justify-between gap-3 transition-all active:scale-[0.98] shadow-xs cursor-pointer">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <img src="assets/icons/icon-192x192.png" alt="NammaRide" class="w-8 h-8 rounded-xl shrink-0">
                        <div class="min-w-0 text-left">
                            <div class="text-xs font-extrabold text-primary truncate">Install NammaRide on ${plat.isIPad ? 'iPad' : 'iPhone'}</div>
                            <div class="text-[10px] text-secondary truncate">Add to Home Screen for full-screen access</div>
                        </div>
                    </div>
                    <span class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-500 text-white text-[11px] font-black shrink-0">Add App</span>
                </button>
            `;
            document.getElementById('nr-pwa-footer-install-btn')?.addEventListener('click', () => {
                renderIosSheet(true);
            });
        }

        // Check if redirected from marketing website bottom sheet (?install=ios)
        const params = new URLSearchParams(window.location.search);
        if (params.get('install') === 'ios') {
            params.delete('install');
            const cleanQs = params.toString();
            const cleanUrl = window.location.pathname + (cleanQs ? `?${cleanQs}` : '') + window.location.hash;
            try {
                window.history.replaceState(window.history.state, '', cleanUrl);
            } catch (e) {}
            setTimeout(() => renderIosSheet(true), 250);
            return;
        }

        if (!wasRecentlyDismissed()) {
            setTimeout(() => {
                if (isStandaloneMode()) return;
                if (typeof isBusy === 'function' && isBusy()) return;
                renderIosSheet(false);
            }, 1600);
        }
        return;
    }

    // ─── DESKTOP CHROME / EDGE: Native browser install flow ───
    const triggerDesktopInstall = async () => {
        if (!deferredDesktopPrompt) return;
        try {
            deferredDesktopPrompt.prompt();
            const choice = await deferredDesktopPrompt.userChoice;
            if (choice && choice.outcome === 'accepted') {
                hideAllPwaTriggers();
            }
            deferredDesktopPrompt = null;
        } catch (e) {}
    };

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredDesktopPrompt = e;

        if (headerBtn) {
            headerBtn.classList.remove('hidden');
            headerBtn.setAttribute('title', 'Install NammaRide');
            headerBtn.setAttribute('aria-label', 'Install NammaRide');
            headerBtn.onclick = (ev) => {
                ev.preventDefault();
                triggerDesktopInstall();
            };
        }
        if (footerSlot) {
            footerSlot.classList.remove('hidden');
            footerSlot.innerHTML = `
                <button type="button" id="nr-pwa-desktop-install-btn"
                   class="w-full py-2.5 px-4 rounded-2xl bg-card-subtle hover:bg-card-hover border border-emerald-500/30 flex items-center justify-between gap-3 transition-all active:scale-[0.98] shadow-xs cursor-pointer">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <img src="assets/icons/icon-192x192.png" alt="NammaRide" class="w-8 h-8 rounded-xl shrink-0">
                        <div class="min-w-0 text-left">
                            <div class="text-xs font-extrabold text-primary truncate">Install NammaRide App</div>
                            <div class="text-[10px] text-secondary truncate">Open directly in standalone window</div>
                        </div>
                    </div>
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[11px] font-black shrink-0">Install</span>
                </button>
            `;
            document.getElementById('nr-pwa-desktop-install-btn')?.addEventListener('click', triggerDesktopInstall);
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredDesktopPrompt = null;
        hideAllPwaTriggers();
    });
}
