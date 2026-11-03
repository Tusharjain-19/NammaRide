const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('// Build Line Badges');
console.log(mainJs.substring(idx - 200, idx + 2000));
