import { T, T_STATION, formatTime } from '../utils/helpers.js';
import { stationPlaces } from '../data/stationPlaces.js';
import { getIncomingTrainContext } from '../logic/scheduleEngine.js';
import { computeOnBoardPassedWindow } from '../logic/trainTrackerEngine.js';

let cachedUpstreamSummaryY = null;
let cachedUpstreamEls = [];
let cachedRouteEls = [];
let cachedUpstreamCentersY = [];
let cachedRouteCentersY = [];
let cachedTrackCenterX = null;
let cachedLastActiveIdx = -1;
let cachedRouteListEl = null;
let cachedResizeObserver = null;
const pruningInFlight = new Set();

function computeDotCenters(routeListElement) {
    if (!routeListElement) return;
    const summaryEl = document.getElementById('upstream-summary-bar');
    cachedUpstreamSummaryY = summaryEl ? (summaryEl.offsetTop + 26) : null;
    cachedUpstreamCentersY = cachedUpstreamEls
        .filter((el) => el.isConnected && !el.classList.contains('station-pruning'))
        .map((el) => el.offsetTop + 9);
    cachedRouteCentersY = cachedRouteEls.map((item) => {
        const el = item.el;
        return (el && el.offsetParent !== null) ? (el.offsetTop + 8) : null;
    });
    // Measure exact horizontal center of the track dot relative to routeListElement
    const sampleDot = routeListElement.querySelector('.station-item:not(.onboard-passed-collapsed) .station-dot');
    if (sampleDot && typeof routeListElement.getBoundingClientRect === 'function') {
        const listRect = routeListElement.getBoundingClientRect();
        const dotRect = sampleDot.getBoundingClientRect();
        if (listRect.width > 0 && dotRect.width > 0) {
            cachedTrackCenterX = (dotRect.left + dotRect.width / 2) - listRect.left;
        }
    }
}

function pruneCrossedUpstreamDom(routeListElement, visibleUpstreamIds, simulationState, journey, overrides) {
    if (!routeListElement || !cachedUpstreamEls.length) return false;
    const visibleSet = new Set(visibleUpstreamIds || []);
    let startedAny = false;

    for (const el of cachedUpstreamEls) {
        const stId = el.getAttribute('data-station-id');
        if (!stId || visibleSet.has(stId) || pruningInFlight.has(stId)) continue;
        pruningInFlight.add(stId);
        startedAny = true;

        // Lock current height cleanly before animating collapse
        el.style.maxHeight = `${Math.max(48, el.offsetHeight)}px`;
        void el.offsetHeight;
        el.classList.add('station-pruning');

        const finalizeRemove = () => {
            if (!el.isConnected) return;
            const prevTop = el.offsetTop;
            const removedH = el.offsetHeight;
            el.remove();
            pruningInFlight.delete(stId);
            cachedUpstreamEls = cachedUpstreamEls.filter((node) => node.isConnected && node !== el);

            // Preserve scroll position smoothly if crossed node sat above viewport fold
            const mapView = document.getElementById('map-view');
            if (mapView && removedH > 0 && mapView.scrollTop > prevTop) {
                mapView.scrollTop = Math.max(0, mapView.scrollTop - removedH);
            }

            computeDotCenters(routeListElement);
            updateRouteVisuals(simulationState, journey, overrides);
        };

        el.addEventListener('transitionend', finalizeRemove, { once: true });
        setTimeout(finalizeRemove, 350);
    }

    if (startedAny) {
        computeDotCenters(routeListElement);
    }
    return startedAny;
}

export function renderLiveRoute(journey, routeListElement, simulationState, overrides = null) {
    if (!routeListElement || !journey) return;
    pruningInFlight.clear();
    cachedRouteListEl = routeListElement;
    let routeHtml = '';
    let overallStationIndex = 0;
    const totalMinutes = Math.ceil(journey.totalTime / 60);
    const finalArrivalTime = new Date(journey.departureTime.getTime() + totalMinutes * 60000);

    // ─── Zone A: Extrapolated Grey/Colorless Corridor ABOVE Boarding Station ───
    const activeLegIndex = simulationState?.activeLegIndex || 0;
    const activeCand = simulationState?.candidateTrains?.[simulationState?.waitingTrainIndex || 0] || journey?.scheduleInfo?.trains?.[0] || null;
    const approachCtx = getIncomingTrainContext({
        journey,
        legIndex: activeLegIndex,
        trainCandidate: activeCand,
        date: new Date(),
        overrides,
        upstreamDepth: 3,
    });

    const activeLegPart = journey.parts?.[activeLegIndex] || journey.parts?.[0];
    const firstLegLineColor = activeLegPart?.stations?.[0]?.color || '#10B981';
    const originLabel = approachCtx ? T_STATION(approachCtx.originName) : (T_STATION(activeLegPart?.stations?.[0]?.name) || 'Origin');
    const isPreBoard =
        simulationState?.boardingState === 'WAITING_AT_PLATFORM' ||
        simulationState?.boardingState === 'ARRIVAL_CHECK' ||
        simulationState?.boardingState === 'INTERCHANGE_WAITING' ||
        simulationState?.boardingState === 'INTERCHANGE_ARRIVAL';

    routeHtml += `
        <li id="upstream-summary-bar" class="upstream-summary-node">
            <div class="p-2.5 px-3 rounded-2xl bg-card-subtle/90 border border-subtle shadow-xs space-y-1">
                <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-secondary min-w-0">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        <span id="upstream-card-badge">${isPreBoard ? 'Approaching' : 'On Board'}</span>
                        <span id="upstream-sync-pill" class="text-[9px] font-bold text-secondary/80 lowercase tracking-normal">· live 5s</span>
                    </span>
                    ${approachCtx?.upstreamStations?.length ? `
                    <button id="toggle-upstream-btn" type="button" class="text-[10px] font-extrabold text-emerald-500 hover:underline px-2 py-0.5 rounded-lg bg-card border border-subtle cursor-pointer shrink-0">
                        ${isPreBoard || simulationState?.showUpstreamManual ? 'Hide stops' : 'Show stops'}
                    </button>` : ''}
                </div>
                <div id="upstream-train-loc-title" class="text-xs font-extrabold text-primary leading-snug truncate">
                    ${approachCtx?.statusText || `At ${originLabel}`}
                </div>
                <div id="upstream-train-loc-sub" class="text-[10.5px] font-semibold text-secondary tabular-nums leading-snug truncate">
                    ${isPreBoard ? `To ${originLabel}` : 'Trip active'}
                </div>
            </div>
        </li>
    `;

    if (approachCtx && approachCtx.upstreamStations.length > 0) {
        approachCtx.upstreamStations.forEach((up, idx) => {
            routeHtml += `
                <li data-upstream-idx="${idx}" data-station-id="${up.id}" data-line-idx="${up.lineIdx}" class="station-item upstream-approach">
                    <div class="station-dot"></div>
                    <div class="station-content">
                        <div class="flex items-center justify-between gap-2 w-full">
                            <div class="station-name truncate">${T_STATION(up.name)}</div>
                            <span class="text-[10px] font-semibold text-secondary shrink-0 tabular-nums">-${up.etaBeforeOriginMin} min</span>
                        </div>
                    </div>
                </li>
            `;
        });
    }

    // Compact On-Board passed stations toggle pill (hidden until >= 2 stops crossed)
    routeHtml += `
        <li id="onboard-passed-pill-row" class="passed-stops-pill hidden">
            <button id="toggle-passed-btn" type="button" class="w-full py-1.5 px-3 rounded-xl bg-card-subtle border border-subtle text-[11px] font-bold text-secondary hover:text-primary flex items-center justify-between cursor-pointer transition-colors">
                <span id="onboard-passed-label">Earlier stops crossed</span>
                <span id="onboard-passed-action" class="text-emerald-500 font-extrabold">Show</span>
            </button>
        </li>
    `;

    // ─── Zone B: User's Planned Metro Route (Full Bright Line Color) ───
    const flatList = [];
    journey.parts.forEach((part) => {
        part.stations.forEach((s) => {
            const prev = flatList.length > 0 ? flatList[flatList.length - 1].station : null;
            const isDuplicate = prev && (
                prev.id === s.id ||
                (prev.interchangeId && s.interchangeId && prev.interchangeId === s.interchangeId)
            );

            if (isDuplicate) {
                const prevNode = flatList[flatList.length - 1];
                prevNode.isInterchange = true;
                prevNode.outgoingLine = part.stations[0].lineKey;
                prevNode.nextPartDetails = part;
            } else {
                flatList.push({
                    station: s,
                    part: part,
                    lineColor: part.stations[0].color,
                    isInterchange: false,
                    index: overallStationIndex++,
                    isStart: flatList.length === 0,
                    isEnd: false,
                });
            }
        });
    });

    if (flatList.length > 0) flatList[flatList.length - 1].isEnd = true;

    flatList.forEach((node, i) => {
        const nextNode = flatList[i + 1];
        const isPurple = (c) => c === '#9B59B6' || c === '#8B5CF6' || c === '#A855F7' || c === '#9333EA' || (typeof c === 'string' && c.toLowerCase().includes('purple'));
        const isGreen = (c) => c === '#2ECC71' || c === '#22C55E' || c === '#10B981' || c === '#059669' || (typeof c === 'string' && c.toLowerCase().includes('green'));
        const isYellow = (c) => c === '#FBBF24' || c === '#F1C40F' || c === '#EAB308' || c === '#F59E0B' || (typeof c === 'string' && c.toLowerCase().includes('yellow'));
        const isPink = (c) => c === '#EC4899' || c === '#E91E63' || c === '#F43F5E' || (typeof c === 'string' && c.toLowerCase().includes('pink'));

        const segmentColor = (node.isInterchange && nextNode) ? nextNode.lineColor : (node.lineColor || (nextNode ? nextNode.lineColor : ''));

        let colorClass = 'line-default';
        if (isPurple(segmentColor)) colorClass = 'line-purple';
        else if (isGreen(segmentColor)) colorClass = 'line-green';
        else if (isYellow(segmentColor)) colorClass = 'line-yellow';
        else if (isPink(segmentColor)) colorClass = 'line-pink';

        let interchangeClass = '';
        if (node.isInterchange && nextNode) {
            const currentLine = node.lineColor;
            const nextLine = nextNode.lineColor;

            if (isPurple(currentLine) && isGreen(nextLine)) interchangeClass = 'interchange-purple-green';
            else if (isGreen(currentLine) && isPurple(nextLine)) interchangeClass = 'interchange-green-purple';
            else if (isGreen(currentLine) && isYellow(nextLine)) interchangeClass = 'interchange-green-yellow';
            else if (isYellow(currentLine) && isGreen(nextLine)) interchangeClass = 'interchange-yellow-green';
            else if (isPurple(currentLine) && isYellow(nextLine)) interchangeClass = 'interchange-purple-yellow';
            else if (isYellow(currentLine) && isPurple(nextLine)) interchangeClass = 'interchange-yellow-purple';
            else if (isYellow(currentLine) && isPink(nextLine)) interchangeClass = 'interchange-yellow-pink';
            else if (isPink(currentLine) && isYellow(nextLine)) interchangeClass = 'interchange-pink-yellow';
            else if (isGreen(currentLine) && isPink(nextLine)) interchangeClass = 'interchange-green-pink';
            else if (isPink(currentLine) && isGreen(nextLine)) interchangeClass = 'interchange-pink-green';
            else if (isPurple(currentLine) && isPink(nextLine)) interchangeClass = 'interchange-purple-pink';
            else if (isPink(currentLine) && isPurple(nextLine)) interchangeClass = 'interchange-pink-purple';
        }

        routeHtml += renderStationItem(node, {
            isStart: node.isStart,
            isEnd: node.isEnd,
            isInterchange: node.isInterchange,
            interchangeClass: interchangeClass,
            departureTime: journey.departureTime,
            arrivalTime: finalArrivalTime,
            liClass: colorClass,
            nextPartDetails: node.nextPartDetails,
            interchangeNext: node.isInterchange ? approachCtx?.interchangeNext : null,
            index: node.index,
        });
    });

    routeHtml += `
        <div id="timeline-train-cursor" class="timeline-train-cursor hidden" aria-hidden="true">
            <div class="timeline-train-sprite-wrap">
                <span id="timeline-train-aura" class="timeline-train-aura" style="background:${firstLegLineColor};"></span>
                <img src="assets/images/metro_train_marker.png" alt="Metro Train" class="timeline-train-sprite" />
            </div>
        </div>
    `;

    routeListElement.innerHTML = routeHtml;

    cachedUpstreamEls = Array.from(routeListElement.querySelectorAll('.station-item.upstream-approach'));
    cachedRouteEls = Array.from(routeListElement.querySelectorAll('.station-item:not(.upstream-approach)')).map((el) => ({
        id: el.getAttribute('data-station-id'),
        el,
    }));
    cachedLastActiveIdx = -1;

    const shouldHideUpstream = !isPreBoard && !simulationState?.showUpstreamManual;
    routeListElement.classList.toggle('upstream-approach-hidden', shouldHideUpstream);

    const toggleBtn = document.getElementById('toggle-upstream-btn');
    if (toggleBtn && !toggleBtn.dataset.bound) {
        toggleBtn.dataset.bound = 'true';
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!simulationState) return;
            simulationState.showUpstreamManual = routeListElement.classList.contains('upstream-approach-hidden');
            routeListElement.classList.toggle('upstream-approach-hidden', !simulationState.showUpstreamManual);
            toggleBtn.textContent = simulationState.showUpstreamManual ? 'Hide stops' : 'Show stops';
            computeDotCenters(routeListElement);
            updateRouteVisuals(simulationState, journey, overrides);
        });
    }

    const passedBtn = document.getElementById('toggle-passed-btn');
    if (passedBtn && !passedBtn.dataset.bound) {
        passedBtn.dataset.bound = 'true';
        passedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!simulationState) return;
            simulationState.showPassedManual = !simulationState.showPassedManual;
            updateRouteVisuals(simulationState, journey, overrides);
        });
    }

    computeDotCenters(routeListElement);
    if (typeof ResizeObserver !== 'undefined') {
        if (cachedResizeObserver) cachedResizeObserver.disconnect();
        cachedResizeObserver = new ResizeObserver(() => computeDotCenters(routeListElement));
        cachedResizeObserver.observe(routeListElement);
    }

    try {
        const ticketData = sessionStorage.getItem('activeJourneyTicketImage') || localStorage.getItem('nammaride_active_ticket');
        const qrPillDot = document.getElementById('qr-pill-dot');
        const floatingQrBtn = document.getElementById('floating-qr-btn');
        if (qrPillDot && floatingQrBtn) {
            if (ticketData) {
                qrPillDot.classList.remove('hidden');
                floatingQrBtn.classList.add('has-ticket');
            } else {
                qrPillDot.classList.add('hidden');
                floatingQrBtn.classList.remove('has-ticket');
            }
        }
    } catch (e) {}

    createIcons();
}

function renderStationItem(node, details) {
    const { isStart, isEnd, isInterchange, liClass, nextPartDetails, interchangeNext } = details;
    const station = node.station;
    const name = T_STATION(station.name);

    const places = stationPlaces[station.name] || [];
    let nearbyBadge = '';
    if (isEnd && places.length > 0) {
        nearbyBadge = `
            <button type="button" class="nearby-explore-trigger flex items-center gap-1 font-bold" onclick="window.showNearbyAttractions('${station.name.replace(/'/g, "\\'")}')" title="Explore ${places.length} nearby places">
                <svg class="w-3.5 h-3.5 nearby-sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
                </svg>
                <span class="nearby-text text-xs">${places.length} nearby</span>
            </button>
        `;
    }

    let metaInfo = '';
    if (isStart) {
        const platform = node.part.startPlatform || 1;
        const direction = node.part.journeyDirectionName || '';
        metaInfo = `
            <div class="info-strip text-secondary bg-card-subtle">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="platform-pill">${T('platform')} ${platform}</span>
                    <div class="direction-container">
                        <span class="direction-towards">${T('towards')}</span>
                        <span class="direction-dest">${direction}</span>
                    </div>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30">
                        <i data-lucide="shield-check" class="w-3 h-3"></i>
                        <span>Coach 1: Women Reserved</span>
                    </span>
                </div>
            </div>`;
    } else if (isInterchange && nextPartDetails) {
        const firstStation = nextPartDetails.stations?.[0];
        const lineName = firstStation ? T_STATION(firstStation.lineName) : T('interchange');
        const direction = nextPartDetails.journeyDirectionName || (firstStation ? T_STATION(firstStation.name) : '');
        const platform = nextPartDetails.startPlatform || 1;
        const nextConnNote = interchangeNext
            ? `<div id="interchange-live-status" class="mt-1.5 text-[11px] font-bold text-emerald-500">Connecting train in ${interchangeNext.countdownLabel} (${interchangeNext.departureFormatted})</div>`
            : `<div id="interchange-live-status" class="mt-1.5 text-[11px] font-bold text-emerald-500 hidden"></div>`;

        metaInfo = `
            <div class="interchange-info">
                <div class="interchange-header">
                    <div class="interchange-row text-primary font-bold">
                         <i data-lucide="arrow-right-left"></i>
                         <span>${T('changeTo')} ${lineName}</span>
                    </div>
                    <div class="interchange-walk-badge">
                        <i data-lucide="footprints"></i>
                        <span>~5 ${T('walkTime')}</span>
                    </div>
                </div>
                <div class="interchange-nav-row">
                    <span class="platform-pill">
                        <span class="platform-label">${T('platform')}</span>
                        <span class="platform-num">${platform}</span>
                    </span>
                    <div class="direction-container">
                        <span class="direction-towards">${T('towards')}</span>
                        <span class="direction-dest">${direction}</span>
                    </div>
                </div>
                ${nextConnNote}
            </div>`;
    } else if (isEnd) {
        metaInfo = `
            <div class="station-meta text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center justify-between gap-2 mt-2 w-full font-bold text-xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"></i>
                    <span>${T('arrive') || 'Arriving at'} ${formatTime(details.arrivalTime)} • ${T('destination') || 'Your Destination'}</span>
                </div>
                ${nearbyBadge}
            </div>
        `;
    }

    return `
        <li id="station-li-${details.index ?? ''}" data-station-id="${station.id}" class="station-item ${liClass} ${isInterchange ? 'interchange' : ''} ${details.interchangeClass || ''}">
            <div class="station-dot"></div>
            <div class="station-content">
                <div class="flex items-center justify-between gap-2 w-full">
                    <div class="station-name">${name}</div>
                    ${nearbyBadge}
                </div>
                ${metaInfo}
            </div>
        </li>
    `;
}

function createIcons() {
    if (window.lucide) window.lucide.createIcons();
}

export function updateRouteVisuals(simulationState, journey = null, overrides = null) {
    if (!simulationState.isActive || !simulationState.timeline) return;

    const timeline = simulationState.timeline;
    const bState = simulationState.boardingState;
    const isInitialPreBoard = bState === 'WAITING_AT_PLATFORM' || bState === 'ARRIVAL_CHECK';
    const isInterchangeHold = bState === 'INTERCHANGE_CHECK' || bState === 'INTERCHANGE_WAITING' || bState === 'INTERCHANGE_ARRIVAL';
    const isPreBoard = isInitialPreBoard || bState === 'INTERCHANGE_WAITING' || bState === 'INTERCHANGE_ARRIVAL';
    let activeTimelineIndex = 0;
    let routeFloatIndex = 0;

    if (isInitialPreBoard) {
        activeTimelineIndex = 0;
        simulationState.currentStationIndex = 0;
        routeFloatIndex = 0;
    } else if (isInterchangeHold && Number.isInteger(simulationState.interchangeTimelineIndex)) {
        activeTimelineIndex = simulationState.interchangeTimelineIndex;
        simulationState.currentStationIndex = activeTimelineIndex;
        routeFloatIndex = activeTimelineIndex;
    } else if (simulationState.useGPS && simulationState.gpsRouteFloatIdx !== null && simulationState.gpsRouteFloatIdx !== undefined) {
        routeFloatIndex = Math.max(0, Math.min(timeline.length - 1, simulationState.gpsRouteFloatIdx));
        activeTimelineIndex = Math.max(simulationState.currentStationIndex || 0, Math.floor(routeFloatIndex + 0.1));
        simulationState.currentStationIndex = activeTimelineIndex;
    } else if (simulationState.useGPS && simulationState.currentStationIndex !== undefined && simulationState.currentStationIndex >= 0) {
        activeTimelineIndex = simulationState.currentStationIndex;
        routeFloatIndex = activeTimelineIndex;
    } else {
        const elapsedTime = (Date.now() - simulationState.startTime) / 1000;
        for (let i = 0; i < timeline.length; i++) {
            if (elapsedTime >= timeline[i].arrivalTime) {
                activeTimelineIndex = i;
            } else {
                break;
            }
        }
        simulationState.currentStationIndex = activeTimelineIndex;
        const curr = timeline[activeTimelineIndex];
        const next = timeline[activeTimelineIndex + 1];
        if (next && curr && elapsedTime > curr.departureTime) {
            const segDur = Math.max(1, next.arrivalTime - curr.departureTime);
            const prog = Math.max(0, Math.min(1, (elapsedTime - curr.departureTime) / segDur));
            routeFloatIndex = activeTimelineIndex + prog;
        } else {
            routeFloatIndex = activeTimelineIndex;
        }
    }

    if (cachedRouteListEl) {
        const shouldHideUpstream = !isPreBoard && !simulationState.showUpstreamManual;
        const wasHidden = cachedRouteListEl.classList.contains('upstream-approach-hidden');
        if (wasHidden !== shouldHideUpstream) {
            cachedRouteListEl.classList.toggle('upstream-approach-hidden', shouldHideUpstream);
            const btn = document.getElementById('toggle-upstream-btn');
            if (btn) btn.textContent = shouldHideUpstream ? 'Show stops' : 'Hide stops';
            computeDotCenters(cachedRouteListEl);
        }
    }

    if (activeTimelineIndex !== cachedLastActiveIdx) {
        cachedLastActiveIdx = activeTimelineIndex;
        const currentStationId = timeline[activeTimelineIndex]?.stationId;
        let foundCurrent = false;
        for (let i = 0; i < cachedRouteEls.length; i++) {
            const { id, el } = cachedRouteEls[i];
            if (id === currentStationId && !foundCurrent) {
                el.classList.add('current');
                el.classList.remove('completed');
                foundCurrent = true;
            } else if (foundCurrent) {
                el.classList.remove('current', 'completed');
            } else {
                el.classList.add('completed');
                el.classList.remove('current');
            }
        }
    }

    // Collapse crossed ON_BOARD stations behind active stop to keep viewport crisp
    const passedRowEl = document.getElementById('onboard-passed-pill-row');
    const passedLblEl = document.getElementById('onboard-passed-label');
    const passedActEl = document.getElementById('onboard-passed-action');
    if (!isPreBoard && cachedRouteEls.length > 2) {
        const passedEval = computeOnBoardPassedWindow({
            timelineLength: cachedRouteEls.length,
            activeTimelineIndex,
            routeFloatIndex,
            showPassedManual: Boolean(simulationState.showPassedManual),
        });
        const hiddenSet = new Set(passedEval.hiddenPassedIndices);
        let collapsedChanged = false;
        for (let i = 0; i < cachedRouteEls.length; i++) {
            const shouldCollapse = hiddenSet.has(i);
            const el = cachedRouteEls[i].el;
            if (el.classList.contains('onboard-passed-collapsed') !== shouldCollapse) {
                el.classList.toggle('onboard-passed-collapsed', shouldCollapse);
                collapsedChanged = true;
            }
        }
        if (passedRowEl) {
            passedRowEl.classList.toggle('hidden', passedEval.passedCount === 0);
            if (passedLblEl) {
                passedLblEl.textContent = `${passedEval.passedCount} ${passedEval.passedCount === 1 ? 'crossed stop' : 'crossed stops'} before you`;
            }
            if (passedActEl) {
                passedActEl.textContent = simulationState.showPassedManual ? 'Hide' : 'Show';
            }
        }
        if (collapsedChanged && cachedRouteListEl) {
            computeDotCenters(cachedRouteListEl);
        }
    } else if (passedRowEl && !passedRowEl.classList.contains('hidden')) {
        passedRowEl.classList.add('hidden');
        cachedRouteEls.forEach(({ el }) => el.classList.remove('onboard-passed-collapsed'));
        if (cachedRouteListEl) computeDotCenters(cachedRouteListEl);
    }

    updateTimelineTrainCursor({
        simulationState,
        journey,
        overrides,
        isPreBoard,
        activeTimelineIndex,
        routeFloatIndex,
    });

    const nextSt = timeline[activeTimelineIndex + 1]?.stationName;
    const arrived = !isPreBoard && activeTimelineIndex >= timeline.length - 1;
    return { nextStationName: nextSt, arrived };
}

function interpolateYFromCenters(centers, floatIdx) {
    if (!centers.length) return 0;
    const clamped = Math.max(0, Math.min(centers.length - 1, floatIdx));
    const lo = Math.floor(clamped);
    const hi = Math.min(centers.length - 1, Math.ceil(clamped));
    const t = clamped - lo;
    const yLo = centers[lo] ?? centers.find((v) => v !== null) ?? 0;
    const yHi = centers[hi] ?? yLo;
    return yLo + (yHi - yLo) * t;
}

function updateTimelineTrainCursor({ simulationState, journey, overrides, isPreBoard, activeTimelineIndex, routeFloatIndex }) {
    const cursorEl = document.getElementById('timeline-train-cursor');
    const cardBadgeEl = document.getElementById('upstream-card-badge');
    const syncPillEl = document.getElementById('upstream-sync-pill');
    const locTitleEl = document.getElementById('upstream-train-loc-title');
    const locSubEl = document.getElementById('upstream-train-loc-sub');
    const auraEl = document.getElementById('timeline-train-aura');
    if (!cursorEl) return;

    if (!cachedRouteCentersY.length && cachedRouteListEl) {
        computeDotCenters(cachedRouteListEl);
    }
    if (cachedTrackCenterX !== null && Number.isFinite(cachedTrackCenterX)) {
        cursorEl.style.left = `${cachedTrackCenterX.toFixed(1)}px`;
    }

    const timeline = simulationState.timeline || [];
    const activeLegIndex = simulationState.activeLegIndex || 0;
    const activeLineColor = timeline[activeTimelineIndex]?.color || '#10B981';
    if (auraEl) auraEl.style.background = activeLineColor;
    if (syncPillEl) {
        const ago = simulationState.lastLocationSyncMs
            ? Math.max(0, Math.floor((Date.now() - simulationState.lastLocationSyncMs) / 1000))
            : 0;
        syncPillEl.textContent = ago <= 1 ? '· live sync' : `· synced ${ago}s ago`;
    }

    if (isPreBoard && journey) {
        const activeCand = simulationState.candidateTrains?.[simulationState.waitingTrainIndex || 0] || journey?.scheduleInfo?.trains?.[0] || null;
        const approachCtx = getIncomingTrainContext({
            journey,
            legIndex: activeLegIndex,
            trainCandidate: activeCand,
            date: new Date(),
            overrides,
            upstreamDepth: 3,
        });

        // Remove any upstream stations crossed by the incoming train cleanly
        if (approachCtx && cachedRouteListEl) {
            const visibleIds = (approachCtx.upstreamStations || []).map((u) => u.id);
            pruneCrossedUpstreamDom(cachedRouteListEl, visibleIds, simulationState, journey, overrides);
        }

        const activePart = journey.parts?.[activeLegIndex] || journey.parts?.[0];
        const originName = T_STATION(activePart?.stations?.[0]?.name || 'Station');
        const targetMs = simulationState.waitingTargetDate ? new Date(simulationState.waitingTargetDate).getTime() : Date.now();
        const secLeft = Math.max(0, Math.round((targetMs - Date.now()) / 1000));
        const waitText = secLeft <= 30
            ? (secLeft === 0 ? 'Arriving at platform' : `Arriving in ${secLeft}s`)
            : `Arrives in ${Math.ceil(secLeft / 60)} min`;
        const clockText = activeCand?.departureFormatted ? ` (${activeCand.departureFormatted})` : '';

        const summaryAnchorY = cachedUpstreamSummaryY ?? (cachedRouteCentersY[0] ? cachedRouteCentersY[0] - 48 : 36);
        const originY = cachedRouteCentersY[0] ?? summaryAnchorY + 48;
        const trackCenters = [summaryAnchorY, ...cachedUpstreamCentersY, originY];
        const trackFloat = approachCtx && typeof approachCtx.cursorTrackFloat === 'number'
            ? approachCtx.cursorTrackFloat
            : 0.1;

        const y = interpolateYFromCenters(trackCenters, trackFloat);
        cursorEl.style.transform = `translate3d(-50%, ${y.toFixed(1)}px, 0)`;
        cursorEl.classList.remove('hidden');

        if (cardBadgeEl) cardBadgeEl.textContent = secLeft <= 30 ? 'Arriving' : 'Approaching';
        if (locTitleEl) locTitleEl.textContent = approachCtx?.statusText || `Near ${originName}`;
        if (locSubEl) locSubEl.textContent = `${waitText}${clockText}`;

        const xferLiveEl = document.getElementById('interchange-live-status');
        if (xferLiveEl && activeLegIndex > 0) {
            xferLiveEl.classList.remove('hidden');
            xferLiveEl.textContent = `${approachCtx?.statusText || `Approaching ${originName}`} · ${waitText}${clockText}`;
        }
        return;
    }

    // ON_BOARD mode: concise real-time position & stops left
    const validCenters = cachedRouteCentersY.map((v, i) => {
        if (v !== null) return v;
        return cachedUpstreamSummaryY ?? 48;
    });
    if (!validCenters.length) return;
    const y = interpolateYFromCenters(validCenters, routeFloatIndex);
    cursorEl.style.transform = `translate3d(-50%, ${y.toFixed(1)}px, 0)`;
    cursorEl.classList.remove('hidden');

    const currentNode = timeline[activeTimelineIndex];
    const nextNode = timeline[activeTimelineIndex + 1];
    const currentName = currentNode ? T_STATION(currentNode.stationName) : '';
    const nextName = nextNode ? T_STATION(nextNode.stationName) : '';
    const fracInSeg = routeFloatIndex - Math.floor(routeFloatIndex);
    const stopsLeft = Math.max(0, (timeline.length - 1) - activeTimelineIndex);

    const locDescription = (!nextName)
        ? `Arriving at ${currentName}`
        : (fracInSeg > 0.15 && fracInSeg < 0.85)
            ? `Between ${currentName} & ${nextName}`
            : `Next: ${nextName}`;

    if (cardBadgeEl) cardBadgeEl.textContent = 'On Board';
    if (locTitleEl) locTitleEl.textContent = locDescription;

    if (locSubEl) {
        const speedPart = (simulationState.speedHudEnabled && simulationState.currentSpeedKmh !== null)
            ? `${simulationState.currentSpeedKmh} km/h • `
            : '';
        locSubEl.textContent = `${speedPart}${stopsLeft} ${stopsLeft === 1 ? 'stop' : 'stops'} left`;
    }
}
