import { metroData, translations, stationTranslations } from '../data/stations.js';

export class CustomDropdown {
    constructor(containerId, placeholder, type, onChangeCallback) {
        this.container = document.getElementById(containerId);
        this.placeholder = placeholder;
        this.type = type; // "start" or "end"
        this.onChange = onChangeCallback;
        this.stations = [];
        this.filteredStations = [];
        this.selectedValue = null;
        this.isOpen = false;

        this.initData();
        this.render();
        this.attachEventListeners();
    }

    initData() {
        // Flatten stations from metroData
        const allStations = [];
        const seen = new Set();

        Object.values(metroData).forEach(line => {
            line.stations.forEach(station => {
                if (!seen.has(station.name)) {
                    // Find lines for this station
                    const lines = [];
                    Object.values(metroData).forEach(l => {
                        if (l.stations.some(s => s.name === station.name)) {
                            lines.push(l.color);
                        }
                    });

                    allStations.push({
                        id: station.id, // Use ID of first occurrence
                        name: station.name,
                        lines: lines, // Array of colors
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
        this.container.innerHTML = `
            <div class="custom-dropdown">
                <div class="dropdown-trigger" id="trigger-${this.container.id}" tabindex="0">
                    <span class="flex items-center">
                        <span class="trigger-dots" id="dots-${this.container.id}"></span>
                        <span id="selected-${this.container.id}">${this.placeholder}</span>
                    </span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                </div>
                <div class="dropdown-menu custom-scrollbar" id="menu-${this.container.id}">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Search station..." id="search-${this.container.id}">
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
        if (this.filteredStations.length === 0) {
            list.innerHTML = `<div class="no-results">No stations found</div>`;
            return;
        }

        list.innerHTML = this.filteredStations.map(station => {
            const dots = station.lines.map(color =>
                `<span class="dot" style="background-color: ${color}"></span>`
            ).join('');

            // Translate name if T func exists, else raw
            const displayName = window.T_STATION ? window.T_STATION(station.name) : station.name;
            const isSelected = this.selectedValue === station.id ? 'selected' : '';

            return `
                <div class="station-option ${isSelected}" data-value="${station.id}">
                     <div class="station-dots">${dots}</div>
                     <span>${displayName}</span>
                </div>
            `;
        }).join('');

        // Re-attach click listeners to options
        list.querySelectorAll('.station-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const value = option.dataset.value;
                this.select(value);
            });
        });
    }

    select(value) {
        // Find station by ID prefix (since IDs might differ across lines for same station name, we used first occurrence ID)
        // Actually best to select by name match to find the object in this.stations
        // But value passed is ID.
        // Let's find matches.

        let station = this.stations.find(s => s.id === value);
        // Fallback: search by name corresponding to this ID if exact ID not in list (merged list)
        if (!station) {
            // value might be G20 but our list has P20 for Majestic.
            // Find in metroData to get name
            let name = null;
            for (const lineKey in metroData) {
                const s = metroData[lineKey].stations.find(st => st.id === value);
                if (s) { name = s.name; break; }
            }
            if (name) station = this.stations.find(s => s.name === name);
        }

        if (station) {
            this.selectedValue = station.id;
            const displayName = window.T_STATION ? window.T_STATION(station.name) : station.name;
            document.getElementById(`selected-${this.container.id}`).textContent = displayName;
            document.getElementById(`selected-${this.container.id}`).className = "text-white font-medium";

            // Update trigger dots
            const dotsContainer = document.getElementById(`dots-${this.container.id}`);
            dotsContainer.innerHTML = station.lines.map(color =>
                `<span class="trigger-dot" style="background-color: ${color}"></span>`
            ).join('');

            // Highlight in list if open
            this.renderOptions();

            this.close();
            if (this.onChange) this.onChange(station.id);
        }
    }

    // External select by ID
    selectById(id) {
        this.select(id);
    }

    toggle() {
        if (this.isOpen) this.close(); else this.open();
    }

    open() {
        this.isOpen = true;
        const menu = document.getElementById(`menu-${this.container.id}`);
        menu.classList.add('open');
        document.getElementById(`search-${this.container.id}`).focus();

        // Reset search
        document.getElementById(`search-${this.container.id}`).value = '';
        this.filter('');
    }

    close() {
        this.isOpen = false;
        document.getElementById(`menu-${this.container.id}`).classList.remove('open');
    }

    filter(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredStations = this.stations.filter(s => {
            const rawName = s.name.toLowerCase();
            const translatedName = window.T_STATION ? window.T_STATION(s.name).toLowerCase() : '';
            return rawName.includes(lowerQuery) || translatedName.includes(lowerQuery);
        });
        this.renderOptions();
    }

    refreshTranslations() {
        // Update selected text
        if (this.selectedValue) this.select(this.selectedValue);
        // Refresh options if open
        this.renderOptions();
    }

    attachEventListeners() {
        const trigger = document.getElementById(`trigger-${this.container.id}`);
        const searchInput = document.getElementById(`search-${this.container.id}`);

        trigger.addEventListener('click', (e) => {
            this.toggle();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        searchInput.addEventListener('input', (e) => {
            this.filter(e.target.value);
        });

        // Keyboard Nav (Basic)
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
}
