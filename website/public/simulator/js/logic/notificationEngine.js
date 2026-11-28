/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
/**
 * NammaRide Multi-Channel 30-Second Arrival Notification & Web Alarm Engine
 *
 * Delivers once-per-event arrival notifications & alarms when <= 30s remain or on arrival:
 *  - Incoming train arriving at user's boarding platform (BOARDING_30S)
 *  - User's train approaching interchange transfer station (INTERCHANGE_30S)
 *  - User's train reaching destination station (DEST_30S / DEST_ARRIVED)
 *  - User-armed Web/PWA Station Alarm & First-Train Reminder
 *
 * Channels:
 *  1. Native Android Local Notifications (@capacitor/local-notifications)
 *  2. PWA / Web ServiceWorkerRegistration.showNotification (works on iOS 16.4+ PWA, Android & Desktop)
 *     with new Notification() fallback
 *  3. Haptic pulse pattern + Web Audio transit chime / repeating station alarm
 */

export const ALERT_THRESHOLD_SEC = 30;
export const ALERT_CHANNEL_ID = 'nammaride_train_alerts';
export const NOTIF_ID_BOARDING = 1001;
export const NOTIF_ID_INTERCHANGE = 1002;
export const NOTIF_ID_DESTINATION = 1003;
export const NOTIF_ID_DEST_ARRIVED = 1004;
export const NOTIF_ID_CUSTOM_ALARM = 1005;

const SOUND_PREF_KEY = 'nammaride_alert_sound';

/**
 * Pure state-machine evaluator for 30-second arrival notifications (unit-testable).
 */
export function evaluateThirtySecondAlert({
    boardingState,
    waitSecLeft = null,
    originName = 'Station',
    platform = 1,
    direction = '',
    tripKey = 'active',
    etaToDestSec = null,
    destName = 'Destination',
    etaToInterchangeSec = null,
    interchangeName = '',
    nextLineName = '',
    nextPlatform = 1,
    journeyId = 'trip',
    alertedKeys = new Set(),
} = {}) {
    if (
        boardingState === 'WAITING_AT_PLATFORM' ||
        boardingState === 'ARRIVAL_CHECK' ||
        boardingState === 'INTERCHANGE_WAITING' ||
        boardingState === 'INTERCHANGE_ARRIVAL'
    ) {
        if (typeof waitSecLeft === 'number' && waitSecLeft > 0 && waitSecLeft <= ALERT_THRESHOLD_SEC) {
            const dedupKey = `board_${tripKey}`;
            if (!alertedKeys.has(dedupKey)) {
                const dirPart = direction ? ` towards ${direction}` : '';
                return {
                    kind: 'BOARDING_30S',
                    id: NOTIF_ID_BOARDING,
                    dedupKey,
                    secondsLeft: Math.max(1, Math.round(waitSecLeft)),
                    title: `Train arriving in ${Math.max(1, Math.round(waitSecLeft))}s · ${originName}`,
                    body: `Step onto Platform ${platform}${dirPart}.`,
                };
            }
        }
        return null;
    }

    if (boardingState === 'ON_BOARD') {
        if (
            typeof etaToInterchangeSec === 'number' &&
            etaToInterchangeSec > 0 &&
            etaToInterchangeSec <= ALERT_THRESHOLD_SEC &&
            interchangeName
        ) {
            const dedupKey = `xfer_${journeyId}_${interchangeName}`;
            if (!alertedKeys.has(dedupKey)) {
                return {
                    kind: 'INTERCHANGE_30S',
                    id: NOTIF_ID_INTERCHANGE,
                    dedupKey,
                    secondsLeft: Math.max(1, Math.round(etaToInterchangeSec)),
                    title: `Interchange in ${Math.max(1, Math.round(etaToInterchangeSec))}s · ${interchangeName}`,
                    body: `Prepare to change to ${nextLineName || 'connecting line'} (Platform ${nextPlatform}).`,
                };
            }
        }

        if (typeof etaToDestSec === 'number' && etaToDestSec > 0 && etaToDestSec <= ALERT_THRESHOLD_SEC) {
            const dedupKey = `dest_${journeyId}`;
            if (!alertedKeys.has(dedupKey)) {
                return {
                    kind: 'DEST_30S',
                    id: NOTIF_ID_DESTINATION,
                    dedupKey,
                    secondsLeft: Math.max(1, Math.round(etaToDestSec)),
                    title: `Arriving in ${Math.max(1, Math.round(etaToDestSec))}s · ${destName}`,
                    body: `Keep your QR/card ready — approach exit doors.`,
                };
            }
        }
    }

    return null;
}

class NotificationController {
    constructor() {
        this.alertedKeys = new Set();
        this.channelReady = false;
        this.scheduledBoardingKey = null;
        this.scheduledDestKey = null;
        this.audioCtx = null;
        this.soundEnabled = this._loadSoundPref();
        this.activeBannerAlert = null;
        this.bannerExpireMs = 0;
        this.webTimers = new Map();
        this.alarmRingInterval = null;
        this.alarmAutoStopTimer = null;
        this.isAlarmRinging = false;
    }

    _loadSoundPref() {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(SOUND_PREF_KEY) !== '0';
            }
        } catch (e) {}
        return true;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    toggleSoundEnabled() {
        this.soundEnabled = !this.soundEnabled;
        if (!this.soundEnabled) {
            this.stopAlarmRing();
        }
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(SOUND_PREF_KEY, this.soundEnabled ? '1' : '0');
            }
        } catch (e) {}
        return this.soundEnabled;
    }

    getPlugin() {
        if (typeof window === 'undefined') return null;
        return window.Capacitor?.isNativePlatform?.()
            ? (window.Capacitor?.Plugins?.LocalNotifications || null)
            : null;
    }

    unlockAudioContext() {
        try {
            const Ctx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
            if (!Ctx) return;
            if (!this.audioCtx) this.audioCtx = new Ctx();
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().catch(() => {});
            }
            // Play 1-sample silent buffer so iOS Safari / PWA keeps Web Audio unlocked for scheduled alarms
            const buf = this.audioCtx.createBuffer(1, 1, 22050);
            const src = this.audioCtx.createBufferSource();
            src.buffer = buf;
            src.connect(this.audioCtx.destination);
            src.start(0);
        } catch (e) {}
    }

    playTransitChime(isUrgentAlarm = false) {
        if (!this.soundEnabled) return;
        try {
            const Ctx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
            if (!Ctx) return;
            if (!this.audioCtx) this.audioCtx = new Ctx();
            const ctx = this.audioCtx;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});

            const now = ctx.currentTime;
            const playTone = (freq, startOffset, dur, peak = 0.14) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = isUrgentAlarm ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, now + startOffset);
                gain.gain.setValueAtTime(0.0001, now + startOffset);
                gain.gain.exponentialRampToValueAtTime(peak, now + startOffset + 0.025);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + startOffset);
                osc.stop(now + startOffset + dur + 0.02);
            };

            if (isUrgentAlarm) {
                // Distinct 3-note metro station arrival alarm chime
                playTone(987.77, 0, 0.16, 0.2);
                playTone(1318.51, 0.18, 0.16, 0.22);
                playTone(1567.98, 0.36, 0.28, 0.24);
            } else {
                // Clean two-note BMRCL-style platform chime (A5 -> D6)
                playTone(880, 0, 0.16, 0.14);
                playTone(1174.66, 0.16, 0.24, 0.16);
            }
        } catch (e) {}
    }

    startAlarmRing() {
        this.stopAlarmRing();
        this.isAlarmRinging = true;
        this.playTransitChime(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([400, 180, 400, 180, 500]); } catch (e) {}
        }
        if (typeof setInterval !== 'undefined') {
            this.alarmRingInterval = setInterval(() => {
                if (!this.isAlarmRinging) return;
                this.playTransitChime(true);
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    try { navigator.vibrate([320, 140, 320]); } catch (e) {}
                }
            }, 2400);
        }
        if (typeof setTimeout !== 'undefined') {
            this.alarmAutoStopTimer = setTimeout(() => {
                this.stopAlarmRing();
            }, 18000);
        }
    }

    stopAlarmRing() {
        this.isAlarmRinging = false;
        if (this.alarmRingInterval) {
            clearInterval(this.alarmRingInterval);
            this.alarmRingInterval = null;
        }
        if (this.alarmAutoStopTimer) {
            clearTimeout(this.alarmAutoStopTimer);
            this.alarmAutoStopTimer = null;
        }
    }

    dismissBannerAlert() {
        this.stopAlarmRing();
        this.activeBannerAlert = null;
        this.bannerExpireMs = 0;
    }

    getWebNotificationStatus() {
        if (typeof Notification === 'undefined') return 'unsupported';
        return Notification.permission;
    }

    async ensureReadyAndRequestPermission() {
        const plugin = this.getPlugin();
        if (plugin) {
            try {
                if (!this.channelReady && typeof plugin.createChannel === 'function') {
                    await plugin.createChannel({
                        id: ALERT_CHANNEL_ID,
                        name: 'Train Arrival Alerts (30s)',
                        description: 'Notifies you 30 seconds before your metro arrives or reaches your stop',
                        importance: 5,
                        visibility: 1,
                        vibration: true,
                    });
                    this.channelReady = true;
                }
                const perm = await plugin.checkPermissions?.();
                if (perm?.display === 'prompt' || perm?.display === 'prompt-with-rationale') {
                    const res = await plugin.requestPermissions?.();
                    return res?.display || 'granted';
                }
                return perm?.display || 'granted';
            } catch (e) {
                return 'unsupported';
            }
        }

        if (typeof Notification === 'undefined') return 'unsupported';
        if (Notification.permission === 'default') {
            try {
                const res = await Notification.requestPermission();
                return res;
            } catch (e) {
                return Notification.permission;
            }
        }
        return Notification.permission;
    }

    async _dispatchWebNotification(alertDesc) {
        if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;

        const targetUrl = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/app')
            ? '/app/'
            : './';
        const options = {
            body: alertDesc.body,
            icon: 'assets/icons/icon-192x192.png',
            badge: 'assets/icons/icon-192x192.png',
            tag: alertDesc.dedupKey,
            renotify: true,
            requireInteraction: Boolean(alertDesc.isAlarm || alertDesc.kind === 'DEST_ARRIVED'),
            vibrate: [300, 140, 300, 140, 420],
            data: { url: targetUrl },
        };

        // Prefer ServiceWorkerRegistration.showNotification (required on mobile Chrome & iOS 16.4+ PWA)
        try {
            if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
                const reg = await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise((resolve) => setTimeout(() => resolve(null), 900)),
                ]);
                if (reg && typeof reg.showNotification === 'function') {
                    await reg.showNotification(alertDesc.title, options);
                    return true;
                }
            }
        } catch (e) {}

        // Direct Web Notification fallback
        try {
            new Notification(alertDesc.title, {
                body: alertDesc.body,
                icon: 'assets/icons/icon-192x192.png',
                tag: alertDesc.dedupKey,
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    _scheduleWebTimer(id, delayMs, alertDesc) {
        this._clearWebTimer(id);
        if (typeof setTimeout === 'undefined') return;
        // Browser setTimeout max safe 32-bit signed int (~24.8 days)
        const clampedMs = Math.min(Math.max(0, delayMs), 2147483000);
        const handle = setTimeout(() => {
            this.webTimers.delete(id);
            if (!this.alertedKeys.has(alertDesc.dedupKey)) {
                this.fireAlert(alertDesc);
            }
        }, clampedMs);
        this.webTimers.set(id, handle);
    }

    _clearWebTimer(id) {
        const existing = this.webTimers.get(id);
        if (existing) {
            clearTimeout(existing);
            this.webTimers.delete(id);
        }
    }

    async schedulePreBoardThirtySecondReminder({ targetMs, originName, platform = 1, direction = '', tripKey = 'active', isAlarm = false }) {
        if (!targetMs || !Number.isFinite(targetMs)) return;
        const triggerMs = targetMs - ALERT_THRESHOLD_SEC * 1000;
        const msUntilTrigger = triggerMs - Date.now();
        if (msUntilTrigger <= 2000) return; // Immediate evaluator handles <= 30s
        if (this.scheduledBoardingKey === `${tripKey}_${targetMs}_${isAlarm ? 1 : 0}`) return;
        this.scheduledBoardingKey = `${tripKey}_${targetMs}_${isAlarm ? 1 : 0}`;

        const dirPart = direction ? ` towards ${direction}` : '';
        const plugin = this.getPlugin();
        if (!plugin) {
            this._scheduleWebTimer(NOTIF_ID_BOARDING, msUntilTrigger, {
                kind: 'BOARDING_30S',
                id: NOTIF_ID_BOARDING,
                dedupKey: `board_${tripKey}`,
                secondsLeft: ALERT_THRESHOLD_SEC,
                title: `Train arriving in 30s · ${originName}`,
                body: `Step onto Platform ${platform}${dirPart}.`,
                isAlarm,
            });
            return;
        }

        try {
            await this.ensureReadyAndRequestPermission();
            await plugin.cancel?.({ notifications: [{ id: NOTIF_ID_BOARDING }] });
            await plugin.schedule({
                notifications: [
                    {
                        id: NOTIF_ID_BOARDING,
                        title: `Train in 30s · ${originName}`,
                        body: `Step onto Platform ${platform}${dirPart}.`,
                        channelId: ALERT_CHANNEL_ID,
                        schedule: { at: new Date(triggerMs) },
                        smallIcon: 'ic_stat_namma_train',
                        iconColor: '#10B981',
                        autoCancel: true,
                    },
                ],
            });
        } catch (e) {}
    }

    async cancelPendingAlerts(ids = [NOTIF_ID_BOARDING, NOTIF_ID_INTERCHANGE, NOTIF_ID_DESTINATION, NOTIF_ID_DEST_ARRIVED, NOTIF_ID_CUSTOM_ALARM]) {
        if (ids.includes(NOTIF_ID_BOARDING)) this.scheduledBoardingKey = null;
        if (ids.includes(NOTIF_ID_DESTINATION)) this.scheduledDestKey = null;
        ids.forEach((id) => this._clearWebTimer(id));

        const plugin = this.getPlugin();
        if (!plugin) return;
        try {
            await plugin.cancel?.({ notifications: ids.map((id) => ({ id })) });
        } catch (e) {}
    }

    async scheduleDestinationThirtySecondReminder({ targetMs, destName, journeyId = 'trip', isAlarm = false }) {
        if (!targetMs || !Number.isFinite(targetMs)) return;
        const triggerMs = targetMs - ALERT_THRESHOLD_SEC * 1000;
        const msUntilTrigger = triggerMs - Date.now();
        if (msUntilTrigger <= 2000) return;
        const key = `${journeyId}_${Math.round(targetMs / 1000)}_${isAlarm ? 1 : 0}`;
        if (this.scheduledDestKey === key) return;
        this.scheduledDestKey = key;

        const plugin = this.getPlugin();
        if (!plugin) {
            this._scheduleWebTimer(NOTIF_ID_DESTINATION, msUntilTrigger, {
                kind: 'DEST_30S',
                id: NOTIF_ID_DESTINATION,
                dedupKey: `dest_${journeyId}`,
                secondsLeft: ALERT_THRESHOLD_SEC,
                title: `Arriving in 30s · ${destName}`,
                body: `Keep your QR/card ready — approach exit doors.`,
                isAlarm,
            });
            return;
        }
        try {
            await this.ensureReadyAndRequestPermission();
            await plugin.cancel?.({ notifications: [{ id: NOTIF_ID_DESTINATION }] });
            await plugin.schedule({
                notifications: [
                    {
                        id: NOTIF_ID_DESTINATION,
                        title: `Arriving in 30s · ${destName}`,
                        body: `Keep your QR/card ready — approach exit doors.`,
                        channelId: ALERT_CHANNEL_ID,
                        schedule: { at: new Date(triggerMs) },
                        smallIcon: 'ic_stat_namma_train',
                        iconColor: '#10B981',
                        autoCancel: true,
                    },
                ],
            });
        } catch (e) {}
    }

    async scheduleCustomAlarm({ id = NOTIF_ID_CUSTOM_ALARM, dedupKey, targetMs, title, body, repeatChime = true }) {
        if (!targetMs || !Number.isFinite(targetMs)) return false;
        const msUntil = targetMs - Date.now();
        if (msUntil <= 0) return false;

        const alertDesc = {
            kind: 'CUSTOM_ALARM',
            id,
            dedupKey: dedupKey || `alarm_${id}_${Math.round(targetMs / 1000)}`,
            secondsLeft: 0,
            title,
            body,
            isAlarm: repeatChime,
        };

        const plugin = this.getPlugin();
        if (!plugin) {
            this._scheduleWebTimer(id, msUntil, alertDesc);
            return true;
        }

        try {
            await this.ensureReadyAndRequestPermission();
            await plugin.cancel?.({ notifications: [{ id }] });
            await plugin.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        channelId: ALERT_CHANNEL_ID,
                        schedule: { at: new Date(targetMs) },
                        smallIcon: 'ic_stat_namma_train',
                        iconColor: '#10B981',
                        autoCancel: true,
                    },
                ],
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    async triggerDestinationArrived({ destName, journeyId = 'trip', isAlarm = false }) {
        const dedupKey = `arrived_${journeyId}`;
        if (this.alertedKeys.has(dedupKey)) return false;
        return this.fireAlert({
            kind: 'DEST_ARRIVED',
            id: NOTIF_ID_DEST_ARRIVED,
            dedupKey,
            secondsLeft: 0,
            title: `Arrived at ${destName}!`,
            body: `You have reached ${destName}. Tap to view exit gates & nearby places.`,
            isAlarm,
        });
    }

    async fireAlert(alertDesc) {
        if (!alertDesc) return false;
        this.alertedKeys.add(alertDesc.dedupKey);
        this.activeBannerAlert = alertDesc;
        this.bannerExpireMs = Date.now() + 28000;

        if (alertDesc.isAlarm) {
            this.startAlarmRing();
        } else {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate([280, 120, 280]); } catch (e) {}
            }
            this.playTransitChime(false);
        }

        const plugin = this.getPlugin();
        if (plugin) {
            try {
                await this.ensureReadyAndRequestPermission();
                const perm = await plugin.checkPermissions?.();
                if (!perm || perm.display === 'granted') {
                    await plugin.schedule({
                        notifications: [
                            {
                                id: alertDesc.id,
                                title: alertDesc.title,
                                body: alertDesc.body,
                                channelId: ALERT_CHANNEL_ID,
                                schedule: { at: new Date(Date.now() + 150) },
                                smallIcon: 'ic_stat_namma_train',
                                iconColor: '#10B981',
                                autoCancel: true,
                            },
                        ],
                    });
                }
            } catch (e) {}
            return true;
        }

        await this._dispatchWebNotification(alertDesc);
        return true;
    }

    getVisibleBannerAlert() {
        if (!this.activeBannerAlert) return null;
        if (Date.now() > this.bannerExpireMs) {
            this.activeBannerAlert = null;
            return null;
        }
        return this.activeBannerAlert;
    }

    resetAll() {
        this.stopAlarmRing();
        this.alertedKeys.clear();
        this.scheduledBoardingKey = null;
        this.scheduledDestKey = null;
        this.activeBannerAlert = null;
        this.bannerExpireMs = 0;
        this.cancelPendingAlerts();
    }
}

export const notificationController = new NotificationController();
