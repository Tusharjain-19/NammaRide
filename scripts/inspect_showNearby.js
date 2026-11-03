const fs = require('fs');

const mainCode = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainCode.indexOf('showNearbyAttractions');
console.log('showNearbyAttractions in main.js:', idx);
if (idx !== -1) {
    console.log(mainCode.substring(idx - 100, idx + 1200));
}
