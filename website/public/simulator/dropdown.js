class CustomDropdown {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.stations = [];
        this.filteredStations = [];
        this.selectedStationId = this.container ? this.container.getAttribute('data-value') : null;
        this.isOpen = false;
        this.isLooping = false;

        this.placeholder = options.placeholder || "Select Station";
        this.onChange = options.onChange || (() => { });

        if (this.container) {
            this.init();
        }
    }

    init() {
        this.container.innerHTML = `
            <div class="custom-dropdown">
                <div class="dropdown-trigger" tabindex="0">
                    <div class="flex items-center">
                        <span class="trigger-dots"></span>
                        <span class="selected-text">${this.placeholder}</span>
                    </div>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                </div>
                <div class="dropdown-menu">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Search station..." onClick="event.stopPropagation()">
                    </div>
                    <div class="station-list custom-scrollbar"></div>
                </div>
            </div>
        `;

        this.trigger = this.container.querySelector('.dropdown-trigger');
        this.menu = this.container.querySelector('.dropdown-menu');
        this.list = this.container.querySelector('.station-list');
        this.searchInput = this.container.querySelector('.search-input');
        this.triggerDots = this.container.querySelector('.trigger-dots');
        this.selectedText = this.container.querySelector('.selected-text');

        // Event Listeners
        this.trigger.addEventListener('click', () => this.toggle());
        this.searchInput.addEventListener('input', (e) => this.filterStations(e.target.value));

        this.menu.addEventListener('click', (e) => e.stopPropagation());

        this.list.addEventListener('scroll', () => {
            if (!this.isLooping) return;
            const oneSetHeight = this.list.scrollHeight / 3;
            if (oneSetHeight <= 0) return;

            if (this.list.scrollTop <= 15) {
                this.list.scrollTop += oneSetHeight;
            } else if (this.list.scrollTop >= (oneSetHeight * 2) - 15) {
                this.list.scrollTop -= oneSetHeight;
            }
        }, { passive: true });

        let isDragging = false;
        let startY = 0;
        let scrollTopStart = 0;

        this.list.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.pageY - this.list.offsetTop;
            scrollTopStart = this.list.scrollTop;
            this.list.style.cursor = 'grabbing';
            this.list.style.userSelect = 'none';
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                this.list.style.cursor = 'pointer';
                this.list.style.removeProperty('user-select');
            }
        });

        this.list.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.pageY - this.list.offsetTop;
            const walk = (y - startY) * 1.5;
            this.list.scrollTop = scrollTopStart - walk;
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });
    }

    setStations(stationsData) {
        const allStations = [];

        Object.values(stationsData).forEach(line => {
            line.stations.forEach(station => {
                const existing = allStations.find(s => s.name === station.name);
                if (existing) {
                    existing.lines.push(line.color);
                    if (!existing.ids.includes(station.id)) existing.ids.push(station.id);
                } else {
                    allStations.push({
                        name: station.name,
                        lines: [line.color],
                        ids: [station.id],
                        masterId: station.id
                    });
                }
            });
        });

        this.stations = allStations.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredStations = this.stations;
        this.renderList();

        if (this.selectedStationId) {
            this.selectById(this.selectedStationId);
        }
    }

    renderList() {
        if (!this.list) return;

        if (this.filteredStations.length === 0) {
            this.list.innerHTML = `<div class="no-results">No stations found</div>`;
            this.isLooping = false;
            return;
        }

        this.isLooping = this.filteredStations.length > 4;
        const displaySet = this.isLooping
            ? [...this.filteredStations, ...this.filteredStations, ...this.filteredStations]
            : this.filteredStations;

        this.list.innerHTML = displaySet.map(station => `
            <div class="station-option ${this.isSelected(station) ? 'selected' : ''}" data-id="${station.masterId}" data-station-name="${station.name}">
                <div class="station-dots">
                    ${station.lines.map(color => `<span class="dot" style="background-color: ${color}"></span>`).join('')}
                </div>
                <span>${this.getTranslatedName(station.name)}</span>
            </div>
        `).join('');

        this.list.querySelectorAll('.station-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = option.dataset.id;
                this.select(id);
                this.close();
            });
        });

        if (this.isLooping) {
            requestAnimationFrame(() => {
                const oneSetHeight = this.list.scrollHeight / 3;
                if (this.list.scrollTop === 0) {
                    this.list.scrollTop = oneSetHeight;
                }
            });
        }
    }

    isSelected(station) {
        if (!this.selectedStationId) return false;
        return station.ids.includes(this.selectedStationId) || station.masterId === this.selectedStationId;
    }

    getTranslatedName(name) {
        if (typeof window.T_STATION === 'function') {
            return window.T_STATION(name);
        }
        return name;
    }

    filterStations(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredStations = this.stations.filter(s =>
            s.name.toLowerCase().includes(lowerQuery) ||
            this.getTranslatedName(s.name).toLowerCase().includes(lowerQuery)
        );
        this.renderList();
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        this.isOpen = true;
        this.menu.classList.add('open');
        this.trigger.querySelector('i').setAttribute('data-lucide', 'chevron-up');
        if (window.lucide) lucide.createIcons();
        this.searchInput.focus();

        // Auto-scroll to selected or nearest station
        setTimeout(() => {
            let targetId = this.selectedStationId || window.nearestStationId;
            let targetOpt = null;
            if (targetId) {
                targetOpt = this.list.querySelector(`.station-option[data-id="${targetId}"]`);
            }
            if (!targetOpt && window.nearestStationName) {
                const opts = Array.from(this.list.querySelectorAll('.station-option'));
                targetOpt = opts.find(opt => opt.dataset.stationName === window.nearestStationName || opt.innerText.includes(window.nearestStationName));
            }

            if (targetOpt) {
                const listRect = this.list.getBoundingClientRect();
                const optRect = targetOpt.getBoundingClientRect();
                const offset = (optRect.top - listRect.top) - (listRect.height / 2) + (optRect.height / 2);
                this.list.scrollBy({ top: offset, behavior: 'smooth' });
            } else if (this.isLooping) {
                const oneSetHeight = this.list.scrollHeight / 3;
                this.list.scrollTop = oneSetHeight;
            }
        }, 60);
    }

    close() {
        this.isOpen = false;
        this.menu.classList.remove('open');
        this.trigger.querySelector('i').setAttribute('data-lucide', 'chevron-down');
        if (window.lucide) lucide.createIcons();
        this.searchInput.value = '';
        this.filteredStations = this.stations;
        this.renderList();
    }

    select(id) {
        const station = this.stations.find(s => s.ids.includes(id) || s.masterId === id);
        if (!station) return;

        this.selectedStationId = id;
        this.selectedText.textContent = this.getTranslatedName(station.name);
        this.selectedText.classList.add('text-white', 'font-medium');

        this.triggerDots.innerHTML = station.lines.map(color =>
            `<span class="trigger-dot" style="background-color: ${color}"></span>`
        ).join('');

        this.renderList();
        this.onChange(id);
    }

    selectById(id) {
        this.select(id);
    }

    refreshTranslations() {
        if (this.selectedStationId) this.select(this.selectedStationId);
        this.renderList();
    }
}

window.CustomDropdown = CustomDropdown;
