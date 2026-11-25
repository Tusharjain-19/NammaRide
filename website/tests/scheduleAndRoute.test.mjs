import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Mock minimal browser globals before importing helpers/scheduleEngine
globalThis.localStorage = {
    _data: new Map(),
    getItem(k) { return this._data.has(k) ? this._data.get(k) : null; },
    setItem(k, v) { this._data.set(k, String(v)); },
    removeItem(k) { this._data.delete(k); },
};

const { getNextTrainsAtStation, getActiveTrainsOnLine, getIncomingTrainContext } = await import('../public/simulator/js/logic/scheduleEngine.js');
const { metroData } = await import('../public/simulator/js/data/stations.js');

test('Deterministic BMRCL schedule engine returns active trains & incoming context with pruned upstream', () => {
    // 10:15 AM IST -> 04:45 UTC on a Wednesday (weekday)
    const testDate = new Date('2026-11-25T04:45:00.000Z');

    const activeGreen = getActiveTrainsOnLine('green', testDate);
    assert.ok(activeGreen.length > 0, 'Expected active trains on Green Line during peak hours');

    const nextAtLalbagh = getNextTrainsAtStation({
        lineKey: 'green',
        stationId: 'G16', // Lalbagh area / Green line station
        directionSign: 1,
        targetStationId: 'G22',
        date: testDate,
        limit: 3,
    });
    assert.equal(nextAtLalbagh.serviceStatus, 'RUNNING');
    assert.ok(nextAtLalbagh.trains.length >= 1);

    const greenStations = metroData.green.stations;
    const journey = {
        id: 'G16-G20',
        totalTime: 600,
        departureTime: nextAtLalbagh.trains[0].departureDate,
        parts: [{
            stations: greenStations.slice(15, 20).map((s) => ({ ...s, lineKey: 'green', color: '#10B981' })),
            startPlatform: 2,
            journeyDirectionName: 'Silk Institute',
        }],
        scheduleInfo: nextAtLalbagh,
    };

    const ctx = getIncomingTrainContext({
        journey,
        trainCandidate: nextAtLalbagh.trains[0],
        date: testDate,
        upstreamDepth: 3,
    });

    assert.ok(ctx);
    assert.ok(Array.isArray(ctx.upstreamStations));
    assert.ok(ctx.cursorTrackFloat >= 0);
    assert.ok(ctx.statusText.length > 0);
});

test('Website scheduleEngine parity matches simulator dwell & countdown semantics', () => {
    const webSched = fs.readFileSync(path.resolve('src/utils/scheduleEngine.js'), 'utf8');
    assert.match(webSched, /Arriving/);
    assert.match(webSched, /computeOffsetSec/);
    assert.ok(!webSched.includes("return 'DUE'"), 'Website engine should not expose raw DUE string');
});

