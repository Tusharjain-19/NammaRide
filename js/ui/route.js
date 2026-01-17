import { metroData, translations, stationTranslations } from '../data/stations.js';
import { T, T_STATION, CONFIG, formatTime } from '../main.js';

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
        // Purple -> #8B5CF6 / #9B59B6 check
        let colorClass = 'line-default';
        const color = nextNode ? nextNode.lineColor : node.lineColor;

        // Simple heuristic for class names based on color code
        if (color === '#8B5CF6' || color === '#9B59B6') colorClass = 'line-purple';
        else if (color === '#22C55E' || color === '#2ECC71') colorClass = 'line-green';
        else if (color === '#FBBF24' || color === '#F1C40F') colorClass = 'line-yellow';

        // Check for specific interchange types (Purple <-> Green)
        let interchangeClass = '';
        if (node.isInterchange && nextNode) {
            const currentLine = node.lineColor; // e.g., #9B59B6
            const nextLine = nextNode.lineColor; // e.g., #2ECC71

            // Purple (#9B59B6 or #8B5CF6) <-> Green (#2ECC71 or #22C55E)
            const isPurple = (c) => c === '#9B59B6' || c === '#8B5CF6';
            const isGreen = (c) => c === '#2ECC71' || c === '#22C55E';

            if (isPurple(currentLine) && isGreen(nextLine)) {
                interchangeClass = 'interchange-purple-green';
            } else if (isGreen(currentLine) && isPurple(nextLine)) {
                interchangeClass = 'interchange-green-purple';
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

    let metaInfo = '';
    if (isStart) {
        metaInfo = `<div class="info-strip">${T('boardAt')} ${T('platform')} ${node.part.startPlatform} <span class="text-xs opacity-75">(${T('towards')} ${node.part.journeyDirectionName})</span></div>`;
    } else if (isInterchange && nextPartDetails) {
        // Explicit Platform & Direction
        const lineName = T_STATION(nextPartDetails.stations[0].lineName);
        const direction = nextPartDetails.journeyDirectionName;
        const platform = nextPartDetails.startPlatform;

        metaInfo = `
            <div class="interchange-info">
                <div class="interchange-row text-white font-medium">
                     <i data-lucide="arrow-right-left" class="w-3.5 h-3.5 text-gray-400"></i>
                     <span>${T('changeTo')} ${lineName}</span>
                </div>
                <div class="interchange-meta flex flex-col gap-1 mt-1">
                    <div class="flex items-center gap-1.5 text-xs text-gray-300">
                        <span class="bg-indigo-900/50 border border-indigo-700/50 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide text-indigo-200">${T('platform')} ${platform}</span>
                        <span>${T('towards')} <span class="text-white">${direction}</span></span>
                    </div>
                    <div class="text-[10px] text-gray-500 pl-0.5">~5 ${T('walkTime')}</div>
                </div>
            </div>`;
    } else if (isEnd) {
        metaInfo = `<div class="station-meta">${T('arrive')} ${formatTime(details.arrivalTime)}</div>`;
    }

    return `
        <li id="station-li-${index}" data-station-id="${station.id}" class="station-item ${liClass} ${isInterchange ? 'interchange' : ''} ${details.interchangeClass || ''}">
            <div class="station-dot"></div>
            <div class="station-content">
                <div class="station-name">${name}</div>
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

    const elapsedTime = (Date.now() - simulationState.startTime) / 1000;
    const timeline = simulationState.timeline;

    let activeTimelineIndex = 0;
    for (let i = 0; i < timeline.length; i++) {
        if (elapsedTime >= timeline[i].arrivalTime) {
            activeTimelineIndex = i;
        } else {
            break;
        }
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
    return {
        nextStationName: nextSt,
        arrived: elapsedTime >= timeline[timeline.length - 1].arrivalTime
    };
}
