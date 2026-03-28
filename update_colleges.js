const fs = require('fs');
const path = require('path');

const filePath = path.resolve('d:/NammaRide-main/NammaRide-main/js/data/stationPlaces.js');
let content = fs.readFileSync(filePath, 'utf-8');

const imageDir = path.resolve('d:/NammaRide-main/NammaRide-main/assets/images');
const files = fs.readdirSync(imageDir);

// Find all entries of type College or University
const entryRegex = /\{[\s\S]*?\"name\":\s*\"([^\"]+)\"[\s\S]*?\"type\":\s*\"([^\"]+)\"[\s\S]*?\"image\":\s*\"([^\"]+)\"[\s\S]*?\}/g;
let m;
let modified = false;

while ((m = entryRegex.exec(content)) !== null) {
    const start = m.index;
    const name = m[1];
    const type = m[2];
    const oldImage = m[3];
    
    if (type === 'College' || type === 'University' || name.toLowerCase().includes('college') || name.toLowerCase().includes('university')) {
        // Try to find a matching image file
        // Search by name (case insensitive)
        const match = files.find(f => {
            const base = f.toLowerCase().replace(/\.(jpg|jpeg|png)$/, '');
            return name.toLowerCase().includes(base) || base.includes(name.toLowerCase());
        });
        
        if (match) {
            const newImage = `assets/images/${match}`;
            if (oldImage !== newImage) {
                const oldBlock = m[0];
                const newBlock = oldBlock.replace(`"image": "${oldImage}"`, `"image": "${newImage}"`);
                content = content.substring(0, start) + newBlock + content.substring(start + oldBlock.length);
                modified = true;
                // Important to adjust the regex search index as we modified the string
                entryRegex.lastIndex = start + newBlock.length;
                console.log(`Updated ${name}: ${oldImage} -> ${newImage}`);
            }
        }
    }
}

if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
}
