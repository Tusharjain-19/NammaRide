const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('${lineBadges}');
console.log(mainJs.substring(idx - 250, idx + 450));
