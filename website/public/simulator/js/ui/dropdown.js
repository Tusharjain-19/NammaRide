import { metroData, translations, stationTranslations } from '../data/stations.js';
import { T, T_STATION } from '../utils/helpers.js';
import { matchStation } from '../utils/fuzzySearch.js';

export class CustomDropdown {
    constructor(containerId, placeholderKey, type, onChangeCallback) {
        this.container = document.getElementById(containerId);
        this.placeholderKey = placeholderKey;
        this.type = type; // "start" or "end"
        this.onChange = onChangeCallback;
        this.stations = [];
        this.filteredStations = [];
        this.selectedValue = null;
        this.excludedStationName = null;
        this.isOpen = false;
        this.isLooping = false;

        this.initData();
        this.render();
        this.attachEventListeners();
    }

    getSelectedStationName() {
        if (!this.selectedValue) return null;
        const station = this.stations.find(s => s.id === this.selectedValue);
        return station ? station.name : null;
    }

    setExcludedStationName(name) {
        this.excludedStationName = name;
        if (this.selectedValue) {
            const currentSelected = this.stations.find(s => s.id === this.selectedValue);
            if (currentSelected && currentSelected.name === name) {
                this.clearSelection();
                return;
            }
        }
        const searchInput = document.getElementById(`search-${this.container.id}`);
        this.filter(searchInput ? searchInput.value : '');
    }

    clearSelection() {
        this.selectedValue = null;
        const placeholder = T(this.placeholderKey);
        const selectedEl = document.getElementById(`selected-${this.container.id}`);
        if (selectedEl) {
            selectedEl.innerHTML = placeholder;
            selectedEl.className = "text-primary font-medium text-sm";
        }
        const dotsContainer = document.getElementById(`dots-${this.container.id}`);
        if (dotsContainer) {
            dotsContainer.classList.add('hidden');
            dotsContainer.innerHTML = '';
        }
        if (this.container.id === 'start-station-dropdown') {
            const hiddenInput = document.getElementById('start-station');
            if (hiddenInput) hiddenInput.value = '';
        } else if (this.container.id === 'end-station-dropdown') {
            const hiddenInput = document.getElementById('end-station');
            if (hiddenInput) hiddenInput.value = '';
        }
        const searchInput = document.getElementById(`search-${this.container.id}`);
        this.filter(searchInput ? searchInput.value : '');
        if (this.onChange) this.onChange(null);
    }

    initData() {
        const allStations = [];
        const seen = new Set();

        Object.values(metroData).forEach(line => {
            line.stations.forEach(station => {
                if (!seen.has(station.name)) {
                    const lines = [];
                    Object.values(metroData).forEach(l => {
                        if (l.stations.some(s => s.name === station.name)) {
                            lines.push(l.color);
                        }
                    });

                    allStations.push({
                        id: station.id,
                        name: station.name,
                        lines: lines,
                        originalObj: station
                    });
                    seen.add(station.name);
                }
            });
        });

        this.stations = allStations.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredStations = [...this.stations];
    }

    render() {
        const placeholder = T(this.placeholderKey);
        this.container.innerHTML = `
            <div class="custom-dropdown">
                <div class="dropdown-trigger flex items-center justify-between px-4 py-3 cursor-pointer" id="trigger-${this.container.id}" tabindex="0">
                    <span class="flex items-center gap-3">
                        <i data-lucide="map-pin" class="w-5 h-5 text-accent-color opacity-80"></i>
                        <span class="trigger-dots hidden" id="dots-${this.container.id}"></span>
                        <span id="selected-${this.container.id}" class="text-primary font-medium text-sm">${placeholder}</span>
                    </span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-secondary opacity-50"></i>
                </div>
                <div class="dropdown-menu custom-scrollbar" id="menu-${this.container.id}">
                    <div class="search-container p-3 border-b border-subtle">
                        <input type="text" class="search-input w-full bg-input border border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-color/20" 
                               placeholder="${T('navPlan')}..." id="search-${this.container.id}">
                    </div>
                    <div class="station-list" id="list-${this.container.id}">
                        <!-- Options injected here -->
                    </div>
                </div>
            </div>
        `;
        this.renderOptions();
    }

    renderOptions() {
        const list = document.getElementById(`list-${this.container.id}`);
        if (!list) return;

        if (this.filteredStations.length === 0) {
            list.innerHTML = `<div class="no-results">No stations found</div>`;
            this.isLooping = false;
            return;
        }

        this.isLooping = this.filteredStations.length > 4;
        const displaySet = this.isLooping 
            ? [...this.filteredStations, ...this.filteredStations, ...this.filteredStations]
            : this.filteredStations;

        list.innerHTML = displaySet.map(station => {
            const dots = station.lines.map(color =>
                `<span class="dot" style="background-color: ${color}"></span>`
            ).join('');

            const displayName = T_STATION(station.name);
            const isSelected = this.selectedValue === station.id ? 'selected' : '';

            return `
                <div class="station-option ${isSelected}" data-value="${station.id}" data-station-name="${station.name}">
                     <div class="station-dots">${dots}</div>
                     <span>${displayName}</span>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.station-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                this.select(value);
            });
        });

        if (this.isLooping) {
            requestAnimationFrame(() => {
                const oneSetHeight = list.scrollHeight / 3;
                if (list.scrollTop === 0) {
                    list.scrollTop = oneSetHeight;
                }
            });
        }
    }

    select(value) {
        let station = this.stations.find(s => s.id === value);
        if (!station) {
            let name = null;
            for (const lineKey in metroData) {
                const s = metroData[lineKey].stations.find(st => st.id === value);
                if (s) { name = s.name; break; }
            }
            if (name) station = this.stations.find(s => s.name === name);
        }

        if (station) {
            this.selectedValue = station.id;
            const displayName = T_STATION(station.name);
            document.getElementById(`selected-${this.container.id}`).innerHTML = displayName;
            document.getElementById(`selected-${this.container.id}`).className = "text-primary font-medium";

            const dotsContainer = document.getElementById(`dots-${this.container.id}`);
            dotsContainer.classList.remove('hidden');
            dotsContainer.innerHTML = station.lines.map(color =>
                `<span class="trigger-dot" style="background-color: ${color}"></span>`
            ).join('');

            this.renderOptions();

            if (window.lucide) window.lucide.createIcons();

            this.close();
            if (this.onChange) this.onChange(station.id);
        }
    }

    selectById(id) {
        this.select(id);
    }

    toggle() {
        if (this.isOpen) this.close(); else this.open();
    }

    open() {
        this.isOpen = true;
        const menu = document.getElementById(`menu-${this.container.id}`);
        if (menu) menu.classList.add('open');
        this.container.classList.add('dropdown-open');
        if (this.container.parentElement) {
            this.container.parentElement.classList.add('dropdown-open');
        }
        const searchInput = document.getElementById(`search-${this.container.id}`);
        if (searchInput) {
            searchInput.value = '';
            this.filter('');
            searchInput.focus();
        }

        // Auto-scroll to currently selected station OR nearest station
        const list = document.getElementById(`list-${this.container.id}`);
        if (list) {
            setTimeout(() => {
                let targetId = this.selectedValue || window.nearestStationId;
                let targetOpt = null;
                if (targetId) {
                    targetOpt = list.querySelector(`.station-option[data-value="${targetId}"]`);
                }
                if (!targetOpt && window.nearestStationName) {
                    const opts = Array.from(list.querySelectorAll('.station-option'));
                    targetOpt = opts.find(opt => opt.dataset.stationName === window.nearestStationName || opt.innerText.includes(window.nearestStationName));
                }

                if (targetOpt) {
                    const listRect = list.getBoundingClientRect();
                    const optRect = targetOpt.getBoundingClientRect();
                    const offset = (optRect.top - listRect.top) - (listRect.height / 2) + (optRect.height / 2);
                    list.scrollTop += offset;
                } else if (this.isLooping) {
                    const oneSetHeight = list.scrollHeight / 3;
                    list.scrollTop = oneSetHeight;
                }
            }, 60);
        }
    }

    close() {
        this.isOpen = false;
        const menu = document.getElementById(`menu-${this.container.id}`);
        if (menu) menu.classList.remove('open');
        this.container.classList.remove('dropdown-open');
        if (this.container.parentElement) {
            this.container.parentElement.classList.remove('dropdown-open');
        }
    }

    filter(query) {
        this.filteredStations = this.stations.filter(s => {
            if (this.excludedStationName && s.name === this.excludedStationName) {
                return false;
            }
            const rawName = s.name;
            const translatedName = T_STATION(s.name);
            const code = s.originalObj ? s.originalObj.code || '' : '';
            return matchStation(rawName, query, translatedName, code);
        });
        this.renderOptions();
    }

    refreshTranslations() {
        if (!this.selectedValue) {
            const placeholder = T(this.placeholderKey);
            document.getElementById(`selected-${this.container.id}`).innerText = placeholder;
        } else {
            this.select(this.selectedValue);
        }
        
        const searchInput = document.getElementById(`search-${this.container.id}`);
        if (searchInput) {
            searchInput.placeholder = T('navPlan') + '...';
        }

        this.renderOptions();
    }

    attachEventListeners() {
        const trigger = document.getElementById(`trigger-${this.container.id}`);
        const searchInput = document.getElementById(`search-${this.container.id}`);
        const list = document.getElementById(`list-${this.container.id}`);

        trigger.addEventListener('click', (e) => {
            this.toggle();
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        searchInput.addEventListener('input', (e) => {
            this.filter(e.target.value);
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });

        if (list) {
            list.addEventListener('scroll', () => {
                if (!this.isLooping) return;
                const oneSetHeight = list.scrollHeight / 3;
                if (oneSetHeight <= 0) return;

                if (list.scrollTop <= 15) {
                    list.scrollTop += oneSetHeight;
                } else if (list.scrollTop >= (oneSetHeight * 2) - 15) {
                    list.scrollTop -= oneSetHeight;
                }
            }, { passive: true });

            let isDragging = false;
            let startY = 0;
            let scrollTopStart = 0;

            list.addEventListener('mousedown', (e) => {
                isDragging = true;
                startY = e.pageY - list.offsetTop;
                scrollTopStart = list.scrollTop;
                list.style.cursor = 'grabbing';
                list.style.userSelect = 'none';
            });

            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    list.style.cursor = 'pointer';
                    list.style.removeProperty('user-select');
                }
            });

            list.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const y = e.pageY - list.offsetTop;
                const walk = (y - startY) * 1.5;
                list.scrollTop = scrollTopStart - walk;
            });
        }
    }
}
