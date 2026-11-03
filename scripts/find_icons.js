const fs = require('fs');

const mainJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/main.js', 'utf8');
const indexHtml = fs.readFileSync('NammaRide-main/website/public/simulator/index.html', 'utf8');
const routeJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/ui/route.js', 'utf8');
const sectionsJs = fs.readFileSync('NammaRide-main/website/public/simulator/js/ui/sections.js', 'utf8');

function findLucide(str, name) {
    const matches = str.match(/data-lucide="([^"]+)"/g) || [];
    console.log(name, 'data-lucide icons:', [...new Set(matches)]);
}

findLucide(mainJs, 'main.js');
findLucide(indexHtml, 'index.html');
findLucide(routeJs, 'route.js');
findLucide(sectionsJs, 'sections.js');
