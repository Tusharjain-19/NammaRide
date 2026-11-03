const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/public/simulator/js/main.js');
let content = fs.readFileSync(filePath, 'utf8');

const targetPrecompute = /function precomputeJourneyData\(\) \{[\s\S]*?function calculateJourney/;
const replacementPrecompute = `function precomputeJourneyData() {
    Object.keys(metroData).forEach(lineKey => {
        const line = metroData[lineKey];
        line.stations.forEach((station, index) => {
            precomputedData.stations[station.id] = { ...station, lineKey, color: line.color, lineName: line.name, index };
            if (!precomputedData.graph[station.id]) precomputedData.graph[station.id] = [];

            // Only add graph edges if this station and adjacent stations are operational
            const isStationOperational = station.isActive !== false && station.status !== 'under_construction';
            if (!isStationOperational) return;

            if (index > 0) {
                const prev = line.stations[index - 1];
                if (prev.isActive !== false && prev.status !== 'under_construction') {
                    precomputedData.graph[station.id].push({ node: prev.id, weight: prev.timeToNext, distance: prev.distanceToNext, line: lineKey });
                }
            }
            if (index < line.stations.length - 1) {
                const next = line.stations[index + 1];
                if (next.isActive !== false && next.status !== 'under_construction') {
                    precomputedData.graph[station.id].push({ node: next.id, weight: station.timeToNext, distance: station.distanceToNext, line: lineKey });
                }
            }

            if (station.interchangeId) {
                Object.keys(metroData).forEach(otherLineKey => {
                    if (otherLineKey !== lineKey) {
                        const match = metroData[otherLineKey].stations.find(s => s.interchangeId === station.interchangeId && s.isActive !== false && s.status !== 'under_construction');
                        if (match) {
                            precomputedData.graph[station.id].push({ node: match.id, weight: CONFIG.INTERCHANGE_TIME_MINUTES * 60, distance: 0, line: 'interchange' });
                        }
                    }
                });
            }
        });
    });
}

function calculateJourney`;

if (targetPrecompute.test(content)) {
  content = content.replace(targetPrecompute, replacementPrecompute);
  console.log('Successfully updated precomputeJourneyData in main.js');
} else {
  console.error('Could not match precomputeJourneyData');
}

// Update lineBadges for Pink line
const targetLineBadge = /\} else if \(lk === 'yellow'\) \{[\s\S]*?lineLabel = 'Yellow Line';\s*\}/;
const replacementLineBadge = `} else if (lk === 'yellow') {
            bg = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            dot = 'bg-amber-400';
            lineLabel = 'Yellow Line';
        } else if (lk === 'pink') {
            bg = 'bg-pink-500/20 text-pink-400 border-pink-500/30';
            dot = 'bg-pink-400';
            lineLabel = 'Pink Line';
        }`;

if (targetLineBadge.test(content)) {
  content = content.replace(targetLineBadge, replacementLineBadge);
  console.log('Successfully updated lineBadges for Pink Line in main.js');
} else {
  console.error('Could not match lineBadges');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated main.js successfully');
