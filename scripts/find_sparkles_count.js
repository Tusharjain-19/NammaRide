const fs = require('fs');

const files = [
    'NammaRide-main/website/public/simulator/js/main.js',
    'NammaRide-main/website/js/main.js',
    'NammaRide-main/mobile/mobile-web/js/main.js',
    'NammaRide-main/mobile/android/app/src/main/assets/public/js/main.js'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    const txt = fs.readFileSync(f, 'utf8');
    const matches = txt.match(/data-lucide=["']sparkles["']/g) || [];
    console.log(f, 'sparkles count:', matches.length);
});
