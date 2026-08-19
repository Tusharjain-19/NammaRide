import { T, T_STATION, CONFIG, formatTime } from '../utils/helpers.js';
import { stationPlaces } from '../data/stationPlaces.js';

export function renderLiveRoute(journey, routeListElement, simulationState) {
    let routeHtml = '';
    let overallStationIndex = 0;
    const totalMinutes = Math.ceil(journey.totalTime / 60);
    const finalArrivalTime = new Date(journey.departureTime.getTime() + totalMinutes * 60000);

    // Create a linear list of stations from the journey parts
    const flatList = [];
    journey.parts.forEach((part, partIndex) => {
        part.stations.forEach((s, i) => {
            const prev = flatList.length > 0 ? flatList[flatList.length - 1].station : null;
            // Check if this station is the same as the previous one (identifying interchanges inside the data)
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
                    isEnd: false
                });
            }
        });
    });

    if (flatList.length > 0) flatList[flatList.length - 1].isEnd = true;

    flatList.forEach((node, i) => {
        const nextNode = flatList[i + 1];
        // Line logic
        const isPurple = (c) => c === '#9B59B6' || c === '#8B5CF6' || c === '#A855F7' || c === '#9333EA';
        const isGreen = (c) => c === '#2ECC71' || c === '#22C55E' || c === '#10B981' || c === '#059669';
        const isYellow = (c) => c === '#FBBF24' || c === '#F1C40F' || c === '#EAB308' || c === '#F59E0B';

        let colorClass = 'line-default';
        const color = node.lineColor || (nextNode ? nextNode.lineColor : '');

        if (isPurple(color)) colorClass = 'line-purple';
        else if (isGreen(color)) colorClass = 'line-green';
        else if (isYellow(color)) colorClass = 'line-yellow';

        // Check for specific interchange types (Purple <-> Green)
        let interchangeClass = '';
        if (node.isInterchange && nextNode) {
            const currentLine = node.lineColor;
            const nextLine = nextNode.lineColor;

            if (isPurple(currentLine) && isGreen(nextLine)) {
                interchangeClass = 'interchange-purple-green';
            } else if (isGreen(currentLine) && isPurple(nextLine)) {
                interchangeClass = 'interchange-green-purple';
            } else if (isGreen(currentLine) && isYellow(nextLine)) {
                interchangeClass = 'interchange-green-yellow';
            } else if (isYellow(currentLine) && isGreen(nextLine)) {
                interchangeClass = 'interchange-yellow-green';
            }
        }

        routeHtml += renderStationItem(node, {
            isStart: node.isStart,
            isEnd: node.isEnd,
            isInterchange: node.isInterchange,
            interchangeClass: interchangeClass, // Pass specific class
            departureTime: journey.departureTime,
            arrivalTime: finalArrivalTime,
            liClass: nextNode ? colorClass : colorClass, // Segment color
            nextPartDetails: node.nextPartDetails
        }, node.index);
    });

    routeListElement.innerHTML = routeHtml;
    createIcons();
}

function renderStationItem(node, details, index) {
    const { isStart, isEnd, isInterchange, liClass, nextPartDetails } = details;
    const station = node.station;
    const name = T_STATION(station.name);

    const places = stationPlaces[station.name] || [];
    let nearbyBadge = '';
    if (isEnd && places.length > 0) {
        nearbyBadge = `
            <button class="nearby-explore-trigger flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold" onclick="window.showNearbyAttractions('${station.name.replace(/'/g, "\\'")}')">
                <i data-lucide="sparkles" class="w-3 h-3 text-emerald-400"></i>
                <span class="text-emerald-400">${places.length} nearby</span>
            </button>
        `;
    }

    let metaInfo = '';
    if (isStart) {
        metaInfo = `<div class="info-strip text-secondary bg-card-subtle">${T('boardAt')} ${T('platform')} ${node.part.startPlatform} <span class="text-[10px] opacity-75">(${T('towards')} ${node.part.journeyDirectionName})</span></div>`;
    } else if (isInterchange && nextPartDetails) {
        // Explicit Platform & Direction
        const lineName = T_STATION(nextPartDetails.stations[0].lineName);
        const direction = nextPartDetails.journeyDirectionName;
        const platform = nextPartDetails.startPlatform;

        metaInfo = `
            <div class="interchange-info">
                <div class="interchange-row text-primary font-medium">
                     <i data-lucide="arrow-right-left" class="w-3.5 h-3.5 text-secondary"></i>
                     <span>${T('changeTo')} ${lineName}</span>
                </div>
                <div class="interchange-meta flex flex-col gap-1 mt-1">
                    <div class="flex items-center gap-1.5 text-xs text-secondary">
                        <span class="bg-card-subtle border border-subtle px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide text-primary">${T('platform')} ${platform}</span>
                        <span>${T('towards')} <span class="text-primary">${direction}</span></span>
                    </div>
                    <div class="text-[10px] text-secondary opacity-70 pl-0.5">~5 ${T('walkTime')}</div>
                </div>
            </div>`;
    } else if (isEnd) {
        metaInfo = `
            <div class="station-meta text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 mt-2 w-fit font-bold text-xs">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span>${T('arrive') || 'Arriving at'} ${formatTime(details.arrivalTime)} • ${T('destination') || 'Your Destination'}</span>
            </div>
        `;
    }

    return `
        <li id="station-li-${index}" data-station-id="${station.id}" class="station-item ${liClass} ${isInterchange ? 'interchange' : ''} ${details.interchangeClass || ''}">
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

export function updateRouteVisuals(simulationState) {
    if (!simulationState.isActive || !simulationState.timeline) return;

    const timeline = simulationState.timeline;
    let activeTimelineIndex = 0;

    if (simulationState.useGPS && simulationState.currentStationIndex !== undefined && simulationState.currentStationIndex >= 0) {
        activeTimelineIndex = simulationState.currentStationIndex;
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
    }

    const currentStationId = timeline[activeTimelineIndex]?.stationId;

    const items = document.querySelectorAll('.station-item');
    let foundCurrent = false;

    items.forEach(item => {
        const id = item.getAttribute('data-station-id');

        if (id === currentStationId && !foundCurrent) {
            item.classList.add('current');
            item.classList.remove('completed');
            foundCurrent = true;
        } else if (foundCurrent) {
            item.classList.remove('current', 'completed');
        } else {
            item.classList.add('completed');
            item.classList.remove('current');
        }
    });

    // Return status for header update
    const nextSt = timeline[activeTimelineIndex + 1]?.stationName;
    const arrived = activeTimelineIndex >= timeline.length - 1;
    return {
        nextStationName: nextSt,
        arrived: arrived
    };
}
