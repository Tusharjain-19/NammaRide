const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const matches = [...mainJs.matchAll(/data-lucide=["']sparkles["']/g)];
matches.forEach((m, i) => {
    console.log(`--- Match ${i} at ${m.index} ---`);
    console.log(mainJs.substring(m.index - 100, m.index + 200));
});
