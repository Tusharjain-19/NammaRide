import { metroData, translations, stationTranslations, lineNameMap } from './data/stations.js';
import { stationsMeta } from './data/stationsMeta.js';
import { CustomDropdown } from './ui/dropdown.js';
import { renderLiveRoute, updateRouteVisuals } from './ui/route.js';
import { calculateFare } from './logic/pricing.js';
import { initSections, renderStationsList, renderStationDetail, renderTimings, renderSafety, renderExplore, renderExploreStation, renderPlaceDetail } from './ui/sections.js';
import { T, T_STATION, CONFIG, formatTime, getCurrentLang, setCurrentLang } from './utils/helpers.js';
import { stationPlaces } from './data/stationPlaces.js';
// Safely initialize Vercel Analytics only on production website (not in mobile app or offline)
if (location.hostname.includes('nammaride.site')) {
    import("@vercel/analytics").then(module => {
        if (module && module.inject) module.inject();
    }).catch(() => {});
}

// --- App State ---
let currentLang = getCurrentLang();
let startDropdown, endDropdown;
let currentJourney = null;
let activeView = 'plan';

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
function getLineColor(lineName) {
    if (lineName === 'Purple Line') return '#8B5CF6';
    if (lineName === 'Green Line') return '#22C55E';
    if (lineName === 'Yellow Line') return '#FBBF24';
    return '#6366F1';
}

function initTheme() {
    const theme = localStorage.getItem('appTheme') || 'dark';
    applyTheme(theme);

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-mode') || document.documentElement.classList.contains('light');
            const newTheme = isLight ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }
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

    const updateSummaryUI = () => {
        const totalFareAmount = journey.fare * passengerCount;

        summaryText.innerHTML = `
            <div class="flex justify-between items-end mb-2">
                <div>
                    <p class="text-xs text-secondary uppercase tracking-wide font-bold">${T('totalTime')}</p>
                    <p class="text-2xl font-bold text-primary">${formattedTime}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-secondary uppercase tracking-wide font-bold">${T('estFare')}</p>
                    <p class="text-2xl font-bold text-emerald-400">₹${journey.fare} <span class="text-xs text-secondary opacity-70">/ person</span></p>
                </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-[var(--accent-color)] bg-[var(--bg-card-hover)] p-2.5 rounded-xl border border-[var(--border-color)]">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                <span class="font-medium">${T('nextTrain')}: ${formatTime(journey.departureTime)} (${T('now')})</span>
            </div>

            <!-- WhatsApp Ticket Booking Card -->
            <div class="whatsapp-booking-card p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-primary uppercase tracking-wider">${T('passengers') || 'Passengers'}</span>
                        <span class="text-[11px] text-emerald-400 font-bold mt-0.5">₹${totalFareAmount}</span>
                    </div>
                    <div class="flex items-center gap-4 bg-card-subtle px-3 py-1.5 rounded-full border border-subtle">
                        <button id="p-minus-btn" class="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-card hover:bg-card-hover text-primary font-bold text-lg transition-colors border border-subtle/50">-</button>
                        <span class="font-bold text-base text-primary min-w-[20px] text-center">${passengerCount}</span>
                        <button id="p-plus-btn" class="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-card hover:bg-card-hover text-primary font-bold text-lg transition-colors border border-subtle/50">+</button>
                    </div>
                </div>

                <button id="whatsapp-book-btn" class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95">
                    <img src="assets/whatsapp.svg" alt="WhatsApp" class="w-5 h-5">
                    <span>Book Ticket</span>
                </button>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

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
function updateNavIndicator() {
    const activeBtn = document.querySelector('.nav-item.active');
    const indicator = document.getElementById('nav-indicator');
    if (!activeBtn || !indicator) return;

    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;

    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
}

function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            navigateToView(view);
        });
    });

    window.addEventListener('resize', updateNavIndicator);

    // Auto-hide bottom nav on scroll down, show on scroll up
    const sections = document.querySelectorAll('.section-view');
    const bottomNav = document.getElementById('bottom-nav');
    
    sections.forEach(section => {
        let lastScrollTop = 0;
        section.addEventListener('scroll', () => {
            const st = section.scrollTop;
            if (st > lastScrollTop && st > 30) {
                // Scroll Down -> Hide nav
                if (bottomNav) bottomNav.classList.add('nav-hidden');
            } else if (st < lastScrollTop) {
                // Scroll Up -> Show nav
                if (bottomNav) bottomNav.classList.remove('nav-hidden');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }, { passive: true });
    });

    setTimeout(updateNavIndicator, 60);
}

function navigateToView(view) {
    activeView = view;

    // Reveal nav if hidden when switching tab
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.classList.remove('nav-hidden');

    // Update active nav state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        updateNavIndicator();
    }

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

    // Auto arrival: if within 500m of destination
    const destIndex = timeline.length - 1;
    const destNode = timeline[destIndex];
    const destStation = stationsMeta.find(s => s.id === destNode.stationId);
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

    // Bind event delegation ONCE for bulletproof click handler support
    if (!simStatus.dataset.listenersBound) {
        simStatus.dataset.listenersBound = 'true';
        simStatus.addEventListener('click', (e) => {
            const finishBtn = e.target.closest('#manual-finish-btn');
            const exitBtn = e.target.closest('#exit-journey-btn');
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
                stopSimulation();
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
            <div class="gps-warning-banner py-1 px-2.5 mt-1 text-[10px]">
                <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-500"></i>
                <span>${T('gpsWeak') || 'GPS signal is weak. Manual override available.'}</span>
            </div>
        `;
    }

    simStatus.innerHTML = `
        <div class="live-tracking-panel w-full flex flex-col p-3 px-4 rounded-2xl shadow-lg gap-2">
            <div class="flex items-center justify-between gap-2">
                <!-- Left: Train Icon + Trip Info -->
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-inner">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-400">
                            <!-- Roof Cap -->
                            <path d="M7.5 2H16.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
                            <!-- Outer Train Body -->
                            <rect x="3.5" y="4" width="17" height="17" rx="4" stroke="currentColor" stroke-width="2"/>
                            <!-- Windshield -->
                            <rect x="5.5" y="6" width="13" height="7.5" rx="2" stroke="currentColor" stroke-width="1.5"/>
                            <!-- Windshield Glare Reflection Lines -->
                            <line x1="9" y1="11.5" x2="11.5" y2="7.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
                            <line x1="13" y1="11.5" x2="15.5" y2="7.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
                            <!-- Left Capsule Headlight -->
                            <rect x="5" y="15" width="4" height="2" rx="0.85" stroke="currentColor" stroke-width="1.5"/>
                            <!-- Right Capsule Headlight -->
                            <rect x="15" y="15" width="4" height="2" rx="0.85" stroke="currentColor" stroke-width="1.5"/>
                            <!-- Center Bumper Arch -->
                            <path d="M8 21V19C8 18.2 9.2 17.5 12 17.5C14.8 17.5 16 18.2 16 19V21" stroke="currentColor" stroke-width="1.5"/>
                            <!-- Track Base Line -->
                            <line x1="5.5" y1="22.5" x2="18.5" y2="22.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="flex flex-col min-w-0">
                        <div class="flex items-center gap-1.5 leading-none">
                            <span class="text-[9px] uppercase tracking-wider font-extrabold text-emerald-500 truncate">${T('towards')} ${destinationName}</span>
                            <span class="gps-signal-dot ${gpsClass} shrink-0" title="${gpsTitle}"></span>
                        </div>
                        <div class="flex items-center gap-1 text-xs font-extrabold text-primary mt-1">
                            <span>${remainingMinutes} ${T('minRemaining') || 'min remaining'}</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Action Buttons -->
                <div class="flex items-center gap-1.5 shrink-0">
                    <button id="manual-finish-btn" class="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                        <span>${T('finishJourney') || 'Finish'}</span>
                    </button>
                    <button id="exit-journey-btn" class="bg-card-subtle hover:bg-red-500/15 hover:text-red-400 active:scale-95 border border-subtle text-secondary font-bold p-1.5 rounded-xl text-xs transition-colors flex items-center justify-center" title="${T('exitJourney') || 'Exit'}">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
            ${gpsWarningHtml}
        </div>
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

    const simStatus = document.getElementById('simulation-status');
    if (!simStatus) return;

    const places = stationPlaces[destinationName] || [];
    const hasExploreOption = places.length > 0;

    simStatus.innerHTML = `
        <div class="journey-complete-card">
            <div class="confetti-container" id="celebration-confetti"></div>
            <div class="celebration-checkmark-wrap">
                <i data-lucide="check" class="celebration-checkmark"></i>
            </div>
            <h3 class="font-bold text-lg text-emerald-400 mb-1">${T('journeyComplete') || 'Journey Complete!'}</h3>
            <p class="text-sm text-primary mb-4 font-medium">${T('youHaveArrived') || 'You have arrived!'} • ${destinationName}</p>
            
            <div class="flex justify-center gap-3 relative z-10">
                ${hasExploreOption ? `
                    <button id="explore-nearby-celebrate-btn" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                        ${T('exploreNearby') || 'Explore Nearby'}
                    </button>
                ` : ''}
                <button id="done-celebrate-btn" class="bg-card-subtle border border-subtle text-primary font-bold px-4 py-2 rounded-lg text-xs hover:bg-hover transition-colors">
                    Done
                </button>
            </div>
        </div>
    `;

    document.getElementById('done-celebrate-btn').addEventListener('click', stopSimulation);
    if (hasExploreOption) {
        document.getElementById('explore-nearby-celebrate-btn').addEventListener('click', () => {
            if (window.showNearbyAttractions) {
                window.showNearbyAttractions(destinationName);
            }
        });
    }

    if (window.lucide) window.lucide.createIcons();
    createConfettiEffect();
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
    // Initialize theme state & click handlers
    initTheme();

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

    // --- Optimized Prevent Pull-to-Refresh JS Fix ---
    let touchStartYear = 0;
    
    // Only use non-passive for the scroller containers
    const scrollFix = (e) => {
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
        const image = p.image || `https://images.unsplash.com/photo-1620063251433-875c742c3ff2?auto=format&fit=crop&q=80&w=240&h=160&sig=${p.id.length + idx}`;

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
    const image = p.image || `https://images.unsplash.com/photo-1620063251433-875c742c3ff2?auto=format&fit=crop&q=80&w=800&h=400&sig=${p.id.length}`;

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

// Start Application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
