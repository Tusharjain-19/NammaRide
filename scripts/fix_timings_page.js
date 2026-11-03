const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/src/pages/TimingsPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update activeDays state
content = content.replace(
    /const\s*\[activeDays,\s*setActiveDays\]\s*=\s*useState\(\{\s*purple:\s*'mon_fri',\s*green:\s*'mon_fri',\s*yellow:\s*'mon_sat'\s*\}\);/,
    `const [activeDays, setActiveDays] = useState({
    purple: 'mon_fri',
    green: 'mon_fri',
    yellow: 'mon_sat',
    pink: 'mon_sat'
  });`
);

// 2. Safe property extractions inside filteredLines.map
content = content.replace(
    /const activeDayKey = activeDays\[key\];\s*const schedule = line\.schedules\[activeDayKey\];\s*const firstTrainStart = line\.weekday\.firstTrain\.from_start;\s*const lastTrainEnd = line\.weekday\.lastTrain\.from_end;\s*const peakFreq = line\.weekday\.peakFrequency;/,
    `const activeDayKey = activeDays[key] || (line.schedules ? Object.keys(line.schedules)[0] : 'mon_sat');
            const schedule = line.schedules ? (line.schedules[activeDayKey] || Object.values(line.schedules)[0]) : null;
            
            const firstTrainStart = line.weekday?.firstTrain?.from_start || '05:00 AM';
            const lastTrainEnd = line.weekday?.lastTrain?.from_end || '11:00 PM';
            const peakFreq = line.weekday?.peakFrequency || '8-10 min';`
);

// 3. Safe Object.keys(line.schedules)
content = content.replace(
    /\{Object\.keys\(line\.schedules\)\.map\(\(dayKey\)\s*=>\s*\{/,
    `{line.schedules && Object.keys(line.schedules).map((dayKey) => {`
);

// 4. Safe terminals split
content = content.replace(
    /const terminals = line\.route\.split\('\s*↔\s*'\);/,
    `const terminals = line.route.includes('↔') ? line.route.split(' ↔ ') : line.route.split(' <-> ');`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched TimingsPage.jsx!');
