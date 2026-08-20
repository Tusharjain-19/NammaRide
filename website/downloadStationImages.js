const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const JSON_PATH = path.join(__dirname, 'data', 'namma_ride_metro_station_board_images.json');
const DEST_DIR = path.join(__dirname, 'assets', 'images', 'stations');
const JS_DATA_PATH = path.join(__dirname, 'js', 'data', 'stationBoardImages.js');

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            },
            timeout: 10000 // 10s timeout
        };

        const request = client.get(options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                let redirectUrl = response.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = `${urlObj.protocol}//${urlObj.hostname}${redirectUrl}`;
                }
                downloadImage(redirectUrl, destPath).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
                return;
            }

            const fileStream = fs.createWriteStream(destPath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(destPath, () => {});
                reject(err);
            });
        });

        request.on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });

        request.on('timeout', () => {
            request.destroy();
            fs.unlink(destPath, () => {});
            reject(new Error(`Timeout downloading ${url}`));
        });
    });
}

(async () => {
    try {
        console.log(`Reading metadata from ${JSON_PATH}...`);
        const rawData = fs.readFileSync(JSON_PATH, 'utf8');
        // Simple regex or parse to remove potential initial timestamp comments
        const cleanData = rawData.substring(rawData.indexOf('{'));
        const data = JSON.parse(cleanData);

        const stations = data.stations || [];
        console.log(`Found ${stations.length} stations in database.`);

        const downloadedMap = {};

        for (const station of stations) {
            if (!station.image_url) {
                console.log(`Station ${station.id} (${station.name}) has no direct image URL. Skipping.`);
                continue;
            }

            const ext = '.jpg'; // Keep uniform extension
            const fileName = `${station.id}${ext}`;
            const destPath = path.join(DEST_DIR, fileName);

            console.log(`[${station.id}] Downloading image from: ${station.image_url}`);
            try {
                await downloadImage(station.image_url, destPath);
                console.log(`[${station.id}] Successfully downloaded to ${fileName}`);
                downloadedMap[station.id] = `assets/images/stations/${fileName}`;
            } catch (err) {
                console.error(`[${station.id}] Failed to download: ${err.message}`);
            }
        }

        // Generate the JS module
        console.log(`Writing JavaScript helper to ${JS_DATA_PATH}...`);
        const jsContent = `// Auto-generated mapping of station IDs to downloaded board images
export const stationBoardImages = ${JSON.stringify(downloadedMap, null, 2)};
`;
        fs.writeFileSync(JS_DATA_PATH, jsContent, 'utf8');
        console.log('Finished station board images download and mapping generation!');
    } catch (err) {
        console.error('Critical error in download script:', err);
    }
})();
