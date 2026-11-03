const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('open-pass-advisor-btn');
console.log(mainJs.substring(idx - 100, idx + 600));
