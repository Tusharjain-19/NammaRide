/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
/**
 * NammaRide Sticky Live Simulation HUD & Floating Resume Bar
 * Uses keyed structural mounting + targeted DOM text/class patching so 1s countdowns
 * and 5-10s location refreshes never tear down button listeners or cause WebView jitter.
 */

import { T, T_STATION, formatTime } from '../utils/helpers.js';
import { notificationController, ALERT_THRESHOLD_SEC } from '../logic/notificationEngine.js';

export function bindBoardingHudActions(simStatus, handlers) {
    if (!simStatus || simStatus.dataset.listenersBound) return;
    simStatus.dataset.listenersBound = 'true';
    simStatus.addEventListener('click', (e) => {
        if (e.target.closest('#toggle-speed-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onToggleSpeed?.();
        } else if (e.target.closest('#toggle-sound-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onToggleSound?.();
        } else if (e.target.closest('#set-alarm-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onSetAlarm?.();
        } else if (e.target.closest('#set-tomorrow-alarm-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onSetTomorrowAlarm?.();
        } else if (e.target.closest('#dismiss-alarm-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onDismissAlarm?.();
        } else if (e.target.closest('#confirm-board-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onConfirmBoard?.();
        } else if (e.target.closest('#confirm-interchange-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onConfirmInterchange?.();
        } else if (e.target.closest('#still-prev-train-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onStillOnPrevTrain?.();
        } else if (e.target.closest('#skip-next-train-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onSkipNextTrain?.();
        } else if (e.target.closest('#step-prev-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onStepStop?.(-1);
        } else if (e.target.closest('#step-next-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onStepStop?.(1);
        } else if (e.target.closest('#minimize-journey-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onMinimize?.();
        } else if (e.target.closest('#manual-finish-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onFinish?.();
        } else if (e.target.closest('#exit-journey-btn, #map-back-home-btn, #map-end-trip-btn, #done-celebrate-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onExit?.();
        } else if (e.target.closest('#explore-nearby-celebrate-btn')) {
            e.preventDefault(); e.stopPropagation();
            handlers.onExploreNearby?.();
        }
    });
}

export function renderBoardingHud({
    simStatus,
    simulationState,
    journey,
    originName,
    destinationName,
    waitSecLeft,
    remainingMinutes,
    gpsClass,
    gpsTitle,
    isOnline,
    bannerAlert,
    tomorrowFirstTrain,
    interchangeMeta,
}) {
    if (!simStatus) return;

    const showManualFinish = !simulationState.useGPS || (simulationState.gpsAccuracy !== null && simulationState.gpsAccuracy > 500);
    const hasBanner = Boolean(bannerAlert);
    const soundEnabled = notificationController.isSoundEnabled();
    const noSvcKey = simulationState.boardingState === 'NO_SERVICE' ? `_${tomorrowFirstTrain?.departureFormatted || 'none'}` : '';
    const structKey = `${simulationState.boardingState}_${showManualFinish ? 1 : 0}_${hasBanner ? bannerAlert.kind : 'none'}_${isOnline ? 1 : 0}${noSvcKey}`;

    const nextCandidate = simulationState.candidateTrains?.[simulationState.waitingTrainIndex + 1];
    const targetDateObj = simulationState.waitingTargetDate ? new Date(simulationState.waitingTargetDate) : null;
    const targetTimeStr = targetDateObj ? formatTime(targetDateObj) : '';
    const mm = String(Math.floor(waitSecLeft / 60)).padStart(1, '0');
    const ss = String(waitSecLeft % 60).padStart(2, '0');
    const isThirtySecWindow = waitSecLeft <= ALERT_THRESHOLD_SEC && waitSecLeft > 0;
    const secTimerStr = waitSecLeft === 0
        ? 'Arriving now'
        : (isThirtySecWindow ? `${waitSecLeft}s left` : `${mm}m ${ss}s`);

    // Fast surgical DOM patch when container structure is identical
    if (simStatus.dataset.mountedStructKey === structKey) {
        const destEl = document.getElementById('hud-dest-name');
        const gpsDotEl = document.getElementById('hud-gps-dot');
        const remMinEl = document.getElementById('hud-rem-min');
        const waitMainEl = document.getElementById('hud-wait-main');
        const waitSubEl = document.getElementById('hud-wait-sub');
        const waitPillEl = document.getElementById('hud-wait-pill');
        const speedTitleEl = document.getElementById('hud-speed-title');
        const speedSubEl = document.getElementById('hud-speed-sub');
        const speedBtnEl = document.getElementById('toggle-speed-btn');
        const speedBtnLbl = document.getElementById('hud-speed-btn-label');
        const speedDotEl = document.getElementById('hud-speed-dot');
        const alertTitleEl = document.getElementById('hud-alert-banner-title');
        const alertSubEl = document.getElementById('hud-alert-banner-sub');

        if (destEl && destEl.textContent !== destinationName) destEl.textContent = destinationName;
        if (gpsDotEl) {
            gpsDotEl.className = `gps-signal-dot ${gpsClass} shrink-0`;
            gpsDotEl.title = gpsTitle;
        }
        if (remMinEl) remMinEl.textContent = `${remainingMinutes} ${T('minRemaining') || 'min remaining'}`;
        if (waitMainEl) {
            if (simulationState.boardingState === 'ARRIVAL_CHECK' || simulationState.boardingState === 'INTERCHANGE_ARRIVAL') {
                waitMainEl.textContent = simulationState.boardingState === 'INTERCHANGE_ARRIVAL'
                    ? `${interchangeMeta?.nextLineName || 'Connecting train'} arriving at ${originName}! Boarded?`
                    : `Train arriving at ${originName}! Boarded?`;
            } else if (simulationState.boardingState === 'INTERCHANGE_WAITING') {
                waitMainEl.textContent = `Next ${interchangeMeta?.nextLineName || 'train'} at ${originName} (P${interchangeMeta?.nextPlatform || 1})`;
            } else if (simulationState.boardingState === 'INTERCHANGE_CHECK') {
                waitMainEl.textContent = `Reached ${originName} · Did you change?`;
            } else {
                waitMainEl.textContent = `Waiting at ${originName}`;
            }
        }
        if (waitSubEl) {
            if (simulationState.boardingState === 'INTERCHANGE_WAITING' || simulationState.boardingState === 'INTERCHANGE_ARRIVAL') {
                const locPart = interchangeMeta?.incomingStatusText ? `${interchangeMeta.incomingStatusText} · ` : '';
                waitSubEl.textContent = `${locPart}${targetTimeStr}`;
            } else if (simulationState.boardingState === 'INTERCHANGE_CHECK') {
                waitSubEl.textContent = interchangeMeta?.previewText || `Transfer to ${interchangeMeta?.nextLineName || 'connecting line'}`;
            } else {
                waitSubEl.textContent = `${isOnline ? 'Live sync' : 'Saved schedule'} · ${targetTimeStr}`;
            }
        }
        if (waitPillEl) {
            waitPillEl.textContent = (simulationState.boardingState === 'ARRIVAL_CHECK' || simulationState.boardingState === 'INTERCHANGE_ARRIVAL')
                ? (waitSecLeft > 0 ? `${waitSecLeft}s` : 'At Platform')
                : secTimerStr;
        }
        if (alertTitleEl && bannerAlert) alertTitleEl.textContent = bannerAlert.title;
        if (alertSubEl && bannerAlert) alertSubEl.textContent = bannerAlert.body;

        if (speedTitleEl && simulationState.boardingState === 'ON_BOARD') {
            const speedText = simulationState.speedHudEnabled
                ? (simulationState.currentSpeedKmh !== null ? `${simulationState.currentSpeedKmh} km/h` : 'Reading...')
                : 'Speed Off';
            const speedSource = simulationState.speedHudEnabled
                ? (simulationState.speedSource || 'Calibrating GPS')
                : 'Tap to measure real GPS speed';
            speedTitleEl.textContent = simulationState.speedHudEnabled ? `Train Speed: ${speedText}` : 'Live Metro Journey';
            if (speedSubEl) speedSubEl.textContent = speedSource;
            if (speedBtnLbl) speedBtnLbl.textContent = speedText;
            if (speedBtnEl) {
                speedBtnEl.className = `flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10.5px] font-extrabold active:scale-95 transition-all cursor-pointer tabular-nums shrink-0 ${
                    simulationState.speedHudEnabled
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-500'
                        : 'bg-card border-subtle text-secondary hover:text-primary'
                }`;
            }
            if (speedDotEl) {
                speedDotEl.className = `w-2 h-2 rounded-full ${simulationState.isSpeedEstimated ? 'bg-amber-400' : 'bg-emerald-500'} shrink-0`;
            }
        }
        return;
    }

    simStatus.dataset.mountedStructKey = structKey;

    let alertBannerHtml = '';
    if (bannerAlert) {
        const isAlarmBanner = Boolean(bannerAlert.isAlarm || notificationController.isAlarmRinging);
        const badgeHtml = isAlarmBanner
            ? `<button id="dismiss-alarm-btn" type="button" class="px-2.5 py-1 rounded-full bg-white text-emerald-700 text-[9.5px] font-black uppercase tracking-wider shrink-0 active:scale-95 cursor-pointer shadow-xs">Stop Alarm</button>`
            : `<span class="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider shrink-0">30s Alert</span>`;
        alertBannerHtml = `
            <div class="py-2 px-3 bg-emerald-500 text-white flex items-center justify-between gap-2 shadow-sm animate-pulse-subtle">
                <div class="flex items-center gap-2 min-w-0">
                    <i data-lucide="bell-ring" class="w-4 h-4 shrink-0"></i>
                    <div class="min-w-0">
                        <div id="hud-alert-banner-title" class="text-[11px] font-black leading-tight truncate">${bannerAlert.title}</div>
                        <div id="hud-alert-banner-sub" class="text-[10px] font-semibold opacity-95 truncate">${bannerAlert.body}</div>
                    </div>
                </div>
                ${badgeHtml}
            </div>
        `;
    }

    let boardingCardHtml = '';
    if (simulationState.boardingState === 'INTERCHANGE_CHECK') {
        const nextLineLabel = interchangeMeta?.nextLineName || 'connecting line';
        const previewText = interchangeMeta?.previewText || `Platform ${interchangeMeta?.nextPlatform || 1}`;
        boardingCardHtml = `
            <div class="py-2.5 px-3 bg-amber-500/10 border-b border-amber-500/30 flex flex-col gap-2">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-start gap-2 min-w-0 flex-1">
                        <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                            <i data-lucide="arrow-right-left" class="w-3.5 h-3.5"></i>
                        </span>
                        <div class="min-w-0 flex-1">
                            <div id="hud-wait-main" class="text-[11.5px] font-black text-primary leading-tight break-words">Reached ${originName} · Did you change?</div>
                            <div id="hud-wait-sub" class="text-[10px] text-secondary font-semibold mt-0.5 break-words">${previewText}</div>
                        </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-500 text-[9.5px] font-black uppercase shrink-0">Interchange</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <button id="confirm-interchange-btn" type="button" class="flex-1 min-h-[38px] py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] shadow-sm active:scale-95 transition-all cursor-pointer">
                        Yes, changing to ${nextLineLabel}
                    </button>
                    <button id="still-prev-train-btn" type="button" class="py-1.5 px-3 min-h-[38px] rounded-xl bg-card border border-subtle text-secondary hover:text-primary font-bold text-[10.5px] active:scale-95 transition-all cursor-pointer shrink-0">
                        Still on train
                    </button>
                </div>
            </div>
        `;
    } else if (simulationState.boardingState === 'ARRIVAL_CHECK' || simulationState.boardingState === 'INTERCHANGE_ARRIVAL') {
        const isXfer = simulationState.boardingState === 'INTERCHANGE_ARRIVAL';
        const linePrefix = isXfer && interchangeMeta?.nextLineName ? `${interchangeMeta.nextLineName} ` : 'Train ';
        boardingCardHtml = `
            <div class="py-2.5 px-3 bg-emerald-500/15 border-b border-emerald-500/30 flex flex-col gap-2">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                        <span id="hud-wait-main" class="text-xs font-black text-primary break-words">${linePrefix}arriving at ${originName}! Boarded?</span>
                    </div>
                    <span id="hud-wait-pill" class="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black shrink-0 tabular-nums">${waitSecLeft > 0 ? `${waitSecLeft}s` : 'At Platform'}</span>
                </div>
                ${isXfer && interchangeMeta?.incomingStatusText ? `<div id="hud-wait-sub" class="text-[10px] text-secondary font-semibold truncate">${interchangeMeta.incomingStatusText} · ${targetTimeStr}</div>` : ''}
                <div class="flex items-center gap-2">
                    <button id="confirm-board-btn" type="button" class="flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-sm active:scale-95 transition-all cursor-pointer">
                        Yes, I boarded
                    </button>
                    <button id="skip-next-train-btn" type="button" class="flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-card border border-subtle text-primary hover:bg-card-hover font-bold text-xs active:scale-95 transition-all cursor-pointer truncate">
                        Missed · Next ${nextCandidate ? `(${nextCandidate.departureFormatted})` : 'Train'}
                    </button>
                </div>
            </div>
        `;
    } else if (simulationState.boardingState === 'WAITING_AT_PLATFORM' || simulationState.boardingState === 'INTERCHANGE_WAITING') {
        const isXfer = simulationState.boardingState === 'INTERCHANGE_WAITING';
        const waitHeadline = isXfer
            ? `Next ${interchangeMeta?.nextLineName || 'train'} at ${originName} (P${interchangeMeta?.nextPlatform || 1})`
            : `Waiting at ${originName}`;
        const subHeadline = isXfer
            ? `${interchangeMeta?.incomingStatusText ? `${interchangeMeta.incomingStatusText} · ` : ''}${targetTimeStr}`
            : `${isOnline ? 'Live sync' : 'Saved schedule'} · ${targetTimeStr}`;
        boardingCardHtml = `
            <div class="py-2 px-3 bg-indigo-500/10 border-b border-indigo-500/20 flex flex-col gap-1.5">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex flex-col min-w-0 flex-1">
                        <div id="hud-wait-main" class="text-[11.5px] font-extrabold text-primary leading-tight tabular-nums break-words">${waitHeadline}</div>
                        <div id="hud-wait-sub" class="text-[10px] text-secondary font-semibold mt-0.5 break-words">${subHeadline}</div>
                    </div>
                    <span id="hud-wait-pill" class="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-[10px] font-black shrink-0 tabular-nums mt-0.5">${secTimerStr}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <button id="toggle-sound-btn" type="button" class="w-7 h-7 rounded-lg bg-card border border-subtle flex items-center justify-center text-secondary hover:text-emerald-500 cursor-pointer shrink-0" title="Toggle 30s Alert Chime">
                        <i data-lucide="${soundEnabled ? 'bell-ring' : 'bell-off'}" class="w-3.5 h-3.5"></i>
                    </button>
                    <button id="set-alarm-btn" type="button" class="px-2 py-1.5 rounded-lg border text-[10px] font-extrabold active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 ${simulationState.alarmArmed ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-card border-subtle text-secondary hover:text-primary'}" title="Set Boarding & Arrival Alarm">
                        <i data-lucide="${simulationState.alarmArmed ? 'alarm-clock-check' : 'alarm-clock'}" class="w-3.5 h-3.5"></i>
                        <span>${simulationState.alarmArmed ? 'Alarm On' : 'Set Alarm'}</span>
                    </button>
                    <button id="confirm-board-btn" type="button" class="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10.5px] active:scale-95 cursor-pointer">Yes, I boarded</button>
                    <button id="skip-next-train-btn" type="button" class="flex-1 py-1.5 rounded-lg bg-card border border-subtle text-secondary hover:text-primary font-bold text-[10px] active:scale-95 cursor-pointer whitespace-nowrap">Missed · Next${nextCandidate ? ` (${nextCandidate.departureFormatted})` : ''}</button>
                </div>
            </div>
        `;
    } else if (simulationState.boardingState === 'ON_BOARD') {
        const speedText = simulationState.speedHudEnabled
            ? (simulationState.currentSpeedKmh !== null ? `${simulationState.currentSpeedKmh} km/h` : 'Reading...')
            : 'Speed Off';
        const speedSource = simulationState.speedHudEnabled
            ? (simulationState.speedSource || 'Calibrating GPS')
            : 'Tap to measure real GPS speed';
        const speedPillCls = simulationState.speedHudEnabled
            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-500'
            : 'bg-card border-subtle text-secondary hover:text-primary';

        boardingCardHtml = `
            <div class="py-1.5 px-3 bg-card-subtle/80 border-b border-subtle flex items-center justify-between gap-2">
                <div class="min-w-0 flex items-center gap-2">
                    <span id="hud-speed-dot" class="w-2 h-2 rounded-full ${simulationState.isSpeedEstimated ? 'bg-amber-400' : 'bg-emerald-500'} shrink-0"></span>
                    <div class="min-w-0">
                        <div id="hud-speed-title" class="text-[11px] font-extrabold text-primary truncate">${simulationState.speedHudEnabled ? `Train Speed: ${speedText}` : 'Live Metro Journey'}</div>
                        <div id="hud-speed-sub" class="text-[9.5px] text-secondary font-semibold truncate">${speedSource}</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button id="toggle-sound-btn" type="button" class="w-7 h-7 rounded-lg bg-card border border-subtle flex items-center justify-center text-secondary hover:text-emerald-500 cursor-pointer" title="Toggle 30s Arrival Chime">
                        <i data-lucide="${soundEnabled ? 'bell-ring' : 'bell-off'}" class="w-3.5 h-3.5"></i>
                    </button>
                    <button id="set-alarm-btn" type="button" class="flex items-center gap-1 px-2 py-1 rounded-xl border text-[10px] font-extrabold active:scale-95 transition-all cursor-pointer shrink-0 ${simulationState.alarmArmed ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-card border-subtle text-secondary hover:text-primary'}" title="Set Station Arrival Alarm">
                        <i data-lucide="${simulationState.alarmArmed ? 'alarm-clock-check' : 'alarm-clock'}" class="w-3.5 h-3.5 shrink-0"></i>
                        <span>${simulationState.alarmArmed ? 'Alarm On' : 'Set Alarm'}</span>
                    </button>
                    <button id="toggle-speed-btn" type="button" class="flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10.5px] font-extrabold active:scale-95 transition-all cursor-pointer tabular-nums shrink-0 ${speedPillCls}" title="Toggle GPS Speed Validation">
                        <i data-lucide="gauge" class="w-3.5 h-3.5 shrink-0"></i>
                        <span id="hud-speed-btn-label">${speedText}</span>
                    </button>
                </div>
            </div>
        `;
    }

    // NO_SERVICE: service ended for tonight, show tomorrow's first train
    if (simulationState.boardingState === 'NO_SERVICE') {
        const tomorrowTime = tomorrowFirstTrain?.departureFormatted || '05:00 AM';
        const tomorrowPlatform = tomorrowFirstTrain?.platform || 1;
        boardingCardHtml = `
            <div class="py-3 px-3 bg-slate-500/10 border-b border-slate-500/20 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-slate-500/20 flex items-center justify-center shrink-0">
                        <i data-lucide="moon" class="w-3.5 h-3.5 text-slate-400"></i>
                    </span>
                    <div class="min-w-0 flex-1">
                        <div class="text-[11.5px] font-black text-primary leading-tight">Service ended for tonight</div>
                        <div class="text-[10px] text-secondary font-semibold mt-0.5">Last train has left <span class="text-primary font-bold">${originName}</span></div>
                    </div>
                </div>
                <div class="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 min-w-0">
                        <i data-lucide="sunrise" class="w-4 h-4 text-amber-400 shrink-0"></i>
                        <div class="min-w-0">
                            <div class="text-[10px] text-secondary font-semibold">First train tomorrow</div>
                            <div class="text-[13px] font-black text-primary tabular-nums">${tomorrowTime}</div>
                        </div>
                    </div>
                    <div class="text-[9.5px] text-indigo-400 font-bold bg-indigo-500/15 px-2 py-0.5 rounded-full shrink-0">Platform ${tomorrowPlatform}</div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button id="set-tomorrow-alarm-btn" type="button" class="flex-1 py-1.5 rounded-lg ${simulationState.alarmArmed ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-500 hover:bg-indigo-600'} text-white font-extrabold text-[10.5px] active:scale-95 cursor-pointer flex items-center justify-center gap-1">
                        <i data-lucide="${simulationState.alarmArmed ? 'alarm-clock-check' : 'alarm-clock'}" class="w-3.5 h-3.5"></i>
                        <span>${simulationState.alarmArmed ? 'Alarm Set' : 'Set Alarm'}</span>
                    </button>
                    <button id="exit-journey-btn" type="button" class="flex-1 py-1.5 rounded-lg bg-card border border-subtle text-secondary hover:text-primary font-bold text-[10px] active:scale-95 cursor-pointer">Exit Journey</button>
                </div>
            </div>
        `;
    }

    let gpsWarningHtml = '';
    if (simulationState.boardingState === 'ON_BOARD' && showManualFinish) {
        gpsWarningHtml = `
            <div class="gps-warning-banner py-1.5 px-3 text-[10px] bg-amber-500/10 border-b border-amber-500/20 text-amber-500 flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 min-w-0">
                    <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-500 shrink-0"></i>
                    <span class="truncate">${!isOnline ? 'Saved timetable · ' : ''}Weak GPS · Timetable sync</span>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button id="step-prev-btn" type="button" class="px-2 py-0.5 rounded bg-card border border-subtle text-primary font-extrabold text-[10px] active:scale-90 cursor-pointer" title="Previous stop">‹ Back</button>
                    <button id="step-next-btn" type="button" class="px-2 py-0.5 rounded bg-card border border-subtle text-primary font-extrabold text-[10px] active:scale-90 cursor-pointer" title="Next stop">Next ›</button>
                </div>
            </div>
        `;
    }

    simStatus.innerHTML = `
        ${alertBannerHtml}
        <div class="w-full flex items-center justify-between py-2 pl-2 pr-2.5 bg-card/95 backdrop-blur-md border-b border-subtle shadow-sm gap-2">
            <button id="minimize-journey-btn" type="button" class="flex items-center gap-1 py-1 pl-0 pr-1.5 bg-transparent border-0 shadow-none text-primary hover:text-emerald-500 font-extrabold text-xs active:scale-95 transition-all shrink-0 cursor-pointer" title="Browse Stations / Timings (Ride stays active)">
                <i data-lucide="arrow-left" class="w-4 h-4 text-emerald-500 shrink-0"></i>
                <span class="whitespace-nowrap font-bold">Menu</span>
            </button>

            <div class="flex-1 min-w-0 px-1 text-center flex flex-col items-center justify-center">
                <div class="flex items-center gap-1.5 min-w-0 max-w-full justify-center">
                    <span id="hud-dest-name" class="text-xs sm:text-sm font-black uppercase tracking-tight text-primary truncate leading-tight">${destinationName}</span>
                    <span id="hud-gps-dot" class="gps-signal-dot ${gpsClass} shrink-0" title="${gpsTitle}"></span>
                </div>
                <div class="flex items-center gap-1 text-[10.5px] text-secondary font-semibold justify-center leading-tight mt-0.5 tabular-nums">
                    <i data-lucide="clock" class="w-3 h-3 text-emerald-500 shrink-0"></i>
                    <span id="hud-rem-min" class="whitespace-nowrap">${remainingMinutes} ${T('minRemaining') || 'min remaining'}</span>
                </div>
            </div>

            <button id="manual-finish-btn" type="button" class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all shrink-0 cursor-pointer" title="Complete Trip & View Gates">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                <span>${T('finish') || 'Finish'}</span>
            </button>
        </div>
        ${boardingCardHtml}
        ${gpsWarningHtml}
    `;

    if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
}

export function renderFloatingLiveRideBar({ simulationState, currentJourney, currentVisibleViewId }) {
    const bar = document.getElementById('floating-live-ride-bar');
    if (!bar) return;
    if (!simulationState.isActive || currentVisibleViewId === 'map-view') {
        bar.classList.add('hidden');
        return;
    }
    const journey = currentJourney || (() => {
        try { return JSON.parse(sessionStorage.getItem('activeJourney')); } catch (e) { return null; }
    })();
    if (!journey) {
        bar.classList.add('hidden');
        return;
    }

    const lastPart = journey.parts?.[journey.parts.length - 1];
    const destName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : 'Destination';
    const titleEl = document.getElementById('floating-ride-title');
    const subEl = document.getElementById('floating-ride-sub');
    const stopsLeft = Math.max(0, (simulationState.timeline?.length || 1) - 1 - (simulationState.currentStationIndex || 0));

    if (titleEl) titleEl.textContent = `Active Ride → ${destName}`;
    if (subEl) {
        if (simulationState.boardingState === 'NO_SERVICE') {
            subEl.textContent = `Service ended tonight · See tomorrow's trains`;
        } else if (
            simulationState.boardingState === 'INTERCHANGE_CHECK' ||
            simulationState.boardingState === 'INTERCHANGE_WAITING' ||
            simulationState.boardingState === 'INTERCHANGE_ARRIVAL'
        ) {
            subEl.textContent = `Changing trains at interchange • Tap to return`;
        } else if (simulationState.boardingState === 'WAITING_AT_PLATFORM' || simulationState.boardingState === 'ARRIVAL_CHECK') {
            const origin = simulationState.timeline?.[0]?.stationName || 'Origin';
            subEl.textContent = `Waiting at ${origin} • Tap to return`;
        } else {
            const speedNote = (simulationState.speedHudEnabled && simulationState.currentSpeedKmh !== null)
                ? `${simulationState.currentSpeedKmh} km/h • `
                : '';
            subEl.textContent = `${speedNote}${stopsLeft} ${stopsLeft === 1 ? 'stop' : 'stops'} left • Tap to return`;
        }
    }
    bar.classList.remove('hidden');
}

