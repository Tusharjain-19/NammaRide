const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('sparkles');
console.log('sparkles in main.js:', idx);
if (idx !== -1) {
    console.log(mainJs.substring(idx - 150, idx + 400));
}
