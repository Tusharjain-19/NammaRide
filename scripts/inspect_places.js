const fs = require('fs');
const content = fs.readFileSync('NammaRide-main/website/public/simulator/js/data/stationPlaces.js', 'utf8');
const idx = content.indexOf('"Kalena Agrahara":');
console.log(content.substring(idx, idx + 1500));
