const fs = require('fs');
const path = require('path');

const dropdownFiles = [
    path.join(__dirname, '../website/public/simulator/js/ui/dropdown.js'),
    path.join(__dirname, '../website/js/ui/dropdown.js'),
    path.join(__dirname, '../mobile/mobile-web/js/ui/dropdown.js')
];

dropdownFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace the push logic in initData:
    // If not hasActiveLine, do NOT push into allStations!
    content = content.replace(
        /Object\.values\(metroData\)\.forEach\(l => \{\s*const match = l\.stations\.find\(s => s\.name === station\.name\);\s*if \(match\) \{\s*lines\.push\(l\.color\);\s*if \(match\.isActive !== false && match\.status !== 'under_construction'\) \{\s*hasActiveLine = true;\s*\}\s*\}\s*\}\);\s*allStations\.push\(\{/,
        `Object.values(metroData).forEach(l => {
                        const match = l.stations.find(s => s.name === station.name);
                        if (match) {
                            lines.push(l.color);
                            if (match.isActive !== false && match.status !== 'under_construction') {
                                hasActiveLine = true;
                            }
                        }
                    });

                    // Omit unopened/under-construction stations completely from dropdown selection
                    if (!hasActiveLine) return;

                    allStations.push({`
    );

    // Also remove the isInactive rendering branch in filter/render
    content = content.replace(
        /if \(isInactive\) \{\s*return `[\s\S]*?`;\s*\}\s*return `\s*<div class="station-option/m,
        `return \`
                <div class="station-option`
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated dropdown.js in:', file);
});
