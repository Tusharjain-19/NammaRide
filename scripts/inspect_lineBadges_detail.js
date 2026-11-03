const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('const lineBadges = parts.map');
console.log(mainJs.substring(idx - 50, idx + 1400));
