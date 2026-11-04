const fs = require('fs');
const path = require('path');

const simStationsPath = path.join(__dirname, '../website/public/simulator/js/data/stations.js');
const simContent = fs.readFileSync(simStationsPath, 'utf8');

const secPath = path.join(__dirname, '../website/public/simulator/js/ui/sections.js');
const secContent = fs.readFileSync(secPath, 'utf8');

const mainPath = path.join(__dirname, '../website/public/simulator/js/main.js');
const mainContent = fs.readFileSync(mainPath, 'utf8');

// Find all T('key') or T_fn('key') calls
const keys = new Set();
const regex1 = /T(?:_fn)?\(\s*['"]([a-zA-Z0-9_]+)['"]\s*\)/g;
let m;
while ((m = regex1.exec(secContent)) !== null) keys.add(m[1]);
while ((m = regex1.exec(mainContent)) !== null) keys.add(m[1]);

// Also find data-lang-key="key"
const htmlPath = path.join(__dirname, '../website/public/simulator/index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const regex2 = /data-lang-key=['"]([a-zA-Z0-9_]+)['"]/g;
while ((m = regex2.exec(htmlContent)) !== null) keys.add(m[1]);

console.log('Total unique keys used in UI:', keys.size);

// Extract translations from stations.js
// Match translations = { en: {...}, hi: {...}, kn: {...} }
const enMatch = simContent.match(/"en":\s*\{([\s\S]*?)\n\s*\},/);
const hiMatch = simContent.match(/"hi":\s*\{([\s\S]*?)\n\s*\},/);
const knMatch = simContent.match(/"kn":\s*\{([\s\S]*?)\n\s*\}/);

function parseKeys(block) {
    if (!block) return new Set();
    const kSet = new Set();
    const r = /"([a-zA-Z0-9_]+)":/g;
    let match;
    while ((match = r.exec(block)) !== null) kSet.add(match[1]);
    return kSet;
}

const enKeys = parseKeys(enMatch ? enMatch[1] : '');
const hiKeys = parseKeys(hiMatch ? hiMatch[1] : '');
const knKeys = parseKeys(knMatch ? knMatch[1] : '');

console.log('EN keys in stations.js:', enKeys.size);
console.log('HI keys in stations.js:', hiKeys.size);
console.log('KN keys in stations.js:', knKeys.size);

const missingEn = [...keys].filter(k => !enKeys.has(k));
const missingHi = [...keys].filter(k => !hiKeys.has(k));
const missingKn = [...keys].filter(k => !knKeys.has(k));

console.log('Missing in EN (' + missingEn.length + '):', missingEn);
console.log('Missing in HI (' + missingHi.length + '):', missingHi);
console.log('Missing in KN (' + missingKn.length + '):', missingKn);
