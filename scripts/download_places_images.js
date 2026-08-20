const fs = require('fs');
const path = require('path');
const https = require('https');

// Load places list
const placesList = JSON.parse(fs.readFileSync(path.join(__dirname, '../scratch_places_list.json'), 'utf8'));
const placesDir = path.join(__dirname, '../website/assets/images/places');

if (!fs.existsSync(placesDir)) {
    fs.mkdirSync(placesDir, { recursive: true });
}

// Curated high quality public domain / watermark-free image sources mapped by category/type
const categoryImageMap = {
    "Palace": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
    "Heritage": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
    "Heritage Area": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
    "Temple": "https://images.unsplash.com/photo-1621831815065-9aea1315ee2d?auto=format&fit=crop&w=600&q=80",
    "Park": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80",
    "Lake": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "Mall": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80",
    "Shopping": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    "Railway Station": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80",
    "Bus Terminal": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    "Transit": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    "IT Hub": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    "Industrial Area": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    "Hospital": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    "Education": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
    "Museum": "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=600&q=80",
    "Stadium": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    "Exhibition Centre": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    "Landmark": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
};

// Specific photo overrides for iconic landmarks
const specificPhotoMap = {
    "bangalore_palace": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
    "vidhana_soudha": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
    "cubbon_park": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80",
    "lalbagh": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    "nandi_hills": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "chinnaswamy_stadium": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    "orion_mall": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80",
    "phoenix_marketcity": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80",
    "mantri_square": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
    "ub_city": "https://images.unsplash.com/photo-1582650625119-3a31f8418b0d?auto=format&fit=crop&w=600&q=80",
    "isckon_temple": "https://images.unsplash.com/photo-1621831815065-9aea1315ee2d?auto=format&fit=crop&w=600&q=80",
    "ulsoor_lake": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
};

function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        const req = https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(destPath, () => {});
                return reject(new Error(`Server returned ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });
        req.on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
        req.end();
    });
}

async function processAllPlaces() {
    console.log(`Starting download for ${placesList.length} places...`);
    let downloadedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < placesList.length; i++) {
        const place = placesList[i];
        const fileName = `${place.id}.jpg`;
        const filePath = path.join(placesDir, fileName);

        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
            skippedCount++;
            continue;
        }

        const imgUrl = specificPhotoMap[place.id] || categoryImageMap[place.type] || categoryImageMap["Landmark"];
        try {
            console.log(`[${i + 1}/${placesList.length}] Downloading image for: ${place.name} (${place.type})...`);
            await downloadFile(imgUrl, filePath);
            downloadedCount++;
        } catch (err) {
            console.error(`Failed to download for ${place.id}:`, err.message);
        }
    }

    console.log(`Finished! Downloaded: ${downloadedCount}, Existing: ${skippedCount}, Total: ${placesList.length}`);
}

processAllPlaces();
