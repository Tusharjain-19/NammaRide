import { metroData, translations, stationTranslations, lineNameMap } from './data/stations.js';
import { stationsMeta } from './data/stationsMeta.js';
import { CustomDropdown } from './ui/dropdown.js';
import { renderLiveRoute, updateRouteVisuals } from './ui/route.js';
import { calculateFare, calculateFareByHops, countStationHops } from './logic/pricing.js';
import { initSections, renderStationsList, renderStationDetail, renderTimings, renderSafety, renderExplore, renderExploreStation, renderPlaceDetail } from './ui/sections.js';
import { T, T_STATION, CONFIG, formatTime, getCurrentLang, setCurrentLang } from './utils/helpers.js';
import { stationPlaces } from './data/stationPlaces.js';
import { getStationGates } from './data/stationGates.js';
import { matchStation, scoreStation } from './utils/fuzzySearch.js';
import { StorageManager } from './utils/storageManager.js';
window.matchStation = matchStation;
window.scoreStation = scoreStation;
window.StorageManager = StorageManager;
// Standalone simulation module

// --- App State ---
let currentLang = getCurrentLang();
let startDropdown, endDropdown;
let currentJourney = null;
let activeView = 'plan';

// Storage Safety Guards
function safeStorageGet(storageType, key) {
    try {
        const store = storageType === 'session' ? window.sessionStorage : window.localStorage;
        return store ? store.getItem(key) : null;
    } catch (e) {
        console.warn(`[Storage] Cannot read ${key}:`, e);
        return null;
    }
}

function safeStorageSet(storageType, key, val) {
    try {
        const store = storageType === 'session' ? window.sessionStorage : window.localStorage;
        if (store) store.setItem(key, val);
    } catch (e) {
        console.warn(`[Storage] Cannot write ${key}:`, e);
    }
}

// Offline/Online Status Monitor
window.addEventListener('online', () => {
    console.log('[Network] Back online');
});
window.addEventListener('offline', () => {
    console.log('[Network] Running in Offline Mode');
});

// Tracks the status of the live journey simulation
const simulationState = { 
    isActive: false, 
    journeyId: null, 
    startTime: null, 
    lastLocationUpdateTime: 0, 
    locationWatcherId: null, 
    timeline: [], 
    animationFrameId: null, 
    lastStationIndex: -1,
    useGPS: false,
    gpsAccuracy: null,
    currentStationIndex: 0,
    arrivedAtDestination: false
};

// --- Theme Management ---
let currentThemeState = 'light';

function getLineColor(lineName) {
    if (lineName === 'Purple Line') return '#8B5CF6';
    if (lineName === 'Green Line') return '#22C55E';
    if (lineName === 'Yellow Line') return '#FBBF24';
    return '#6366F1';
}

function getInitialTheme() {
    try {
        const saved = localStorage.getItem('nammaride_theme')
            || localStorage.getItem('nammaride_app_theme')
            || localStorage.getItem('appTheme');
        if (saved === 'dark' || saved === 'light') {
            return saved;
        }
    } catch (e) {}

    return 'light';
}

function initTheme() {
    currentThemeState = getInitialTheme();
    applyTheme(currentThemeState);

    // Sync theme from React parent message updates
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NAMMARIDE_THEME_CHANGED' && event.data.theme) {
            currentThemeState = event.data.theme === 'dark' ? 'dark' : 'light';
            applyTheme(currentThemeState);
        }
    });
}

function applyTheme(theme) {
    const isLight = theme === 'light';
    currentThemeState = isLight ? 'light' : 'dark';
    
    if (typeof window.applyNammaTheme === 'function') {
        window.applyNammaTheme(currentThemeState);
    } else {
        const doc = document.documentElement;
        const body = document.body;

        if (isLight) {
            doc.classList.add('light', 'light-mode');
            doc.classList.remove('dark');
            doc.setAttribute('data-theme', 'light');
            if (body) {
                body.classList.add('light-mode');
                body.classList.remove('dark-mode');
            }
        } else {
            doc.classList.remove('light', 'light-mode');
            doc.classList.add('dark');
            doc.setAttribute('data-theme', 'dark');
            if (body) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
            }
        }
    }

    // Dynamic Mobile Status Bar Sync
    const metaThemeColor = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isLight ? '#E8EDF5' : '#000000');
    }

    // Non-blocking storage & postMessage sync across all keys
    try {
        localStorage.setItem('nammaride_theme', isLight ? 'light' : 'dark');
        localStorage.setItem('nammaride_app_theme', isLight ? 'light' : 'dark');
        localStorage.setItem('appTheme', isLight ? 'light' : 'dark');
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NAMMARIDE_THEME_SYNC', theme: isLight ? 'light' : 'dark' }, '*');
        }
    } catch (e) {}
}

// Cache for station lookup and routing graph
const precomputedData = { stations: {}, graph: {} };

// --- Translation Helpers (imported from utils/helpers.js) ---

// Allow global access for dropdowns
window.T_STATION = T_STATION;
window.T = T;
window.CONFIG = CONFIG;
window.navigateToView = navigateToView;

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
    if (typeof renderQuickCommutes === 'function') renderQuickCommutes();

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

    // Count station hops (actual stations traversed, not counting origin)
    const stationHops = countStationHops(startId, endId, metroData);

    const departureTime = getDepartureTime();
    const fareDetails = calculateFareByHops(stationHops, departureTime, 'TOKEN');

    return {
        id: `${startId}-${endId}`, parts: parts, totalTime: distances[endId],
        fare: fareDetails.finalFare, baseFare: fareDetails.baseFare,
        stationHops: stationHops,
        distanceKm: totalDistanceKm.toFixed(2), fareDetails: fareDetails, departureTime: departureTime
    };
}

function getDepartureTime() {
    const now = new Date();
    const coeff = 1000 * 60 * 5;
    return new Date(Math.ceil(now.getTime() / coeff) * coeff);
}

// --- Commuter Fast Planning & Favorites System ---
function getFavoriteRoutes() {
    return StorageManager.getFavoriteRoutes();
}

function saveFavoriteRoutes(favs) {
    return StorageManager.saveFavoriteRoutes(favs);
}

function isRouteFavorite(startId, endId) {
    return StorageManager.isRouteFavorite(startId, endId);
}

function toggleFavoriteRoute(startId, endId, startName, endName) {
    const isAdded = StorageManager.toggleFavoriteRoute(startId, endId, startName, endName);
    renderQuickCommutes();
    return isAdded;
}

function getRecentRoutes() {
    return StorageManager.getItem('nammaride_recent_routes', []);
}

function addRecentRoute(startId, endId, startName, endName) {
    if (!startId || !endId || startId === endId) return;
    try {
        let recents = getRecentRoutes();
        if (!Array.isArray(recents)) recents = [];
        recents = recents.filter(r => !(r.startId === startId && r.endId === endId));
        recents.unshift({ startId, endId, startName, endName, timestamp: Date.now() });
        if (recents.length > 4) recents = recents.slice(0, 4);
        StorageManager.setItem('nammaride_recent_routes', recents, 7 * 24 * 60 * 60 * 1000); // 7 days TTL
        renderQuickCommutes();
    } catch(e) {}
}

function selectQuickRoute(startId, endId) {
    if (!startDropdown || !endDropdown) return;
    startDropdown.selectById(startId);
    endDropdown.selectById(endId);
    handleJourneyUpdate();
    const summary = document.getElementById('journey-summary-container');
    if (summary) {
        summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ─── Real-Time Metro Rush Hours & Forecast Feature ───
function getMetroRushStatus() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5));
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const day = ist.getDay(); // 0 = Sun
    const timeVal = hours + minutes / 60;
    const isSunday = (day === 0);

    const timeFormatted = ist.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (timeVal < 5.0 || timeVal >= 23.5) {
        return {
            timeFormatted,
            status: 'closed',
            badgeText: 'Closed',
            badgeClass: 'bg-neutral-500/15 text-neutral-400 border border-neutral-500/25',
            dotClass: 'bg-neutral-400',
            title: 'Metro Service Closed',
            subtitle: 'Resumes 05:00 AM (07:00 AM Sundays)'
        };
    }

    if (isSunday) {
        return {
            timeFormatted,
            status: 'sunday',
            badgeText: 'Sunday Schedule',
            badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
            dotClass: 'bg-emerald-500',
            title: 'Sunday Leisure Schedule',
            subtitle: 'Trains every 8–10 mins across all lines'
        };
    }

    // Weekday Morning Peak: 8:30 AM to 10:30 AM
    if (timeVal >= 8.5 && timeVal <= 10.5) {
        return {
            timeFormatted,
            status: 'peak',
            badgeText: 'Morning Rush',
            badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
            dotClass: 'bg-amber-500 animate-pulse',
            title: 'Morning Peak Rush',
            subtitle: 'Trains every 3.5–4.5 mins • Expect Crowds'
        };
    }

    // Weekday Evening Peak: 5:00 PM to 8:30 PM
    if (timeVal >= 17.0 && timeVal <= 20.5) {
        return {
            timeFormatted,
            status: 'peak',
            badgeText: 'Evening Rush',
            badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
            dotClass: 'bg-amber-500 animate-pulse',
            title: 'Evening Peak Rush',
            subtitle: 'Trains every 3.5–5 mins • Busy Platforms'
        };
    }

    // Night Hours: 8:30 PM to 11:30 PM
    if (timeVal > 20.5 && timeVal < 23.5) {
        return {
            timeFormatted,
            status: 'night',
            badgeText: 'Night Service',
            badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25',
            dotClass: 'bg-indigo-400',
            title: 'Night Service Interval',
            subtitle: 'Trains every 8–10 mins • Last train 11:05 PM'
        };
    }

    // Normal daytime off-peak
    return {
        timeFormatted,
        status: 'normal',
        badgeText: 'Off-Peak',
        badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
        dotClass: 'bg-emerald-500 animate-pulse',
        title: 'Off-Peak Hours (Comfortable)',
        subtitle: 'Trains every 6–8 mins • Seating Available'
    };
}

function updateRushForecastUI() {
    const rushInfo = getMetroRushStatus();
    const dot = document.getElementById('rush-dot');
    const title = document.getElementById('rush-title');
    const badge = document.getElementById('rush-status-badge');
    const subtitle = document.getElementById('rush-subtitle');

    if (dot) dot.className = `w-2.5 h-2.5 rounded-full shrink-0 ${rushInfo.dotClass}`;
    if (title) title.textContent = rushInfo.title;
    if (badge) {
        badge.textContent = rushInfo.badgeText;
        badge.className = `text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${rushInfo.badgeClass}`;
    }
    if (subtitle) subtitle.textContent = rushInfo.subtitle;

    const modalTime = document.getElementById('rush-modal-current-time');
    const modalBadge = document.getElementById('rush-modal-current-badge');
    if (modalTime) modalTime.textContent = rushInfo.timeFormatted;
    if (modalBadge) {
        modalBadge.textContent = rushInfo.badgeText;
        modalBadge.className = `px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${rushInfo.badgeClass}`;
    }
}

function openRushScheduleModal() {
    updateRushForecastUI();
    const modal = document.getElementById('rush-schedule-modal');
    if (modal) {
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }
}

function closeRushScheduleModal() {
    const modal = document.getElementById('rush-schedule-modal');
    if (modal) modal.classList.add('hidden');
}

function openPassAdvisorModal() {
    const modal = document.getElementById('pass-advisor-modal');
    if (modal) {
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }
}

function closePassAdvisorModal() {
    const modal = document.getElementById('pass-advisor-modal');
    if (modal) modal.classList.add('hidden');
}

function initPopularStationChips() {
    document.querySelectorAll('.popular-station-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const stationName = btn.getAttribute('data-name');
            if (!stationName) return;

            const startVal = document.getElementById('start-station').value;
            const endVal = document.getElementById('end-station').value;

            if (!startVal) {
                if (startDropdown) startDropdown.selectByName(stationName);
            } else if (!endVal || startVal === endVal) {
                if (endDropdown) endDropdown.selectByName(stationName);
            } else {
                if (endDropdown) endDropdown.selectByName(stationName);
            }
            handleJourneyUpdate();
        });
    });
}

function renderQuickCommutes() {
    const container = document.getElementById('quick-commutes-chips');
    const wrapper = document.getElementById('quick-commutes-container');
    if (!container) return;

    const favs = getFavoriteRoutes();

    if (!favs || favs.length === 0) {
        if (wrapper) wrapper.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    if (wrapper) wrapper.classList.remove('hidden');

    let html = '';

    // Render only user-saved routes
    favs.forEach((fav) => {
        const sName = T_STATION(fav.startName);
        const eName = T_STATION(fav.endName);
        html += `
            <button type="button" class="quick-chip group shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-card-subtle hover:bg-card-hover border border-subtle hover:border-emerald-500/40 rounded-xl transition-all active:scale-95 shadow-sm" data-start="${fav.startId}" data-end="${fav.endId}" title="${sName} ➔ ${eName}">
                <i data-lucide="star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0"></i>
                <span class="text-xs font-bold text-primary truncate max-w-[120px]">${sName}</span>
                <span class="text-secondary opacity-40 text-xs font-bold">➔</span>
                <span class="text-xs font-bold text-primary truncate max-w-[120px]">${eName}</span>
            </button>
        `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.quick-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const startId = btn.getAttribute('data-start');
            const endId = btn.getAttribute('data-end');
            selectQuickRoute(startId, endId);
        });
    });

    if (window.lucide) window.lucide.createIcons();
}

let passengerCount = 1;

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

    const firstStation = journey.parts[0]?.stations[0];
    const lastPart = journey.parts[journey.parts.length - 1];
    const lastStation = lastPart?.stations[lastPart.stations.length - 1];
    const startName = firstStation ? T_STATION(firstStation.name) : '';
    const endName = lastStation ? T_STATION(lastStation.name) : '';
    const startId = firstStation ? firstStation.id : '';
    const endId = lastStation ? lastStation.id : '';

    const parts = journey.parts || [];
    const interchangeCount = Math.max(0, parts.length - 1);

    // Build Line Badges
    const lineBadges = parts.map(p => {
        const lk = p.stations[0]?.lineKey || 'purple';
        let bg = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        let dot = 'bg-purple-400';
        let lineLabel = 'Purple Line';
        if (lk === 'green') {
            bg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            dot = 'bg-emerald-400';
            lineLabel = 'Green Line';
        } else if (lk === 'yellow') {
            bg = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            dot = 'bg-amber-400';
            lineLabel = 'Yellow Line';
        }
        return `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${bg} shadow-sm shrink-0 whitespace-nowrap">
                <span class="w-1.5 h-1.5 rounded-full ${dot}"></span>
                <span>${lineLabel}</span>
            </span>
        `;
    }).join(`<i data-lucide="arrow-right" class="w-3.5 h-3.5 text-secondary opacity-50 shrink-0"></i>`);

    // Transfer text - clean, concise, 1-line
    let transferNotice = '';
    if (interchangeCount === 0) {
        transferNotice = `<span class="text-emerald-500 font-bold flex items-center gap-1 shrink-0 text-[11px]"><i data-lucide="check" class="w-3 h-3"></i> Direct Train</span>`;
    } else {
        const rawInterchange = parts[1]?.stations[0]?.name ? T_STATION(parts[1].stations[0].name) : 'Majestic';
        const cleanInterchange = (rawInterchange.toLowerCase().includes('majestic') || rawInterchange.toLowerCase().includes('kempegowda')) ? 'Majestic' : rawInterchange;
        transferNotice = `<span class="text-amber-500 font-bold flex items-center gap-1 shrink-0 text-[11px]"><i data-lucide="arrow-right-left" class="w-3 h-3"></i> ${interchangeCount} Transfer • ${cleanInterchange}</span>`;
    }

    const startPlatform = parts[0]?.startPlatform || 1;
    const journeyDir = parts[0]?.journeyDirectionName || '';

    const updateSummaryUI = () => {
        const totalFareAmount = journey.fare * passengerCount;
        const isFav = isRouteFavorite(startId, endId);

        summaryText.innerHTML = `
            <!-- Top Header with Route Title & Star Bookmark -->
            <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-subtle">
                <div class="flex flex-col min-w-0 pr-2">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-secondary opacity-70">Calculated Metro Route</span>
                    <h3 class="text-base font-extrabold text-primary flex items-center gap-1.5 truncate">
                        <span class="truncate">${startName}</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-secondary opacity-50 shrink-0"></i>
                        <span class="truncate">${endName}</span>
                    </h3>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button id="toggle-fav-btn" type="button" class="w-8 h-8 rounded-xl flex items-center justify-center bg-card-subtle hover:bg-card-hover border border-subtle active:scale-90 transition-all shadow-sm shrink-0" title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                        <i data-lucide="star" class="w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-secondary hover:text-amber-400'}"></i>
                    </button>
                    <button id="clear-route-btn" type="button" class="w-8 h-8 rounded-xl flex items-center justify-center bg-card-subtle hover:bg-card-hover text-secondary hover:text-red-500 border border-subtle active:scale-90 transition-all shadow-sm shrink-0" title="Clear Route / Back to Home">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Time & Fare Row with Smart Card 5% Discount -->
            <div class="flex justify-between items-end mb-2">
                <div>
                    <p class="text-[11px] text-secondary uppercase tracking-wide font-bold">${T('totalTime')}</p>
                    <p class="text-2xl font-extrabold text-primary tracking-tight">${formattedTime}</p>
                </div>
                <div class="text-right">
                    <p class="text-[11px] text-secondary uppercase tracking-wide font-bold">${T('estFare')}</p>
                    <div class="flex items-baseline justify-end gap-1.5">
                        <span class="text-2xl font-extrabold text-emerald-400 tracking-tight">₹${journey.fare}</span>
                        <span class="text-xs text-secondary opacity-70 font-normal">token</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-0.5 justify-end">
                        <i data-lucide="credit-card" class="w-3 h-3"></i>
                        <span>Smart Card: ₹${(journey.fare * 0.95).toFixed(journey.fare * 0.95 % 1 === 0 ? 0 : 1)} (5% OFF)</span>
                    </div>
                </div>
            </div>

            <!-- Pass & Card Savings Advisor Trigger -->
            <button id="view-pass-advisor-btn" type="button" class="w-full mb-2.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-between text-xs transition-all active:scale-[0.98] group">
                <div class="flex items-center gap-1.5">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500 shrink-0"></i>
                    <span class="font-extrabold text-primary text-[11px]">Compare 1-Day Pass & Card Savings</span>
                </div>
                <span class="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] flex items-center gap-0.5">
                    <span>Advisor</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"></i>
                </span>
            </button>

            <!-- Route Badges & Stations Strip (Strict 1-Line Layout) -->
            <div class="p-2.5 bg-card-subtle/70 rounded-xl border border-subtle mb-2.5 flex flex-col gap-1.5 overflow-hidden">
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
                    ${lineBadges}
                </div>
                <div class="flex items-center justify-between text-xs pt-1 border-t border-subtle/50 text-secondary whitespace-nowrap overflow-hidden gap-1">
                    <span class="font-bold text-primary flex items-center gap-1 shrink-0 text-[11px]">
                        <i data-lucide="map-pin" class="w-3 h-3 text-secondary shrink-0"></i>
                        <span>${journey.stationHops} Stops • ${journey.distanceKm || '0'} km</span>
                    </span>
                    <span class="truncate text-right font-medium shrink-0">${transferNotice}</span>
                </div>
            </div>

            <!-- Boarding Platform & Next Train Strip (Strict 1-Line) -->
            <div class="grid grid-cols-2 gap-2 mb-2.5">
                <div class="flex flex-col bg-[var(--bg-card-hover)] p-2 rounded-xl border border-[var(--border-color)] justify-between overflow-hidden">
                    <span class="text-[9px] text-secondary uppercase tracking-wider font-bold truncate">Platform & Direction</span>
                    <div class="flex items-center gap-1 mt-0.5 whitespace-nowrap overflow-hidden">
                        <span class="platform-pill text-[9px] py-0.5 px-1.5 font-black shrink-0">P${startPlatform}</span>
                        <span class="text-xs font-bold text-primary truncate" title="${journeyDir}">${journeyDir}</span>
                    </div>
                </div>
                <div class="flex flex-col bg-[var(--bg-card-hover)] p-2 rounded-xl border border-[var(--border-color)] justify-between overflow-hidden">
                    <span class="text-[9px] text-secondary uppercase tracking-wider font-bold truncate">${T('nextTrain')}</span>
                    <span class="text-xs font-bold text-emerald-500 dark:text-emerald-400 mt-0.5 whitespace-nowrap">${formatTime(journey.departureTime)}</span>
                </div>
            </div>

            <!-- Women's Coach Compact 1-Liner with Instant Emergency SOS (Strict Single Line) -->
            <div class="mb-2 py-1 px-2.5 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-between gap-1.5 text-[11px] text-pink-600 dark:text-pink-400 font-bold whitespace-nowrap overflow-hidden">
                <div class="flex items-center gap-1.5 truncate">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 shrink-0 text-pink-500"></i>
                    <span class="truncate">Coach 1: Women's Reserved (Front)</span>
                </div>
                <a href="tel:1091" class="shrink-0 px-2 py-0.5 rounded-lg bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-black text-[10px] flex items-center gap-1 shadow-sm transition-all" title="Call 1091 Women Helpline">
                    <i data-lucide="phone-call" class="w-2.5 h-2.5"></i>
                    <span>SOS 1091</span>
                </a>
            </div>

            <!-- WhatsApp Ticket Booking Card -->
            <div class="mt-1 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2.5">
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-primary uppercase tracking-wider">${T('passengers') || 'Passengers'}</span>
                        <span class="text-xs text-emerald-500 dark:text-emerald-400 font-extrabold mt-0.5">Total: ₹${totalFareAmount}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-white dark:bg-neutral-900 px-2.5 py-1 rounded-xl border border-emerald-500/30 shadow-sm">
                        <button id="p-minus-btn" type="button" class="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-sm hover:bg-emerald-500 hover:text-white transition-all active:scale-95">-</button>
                        <span class="font-extrabold text-sm text-primary w-5 text-center">${passengerCount}</span>
                        <button id="p-plus-btn" type="button" class="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-sm hover:bg-emerald-500 hover:text-white transition-all active:scale-95">+</button>
                    </div>
                </div>

                <button id="whatsapp-book-btn" type="button" class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-wider">
                    <svg class="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.198 8.198 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43-.15-.01-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/>
                    </svg>
                    <span>Book Ticket on WhatsApp</span>
                </button>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        // Favorite Button listener
        const favBtn = document.getElementById('toggle-fav-btn');
        if (favBtn) {
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const rawStart = firstStation ? firstStation.name : startName;
                const rawEnd = lastStation ? lastStation.name : endName;
                const added = toggleFavoriteRoute(startId, endId, rawStart, rawEnd);
                updateSummaryUI();
                const toast = document.getElementById('toast');
                if (toast) {
                    toast.innerHTML = `<div class="font-bold text-xs ${added ? 'text-amber-400' : 'text-secondary'} flex items-center gap-1.5"><i data-lucide="${added ? 'star' : 'trash-2'}" class="w-3.5 h-3.5"></i> ${added ? 'Route saved to Quick Favorites!' : 'Removed from Favorites'}</div>`;
                    toast.style.opacity = '1';
                    if (window.lucide) window.lucide.createIcons();
                    setTimeout(() => { toast.style.opacity = '0'; }, 2200);
                }
            });
        }

        // Clear Route / Back to Home listener
        const clearRouteBtn = document.getElementById('clear-route-btn');
        if (clearRouteBtn) {
            clearRouteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetPlannerToHome();
            });
        }

        // Pass & Card Advisor listener
        const passAdvisorBtn = document.getElementById('view-pass-advisor-btn');
        if (passAdvisorBtn) {
            passAdvisorBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPassAdvisorModal();
            });
        }

        // Event listeners for passenger counter
        const minusBtn = document.getElementById('p-minus-btn');
        const plusBtn = document.getElementById('p-plus-btn');
        const waBookBtn = document.getElementById('whatsapp-book-btn');

        if (minusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (passengerCount > 1) {
                    passengerCount--;
                    updateSummaryUI();
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (passengerCount < 6) {
                    passengerCount++;
                    updateSummaryUI();
                }
            });
        }

        if (waBookBtn) {
            waBookBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const cleanStationName = (name) => {
                    if (!name) return '';
                    return name.replace(/\s*\([^)]*\)/g, '').trim();
                };

                const rawStart = firstStation ? firstStation.name : startName;
                const rawEnd = lastStation ? lastStation.name : endName;
                const startClean = cleanStationName(rawStart);
                const endClean = cleanStationName(rawEnd);

                // Auto-copy station details to clipboard as fallback helper
                const copyText = `${startClean} to ${endClean}`;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(copyText).catch(err => console.log('Copy ignored:', err));
                }

                // Official BMRCL Chatbot WhatsApp command format
                const waPhone = "918105556677";
                const waMsg = `Hi, I would like to book a ticket from ${startClean} to ${endClean} for ${passengerCount} person(s).`;
                const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;
                
                window.open(waUrl, '_blank');
            });
        }
    };

    updateSummaryUI();

    boardBtn.classList.remove('hidden');
    if (window.innerWidth < 640) {
        boardBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ─── Instant View Switching (0ms Delay, Bulletproof State) ───
let currentVisibleViewId = 'planner-view';

function switchView(viewId) {
    const allViews = [
        'planner-view',
        'map-view',
        'stations-view',
        'timings-view',
        'explore-view',
        'safety-view',
        'not-found-view'
    ];

    allViews.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === viewId) {
                el.classList.remove('hidden', 'view-exiting', 'view-entering');
                el.style.display = 'flex';
                el.style.flexDirection = 'column';
                el.classList.add('view-active');
                el.scrollTop = 0;
            } else {
                el.classList.add('hidden');
                el.style.display = 'none';
                el.classList.remove('view-active', 'view-entering', 'view-exiting');
            }
        }
    });

    currentVisibleViewId = viewId;

    // Handle map-view simulation bottom nav visibility
    const bottomNav = document.getElementById('bottom-nav');
    if (viewId === 'map-view') {
        if (bottomNav) bottomNav.style.display = 'none';
    } else {
        if (bottomNav) {
            bottomNav.style.display = 'flex';
            bottomNav.classList.remove('nav-hidden');
        }
    }

    if (viewId === 'planner-view') {
        simulationState.isActive = false;
        if (simulationState.animationFrameId) cancelAnimationFrame(simulationState.animationFrameId);
    }
}

// ─── Instant Bottom Navigation (Fast Click & Drag/Slide to Select) ───
function updateNavIndicator() {
    const activeBtn = document.querySelector('.nav-item.active');
    const indicator = document.getElementById('nav-indicator');
    if (!activeBtn || !indicator) return;

    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;

    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
}

let lastNavTimestamp = 0;
function safeNavigateToView(view) {
    if (!view) return;
    const now = Date.now();
    if (now - lastNavTimestamp < 220) return;
    lastNavTimestamp = now;
    navigateToView(view);
}

function initBottomNav() {
    const bottomNav = document.getElementById('bottom-nav');
    const navItems = document.querySelectorAll('.nav-item');
    if (!bottomNav) return;

    // Direct, 100% Reliable Click & Tap on Every Nav Item
    navItems.forEach(item => {
        // Fast click handler
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) {
                safeNavigateToView(view);
            }
        });

        // Instant visual feedback on touch start
        item.addEventListener('pointerdown', () => {
            item.classList.add('is-pressed');
            const indicator = document.getElementById('nav-indicator');
            if (indicator) {
                indicator.style.transform = `translateX(${item.offsetLeft}px)`;
                indicator.style.width = `${item.offsetWidth}px`;
            }
        });

        item.addEventListener('pointerup', () => {
            item.classList.remove('is-pressed');
        });

        item.addEventListener('pointercancel', () => {
            item.classList.remove('is-pressed');
        });
    });

    // Drag / Slide gesture across the bottom nav bar to select buttons
    let isNavSliding = false;
    let lastHoveredView = null;
    let startX = 0;

    const findViewAtPoint = (x, y) => {
        const el = document.elementFromPoint(x, y);
        const navBtn = el ? el.closest('.nav-item') : null;
        return navBtn ? { view: navBtn.dataset.view, el: navBtn } : null;
    };

    bottomNav.addEventListener('touchstart', (e) => {
        if (!e.touches || !e.touches[0]) return;
        const touch = e.touches[0];
        startX = touch.clientX;
        isNavSliding = false;
        const target = findViewAtPoint(touch.clientX, touch.clientY);
        if (target) {
            lastHoveredView = target.view;
        }
    }, { passive: true });

    bottomNav.addEventListener('touchmove', (e) => {
        if (!e.touches || !e.touches[0]) return;
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - startX);
        if (dx > 8) {
            isNavSliding = true;
        }

        const target = findViewAtPoint(touch.clientX, touch.clientY);
        if (target) {
            lastHoveredView = target.view;
            const indicator = document.getElementById('nav-indicator');
            if (indicator) {
                indicator.style.transform = `translateX(${target.el.offsetLeft}px)`;
                indicator.style.width = `${target.el.offsetWidth}px`;
            }
            navItems.forEach(n => {
                if (n === target.el) {
                    n.classList.add('is-pressed');
                } else {
                    n.classList.remove('is-pressed');
                }
            });
        }
    }, { passive: true });

    bottomNav.addEventListener('touchend', (e) => {
        navItems.forEach(n => n.classList.remove('is-pressed'));
        if (isNavSliding && lastHoveredView) {
            safeNavigateToView(lastHoveredView);
        } else {
            const touch = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : null;
            if (touch) {
                const target = findViewAtPoint(touch.clientX, touch.clientY);
                if (target && target.view) {
                    safeNavigateToView(target.view);
                }
            }
        }
        isNavSliding = false;
        lastHoveredView = null;
    }, { passive: true });

    bottomNav.addEventListener('touchcancel', () => {
        navItems.forEach(n => n.classList.remove('is-pressed'));
        isNavSliding = false;
        lastHoveredView = null;
    }, { passive: true });

    window.addEventListener('resize', updateNavIndicator);
    setTimeout(updateNavIndicator, 60);

    // ─── Scroll Down Vanish, Scroll Up Show, and 3-Second Auto-Vanish ───
    let lastScrollY = 0;
    let navVanishTimer = null;

    window.showBottomNav = function(startVanishCountdown = true) {
        if (activeView === 'map-view') return;
        bottomNav.classList.remove('nav-hidden');
        clearTimeout(navVanishTimer);
        if (startVanishCountdown) {
            navVanishTimer = setTimeout(() => {
                if (bottomNav && !isNavSliding && activeView !== 'map-view') {
                    bottomNav.classList.add('nav-hidden');
                }
            }, 3000);
        }
    };

    window.hideBottomNav = function() {
        clearTimeout(navVanishTimer);
        bottomNav.classList.add('nav-hidden');
    };

    const handleScroll = (e) => {
        const target = e.target;
        let currentScrollY = 0;
        if (target && typeof target.scrollTop === 'number' && target.scrollTop > 0) {
            currentScrollY = target.scrollTop;
        } else {
            currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        }

        const diff = currentScrollY - lastScrollY;

        // Ignore tiny jitter
        if (Math.abs(diff) < 5) return;

        if (diff > 0 && currentScrollY > 25) {
            // Scrolling down -> vanish immediately
            window.hideBottomNav();
        } else if (diff < 0) {
            // Moving / scrolling up -> show and after 3 sec vanish
            window.showBottomNav(true);
        }

        lastScrollY = currentScrollY;
    };

    // Attach scroll listener to all section views AND capture on window/document
    document.querySelectorAll('.section-view').forEach(view => {
        view.addEventListener('scroll', handleScroll, { passive: true });
    });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    // Also reveal nav if user taps or interacts near the bottom, and auto-vanish after 3s
    window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0].clientY > window.innerHeight - 85) {
            window.showBottomNav(true);
        }
    }, { passive: true });
}

function navigateToView(view) {
    if (!view) return;

    const targetViewId = view === 'plan' ? 'planner-view' : `${view}-view`;

    // Smoothly scroll to top ONLY if already visibly on this exact target view
    if (activeView === view && currentVisibleViewId === targetViewId) {
        const curEl = document.getElementById(currentVisibleViewId);
        if (curEl) {
            curEl.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (window.showBottomNav) window.showBottomNav(true);
        return;
    }

    activeView = view;

    // Send view change notification to React parent page
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'NAMMARIDE_VIEW_CHANGED', view: view }, '*');
        }
    } catch (e) {
        console.warn("[NammaRide Simulator] parent notification failed:", e);
    }

    // Reveal nav when switching tab and start 3s timer
    if (window.showBottomNav) {
        window.showBottomNav(true);
    }

    // Update active nav state immediately
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.remove('active', 'is-pressed');
    });
    const activeBtn = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        updateNavIndicator();
    }

    // Show the correct view with 0ms delay
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
    } else {
        switchView('not-found-view');
        if (window.lucide) window.lucide.createIcons();
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
    activeView = 'map';
    switchView('map-view');

    const simStatus = document.getElementById('simulation-status');
    if (simStatus) {
        simStatus.className = 'sticky top-0 z-40 w-full';
        simStatus.classList.remove('hidden');
    }

    simulationState.isActive = true;
    simulationState.journeyId = journey.id;
    simulationState.timeline = generateTimeline(journey);
    simulationState.startTime = startTimeOverride || Date.now();
    simulationState.currentStationIndex = 0;
    simulationState.arrivedAtDestination = false;
    simulationState.gpsAccuracy = null;
    simulationState.useGPS = false;

    sessionStorage.setItem('activeJourney', JSON.stringify(journey));
    sessionStorage.setItem('simulationState', JSON.stringify({
        isActive: simulationState.isActive,
        journeyId: simulationState.journeyId,
        startTime: simulationState.startTime,
        useGPS: simulationState.useGPS
    }));

    renderLiveRoute(journey, document.getElementById('route-list'), simulationState);
    updateSimulationUI();

    // Geolocation high-accuracy watch position
    if (navigator.geolocation) {
        simulationState.locationWatcherId = navigator.geolocation.watchPosition(
            (position) => {
                onGPSUpdate(position);
            },
            (error) => {
                console.warn("GPS simulation watch error:", error);
                simulationState.useGPS = false;
                updateSimulationUI();
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        simulationState.useGPS = false;
    }

    // Animation loop heartbeat to keep times and views synchronized
    if (simulationState.animationFrameId) cancelAnimationFrame(simulationState.animationFrameId);

    function tick() {
        if (!simulationState.isActive) return;
        updateSimulationUI();
        simulationState.animationFrameId = requestAnimationFrame(tick);
    }
    simulationState.animationFrameId = requestAnimationFrame(tick);
}

function triggerStationAlarm(stationName, isUnderground) {
    if (simulationState.alarmTriggered) return;
    simulationState.alarmTriggered = true;

    // Vibration feedback only (800ms pulse, 300ms pause, 800ms pulse)
    if (navigator.vibrate) {
        try { navigator.vibrate([800, 300, 800, 300, 800]); } catch (e) {}
    }

    // Banner toast notification
    const toast = document.getElementById('toast');
    if (toast) {
        let msg = `⚡ Arriving at ${stationName} soon!`;
        if (isUnderground) {
            msg += ` (Note: Underground section ahead - GPS signal may drop)`;
        }
        toast.innerHTML = `<div class="font-bold text-amber-400 text-xs">${msg}</div>`;
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 6000);
    }
}

function onGPSUpdate(position) {
    if (!simulationState.isActive) return;

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    simulationState.useGPS = true;
    simulationState.gpsAccuracy = accuracy;

    const timeline = simulationState.timeline;
    let closestIndex = simulationState.currentStationIndex;
    let minDistance = Infinity;

    // Match closest next station coordinates
    for (let i = simulationState.currentStationIndex; i < timeline.length; i++) {
        const station = stationsMeta.find(s => s.id === timeline[i].stationId);
        if (station) {
            const loc = station.location || station;
            if (loc.lat && loc.lon) {
                const dist = getDistanceFromLatLonInKm(lat, lon, loc.lat, loc.lon);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestIndex = i;
                }
            }
        }
    }

    // Check target destination alarm (1-2 stations before arrival or ~5 min before)
    const destIndex = timeline.length - 1;
    const destNode = timeline[destIndex];
    const destStation = stationsMeta.find(s => s.id === destNode.stationId);

    if (destIndex - closestIndex <= 2 && closestIndex < destIndex) {
        const isUnderground = destStation && destStation.type === 'Underground';
        triggerStationAlarm(T_STATION(destNode.stationName), isUnderground);
    }

    // Auto arrival: if within 500m of destination
    if (destStation) {
        const loc = destStation.location || destStation;
        if (loc.lat && loc.lon) {
            const destDist = getDistanceFromLatLonInKm(lat, lon, loc.lat, loc.lon);
            if (destDist <= 0.5) {
                closestIndex = destIndex;
            }
        }
    }

    if (closestIndex > simulationState.currentStationIndex) {
        simulationState.currentStationIndex = closestIndex;
    }

    updateSimulationUI();
}

function updateSimulationUI() {
    if (!simulationState.isActive) return;

    const journey = JSON.parse(sessionStorage.getItem('activeJourney'));
    if (!journey) return;

    const lastPart = journey.parts[journey.parts.length - 1];
    const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';

    const status = updateRouteVisuals(simulationState);

    if (status.arrived && !simulationState.arrivedAtDestination) {
        simulationState.arrivedAtDestination = true;
        showJourneyComplete(destinationName);
        return;
    }

    let remainingMinutes = 0;
    const timeline = simulationState.timeline;
    if (simulationState.useGPS) {
        const stationsLeft = (timeline.length - 1) - simulationState.currentStationIndex;
        remainingMinutes = Math.max(0, stationsLeft * 2);
    } else {
        const elapsedTime = (Date.now() - simulationState.startTime) / 1000;
        const totalSeconds = journey.totalTime || 0;
        remainingMinutes = Math.max(0, Math.ceil((totalSeconds - elapsedTime) / 60));
    }

    // GPS indicator color state
    let gpsClass = 'red';
    let gpsTitle = T('locationDenied') || 'GPS Off';

    if (simulationState.useGPS && simulationState.gpsAccuracy !== null) {
        if (simulationState.gpsAccuracy < 100) {
            gpsClass = 'green';
            gpsTitle = `GPS Signal: Good (${Math.round(simulationState.gpsAccuracy)}m)`;
        } else if (simulationState.gpsAccuracy < 500) {
            gpsClass = 'yellow';
            gpsTitle = `GPS Signal: Fair (${Math.round(simulationState.gpsAccuracy)}m)`;
        } else {
            gpsClass = 'red';
            gpsTitle = `GPS Signal: Weak (${Math.round(simulationState.gpsAccuracy)}m)`;
        }
    }

    const simStatus = document.getElementById('simulation-status');
    if (!simStatus) return;
    simStatus.className = 'sticky top-0 z-40 w-full';
    simStatus.classList.remove('hidden');

    // Bind event delegation ONCE for bulletproof click handler support
    if (!simStatus.dataset.listenersBound) {
        simStatus.dataset.listenersBound = 'true';
        simStatus.addEventListener('click', (e) => {
            const finishBtn = e.target.closest('#manual-finish-btn');
            const exitBtn = e.target.closest('#exit-journey-btn, #map-back-home-btn, #map-end-trip-btn');
            const doneBtn = e.target.closest('#done-celebrate-btn');
            const exploreBtn = e.target.closest('#explore-nearby-celebrate-btn');

            if (finishBtn) {
                e.preventDefault();
                e.stopPropagation();
                const journey = JSON.parse(sessionStorage.getItem('activeJourney'));
                const lastPart = journey?.parts[journey.parts.length - 1];
                const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';
                simulationState.currentStationIndex = simulationState.timeline.length - 1;
                simulationState.arrivedAtDestination = true;
                showJourneyComplete(destinationName);
            } else if (exitBtn || doneBtn) {
                e.preventDefault();
                e.stopPropagation();
                resetPlannerToHome();
            } else if (exploreBtn) {
                e.preventDefault();
                e.stopPropagation();
                const journey = JSON.parse(sessionStorage.getItem('activeJourney'));
                const lastPart = journey?.parts[journey.parts.length - 1];
                const destinationName = lastPart ? T_STATION(lastPart.stations[lastPart.stations.length - 1].name) : '';
                if (window.showNearbyAttractions) {
                    window.showNearbyAttractions(destinationName);
                }
            }
        });
    }

    // Skip DOM recreation if values haven't changed
    const stateKey = `${simulationState.currentStationIndex}_${remainingMinutes}_${gpsClass}_${destinationName}_${simulationState.arrivedAtDestination}`;
    if (simStatus.dataset.lastStateKey === stateKey) {
        return;
    }
    simStatus.dataset.lastStateKey = stateKey;

    const showManualFinish = !simulationState.useGPS || (simulationState.gpsAccuracy !== null && simulationState.gpsAccuracy > 500);

    let gpsWarningHtml = '';
    if (showManualFinish) {
        gpsWarningHtml = `
            <div class="gps-warning-banner py-1 px-3 text-[10px] bg-amber-500/10 border-b border-amber-500/20 text-amber-500 flex items-center justify-center gap-1.5">
                <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-500 shrink-0"></i>
                <span>${T('gpsWeak') || 'GPS signal is weak. Manual override available.'}</span>
            </div>
        `;
    }

    simStatus.innerHTML = `
        <div class="w-full flex items-center justify-between p-2.5 px-3.5 bg-card/95 backdrop-blur-md border-b border-subtle shadow-sm gap-2">
            <!-- Left: Home / Exit Button -->
            <button id="exit-journey-btn" type="button" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-subtle hover:bg-card-hover border border-subtle text-primary font-extrabold text-xs active:scale-95 transition-all shrink-0" title="Exit Trip & Back to Home">
                <i data-lucide="arrow-left" class="w-4 h-4 text-emerald-500"></i>
                <span>Home / Exit</span>
            </button>

            <!-- Center: Live Destination & Minutes -->
            <div class="flex flex-col items-center justify-center min-w-0 px-1 text-center truncate">
                <div class="flex items-center gap-1.5 min-w-0 justify-center">
                    <span class="text-xs sm:text-sm font-black uppercase tracking-wider text-primary truncate">${destinationName}</span>
                    <span class="gps-signal-dot ${gpsClass} shrink-0" title="${gpsTitle}"></span>
                </div>
                <div class="flex items-center gap-1 text-[10px] text-secondary font-semibold justify-center">
                    <i data-lucide="clock" class="w-3 h-3 text-emerald-500 shrink-0"></i>
                    <span>${remainingMinutes} min remaining</span>
                </div>
            </div>

            <!-- Right: Finish Button -->
            <button id="manual-finish-btn" type="button" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all shrink-0" title="Complete Trip & View Gates">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                <span>Finish</span>
            </button>
        </div>
        ${gpsWarningHtml}
    `;

    if (window.lucide) window.lucide.createIcons();
}

function showJourneyComplete(destinationName) {
    if (navigator.vibrate) {
        try { navigator.vibrate([1000, 500, 1000, 500, 1000]); } catch (e) {}
    }
    if (simulationState.locationWatcherId) {
        navigator.geolocation.clearWatch(simulationState.locationWatcherId);
        simulationState.locationWatcherId = null;
    }
    if (simulationState.animationFrameId) {
        cancelAnimationFrame(simulationState.animationFrameId);
        simulationState.animationFrameId = null;
    }

    let destinationId = '';
    if (currentJourney && currentJourney.parts && currentJourney.parts.length > 0) {
        const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
        const lastSt = lastPart?.stations?.[lastPart.stations.length - 1];
        destinationId = lastSt?.id || '';
    }

    openDestinationHubModal(destinationId, destinationName, 'places');
}

function openDestinationHubModal(stationId, stationName, activeTab = 'places') {
    const modal = document.getElementById('station-gates-modal');
    const content = document.getElementById('station-gates-modal-content');
    if (!modal || !content) return;

    const cleanStationName = T_STATION(stationName || 'Metro Station');

    // Look up places with fuzzy matching
    let places = stationPlaces[stationName] || [];
    if (!places.length) {
        const cleanKey = (stationName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const foundKey = Object.keys(stationPlaces).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKey);
        if (foundKey) places = stationPlaces[foundKey];
    }

    // Look up gates
    const gates = getStationGates(stationId, stationName);

    content.innerHTML = `
        <!-- Sticky Header (Adaptive Light/Dark Theme) -->
        <div class="destination-hub-header p-3 px-4 border-b flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2.5 min-w-0 pr-2">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <i data-lucide="check" class="w-4 h-4 font-black"></i>
                </div>
                <div class="flex flex-col min-w-0">
                    <span class="text-[9px] uppercase font-black tracking-widest text-emerald-500">Journey Complete</span>
                    <h3 class="text-sm sm:text-base font-extrabold truncate text-primary">${cleanStationName}</h3>
                </div>
            </div>
            <button id="close-hub-modal-btn" type="button" class="w-8 h-8 rounded-xl bg-card-subtle hover:bg-card-hover border border-subtle flex items-center justify-center text-secondary hover:text-primary shrink-0 active:scale-95 transition-all" title="Close & Finish">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>

        <!-- Segmented Tab Navigation Bar -->
        <div class="flex items-center border-b border-subtle px-3 shrink-0 bg-card">
            <button id="hub-tab-places-btn" class="hub-tab-btn flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${activeTab === 'places' ? 'active' : ''}">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                <span>Nearby Places (${places.length})</span>
            </button>
            <button id="hub-tab-gates-btn" class="hub-tab-btn flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${activeTab === 'gates' ? 'active' : ''}">
                <i data-lucide="door-open" class="w-3.5 h-3.5"></i>
                <span>Exit Gates & Guide (${gates.length})</span>
            </button>
        </div>

        <!-- Scrollable Tab Content Container -->
        <div class="destination-hub-body flex-1 overflow-y-auto p-3.5 pb-24 space-y-3 custom-scrollbar">
            ${activeTab === 'places' ? `
                <!-- TAB 1: NEARBY PLACES TO DESTINATION -->
                <div class="space-y-2.5">
                    <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2 text-xs text-primary">
                        <i data-lucide="sparkles" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                        <span>Top attractions, transit links & landmarks near <strong>${cleanStationName}</strong>.</span>
                    </div>

                    ${places.length > 0 ? places.map(p => `
                        <div class="destination-hub-subcard p-3 rounded-2xl flex items-center justify-between gap-2.5 transition-all">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 font-black text-xs">
                                    <i data-lucide="${p.type === 'Shopping' ? 'shopping-bag' : p.type === 'Transit' ? 'bus' : p.type === 'Hospital' ? 'cross' : 'map-pin'}" class="w-5 h-5"></i>
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-xs sm:text-sm font-extrabold truncate text-primary">${p.name}</h4>
                                    <div class="flex items-center gap-2 mt-0.5 text-[10px] text-secondary">
                                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">${p.type}</span>
                                        <span>•</span>
                                        <span>${p.distance_km || '0.3'} km (${p.walk_time_min || '4'} min walk)</span>
                                    </div>
                                </div>
                            </div>
                            <a href="${p.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + cleanStationName)}`}" target="_blank" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-card-subtle hover:bg-card-hover border border-subtle text-[11px] font-bold text-primary flex items-center gap-1 active:scale-95 transition-all">
                                <span>Directions</span>
                                <i data-lucide="arrow-up-right" class="w-3 h-3 text-secondary"></i>
                            </a>
                        </div>
                    `).join('') : `
                        <div class="destination-hub-subcard p-6 rounded-2xl text-center text-xs text-secondary">
                            <i data-lucide="compass" class="w-8 h-8 text-secondary mx-auto mb-2 opacity-50"></i>
                            <p class="font-bold text-primary">Local Transit & Commercial Hub</p>
                            <p class="text-[11px] mt-1">Connecting BMTC feeder buses, auto rickshaw stands, and local markets are directly outside the station gates.</p>
                        </div>
                    `}

                    <!-- Prompt to view Exit Gates -->
                    <button id="switch-to-gates-cta-btn" type="button" class="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95">
                        <i data-lucide="door-open" class="w-3.5 h-3.5"></i>
                        <span>Next: View Station Exit Gates & Directions ➔</span>
                    </button>
                </div>
            ` : `
                <!-- TAB 2: STATION EXIT GATES & ROAD CROSSING GUIDE -->
                <div class="space-y-3">
                    <div class="p-2.5 rounded-xl bg-card-subtle border border-subtle flex items-start gap-2 text-[11px] text-secondary">
                        <i data-lucide="info" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
                        <span>Choose your exit gate below to avoid crossing heavy Bengaluru traffic.</span>
                    </div>

                    ${gates && gates.length > 0 ? gates.map((g, idx) => `
                        <div class="destination-hub-subcard p-3.5 rounded-2xl space-y-2.5 shadow-sm">
                            <div class="flex items-center justify-between gap-2 flex-wrap">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-9 h-9 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
                                        ${g.gate}
                                    </span>
                                    <div class="min-w-0">
                                        <h4 class="text-xs sm:text-sm font-extrabold text-primary truncate">Gate ${g.gate} • ${g.name}</h4>
                                        <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block truncate">${g.landmark}</span>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-card-subtle text-secondary border border-subtle shrink-0">
                                    ${idx === 0 ? 'Main Entry / Exit' : 'Opposite Side Access'}
                                </span>
                            </div>

                            <div class="destination-hub-subcard-inner p-2.5 rounded-xl space-y-1 text-xs">
                                <div class="flex items-start gap-2 text-indigo-500 dark:text-indigo-400 font-extrabold text-[11px]">
                                    <i data-lucide="${idx === 0 ? 'arrow-right' : 'arrow-left-right'}" class="w-3.5 h-3.5 shrink-0 mt-0.5"></i>
                                    <span>${idx === 0 ? `Use Gate ${g.gate} for Main Road, BMTC Bus Bay & Auto Stand` : `Use Foot Overbridge at Gate ${g.gate} to cross to opposite road side`}</span>
                                </div>
                                <p class="text-secondary text-[11px] leading-relaxed pl-5">${g.destination}</p>
                            </div>

                            <div class="flex items-center gap-3 pt-1 border-t border-subtle/50 text-[10px] text-secondary font-semibold">
                                <span class="flex items-center gap-1"><i data-lucide="accessibility" class="w-3 h-3 text-emerald-500"></i> Ramps & Lifts</span>
                                <span class="flex items-center gap-1"><i data-lucide="ticket" class="w-3 h-3 text-amber-500"></i> Ticket Counters</span>
                                <span class="flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3 text-blue-500"></i> Security Post</span>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="p-6 text-center text-secondary text-xs">Gate directory details are being synchronized for this station.</div>
                    `}
                </div>
            `}
        </div>

        <!-- Sticky Footer Action Bar -->
        <div class="destination-hub-footer p-3 px-4 border-t flex items-center justify-between gap-2.5 shrink-0">
            <button id="hub-footer-qr-btn" type="button" class="py-2.5 px-3.5 rounded-xl bg-card-subtle hover:bg-card-hover border border-subtle text-primary font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all">
                <i data-lucide="qr-code" class="w-3.5 h-3.5 text-emerald-500"></i>
                <span>QR Ticket</span>
            </button>
            <button id="hub-footer-explore-btn" type="button" class="py-2.5 px-3.5 rounded-xl bg-card-subtle hover:bg-card-hover border border-subtle text-primary font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all">
                <i data-lucide="compass" class="w-3.5 h-3.5 text-amber-500"></i>
                <span>Explore</span>
            </button>
            <button id="hub-complete-trip-btn" type="button" class="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all text-center">
                ✓ Done
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    // Event handlers for Hub modal
    document.getElementById('hub-tab-places-btn')?.addEventListener('click', () => {
        openDestinationHubModal(stationId, stationName, 'places');
    });
    document.getElementById('hub-tab-gates-btn')?.addEventListener('click', () => {
        openDestinationHubModal(stationId, stationName, 'gates');
    });
    document.getElementById('switch-to-gates-cta-btn')?.addEventListener('click', () => {
        openDestinationHubModal(stationId, stationName, 'gates');
    });

    // QR Ticket trigger (Single reliable trigger from footer)
    document.getElementById('hub-footer-qr-btn')?.addEventListener('click', () => {
        const ticketData = getActiveTicketData();
        if (ticketData) {
            if (window.openQRScannerModal) window.openQRScannerModal();
        } else {
            if (window.openTicketUploadModal) window.openTicketUploadModal();
        }
    });

    // Close and complete trip triggers (Return to Home Page)
    const handleCompleteTrip = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        modal.classList.add('hidden');
        if (window.closeQRFullscreen) window.closeQRFullscreen();
        const qrScanModal = document.getElementById('qr-scanner-modal');
        if (qrScanModal) qrScanModal.classList.remove('modal-active');
        resetPlannerToHome();
    };
    document.getElementById('close-hub-modal-btn')?.addEventListener('click', handleCompleteTrip);
    document.getElementById('hub-complete-trip-btn')?.addEventListener('click', handleCompleteTrip);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCompleteTrip(e);
    });

    // Explore Nearby Places trigger - show nearby to destination right inside this hub
    document.getElementById('hub-footer-explore-btn')?.addEventListener('click', () => {
        openDestinationHubModal(stationId, stationName, 'places');
    });
}

function createConfettiEffect() {
    const container = document.getElementById('celebration-confetti');
    if (!container) return;

    const colors = ['#10B981', '#34D399', '#A855F7', '#C084FC', '#F59E0B', '#FBBF24'];
    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.top = `${-10 - Math.random() * 20}px`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 1.5}s`;
        piece.style.animationDuration = `${1.2 + Math.random() * 1.8}s`;
        container.appendChild(piece);
    }
}

function stopSimulation() {
    simulationState.isActive = false;
    if (simulationState.animationFrameId) {
        cancelAnimationFrame(simulationState.animationFrameId);
        simulationState.animationFrameId = null;
    }
    if (simulationState.locationWatcherId) {
        navigator.geolocation.clearWatch(simulationState.locationWatcherId);
        simulationState.locationWatcherId = null;
    }
    const simStatus = document.getElementById('simulation-status');
    if (simStatus) {
        simStatus.className = 'sticky top-0 z-40 w-full hidden';
        simStatus.innerHTML = '';
        delete simStatus.dataset.lastStateKey;
    }
    const routeList = document.getElementById('route-list');
    if (routeList) routeList.innerHTML = '';

    sessionStorage.removeItem('activeJourney');
    sessionStorage.removeItem('simulationState');
    localStorage.removeItem('activeJourney');
    localStorage.removeItem('simulationState');

    activeView = null;
    switchView('planner-view');
    navigateToView('plan');
}

export function resetPlannerToHome() {
    simulationState.isActive = false;
    if (simulationState.animationFrameId) {
        cancelAnimationFrame(simulationState.animationFrameId);
        simulationState.animationFrameId = null;
    }
    if (simulationState.locationWatcherId) {
        navigator.geolocation.clearWatch(simulationState.locationWatcherId);
        simulationState.locationWatcherId = null;
    }
    const modal = document.getElementById('station-gates-modal');
    if (modal) modal.classList.add('hidden');
    if (window.closeQRFullscreen) window.closeQRFullscreen();
    const qrScanModal = document.getElementById('qr-scanner-modal');
    if (qrScanModal) qrScanModal.classList.remove('modal-active');

    const simStatus = document.getElementById('simulation-status');
    if (simStatus) {
        simStatus.className = 'sticky top-0 z-40 w-full hidden';
        simStatus.innerHTML = '';
        delete simStatus.dataset.lastStateKey;
    }
    const routeList = document.getElementById('route-list');
    if (routeList) routeList.innerHTML = '';

    if (startDropdown) {
        startDropdown.clearSelection();
        startDropdown.setExcludedStationName(null);
    }
    if (endDropdown) {
        endDropdown.clearSelection();
        endDropdown.setExcludedStationName(null);
    }
    const startInput = document.getElementById('start-station');
    if (startInput) startInput.value = '';
    const endInput = document.getElementById('end-station');
    if (endInput) endInput.value = '';
    currentJourney = null;
    passengerCount = 1;
    displayJourneyResult(null);
    sessionStorage.removeItem('activeJourney');
    sessionStorage.removeItem('simulationState');
    localStorage.removeItem('activeJourney');
    localStorage.removeItem('simulationState');

    activeView = null;
    switchView('planner-view');
    navigateToView('plan');

    const planView = document.getElementById('planner-view');
    if (planView) {
        planView.scrollTop = 0;
        planView.scrollTo({ top: 0, behavior: 'instant' });
    }
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = 'flex';
        bottomNav.classList.remove('nav-hidden');
    }
}
window.resetPlannerToHome = resetPlannerToHome;

function handleJourneyUpdate() {
    const startVal = document.getElementById('start-station').value;
    const endVal = document.getElementById('end-station').value;
    const startName = startDropdown ? startDropdown.getSelectedStationName() : null;
    const endName = endDropdown ? endDropdown.getSelectedStationName() : null;

    if (startVal && endVal && startName !== endName) {
        const j = calculateJourney(startVal, endVal);
        displayJourneyResult(j);
        if (typeof addRecentRoute === 'function') {
            addRecentRoute(startVal, endVal, startName, endName);
        }
    } else {
        displayJourneyResult(null);
    }
}

// Calculate aerial distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Google Maps-Style Urban Road Route Distance Algorithm
function getRoadRouteDistanceInKm(lat1, lon1, lat2, lon2) {
    const haversineDist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    
    // Calculate Manhattan Grid metric for city road topology
    const latRad = lat1 * (Math.PI / 180);
    const dLatKm = Math.abs(lat2 - lat1) * 111.13;
    const dLonKm = Math.abs(lon2 - lon1) * 111.13 * Math.cos(latRad);
    const manhattanDist = dLatKm + dLonKm;
    
    // Urban Road Circuity Factor (C = 1.35 for Bengaluru street network)
    const roadRouteDist = Math.max(haversineDist * 1.35, manhattanDist * 1.08);
    return Number(roadRouteDist.toFixed(2));
}

function initializeApp() {
    // Initialize theme state & click handlers
    initTheme();

    // Initialize sections module with translation helpers
    initSections(() => currentLang, T, T_STATION);

    startDropdown = new CustomDropdown('start-station-dropdown', 'enterStart', 'start', (val) => {
        document.getElementById('start-station').value = val || '';
        const startName = startDropdown.getSelectedStationName();
        if (endDropdown) {
            endDropdown.setExcludedStationName(startName);
        }
        handleJourneyUpdate();
    });

    endDropdown = new CustomDropdown('end-station-dropdown', 'enterEnd', 'end', (val) => {
        document.getElementById('end-station').value = val || '';
        const endName = endDropdown.getSelectedStationName();
        if (startDropdown) {
            startDropdown.setExcludedStationName(endName);
        }
        handleJourneyUpdate();
    });

    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.getElementById('current-lang-text');

    if (langBtn && langMenu) {
        // Toggle menu
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !langMenu.classList.contains('opacity-0');
            if (isOpen) {
                langMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                langMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            } else {
                langMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
                langMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            }
        });

        // Handle selection
        langOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLang = opt.getAttribute('data-lang');
                
                // Update active visual state
                langOptions.forEach(o => o.querySelector('.indicator').classList.add('hidden'));
                opt.querySelector('.indicator').classList.remove('hidden');
                
                // Update button text
                if (newLang === 'en') currentLangText.textContent = 'EN';
                else if (newLang === 'hi') currentLangText.textContent = 'HI';
                else if (newLang === 'kn') currentLangText.textContent = 'KN';

                setLanguage(newLang);
                
                // Close menu
                langMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                langMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
                langMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            }
        });

        // Initialize active visual state
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === currentLang) {
                opt.querySelector('.indicator').classList.remove('hidden');
                if (currentLang === 'en') currentLangText.textContent = 'EN';
                else if (currentLang === 'hi') currentLangText.textContent = 'HI';
                else if (currentLang === 'kn') currentLangText.textContent = 'KN';
            }
        });
    }

    setLanguage(currentLang);

    precomputeJourneyData();
    renderQuickCommutes();

    document.getElementById('swap-stations').addEventListener('click', () => {
        if (simulationState.isActive) return;
        const startVal = document.getElementById('start-station').value;
        const endVal = document.getElementById('end-station').value;
        if (startVal || endVal) {
            startDropdown.excludedStationName = null;
            endDropdown.excludedStationName = null;

            if (endVal) startDropdown.selectById(endVal); else startDropdown.clearSelection();
            if (startVal) endDropdown.selectById(startVal); else endDropdown.clearSelection();

            const newStartName = startDropdown.getSelectedStationName();
            const newEndName = endDropdown.getSelectedStationName();

            if (endDropdown) endDropdown.setExcludedStationName(newStartName);
            if (startDropdown) startDropdown.setExcludedStationName(newEndName);

            handleJourneyUpdate();
        }
    });

    document.getElementById('board-train-btn').addEventListener('click', () => {
        if (!currentJourney) return;
        const ticketData = getActiveTicketData();
        if (!ticketData) {
            window.openTicketUploadModal();
        } else {
            startSimulation(currentJourney, false);
        }
    });

    initTicketModule();

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
                        let minRoadDistance = Infinity;
                        
                        stationsMeta.forEach(station => {
                            const loc = station.location || station; 
                            if (loc.lat && loc.lon) {
                                const roadDist = getRoadRouteDistanceInKm(latitude, longitude, loc.lat, loc.lon);
                                if (roadDist < minRoadDistance) {
                                    minRoadDistance = roadDist;
                                    nearest = station;
                                }
                            }
                        });
                        
                        if (nearest) {
                            startDropdown.selectById(nearest.id);
                            const translatedName = T_STATION(nearest.name);
                            const distStr = minRoadDistance < 1 ? `${(minRoadDistance * 1000).toFixed(0)}m road route` : `${minRoadDistance.toFixed(1)}km road route`;
                            
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

    // Map view back/end journey top bar buttons
    document.getElementById('map-back-home-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetPlannerToHome();
    });
    document.getElementById('map-end-trip-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetPlannerToHome();
    });

    // Rush forecast & frequency guide listeners
    updateRushForecastUI();
    setInterval(updateRushForecastUI, 60000);

    document.getElementById('metro-rush-forecast-bar')?.addEventListener('click', (e) => {
        e.preventDefault();
        openRushScheduleModal();
    });
    document.getElementById('close-rush-modal-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeRushScheduleModal();
    });
    document.getElementById('rush-schedule-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'rush-schedule-modal') closeRushScheduleModal();
    });

    // Pass advisor modal listeners
    document.getElementById('close-pass-modal-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        closePassAdvisorModal();
    });
    document.getElementById('pass-advisor-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'pass-advisor-modal') closePassAdvisorModal();
    });

    // Popular stations fast-select chips
    initPopularStationChips();

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

    // --- Optimized Prevent Pull-to-Refresh JS Fix ---
    let touchStartYear = 0;
    
    // Only use non-passive for the scroller containers
    const scrollFix = (e) => {
        // Exclude touch events originating inside dropdown menus or station lists to keep dropdown touch scrolling smooth & unblocked
        if (e.target.closest && e.target.closest('.dropdown-menu, .station-list, .custom-dropdown, .search-container')) {
            return;
        }

        const activeSection = document.querySelector('.section-view:not(.hidden)');
        if (!activeSection) return;

        if (e.type === 'touchstart') {
            touchStartYear = e.touches[0].pageY;
        } else if (e.type === 'touchmove') {
            const touchMoveYear = e.touches[0].pageY;
            const diff = touchMoveYear - touchStartYear;
            
            // If at the top and pulling down, or at bottom and pulling up
            if ((activeSection.scrollTop <= 0 && diff > 0) || 
                (activeSection.scrollTop + activeSection.offsetHeight >= activeSection.scrollHeight && diff < 0)) {
                if (e.cancelable) e.preventDefault();
            }
        }
    };

    document.addEventListener('touchstart', scrollFix, { passive: false });
    document.addEventListener('touchmove', scrollFix, { passive: false });

    initTheme();
    if (window.lucide) window.lucide.createIcons();

    // Hide Splash Screen fast
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }
    }, 300);
}

// --- Nearby Attractions Bottom Sheet and Modals for Live Journey ---
window.showNearbyAttractions = function(stationName) {
    const attractions = stationPlaces[stationName] || [];
    if (attractions.length === 0) return;

    // Remove existing if any
    const existing = document.getElementById('nearby-attractions-sheet');
    if (existing) existing.remove();

    // Create container
    const sheetOverlay = document.createElement('div');
    sheetOverlay.id = 'nearby-attractions-sheet';
    sheetOverlay.className = 'nearby-sheet-overlay active';

    const lang = getCurrentLang();
    const scrollCardsHtml = attractions.map((p, idx) => {
        const name = lang === 'kn' ? (p.nameKn || p.name) : (lang === 'hi' && p.nameHi ? p.nameHi : p.name);
        const type = p.type ? p.type.toUpperCase() : 'ATTRACTION';
        const dist = p.distance_km ? `${p.distance_km} km` : '';
        const walk = p.walk_time_min ? `${p.walk_time_min} min walk` : '';
        const desc = p.description || p.summary || 'Discover this amazing place near the station.';
        const mapsLink = p.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' Bengaluru')}`;
        const image = p.image || 'assets/images/vidhana_soudha.jpg';

        return `
            <div class="nearby-card-item">
                <div class="nearby-card-image-wrap">
                    <img src="${image}" alt="${name}">
                    <span class="nearby-card-badge">${type}</span>
                </div>
                <div class="nearby-card-body">
                    <h4 class="nearby-card-title">${name}</h4>
                    <div class="nearby-card-meta">
                        ${dist ? `<span><i data-lucide="navigation" class="w-3 h-3 text-emerald-400"></i> ${dist}</span>` : ''}
                        ${walk ? `<span><i data-lucide="footprints" class="w-3 h-3 text-emerald-400"></i> ${walk}</span>` : ''}
                    </div>
                    <p class="nearby-card-desc">${desc}</p>
                    <div class="nearby-card-actions">
                        <button class="nearby-btn-action navigate" onclick="window.open('${mapsLink}', '_blank')">
                            <i data-lucide="map-pin" class="w-3 h-3"></i>
                            Navigate
                        </button>
                        <button class="nearby-btn-action details" onclick="window.showNearbyPlaceDetail('${stationName.replace(/'/g, "\\'")}', '${p.id}')">
                            <i data-lucide="info" class="w-3 h-3"></i>
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    sheetOverlay.innerHTML = `
        <div class="nearby-sheet-container animate-slide-up">
            <div class="nearby-sheet-header">
                <h3>Nearby Attractions - ${T_STATION(stationName)}</h3>
                <button class="nearby-sheet-close" onclick="window.closeNearbyAttractions()">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
            <div class="nearby-cards-scroll">
                ${scrollCardsHtml}
            </div>
        </div>
    `;

    // Add click handler to backdrop to close
    sheetOverlay.addEventListener('click', function(e) {
        if (e.target === sheetOverlay) {
            window.closeNearbyAttractions();
        }
    });

    const appContainer = document.getElementById('app-container') || document.body;
    appContainer.appendChild(sheetOverlay);
    if (window.lucide) window.lucide.createIcons();
};

window.closeNearbyAttractions = function() {
    const sheet = document.getElementById('nearby-attractions-sheet');
    if (sheet) {
        sheet.classList.remove('active');
        sheet.classList.add('closing');
        setTimeout(() => sheet.remove(), 300);
    }
};

window.showNearbyPlaceDetail = function(stationName, placeId) {
    const places = stationPlaces[stationName] || [];
    const p = places.find(a => a.id === placeId);
    if (!p) return;

    const lang = getCurrentLang();
    const name = lang === 'kn' ? (p.nameKn || p.name) : (lang === 'hi' && p.nameHi ? p.nameHi : p.name);
    const desc = p.description || p.summary || 'Discover this amazing place near the station.';
    const distText = p.distance_km ? `${p.distance_km} km from station` : '';
    const walkText = p.walk_time_min ? `${p.walk_time_min} min walk` : '';
    const driveText = p.approx_drive_time_min ? `~${p.approx_drive_time_min} min by auto/cab` : '';
    const mapsLink = p.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' Bengaluru')}`;
    const image = p.image || 'assets/images/vidhana_soudha.jpg';

    // Remove existing if any
    const existing = document.getElementById('nearby-detail-modal');
    if (existing) existing.remove();

    const detailModal = document.createElement('div');
    detailModal.id = 'nearby-detail-modal';
    detailModal.className = 'nearby-detail-overlay active';
    detailModal.innerHTML = `
        <div class="nearby-detail-container animate-fade-in-scale">
            <button class="nearby-detail-close" onclick="document.getElementById('nearby-detail-modal').remove()">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
            <div class="nearby-detail-image-wrap">
                <img src="${image}" alt="${name}">
                <div class="nearby-detail-image-gradient"></div>
                <div class="nearby-detail-title-wrap">
                    <h3>${name}</h3>
                    <span class="nearby-detail-badge">${p.type ? p.type.toUpperCase() : 'ATTRACTION'}</span>
                </div>
            </div>
            <div class="nearby-detail-body">
                <p class="nearby-detail-desc">${desc}</p>
                <div class="nearby-detail-info-grid">
                    ${distText ? `<div class="nearby-detail-info-item"><i data-lucide="navigation" class="w-4 h-4"></i><span>${distText}</span></div>` : ''}
                    ${walkText ? `<div class="nearby-detail-info-item"><i data-lucide="footprints" class="w-4 h-4"></i><span>${walkText}</span></div>` : ''}
                    ${driveText ? `<div class="nearby-detail-info-item"><i data-lucide="car" class="w-4 h-4"></i><span>${driveText}</span></div>` : ''}
                    ${p.entry_fee ? `<div class="nearby-detail-info-item"><i data-lucide="ticket" class="w-4 h-4"></i><span>Entry Fee: ${p.entry_fee}</span></div>` : ''}
                    ${p.best_time ? `<div class="nearby-detail-info-item"><i data-lucide="clock" class="w-4 h-4"></i><span>Best Time: ${p.best_time}</span></div>` : ''}
                </div>
                <a href="${mapsLink}" target="_blank" rel="noopener" class="nearby-detail-maps-btn">
                    <i data-lucide="map" class="w-4 h-4"></i> Open in Google Maps
                </a>
            </div>
        </div>
    `;

    // Close detail modal on click outside its container
    detailModal.addEventListener('click', function(e) {
        if (e.target === detailModal) {
            detailModal.remove();
        }
    });

    const appContainer = document.getElementById('app-container') || document.body;
    appContainer.appendChild(detailModal);
    if (window.lucide) window.lucide.createIcons();
};

// --- QR Ticket Vault & Gate Scanner Module ---
let pendingTicketFile = null;

export function getActiveTicketData() {
    try {
        return sessionStorage.getItem('activeJourneyTicketImage') || localStorage.getItem('nammaride_active_ticket') || null;
    } catch (e) {
        return null;
    }
}

export function setActiveTicketData(data) {
    try {
        if (data) {
            sessionStorage.setItem('activeJourneyTicketImage', data);
            localStorage.setItem('nammaride_active_ticket', data);
        } else {
            sessionStorage.removeItem('activeJourneyTicketImage');
            localStorage.removeItem('nammaride_active_ticket');
        }
    } catch (e) {
        console.warn('[TicketStorage] Storage quota/write error:', e);
    }
    const dot = document.getElementById('qr-pill-dot');
    if (dot) {
        if (data) dot.classList.remove('hidden');
        else dot.classList.add('hidden');
    }
}

function initTicketModule() {
    const uploadModal = document.getElementById('ticket-upload-modal');
    const dropzone = document.getElementById('ticket-dropzone');
    const fileInput = document.getElementById('ticket-file-input');
    const previewContainer = document.getElementById('ticket-preview-container');
    const previewImg = document.getElementById('ticket-preview-img');
    const dropzonePrompt = document.getElementById('ticket-dropzone-prompt');
    const confirmBtn = document.getElementById('ticket-upload-confirm');
    const skipBtn = document.getElementById('ticket-upload-skip');
    const closeUploadBtn = document.getElementById('ticket-upload-close');

    const qrScannerModal = document.getElementById('qr-scanner-modal');
    const qrCloseBtn = document.getElementById('qr-scanner-close');
    const qrModalImg = document.getElementById('qr-modal-img');
    const qrEmptyState = document.getElementById('qr-modal-empty-state');
    const qrReuploadBtn = document.getElementById('qr-modal-reupload-btn');
    const qrRemoveBtn = document.getElementById('qr-modal-remove-btn');
    const floatingQrBtn = document.getElementById('floating-qr-btn');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-over');
            }, false);
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files[0]) {
                handleTicketFileSelect(dt.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleTicketFileSelect(e.target.files[0]);
            }
        });
    }

    function handleTicketFileSelect(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            pendingTicketFile = e.target.result;
            if (previewImg) previewImg.src = pendingTicketFile;
            if (previewContainer) previewContainer.classList.remove('hidden');
            if (dropzonePrompt) dropzonePrompt.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    window.openTicketUploadModal = function() {
        if (!uploadModal) return;
        const currentSaved = getActiveTicketData();
        if (currentSaved && !pendingTicketFile) {
            pendingTicketFile = currentSaved;
            if (previewImg) previewImg.src = currentSaved;
            if (previewContainer) previewContainer.classList.remove('hidden');
            if (dropzonePrompt) dropzonePrompt.classList.add('hidden');
        }
        uploadModal.classList.add('modal-active');
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeTicketUploadModal = function() {
        if (!uploadModal) return;
        uploadModal.classList.remove('modal-active');
    };

    if (closeUploadBtn) closeUploadBtn.addEventListener('click', window.closeTicketUploadModal);
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            window.closeTicketUploadModal();
            if (currentJourney && !simulationState.isActive && !simulationState.arrivedAtDestination) {
                startSimulation(currentJourney, false);
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (pendingTicketFile) {
                setActiveTicketData(pendingTicketFile);
            }
            window.closeTicketUploadModal();
            if (simulationState.arrivedAtDestination) {
                window.openQRScannerModal();
            } else if (currentJourney && !simulationState.isActive) {
                startSimulation(currentJourney, false);
            } else if (currentJourney) {
                renderLiveRoute(currentJourney, document.getElementById('route-list'), simulationState);
            }
        });
    }

    // Gate Scanner View Modal
    window.openQRScannerModal = function() {
        if (!qrScannerModal) return;
        const ticketData = getActiveTicketData();
        const routeSubEl = document.getElementById('qr-modal-route-sub');

        if (currentJourney) {
            const startPart = currentJourney.parts[0]?.stations[0];
            const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
            const endStation = lastPart?.stations[lastPart.stations.length - 1];
            if (startPart && endStation && routeSubEl) {
                routeSubEl.innerText = `${T_STATION(startPart.name)} ➔ ${T_STATION(endStation.name)} • Platform ${currentJourney.parts[0]?.startPlatform || 1}`;
            }
        }

        if (ticketData) {
            if (qrModalImg) {
                qrModalImg.src = ticketData;
                qrModalImg.classList.remove('hidden');
            }
            if (qrEmptyState) qrEmptyState.classList.add('hidden');
            if (openFsBtn) openFsBtn.classList.remove('hidden');
        } else {
            if (qrModalImg) qrModalImg.classList.add('hidden');
            if (qrEmptyState) qrEmptyState.classList.remove('hidden');
            if (openFsBtn) openFsBtn.classList.add('hidden');
        }

        qrScannerModal.classList.add('modal-active');
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeQRScannerModal = function() {
        if (!qrScannerModal) return;
        qrScannerModal.classList.remove('modal-active');
        window.closeQRFullscreen();
    };

    if (qrCloseBtn) {
        qrCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.closeQRScannerModal();
        });
    }

    if (qrScannerModal) {
        qrScannerModal.addEventListener('click', (e) => {
            if (e.target === qrScannerModal) {
                e.preventDefault();
                e.stopPropagation();
                window.closeQRScannerModal();
            }
        });
    }

    const qrEmptyUploadBtn = document.getElementById('qr-empty-upload-btn');
    if (qrEmptyUploadBtn) {
        qrEmptyUploadBtn.addEventListener('click', () => {
            window.closeQRScannerModal();
            window.openTicketUploadModal();
        });
    }

    if (qrReuploadBtn) {
        qrReuploadBtn.addEventListener('click', () => {
            window.closeQRScannerModal();
            window.openTicketUploadModal();
        });
    }

    if (qrRemoveBtn) {
        qrRemoveBtn.addEventListener('click', () => {
            setActiveTicketData(null);
            pendingTicketFile = null;
            if (previewImg) previewImg.src = '';
            if (previewContainer) previewContainer.classList.add('hidden');
            if (dropzonePrompt) dropzonePrompt.classList.remove('hidden');
            window.closeQRScannerModal();
            if (currentJourney) renderLiveRoute(currentJourney, document.getElementById('route-list'), simulationState);
        });
    }

    // Fullscreen QR Gate Mode logic
    const qrFullscreenOverlay = document.getElementById('qr-fullscreen-overlay');
    const qrFsImg = document.getElementById('qr-fs-img');
    const qrFsCloseBtn = document.getElementById('qr-fullscreen-close');
    const openFsBtn = document.getElementById('open-qr-fullscreen-btn');
    const imgWrapper = document.getElementById('qr-modal-img-wrapper');
    let wakeLockSentinel = null;

    async function requestScreenWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLockSentinel = await navigator.wakeLock.request('screen');
            } catch (err) {}
        }
    }

    function releaseScreenWakeLock() {
        if (wakeLockSentinel) {
            try { wakeLockSentinel.release(); } catch(e){}
            wakeLockSentinel = null;
        }
    }

    window.openQRFullscreen = function() {
        const ticketData = getActiveTicketData();
        if (!ticketData || !qrFullscreenOverlay) return;

        if (qrFsImg) qrFsImg.src = ticketData;

        const routeTitleEl = document.getElementById('qr-fs-route-title');
        if (currentJourney && routeTitleEl) {
            const startPart = currentJourney.parts[0]?.stations[0];
            const lastPart = currentJourney.parts[currentJourney.parts.length - 1];
            const endStation = lastPart?.stations[lastPart.stations.length - 1];
            if (startPart && endStation) {
                routeTitleEl.innerText = `${T_STATION(startPart.name)} ➔ ${T_STATION(endStation.name)} • Platform ${currentJourney.parts[0]?.startPlatform || 1}`;
            }
        }

        qrFullscreenOverlay.classList.add('modal-active');
        requestScreenWakeLock();
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeQRFullscreen = function() {
        if (!qrFullscreenOverlay) return;
        qrFullscreenOverlay.classList.remove('modal-active');
        releaseScreenWakeLock();
    };

    if (openFsBtn) openFsBtn.addEventListener('click', window.openQRFullscreen);
    if (imgWrapper) imgWrapper.addEventListener('click', window.openQRFullscreen);
    if (qrFsCloseBtn) {
        qrFsCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.closeQRFullscreen();
        });
    }
    if (qrFullscreenOverlay) {
        qrFullscreenOverlay.addEventListener('click', (e) => {
            if (e.target === qrFullscreenOverlay) {
                e.preventDefault();
                e.stopPropagation();
                window.closeQRFullscreen();
            }
        });
    }

    // Floating QR Button Click
    if (floatingQrBtn) {
        floatingQrBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ticketData = getActiveTicketData();
            if (ticketData) {
                window.openQRScannerModal();
            } else {
                window.openTicketUploadModal();
            }
        });
    }

    // Initialize floating QR dot state
    const currentTicketData = getActiveTicketData();
    const qrDot = document.getElementById('qr-pill-dot');
    if (qrDot) {
        if (currentTicketData) qrDot.classList.remove('hidden');
        else qrDot.classList.add('hidden');
    }
}

// Start Application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
