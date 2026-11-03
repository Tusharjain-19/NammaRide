const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'NammaRide-main/website/public/simulator/index.html',
    'NammaRide-main/mobile/mobile-web/index.html',
    'NammaRide-main/mobile/android/app/src/main/assets/public/index.html'
];

const jsFiles = [
    'NammaRide-main/website/public/simulator/js/main.js',
    'NammaRide-main/website/js/main.js',
    'NammaRide-main/mobile/mobile-web/js/main.js',
    'NammaRide-main/mobile/android/app/src/main/assets/public/js/main.js'
];

// Remove the HTML block
htmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');
    
    // Pattern matches the comment and the div block
    const popularBlockPattern = /\s*<!--\s*Quick Popular Stations Fast-Select Bar\s*-->\s*<div class="mb-4 flex items-center gap-1\.5 overflow-x-auto[\s\S]*?<\/div>/;
    
    if (popularBlockPattern.test(html)) {
        html = html.replace(popularBlockPattern, '');
        fs.writeFileSync(file, html, 'utf8');
        console.log('Removed Popular bar HTML from:', file);
    } else {
        console.log('Pattern not matched in:', file);
    }
});

// Remove / neutralize the JS function and its calls
jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let js = fs.readFileSync(file, 'utf8');

    // Replace the function body with a no-op so nothing breaks if called
    js = js.replace(
        /function initPopularStationChips\(\)\s*\{[\s\S]*?\n\}/,
        'function initPopularStationChips() {\n    // Popular stations fast-select bar removed as requested\n}'
    );

    fs.writeFileSync(file, js, 'utf8');
    console.log('Neutralized initPopularStationChips in:', file);
});
