const fs = require('fs');
const path = require('path');
const https = require('https');

const placesFilePath = path.join(__dirname, '../website/js/data/stationPlaces.js');
const placesDir = path.join(__dirname, '../website/assets/images/places');

if (!fs.existsSync(placesDir)) {
    fs.mkdirSync(placesDir, { recursive: true });
}

// Read stationPlaces data
const content = fs.readFileSync(placesFilePath, 'utf8');
const jsonStr = content.replace('export const stationPlaces = ', '').trim().replace(/;\s*$/, '');
const stationPlaces = eval('(' + jsonStr + ')');

const uniquePlaces = new Map();
Object.keys(stationPlaces).forEach(st => {
    stationPlaces[st].forEach(p => {
        if (!uniquePlaces.has(p.id)) {
            uniquePlaces.set(p.id, p);
        }
    });
});

const placesList = Array.from(uniquePlaces.values());

function httpGet(url) {
    return new Promise((resolve, reject) => {
        // Openverse API requires a User-Agent header
        const options = new URL(url);
        const headers = { 'User-Agent': 'NammaRide-Transit-App/1.0' };
        
        https.get({
            hostname: options.hostname,
            path: options.pathname + options.search,
            headers: headers
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        const urlOptions = new URL(url);
        const options = {
            hostname: urlOptions.hostname,
            path: urlOptions.pathname + urlOptions.search,
            headers: { 'User-Agent': 'NammaRide-Transit-App/1.0' }
        };
        
        const req = https.get(options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(destPath, () => {});
                return reject(new Error(`Server returned status code ${response.statusCode}`));
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

async function fetchAndSaveImages() {
    console.log(`Querying Openverse and downloading images for ${placesList.length} places...`);
    let downloadedCount = 0;
    
    for (let i = 0; i < placesList.length; i++) {
        const place = placesList[i];
        const destPath = path.join(placesDir, `${place.id}.jpg`);

        // Skip if already exists and is non-empty
        if (fs.existsSync(destPath) && fs.statSync(destPath).size > 2000) {
            continue;
        }

        const query = encodeURIComponent(`${place.name} Bengaluru`);
        const searchUrl = `https://api.openverse.org/v1/images/?q=${query}&source=wikimedia&license_type=commercial,modification&filter_dead=true&page_size=1`;
        
        try {
            console.log(`[${i + 1}/${placesList.length}] Searching Openverse for: ${place.name}...`);
            const responseStr = await httpGet(searchUrl);
            const response = JSON.parse(responseStr);
            
            if (response.results && response.results.length > 0) {
                const imgUrl = response.results[0].url;
                console.log(`    Found image URL: ${imgUrl}`);
                await downloadFile(imgUrl, destPath);
                downloadedCount++;
            } else {
                console.log(`    No results found on Openverse. Keeping fallback.`);
            }
        } catch (e) {
            console.log(`    Error fetching image: ${e.message}`);
        }
        
        // Polite delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 800));
    }
    
    console.log(`Finished Openverse download run. Downloaded ${downloadedCount} new images.`);
}

fetchAndSaveImages();
