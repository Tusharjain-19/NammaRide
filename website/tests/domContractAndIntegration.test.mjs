import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Mock browser globals so UI modules import cleanly in Node
if (!globalThis.window) globalThis.window = globalThis;
globalThis.localStorage = {
    _data: new Map(),
    getItem(k) { return this._data.has(k) ? this._data.get(k) : null; },
    setItem(k, v) { this._data.set(k, String(v)); },
    removeItem(k) { this._data.delete(k); },
};

const { renderBoardingHud } = await import('../public/simulator/js/ui/boardingHud.js');
const { notificationController } = await import('../public/simulator/js/logic/notificationEngine.js');
const { getIncomingTrainContext } = await import('../public/simulator/js/logic/scheduleEngine.js');

test('index.html references existing simulator assets & updated cache-busted v2.0.0 assets', () => {
    const html = fs.readFileSync(path.resolve('public/simulator/index.html'), 'utf8');
    const matches = [...html.matchAll(/(href|src)="((?:css|js)\/[^"?]+)\?v=2\.0\.0"/g)];
    assert.ok(matches.length >= 6, 'Expected CSS and main.js versioned links at v2.0.0');
    for (const m of matches) {
        const assetPath = path.resolve('public/simulator', m[2]);
        assert.ok(fs.existsSync(assetPath), `Missing versioned asset on disk: ${assetPath}`);
    }

    const requiredIds = [
        'simulation-status',
        'route-list',
        'floating-live-ride-bar',
        'floating-ride-resume-btn',
        'floating-ride-end-btn',
        'bottom-nav',
        'nav-indicator',
        'board-train-btn',
        'start-station',
        'end-station',
        'station-gates-modal',
        'pass-advisor-modal',
        'ticket-upload-modal',
        'qr-scanner-modal',
        'qr-fullscreen-overlay',
        'toast',
    ];
    for (const id of requiredIds) {
        assert.ok(html.includes(`id="${id}"`), `Missing DOM container #${id} in simulator/index.html`);
    }
});

test('Surgical HUD renderer mounts clean HTML once and patches text on subsequent 1s ticks without teardown', () => {
    const fakeSimStatus = { dataset: {}, innerHTML: '' };
    const simState = {
        boardingState: 'ARRIVAL_CHECK',
        useGPS: true,
        gpsAccuracy: 18,
        speedHudEnabled: true,
        currentSpeedKmh: null,
        candidateTrains: [{ tripId: 't1', departureFormatted: '10:15 AM' }, { tripId: 't2', departureFormatted: '10:25 AM' }],
        waitingTrainIndex: 0,
        waitingTargetDate: new Date(Date.now() + 28000),
    };
    const banner = {
        kind: 'BOARDING_30S',
        title: 'Train arriving in 28s · National College',
        body: 'Step onto Platform 1 towards Madavara.',
    };

    renderBoardingHud({
        simStatus: fakeSimStatus,
        simulationState: simState,
        journey: { parts: [] },
        originName: 'National College',
        destinationName: 'Majestic',
        waitSecLeft: 28,
        remainingMinutes: 6,
        gpsClass: 'green',
        gpsTitle: 'GPS Good',
        isOnline: true,
        bannerAlert: banner,
    });

    assert.equal(fakeSimStatus.dataset.mountedStructKey, 'ARRIVAL_CHECK_0_BOARDING_30S_1');
    assert.match(fakeSimStatus.innerHTML, /30s Alert/);
    assert.match(fakeSimStatus.innerHTML, /id="hud-wait-main"/);
    assert.match(fakeSimStatus.innerHTML, /id="hud-wait-pill"/);

    // Next 1s tick with same structure key must NOT overwrite innerHTML
    const originalMarkup = fakeSimStatus.innerHTML;
    const patchedDom = new Map();
    globalThis.document = {
        getElementById: (id) => {
            if (!patchedDom.has(id)) patchedDom.set(id, { textContent: '', className: '', title: '' });
            return patchedDom.get(id);
        },
    };
    try {
        renderBoardingHud({
            simStatus: fakeSimStatus,
            simulationState: simState,
            journey: { parts: [] },
            originName: 'National College',
            destinationName: 'Majestic',
            waitSecLeft: 27,
            remainingMinutes: 6,
            gpsClass: 'green',
            gpsTitle: 'GPS Good',
            isOnline: true,
            bannerAlert: banner,
        });
        assert.equal(fakeSimStatus.innerHTML, originalMarkup);
        assert.equal(patchedDom.get('hud-wait-pill').textContent, '27s');
    } finally {
        delete globalThis.document;
    }
});

test('AndroidManifest declares POST_NOTIFICATIONS and capacitor.config configures LocalNotifications icon', () => {
    const manifest = fs.readFileSync(path.resolve('../mobile/android/app/src/main/AndroidManifest.xml'), 'utf8');
    assert.match(manifest, /android\.permission\.POST_NOTIFICATIONS/);
    const capCfg = JSON.parse(fs.readFileSync(path.resolve('../mobile/capacitor.config.json'), 'utf8'));
    assert.equal(capCfg.plugins?.LocalNotifications?.smallIcon, 'ic_stat_namma_train');
    assert.equal(capCfg.plugins?.LocalNotifications?.iconColor, '#10B981');
    assert.ok(fs.existsSync(path.resolve('../mobile/android/app/src/main/res/drawable/ic_stat_namma_train.xml')));
});


test('NO_SERVICE boardingHud renders "first train tomorrow" info and exit button', () => {
    const fakeSimStatus = { dataset: {}, innerHTML: '' };
    const simState = {
        boardingState: 'NO_SERVICE',
        useGPS: false,
        gpsAccuracy: null,
        speedHudEnabled: false,
        currentSpeedKmh: null,
        candidateTrains: [],
        waitingTrainIndex: 0,
        waitingTargetDate: null,
    };
    const tomorrowFirst = {
        departureFormatted: '05:05 AM',
        platform: 1,
        secUntil: 21900,
    };

    renderBoardingHud({
        simStatus: fakeSimStatus,
        simulationState: simState,
        journey: { parts: [] },
        originName: 'National College',
        destinationName: 'Majestic',
        waitSecLeft: 0,
        remainingMinutes: 0,
        gpsClass: 'grey',
        gpsTitle: 'GPS Off',
        isOnline: true,
        bannerAlert: null,
        tomorrowFirstTrain: tomorrowFirst,
    });

    assert.match(fakeSimStatus.dataset.mountedStructKey, /NO_SERVICE/);
    assert.match(fakeSimStatus.innerHTML, /Service ended for tonight/);
    assert.match(fakeSimStatus.innerHTML, /First train tomorrow/);
    assert.match(fakeSimStatus.innerHTML, /05:05 AM/);
    assert.match(fakeSimStatus.innerHTML, /exit-journey-btn/);
    assert.match(fakeSimStatus.innerHTML, /National College/);
});

test('sw.js uses nammaride-offline-v2.0.0 and precaches all v2.0.0 simulator modules', () => {
    const sw = fs.readFileSync(path.resolve('public/simulator/sw.js'), 'utf8');
    assert.match(sw, /nammaride-offline-v2\.0\.0/);
    for (const mod of ['boardingHud.js', 'ticketModals.js', 'trainTrackerEngine.js', 'notificationEngine.js', 'gpsValidator.js', 'pricing.js']) {
        assert.ok(sw.includes(mod), `Missing ${mod} in sw.js ASSETS_TO_CACHE`);
    }
});

test('INTERCHANGE_CHECK and INTERCHANGE_WAITING render transfer confirmation and incoming train location', () => {
    const fakeSimStatus = { dataset: {}, innerHTML: '' };
    const simState = {
        boardingState: 'INTERCHANGE_CHECK',
        useGPS: true,
        gpsAccuracy: 20,
        speedHudEnabled: false,
        currentSpeedKmh: null,
        candidateTrains: [{ tripId: 'p1', departureFormatted: '10:52 PM' }],
        waitingTrainIndex: 0,
        waitingTargetDate: new Date(Date.now() + 120000),
    };

    renderBoardingHud({
        simStatus: fakeSimStatus,
        simulationState: simState,
        journey: { parts: [] },
        originName: 'Majestic',
        destinationName: 'Indiranagar',
        waitSecLeft: 120,
        remainingMinutes: 18,
        gpsClass: 'green',
        gpsTitle: 'GPS Good',
        isOnline: true,
        bannerAlert: null,
        interchangeMeta: {
            nextLineName: 'Purple Line',
            nextPlatform: 2,
            previewText: 'Next Purple Line in 2 min (10:52 PM) · P2',
        },
    });
    assert.match(fakeSimStatus.innerHTML, /Reached Majestic · Did you change\?/);
    assert.match(fakeSimStatus.innerHTML, /confirm-interchange-btn/);
    assert.match(fakeSimStatus.innerHTML, /still-prev-train-btn/);

    simState.boardingState = 'INTERCHANGE_WAITING';
    renderBoardingHud({
        simStatus: fakeSimStatus,
        simulationState: simState,
        journey: { parts: [] },
        originName: 'Majestic',
        destinationName: 'Indiranagar',
        waitSecLeft: 115,
        remainingMinutes: 18,
        gpsClass: 'green',
        gpsTitle: 'GPS Good',
        isOnline: true,
        bannerAlert: null,
        interchangeMeta: {
            nextLineName: 'Purple Line',
            nextPlatform: 2,
            incomingStatusText: 'Stopped at Sir M. Visvesvaraya',
        },
    });
    assert.match(fakeSimStatus.innerHTML, /Next Purple Line at Majestic \(P2\)/);
    assert.match(fakeSimStatus.innerHTML, /Stopped at Sir M\. Visvesvaraya/);
    assert.match(fakeSimStatus.innerHTML, /Yes, I boarded/);
    assert.match(fakeSimStatus.innerHTML, /skip-next-train-btn/);
});

test('triggerDestinationArrived fires DEST_ARRIVED once and deduplicates per journey', async () => {
    notificationController.resetAll();
    const fired1 = await notificationController.triggerDestinationArrived({ destName: 'Indiranagar', journeyId: 'j_test_1' });
    const fired2 = await notificationController.triggerDestinationArrived({ destName: 'Indiranagar', journeyId: 'j_test_1' });
    assert.equal(fired1, true);
    assert.equal(fired2, false);
    assert.equal(notificationController.getVisibleBannerAlert()?.kind, 'DEST_ARRIVED');
    notificationController.resetAll();
});

test('getIncomingTrainContext supports legIndex=1 for connecting line at Majestic', () => {
    const journey = {
        parts: [
            {
                stations: [
                    { id: 'G17', name: 'National College', lineKey: 'green' },
                    { id: 'G14', name: 'Nadaprabhu Kempegowda Station, Majestic', lineKey: 'green' },
                ],
            },
            {
                stations: [
                    { id: 'P14', name: 'Nadaprabhu Kempegowda Station, Majestic', lineKey: 'purple' },
                    { id: 'P17', name: 'Cubbon Park', lineKey: 'purple' },
                    { id: 'P21', name: 'Indiranagar', lineKey: 'purple' },
                ],
            },
        ],
    };
    const ctx = getIncomingTrainContext({
        journey,
        legIndex: 1,
        date: new Date('2026-11-25T05:00:00Z'), // 10:30 AM IST
        upstreamDepth: 3,
    });
    assert.ok(ctx, 'Expected incoming context for Leg 2 Purple Line at Majestic');
    assert.equal(ctx.lineKey, 'purple');
    assert.ok(ctx.upstreamStations.length > 0);
});
