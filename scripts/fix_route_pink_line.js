const fs = require('fs');
const path = require('path');

const routeFiles = [
    path.join(__dirname, '../website/public/simulator/js/ui/route.js'),
    path.join(__dirname, '../website/js/ui/route.js'),
    path.join(__dirname, '../mobile/mobile-web/js/ui/route.js')
];

routeFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Add isPink
    if (!content.includes('const isPink =')) {
        content = content.replace(
            /const isYellow = \(c\) => [^;]+;/,
            `$&
        const isPink = (c) => c === '#EC4899' || c === '#E91E63' || c === '#F43F5E' || (typeof c === 'string' && c.toLowerCase().includes('pink'));`
        );
    }

    // Add line-pink class
    if (!content.includes("colorClass = 'line-pink'")) {
        content = content.replace(
            /else if \(isYellow\(segmentColor\)\) colorClass = 'line-yellow';/,
            `else if (isYellow(segmentColor)) colorClass = 'line-yellow';
        else if (isPink(segmentColor)) colorClass = 'line-pink';`
        );
    }

    // Add interchange classes
    if (!content.includes('interchange-yellow-pink')) {
        content = content.replace(
            /else if \(isYellow\(currentLine\) && isPurple\(nextLine\)\) \{\s*interchangeClass = 'interchange-yellow-purple';\s*\}/,
            `$& else if (isYellow(currentLine) && isPink(nextLine)) {
                interchangeClass = 'interchange-yellow-pink';
            } else if (isPink(currentLine) && isYellow(nextLine)) {
                interchangeClass = 'interchange-pink-yellow';
            } else if (isGreen(currentLine) && isPink(nextLine)) {
                interchangeClass = 'interchange-green-pink';
            } else if (isPink(currentLine) && isGreen(nextLine)) {
                interchangeClass = 'interchange-pink-green';
            } else if (isPurple(currentLine) && isPink(nextLine)) {
                interchangeClass = 'interchange-purple-pink';
            } else if (isPink(currentLine) && isPurple(nextLine)) {
                interchangeClass = 'interchange-pink-purple';
            }`
        );
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated route.js:', file);
});

// Update metro-route.css
const cssFiles = [
    path.join(__dirname, '../website/public/simulator/css/metro-route.css'),
    path.join(__dirname, '../website/css/metro-route.css'),
    path.join(__dirname, '../mobile/mobile-web/css/metro-route.css')
];

const cssPinkRules = `
/* Pink Line Styles */
:root {
    --line-pink: #EC4899;
}

.station-item.line-pink::before,
.line-pink .station-item::before {
    background-color: #EC4899 !important;
    box-shadow: 0 0 8px rgba(236, 72, 153, 0.4) !important;
}

.station-item.line-pink .station-dot,
.line-pink .station-dot {
    border-color: #EC4899 !important;
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.4) !important;
}

.station-item.interchange-yellow-pink .interchange-info,
.station-item.interchange-pink-yellow .interchange-info,
.station-item.interchange-green-pink .interchange-info,
.station-item.interchange-pink-green .interchange-info,
.station-item.interchange-purple-pink .interchange-info,
.station-item.interchange-pink-purple .interchange-info,
.line-pink .interchange-info {
    border-left-color: #EC4899 !important;
}

.station-item.interchange-yellow-pink .interchange-row i,
.station-item.interchange-yellow-pink .interchange-row svg,
.station-item.interchange-pink-yellow .interchange-row i,
.station-item.interchange-pink-yellow .interchange-row svg,
.station-item.interchange-green-pink .interchange-row i,
.station-item.interchange-green-pink .interchange-row svg,
.station-item.interchange-pink-green .interchange-row i,
.station-item.interchange-pink-green .interchange-row svg,
.line-pink .interchange-row i,
.line-pink .interchange-row svg {
    color: #EC4899 !important;
}
`;

cssFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let css = fs.readFileSync(file, 'utf8');
    if (!css.includes('.station-item.line-pink::before')) {
        css += '\n' + cssPinkRules;
        fs.writeFileSync(file, css, 'utf8');
        console.log('Updated metro-route.css:', file);
    }
});
