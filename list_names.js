const fs = require('fs');
const path = require('path');
const fullPath = path.resolve('d:/NammaRide-main/NammaRide-main/js/data/stationPlaces.js');
const c = fs.readFileSync(fullPath, 'utf-8');

const regex = /\"name\":\s*\"([^\"]+)\"/g;
const typeRegex = /\"type\":\s*\"([^\"]+)\"/g;

const matches = [];
let m;
const blockRegex = /\{[\s\S]*?\}/g;
const blocks = c.match(blockRegex) || [];

blocks.forEach(block => {
  const nameM = block.match(/\"name\":\s*\"([^\"]+)\"/);
  const typeM = block.match(/\"type\":\s*\"([^\"]+)\"/);
  if (nameM && typeM) {
    const name = nameM[1];
    const type = typeM[1];
    if (type === 'College' || type === 'University' || /college|university|Campus|BMS|RV |Maharani/i.test(name)) {
      matches.push(name);
    }
  }
});

const unique = [...new Set(matches)];
console.log(unique.join('\n'));
