const fs = require('fs');

const mainCode = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainCode.indexOf('window.showNearbyAttractions =');
console.log('assignment in main.js:', idx);
if (idx !== -1) {
    console.log(mainCode.substring(idx, idx + 1500));
}
