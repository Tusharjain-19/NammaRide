const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Update sections.js (both website/public/simulator/js/ui/sections.js and website/js/ui/sections.js)
const sectionsFiles = [
    path.join(ROOT_DIR, 'website/public/simulator/js/ui/sections.js'),
    path.join(ROOT_DIR, 'website/js/ui/sections.js')
];

const newRenderTimings = `export function renderTimings(container) {
    if (!container) container = document.getElementById('timings-view');
    if (!container) return;

    try {
        const l = lang();
        if (viewCache.timings.lang === l && viewCache.timings.html) {
            container.innerHTML = viewCache.timings.html;
            attachTimingsEvents(container);
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        let html = \`<div class="section-header">
            <h2 class="section-title">\${T_fn('timings') || 'Timings'}</h2>
            <p class="section-subtitle">Official BMRCL Schedule • 2025-26</p>
        </div>

        <!-- Last Train Interchange Advisory Banner -->
        <div class="mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            </div>
            <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-xs font-black text-amber-500 dark:text-amber-400 uppercase tracking-wider">Last Train Interchange Advisory</h4>
                    <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400">11:20 PM Cut-off</span>
                </div>
                <p class="text-xs text-secondary leading-relaxed">
                    Connecting trains at <strong>Nadaprabhu Kempegowda Stn. Majestic</strong> depart at <strong>11:20 PM</strong>. To guarantee your connection between Purple and Green lines, board your initial train before <strong>10:25 PM</strong> from outer stations (Whitefield, Challaghatta, Madavara, Silk Institute).
                </p>
            </div>
        </div>\`;

        Object.entries(timingsData || {}).forEach(([key, line]) => {
            const primarySched = line.schedules?.mon_fri || line.schedules?.mon_sat || (line.schedules ? Object.values(line.schedules)[0] : null);
            
            let firstTrainStart = '05:00 AM';
            if (primarySched?.from_start?.[0]?.range) {
                firstTrainStart = primarySched.from_start[0].range.split('-')[0].trim();
            } else if (line.weekday?.firstTrain?.from_start) {
                firstTrainStart = line.weekday.firstTrain.from_start;
            }

            let lastTrainEnd = '11:05 PM';
            const endArr = primarySched?.from_end || primarySched?.from_start;
            if (endArr && endArr.length > 0) {
                const lastItem = endArr[endArr.length - 1];
                if (lastItem?.range) {
                    const parts = lastItem.range.split('-');
                    lastTrainEnd = parts[parts.length - 1].trim();
                }
            } else if (line.weekday?.lastTrain?.from_end || line.weekday?.lastTrain?.from_start) {
                lastTrainEnd = line.weekday.lastTrain.from_end || line.weekday.lastTrain.from_start;
            }

            let peakFreq = '5-10 min';
            if (primarySched?.from_start && primarySched.from_start.length > 2 && primarySched.from_start[2]?.frequency) {
                peakFreq = primarySched.from_start[2].frequency;
            } else if (line.weekday?.peakFrequency) {
                peakFreq = line.weekday.peakFrequency;
            }

            html += \`<div class="timing-card" style="border-left: 3px solid \${line.color || '#10B981'}">
                <div class="timing-card-header">
                    <span class="line-dot" style="background:\${line.color || '#10B981'}"></span>
                    <div class="flex-grow">
                        <h4 class="timing-line-name">\${T_STATION_fn(line.name)}</h4>
                        <p class="timing-route">\${line.route || ''}</p>
                        <p class="timing-stations">\${line.stations || 0} stations</p>
                    </div>
                </div>

                <!-- First/Last Train Quick Summary Grid -->
                <div class="grid grid-cols-3 gap-2 mt-3 mb-4">
                    <div class="p-2.5 bg-card-subtle rounded-xl border border-subtle text-center">
                        <div class="text-[9px] uppercase font-bold text-secondary tracking-wider">First Train</div>
                        <div class="text-xs font-extrabold text-emerald-400 mt-0.5">\${firstTrainStart}</div>
                    </div>
                    <div class="p-2.5 bg-card-subtle rounded-xl border border-subtle text-center">
                        <div class="text-[9px] uppercase font-bold text-secondary tracking-wider">Last Train</div>
                        <div class="text-xs font-extrabold text-amber-400 mt-0.5">\${lastTrainEnd}</div>
                    </div>
                    <div class="p-2.5 bg-card-subtle rounded-xl border border-subtle text-center">
                        <div class="text-[9px] uppercase font-bold text-secondary tracking-wider">Peak Freq</div>
                        <div class="text-xs font-extrabold text-indigo-400 mt-0.5">\${peakFreq}</div>
                    </div>
                </div>\`;

            // Day Selection Tabs for this line (Consolidated)
            html += \`<div class="timing-tabs flex gap-2 px-1 overflow-x-auto pb-2 custom-scrollbar" id="tabs-\${key}">\`;
            Object.keys(line.schedules || {}).forEach((dayKey, idx) => {
                const dayTitle = line.schedules[dayKey]?.title || dayKey;
                html += \`<button class="timing-tab-btn \${idx === 0 ? 'active' : ''}" data-line="\${key}" data-day="\${dayKey}">\${dayTitle}</button>\`;
            });
            html += \`</div>\`;

            // Schedule Content (First day visible by default)
            html += \`<div class="timing-schedule-container mt-2" id="schedule-container-\${key}">\`;
            Object.entries(line.schedules || {}).forEach(([dayKey, schedule], idx) => {
                const terminals = (line.route || '').split(/ ↔ | <-> /);
                const termA = terminals[0] ? terminals[0].trim() : 'Terminal A';
                const termB = terminals[1] ? terminals[1].trim() : 'Terminal B';

                const startList = schedule.from_start || [];
                const endList = schedule.from_end || schedule.from_start || [];

                html += \`<div class="timing-day-schedule \${idx === 0 ? '' : 'hidden'}" id="schedule-\${key}-\${dayKey}">
                    <div class="timing-table-wrapper">
                        <div class="grid grid-cols-2 gap-3 p-3 bg-card-subtle rounded-xl border border-subtle">
                            <!-- Direction A -->
                            <div>
                                <div class="text-[10px] sub-heading uppercase font-bold text-emerald-400 mb-2 truncate">From \${termB}</div>
                                <div class="space-y-1.5">
                                    \${startList.map(item => \`
                                        <div class="flex justify-between items-center py-1 border-b border-subtle/40 text-[11px]">
                                            <span class="text-primary font-semibold">\${item.range}</span>
                                            <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">\${item.frequency}</span>
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>

                            <!-- Direction B -->
                            <div>
                                <div class="text-[10px] sub-heading uppercase font-bold text-indigo-400 mb-2 truncate">From \${termA}</div>
                                <div class="space-y-1.5">
                                    \${endList.map(item => \`
                                        <div class="flex justify-between items-center py-1 border-b border-subtle/40 text-[11px]">
                                            <span class="text-primary font-semibold">\${item.range}</span>
                                            <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold text-[10px]">\${item.frequency}</span>
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>\`;
            });
            html += \`</div>\`; // End schedule-container

            // Notes section for this line
            if (line.notes && line.notes.length) {
                html += \`<div class="timing-notes mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <div class="flex items-center gap-2 mb-1.5">
                        <i data-lucide="info" class="w-3.5 h-3.5 text-amber-500"></i>
                        <span class="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Operational Notes</span>
                    </div>
                    \${line.notes.map(note => \`<p class="text-[11px] text-primary/70 leading-relaxed mb-1 last:mb-0">• \${note}</p>\`).join('')}
                </div>\`;
            }

            html += \`</div>\`; // End timing-card
        });

        container.innerHTML = html;
        viewCache.timings.lang = l;
        viewCache.timings.html = html;

        if (window.lucide) window.lucide.createIcons();
        attachTimingsEvents(container);
    } catch (err) {
        console.error('[NammaRide] Error rendering timings section:', err);
    }
}

function attachTimingsEvents(container) {
    if (!container) return;
    container.querySelectorAll('.timing-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const line = btn.dataset.line;
            const day = btn.dataset.day;

            // Update Tab Active State
            container.querySelectorAll(\`.timing-tab-btn[data-line="\${line}"]\`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show relevant schedule
            container.querySelectorAll(\`.timing-day-schedule[id^="schedule-\${line}-"]\`).forEach(s => s.classList.add('hidden'));
            const target = container.querySelector(\`#schedule-\${line}-\${day}\`);
            if (target) target.classList.remove('hidden');
        });
    });
}`;

sectionsFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        // Replace from export function renderTimings(container) down to end of attachTimingsEvents
        const startRegex = /export function renderTimings\(container\) \{[\s\S]*?function attachTimingsEvents\(container\) \{[\s\S]*?\n\}/;
        if (startRegex.test(content)) {
            content = content.replace(startRegex, newRenderTimings);
            fs.writeFileSync(f, content, 'utf8');
            console.log(`Updated renderTimings in ${f}`);
        } else {
            console.error(`Could not match renderTimings in ${f}`);
        }
    }
});

// 2. Update main.js (both website/public/simulator/js/main.js and website/js/main.js)
const mainFiles = [
    path.join(ROOT_DIR, 'website/public/simulator/js/main.js'),
    path.join(ROOT_DIR, 'website/js/main.js')
];

mainFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');

        // A. Update renderCurvedLineWorkflow to not duplicate the header
        const oldCurvedReturnRegex = /return \`\s*<!-- Connected Metro Lines -->\s*<div class="p-2\.5 bg-card-subtle\/70 rounded-xl border border-subtle mb-2\.5 flex flex-col gap-2 overflow-hidden">[\s\S]*?<!-- Connected Curved Line Flow -->/;
        const newCurvedReturn = `return \`
        <!-- Connected Metro Lines Flow -->
        <div class="p-2.5 bg-card-subtle/50 rounded-2xl border border-subtle mb-2.5 flex flex-col gap-1.5 overflow-hidden">
            <div class="flex items-center justify-between pb-1 border-b border-subtle/40 text-[11px]">
                <div class="flex items-center gap-1.5 font-black text-primary">
                    <i data-lucide="route" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>
                    <span>\${parts.length} \${parts.length === 1 ? 'Line' : 'Lines'} Route</span>
                </div>
                <span class="text-[10px] text-secondary font-medium">Tap segment to view stops</span>
            </div>

            <!-- Connected Curved Line Flow -->`;

        if (oldCurvedReturnRegex.test(content)) {
            content = content.replace(oldCurvedReturnRegex, newCurvedReturn);
            console.log(`Updated renderCurvedLineWorkflow return in ${f}`);
        }

        // B. Update updateSummaryUI Time & Fare Row, Platform/Direction boxes, and WhatsApp button
        const oldSummaryRegex = /<!-- Clean Time & Fare Row \(No Smart Card \/ Advisor Clutter\) -->[\s\S]*?<!-- Compact WhatsApp Ticket Booking Strip \(Single Slim Row\) -->[\s\S]*?<\/button>\s*<\/div>/;

        const newSummaryHtml = `<!-- Clean Time & Route Overview & Fare Row -->
            <div class="flex items-center justify-between gap-2 mb-2.5 p-2 px-2.5 bg-card-subtle/70 rounded-2xl border border-subtle/60">
                <div class="flex flex-col min-w-0">
                    <p class="text-[9px] text-secondary uppercase tracking-wider font-bold">\${T('totalTime')}</p>
                    <p class="text-xl sm:text-2xl font-black text-primary tracking-tight whitespace-nowrap">\${formattedTime}</p>
                </div>

                <!-- Center: Stops • Distance • Transfers badge -->
                <div class="flex flex-col items-center justify-center text-center px-1 min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 text-[11px] font-black text-primary flex-wrap justify-center">
                        <span class="whitespace-nowrap">\${journey.stationHops} Stops</span>
                        <span class="text-secondary opacity-40">•</span>
                        <span class="whitespace-nowrap">\${journey.distanceKm || '0'} km</span>
                    </div>
                    <div class="mt-0.5 truncate max-w-full">
                        \${transferNotice}
                    </div>
                </div>

                <div class="flex flex-col items-end min-w-0 text-right">
                    <p class="text-[9px] text-secondary uppercase tracking-wider font-bold">\${T('estFare')}</p>
                    <div class="flex items-baseline justify-end gap-1 whitespace-nowrap">
                        <span class="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">₹\${journey.fare}</span>
                        <span class="text-[10px] text-secondary opacity-70 font-normal">token</span>
                    </div>
                </div>
            </div>

            \${renderCurvedLineWorkflow(parts, journey, transferNotice)}

            <!-- Boarding Platform & Next Train Strip (Platform Box Longer, Next Train Box Compact) -->
            <div class="flex gap-2 mb-2">
                <div class="flex-[3] flex flex-col bg-[var(--bg-card-hover)] p-2 rounded-xl border border-[var(--border-color)] justify-between overflow-hidden">
                    <span class="text-[9px] text-secondary uppercase tracking-wider font-bold truncate">Platform & Direction</span>
                    <div class="flex items-center gap-1.5 mt-0.5 whitespace-nowrap overflow-hidden">
                        <span class="platform-pill text-[9px] py-0.5 px-1.5 font-black shrink-0">P\${startPlatform}</span>
                        <span class="text-xs font-bold text-primary truncate" title="\${journeyDir}">\${journeyDir}</span>
                    </div>
                </div>
                <div class="flex-[1.3] flex flex-col bg-[var(--bg-card-hover)] p-2 rounded-xl border border-[var(--border-color)] justify-between overflow-hidden shrink-0 text-center">
                    <span class="text-[9px] text-secondary uppercase tracking-wider font-bold truncate">\${T('nextTrain')}</span>
                    <span class="text-xs font-black text-emerald-500 dark:text-emerald-400 mt-0.5 whitespace-nowrap">\${formatTime(journey.departureTime)}</span>
                </div>
            </div>

            <!-- Compact WhatsApp Ticket Booking Strip (Stacked 2 rows so button sits bottom of passenger counter without overflow) -->
            <div class="p-2.5 px-3 rounded-2xl bg-card-subtle border border-subtle flex flex-col gap-2 shadow-xs">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] text-secondary uppercase font-bold tracking-wider">\${T('passengers') || 'Passenger(s)'}</span>
                        <div class="flex items-center bg-card px-2 py-0.5 rounded-lg border border-subtle shadow-xs">
                            <button id="p-minus-btn" type="button" class="w-6 h-6 flex items-center justify-center rounded text-secondary hover:text-primary font-bold text-xs active:scale-90">-</button>
                            <span class="font-extrabold text-xs text-primary w-5 text-center">\${passengerCount}</span>
                            <button id="p-plus-btn" type="button" class="w-6 h-6 flex items-center justify-center rounded text-secondary hover:text-primary font-bold text-xs active:scale-90">+</button>
                        </div>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                        <span class="text-[10px] text-secondary font-medium uppercase tracking-wider">Total</span>
                        <span class="text-sm font-black text-emerald-500 dark:text-emerald-400">₹\${totalFareAmount}</span>
                    </div>
                </div>

                <button id="whatsapp-book-btn" type="button" class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] active:scale-[0.98] text-white font-extrabold py-2 px-3 rounded-xl shadow-sm transition-all text-xs">
                    <svg class="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                        <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.198 8.198 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43-.15-.01-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/>
                    </svg>
                    <span>\${T('bookOnWhatsApp') || 'WhatsApp Ticket'}</span>
                </button>
            </div>`;

        if (oldSummaryRegex.test(content)) {
            content = content.replace(oldSummaryRegex, newSummaryHtml);
            fs.writeFileSync(f, content, 'utf8');
            console.log(`Updated summary UI in ${f}`);
        } else {
            console.error(`Could not match oldSummaryRegex in ${f}`);
        }
    }
});
