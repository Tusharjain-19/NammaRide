const fs = require('fs');

const files = [
    'NammaRide-main/website/src/context/LanguageContext.jsx',
    'NammaRide-main/website/src/data/timingsData.js',
    'NammaRide-main/website/src/pages/PinkLinePage.jsx',
    'NammaRide-main/website/src/pages/TimingsPage.jsx',
    'NammaRide-main/website/index.html'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(/[—–]/g, '-');
    fs.writeFileSync(f, text, 'utf8');
    console.log('Cleaned emdashes in:', f);
});
