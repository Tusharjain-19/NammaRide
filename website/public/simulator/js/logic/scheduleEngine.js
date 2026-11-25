/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
/**
 * NammaRide Deterministic BMRCL Schedule & Live Train Engine (Zero-Server)
 * Computes next-train departures, short-loop filtering, holiday/Sunday shifts,
 * station dwell offsets, active line train positions, and hourly crowd indices.
 */
import { SCHEDULE_DATA } from '../data/scheduleData.js';
import { CROWD_HOURLY } from '../data/crowdHourly.js';
import { metroData } from '../data/stations.js';
import { computePrunedUpstreamWindow } from './trainTrackerEngine.js';

const IST_OFFSET_MS = 5.5 * 3600 * 1000;
const DAY_SEC = 86400;
const MAX_EXPANDED_CACHE = 32;
const expandedCache = new Map();

function buildStationNameIndex() {
    const map = {};
    for (const lk of Object.keys(metroData || {})) {
        map[lk] = {};
        for (const st of (metroData[lk]?.stations || [])) {
            map[lk][st.id] = st.name;
        }
    }
    return map;
}

const STATION_NAMES = buildStationNameIndex();

export function getISTParts(date = new Date()) {
    const d = date instanceof Date ? date : new Date(date);
    const ist = new Date(d.getTime() + IST_OFFSET_MS);
    const year = ist.getUTCFullYear();
    const month = ist.getUTCMonth() + 1;
    const day = ist.getUTCDate();
    const weekday = ist.getUTCDay(); // 0=Sun..6=Sat
    const hour = ist.getUTCHours();
    const minute = ist.getUTCMinutes();
    const second = ist.getUTCSeconds();
    const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const secOfDay = hour * 3600 + minute * 60 + second;
    return { year, month, day, weekday, hour, minute, second, ymd, minOfDay: hour * 60 + minute, secOfDay };
}

export function isHolidayDate(ymd, overrides = null) {
    if ((SCHEDULE_DATA.holidays || []).includes(ymd)) return true;
    const extra = overrides?.holidayOverrides;
    return Array.isArray(extra) && extra.includes(ymd);
}

export function getDayType(date = new Date(), overrides = null) {
    const parts = getISTParts(date);
    if (isHolidayDate(parts.ymd, overrides)) return 'sunday';
    if (parts.weekday === 0) return 'sunday';
    if (parts.weekday === 1) return 'monday';
    if (parts.weekday === 6) return 'saturday';
    return 'weekday';
}

function parseHmToSec(hm) {
    const [h, m] = String(hm).split(':').map(Number);
    return (Number.isFinite(h) ? h : 0) * 3600 + (Number.isFinite(m) ? m : 0) * 60;
}

export function formatISTTime(secOfDay) {
    const norm = ((Math.round(secOfDay) % DAY_SEC) + DAY_SEC) % DAY_SEC;
    let h = Math.floor(norm / 3600);
    const m = Math.floor((norm % 3600) / 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatCountdownLabel(secUntil) {
    if (secUntil <= 30) return 'Arriving';
    if (secUntil <= 40) return 'Arriving soon';
    const mins = Math.ceil(secUntil / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
}

export function resolveStationIndex(lineKey, stationId, stationName = '') {
    const meta = SCHEDULE_DATA.lines?.[lineKey];
    if (!meta) return -1;
    let idx = meta.ids.indexOf(stationId);
    if (idx !== -1) return idx;
    if (stationName) {
        const target = stationName.toLowerCase();
        idx = meta.ids.findIndex((id) => (STATION_NAMES[lineKey]?.[id] || '').toLowerCase() === target);
    }
    return idx;
}

function computeOffsetSec(meta, fromIdx, stopIdx, toIdx) {
    if (stopIdx === fromIdx) return 0;
    const rawCum = Math.abs(meta.cumSec[stopIdx] - meta.cumSec[fromIdx]);
    const isTerminal = stopIdx === toIdx;
    if (isTerminal) return rawCum;
    const prevIdx = stopIdx > fromIdx ? stopIdx - 1 : stopIdx + 1;
    const prevSeg = Math.abs(meta.cumSec[stopIdx] - meta.cumSec[prevIdx]);
    const dwell = Math.min(meta.dwellSec || 25, Math.floor(prevSeg * 0.3));
    return { arrOffset: rawCum - dwell, depOffset: rawCum };
}

function expandLineTrips(lineKey, dayType, overrides = null) {
    const overrideKey = overrides?.updatedAt || 'base';
    const cacheKey = `${lineKey}_${dayType}_${overrideKey}`;
    if (expandedCache.has(cacheKey)) return expandedCache.get(cacheKey);

    const meta = SCHEDULE_DATA.lines?.[lineKey];
    const sched = SCHEDULE_DATA.schedules?.[lineKey]?.[dayType] || SCHEDULE_DATA.schedules?.[lineKey]?.weekday;
    if (!meta || !sched) return [];

    const rawTrips = [];
    const seenKeys = new Map(); // `${fromIdx}_${toIdx}` -> sorted sec array for dedup

    const pushTrip = (fromIdx, toIdx, depSec, isShortLoop) => {
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
        const bucketKey = `${fromIdx}_${toIdx}`;
        if (!seenKeys.has(bucketKey)) seenKeys.set(bucketKey, []);
        const list = seenKeys.get(bucketKey);
        for (let i = 0; i < list.length; i++) {
            if (Math.abs(list[i] - depSec) < 35) return;
        }
        list.push(depSec);
        const dir = toIdx > fromIdx ? 1 : -1;
        const totalDurationSec = Math.abs(meta.cumSec[toIdx] - meta.cumSec[fromIdx]);
        rawTrips.push({
            id: `${lineKey}_${dayType}_${fromIdx}_${toIdx}_${Math.round(depSec)}`,
            lineKey,
            dir,
            fromIdx,
            toIdx,
            fromId: meta.ids[fromIdx],
            toId: meta.ids[toIdx],
            terminalName: STATION_NAMES[lineKey]?.[meta.ids[toIdx]] || meta.ids[toIdx],
            depSec,
            endSec: depSec + totalDurationSec,
            isShortLoop,
        });
    };

    for (const fg of sched.frequency || []) {
        const fromIdx = meta.ids.indexOf(fg.from);
        const toIdx = meta.ids.indexOf(fg.toward);
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) continue;
        const isShortLoop = !(
            (fromIdx === 0 && toIdx === meta.ids.length - 1) ||
            (fromIdx === meta.ids.length - 1 && toIdx === 0)
        );
        for (const band of fg.bands || []) {
            const startSec = parseHmToSec(band.s);
            const endSec = parseHmToSec(band.e);
            const headwaySec = Math.round(Number(band.h) * 60);
            if (!headwaySec || headwaySec <= 0) continue;
            for (let t = startSec; t <= endSec + 1; t += headwaySec) {
                pushTrip(fromIdx, toIdx, t, isShortLoop);
            }
        }
    }

    for (const tr of sched.trips || []) {
        const fromIdx = meta.ids.indexOf(tr.from);
        const toIdx = meta.ids.indexOf(tr.to);
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) continue;
        const isShortLoop = !(
            (fromIdx === 0 && toIdx === meta.ids.length - 1) ||
            (fromIdx === meta.ids.length - 1 && toIdx === 0)
        );
        for (const tm of tr.times || []) {
            pushTrip(fromIdx, toIdx, parseHmToSec(tm), isShortLoop);
        }
    }

    // Optional live-overrides extension (extra late night departures)
    const extList = overrides?.extendedHours;
    if (Array.isArray(extList)) {
        for (const ext of extList) {
            if (ext.line !== lineKey || !Array.isArray(ext.times)) continue;
            const fIdx = meta.ids.indexOf(ext.from);
            const tIdx = meta.ids.indexOf(ext.to);
            for (const tm of ext.times) pushTrip(fIdx, tIdx, parseHmToSec(tm), true);
        }
    }

    rawTrips.sort((a, b) => a.depSec - b.depSec);
    if (expandedCache.size >= MAX_EXPANDED_CACHE) {
        const oldestKey = expandedCache.keys().next().value;
        if (oldestKey !== undefined) expandedCache.delete(oldestKey);
    }
    expandedCache.set(cacheKey, rawTrips);
    return rawTrips;
}

function stationServesTrip(trip, stIdx, dirSign, targetIdx) {
    if (trip.dir !== dirSign) return false;
    if (dirSign === 1) {
        if (stIdx < trip.fromIdx || stIdx >= trip.toIdx) return false;
        if (targetIdx !== -1 && targetIdx > trip.toIdx) return false;
        return true;
    }
    if (stIdx > trip.fromIdx || stIdx <= trip.toIdx) return false;
    if (targetIdx !== -1 && targetIdx < trip.toIdx) return false;
    return true;
}

export function getStationCrowd(stationId, date = new Date()) {
    const parts = getISTParts(date);
    const isWeekend = parts.weekday === 0 || parts.weekday === 6;
    const entry = CROWD_HOURLY?.[stationId];
    const arr = entry ? (isWeekend ? entry.we : entry.wd) : null;
    const score = arr ? (arr[parts.hour] ?? 20) : (parts.hour >= 8 && parts.hour <= 20 ? 35 : 10);

    if (score >= 70) return { score, level: 'Peak Crowd', shortLabel: 'Peak', tone: 'rose', hex: '#F43F5E' };
    if (score >= 45) return { score, level: 'Busy', shortLabel: 'Busy', tone: 'amber', hex: '#F59E0B' };
    if (score >= 22) return { score, level: 'Moderate', shortLabel: 'Moderate', tone: 'sky', hex: '#0EA5E9' };
    return { score, level: 'Quiet', shortLabel: 'Quiet', tone: 'emerald', hex: '#10B981' };
}

export function getNextTrainsAtStation({
    lineKey,
    stationId,
    stationName = '',
    directionSign = 1,
    targetStationId = null,
    targetStationName = '',
    date = new Date(),
    limit = 3,
    overrides = null,
}) {
    const meta = SCHEDULE_DATA.lines?.[lineKey];
    const parts = getISTParts(date);
    const isHoliday = isHolidayDate(parts.ymd, overrides);
    const dayType = getDayType(date, overrides);
    const crowd = getStationCrowd(stationId, date);

    if (!meta) {
        return { dayType, isHoliday, serviceStatus: 'UNAVAILABLE', crowd, trains: [] };
    }

    const stIdx = resolveStationIndex(lineKey, stationId, stationName);
    const targetIdx = targetStationId ? resolveStationIndex(lineKey, targetStationId, targetStationName) : -1;

    if (stIdx === -1) {
        return { dayType, isHoliday, serviceStatus: 'UPCOMING_STATION', crowd, trains: [] };
    }

    const collectForDay = (trips, dayOffsetSec) => {
        const out = [];
        for (const tr of trips) {
            if (!stationServesTrip(tr, stIdx, directionSign, targetIdx)) continue;
            const timing = computeOffsetSec(meta, tr.fromIdx, stIdx, tr.toIdx);
            const depOffset = typeof timing === 'number' ? timing : timing.depOffset;
            const arrOffset = typeof timing === 'number' ? timing : timing.arrOffset;
            const absDepSec = tr.depSec + depOffset + dayOffsetSec;
            const absArrSec = tr.depSec + arrOffset + dayOffsetSec;
            out.push({
                tripId: tr.id,
                arrivalSec: absArrSec,
                departureSec: absDepSec,
                terminalId: tr.toId,
                terminalName: tr.terminalName,
                isShortLoop: tr.isShortLoop,
                isTomorrow: dayOffsetSec > 0,
            });
        }
        return out;
    };

    const todayTrips = expandLineTrips(lineKey, dayType, overrides);
    const candidates = [];
    if (parts.secOfDay < 3600) {
        const yestDate = new Date(date.getTime() - DAY_SEC * 1000);
        candidates.push(...collectForDay(expandLineTrips(lineKey, getDayType(yestDate, overrides), overrides), -DAY_SEC));
    }
    const todayMatches = collectForDay(todayTrips, 0).sort((a, b) => a.departureSec - b.departureSec);
    candidates.push(...todayMatches);

    const upcomingToday = candidates.filter((c) => c.departureSec >= parts.secOfDay - 10);

    const tomDate = new Date(date.getTime() + DAY_SEC * 1000);
    const tomDayType = getDayType(tomDate, overrides);
    const tomMatches = collectForDay(expandLineTrips(lineKey, tomDayType, overrides), DAY_SEC).sort((a, b) => a.departureSec - b.departureSec);

    const combined = [...upcomingToday, ...tomMatches].slice(0, limit).map((item) => {
        const secUntil = Math.max(0, Math.round(item.departureSec - parts.secOfDay));
        return {
            ...item,
            secUntil,
            minutesUntil: secUntil <= 40 ? 0 : Math.ceil(secUntil / 60),
            countdownLabel: formatCountdownLabel(secUntil),
            isDue: secUntil <= 40,
            departureFormatted: formatISTTime(item.departureSec),
            departureDate: new Date(date.getTime() + secUntil * 1000),
        };
    });

    const firstToday = todayMatches[0];
    const lastToday = todayMatches[todayMatches.length - 1];
    let serviceStatus = 'RUNNING';
    if (!firstToday || parts.secOfDay < firstToday.departureSec) {
        serviceStatus = 'PRE_SERVICE';
    } else if (lastToday && parts.secOfDay > lastToday.departureSec) {
        serviceStatus = 'POST_SERVICE';
    }

    const isLastTrainSoon = Boolean(lastToday && parts.secOfDay <= lastToday.departureSec && (lastToday.departureSec - parts.secOfDay) <= 1200);

    return {
        lineKey,
        stationId: meta.ids[stIdx],
        dayType,
        isHoliday,
        serviceStatus,
        firstTrainFormatted: firstToday ? formatISTTime(firstToday.departureSec) : '05:00 AM',
        lastTrainFormatted: lastToday ? formatISTTime(lastToday.departureSec) : '11:05 PM',
        isLastTrainSoon,
        crowd,
        trains: combined,
    };
}

/**
 * Returns the first train of tomorrow for the given journey's origin station.
 * Used to populate the NO_SERVICE "first train tomorrow" card in the boarding HUD.
 * @param {object} journey - Current journey object
 * @param {object|null} overrides - Live schedule overrides
 * @returns {object|null} Train object with departureFormatted, platform, secUntil etc.
 */
export function getTomorrowFirstTrain(journey, overrides = null, legIndex = 0) {
    if (!journey || !Array.isArray(journey.parts) || !journey.parts.length) return null;
    const part = journey.parts[legIndex] || journey.parts[0];
    const sts = part.stations || [];
    if (!sts.length) return null;

    const firstSt = sts[0];
    const lastStOfLeg = sts[sts.length - 1];
    const lineKey = firstSt.lineKey || 'purple';
    const meta = SCHEDULE_DATA.lines?.[lineKey];

    const fIdx = resolveStationIndex(lineKey, firstSt.id, firstSt.name);
    const lIdx = resolveStationIndex(lineKey, lastStOfLeg.id, lastStOfLeg.name);
    const directionSign = (fIdx !== -1 && lIdx !== -1 && lIdx < fIdx) ? -1 : 1;

    // Query schedule at IST midnight tomorrow — getNextTrainsAtStation finds the first service
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    // getISTParts uses UTC internally; subtract IST offset so local midnight becomes IST midnight
    const tomorrowIST = new Date(tomorrow.getTime() - (5.5 * 3600 * 1000));

    const stationId = (meta && fIdx === -1) ? meta.ids[0] : firstSt.id;
    const dirSign = (meta && fIdx === -1) ? 1 : directionSign;
    const res = getNextTrainsAtStation({
        lineKey,
        stationId,
        stationName: firstSt.name,
        directionSign: dirSign,
        date: tomorrowIST,
        limit: 1,
        overrides,
    });
    return res?.trains?.[0] || null;
}
export function getJourneyNextDepartures(journey, date = new Date(), overrides = null, legIndex = 0) {
    if (!journey || !Array.isArray(journey.parts) || !journey.parts.length) return null;
    const targetPart = journey.parts[legIndex] || journey.parts[0];
    const sts = targetPart.stations || [];
    if (sts.length < 2) return null;

    const firstSt = sts[0];
    const lastStOfLeg = sts[sts.length - 1];
    const lineKey = firstSt.lineKey || 'purple';
    const meta = SCHEDULE_DATA.lines?.[lineKey];

    const fIdx = resolveStationIndex(lineKey, firstSt.id, firstSt.name);
    const lIdx = resolveStationIndex(lineKey, lastStOfLeg.id, lastStOfLeg.name);
    const directionSign = (fIdx !== -1 && lIdx !== -1 && lIdx < fIdx) ? -1 : 1;

    // Fallback when route includes not-yet-open Pink Line Phase 2 stations (PK07..PK18)
    if (meta && (fIdx === -1 || lIdx === -1)) {
        const res = getNextTrainsAtStation({
            lineKey,
            stationId: meta.ids[0],
            directionSign: 1,
            date,
            limit: 3,
            overrides,
        });
        return { ...res, isPhase2Preview: true };
    }

    return getNextTrainsAtStation({
        lineKey,
        stationId: firstSt.id,
        stationName: firstSt.name,
        directionSign,
        targetStationId: lastStOfLeg.id,
        targetStationName: lastStOfLeg.name,
        date,
        limit: 3,
        overrides,
    });
}

export function getActiveTrainsOnLine(lineKey, date = new Date(), overrides = null) {
    const meta = SCHEDULE_DATA.lines?.[lineKey];
    if (!meta) return [];
    const parts = getISTParts(date);
    const active = [];

    const checkTrips = (trips, dayShiftSec) => {
        const relNow = parts.secOfDay - dayShiftSec;
        for (const tr of trips) {
            if (relNow < tr.depSec || relNow > tr.endSec) continue;
            const elapsed = relNow - tr.depSec;
            const originCum = meta.cumSec[tr.fromIdx];
            let k = tr.fromIdx;
            const step = tr.dir;

            while (k !== tr.toIdx) {
                const nextK = k + step;
                const totalOffsetNext = Math.abs(meta.cumSec[nextK] - originCum);
                const segSec = Math.abs(meta.cumSec[nextK] - meta.cumSec[k]);
                const isLastHop = nextK === tr.toIdx;
                const dwell = isLastHop ? 0 : Math.min(meta.dwellSec || 25, Math.floor(segSec * 0.3));
                const arrOffsetNext = totalOffsetNext - dwell;
                const prevOffset = Math.abs(meta.cumSec[k] - originCum);

                if (elapsed <= arrOffsetNext) {
                    const runDur = Math.max(1, arrOffsetNext - prevOffset);
                    const u = Math.max(0, Math.min(1, (elapsed - prevOffset) / runDur));
                    // Smoothstep easing for realistic station acceleration/braking
                    const eased = u * u * (3 - 2 * u);
                    const stationFloatIdx = k + step * eased;
                    active.push({
                        id: `${tr.id}_${dayShiftSec}`,
                        lineKey,
                        dir: tr.dir,
                        fromId: tr.fromId,
                        toId: tr.toId,
                        fromIdx: tr.fromIdx,
                        toIdx: tr.toIdx,
                        currentIdx: k,
                        nextIdx: nextK,
                        currentId: meta.ids[k],
                        nextId: meta.ids[nextK],
                        currentName: STATION_NAMES[lineKey]?.[meta.ids[k]] || meta.ids[k],
                        nextName: STATION_NAMES[lineKey]?.[meta.ids[nextK]] || meta.ids[nextK],
                        segmentProgress: eased,
                        stationFloatIdx,
                        isDwelling: false,
                        secToNextStation: Math.max(0, Math.round(arrOffsetNext - elapsed)),
                        terminalName: tr.terminalName,
                        isShortLoop: tr.isShortLoop,
                    });
                    break;
                } else if (elapsed <= totalOffsetNext) {
                    // Dwelling at nextK
                    active.push({
                        id: `${tr.id}_${dayShiftSec}`,
                        lineKey,
                        dir: tr.dir,
                        fromId: tr.fromId,
                        toId: tr.toId,
                        fromIdx: tr.fromIdx,
                        toIdx: tr.toIdx,
                        currentIdx: nextK,
                        nextIdx: nextK,
                        currentId: meta.ids[nextK],
                        nextId: meta.ids[nextK],
                        currentName: STATION_NAMES[lineKey]?.[meta.ids[nextK]] || meta.ids[nextK],
                        nextName: STATION_NAMES[lineKey]?.[meta.ids[nextK]] || meta.ids[nextK],
                        segmentProgress: 0,
                        stationFloatIdx: nextK,
                        isDwelling: true,
                        secToNextStation: 0,
                        terminalName: tr.terminalName,
                        isShortLoop: tr.isShortLoop,
                    });
                    break;
                }
                k = nextK;
            }
        }
    };

    const todayTrips = expandLineTrips(lineKey, getDayType(date, overrides), overrides);
    checkTrips(todayTrips, 0);
    if (parts.secOfDay < 3600) {
        const yestDate = new Date(date.getTime() - DAY_SEC * 1000);
        checkTrips(expandLineTrips(lineKey, getDayType(yestDate, overrides), overrides), -DAY_SEC);
    }

    return active;
}

export function getActiveTrainsAllLines(date = new Date(), overrides = null) {
    return {
        purple: getActiveTrainsOnLine('purple', date, overrides),
        green: getActiveTrainsOnLine('green', date, overrides),
        yellow: getActiveTrainsOnLine('yellow', date, overrides),
        pink: getActiveTrainsOnLine('pink', date, overrides),
    };
}

/**
 * Resolve upstream stops before the user's boarding station (for the colorless approach track)
 * plus the incoming train's exact continuous position and plain-English status.
 */
export function getIncomingTrainContext({
    journey,
    legIndex = 0,
    trainCandidate = null,
    date = new Date(),
    overrides = null,
    upstreamDepth = 3,
}) {
    if (!journey?.parts?.length) return null;
    const activePart = journey.parts[legIndex] || journey.parts[0];
    const sts = activePart.stations || [];
    if (sts.length < 2) return null;

    const firstSt = sts[0];
    const lastStOfLeg = sts[sts.length - 1];
    const lineKey = firstSt.lineKey || 'purple';
    const meta = SCHEDULE_DATA.lines?.[lineKey];
    const allLineStations = metroData?.[lineKey]?.stations || [];
    if (!meta || !allLineStations.length) return null;

    const originIdx = resolveStationIndex(lineKey, firstSt.id, firstSt.name);
    const legEndIdx = resolveStationIndex(lineKey, lastStOfLeg.id, lastStOfLeg.name);
    if (originIdx === -1 || legEndIdx === -1) return null;

    const dirSign = legEndIdx < originIdx ? -1 : 1;

    // Step backward from origin along incoming direction so array runs top-to-bottom toward origin
    const rawUpstreamStations = [];
    for (let step = upstreamDepth; step >= 1; step--) {
        const upIdx = originIdx - step * dirSign;
        if (upIdx >= 0 && upIdx < meta.ids.length) {
            const upId = meta.ids[upIdx];
            const stObj = allLineStations.find((s) => s.id === upId) || { id: upId, name: STATION_NAMES[lineKey]?.[upId] || upId };
            const etaBeforeOriginSec = Math.abs(meta.cumSec[originIdx] - meta.cumSec[upIdx]);
            rawUpstreamStations.push({
                id: stObj.id,
                name: stObj.name,
                lineKey,
                lineIdx: upIdx,
                etaBeforeOriginMin: Math.max(1, Math.round(etaBeforeOriginSec / 60)),
            });
        }
    }

    const activeTrains = getActiveTrainsOnLine(lineKey, date, overrides);
    let matchedTrain = null;
    if (trainCandidate?.tripId) {
        matchedTrain = activeTrains.find((tr) => tr.id.startsWith(`${trainCandidate.tripId}_`)) || null;
    }
    if (!matchedTrain) {
        // Fallback: pick closest active train heading toward originIdx that hasn't passed originIdx
        const eligible = activeTrains
            .filter((tr) => {
                if (tr.dir !== dirSign) return false;
                const d = (originIdx - tr.stationFloatIdx) * dirSign;
                return d >= -0.05 && d <= (meta.ids.length - 1);
            })
            .sort((a, b) => Math.abs(originIdx - a.stationFloatIdx) - Math.abs(originIdx - b.stationFloatIdx));
        matchedTrain = eligible[0] || null;
    }

    const pruneResult = computePrunedUpstreamWindow({
        rawUpstream: rawUpstreamStations,
        matchedTrain,
        originIdx,
        dirSign,
    });
    const upstreamStations = pruneResult.visibleUpstream;
    const prunedStationIds = pruneResult.prunedIds;
    const cursorTrackFloat = pruneResult.cursorTrackFloat;

    let trainLocalFloatIdx = -1;
    let statusText = '';
    let prevStationName = '';
    let stopsAway = null;
    let earlierStopsCount = 0;

    if (matchedTrain) {
        const distStops = Math.max(0, (originIdx - matchedTrain.stationFloatIdx) * dirSign);
        stopsAway = Math.max(0, Math.round(distStops));
        prevStationName = matchedTrain.currentName || '';

        if (matchedTrain.isDwelling) {
            statusText = matchedTrain.currentIdx === originIdx
                ? `At ${firstSt.name} platform`
                : `Stopped at ${matchedTrain.currentName}`;
        } else {
            statusText = `Left ${matchedTrain.currentName} â†’ ${matchedTrain.nextName}`;
        }

        if (distStops <= rawUpstreamStations.length + 0.15) {
            trainLocalFloatIdx = cursorTrackFloat;
        } else {
            // Train is further back along the corridor before visible upstream stops
            trainLocalFloatIdx = cursorTrackFloat;
            earlierStopsCount = Math.max(1, Math.ceil(distStops - upstreamStations.length));
        }
    } else if (trainCandidate) {
        statusText = trainCandidate.isTomorrow ? 'First train tomorrow' : `Starts toward ${firstSt.name}`;
        trainLocalFloatIdx = 0.08;
    }

    // Interchange lookahead for multi-line trips
    let interchangeNext = null;
    if (journey.parts.length > 1 && journey.parts[1]?.stations?.length >= 2) {
        const p2 = journey.parts[1];
        const p2First = p2.stations[0];
        const p2Last = p2.stations[p2.stations.length - 1];
        const p2Line = p2First.lineKey || 'purple';
        const p2FIdx = resolveStationIndex(p2Line, p2First.id, p2First.name);
        const p2LIdx = resolveStationIndex(p2Line, p2Last.id, p2Last.name);
        const p2Dir = (p2FIdx !== -1 && p2LIdx !== -1 && p2LIdx < p2FIdx) ? -1 : 1;
        const connRes = getNextTrainsAtStation({
            lineKey: p2Line,
            stationId: p2First.id,
            stationName: p2First.name,
            directionSign: p2Dir,
            targetStationId: p2Last.id,
            targetStationName: p2Last.name,
            date,
            limit: 1,
            overrides,
        });
        if (connRes?.trains?.[0]) {
            interchangeNext = {
                lineKey: p2Line,
                stationName: p2First.name,
                platform: p2.startPlatform || 1,
                countdownLabel: connRes.trains[0].countdownLabel,
                departureFormatted: connRes.trains[0].departureFormatted,
            };
        }
    }

    return {
        lineKey,
        originName: firstSt.name,
        originIdx,
        dirSign,
        upstreamStations,
        prunedStationIds,
        matchedTrain,
        cursorTrackFloat,
        trainLocalFloatIdx,
        statusText,
        prevStationName,
        stopsAway,
        earlierStopsCount,
        interchangeNext,
    };
}


