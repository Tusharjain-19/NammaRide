// ============================================================
// NammaRide — Section Views (Stations, Timings, Safety, Explore)
// ============================================================

import { stationsMeta } from '../data/stationsMeta.js';
import { stationPlaces } from '../data/stationPlaces.js';
import { safetyData } from '../data/safety.js';
import { timingsData } from '../data/timings.js';
import { metroData, stationTranslations } from '../data/stations.js';

let currentLangGetter = () => 'en';
let T_fn = (k) => k;
let T_STATION_fn = (n) => n;

export function initSections(getLang, T, T_STATION) {
    currentLangGetter = getLang;
    T_fn = T;
    T_STATION_fn = T_STATION;
}

function lang() { return currentLangGetter(); }

function getLineColor(lineName) {
    if (lineName === 'Purple Line') return '#8B5CF6';
    if (lineName === 'Green Line') return '#22C55E';
    if (lineName === 'Yellow Line') return '#FBBF24';
    return '#6366F1';
}

function getLineColorClass(lineName) {
    if (lineName === 'Purple Line') return 'line-badge-purple';
    if (lineName === 'Green Line') return 'line-badge-green';
    if (lineName === 'Yellow Line') return 'line-badge-yellow';
    return '';
}

function getFacilityIcon(facility) {
    const map = {
        'Toilets': 'badge-check', 'Escalator': 'arrow-up-down', 'Elevator': 'arrow-up-from-dot',
        'Ticket Counter': 'ticket', 'Smart Card Recharge': 'credit-card', 'Wheelchair Access': 'accessibility',
        'Parking': 'car', 'Parking (large)': 'car', 'Parking (small)': 'car',
        'Interchange to Green Line': 'arrow-right-left', 'Interchange to Purple Line': 'arrow-right-left',
        'Interchange to Yellow Line': 'arrow-right-left'
    };
    return map[facility] || 'check-circle';
}

function getConnectivityIcon(conn) {
    const c = conn.toLowerCase();
    if (c.includes('bus')) return 'bus';
    if (c.includes('auto') || c.includes('rickshaw')) return 'bike';
    if (c.includes('taxi') || c.includes('cab')) return 'car';
    if (c.includes('rail') || c.includes('train')) return 'train';
    if (c.includes('walk')) return 'footprints';
    return 'map-pin';
}

// ═══════════════════════════════════════
// STATIONS LIST VIEW
// ═══════════════════════════════════════
export function renderStationsList(container) {
    const lines = [
        { key: 'purple', name: 'Purple Line', color: '#8B5CF6' },
        { key: 'green', name: 'Green Line', color: '#22C55E' },
        { key: 'yellow', name: 'Yellow Line', color: '#FBBF24' }
    ];

    let html = `<div class="section-header">
        <h2 class="section-title" data-lang-key="stations">${T_fn('stations') || 'Stations'}</h2>
        <p class="section-subtitle">All Namma Metro stations • Tap for details</p>
        <div class="mt-4 relative">
            <input type="text" id="stations-search" placeholder="Search stations..." class="w-full bg-card-subtle text-primary text-sm py-2.5 pl-9 pr-4 rounded-xl border border-subtle focus:outline-none focus:border-indigo-500 transition-colors">
            <i data-lucide="search" class="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2"></i>
        </div>
        <div class="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar" id="line-filters">
            <button class="line-filter-btn active shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" data-line="all">All</button>
            <button class="line-filter-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 transition-opacity opacity-70 hover:opacity-100" data-line="Purple Line">Purple</button>
            <button class="line-filter-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 transition-opacity opacity-70 hover:opacity-100" data-line="Green Line">Green</button>
            <button class="line-filter-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FBBF24]/10 text-[#D97706] border border-[#FBBF24]/20 transition-opacity opacity-70 hover:opacity-100" data-line="Yellow Line">Yellow</button>
        </div>
    </div>
    <div id="stations-list-content">`;

    lines.forEach(line => {
        const lineStations = stationsMeta.filter(s => s.line === line.name);
        html += `<div class="line-group" data-line-name="${line.name}">
            <div class="line-header" style="border-left: 3px solid ${line.color}">
                <span class="line-dot" style="background:${line.color}"></span>
                <span class="line-name-text">${T_STATION_fn(line.name)}</span>
                <span class="station-count-badge">${lineStations.length}</span>
            </div>
            <div class="stations-grid">`;

        lineStations.forEach(station => {
            const translatedName = T_STATION_fn(station.name);
            const knName = station.name_kn || '';
            const searchTerm = `${translatedName} ${knName} ${station.code}`.toLowerCase();
            
            html += `<div class="station-card js-station-item" data-search-term="${searchTerm}" data-station-id="${station.id}" onclick="window.showStationDetail('${station.id}')">
                <div class="station-card-left">
                    <div class="station-code-badge" style="background:${line.color}20;color:${line.color};border:1px solid ${line.color}40">${station.code}</div>
                </div>
                <div class="station-card-info">
                    <div class="station-card-name">${translatedName}</div>
                    ${knName && lang() === 'en' ? `<div class="station-card-sub">${knName}</div>` : ''}
                    <div class="station-card-type flex items-center gap-1"><i data-lucide="${station.type === 'Elevated' ? 'arrow-up-circle' : 'arrow-down-circle'}" class="w-3 h-3 text-secondary"></i> ${station.type}</div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-secondary"></i>
            </div>`;
        });

        html += `</div></div>`;
    });

    html += `</div>`; // end stations-list-content
    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Attach search and filter events
    const searchInput = container.querySelector('#stations-search');
    const filterBtns = container.querySelectorAll('.line-filter-btn');
    let currentFilter = 'all';
    
    function filterStations() {
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        container.querySelectorAll('.js-station-item').forEach(el => {
            const matchesSearch = el.dataset.searchTerm.includes(term);
            const matchesFilter = currentFilter === 'all' || el.closest('.line-group').dataset.lineName === currentFilter;
            el.style.display = matchesSearch && matchesFilter ? 'flex' : 'none';
        });
        
        container.querySelectorAll('.line-group').forEach(group => {
            if (currentFilter !== 'all' && group.dataset.lineName !== currentFilter) {
                group.style.display = 'none';
                return;
            }
            const visible = Array.from(group.querySelectorAll('.js-station-item')).some(el => el.style.display !== 'none');
            group.style.display = visible ? 'block' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterStations);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'opacity-100');
                b.classList.add('opacity-70');
            });
            e.target.classList.add('active', 'opacity-100');
            e.target.classList.remove('opacity-70');
            currentFilter = e.target.dataset.line;
            filterStations();
        });
    });
}

// ═══════════════════════════════════════
// STATION DETAIL VIEW
// ═══════════════════════════════════════
export function renderStationDetail(container, stationId) {
    const station = stationsMeta.find(s => s.id === stationId);
    if (!station) { container.innerHTML = '<p class="text-secondary p-4">Station not found.</p>'; return; }

    const translatedName = T_STATION_fn(station.name);
    const knName = station.name_kn || '';
    const lineColor = getLineColor(station.line);

    let html = `<div class="detail-back" onclick="window.showStationsList()">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> <span>${T_fn('back') || 'Back'}</span>
    </div>

    <div class="station-detail-header" style="border-top: 3px solid ${lineColor}">
        <div class="station-detail-line">
            <span class="line-dot" style="background:${lineColor}"></span>
            ${T_STATION_fn(station.line)} • ${station.code}
        </div>
        <h3 class="station-detail-name">${translatedName}</h3>
        ${knName ? `<p class="station-detail-kn">${knName}</p>` : ''}
        <div class="station-type-badge ${station.type === 'Underground' ? 'underground' : 'elevated'}">
            <i data-lucide="${station.type === 'Elevated' ? 'arrow-up-circle' : 'arrow-down-circle'}" class="w-3.5 h-3.5"></i> ${station.type} Metro Station
        </div>
    </div>`;

    // Facilities
    if (station.facilities && station.facilities.length) {
        html += `<div class="detail-section">
            <h4 class="detail-section-title"><i data-lucide="building-2" class="w-4 h-4"></i> ${T_fn('stationFacilities') || 'Station Facilities'}</h4>
            <p class="detail-section-sub">${T_fn('facilitiesSub') || 'Amenities available inside the station'}</p>
            <div class="facilities-grid">`;
        station.facilities.forEach(f => {
            html += `<div class="facility-chip"><i data-lucide="${getFacilityIcon(f)}" class="w-3.5 h-3.5"></i> ${f}</div>`;
        });
        html += `</div></div>`;
    }

    // Connectivity
    if (station.connectivity && station.connectivity.length) {
        html += `<div class="detail-section">
            <h4 class="detail-section-title"><i data-lucide="network" class="w-4 h-4"></i> ${T_fn('connectivity') || 'Connectivity'}</h4>
            <p class="detail-section-sub">${T_fn('connectivitySub') || 'Transport options outside building'}</p>
            <div class="connectivity-list">`;
        station.connectivity.forEach(c => {
            html += `<div class="connectivity-item"><i data-lucide="${getConnectivityIcon(c)}" class="w-3.5 h-3.5"></i> ${c}</div>`;
        });
        html += `</div></div>`;
    }

    // Accessibility Section
    if (station.accessibility) {
        const acc = station.accessibility;
        html += `<div class="detail-section">
            <h4 class="detail-section-title"><i data-lucide="accessibility" class="w-4 h-4"></i> ${T_fn('accessibility') || 'Accessibility'}</h4>
            <div class="flex gap-4 mb-4">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg ${acc.wheelchair ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} text-xs font-bold">
                    <i data-lucide="${acc.wheelchair ? 'check-circle' : 'x-circle'}" class="w-3.5 h-3.5"></i> Wheelchair Access
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg ${acc.elevator ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} text-xs font-bold">
                    <i data-lucide="${acc.elevator ? 'check-circle' : 'x-circle'}" class="w-3.5 h-3.5"></i> Elevator available
                </div>
            </div>
            <div class="space-y-3">
                ${acc.lifts ? `
                    <div class="p-3 bg-card-subtle rounded-xl border border-subtle">
                        <div class="flex items-center gap-2 mb-1 text-primary text-sm font-bold"><i data-lucide="arrow-up-down" class="w-4 h-4 text-indigo-500"></i> Lifts</div>
                        <p class="text-xs text-secondary leading-relaxed">${acc.lifts}</p>
                    </div>
                ` : ''}
                ${acc.escalatorInfo ? `
                    <div class="p-3 bg-card-subtle rounded-xl border border-subtle">
                        <div class="flex items-center gap-2 mb-1 text-primary text-sm font-bold"><i data-lucide="move-up" class="w-4 h-4 text-indigo-500"></i> Escalators</div>
                        <p class="text-xs text-secondary leading-relaxed">${acc.escalatorInfo}</p>
                    </div>
                ` : ''}
            </div>
        </div>`;
    }

    // Nearby Essentials & Tourist Locations
    const nearbyCategories = [
        { key: 'NearbyEssentialPlaces', title: 'Nearby Essentials', icon: 'map-pin-5' },
        { key: 'NearbyTransportConnectivity', title: 'Transport Hubs', icon: 'bus' },
        { key: 'NearbyPublicUtilities', title: 'Public Utilities', icon: 'wrench' },
        { key: 'TouristAndLifestyleLocations', title: 'Explore Nearby', icon: 'palmtree' },
        { key: 'EmergencyAndSafetyLocations', title: 'Emergency Info', icon: 'alert-triangle' }
    ];

    nearbyCategories.forEach(cat => {
        if (station[cat.key] && station[cat.key].length > 0) {
            html += `<div class="detail-section">
                <h4 class="detail-section-title"><i data-lucide="${cat.icon}" class="w-4 h-4"></i> ${cat.title}</h4>
                <div class="space-y-2 mt-2">`;
            station[cat.key].forEach(item => {
                html += `<div class="p-2.5 bg-card-subtle rounded-lg border border-subtle text-xs text-primary flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> ${item}
                </div>`;
            });
            html += `</div></div>`;
        }
    });

    // Metro Travel Info
    html += `<div class="detail-section">
        <h4 class="detail-section-title"><i data-lucide="info" class="w-4 h-4"></i> ${T_fn('metroTravelInfo') || 'Metro Travel Info'}</h4>
        <div class="travel-info-grid">
            <div class="travel-info-item"><span class="travel-info-label">${T_fn('line') || 'Line'}</span><span class="travel-info-value" style="color:${lineColor}">${T_STATION_fn(station.line)}</span></div>
            <div class="travel-info-item"><span class="travel-info-label">${T_fn('stationType') || 'Station Type'}</span><span class="travel-info-value">${station.type}</span></div>
            <div class="travel-info-item"><span class="travel-info-label">${T_fn('platforms') || 'Platforms'}</span><span class="travel-info-value">${station.platforms}</span></div>
            <div class="travel-info-item"><span class="travel-info-label">${T_fn('opened') || 'Opened'}</span><span class="travel-info-value">${station.metroInfo?.opened || 'N/A'}</span></div>
            <div class="travel-info-item"><span class="travel-info-label">${T_fn('operator') || 'Operator'}</span><span class="travel-info-value">${station.metroInfo?.operator || 'BMRCL'}</span></div>
        </div>
    </div>`;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

// ═══════════════════════════════════════
// TIMINGS VIEW
// ═══════════════════════════════════════
export function renderTimings(container) {
    let html = `<div class="section-header">
        <h2 class="section-title">${T_fn('timings') || 'Timings'}</h2>
        <p class="section-subtitle">Bengaluru Metro schedule (2025-26)</p>
    </div>`;

    Object.entries(timingsData).forEach(([key, line]) => {
        html += `<div class="timing-card" style="border-left: 3px solid ${line.color}">
            <div class="timing-card-header">
                <span class="line-dot" style="background:${line.color}"></span>
                <div>
                    <h4 class="timing-line-name">${T_STATION_fn(line.name)}</h4>
                    <p class="timing-route">${line.route}</p>
                    <p class="timing-stations">${line.stations} stations</p>
                </div>
            </div>`;

        // Day Selection Tabs for this line
        html += `<div class="timing-tabs flex gap-2 mt-4 px-1 overflow-x-auto pb-2 custom-scrollbar" id="tabs-${key}">`;
        Object.keys(line.schedules).forEach((dayKey, idx) => {
            const dayTitle = line.schedules[dayKey].title.replace(' Timetable', '');
            html += `<button class="timing-tab-btn ${idx === 0 ? 'active' : ''}" data-line="${key}" data-day="${dayKey}">${dayTitle}</button>`;
        });
        html += `</div>`;

        // Schedule Content (First day visible by default)
        html += `<div class="timing-schedule-container" id="schedule-container-${key}">`;
        Object.entries(line.schedules).forEach(([dayKey, schedule], idx) => {
            html += `<div class="timing-day-schedule ${idx === 0 ? '' : 'hidden'}" id="schedule-${key}-${dayKey}">
                <div class="timing-table-wrapper">
                    <div class="timing-table-header mt-2" style="background:${line.color}15; border-bottom: 2px solid ${line.color}">
                        <div class="flex items-center gap-2 p-2">
                            <i data-lucide="clock" class="w-4 h-4" style="color:${line.color}"></i>
                            <span class="font-bold text-sm" style="color:${line.color}">${schedule.title}</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 p-3 bg-card-subtle rounded-b-xl border border-subtle border-t-0">
                        <!-- From Start -->
                        <div>
                            <div class="text-[10px] sub-heading uppercase font-bold text-secondary mb-2">From ${line.route.split(' ↔ ')[1].split('(')[0].trim()}</div>
                            ${schedule.from_start.map(item => `
                                <div class="flex justify-between items-center py-1.5 border-b border-subtle/50 text-[11px]">
                                    <span class="text-primary font-medium">${item.range}</span>
                                    <span class="text-secondary opacity-80">${item.frequency}</span>
                                </div>
                            `).join('')}
                        </div>
                        <!-- From End -->
                        <div>
                            <div class="text-[10px] sub-heading uppercase font-bold text-secondary mb-2">From ${line.route.split(' ↔ ')[0].trim()}</div>
                            ${schedule.from_end.map(item => `
                                <div class="flex justify-between items-center py-1.5 border-b border-subtle/50 text-[11px]">
                                    <span class="text-primary font-medium">${item.range}</span>
                                    <span class="text-secondary opacity-80">${item.frequency}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`; // End schedule-container

        // Notes section for this line
        if (line.notes && line.notes.length) {
            html += `<div class="timing-notes mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="info" class="w-3.5 h-3.5 text-amber-500"></i>
                    <span class="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Operational Notes</span>
                </div>
                ${line.notes.map(note => `<p class="text-[11px] text-primary/70 leading-relaxed mb-1 last:mb-0">• ${note}</p>`).join('')}
            </div>`;
        }

        html += `</div>`; // End timing-card
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Attach Tab Switch events
    container.querySelectorAll('.timing-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const line = btn.dataset.line;
            const day = btn.dataset.day;

            // Update Tab Active State
            container.querySelectorAll(`.timing-tab-btn[data-line="${line}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show relevant schedule
            container.querySelectorAll(`.timing-day-schedule[id^="schedule-${line}-"]`).forEach(s => s.classList.add('hidden'));
            const target = container.querySelector(`#schedule-${line}-${day}`);
            if (target) target.classList.remove('hidden');
        });
    });
}

// ═══════════════════════════════════════
// SAFETY VIEW
// ═══════════════════════════════════════
export function renderSafety(container) {
    const l = lang();
    let html = `<div class="section-header">
        <h2 class="section-title">${T_fn('safetyHelp') || 'Safety & Help'}</h2>
        <p class="section-subtitle">${T_fn('safetySub') || 'Emergency contacts & useful info'}</p>
    </div>
    <div class="safety-list">`;

    safetyData.emergencyNumbers.forEach(item => {
        const name = l === 'kn' ? (item.nameKn || item.name) : l === 'hi' ? (item.nameHi || item.name) : item.name;
        html += `<a href="tel:${item.number.replace(/[^0-9+]/g, '')}" class="safety-card">
            <div class="safety-icon-wrap"><i data-lucide="${item.icon || 'phone'}" class="w-5 h-5"></i></div>
            <div class="safety-info">
                <div class="safety-name">${name}</div>
                <div class="safety-number">${item.number}</div>
            </div>
            <div class="safety-badge">${item.available}</div>
        </a>`;
    });

    html += `</div>`;
    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

// ═══════════════════════════════════════
// EXPLORE VIEW (Station list with attraction counts)
// ═══════════════════════════════════════
export function renderExplore(container) {
    let html = `<div class="section-header">
        <h2 class="section-title">${T_fn('exploreJaipur')?.replace('Jaipur', 'Bengaluru') || 'Explore Bengaluru'}</h2>
        <p class="section-subtitle">${T_fn('exploreSub') || 'Tap a station to discover nearby places'}</p>
        <div class="mt-4 relative">
            <input type="text" id="explore-search" placeholder="Search by station or place..." class="w-full bg-card-subtle text-primary text-sm py-2.5 pl-9 pr-4 rounded-xl border border-subtle focus:outline-none focus:border-indigo-500 transition-colors">
            <i data-lucide="search" class="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2"></i>
        </div>
        <div class="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar" id="explore-category-filters">
            <button class="explore-cat-btn active shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-500 border border-pink-500/20" data-cat="all">All Categories</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="hospital"><i data-lucide="hospital" class="w-3 h-3"></i> Hospital</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="heritage"><i data-lucide="palmtree" class="w-3 h-3"></i> Tourism</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="building"><i data-lucide="building-2" class="w-3 h-3"></i> Places</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="market"><i data-lucide="shopping-bag" class="w-3 h-3"></i> Shopping</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="park"><i data-lucide="trees" class="w-3 h-3"></i> Parks & Lakes</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="stadium"><i data-lucide="stadium" class="w-3 h-3"></i> Stadium</button>
            <button class="explore-cat-btn shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card-subtle text-secondary border border-subtle flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100" data-cat="station"><i data-lucide="train" class="w-3 h-3"></i> Transit</button>
        </div>
        <div class="flex gap-2 mt-2 overflow-x-auto pb-1 custom-scrollbar" id="explore-line-filters">
            <button class="explore-line-btn active shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-primary border border-subtle" data-line="all">All Lines</button>
            <button class="explore-line-btn shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 border border-purple-500/20" data-line="purple">Purple Line</button>
            <button class="explore-line-btn shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20" data-line="green">Green Line</button>
            <button class="explore-line-btn shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" data-line="yellow">Yellow Line</button>
        </div>
    </div>
    <div id="explore-list-content">`;

    // Get unique station names that have attractions
    const stationsMap = new Map();
    Object.entries(metroData).forEach(([lineKey, line]) => {
        line.stations.forEach(s => {
            if (!stationsMap.has(s.name)) {
                const places = stationPlaces[s.name] || [];
                let placesSearchString = '';
                places.forEach(p => { 
                    placesSearchString += ` ${p.name} ${p.type} ${p.nameKn || ''} ${p.typeKn || ''}`; 
                });
                
                let displayImg = 'assets/images/station.jpg';
                if (places.length > 0 && places[0].image) {
                    displayImg = places[0].image;
                }

                stationsMap.set(s.name, {
                    name: s.name,
                    count: places.length,
                    lines: [lineKey],
                    lineColor: line.color,
                    placesSearch: placesSearchString,
                    image: displayImg
                });
            } else {
                stationsMap.get(s.name).lines.push(lineKey);
            }
        });
    });
    const allStations = Array.from(stationsMap.values());

    // Show stations that have attractions first, then others
    const withAttractions = allStations.filter(s => s.count > 0);
    const withoutAttractions = allStations.filter(s => s.count === 0);

    if (withAttractions.length > 0) {
        html += `<div class="explore-section-label flex items-center gap-1.5"><i data-lucide="map-pin" class="w-4 h-4 text-pink-500"></i> Stations with nearby places</div>`;
        withAttractions.forEach(s => {
            const knName = stationsMeta.find(m => m.name === s.name)?.name_kn || '';
            html += renderExploreCard(s, knName, s.placesSearch, s.lines.join(' '));
        });
    }

    if (withoutAttractions.length > 0) {
        html += `<div class="explore-section-label flex items-center gap-1.5" style="margin-top:1rem"><i data-lucide="map" class="w-4 h-4 text-secondary"></i> Other stations</div>`;
        withoutAttractions.forEach(s => {
            const knName = stationsMeta.find(m => m.name === s.name)?.name_kn || '';
            html += renderExploreCard(s, knName, s.placesSearch, s.lines.join(' '));
        });
    }

    html += `</div>`; // end explore-list-content
    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Attach search and filter events
    const searchInput = container.querySelector('#explore-search');
    const filterBtns = container.querySelectorAll('.explore-cat-btn');
    const lineBtns = container.querySelectorAll('.explore-line-btn');
    let currentCategory = 'all';
    let currentLine = 'all';

    function filterExplore() {
        const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const cat = currentCategory;
        const line = currentLine;
        
        const searchWords = term.split(/\s+/).filter(w => w.length > 0);

        // Category to potential type mapping
        const catMap = {
            'hospital': ['hospital'],
            'heritage': ['heritage', 'temple', 'church', 'mosque', 'museum', 'library', 'cultural', 'shrine', 'monument', 'scenic', 'tourist'],
            'building': ['building', 'soudha', 'office', 'tech_park', 'it_park', 'university', 'college', 'hotel', 'hub'],
            'market': ['market', 'mall', 'shopping', 'commercial', 'textile', 'fashion'],
            'park': ['park', 'lake', 'garden', 'recreation', 'shore', 'statue', 'monument'],
            'stadium': ['stadium', 'ground', 'sports'],
            'station': ['station', 'transit', 'railway', 'terminal', 'link', 'suburban'],
            'bus': ['bus', 'terminal', 'bmtc', 'ksrtc', 'stand']
        };

        container.querySelectorAll('.js-explore-item').forEach(el => {
            const searchTerm = el.dataset.searchTerm;
            const itemLines = el.dataset.lines.split(' ');
            
            // Multi-word search
            const matchesSearch = searchWords.length === 0 || searchWords.every(word => searchTerm.includes(word));
            
            let matchesCat = cat === 'all';
            let matchesLine = line === 'all' || itemLines.includes(line);
            
            if (!matchesCat && catMap[cat]) {
                matchesCat = catMap[cat].some(keyword => searchTerm.includes(keyword.toLowerCase()));
            }
            
            el.style.display = matchesSearch && matchesCat && matchesLine ? 'flex' : 'none';
        });
        
        // Update section labels visibility
        container.querySelectorAll('.explore-section-label').forEach(label => {
            let next = label.nextElementSibling;
            let hasVisible = false;
            while (next && next.classList.contains('js-explore-item')) {
                if (next.style.display !== 'none') { hasVisible = true; break; }
                next = next.nextElementSibling;
            }
            label.style.display = hasVisible ? 'flex' : 'none';
        });

        // Show "No results" if nothing found
        const anyVisible = Array.from(container.querySelectorAll('.js-explore-item')).some(el => el.style.display !== 'none');
        let emptyMsg = container.querySelector('#explore-empty-msg');
        if (!anyVisible) {
            if (!emptyMsg) {
                const msg = document.createElement('div');
                msg.id = 'explore-empty-msg';
                msg.className = 'text-center py-10 opacity-60';
                msg.innerHTML = `<i data-lucide="search-x" class="w-10 h-10 mx-auto mb-3"></i><p>No results found for "${term}"</p>`;
                container.querySelector('#explore-list-content').appendChild(msg);
                if (window.lucide) window.lucide.createIcons();
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterExplore);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-pink-500/10', 'text-pink-500', 'border-pink-500/20');
                b.classList.add('bg-card-subtle', 'text-secondary', 'border-subtle');
            });
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active', 'bg-pink-500/10', 'text-pink-500', 'border-pink-500/20');
            clickedBtn.classList.remove('bg-card-subtle', 'text-secondary', 'border-subtle');
            currentCategory = clickedBtn.dataset.cat;
            filterExplore();
        });
    });

    lineBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            lineBtns.forEach(b => {
                b.classList.remove('active', 'bg-gray-500/10', 'bg-purple-500/10', 'bg-green-500/10', 'bg-yellow-500/10');
                b.style.transform = 'scale(1)';
            });
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('active');
            clickedBtn.style.transform = 'scale(1.05)';
            currentLine = clickedBtn.dataset.line;
            filterExplore();
        });
    });
}


function renderExploreCard(s, knName, placesStr, lines) {
    const searchTerm = `${s.name} ${knName} ${placesStr || ''}`.toLowerCase();
    const l = lang();
    
    return `<div class="explore-card js-explore-item" 
         data-search-term="${searchTerm}" 
         data-lines="${lines}"
         onclick="window.showExploreStation('${s.name.replace(/'/g, "\\'")}')">
        ${s.count > 0 ? `
        <div class="relative w-[70px] h-[70px] rounded-lg overflow-hidden shrink-0 border border-subtle bg-slate-800">
            <img src="${s.image}" alt="${s.name}" class="w-full h-full object-cover">
            <div class="absolute bottom-1 left-1.5 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 opacity-90">${s.count} Places</div>
        </div>
        ` : ''}
        <div class="explore-card-content ${s.count > 0 ? 'ml-3' : ''}">
            <div class="explore-card-name">${T_STATION_fn(s.name)}</div>
            ${knName && l === 'en' ? `<div class="explore-card-kn">${knName}</div>` : ''}
            <div class="flex items-center gap-1.5 mt-1.5">
                ${s.lines.map(lineKey => `<div class="w-1.5 h-1.5 rounded-full" style="background:${metroData[lineKey].color}"></div>`).join('')}
                <div class="explore-card-action ml-1" style="${s.count > 0 ? 'color: #ec4899;' : ''}">
                    ${s.count > 0 ? `Explore Nearby <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>` : `<span class="text-secondary text-[10px]">No places listed</span>`}
                </div>
            </div>
        </div>
    </div>`;
}

// ═══════════════════════════════════════
// EXPLORE STATION DETAIL (Places list)
// ═══════════════════════════════════════
export function renderExploreStation(container, stationName) {
    const places = stationPlaces[stationName] || [];
    const meta = stationsMeta.find(s => s.name === stationName);
    const knName = meta?.name_kn || '';

    let html = `<div class="detail-back" onclick="window.showExplore()">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> <span>${T_fn('back') || 'Back'}</span>
    </div>
    <div class="explore-station-header">
        <h3 class="explore-station-name">${T_STATION_fn(stationName)}</h3>
        ${knName ? `<p class="explore-station-kn">${knName}</p>` : ''}
        <p class="explore-station-count">${places.length} place${places.length !== 1 ? 's' : ''} nearby</p>
    </div>`;

    const l = lang();
    if (places.length === 0) {
        html += `<div class="no-places"><i data-lucide="map-pin-off" class="w-8 h-8 text-secondary"></i><p>No interesting places listed near this station.</p></div>`;
    } else {
        places.forEach((p, idx) => {
            const knPlaceName = p.nameKn || '';
            const name = l === 'kn' ? (knPlaceName || p.name) : (l === 'hi' && p.nameHi ? p.nameHi : p.name);
            const distText = p.distance_km ? `${p.distance_km} km` : '';
            const walkText = p.walk_time_min ? `${p.walk_time_min} min walk` : (p.last_mile ? 'Auto/Cab recommended' : '');
            const pImage = p.image || `https://images.unsplash.com/photo-1620063251433-875c742c3ff2?auto=format&fit=crop&q=80&w=150&h=150&sig=${p.id.length + idx}`;

            html += `<div class="place-card relative" onclick="window.showPlaceDetail('${stationName.replace(/'/g, "\\'")}', '${p.id}')">
                <div class="relative w-[70px] h-[70px] rounded-lg overflow-hidden shrink-0 border border-subtle bg-slate-800">
                    <img src="${pImage}" alt="${p.name}" class="w-full h-full object-cover">
                </div>
                <div class="place-card-content ml-3">
                    <div class="place-name">${name}</div>
                    ${knPlaceName && l === 'en' ? `<div class="place-name-kn">${knPlaceName}</div>` : ''}
                    <div class="place-type mt-1">${getLocalizedPlaceType(p)}</div>
                    <div class="place-distance">
                        ${distText ? `<span><i data-lucide="navigation" class="w-3 h-3 text-secondary"></i> ${distText}</span>` : ''}
                        ${walkText ? `<span><i data-lucide="footprints" class="w-3 h-3 text-secondary"></i> ${walkText}</span>` : ''}
                    </div>
                </div>
                <i data-lucide="chevron-right" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary"></i>
            </div>`;
        });
    }

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

function getLocalizedPlaceType(p) {
    const l = lang();
    const typeMap = {
        "Transit Hub": "typeTransit", "Convention": "typeConvention", "Heritage": "typeHeritage",
        "EV Charger": "typeEV", "University": "typeUniversity", "Hospital": "typeHospital",
        "Mall": "typeMall", "Museum": "typeMuseum", "Stadium": "typeStadium", "Market": "typeMarket",
        "Park": "typePark", "Lake": "typeLake", "IT Hub": "typeIT"
    };
    const key = typeMap[p.type];
    if (key && T_fn(key)) return T_fn(key);
    return l === 'kn' ? (p.typeKn || p.type) : p.type;
}

// ═══════════════════════════════════════
// PLACE DETAIL VIEW
// ═══════════════════════════════════════
export function renderPlaceDetail(container, stationName, placeId) {
    const places = stationPlaces[stationName] || [];
    const p = places.find(a => a.id === placeId);
    if (!p) { container.innerHTML = '<p class="text-secondary p-4">Place not found.</p>'; return; }

    const l = lang();
    const name = l === 'kn' ? (p.nameKn || p.name) : (l === 'hi' && p.nameHi ? p.nameHi : p.name);
    const desc = p.description || p.summary || '';
    const distText = p.distance_km ? `${p.distance_km} km from station` : '';
    const walkText = p.walk_time_min ? `${p.walk_time_min} min walk` : '';
    const driveText = p.approx_drive_time_min ? `~${p.approx_drive_time_min} min by auto/cab` : '';

    let html = `<div class="detail-back" onclick="window.showExploreStation('${stationName.replace(/'/g, "\\'")}')">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> <span>${T_fn('back') || 'Back'}</span>
    </div>

    <div class="place-detail-header relative overflow-hidden min-h-[160px] flex flex-col justify-end p-4 rounded-xl mb-4 border border-subtle">
        <div class="absolute inset-0 bg-slate-800 z-0">
            <img src="${p.image || `https://images.unsplash.com/photo-1620063251433-875c742c3ff2?auto=format&fit=crop&q=80&w=800&h=400&sig=${p.id.length}`}" alt="${name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        <div class="relative z-10 text-white">
            <h3 class="text-xl font-bold">${name}</h3>
            ${p.nameKn && l === 'en' ? `<p class="text-sm text-slate-300 mt-1">${p.nameKn}</p>` : ''}
            <div class="inline-block mt-3 px-2 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold tracking-wider rounded-md text-[10px] uppercase">${getLocalizedPlaceType(p)}</div>
        </div>
    </div>

    <div class="place-detail-body">
        <p class="place-detail-desc">${desc}</p>

        <div class="place-info-grid">
            ${distText ? `<div class="place-info-item"><i data-lucide="navigation" class="w-4 h-4"></i><span>${distText}</span></div>` : ''}
            ${walkText ? `<div class="place-info-item"><i data-lucide="footprints" class="w-4 h-4"></i><span>${walkText}</span></div>` : ''}
            ${driveText ? `<div class="place-info-item"><i data-lucide="car" class="w-4 h-4"></i><span>${driveText}</span></div>` : ''}
            ${p.entry_fee ? `<div class="place-info-item"><i data-lucide="ticket" class="w-4 h-4"></i><span>${T_fn('entryFee') || 'Entry Fee'}: ${p.entry_fee}</span></div>` : ''}
            ${p.best_time ? `<div class="place-info-item"><i data-lucide="clock" class="w-4 h-4"></i><span>${T_fn('bestTime') || 'Best Time'}: ${p.best_time}</span></div>` : ''}
        </div>

        ${p.maps_link ? `<a href="${p.maps_link}" target="_blank" rel="noopener" class="maps-link-btn"><i data-lucide="map" class="w-4 h-4"></i> ${T_fn('openMaps') || 'Open in Maps'}</a>` : ''}
    </div>`;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}
