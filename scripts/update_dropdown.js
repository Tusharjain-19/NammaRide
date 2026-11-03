const fs = require('fs');
const path = require('path');

const dropdownPaths = [
  path.join(__dirname, '../website/public/simulator/js/ui/dropdown.js'),
  path.join(__dirname, '../website/js/ui/dropdown.js')
];

dropdownPaths.forEach(dp => {
  if (!fs.existsSync(dp)) return;
  let content = fs.readFileSync(dp, 'utf8');

  // Replace initData logic
  const targetInitData = /initData\(\) \{[\s\S]*?this\.filteredStations = \[\.\.\.this\.stations\];\s*\}/;
  const replacementInitData = `initData() {
        const allStations = [];
        const seen = new Set();

        Object.values(metroData).forEach(line => {
            line.stations.forEach(station => {
                if (!seen.has(station.name)) {
                    const lines = [];
                    let hasActiveLine = false;

                    Object.values(metroData).forEach(l => {
                        const match = l.stations.find(s => s.name === station.name);
                        if (match) {
                            lines.push(l.color);
                            if (match.isActive !== false && match.status !== 'under_construction') {
                                hasActiveLine = true;
                            }
                        }
                    });

                    allStations.push({
                        id: station.id,
                        name: station.name,
                        lines: lines,
                        isActive: hasActiveLine,
                        status: station.status || 'operational',
                        originalObj: station
                    });
                    seen.add(station.name);
                }
            });
        });

        this.stations = allStations.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredStations = [...this.stations];
    }`;

  if (targetInitData.test(content)) {
    content = content.replace(targetInitData, replacementInitData);
    console.log(`Updated initData in ${dp}`);
  }

  // Update renderOptions mapping
  const targetRenderMap = /list\.innerHTML = displaySet\.map\(station => \{[\s\S]*?\}\)\.join\(''\);/;
  const replacementRenderMap = `list.innerHTML = displaySet.map(station => {
            const dots = station.lines.map(color =>
                \`<span class="dot" style="background-color: \${color}; width: 10px; height: 10px; min-width: 10px; min-height: 10px; max-width: 10px; max-height: 10px; border-radius: 50%; flex-shrink: 0; aspect-ratio: 1/1; display: inline-block;"></span>\`
            ).join('');

            const displayName = T_STATION(station.name);
            const isSelected = this.selectedValue === station.id ? 'selected' : '';
            const isInactive = station.isActive === false;

            if (isInactive) {
                return \`
                    <div class="station-option opacity-45 cursor-not-allowed flex items-center justify-between" data-value="\${station.id}" data-station-name="\${station.name}" data-disabled="true" title="\${displayName} (Under Construction - Phase 2 Underground 2027)">
                         <div class="flex items-center gap-2 min-w-0">
                             <div class="station-dots">\${dots}</div>
                             <span class="truncate">\${displayName}</span>
                         </div>
                         <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 whitespace-nowrap">2027</span>
                    </div>
                \`;
            }

            return \`
                <div class="station-option \${isSelected}" data-value="\${station.id}" data-station-name="\${station.name}">
                     <div class="station-dots">\${dots}</div>
                     <span>\${displayName}</span>
                </div>
            \`;
        }).join('');`;

  if (targetRenderMap.test(content)) {
    content = content.replace(targetRenderMap, replacementRenderMap);
    console.log(`Updated renderOptions mapping in ${dp}`);
  }

  // Update click handler to prevent selection of inactive stations
  const targetClick = /option\.addEventListener\('click', \(e\) => \{[\s\S]*?this\.select\(value\);\s*\}\);/;
  const replacementClick = `option.addEventListener('click', (e) => {
                e.stopPropagation();
                if (option.dataset.disabled === 'true') {
                    const stName = option.dataset.stationName;
                    alert(\`\${stName} is an underground Pink Line station currently under construction (Opening in Phase 2B, 2027). Please select an operational station.\`);
                    return;
                }
                const value = option.dataset.value;
                this.select(value);
            });`;

  if (targetClick.test(content)) {
    content = content.replace(targetClick, replacementClick);
    console.log(`Updated click handler in ${dp}`);
  }

  fs.writeFileSync(dp, content, 'utf8');
});
