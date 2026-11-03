const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('<!-- Line Badges Progression (Purple -> Green -> Yellow) -->');
if (idx !== -1) {
    console.log(mainJs.substring(idx - 100, idx + 800));
} else {
    const idx2 = mainJs.indexOf('${lineBadges}');
    console.log(mainJs.substring(idx2 - 300, idx2 + 500));
}
