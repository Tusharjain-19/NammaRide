import { metroData, translations, stationTranslations, lineNameMap } from './data/stations.js';
import { stationsMeta } from './data/stationsMeta.js';
import { CustomDropdown } from './ui/dropdown.js';
import { renderLiveRoute, updateRouteVisuals } from './ui/route.js';
import { calculateFare } from './logic/pricing.js';
import { initSections, renderStationsList, renderStationDetail, renderTimings, renderSafety, renderExplore, renderExploreStation, renderPlaceDetail } from './ui/sections.js';
import { T, T_STATION, CONFIG, formatTime, getCurrentLang, setCurrentLang } from './utils/helpers.js';

// --- App State ---
let currentLang = getCurrentLang();
let startDropdown, endDropdown;
let currentJourney = null;
let activeView = 'plan';

// Tracks the status of the live journey simulation
const simulationState = { isActive: false, journeyId: null, startTime: null, lastLocationUpdateTime: 0, locationWatcherId: null, timeline: [], animationFrameId: null, lastStationIndex: -1 };

// --- Theme Management ---
function getLineColor(lineName) {
    if (lineName === 'Purple Line') return '#8B5CF6';
    if (lineName === 'Green Line') return '#22C55E';
    if (lineName === 'Yellow Line') return '#FBBF24';
    return '#6366F1';
}

function initTheme() {
    const theme = localStorage.getItem('appTheme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(theme);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    } else {
        document.body.classList.remove('light-mode');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }
    localStorage.setItem('appTheme', theme);

    // Update theme toggle icons
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    if (darkIcon && lightIcon) {
        if (theme === 'light') {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        } else {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        }
    }

    if (window.lucide) window.lucide.createIcons();
}

// Cache for station lookup and routing graph
const precomputedData = { stations: {}, graph: {} };

// --- Translation Helpers (imported from utils/helpers.js) ---

// Allow global access for dropdowns
window.T_STATION = T_STATION;
window.T = T;
window.CONFIG = CONFIG;

// --- Navigation Helpers for Sections ---
window.showStationDetail = function(stationId) {
    const container = document.getElementById('stations-view');
    renderStationDetail(container, stationId);
    container.scrollTop = 0;
};

window.showStationsList = function() {
    const container = document.getElementById('stations-view');
    renderStationsList(container);
    container.scrollTop = 0;
};

window.showExplore = function() {
    const container = document.getElementById('explore-view');
    renderExplore(container);
    container.scrollTop = 0;
};

window.showExploreStation = function(stationName) {
    const container = document.getElementById('explore-view');
    renderExploreStation(container, stationName);
    container.scrollTop = 0;
};

window.showPlaceDetail = function(stationName, placeId) {
    const container = document.getElementById('explore-view');
    renderPlaceDetail(container, stationName, placeId);
    container.scrollTop = 0;
};

// --- Core Logic ---

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    setCurrentLang(lang);
    currentLang = getCurrentLang();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
        const key = elem.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            if (elem.tagName === 'INPUT' && elem.getAttribute('placeholder')) elem.setAttribute('placeholder', translations[lang][key]);
            else elem.innerHTML = translations[lang][key];
        }
    });

    if (startDropdown) startDropdown.refreshTranslations();
    if (endDropdown) endDropdown.refreshTranslations();

    // Refresh active section view
    refreshActiveView();

    // Refresh journey view if active
    if (currentJourney) {
        displayJourneyResult(currentJourney);

        if (simulationState.isActive) {
            renderLiveRoute(currentJourney, document.getElementById('route-list'), simulationState);

            const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
            const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';
            const totalMinutes = currentJourney.totalTime ? Math.ceil(currentJourney.totalTime / 60) : 0;

            const simStatus = document.getElementById('simulation-status');
            simStatus.innerHTML = `
                <div class="w-full flex justify-between items-start bg-card-subtle p-3 rounded-xl border border-subtle shadow-sm">
                    <div class="flex flex-col gap-0.5">
                        <p class="font-bold text-primary text-sm flex items-center gap-2">
                            <i data-lucide="activity" class="w-3.5 h-3.5 text-green-400"></i>
                            ${T('liveJourney') || 'Live Journey'}
                        </p>
                        <p class="text-xs text-secondary font-medium">${T('towards')} ${destinationName}</p>
                        <p class="text-[10px] text-secondary opacity-70">${totalMinutes} ${T('minRemaining')}</p>
                    </div>
                    <button id="exit-journey-btn" class="bg-card-subtle border border-subtle text-secondary font-medium px-3 py-1.5 rounded-md text-xs hover:text-indigo-400 transition-colors mt-0.5">${T('exitJourney')}</button>
                </div>`;
            document.getElementById('exit-journey-btn').addEventListener('click', stopSimulation);
            if (window.lucide) window.lucide.createIcons();
        }
    }
}

function refreshActiveView() {
    if (activeView === 'stations') renderStationsList(document.getElementById('stations-view'));
    else if (activeView === 'timings') renderTimings(document.getElementById('timings-view'));
    else if (activeView === 'safety') renderSafety(document.getElementById('safety-view'));
    else if (activeView === 'explore') renderExplore(document.getElementById('explore-view'));
}

function precomputeJourneyData() {
    Object.keys(metroData).forEach(lineKey => {
        const line = metroData[lineKey];
        line.stations.forEach((station, index) => {
            precomputedData.stations[station.id] = { ...station, lineKey, color: line.color, lineName: line.name, index };
            if (!precomputedData.graph[station.id]) precomputedData.graph[station.id] = [];

            if (index > 0) {
                const prev = line.stations[index - 1];
                precomputedData.graph[station.id].push({ node: prev.id, weight: prev.timeToNext, distance: prev.distanceToNext, line: lineKey });
            }
            if (index < line.stations.length - 1) {
                const next = line.stations[index + 1];
                precomputedData.graph[station.id].push({ node: next.id, weight: station.timeToNext, distance: station.distanceToNext, line: lineKey });
            }

            if (station.interchangeId) {
                Object.keys(metroData).forEach(otherLineKey => {
                    if (otherLineKey !== lineKey) {
                        const match = metroData[otherLineKey].stations.find(s => s.interchangeId === station.interchangeId);
                        if (match) {
                            precomputedData.graph[station.id].push({ node: match.id, weight: CONFIG.INTERCHANGE_TIME_MINUTES * 60, distance: 0, line: 'interchange' });
                        }
                    }
                });
            }
        });
    });
}

function calculateJourney(startId, endId) {
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

    const path = []; let curr = endId;
    let totalDistanceKm = 0;
    while (curr) {
        path.unshift(curr);
        if (previous[curr]) {
            totalDistanceKm += (previous[curr].distance || 0);
            curr = previous[curr] ? previous[curr].id : null;
        } else { curr = null; }
    }

    const parts = [];
    let currentPart = null;

    for (let i = 0; i < path.length; i++) {
        const stationId = path[i];
        const stationData = precomputedData.stations[stationId];
        const nextStationId = path[i + 1];

        let lineOfTravel = null;
        if (nextStationId) {
            const edge = precomputedData.graph[stationId].find(e => e.node === nextStationId);
            lineOfTravel = edge ? edge.line : stationData.lineKey;
        } else if (currentPart) {
            lineOfTravel = currentPart.stations[0].lineKey;
        }

        if (lineOfTravel === 'interchange') {
            if (currentPart) { currentPart.stations.push(stationData); }
            continue;
        }

        if (!currentPart || currentPart.stations[0].lineKey !== lineOfTravel) {
            let direction = 'forward';
            if (nextStationId) {
                const currentIdx = stationData.index;
                const nextData = precomputedData.stations[nextStationId];
                if (nextData && nextData.lineKey === lineOfTravel && nextData.index < currentIdx) direction = 'backward';
            }
            const platform = (stationData.platforms) ? (stationData.platforms[direction] || 1) : 1;
            let termName = "Terminus";
            if (metroData[lineOfTravel]) {
                const lineStns = metroData[lineOfTravel].stations;
                termName = direction === 'forward' ? lineStns[lineStns.length - 1].name : lineStns[0].name;
            }
            currentPart = { stations: [stationData], totalTime: 0, startPlatform: platform, journeyDirectionName: T_STATION(termName) };
            parts.push(currentPart);
        } else {
            currentPart.stations.push(stationData);
        }
    }

    const departureTime = getDepartureTime();
    const fareDetails = calculateFare(totalDistanceKm, departureTime, 'TOKEN');

    return {
        id: `${startId}-${endId}`, parts: parts, totalTime: distances[endId],
        fare: fareDetails.finalFare, baseFare: fareDetails.baseFare,
        distanceKm: totalDistanceKm.toFixed(2), fareDetails: fareDetails, departureTime: departureTime
    };
}

function getDepartureTime() {
    const now = new Date();
    const coeff = 1000 * 60 * 5;
    return new Date(Math.ceil(now.getTime() / coeff) * coeff);
}

function displayJourneyResult(journey) {
    const summaryContainer = document.getElementById('journey-summary-container');
    const boardBtn = document.getElementById('board-train-btn');
    const summaryText = document.getElementById('journey-summary');

    if (!journey) {
        summaryText.textContent = T('selectStationsHint');
        summaryText.className = "text-center text-sm text-secondary";
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
                <p class="text-xs text-secondary uppercase tracking-wide font-bold">${T('totalTime')}</p>
                <p class="text-2xl font-bold text-primary">${formattedTime}</p>
            </div>
            <div class="text-right">
                <p class="text-xs text-secondary uppercase tracking-wide font-bold">${T('estFare')}</p>
                <p class="text-2xl font-bold text-green-400">₹${journey.fare}</p>
            </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-[var(--accent-color)] bg-[var(--bg-card-hover)] p-2.5 rounded-xl border border-[var(--border-color)]">
            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            <span class="font-medium">${T('nextTrain')}: ${formatTime(journey.departureTime)} (${T('now')})</span>
        </div>
    `;

    boardBtn.classList.remove('hidden');
    if (window.innerWidth < 640) {
        boardBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (window.lucide) window.lucide.createIcons();
}

function switchView(viewId) {
    // Hide all views
    const allViews = ['planner-view', 'map-view', 'stations-view', 'timings-view', 'explore-view', 'safety-view'];
    allViews.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.add('hidden');
        }
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = 'flex';
        target.style.flexDirection = 'column';
        target.classList.remove('hidden');
    }

    // Hide bottom nav during simulation
    const bottomNav = document.getElementById('bottom-nav');
    if (viewId === 'map-view') {
        bottomNav.style.display = 'none';
    } else {
        bottomNav.style.display = 'flex';
    }

    if (viewId === 'planner-view') {
        simulationState.isActive = false;
        if (simulationState.animationFrameId) cancelAnimationFrame(simulationState.animationFrameId);
    }
}

// --- Bottom Navigation ---
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            navigateToView(view);
        });
    });
}

function navigateToView(view) {
    activeView = view;

    // Update active nav state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Show the correct view
    if (view === 'plan') {
        switchView('planner-view');
    } else if (view === 'stations') {
        switchView('stations-view');
        renderStationsList(document.getElementById('stations-view'));
    } else if (view === 'timings') {
        switchView('timings-view');
        renderTimings(document.getElementById('timings-view'));
    } else if (view === 'explore') {
        switchView('explore-view');
        renderExplore(document.getElementById('explore-view'));
    } else if (view === 'safety') {
        switchView('safety-view');
        renderSafety(document.getElementById('safety-view'));
    }
}

// --- Simulation Logic ---
function generateTimeline(journey) {
    const timeline = [];
    let currentTime = 0;

    journey.parts.forEach(part => {
        part.stations.forEach((s, i) => {
            const isLast = i === part.stations.length - 1;
            let travelTime = 0;
            if (!isLast) {
                const nextS = part.stations[i + 1];
                const weight = Math.abs(nextS.timeToNext || 90);
                travelTime = weight;
            }
            timeline.push({
                stationId: s.id, stationName: T_STATION(s.name),
                arrivalTime: currentTime, departureTime: currentTime + 30,
                color: s.color, lat: s.lat, lon: s.lon
            });
            currentTime += (travelTime + 30);
        });
        currentTime += (CONFIG.INTERCHANGE_TIME_MINUTES * 60);
    });
    return timeline;
}

function startSimulation(journey, useLiveLocation, startTimeOverride) {
    if (!journey) return;
    switchView('map-view');

    simulationState.isActive = true;
    simulationState.journeyId = journey.id;
    simulationState.timeline = generateTimeline(journey);

    sessionStorage.setItem('activeJourney', JSON.stringify(journey));

    renderLiveRoute(journey, document.getElementById('route-list'), simulationState);

    const lastPart = journey.parts[journey.parts.length - 1];
    const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';
    const totalMinutes = journey.totalTime ? Math.ceil(journey.totalTime / 60) : 0;

    const simStatus = document.getElementById('simulation-status');
    simStatus.innerHTML = `
        <div class="w-full flex justify-between items-start bg-card-subtle p-3 rounded-xl border border-subtle shadow-sm my-2">
            <div class="flex flex-col gap-0.5">
                <p class="font-bold text-primary text-sm flex items-center gap-2">
                    <i data-lucide="activity" class="w-3.5 h-3.5 text-green-400"></i>
                    ${T('liveJourney') || 'Live Journey'}
                </p>
                <p class="text-xs text-secondary font-medium">${T('towards')} ${destinationName}</p>
                <p class="text-[10px] text-secondary opacity-70">${totalMinutes} ${T('minRemaining')}</p>
            </div>
            <button id="exit-journey-btn" class="bg-card-subtle border border-subtle text-secondary font-medium px-3 py-1.5 rounded-md text-xs hover:text-indigo-400 transition-colors mt-0.5">${T('exitJourney')}</button>
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
    navigateToView('plan');
}

function handleJourneyUpdate() {
    const startVal = document.getElementById('start-station').value;
    const endVal = document.getElementById('end-station').value;
    if (startVal && endVal) {
        const j = calculateJourney(startVal, endVal);
        displayJourneyResult(j);
    }
}

// Calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function initializeApp() {
    // Initialize sections module with translation helpers
    initSections(() => currentLang, T, T_STATION);

    startDropdown = new CustomDropdown('start-station-dropdown', 'enterStart', 'start', (val) => {
        document.getElementById('start-station').value = val;
        handleJourneyUpdate();
    });

    endDropdown = new CustomDropdown('end-station-dropdown', 'enterEnd', 'end', (val) => {
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
        if (currentJourney) startSimulation(currentJourney, false);
    });

    const findNearestBtn = document.getElementById('find-nearest-btn');
    if (findNearestBtn) {
        findNearestBtn.addEventListener('click', () => {
            const subtitleEl = document.getElementById('find-nearest-subtitle');
            const iconWrap = findNearestBtn.querySelector('.w-12.h-12');
            const iconSvg = findNearestBtn.querySelector('svg');
            const originalText = subtitleEl ? subtitleEl.innerText : '';
            
            if (subtitleEl) subtitleEl.innerText = T('findingNearest') || 'Locating you...';
            if (iconWrap) iconWrap.classList.add('animate-pulse', 'ring-4', 'ring-indigo-500/30');
            if (iconSvg) iconSvg.classList.add('animate-bounce');
            
            if (navigator.geolocation) {
                // High accuracy can be slow, but it's "best"
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (iconWrap) iconWrap.classList.remove('animate-pulse', 'ring-4', 'ring-indigo-500/30');
                        if (iconSvg) iconSvg.classList.remove('animate-bounce');
                        
                        const { latitude, longitude } = position.coords;
                        
                        let nearest = null;
                        let minDistance = Infinity;
                        
                        stationsMeta.forEach(station => {
                            // FIX: Access nested location property
                            const loc = station.location || station; 
                            if (loc.lat && loc.lon) {
                                const dist = getDistanceFromLatLonInKm(latitude, longitude, loc.lat, loc.lon);
                                if (dist < minDistance) {
                                    minDistance = dist;
                                    nearest = station;
                                }
                            }
                        });
                        
                        if (nearest) {
                            startDropdown.selectById(nearest.id);
                            const translatedName = T_STATION(nearest.name);
                            const distStr = minDistance < 1 ? `${(minDistance * 1000).toFixed(0)}m` : `${minDistance.toFixed(1)}km`;
                            
                            if (subtitleEl) subtitleEl.innerText = `At ${translatedName} (${distStr})`;
                            setTimeout(() => { if (subtitleEl) subtitleEl.innerText = originalText; }, 5000);

                            // Top Toast
                            const toast = document.getElementById('nearest-toast');
                            const toastText = document.getElementById('nearest-toast-text');
                            if (toast && toastText) {
                                toastText.innerHTML = `<span class="text-indigo-400 font-bold">Nearest:</span> ${translatedName} <span class="opacity-60 text-[11px] ml-1">(${distStr})</span>`;
                                toast.classList.remove('-translate-y-[150%]', 'opacity-0');
                                toast.classList.add('translate-y-0', 'opacity-100');
                                setTimeout(() => {
                                    toast.classList.remove('translate-y-0', 'opacity-100');
                                    toast.classList.add('-translate-y-[150%]', 'opacity-0');
                                }, 4000);
                            }

                            // Modal
                            const modal = document.getElementById('nearest-modal');
                            const modalContent = document.getElementById('nearest-modal-content');
                            if (modal && modalContent) {
                                const stationNameEl = document.getElementById('nearest-modal-station-name');
                                const distanceEl = document.getElementById('nearest-modal-distance');
                                const lineBadge = `<span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background:${getLineColor(nearest.line)}"></span>`;
                                
                                if (stationNameEl) stationNameEl.innerHTML = `${lineBadge}${translatedName}`;
                                if (distanceEl) distanceEl.innerText = `~${distStr} away • ${nearest.line}`;
                                
                                modal.classList.remove('opacity-0', 'pointer-events-none');
                                modalContent.classList.remove('translate-y-10', 'sm:scale-95', 'opacity-0', 'pointer-events-none');
                                modalContent.classList.add('translate-y-0', 'sm:scale-100', 'opacity-100', 'pointer-events-auto');

                                const closeModal = () => {
                                    modal.classList.add('opacity-0', 'pointer-events-none');
                                    modalContent.classList.remove('translate-y-0', 'sm:scale-100', 'opacity-100', 'pointer-events-auto');
                                    modalContent.classList.add('translate-y-10', 'sm:scale-95', 'opacity-0', 'pointer-events-none');
                                };

                                document.getElementById('nearest-modal-close').onclick = closeModal;
                                document.getElementById('nearest-modal-cancel').onclick = closeModal;
                                document.getElementById('nearest-modal-maps').onclick = () => {
                                    const loc = nearest.location || nearest;
                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`, '_blank');
                                    closeModal();
                                };
                                if (window.lucide) window.lucide.createIcons();
                            }
                        }
                    },
                    (error) => {
                        console.error('Geolocation Error:', error);
                        if (iconWrap) iconWrap.classList.remove('animate-pulse', 'ring-4', 'ring-indigo-500/30');
                        if (iconSvg) iconSvg.classList.remove('animate-bounce');
                        
                        let errorMsg = 'Location access denied.';
                        if (error.code === 3) errorMsg = 'GPS Timeout. Try again.';
                        else if (error.code === 2) errorMsg = 'Position unavailable.';
                        
                        if (subtitleEl) subtitleEl.innerText = errorMsg;
                        setTimeout(() => { if (subtitleEl) subtitleEl.innerText = originalText; }, 3500);
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                if (iconWrap) iconWrap.classList.remove('animate-pulse', 'bg-indigo-500/30');
                if (subtitleEl) subtitleEl.innerText = 'GPS not supported.';
                setTimeout(() => { if (subtitleEl) subtitleEl.innerText = originalText; }, 3000);
            }
        });
    }

    // Init bottom nav
    initBottomNav();

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

    initTheme();

    if (window.lucide) window.lucide.createIcons();
}

// Start
document.addEventListener('DOMContentLoaded', initializeApp);
