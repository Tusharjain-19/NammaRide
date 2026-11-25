/**
 * NammaRide Real-Time Train Location Refresh & Crossed-Station Pruning Engine
 *
 * Algorithms:
 * 1. Adaptive 5-10s Polling Scheduler (wall-clock anchored via Date.now())
 * 2. Automatic Missed-Candidate Rollover (prevents stale countdowns)
 * 3. Sliding-Window Crossed-Station Pruning (removes upstream stops once crossed)
 * 4. Normalized Continuous Cursor Mapping (prevents visual jump when DOM rows prune)
 */

export const REFRESH_INTERVAL_FAST_MS = 5000;
export const REFRESH_INTERVAL_CRUISE_MS = 8500;
export const REFRESH_INTERVAL_BG_MS = 10000;
export const CROSSED_STOP_THRESHOLD = 0.25;

/**
 * Determine optimal train-location polling period inside the 5-10s envelope.
 * @param {object} params
 * @returns {number} refresh period in milliseconds
 */
export function computeRefreshIntervalMs({ boardingState, waitSecLeft = 0, isHidden = false } = {}) {
    if (isHidden) return REFRESH_INTERVAL_BG_MS;
    if (boardingState === 'ON_BOARD') return REFRESH_INTERVAL_FAST_MS;
    if (
        boardingState === 'ARRIVAL_CHECK' ||
        boardingState === 'INTERCHANGE_ARRIVAL' ||
        (waitSecLeft > 0 && waitSecLeft <= 180)
    ) {
        return REFRESH_INTERVAL_FAST_MS;
    }
    return REFRESH_INTERVAL_CRUISE_MS;
}

/**
 * Given ordered upstream approach stations (farthest -> closest to origin) and
 * the approaching train's live continuous station index, prune any station the
 * train has already crossed beyond `passedThreshold` along `dirSign`.
 *
 * Also computes `cursorTrackFloat` mapped over:
 *   0                       = #upstream-summary-bar rail anchor
 *   1 .. visible.length     = remaining uncrossed upstream stations
 *   visible.length + 1      = user's boarding station (origin)
 */
export function computePrunedUpstreamWindow({
    rawUpstream = [],
    matchedTrain = null,
    originIdx = 0,
    dirSign = 1,
    passedThreshold = CROSSED_STOP_THRESHOLD,
} = {}) {
    if (!Array.isArray(rawUpstream) || rawUpstream.length === 0) {
        let cursorTrackFloat = 0.5;
        if (matchedTrain && Number.isFinite(matchedTrain.stationFloatIdx)) {
            const distToOrigin = Math.max(0, (originIdx - matchedTrain.stationFloatIdx) * dirSign);
            cursorTrackFloat = distToOrigin <= 1 ? Math.max(0.05, 1 - distToOrigin) : 0.1;
        }
        return {
            visibleUpstream: [],
            prunedIds: [],
            cursorTrackFloat: Math.max(0, Math.min(1, cursorTrackFloat)),
        };
    }

    const trainPos = matchedTrain && Number.isFinite(matchedTrain.stationFloatIdx)
        ? matchedTrain.stationFloatIdx
        : null;

    const visibleUpstream = [];
    const prunedIds = [];

    for (const up of rawUpstream) {
        if (trainPos !== null) {
            const passedDelta = (trainPos - up.lineIdx) * dirSign;
            if (passedDelta > passedThreshold) {
                prunedIds.push(up.id);
                continue;
            }
        }
        visibleUpstream.push(up);
    }

    const totalSlots = visibleUpstream.length + 1; // index 0 = summary anchor, last = origin
    let cursorTrackFloat = 0.08;

    if (trainPos !== null) {
        const distFromOrigin = (originIdx - trainPos) * dirSign;
        if (visibleUpstream.length === 0) {
            // All upstream stops before origin are crossed: train runs from summary anchor (0) -> origin (1)
            const span = Math.max(0.01, 1 - passedThreshold);
            cursorTrackFloat = distFromOrigin >= 1
                ? 0.1
                : Math.max(0.12, Math.min(1, 1 - (distFromOrigin / span) * 0.85));
        } else {
            const firstVisibleIdx = visibleUpstream[0].lineIdx;
            const stepsPastFirst = (trainPos - firstVisibleIdx) * dirSign;
            if (stepsPastFirst >= 0) {
                // Inside visible upstream stops: 1.0 (at firstVisible) .. visibleUpstream.length+1 (at origin)
                cursorTrackFloat = Math.max(1, Math.min(totalSlots, 1 + stepsPastFirst));
            } else {
                // Between summary bar (0) and first visible upstream stop (1)
                const distBeforeFirst = -stepsPastFirst;
                const enterFraction = Math.max(0.05, Math.min(0.98, 1 - Math.min(1, distBeforeFirst)));
                cursorTrackFloat = enterFraction;
            }
        }
    }

    return {
        visibleUpstream,
        prunedIds,
        cursorTrackFloat: Math.max(0, Math.min(totalSlots, cursorTrackFloat)),
    };
}

/**
 * Determine which already-passed route stations during ON_BOARD ride can be
 * collapsed cleanly so the active segment stays anchored near the top.
 */
export function computeOnBoardPassedWindow({
    timelineLength = 0,
    activeTimelineIndex = 0,
    routeFloatIndex = 0,
    passedThreshold = CROSSED_STOP_THRESHOLD,
    showPassedManual = false,
} = {}) {
    if (timelineLength <= 2 || activeTimelineIndex <= 0) {
        return { passedIndices: [], hiddenPassedIndices: [], passedCount: 0 };
    }
    const passedIndices = [];
    for (let i = 0; i < activeTimelineIndex; i++) {
        if ((routeFloatIndex - i) > passedThreshold) {
            passedIndices.push(i);
        }
    }
    const hiddenPassedIndices = showPassedManual ? [] : passedIndices;
    return {
        passedIndices,
        hiddenPassedIndices,
        passedCount: passedIndices.length,
    };
}

/**
 * Reconcile waiting train candidate so countdowns roll over automatically once a
 * train has clearly departed without user boarding (nowMs > targetMs + 35s).
 */
export function reconcileActiveTrainCandidate({
    journey,
    legIndex = 0,
    candidates = [],
    waitingTrainIndex = 0,
    waitingTargetDate = null,
    nowMs = Date.now(),
    overrides = null,
    getNextDeparturesFn = null,
} = {}) {
    const currentIdx = Math.max(0, waitingTrainIndex || 0);
    const currentCand = candidates[currentIdx] || null;
    const targetMs = waitingTargetDate
        ? new Date(waitingTargetDate).getTime()
        : (currentCand?.departureDate ? new Date(currentCand.departureDate).getTime() : 0);

    // Not yet departed (allow 35s dwelling/grace buffer at platform)
    if (targetMs && nowMs <= targetMs + 35000) {
        return {
            rolledOver: false,
            candidates,
            waitingTrainIndex: currentIdx,
            candidate: currentCand,
            waitingTargetDate: new Date(targetMs),
        };
    }

    // Try advancing to next non-expired cached candidate
    for (let i = currentIdx + 1; i < candidates.length; i++) {
        const cMs = candidates[i]?.departureDate ? new Date(candidates[i].departureDate).getTime() : 0;
        if (cMs > nowMs - 10000) {
            return {
                rolledOver: true,
                candidates,
                waitingTrainIndex: i,
                candidate: candidates[i],
                waitingTargetDate: new Date(cMs),
            };
        }
    }

    // Re-query schedule engine for fresh departures
    if (typeof getNextDeparturesFn === 'function' && journey) {
        const fresh = getNextDeparturesFn(journey, new Date(nowMs + 5000), overrides, legIndex);
        const list = (fresh?.trains || []).filter((t) => !t.isTomorrow);
        if (list.length > 0) {
            return {
                rolledOver: true,
                candidates: list,
                waitingTrainIndex: 0,
                candidate: list[0],
                waitingTargetDate: new Date(list[0].departureDate),
            };
        }
    }

    return {
        rolledOver: false,
        candidates,
        waitingTrainIndex: currentIdx,
        candidate: currentCand,
        waitingTargetDate: waitingTargetDate ? new Date(waitingTargetDate) : null,
    };
}

/**
 * Stateful 5-10s adaptive location refresh orchestrator (UI-safe, timer-leak free).
 */
export class TrainLocationRefresher {
    constructor({ onRefresh, onTick1s, nowFn = () => Date.now() } = {}) {
        this.onRefresh = onRefresh;
        this.onTick1s = onTick1s;
        this.nowFn = nowFn;
        this.refreshTimerId = null;
        this.tickTimerId = null;
        this.lastSyncMs = 0;
        this.running = false;
        this._getContext = () => ({});
    }

    start(getContextFn) {
        this.stop();
        this._getContext = typeof getContextFn === 'function' ? getContextFn : () => ({});
        this.running = true;
        this.lastSyncMs = this.nowFn();
        this._scheduleNextRefresh();
        this._scheduleNextTick();
    }

    stop() {
        this.running = false;
        if (this.refreshTimerId) {
            clearTimeout(this.refreshTimerId);
            this.refreshTimerId = null;
        }
        if (this.tickTimerId) {
            clearTimeout(this.tickTimerId);
            this.tickTimerId = null;
        }
    }

    forceSync() {
        if (!this.running) return;
        this.lastSyncMs = this.nowFn();
        if (typeof this.onRefresh === 'function') {
            this.onRefresh({ nowMs: this.lastSyncMs, forced: true });
        }
        this._scheduleNextRefresh();
    }

    getSecondsSinceSync() {
        if (!this.lastSyncMs) return 0;
        return Math.max(0, Math.floor((this.nowFn() - this.lastSyncMs) / 1000));
    }

    _scheduleNextRefresh() {
        if (this.refreshTimerId) clearTimeout(this.refreshTimerId);
        if (!this.running) return;
        const ctx = this._getContext();
        const isHidden = typeof document !== 'undefined' && document.hidden;
        if (isHidden) return;
        const delayMs = computeRefreshIntervalMs({ ...ctx, isHidden: false });
        this.refreshTimerId = setTimeout(() => {
            if (!this.running || (typeof document !== 'undefined' && document.hidden)) return;
            this.lastSyncMs = this.nowFn();
            if (typeof this.onRefresh === 'function') {
                this.onRefresh({ nowMs: this.lastSyncMs, forced: false });
            }
            this._scheduleNextRefresh();
        }, delayMs);
    }

    _scheduleNextTick() {
        if (this.tickTimerId) clearTimeout(this.tickTimerId);
        if (!this.running || (typeof document !== 'undefined' && document.hidden)) return;
        this.tickTimerId = setTimeout(() => {
            if (!this.running || (typeof document !== 'undefined' && document.hidden)) return;
            if (typeof this.onTick1s === 'function') {
                this.onTick1s({ nowMs: this.nowFn(), secSinceSync: this.getSecondsSinceSync() });
            }
            this._scheduleNextTick();
        }, 1000);
    }
}
