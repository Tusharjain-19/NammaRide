import test from 'node:test';
import assert from 'node:assert/strict';

import {
    computeRefreshIntervalMs,
    computePrunedUpstreamWindow,
    computeOnBoardPassedWindow,
    reconcileActiveTrainCandidate,
} from '../public/simulator/js/logic/trainTrackerEngine.js';
import {
    evaluateThirtySecondAlert,
    ALERT_THRESHOLD_SEC,
} from '../public/simulator/js/logic/notificationEngine.js';
import {
    evaluateGPSSpeedSample,
    getDistanceFromLatLonInKm,
} from '../public/simulator/js/logic/gpsValidator.js';
import { getFareByHops } from '../public/simulator/js/logic/pricing.js';

test('Adaptive refresh engine stays inside 5-10s band', () => {
    assert.equal(computeRefreshIntervalMs({ boardingState: 'ON_BOARD', isHidden: false }), 5000);
    assert.equal(computeRefreshIntervalMs({ boardingState: 'ARRIVAL_CHECK', isHidden: false }), 5000);
    assert.equal(computeRefreshIntervalMs({ boardingState: 'WAITING_AT_PLATFORM', waitSecLeft: 120, isHidden: false }), 5000);
    assert.equal(computeRefreshIntervalMs({ boardingState: 'WAITING_AT_PLATFORM', waitSecLeft: 420, isHidden: false }), 8500);
    assert.equal(computeRefreshIntervalMs({ boardingState: 'ON_BOARD', isHidden: true }), 10000);
});

test('Upstream crossed-station pruning removes stations passed by incoming train cleanly', () => {
    const rawUpstream = [
        { id: 'G11', name: 'Chickpete', lineIdx: 10, etaBeforeOriginMin: 6 },
        { id: 'G12', name: 'KR Market', lineIdx: 11, etaBeforeOriginMin: 4 },
        { id: 'G13', name: 'National College', lineIdx: 12, etaBeforeOriginMin: 2 },
    ];
    const originIdx = 13; // Lalbagh
    const dirSign = 1;

    // 1. Train at Chickpete (10.0) -> all 3 upstream stops visible, cursor sits on first upstream stop
    let res = computePrunedUpstreamWindow({
        rawUpstream,
        matchedTrain: { stationFloatIdx: 10.0 },
        originIdx,
        dirSign,
    });
    assert.deepEqual(res.visibleUpstream.map((u) => u.id), ['G11', 'G12', 'G13']);
    assert.deepEqual(res.prunedIds, []);
    assert.equal(res.cursorTrackFloat, 1);

    // 2. Train crosses Chickpete (10.35 > threshold 0.25) -> Chickpete removed!
    res = computePrunedUpstreamWindow({
        rawUpstream,
        matchedTrain: { stationFloatIdx: 10.35 },
        originIdx,
        dirSign,
    });
    assert.deepEqual(res.visibleUpstream.map((u) => u.id), ['G12', 'G13']);
    assert.deepEqual(res.prunedIds, ['G11']);
    assert.ok(res.cursorTrackFloat > 0 && res.cursorTrackFloat < 1);

    // 3. Train crosses KR Market (11.40) and National College (12.40) -> all 3 removed!
    res = computePrunedUpstreamWindow({
        rawUpstream,
        matchedTrain: { stationFloatIdx: 12.4 },
        originIdx,
        dirSign,
    });
    assert.deepEqual(res.visibleUpstream, []);
    assert.deepEqual(res.prunedIds, ['G11', 'G12', 'G13']);
    assert.ok(res.cursorTrackFloat > 0.1 && res.cursorTrackFloat < 1);

    // 4. Reverse direction (dirSign = -1) pruning works symmetrically
    const revUpstream = [
        { id: 'G16', name: 'Jayanagar', lineIdx: 16, etaBeforeOriginMin: 4 },
        { id: 'G15', name: 'South End Circle', lineIdx: 15, etaBeforeOriginMin: 2 },
    ];
    const revRes = computePrunedUpstreamWindow({
        rawUpstream: revUpstream,
        matchedTrain: { stationFloatIdx: 15.6 }, // Moving toward 14, already passed 16!
        originIdx: 14,
        dirSign: -1,
    });
    assert.deepEqual(revRes.visibleUpstream.map((u) => u.id), ['G15']);
    assert.deepEqual(revRes.prunedIds, ['G16']);
});

test('Reconcile active train rolls forward after departure +35s grace buffer', () => {
    const t0 = 1_795_620_000_000;
    const candidates = [
        { tripId: 'tr1', departureDate: new Date(t0), departureFormatted: '10:00 AM' },
        { tripId: 'tr2', departureDate: new Date(t0 + 480_000), departureFormatted: '10:08 AM' },
    ];

    const stay = reconcileActiveTrainCandidate({
        candidates,
        waitingTrainIndex: 0,
        waitingTargetDate: candidates[0].departureDate,
        nowMs: t0 + 20_000,
    });
    assert.equal(stay.rolledOver, false);
    assert.equal(stay.waitingTrainIndex, 0);

    const roll = reconcileActiveTrainCandidate({
        candidates,
        waitingTrainIndex: 0,
        waitingTargetDate: candidates[0].departureDate,
        nowMs: t0 + 45_000,
    });
    assert.equal(roll.rolledOver, true);
    assert.equal(roll.waitingTrainIndex, 1);
    assert.equal(roll.candidate.tripId, 'tr2');
});

test('On-board passed stops window collapses earlier crossed stations', () => {
    const res = computeOnBoardPassedWindow({
        timelineLength: 6,
        activeTimelineIndex: 2,
        routeFloatIndex: 2.4,
        showPassedManual: false,
    });
    assert.deepEqual(res.hiddenPassedIndices, [0, 1]);
    assert.equal(res.passedCount, 2);
});

test('30-second arrival notification evaluates strictly at <= 30s and deduplicates', () => {
    assert.equal(ALERT_THRESHOLD_SEC, 30);
    const alertedKeys = new Set();

    // Above 30s: no alert
    assert.equal(
        evaluateThirtySecondAlert({
            boardingState: 'WAITING_AT_PLATFORM',
            waitSecLeft: 31,
            originName: 'National College',
            tripKey: 'G_100',
            alertedKeys,
        }),
        null
    );

    // At 30s: triggers BOARDING_30S once
    const first = evaluateThirtySecondAlert({
        boardingState: 'ARRIVAL_CHECK',
        waitSecLeft: 30,
        originName: 'National College',
        platform: 1,
        direction: 'Madavara',
        tripKey: 'G_100',
        alertedKeys,
    });
    assert.ok(first);
    assert.equal(first.kind, 'BOARDING_30S');
    assert.match(first.title, /30s/);
    alertedKeys.add(first.dedupKey);

    // Next second (29s): deduplicated
    assert.equal(
        evaluateThirtySecondAlert({
            boardingState: 'ARRIVAL_CHECK',
            waitSecLeft: 29,
            originName: 'National College',
            tripKey: 'G_100',
            alertedKeys,
        }),
        null
    );

    // Destination 30s alert while ON_BOARD
    const dest = evaluateThirtySecondAlert({
        boardingState: 'ON_BOARD',
        etaToDestSec: 28,
        destName: 'Majestic',
        journeyId: 'G15-G12',
        alertedKeys,
    });
    assert.ok(dest);
    assert.equal(dest.kind, 'DEST_30S');
});

test('GPS speed validator filters indoor Wi-Fi jitter to 0 km/h and reads real velocity', () => {
    const now = 1_795_620_000_000;
    const indoorA = { lat: 12.9500, lon: 77.5738, accuracy: 25, ts: now - 5000 };
    // ~7m drift over 5s with 25m accuracy (< noiseFloor 16.25m) -> 0 km/h
    const stationary = evaluateGPSSpeedSample({
        lat: 12.95006,
        lon: 77.5738,
        accuracy: 25,
        speedMps: null,
        nowMs: now,
        prevFix: indoorA,
    });
    assert.equal(stationary.validatedSpeedKmh, 0);

    // Real GNSS Doppler speed 12.5 m/s = 45 km/h with displacement match
    const moving = evaluateGPSSpeedSample({
        lat: 12.9510,
        lon: 77.5738,
        accuracy: 12,
        speedMps: 12.5,
        nowMs: now,
        prevFix: { lat: 12.9504, lon: 77.5738, accuracy: 12, ts: now - 5300 },
    });
    assert.ok(moving.validatedSpeedKmh >= 40 && moving.validatedSpeedKmh <= 50);
    assert.ok(getDistanceFromLatLonInKm(12.95, 77.57, 12.96, 77.57) > 1.0);
});

test('Fare slabs match official BMRCL FFC table', () => {
    assert.equal(getFareByHops(2), 10);
    assert.equal(getFareByHops(4), 20);
    assert.equal(getFareByHops(11), 60);
    assert.equal(getFareByHops(30), 90);
});

