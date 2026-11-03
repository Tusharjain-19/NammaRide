const fs = require('fs');

const stationsCode = fs.readFileSync('NammaRide-main/website/public/simulator/js/data/stations.js', 'utf8');
const linesMatch = stationsCode.match(/"name":\s*"([^"]+)"/g);
console.log('Line names:', linesMatch);

const colorMatch = stationsCode.match(/"color":\s*"([^"]+)"/g);
console.log('Colors:', colorMatch);
