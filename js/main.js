import { metroData, translations, stationTranslations, lineNameMap } from './data/stations.js';
import { CustomDropdown } from './ui/dropdown.js';
import { renderLiveRoute, updateRouteVisuals } from './ui/route.js';

// --- App Configuration & State ---
export const CONFIG = { INTERCHANGE_TIME_MINUTES: 5, AVERAGE_SPEED_KMPH: 35 };
let currentLang = localStorage.getItem('appLang') || 'en';
let startDropdown, endDropdown;
let currentJourney = null;

// Tracks the status of the live journey simulation
const simulationState = { isActive: false, journeyId: null, startTime: null, lastLocationUpdateTime: 0, locationWatcherId: null, timeline: [], animationFrameId: null, lastStationIndex: -1 };

// Cache for station lookup and routing graph
const precomputedData = { stations: {}, graph: {} };

// --- Translation Helpers ---
export function T(key) { return translations[currentLang][key] || key; }
export function T_STATION(name) {
    if (lineNameMap[name]) { const k = lineNameMap[name]; return (stationTranslations[k] && stationTranslations[k][currentLang]) ? stationTranslations[k][currentLang] : name; }
    return (stationTranslations[name] && stationTranslations[name][currentLang]) ? stationTranslations[name][currentLang] : name;
}
export function formatTime(date) { return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); }

// Allow global access for dropdowns
window.T_STATION = T_STATION;
window.CONFIG = CONFIG;

// --- Core Logic ---

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            if (elem.tagName === 'INPUT' && elem.getAttribute('placeholder')) elem.setAttribute('placeholder', translations[lang][key]);
            else elem.innerText = translations[lang][key];
        }
    });

    if (startDropdown) startDropdown.refreshTranslations();
    if (endDropdown) endDropdown.refreshTranslations();

    // Refresh journey view if active
    if (currentJourney) {
        displayJourneyResult(currentJourney);

        // If in map view/simulation mode, refresh that too
        if (simulationState.isActive) {
            renderLiveRoute(currentJourney, document.getElementById('route-list'), simulationState);

            // Refresh Header
            const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
            const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';
            const totalMinutes = currentJourney.totalTime ? Math.ceil(currentJourney.totalTime / 60) : 0;

            const simStatus = document.getElementById('simulation-status');
            simStatus.innerHTML = `
                <div class="w-full flex justify-between items-start bg-slate-900/50 p-1 -mx-1 rounded-lg">
                    <div class="flex flex-col gap-0.5">
                        <p class="font-bold text-white text-sm flex items-center gap-2">
                            <i data-lucide="activity" class="w-3.5 h-3.5 text-green-400"></i>
                            ${T('liveJourney') || 'Live Journey'}
                        </p>
                        <p class="text-xs text-gray-200 font-medium">${T('towards')} ${destinationName}</p>
                        <p class="text-[10px] text-gray-500">${totalMinutes} ${T('minRemaining')}</p>
                    </div>
                    <button id="exit-journey-btn" class="bg-slate-800 border border-slate-700 text-gray-400 font-medium px-3 py-1.5 rounded-md text-xs hover:bg-slate-700 hover:text-white transition-colors mt-0.5">${T('exitJourney')}</button>
                </div>`;
            document.getElementById('exit-journey-btn').addEventListener('click', stopSimulation);
            if (window.lucide) window.lucide.createIcons();
        }
    }
}

function precomputeJourneyData() {
    Object.keys(metroData).forEach(lineKey => {
        const line = metroData[lineKey];
        line.stations.forEach((station, index) => {
            // Save station info with its line color and index for easy access later
            precomputedData.stations[station.id] = { ...station, lineKey, color: line.color, lineName: line.name, index };
            if (!precomputedData.graph[station.id]) precomputedData.graph[station.id] = [];

            // Add connection to the Previous station
            if (index > 0) {
                const prev = line.stations[index - 1];
                precomputedData.graph[station.id].push({ node: prev.id, weight: prev.timeToNext, distance: prev.distanceToNext, line: lineKey });
            }
            // Add connection to the Next station
            if (index < line.stations.length - 1) {
                const next = line.stations[index + 1];
                precomputedData.graph[station.id].push({ node: next.id, weight: station.timeToNext, distance: station.distanceToNext, line: lineKey });
            }

            // Handle Interchanges (connecting lines)
            if (station.interchangeId) {
                Object.keys(metroData).forEach(otherLineKey => {
                    if (otherLineKey !== lineKey) {
                        const match = metroData[otherLineKey].stations.find(s => s.interchangeId === station.interchangeId);
                        if (match) {
                            // Add a "virtual" walking edge between the two platforms
                            precomputedData.graph[station.id].push({ node: match.id, weight: CONFIG.INTERCHANGE_TIME_MINUTES * 60, distance: 0, line: 'interchange' });
                        }
                    }
                });
            }
        });
    });
}

function calculateJourney(startId, endId) {
    // We use Dijkstra's Algorithm to find the fastest path
    const distances = {}; const previous = {}; const queue = [];
    Object.keys(precomputedData.stations).forEach(id => { distances[id] = Infinity; });
    distances[startId] = 0;
    queue.push({ id: startId, cost: 0 });

    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost);
        const { id: currentId, cost } = queue.shift();
        if (currentId === endId) break;
        if (cost > distances[currentId]) continue;

        const neighbors = precomputedData.graph[currentId] || [];
        neighbors.forEach(neighbor => {
            const newCost = cost + neighbor.weight;
            if (newCost < distances[neighbor.node]) {
                distances[neighbor.node] = newCost;
                previous[neighbor.node] = { id: currentId, line: neighbor.line, distance: neighbor.distance };
                queue.push({ id: neighbor.node, cost: newCost });
            }
        });
    }

    if (distances[endId] === Infinity) return null;

    // Reconstruct path
    const path = []; let curr = endId;
    let totalDistanceKm = 0;
    while (curr) {
        path.unshift(curr);
        if (previous[curr]) {
            totalDistanceKm += (previous[curr].distance || 0);
            curr = previous[curr] ? previous[curr].id : null;
        } else {
            curr = null;
        }
    }

    // Build Journey Object
    const parts = [];
    let currentPart = null;

    for (let i = 0; i < path.length; i++) {
        const stationId = path[i];
        const stationData = precomputedData.stations[stationId];
        const nextStationId = path[i + 1];

        let lineOfTravel = null;
        if (nextStationId) {
            // Find edge to get line
            const edge = precomputedData.graph[stationId].find(e => e.node === nextStationId);
            lineOfTravel = edge ? edge.line : stationData.lineKey;
        } else if (currentPart) {
            lineOfTravel = currentPart.stations[0].lineKey; // Last station inherits previous line
        }

        // Handle interchange edge (virtual walk)
        if (lineOfTravel === 'interchange') {
            // Finish current part
            if (currentPart) {
                currentPart.stations.push(stationData);
                // Don't add 'interchange' station to new part yet, the NEXT loop iteration will act as start of new part
            }
            continue;
        }

        if (!currentPart || currentPart.stations[0].lineKey !== lineOfTravel) {
            // Start new part
            // If checking previous part ended, current node is start of new part
            // But if we just walked interchange, this node is start.

            // Heuristic for direction
            let direction = 'forward'; // Default
            if (nextStationId) {
                const currentIdx = stationData.index;
                const nextData = precomputedData.stations[nextStationId];
                if (nextData && nextData.lineKey === lineOfTravel && nextData.index < currentIdx) direction = 'backward';
            }

            // Get platforms
            const platform = (stationData.platforms) ? (stationData.platforms[direction] || 1) : 1;

            // Determine journey direction name (Terminal station of line in that direction)
            let termName = "Terminus";
            if (metroData[lineOfTravel]) {
                const lineStns = metroData[lineOfTravel].stations;
                termName = direction === 'forward' ? lineStns[lineStns.length - 1].name : lineStns[0].name;
            }

            currentPart = {
                stations: [stationData],
                totalTime: 0,
                startPlatform: platform,
                journeyDirectionName: T_STATION(termName)
            };
            parts.push(currentPart);
        } else {
            currentPart.stations.push(stationData);
        }
    }

    // Calculate Fare using strict Distance Slabs logic
    const departureTime = getDepartureTime();
    const fareDetails = calculateMetroFare(totalDistanceKm, departureTime, 'TOKEN');

    return {
        id: `${startId}-${endId}`,
        parts: parts,
        totalTime: distances[endId],
        fare: fareDetails.finalFare,
        baseFare: fareDetails.baseFare,
        distanceKm: totalDistanceKm.toFixed(2),
        fareDetails: fareDetails,
        departureTime: departureTime
    };
}

const FARE_SLABS = [
    { max: 2.00, fare: 10 },
    { max: 4.00, fare: 20 },
    { max: 6.00, fare: 30 },
    { max: 8.00, fare: 40 },
    { max: 10.00, fare: 50 },
    { max: 15.00, fare: 60 },
    { max: 15.00, fare: 60 }, // Duplicate check/safety or just overlap logic
    { max: 20.00, fare: 70 },
    { max: 25.00, fare: 80 },
    { max: Infinity, fare: 90 }
];

function calculateMetroFare(distanceKm, travelTime = new Date(), ticketType = 'TOKEN') {
    // 1. Determine Base Fare from Slabs
    let baseFare = 90;

    // BMRCL Rule: Base fare strictly based on distance slab
    // Using Find to get the first slab that fits
    const slab = FARE_SLABS.find(s => distanceKm <= s.max);
    if (slab) baseFare = slab.fare;

    // Hard Cap Rule: > 25km is 90
    if (distanceKm > 25.00) baseFare = 90;

    // Minimum logic (0-2km is 10) handled by first slab.

    // 2. Apply Discounts
    let discountPercent = 0;
    const typeUpper = ticketType.toUpperCase();

    if (typeUpper === 'CARD' || typeUpper === 'QR' || typeUpper === 'NCMC') {
        // Standard Smart Card Discount: 5%
        discountPercent = 5;

        // Check Time-Based Rules (Feb 2025)
        const day = travelTime.getDay(); // 0 = Sunday
        const hour = travelTime.getHours();
        const min = travelTime.getMinutes();
        const timeVal = hour + min / 60;

        // Holidays (Sundays & General) -> Flat 10%
        // Simplified holiday check (Sundays + common fixed dates)
        const isHoliday = (day === 0) || isFixedHoliday(travelTime);

        if (isHoliday) {
            discountPercent = 10;
        } else {
            // Weekday Logic
            // Peak: 08:00–12:00, 16:00–21:00 -> 5% (No extra)
            // Off-Peak: Start–08:00, 12:00–16:00, 21:00–End -> 10%

            // Ranges for Off-Peak:
            // < 8.0
            // >= 12.0 AND < 16.0
            // >= 21.0

            if (timeVal < 8.0 || (timeVal >= 12.0 && timeVal < 16.0) || timeVal >= 21.0) {
                discountPercent = 10;
            }
        }
    }

    // "Token users get NO discount."
    if (typeUpper === 'TOKEN') discountPercent = 0;

    let discountAmount = baseFare * (discountPercent / 100);
    // Rounding Rule: Nearest whole rupee
    let finalFare = Math.round(baseFare - discountAmount);

    return {
        baseFare: baseFare,
        finalFare: finalFare,
        appliedDiscount: Math.round(discountAmount)
    };
}

function isFixedHoliday(date) {
    const d = date.getDate();
    const m = date.getMonth() + 1; // 1-12
    // Fixed Holidays: Jan 26, Aug 15, Oct 2
    if ((d === 26 && m === 1) || (d === 15 && m === 8) || (d === 2 && m === 10)) return true;
    return false;
}

// Deprecated: Old time-based calculation removed.
// function calculateFare(activeTimeSeconds) { ... }

function getDepartureTime() {
    const now = new Date();
    // Round to next 5 min
    const coeff = 1000 * 60 * 5;
    return new Date(Math.ceil(now.getTime() / coeff) * coeff);
}

function displayJourneyResult(journey) {
    const summaryContainer = document.getElementById('journey-summary-container');
    const boardBtn = document.getElementById('board-train-btn');
    const summaryText = document.getElementById('journey-summary');

    if (!journey) {
        summaryText.textContent = T('selectStationsHint');
        summaryText.className = "text-center text-sm text-gray-400";
        boardBtn.classList.add('hidden');
        return;
    }

    currentJourney = journey;

    summaryText.className = "text-left";
    let formattedTime = Math.ceil(journey.totalTime / 60) + " " + T('minutes');
    if (journey.totalTime > 3600) {
        const h = Math.floor(journey.totalTime / 3600);
        const m = Math.ceil((journey.totalTime % 3600) / 60);
        formattedTime = `${h} ${T('hr')} ${m} ${T('minutes')}`;
    }

    summaryText.innerHTML = `
        <div class="flex justify-between items-end mb-2">
            <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-bold">${T('totalTime')}</p>
                <p class="text-2xl font-bold text-white">${formattedTime}</p>
            </div>
            <div class="text-right">
                <p class="text-xs text-gray-400 uppercase tracking-wide font-bold">${T('estFare')}</p>
                <p class="text-2xl font-bold text-green-400">₹${journey.fare}</p>
            </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-900/30 p-2 rounded border border-indigo-500/30">
            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            <span>${T('nextTrain')}: ${formatTime(journey.departureTime)} (${T('now')})</span>
        </div>
    `;

    boardBtn.classList.remove('hidden');

    // Auto-scroll to summary on mobile
    if (window.innerWidth < 640) {
        boardBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (window.lucide) window.lucide.createIcons();
}

function switchView(viewId) {
    document.getElementById('planner-view').classList.add('hidden');
    document.getElementById('map-view').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');

    if (viewId === 'planner-view') {
        simulationState.isActive = false;
        if (simulationState.animationFrameId) cancelAnimationFrame(simulationState.animationFrameId);
    }
}

// --- Simulation Logic ---

function generateTimeline(journey) {
    // Convert parts to linear timeline
    const timeline = [];
    let currentTime = 0; // seconds from start

    journey.parts.forEach(part => {
        part.stations.forEach((s, i) => {
            // departureTime = arrival + dwell
            const isLast = i === part.stations.length - 1;

            // Time to next?
            let travelTime = 0;
            if (!isLast) {
                const nextS = part.stations[i + 1];
                // find edge
                const weight = Math.abs(nextS.timeToNext || 90); // default
                travelTime = weight;
            }

            timeline.push({
                stationId: s.id,
                stationName: T_STATION(s.name),
                arrivalTime: currentTime,
                departureTime: currentTime + 30, // 30s dwell
                color: s.color,
                lat: s.lat,
                lon: s.lon
            });

            currentTime += (travelTime + 30);
        });

        // Add interchange walking time if not last part
        currentTime += (CONFIG.INTERCHANGE_TIME_MINUTES * 60);
    });
    return timeline;
}

// Live tracking algorithm removed. Static view only.

function startSimulation(journey, useLiveLocation, startTimeOverride) {
    if (!journey) return;
    switchView('map-view');

    // Set state primarily for navigation/back-button logic, but no active tracking
    simulationState.isActive = true;
    simulationState.journeyId = journey.id;
    // No timeline generation needed for static view unless used for simulation, 
    // but renderLiveRoute needs structure. We keep data, but stop "live" updates.
    simulationState.timeline = generateTimeline(journey);

    sessionStorage.setItem('activeJourney', JSON.stringify(journey));

    // Render the static route list
    renderLiveRoute(journey, document.getElementById('route-list'), simulationState);

    // Static Header
    // Get destination from the last station of the last part
    const lastPart = journey.parts[journey.parts.length - 1];
    const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';
    const totalMinutes = journey.totalTime ? Math.ceil(journey.totalTime / 60) : 0;

    const simStatus = document.getElementById('simulation-status');
    simStatus.innerHTML = `
        <div class="w-full flex justify-between items-start bg-slate-900/50 p-1 -mx-1 rounded-lg">
            <div class="flex flex-col gap-0.5">
                <p class="font-bold text-white text-sm flex items-center gap-2">
                    <i data-lucide="activity" class="w-3.5 h-3.5 text-green-400"></i>
                    ${T('liveJourney') || 'Live Journey'}
                </p>
                <p class="text-xs text-gray-200 font-medium">${T('towards')} ${destinationName}</p>
                <p class="text-[10px] text-gray-500">${totalMinutes} ${T('minRemaining')}</p>
            </div>
            <button id="exit-journey-btn" class="bg-slate-800 border border-slate-700 text-gray-400 font-medium px-3 py-1.5 rounded-md text-xs hover:bg-slate-700 hover:text-white transition-colors mt-0.5">${T('exitJourney')}</button>
        </div>`;
    document.getElementById('exit-journey-btn').addEventListener('click', stopSimulation);

    if (window.lucide) window.lucide.createIcons();
}

function stopSimulation() {
    simulationState.isActive = false;
    if (simulationState.animationFrameId) cancelAnimationFrame(simulationState.animationFrameId);
    if (simulationState.locationWatcherId) navigator.geolocation.clearWatch(simulationState.locationWatcherId);
    sessionStorage.removeItem('activeJourney');
    sessionStorage.removeItem('simulationState');
    switchView('planner-view');
}

function handleJourneyUpdate() {
    const startVal = document.getElementById('start-station').value;
    const endVal = document.getElementById('end-station').value;
    if (startVal && endVal) {
        const j = calculateJourney(startVal, endVal);
        displayJourneyResult(j);
    }
}

function initializeApp() {
    startDropdown = new CustomDropdown('start-station-dropdown', 'Select Start Station', 'start', (val) => {
        document.getElementById('start-station').value = val;
        handleJourneyUpdate();
    });

    endDropdown = new CustomDropdown('end-station-dropdown', 'Select Destination', 'end', (val) => {
        document.getElementById('end-station').value = val;
        handleJourneyUpdate();
    });

    document.getElementById('language-selector').value = currentLang;
    document.getElementById('language-selector').addEventListener('change', (e) => setLanguage(e.target.value));
    setLanguage(currentLang);

    precomputeJourneyData();

    document.getElementById('swap-stations').addEventListener('click', () => {
        if (simulationState.isActive) return;
        const startVal = document.getElementById('start-station').value;
        const endVal = document.getElementById('end-station').value;
        if (startVal && endVal) {
            startDropdown.selectById(endVal);
            endDropdown.selectById(startVal);
        }
    });

    document.getElementById('board-train-btn').addEventListener('click', () => {
        if (currentJourney) startSimulation(currentJourney, false); // Simulation mode
    });

    // Restore state
    const savedJourneyJSON = sessionStorage.getItem('activeJourney');
    const savedSimStateJSON = sessionStorage.getItem('simulationState');
    if (savedJourneyJSON && savedSimStateJSON) {
        try {
            const savedJourney = JSON.parse(savedJourneyJSON);
            const savedSimState = JSON.parse(savedSimStateJSON);
            savedJourney.departureTime = new Date(savedJourney.departureTime);
            const startId = savedJourney.id.split('-')[0];
            const endId = savedJourney.id.split('-')[1];
            startDropdown.selectById(startId);
            endDropdown.selectById(endId);
            startSimulation(savedJourney, savedSimState.useLiveLocation, savedSimState.startTime);
        } catch (e) { console.error("Restore failed", e); }
    } else {
        switchView('planner-view');
    }

    setInterval(() => {
        document.getElementById('live-clock').textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    }, 1000);

    if (window.lucide) window.lucide.createIcons();
}

// Start
document.addEventListener('DOMContentLoaded', initializeApp);
