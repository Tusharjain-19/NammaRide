const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('<!-- Line Badges Progression (Purple -> Green -> Yellow) -->');
if (idx !== -1) {
    console.log(mainJs.substring(idx - 50, idx + 1000));
} else {
    const idx2 = mainJs.indexOf('${lineBadges}');
    console.log(mainJs.substring(idx2 - 100, idx2 + 300));
}
