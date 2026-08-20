const fs = require('fs');
const path = require('path');

const placesFilePath = path.join(__dirname, '../website/js/data/stationPlaces.js');
let fileContent = fs.readFileSync(placesFilePath, 'utf8');

// Replace export statement to parse object safely
const prefix = 'export const stationPlaces = ';
let jsonStr = fileContent.replace(prefix, '').trim();
if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);

const stationPlaces = eval('(' + jsonStr + ')');
let totalPlacesCount = 0;
let updatedPlacesCount = 0;

Object.keys(stationPlaces).forEach(stationName => {
    stationPlaces[stationName].forEach(place => {
        totalPlacesCount++;
        const imagePath = `assets/images/places/${place.id}.jpg`;
        const fullDiskPath = path.join(__dirname, '../website', imagePath);
        if (fs.existsSync(fullDiskPath)) {
            place.image = imagePath;
            updatedPlacesCount++;
        } else {
            // Fallback to place type image
            place.image = `assets/images/places/${place.id}.jpg`;
        }
    });
});

const outputJs = `${prefix}${JSON.stringify(stationPlaces, null, 2)};\n`;
fs.writeFileSync(placesFilePath, outputJs, 'utf8');

console.log(`Successfully updated stationPlaces.js! Total places: ${totalPlacesCount}, Updated with local images: ${updatedPlacesCount}`);
