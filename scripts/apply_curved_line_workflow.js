const fs = require('fs');
const path = require('path');

const jsFiles = [
    path.join(__dirname, '../website/public/simulator/js/main.js'),
    path.join(__dirname, '../website/js/main.js'),
    path.join(__dirname, '../mobile/mobile-web/js/main.js'),
    path.join(__dirname, '../mobile/android/app/src/main/assets/public/js/main.js')
];

jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // 1. Remove the star svg (data-lucide="sparkles") from view-pass-advisor-btn
    code = code.replace(
        /<button id="view-pass-advisor-btn"[\s\S]*?<div class="flex items-center gap-1\.5">\s*<i data-lucide="sparkles"[^>]*><\/i>\s*<span class="font-extrabold text-primary text-\[11px\]">Compare 1-Day Pass & Card Savings<\/span>/,
        `<button id="view-pass-advisor-btn" type="button" class="w-full mb-2.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-between text-xs transition-all active:scale-[0.98] group">
                <div class="flex items-center gap-1.5">
                    <span class="font-extrabold text-primary text-[11px]">Compare 1-Day Pass & Card Savings</span>`
    );

    // 2. Add renderCurvedLineWorkflow function before updateSummaryUI
    if (!code.includes('function renderCurvedLineWorkflow(')) {
        const fnCode = `
// Curved Line Route Workflow Generator (Non-scrolling connected metro track)
function renderCurvedLineWorkflow(parts, journey, transferNotice) {
    if (!parts || parts.length === 0) return '';
    const isDirect = parts.length === 1;

    if (isDirect) {
        const p = parts[0];
        const lk = p.stations[0]?.lineKey || 'purple';
        const color = p.stations[0]?.color || '#8B5CF6';
        let lineLabel = 'Purple Line';
        if (lk === 'green') lineLabel = 'Green Line';
        else if (lk === 'yellow') lineLabel = 'Yellow Line';
        else if (lk === 'pink') lineLabel = 'Pink Line';

        return \`
            <div class="p-2.5 bg-card-subtle/70 rounded-xl border border-subtle mb-2.5 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full shrink-0 shadow-sm" style="background-color: \${color};"></span>
                        <span class="text-xs font-black text-primary">\${lineLabel}</span>
                        <span class="text-[10px] text-secondary font-medium">• \${p.stations.length} stops</span>
                    </div>
                    <span class="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Direct Train
                    </span>
                </div>
                <div class="flex items-center justify-between text-xs pt-1 border-t border-subtle/50 text-secondary">
                    <span class="font-bold text-primary flex items-center gap-1 text-[11px]">
                        <i data-lucide="map-pin" class="w-3 h-3 text-secondary shrink-0"></i>
                        <span>\${journey.stationHops} Stops • \${journey.distanceKm || '0'} km</span>
                    </span>
                    <span class="text-emerald-500 font-bold flex items-center gap-1 text-[11px]">
                        <i data-lucide="check" class="w-3 h-3"></i> 0 Transfers
                    </span>
                </div>
            </div>
        \`;
    }

    // MULTI-LINE JOURNEY WITH TRANSFERS: Curved Line Connected Schematic
    const lineStepsHtml = parts.map((p, idx) => {
        const lk = p.stations[0]?.lineKey || 'purple';
        const color = p.stations[0]?.color || '#8B5CF6';
        let lineLabel = 'Purple Line';
        if (lk === 'green') lineLabel = 'Green Line';
        else if (lk === 'yellow') lineLabel = 'Yellow Line';
        else if (lk === 'pink') lineLabel = 'Pink Line';

        const stopCount = p.stations.length;
        const fromName = p.stations[0]?.name ? T_STATION(p.stations[0].name) : '';
        const toName = p.stations[p.stations.length - 1]?.name ? T_STATION(p.stations[p.stations.length - 1].name) : '';

        let transferHtml = '';
        if (idx < parts.length - 1) {
            const nextPart = parts[idx + 1];
            const transferStation = toName;
            const nextLineKey = nextPart.stations[0]?.lineKey || 'green';
            let nextLineLabel = 'Green Line';
            if (nextLineKey === 'yellow') nextLineLabel = 'Yellow Line';
            else if (nextLineKey === 'pink') nextLineLabel = 'Pink Line';
            else if (nextLineKey === 'purple') nextLineLabel = 'Purple Line';

            transferHtml = \`
                <!-- Curved Transition to Next Line -->
                <div class="relative flex items-center gap-2 pl-3 py-1 my-0.5">
                    <div class="absolute left-[7px] -top-2 bottom-0 w-4 pointer-events-none">
                        <svg class="w-4 h-full overflow-visible" viewBox="0 0 16 32" fill="none">
                            <path d="M 1 0 V 16 Q 1 24 9 24 H 14" stroke="\${color}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                            <path d="M 14 24 L 11 21 M 14 24 L 11 27" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="ml-4 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-500 font-extrabold shadow-xs">
                        <i data-lucide="arrow-right-left" class="w-3 h-3 shrink-0"></i>
                        <span>Change at <strong class="text-primary">\${transferStation}</strong> to \${nextLineLabel}</span>
                    </div>
                </div>
            \`;
        }

        return \`
            <!-- Line Step -->
            <div class="flex flex-col gap-0.5">
                <div class="flex items-center justify-between p-1.5 rounded-lg bg-card-subtle/50 border border-subtle/60 hover:bg-card-subtle transition-all cursor-pointer" onclick="window.scrollToRouteLine(\${idx})" title="Click to view line segment in route list">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style="background-color: \${color};"></span>
                        <span class="text-xs font-black tracking-tight" style="color: \${color};">\${lineLabel}</span>
                        <span class="text-[10px] text-secondary font-medium">(\${stopCount} stops)</span>
                    </div>
                    <span class="text-[10px] text-secondary font-mono truncate max-w-[140px] text-right">
                        \${fromName} <span class="opacity-50">→</span> \${toName}
                    </span>
                </div>
                \${transferHtml}
            </div>
        \`;
    }).join('');

    return \`
        <!-- Curved Line Multi-Line Route Workflow (Non-Scrolling) -->
        <div class="p-2.5 bg-card-subtle/70 rounded-xl border border-subtle mb-2.5 flex flex-col gap-2 overflow-hidden">
            <!-- Header with Quick Summary -->
            <div class="flex items-center justify-between pb-1.5 border-b border-subtle/50 text-[11px]">
                <div class="flex items-center gap-1.5 font-extrabold text-primary">
                    <i data-lucide="navigation" class="w-3.5 h-3.5 text-primary shrink-0"></i>
                    <span>Line Workflow • \${parts.length} Lines</span>
                </div>
                <div class="flex items-center gap-2 text-secondary text-[11px]">
                    <span class="font-bold text-primary">\${journey.stationHops} Stops</span>
                    <span>•</span>
                    <span>\${journey.distanceKm || '0'} km</span>
                    <span>•</span>
                    \${transferNotice}
                </div>
            </div>

            <!-- Connected Curved Line Flow -->
            <div class="space-y-0.5 pt-0.5">
                \${lineStepsHtml}
            </div>
        </div>
    \`;
}

window.scrollToRouteLine = function(partIndex) {
    try {
        const routeList = document.getElementById('route-list');
        if (!routeList) return;
        const items = routeList.querySelectorAll('.station-item');
        if (items.length > 0) {
            const target = items[Math.min(partIndex * 6, items.length - 1)];
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    } catch(e) {}
};
`;
        code = code.replace('const updateSummaryUI = () => {', fnCode + '\n    const updateSummaryUI = () => {');
    }

    // 3. Replace the old scrolling strip in updateSummaryUI
    code = code.replace(
        /<!-- Route Badges & Stations Strip \(Strict 1-Line Layout\) -->[\s\S]*?<!-- Boarding Platform & Next Train Strip/,
        `\${renderCurvedLineWorkflow(parts, journey, transferNotice)}

            <!-- Boarding Platform & Next Train Strip`
    );

    fs.writeFileSync(file, code, 'utf8');
    console.log('Successfully updated JS in:', file);
});

// Update CSS files for .no-scrollbar
const cssFiles = [
    path.join(__dirname, '../website/public/simulator/css/metro-route.css'),
    path.join(__dirname, '../website/css/metro-route.css'),
    path.join(__dirname, '../mobile/mobile-web/css/metro-route.css'),
    path.join(__dirname, '../mobile/android/app/src/main/assets/public/css/metro-route.css')
];

const noScrollbarRules = `
/* Cross-browser scrollbar suppression */
.no-scrollbar::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
}
.no-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
}
`;

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');
    if (!css.includes('.no-scrollbar::-webkit-scrollbar')) {
        css += '\n' + noScrollbarRules;
        fs.writeFileSync(file, css, 'utf8');
        console.log('Updated CSS in:', file);
    }
});
