const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('let transferNotice =');
console.log(mainJs.substring(idx, idx + 1500));
