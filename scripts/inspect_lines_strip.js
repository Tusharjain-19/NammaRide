const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const idx = mainJs.indexOf('// Transfer text - clean, concise, 1-line');
console.log(mainJs.substring(idx - 1000, idx + 1200));
