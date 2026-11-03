const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');

const startStr = '// Build Line Badges';
const endStr = '<!-- Boarding Platform & Next Train Strip (Strict 1-Line) -->';

const sIdx = mainJs.indexOf(startStr);
const eIdx = mainJs.indexOf(endStr);

console.log('Start:', sIdx, 'End:', eIdx);
if (sIdx !== -1 && eIdx !== -1) {
    console.log(mainJs.substring(sIdx, eIdx));
}
