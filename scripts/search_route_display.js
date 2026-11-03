const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');

const regexes = [/Stops/i, /Transfer/i, /Line/i];
for (const r of [/\bStops\b/, /\bTransfer\b/, /journey\.parts/]) {
    const m = mainJs.search(r);
    console.log(r, 'found at:', m);
    if (m !== -1) {
        console.log(mainJs.substring(m - 100, m + 300));
        console.log('---');
    }
}
