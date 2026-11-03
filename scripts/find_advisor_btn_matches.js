const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const matches = [...mainJs.matchAll(/open-pass-advisor-btn/g)];
console.log('Matches:', matches.length);
matches.forEach(m => {
    console.log(mainJs.substring(m.index - 50, m.index + 400));
    console.log('===');
});
