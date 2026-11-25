/**
 * NammaRide Multi-Channel 30-Second Arrival Notification Engine
 *
 * Delivers once-per-event arrival notifications when <= 30s remain for:
 *  - Incoming train arriving at user's boarding platform (BOARDING_30S)
 *  - User's train approaching interchange transfer station (INTERCHANGE_30S)
 *  - User's train reaching destination station (DEST_30S)
 *
 * Channels:
 *  1. Native Android Local Notifications (@capacitor/local-notifications)
 *     - Respects Android 13-16 POST_NOTIFICATIONS runtime permission
 *     - Pre-schedules at (targetMs - 30_000ms) for lock-screen/Doze delivery
 *     - Automatically cancels stale schedules if user boards or switches trains
 *  2. Web Notification API fallback (for browser / PWA sessions)
 *  3. Haptic pulse pattern + mute-toggleable Web Audio transit chime
 */

export const ALERT_THRESHOLD_SEC = 30;
export const ALERT_CHANNEL_ID = 'nammaride_train_alerts';
export const NOTIF_ID_BOARDING = 1001;
export const NOTIF_ID_INTERCHANGE = 1002;
export const NOTIF_ID_DESTINATION = 1003;
export const NOTIF_ID_DEST_ARRIVED = 1004;

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
        this.audioCtx = null;
        this.soundEnabled = this._loadSoundPref();
        this.activeBannerAlert = null;
        this.bannerExpireMs = 0;
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
        } catch (e) {}
    }

    playTransitChime() {
        if (!this.soundEnabled) return;
        try {
            const Ctx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
            if (!Ctx) return;
            if (!this.audioCtx) this.audioCtx = new Ctx();
            const ctx = this.audioCtx;
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});

            const now = ctx.currentTime;
            const playTone = (freq, startOffset, dur) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + startOffset);
                gain.gain.setValueAtTime(0.0001, now + startOffset);
                gain.gain.exponentialRampToValueAtTime(0.14, now + startOffset + 0.025);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + startOffset);
                osc.stop(now + startOffset + dur + 0.02);
            };
            // Clean two-note BMRCL-style platform chime (A5 -> D6)
            playTone(880, 0, 0.16);
            playTone(1174.66, 0.16, 0.24);
        } catch (e) {}
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
                    await plugin.requestPermissions?.();
                }
            } catch (e) {}
            return;
        }

        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            try { Notification.requestPermission().catch(() => {}); } catch (e) {}
        }
    }

    async schedulePreBoardThirtySecondReminder({ targetMs, originName, platform = 1, direction = '', tripKey = 'active' }) {
        if (!targetMs || !Number.isFinite(targetMs)) return;
        const triggerMs = targetMs - ALERT_THRESHOLD_SEC * 1000;
        const msUntilTrigger = triggerMs - Date.now();
        if (msUntilTrigger <= 2000) return; // Immediate evaluator handles <= 30s
        if (this.scheduledBoardingKey === `${tripKey}_${targetMs}`) return;
        this.scheduledBoardingKey = `${tripKey}_${targetMs}`;

        const plugin = this.getPlugin();
        if (!plugin) return;

        try {
            await this.ensureReadyAndRequestPermission();
            await plugin.cancel?.({ notifications: [{ id: NOTIF_ID_BOARDING }] });
            const dirPart = direction ? ` towards ${direction}` : '';
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

    async cancelPendingAlerts(ids = [NOTIF_ID_BOARDING, NOTIF_ID_INTERCHANGE, NOTIF_ID_DESTINATION, NOTIF_ID_DEST_ARRIVED]) {
        this.scheduledBoardingKey = null;
        this.scheduledDestKey = null;
        const plugin = this.getPlugin();
        if (!plugin) return;
        try {
            await plugin.cancel?.({ notifications: ids.map((id) => ({ id })) });
        } catch (e) {}
    }

    async scheduleDestinationThirtySecondReminder({ targetMs, destName, journeyId = 'trip' }) {
        if (!targetMs || !Number.isFinite(targetMs)) return;
        const triggerMs = targetMs - ALERT_THRESHOLD_SEC * 1000;
        if (triggerMs - Date.now() <= 2000) return;
        const key = `${journeyId}_${Math.round(targetMs / 1000)}`;
        if (this.scheduledDestKey === key) return;
        this.scheduledDestKey = key;

        const plugin = this.getPlugin();
        if (!plugin) return;
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

    async triggerDestinationArrived({ destName, journeyId = 'trip' }) {
        const dedupKey = `arrived_${journeyId}`;
        if (this.alertedKeys.has(dedupKey)) return false;
        return this.fireAlert({
            kind: 'DEST_ARRIVED',
            id: NOTIF_ID_DEST_ARRIVED,
            dedupKey,
            secondsLeft: 0,
            title: `Arrived at ${destName}!`,
            body: `You have reached ${destName}. Tap to view exit gates & nearby places.`,
        });
    }

    async fireAlert(alertDesc) {
        if (!alertDesc) return false;
        this.alertedKeys.add(alertDesc.dedupKey);
        this.activeBannerAlert = alertDesc;
        this.bannerExpireMs = Date.now() + 28000;

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([280, 120, 280]); } catch (e) {}
        }
        this.playTransitChime();

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

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                new Notification(alertDesc.title, {
                    body: alertDesc.body,
                    icon: 'assets/images/logo_app.png',
                    tag: alertDesc.dedupKey,
                });
            } catch (e) {}
        }
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
        this.alertedKeys.clear();
        this.scheduledBoardingKey = null;
        this.activeBannerAlert = null;
        this.bannerExpireMs = 0;
        this.cancelPendingAlerts();
    }
}

export const notificationController = new NotificationController();

