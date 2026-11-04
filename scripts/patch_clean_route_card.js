const fs = require('fs');

const files = [
  'website/public/simulator/js/main.js',
  'website/js/main.js'
];

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace renderCurvedLineWorkflow function
  const newWorkflowFn = `function renderCurvedLineWorkflow(parts, journey, transferNotice) {
    if (!parts || parts.length === 0) return '';
    const isDirect = parts.length === 1;

    const getLineColor = (lk) => {
        if (lk === 'green') return '#10B981';
        if (lk === 'yellow') return '#EAB308';
        if (lk === 'pink') return '#EC4899';
        return '#A855F7'; // purple
    };

    const getLineName = (lk) => {
        if (lk === 'green') return (typeof T_fn === 'function' ? T_fn('lineGreen') : null) || 'Green Line';
        if (lk === 'yellow') return (typeof T_fn === 'function' ? T_fn('lineYellow') : null) || 'Yellow Line';
        if (lk === 'pink') return (typeof T_fn === 'function' ? T_fn('linePink') : null) || 'Pink Line';
        return (typeof T_fn === 'function' ? T_fn('linePurple') : null) || 'Purple Line';
    };

    if (isDirect) {
        const p = parts[0];
        const lk = p.stations[0]?.lineKey || 'purple';
        const color = getLineColor(lk);
        const lineLabel = getLineName(lk);
        const stopCount = p.stations.length;

        return \`
            <div class="p-2.5 bg-card-subtle/70 rounded-xl border border-subtle mb-2.5 flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style="background-color: \${color};"></span>
                        <span class="text-xs font-black" style="color: \${color};">\${lineLabel}</span>
                        <span class="text-xs font-bold text-secondary px-2 py-0.5 rounded-md bg-card-hover border border-subtle/50">
                            \${stopCount} \${stopCount === 1 ? 'stop' : 'stops'}
                        </span>
                    </div>
                    <span class="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Direct
                    </span>
                </div>
                <div class="flex items-center justify-between text-xs pt-1 border-t border-subtle/40 text-secondary">
                    <span class="font-bold text-primary flex items-center gap-1 text-[11px]">
                        <i data-lucide="navigation" class="w-3 h-3 text-secondary shrink-0"></i>
                        <span>\${journey.stationHops} Stops • \${journey.distanceKm || '0'} km</span>
                    </span>
                    <span class="text-emerald-500 font-bold flex items-center gap-1 text-[11px]">
                        <i data-lucide="check" class="w-3 h-3"></i> 0 Transfers
                    </span>
                </div>
            </div>
        \`;
    }

    // MULTI-LINE JOURNEY: Clean One-Liner Line Steps & Two-Tone Gradient Change Track
    const lineStepsHtml = parts.map((p, idx) => {
        const lk = p.stations[0]?.lineKey || 'purple';
        const color = getLineColor(lk);
        const lineLabel = getLineName(lk);
        const stopCount = p.stations.length;
        const toName = p.stations[p.stations.length - 1]?.name ? (typeof T_STATION === 'function' ? T_STATION(p.stations[p.stations.length - 1].name) : p.stations[p.stations.length - 1].name) : '';

        let transferHtml = '';
        if (idx < parts.length - 1) {
            const nextPart = parts[idx + 1];
            const nextLk = nextPart.stations[0]?.lineKey || 'green';
            const nextColor = getLineColor(nextLk);
            const nextLineLabel = getLineName(nextLk);
            const transferStation = toName;

            transferHtml = \`
                <!-- Two-Tone Gradient Transfer Mix (e.g. Purple to Green) -->
                <div class="relative flex items-center gap-2 pl-3 py-1 my-0.5">
                    <div class="absolute left-[7px] -top-2 bottom-0 w-4 pointer-events-none">
                        <svg class="w-4 h-full overflow-visible" viewBox="0 0 16 32" fill="none">
                            <defs>
                                <linearGradient id="trans-grad-\${idx}" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="\${color}"/>
                                    <stop offset="100%" stop-color="\${nextColor}"/>
                                </linearGradient>
                            </defs>
                            <path d="M 1 0 V 16 Q 1 24 9 24 H 14" stroke="url(#trans-grad-\${idx})" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                            <path d="M 14 24 L 11 21 M 14 24 L 11 27" stroke="\${nextColor}" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="ml-4 flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-bold shadow-xs"
                         style="background: linear-gradient(90deg, \${color}18, \${nextColor}18); border-color: \${color}45;">
                        <span class="flex items-center gap-1 shrink-0">
                            <span class="w-2 h-2 rounded-full shadow-xs" style="background-color: \${color};"></span>
                            <i data-lucide="arrow-right" class="w-2.5 h-2.5 text-secondary opacity-70"></i>
                            <span class="w-2 h-2 rounded-full shadow-xs" style="background-color: \${nextColor};"></span>
                        </span>
                        <span class="text-primary">
                            Change at <strong>\${transferStation}</strong> to <span style="color: \${nextColor}; font-weight: 800;">\${nextLineLabel}</span>
                        </span>
                    </div>
                </div>
            \`;
        }

        return \`
            <!-- Line Step (Strict One-Liner: Dot + Line Name | Stops Count) -->
            <div class="flex flex-col gap-0.5">
                <div class="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-card-subtle/50 border border-subtle/60 hover:bg-card-subtle transition-all cursor-pointer" onclick="window.scrollToRouteLine(\${idx})" title="Click to view line segment in route list">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style="background-color: \${color};"></span>
                        <span class="text-xs font-black tracking-tight" style="color: \${color};">\${lineLabel}</span>
                    </div>
                    <span class="text-xs font-bold text-secondary px-2 py-0.5 rounded-md bg-card-hover border border-subtle/50">
                        \${stopCount} \${stopCount === 1 ? 'stop' : 'stops'}
                    </span>
                </div>
                \${transferHtml}
            </div>
        \`;
    }).join('');

    return \`
        <!-- Connected Metro Lines -->
        <div class="p-2.5 bg-card-subtle/70 rounded-xl border border-subtle mb-2.5 flex flex-col gap-2 overflow-hidden">
            <!-- Header with Clean Line Count & Summary -->
            <div class="flex items-center justify-between pb-1.5 border-b border-subtle/50 text-[11px]">
                <div class="flex items-center gap-1.5 font-extrabold text-primary">
                    <i data-lucide="navigation" class="w-3.5 h-3.5 text-primary shrink-0"></i>
                    <span>\${parts.length} Lines</span>
                </div>
                <div class="flex items-center gap-1.5 text-secondary text-[11px]">
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
}`;

  // Replace existing renderCurvedLineWorkflow function
  content = content.replace(
    /function renderCurvedLineWorkflow\(parts, journey, transferNotice\) \{[\s\S]*?\n\}/,
    newWorkflowFn
  );

  // 2. Replace summaryText.innerHTML template inside updateSummaryUI
  // Find start of summaryText.innerHTML
  const oldSummaryStart = 'summaryText.innerHTML = `';
  const startIdx = content.indexOf(oldSummaryStart);
  if (startIdx !== -1) {
    const endMarker = 'if (window.lucide) window.lucide.createIcons();';
    const endIdx = content.indexOf(endMarker, startIdx);
    if (endIdx !== -1) {
      const newSummaryHtml = `summaryText.innerHTML = \`
            <!-- Top Header with Route Title & Star Bookmark -->
            <div class="flex items-center justify-between pb-2 mb-2 border-b border-subtle">
                <div class="flex flex-col min-w-0 pr-2">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-secondary opacity-70">Calculated Metro Route</span>
                    <h3 class="text-base font-extrabold text-primary flex items-center gap-1.5 truncate">
                        <span class="truncate">\${startName}</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-secondary opacity-50 shrink-0"></i>
                        <span class="truncate">\${endName}</span>
                    </h3>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button id="toggle-fav-btn" type="button" class="w-8 h-8 rounded-xl flex items-center justify-center bg-card-subtle hover:bg-card-hover border border-subtle active:scale-90 transition-all shadow-sm shrink-0" title="\${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                        <i data-lucide="star" class="w-4 h-4 \${isFav ? 'text-amber-400 fill-amber-400' : 'text-secondary hover:text-amber-400'}"></i>
                    </button>
                    <button id="clear-route-btn" type="button" class="w-8 h-8 rounded-xl flex items-center justify-center bg-card-subtle hover:bg-card-hover text-secondary hover:text-red-500 border border-subtle active:scale-90 transition-all shadow-sm shrink-0" title="Clear Route / Back to Home">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Clean Time & Fare Row (No Smart Card / Advisor Clutter) -->
            <div class="flex justify-between items-end mb-2.5">
                <div>
                    <p class="text-[10px] text-secondary uppercase tracking-wide font-bold">\${T('totalTime')}</p>
                    <p class="text-2xl font-extrabold text-primary tracking-tight">\${formattedTime}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-secondary uppercase tracking-wide font-bold">\${T('estFare')}</p>
                    <div class="flex items-baseline justify-end gap-1.5">
                        <span class="text-2xl font-extrabold text-emerald-400 tracking-tight">₹\${journey.fare}</span>
                        <span class="text-xs text-secondary opacity-70 font-normal">token</span>
                    </div>
                </div>
            </div>

            \${renderCurvedLineWorkflow(parts, journey, transferNotice)}

            <!-- Boarding Platform & Next Train Strip (Strict 1-Line) -->
            <div class="grid grid-cols-2 gap-2 mb-2">
                <div class="flex flex-col bg-[var(--bg-card-hover)] p-2 rounded-xl border border-[var(--border-color)] justify-between overflow-hidden">
                    <span class="text-[9px] text-secondary uppercase tracking-wider font-bold truncate">Platform & Direction</span>
                    <div class="flex items-center gap-1 mt-0.5 whitespace-nowrap overflow-hidden">
                        <span class="platform-pill text-[9px] py-0.5 px-1.5 font-black shrink-0">P\${startPlatform}</span>
                        <span class="text-xs font-bold text-primary truncate" title="\${journeyDir}">\${journeyDir}</span>
                    </div>
                </div>
                <div class="flex flex-col bg-[var(--bg-card-hover)] p-2 rounded-xl border border-[var(--border-color)] justify-between overflow-hidden">
                    <span class="text-[9px] text-secondary uppercase tracking-wider font-bold truncate">\${T('nextTrain')}</span>
                    <span class="text-xs font-bold text-emerald-500 dark:text-emerald-400 mt-0.5 whitespace-nowrap">\${formatTime(journey.departureTime)}</span>
                </div>
            </div>

            <!-- Compact WhatsApp Ticket Booking Strip (Single Slim Row) -->
            <div class="p-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] text-secondary uppercase font-bold tracking-wider">\${T('passengers') || 'Qty'}</span>
                    <div class="flex items-center bg-card-subtle px-1.5 py-0.5 rounded-lg border border-subtle shadow-xs">
                        <button id="p-minus-btn" type="button" class="w-5 h-5 flex items-center justify-center rounded text-secondary hover:text-primary font-bold text-xs active:scale-90">-</button>
                        <span class="font-extrabold text-xs text-primary w-4 text-center">\${passengerCount}</span>
                        <button id="p-plus-btn" type="button" class="w-5 h-5 flex items-center justify-center rounded text-secondary hover:text-primary font-bold text-xs active:scale-90">+</button>
                    </div>
                    <span class="text-xs font-black text-emerald-500 dark:text-emerald-400 ml-1">₹\${totalFareAmount}</span>
                </div>

                <button id="whatsapp-book-btn" type="button" class="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] active:scale-95 text-white font-extrabold py-1.5 px-3 rounded-lg shadow-xs transition-all text-[11px] shrink-0">
                    <svg class="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                        <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.198 8.198 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43-.15-.01-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/>
                    </svg>
                    <span>WhatsApp Ticket</span>
                </button>
            </div>
        \`;\n\n        `;
      content = content.slice(0, startIdx) + newSummaryHtml + content.slice(endIdx);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched', filePath);
}
