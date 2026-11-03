const fs = require('fs');

const indexHtml = fs.readFileSync('NammaRide-main/website/public/simulator/index.html', 'utf8');
const idx = indexHtml.indexOf('Quick Popular Stations Fast-Select Bar');
console.log(indexHtml.substring(idx - 50, idx + 1200));
