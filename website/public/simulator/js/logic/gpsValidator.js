/* @copyright 2026 Tushar Jain — NammaRide (https://www.nammaride.site/) — Personal & Non-Commercial Use Only */
/**
 * NammaRide GNSS Speed Validator & Adaptive Location Tracker
 * Validates live metro speed using GNSS Doppler velocity prioritized with
 * tight-accuracy noise-gated displacement fallback and corridor projection.
 */

import { stationsMeta } from '../data/stationsMeta.js';

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function getRoadRouteDistanceInKm(lat1, lon1, lat2, lon2) {
    const haversineDist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    const latRad = lat1 * (Math.PI / 180);
    const dLatKm = Math.abs(lat2 - lat1) * 111.13;
    const dLonKm = Math.abs(lon2 - lon1) * 111.13 * Math.cos(latRad);
    const manhattanDist = dLatKm + dLonKm;
    const roadRouteDist = Math.max(haversineDist * 1.35, manhattanDist * 1.08);
    return Number(roadRouteDist.toFixed(2));
}

export function projectGPSOntoTimeline(lat, lon, timeline, minIdx = 0) {
    if (!timeline || timeline.length < 2) return null;
    const latRad = 12.9716 * Math.PI / 180;
    const kmPerLat = 110.574;
    const kmPerLon = 111.32 * Math.cos(latRad);

    let bestSegIdx = minIdx;
    let bestT = 0;
    let minPerpKm = Infinity;
    let segCosAlignment = 1;

    const startSearch = Math.max(0, minIdx - 1);
    const endSearch = Math.min(timeline.length - 2, minIdx + 4);

    for (let i = startSearch; i <= endSearch; i++) {
        const a = timeline[i];
        const b = timeline[i + 1];
        if (!a?.lat || !a?.lon || !b?.lat || !b?.lon) continue;

        const ax = a.lon * kmPerLon, ay = a.lat * kmPerLat;
        const bx = b.lon * kmPerLon, by = b.lat * kmPerLat;
        const px = lon * kmPerLon, py = lat * kmPerLat;

        const abx = bx - ax, aby = by - ay;
        const lenSq = abx * abx + aby * aby;
        if (lenSq <= 0) continue;

        const t = Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / lenSq));
        const projX = ax + t * abx;
        const projY = ay + t * aby;
        const perpKm = Math.hypot(px - projX, py - projY);

        if (perpKm < minPerpKm) {
            minPerpKm = perpKm;
            bestSegIdx = i;
            bestT = t;
            const lenAB = Math.sqrt(lenSq);
            segCosAlignment = { ux: abx / lenAB, uy: aby / lenAB, kmPerLat, kmPerLon };
        }
    }

    if (!Number.isFinite(minPerpKm)) return null;
    return { bestSegIdx, bestT, floatIdx: bestSegIdx + bestT, perpKm: minPerpKm, dirVec: segCosAlignment };
}

export function computeEstimatedTrainSpeedKmh(timeline, idx) {
    if (!timeline || idx >= timeline.length - 1) return 0;
    const curr = timeline[idx];
    const next = timeline[idx + 1];
    if (!curr || !next) return 38;
    const segSec = Math.max(45, (next.arrivalTime - curr.departureTime) || 95);
    let distKm = 1.15;
    if (curr.lat && curr.lon && next.lat && next.lon) {
        distKm = Math.max(0.4, getDistanceFromLatLonInKm(curr.lat, curr.lon, next.lat, next.lon));
    }
    return Math.min(72, Math.max(24, Math.round(distKm / (segSec / 3600))));
}

/**
 * Pure speed estimator from GPS coordinates, Doppler reading, accuracy, and prior fix.
 */
export function evaluateGPSSpeedSample({
    lat,
    lon,
    accuracy,
    speedMps,
    nowMs,
    prevFix = null,
    speedSamples = [],
    prevSpeedKmh = null,
    wasEstimated = false,
}) {
    if (!(typeof accuracy === 'number' && Number.isFinite(accuracy) && accuracy <= 65)) {
        return {
            validatedSpeedKmh: null,
            nextFix: prevFix,
            nextSamples: speedSamples,
            highAccuracyPoor: accuracy > 200,
        };
    }

    const dopplerValid = typeof speedMps === 'number' && Number.isFinite(speedMps) && speedMps >= 0 && accuracy <= 55;
    const dopplerKmh = dopplerValid ? (speedMps * 3.6) : null;
    let dispKmh = null;

    if (prevFix && prevFix.accuracy <= 40 && accuracy <= 40) {
        const dtSec = (nowMs - prevFix.ts) / 1000;
        if (dtSec >= 2.2 && dtSec <= 40) {
            const distMeters = getDistanceFromLatLonInKm(prevFix.lat, prevFix.lon, lat, lon) * 1000;
            const noiseFloorMeters = Math.max(15, accuracy * 0.65);
            if (distMeters <= noiseFloorMeters) {
                dispKmh = 0;
            } else {
                const rawDisp = (distMeters / 1000) / (dtSec / 3600);
                if (rawDisp <= 90) dispKmh = rawDisp;
            }
        }
    }

    const nextFix = accuracy <= 45 ? { lat, lon, accuracy, ts: nowMs } : prevFix;

    let candidateKmh = null;
    if (dopplerKmh !== null && dopplerKmh <= 92) {
        candidateKmh = (dispKmh !== null && Math.abs(dopplerKmh - dispKmh) < 25)
            ? (dopplerKmh * 0.7 + dispKmh * 0.3)
            : dopplerKmh;
    } else if (dispKmh !== null) {
        candidateKmh = dispKmh;
    }

    let validatedSpeedKmh = null;
    const nextSamples = [...speedSamples];

    if (candidateKmh !== null) {
        nextSamples.push(candidateKmh);
        if (nextSamples.length > 3) nextSamples.shift();
        const sorted = [...nextSamples].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const smoothed = (prevSpeedKmh !== null && !wasEstimated)
            ? (prevSpeedKmh * 0.45 + median * 0.55)
            : median;
        validatedSpeedKmh = smoothed < 2.5 ? 0 : Math.round(smoothed);
    }

    return {
        validatedSpeedKmh,
        nextFix,
        nextSamples,
        highAccuracyPoor: false,
    };
}

export function clearActiveGPSWatch(simulationState) {
    const wid = simulationState.locationWatcherId;
    if (wid === null || wid === undefined) return;
    simulationState.locationWatcherId = null;

    if (simulationState.usingCapacitorGeo) {
        simulationState.usingCapacitorGeo = false;
        try {
            window.Capacitor?.Plugins?.Geolocation?.clearWatch({ id: String(wid) });
        } catch (e) {}
    } else if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(wid);
    }
}

export function configureAdaptiveGPS(simulationState, callbacks = {}) {
    const hasCapGeo = Boolean(
        typeof window !== 'undefined' &&
        window.Capacitor?.isNativePlatform?.() &&
        window.Capacitor?.Plugins?.Geolocation?.watchPosition
    );
    const hasWebGeo = typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
    if ((!hasCapGeo && !hasWebGeo) || !simulationState.isActive) return;

    const timeline = simulationState.timeline || [];
    const idx = simulationState.currentStationIndex || 0;
    const currentNode = timeline[idx];
    const meta = currentNode ? stationsMeta.find((s) => s.id === currentNode.stationId) : null;
    const isUnderground = meta?.type === 'Underground';
    const weakSignal = simulationState.gpsAccuracy !== null && simulationState.gpsAccuracy > 500;
    const stopsRemaining = Math.max(0, (timeline.length - 1) - idx);
    const wantsLiveSpeed =
        simulationState.speedHudEnabled &&
        simulationState.boardingState === 'ON_BOARD' &&
        (typeof document === 'undefined' || !document.hidden);

    let desiredTier = 'CRUISE';
    if (weakSignal || isUnderground) {
        desiredTier = 'TUNNEL_BACKOFF';
    } else if (wantsLiveSpeed) {
        desiredTier = 'SPEED';
    } else if (stopsRemaining <= 2 || simulationState.boardingState !== 'ON_BOARD') {
        desiredTier = 'APPROACH';
    }

    if (desiredTier === simulationState.gpsMode && simulationState.locationWatcherId !== null) return;

    clearActiveGPSWatch(simulationState);

    const opts = desiredTier === 'SPEED'
        ? { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
        : desiredTier === 'APPROACH'
            ? { enableHighAccuracy: true, timeout: 10000, maximumAge: 2500 }
            : desiredTier === 'TUNNEL_BACKOFF'
                ? { enableHighAccuracy: false, timeout: 15000, maximumAge: 45000 }
                : { enableHighAccuracy: false, timeout: 12000, maximumAge: 20000 };

    simulationState.gpsMode = desiredTier;

    const handlePos = (position) => {
        if (!simulationState.isActive) return;
        processGPSUpdate(position, simulationState, callbacks);
    };
    const handleErr = () => {
        simulationState.useGPS = false;
        callbacks.onStatusUpdate?.();
    };

    if (hasCapGeo) {
        simulationState.usingCapacitorGeo = true;
        Promise.resolve(
            window.Capacitor.Plugins.Geolocation.watchPosition(opts, (position, err) => {
                if (err || !position?.coords) {
                    handleErr();
                    return;
                }
                handlePos(position);
            })
        ).then((id) => {
            if (!simulationState.isActive) {
                try { window.Capacitor.Plugins.Geolocation.clearWatch({ id: String(id) }); } catch (e) {}
                return;
            }
            simulationState.locationWatcherId = id;
        }).catch(() => {
            simulationState.usingCapacitorGeo = false;
        });
    } else if (hasWebGeo) {
        simulationState.usingCapacitorGeo = false;
        simulationState.locationWatcherId = navigator.geolocation.watchPosition(handlePos, handleErr, opts);
    }
}

export function processGPSUpdate(position, simulationState, callbacks = {}) {
    if (!simulationState.isActive || !position?.coords) return;

    const { latitude: lat, longitude: lon, accuracy, speed: speedMps } = position.coords;
    const nowMs = Date.now();

    simulationState.useGPS = true;
    simulationState.gpsAccuracy = accuracy;

    const timeline = simulationState.timeline || [];
    const projection = projectGPSOntoTimeline(lat, lon, timeline, simulationState.currentStationIndex || 0);
    const nearCorridor = projection ? projection.perpKm <= 0.45 : true;

    const speedEval = evaluateGPSSpeedSample({
        lat,
        lon,
        accuracy,
        speedMps,
        nowMs,
        prevFix: simulationState.lastGpsFix,
        speedSamples: simulationState.speedSamples || [],
        prevSpeedKmh: simulationState.currentSpeedKmh,
        wasEstimated: simulationState.isSpeedEstimated,
    });

    simulationState.lastGpsFix = speedEval.nextFix;
    simulationState.speedSamples = speedEval.nextSamples;

    if (speedEval.highAccuracyPoor) {
        simulationState.fastPingStreak = 0;
    } else if (speedEval.validatedSpeedKmh !== null) {
        if (speedEval.validatedSpeedKmh >= 18) {
            simulationState.wasMovingFast = true;
            simulationState.fastPingStreak += 1;
        } else {
            simulationState.fastPingStreak = 0;
        }
    }

    if (simulationState.speedHudEnabled && simulationState.boardingState === 'ON_BOARD' && speedEval.validatedSpeedKmh !== null) {
        simulationState.currentSpeedKmh = speedEval.validatedSpeedKmh;
        simulationState.isSpeedEstimated = false;
        simulationState.speedSource = speedEval.validatedSpeedKmh === 0
            ? `Stationary · GPS ±${Math.round(accuracy)}m`
            : `Live GPS · ±${Math.round(accuracy)}m`;
    }

    // Verified auto-boarding when leaving origin or sustaining rail velocity near corridor
    if (simulationState.boardingState === 'WAITING_AT_PLATFORM' || simulationState.boardingState === 'ARRIVAL_CHECK') {
        const originMeta = stationsMeta.find((s) => s.id === timeline[0]?.stationId);
        const originLoc = originMeta?.location || originMeta;
        const distOriginKm = (originLoc?.lat && originLoc?.lon)
            ? getDistanceFromLatLonInKm(lat, lon, originLoc.lat, originLoc.lon)
            : 999;

        if (accuracy <= 120 && distOriginKm <= 0.25) {
            simulationState.wasNearOrigin = true;
        }

        const verifiedLeftStation = simulationState.wasNearOrigin && distOriginKm >= 0.42 && accuracy <= 110;
        const verifiedRailVelocity = simulationState.fastPingStreak >= 2 && nearCorridor && accuracy <= 85;

        if (verifiedLeftStation || verifiedRailVelocity) {
            callbacks.onAutoBoarded?.();
        }
    }

    if (simulationState.boardingState === 'ON_BOARD' && projection && nearCorridor && accuracy <= 180) {
        if (simulationState.gpsRouteFloatIdx === null || projection.floatIdx >= simulationState.gpsRouteFloatIdx - 0.15) {
            simulationState.gpsRouteFloatIdx = projection.floatIdx;
        }
        const snappedIdx = Math.floor(projection.floatIdx + 0.12);
        if (snappedIdx > simulationState.currentStationIndex) {
            simulationState.currentStationIndex = snappedIdx;
        }
    } else if (simulationState.boardingState === 'ON_BOARD') {
        let closestIndex = simulationState.currentStationIndex;
        let minDistance = Infinity;
        for (let i = simulationState.currentStationIndex; i < timeline.length; i++) {
            const station = stationsMeta.find((s) => s.id === timeline[i].stationId);
            const loc = station?.location || station;
            if (loc?.lat && loc?.lon) {
                const dist = getDistanceFromLatLonInKm(lat, lon, loc.lat, loc.lon);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestIndex = i;
                }
            }
        }
        if (closestIndex > simulationState.currentStationIndex && minDistance <= 0.5) {
            simulationState.currentStationIndex = closestIndex;
        }
    }

    const destIndex = timeline.length - 1;
    const destNode = timeline[destIndex];
    const destStation = destNode ? stationsMeta.find((s) => s.id === destNode.stationId) : null;
    const activeIdx = simulationState.currentStationIndex;

    if (destIndex - activeIdx <= 2 && activeIdx < destIndex && simulationState.boardingState === 'ON_BOARD') {
        const isUnderground = destStation && destStation.type === 'Underground';
        callbacks.onNearDestination?.(destNode.stationName, isUnderground);
    }

    if (destStation && simulationState.boardingState === 'ON_BOARD') {
        const loc = destStation.location || destStation;
        if (loc?.lat && loc?.lon) {
            const destDist = getDistanceFromLatLonInKm(lat, lon, loc.lat, loc.lon);
            if (destDist <= 0.38 && accuracy <= 120) {
                simulationState.currentStationIndex = destIndex;
                simulationState.gpsRouteFloatIdx = destIndex;
            }
        }
    }

    configureAdaptiveGPS(simulationState, callbacks);
    callbacks.onStatusUpdate?.();
}

