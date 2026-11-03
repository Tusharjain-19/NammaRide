const fs = require('fs');

const routeCode = fs.readFileSync('NammaRide-main/website/public/simulator/js/ui/route.js', 'utf8');
const sectionsCode = fs.readFileSync('NammaRide-main/website/public/simulator/js/ui/sections.js', 'utf8');

console.log('--- route.js nearby snippet ---');
const idx1 = routeCode.indexOf('nearby');
if (idx1 !== -1) console.log(routeCode.substring(idx1 - 100, idx1 + 400));

console.log('--- sections.js nearby/places snippet ---');
const idx2 = sectionsCode.indexOf('stationPlaces');
if (idx2 !== -1) console.log(sectionsCode.substring(idx2 - 100, idx2 + 600));
