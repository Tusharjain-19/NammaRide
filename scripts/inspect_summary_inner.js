const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('summaryText.innerHTML = `');
console.log(mainJs.substring(idx, idx + 2500));
