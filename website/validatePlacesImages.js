const fs = require('fs');
const path = require('path');

const JS_PLACES_PATH = path.join(__dirname, 'js', 'data', 'stationPlaces.js');
const PLACES_DIR = path.join(__dirname, 'assets', 'images', 'places');

(async () => {
    try {
        console.log(`Reading stationPlaces.js from ${JS_PLACES_PATH}...`);
        const content = fs.readFileSync(JS_PLACES_PATH, 'utf8');

        // Regex to match "assets/images/places/something.ext"
        const regex = /"assets\/images\/places\/[^"]+"/g;
        const matches = content.match(regex) || [];

        console.log(`Found ${matches.length} place image references in stationPlaces.js.`);

        const uniqueImages = new Set(matches.map(m => m.replace(/"/g, '')));
        console.log(`Unique place images referenced: ${uniqueImages.size}`);

        let missingCount = 0;
        const missingList = [];

        for (const imgPath of uniqueImages) {
            // Path relative to website directory
            const fullPath = path.join(__dirname, imgPath);
            if (!fs.existsSync(fullPath)) {
                console.error(`Missing image file: ${imgPath}`);
                missingList.push(imgPath);
                missingCount++;
            }
        }

        if (missingCount === 0) {
            console.log('Success! All referenced place images exist locally under website/assets/images/places/.');
        } else {
            console.error(`Warning: ${missingCount} place images are missing!`);
            console.error(JSON.stringify(missingList, null, 2));
        }

        // Also check if there are images in the directory that are NOT referenced (optional cleanup/check)
        if (fs.existsSync(PLACES_DIR)) {
            const files = fs.readdirSync(PLACES_DIR);
            let unreferencedCount = 0;
            for (const file of files) {
                const relativePath = `assets/images/places/${file}`;
                if (!uniqueImages.has(relativePath)) {
                    unreferencedCount++;
                }
            }
            console.log(`Found ${files.length} total files in places folder (${unreferencedCount} are currently not referenced in JS).`);
        }

    } catch (err) {
        console.error('Critical error in validation script:', err);
    }
})();
