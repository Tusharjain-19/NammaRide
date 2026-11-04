const fs = require('fs');

// 1. Patch website/public/simulator/js/ui/sections.js and website/js/ui/sections.js
const sectionFiles = [
  'website/public/simulator/js/ui/sections.js',
  'website/js/ui/sections.js'
];

for (const f of sectionFiles) {
  let content = fs.readFileSync(f, 'utf8');

  // Replace gate rendering loop
  const oldGatePattern = /gates\.forEach\(g => \{\s*html \+= `\s*<div class="p-3 bg-card-subtle rounded-xl border border-subtle flex items-start gap-3 shadow-sm">\s*<span class="w-8 h-8 rounded-lg bg-emerald-500\/20[^"]*"[^>]*>\s*Gate \$\{g\.gate\}\s*<\/span>[\s\S]*?<\/div>\s*`;\s*\}\);/;

  const newGatePattern = `gates.forEach(g => {
            html += \`
                <div class="py-2.5 flex items-start gap-3 first:pt-1 last:pb-1">
                    <span class="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs whitespace-nowrap shrink-0 border border-emerald-500/30 flex items-center justify-center">
                        Gate \${g.gate}
                    </span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <span class="text-xs font-extrabold text-primary">\${g.name}</span>
                            <span class="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">\${g.landmark}</span>
                        </div>
                        <p class="text-[11px] text-secondary mt-1 leading-relaxed">\${g.destination}</p>
                    </div>
                </div>
            \`;
        });`;

  // Also replace grid container with clean divider
  content = content.replace(
    '<div class="grid grid-cols-1 gap-2.5 mt-2">',
    '<div class="divide-y divide-subtle/40 pt-1">'
  );

  content = content.replace(oldGatePattern, newGatePattern);

  fs.writeFileSync(f, content, 'utf8');
  console.log('Patched gate UI in', f);
}

// 2. Patch stationBoardImages.js in both public/simulator and website/js
const boardFiles = [
  'website/public/simulator/js/data/stationBoardImages.js',
  'website/js/data/stationBoardImages.js'
];

for (const bf of boardFiles) {
  let bContent = fs.readFileSync(bf, 'utf8');
  if (!bContent.includes('"PK07"')) {
    bContent = bContent.replace(
      '"PK06": "assets/images/stations/PK06.jpg",',
      '"PK06": "assets/images/stations/PK06.jpg",\n  "PK07": "assets/images/stations/PK07.jpg",\n  "PK18": "assets/images/stations/PK18.jpg",'
    );
  }
  fs.writeFileSync(bf, bContent, 'utf8');
  console.log('Updated stationBoardImages mapping in', bf);
}

// 3. Patch StationsPage.jsx (remove nested card box behind Gate A & B)
const stationsPagePath = 'website/src/pages/StationsPage.jsx';
let spContent = fs.readFileSync(stationsPagePath, 'utf8');

const oldSpGates = `<div className="grid grid-cols-1 gap-2">
                    {activeStationModal.exit_gates.map((g, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-start gap-2.5 text-xs">
                        <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                          Gate {g.gate}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-gray-900 dark:text-white block leading-snug">{g.destination}</span>
                          {g.landmark && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">Nearby: {g.landmark}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>`;

const newSpGates = `<div className="divide-y divide-gray-200 dark:divide-neutral-800 pt-1">
                    {activeStationModal.exit_gates.map((g, i) => (
                      <div key={i} className="py-2.5 flex items-start gap-3 text-xs first:pt-1 last:pb-1">
                        <span className="px-2.5 py-1 rounded-md font-black text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 whitespace-nowrap">
                          Gate {g.gate}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-gray-900 dark:text-white block leading-snug">{g.destination}</span>
                          {g.landmark && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">Nearby: {g.landmark}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>`;

if (spContent.includes(oldSpGates)) {
  spContent = spContent.replace(oldSpGates, newSpGates);
  fs.writeFileSync(stationsPagePath, spContent, 'utf8');
  console.log('Patched StationsPage.jsx gate UI!');
} else {
  console.warn('Could not find exact oldSpGates in StationsPage.jsx');
}

// 4. Patch PinkLinePage.jsx to add Station Photo header in active station card
const pinkPagePath = 'website/src/pages/PinkLinePage.jsx';
let ppContent = fs.readFileSync(pinkPagePath, 'utf8');

const targetHeader = `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-4">`;
if (ppContent.includes(targetHeader) && !ppContent.includes('PK03.jpg')) {
  const stationImageSnippet = `{/* Station Real Photo Banner */}
            <div className="w-full h-48 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 relative shadow-md">
              <img 
                src={\`/simulator/assets/images/stations/\${currentStnObj.id}.jpg\`} 
                alt={currentStnObj.name_en} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = '/simulator/assets/images/stations/PK03.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EC4899] shadow-sm"></span>
                  <span className="font-extrabold text-sm sm:text-base drop-shadow-md">{currentStnObj.name_en} Metro Station</span>
                </div>
                <span className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                  {currentStnObj.code}
                </span>
              </div>
            </div>

            ` + targetHeader;

  ppContent = ppContent.replace(targetHeader, stationImageSnippet);
  fs.writeFileSync(pinkPagePath, ppContent, 'utf8');
  console.log('Added real station photos to PinkLinePage.jsx!');
}
