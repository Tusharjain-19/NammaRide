const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('Compare 1-Day Pass');
console.log('Compare 1-Day Pass at:', idx);
if (idx !== -1) {
    console.log(mainJs.substring(idx - 250, idx + 400));
}
