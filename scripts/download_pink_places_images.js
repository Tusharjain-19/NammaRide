const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDirs = [
    path.join(__dirname, '../website/public/simulator/assets/images/places'),
    path.join(__dirname, '../website/assets/images/places'),
    path.join(__dirname, '../mobile/mobile-web/assets/images/places'),
    path.join(__dirname, '../mobile/android/app/src/main/assets/public/assets/images/places')
];

targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const placeImages = {
    // 1. Kalena Agrahara
    "royal_meenakshi_mall": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80",
    "gottigere_depot": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    "meenakshi_temple": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
    "amc_college": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",

    // 2. Hulimavu
    "hulimavu_cave_temple": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80",
    "decathlon_bannerghatta": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
    "nano_hospitals": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
    "bgs_school": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",

    // 3. IIM Bangalore
    "iim_bangalore": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
    "fortis_hospital": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    "apollo_hospital": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
    "kalyani_magnum": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",

    // 4. JP Nagar 4th Phase
    "vega_city_mall": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80",
    "shoppers_stop_bg": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    "dollars_colony_jp": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    "ranga_shankara": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",

    // 5. Jayadeva Hospital
    "jayadeva_institute": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
    "btm_layout_1": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    "yellow_line_interchange": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",

    // 6. Tavarekere
    "tavarekere_park": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80",
    "nexus_koramangala": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80",
    "christ_university": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
    "st_johns_hospital": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
};

function downloadUrl(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
                file.close();
                if (fs.existsSync(dest)) fs.unlinkSync(dest);
                return downloadUrl(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                file.close();
                if (fs.existsSync(dest)) fs.unlinkSync(dest);
                return reject(new Error(`Failed HTTP ${res.statusCode} for ${url}`));
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });
        req.on('error', (err) => {
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            reject(err);
        });
    });
}

async function run() {
    console.log('Downloading real images for Pink line nearby places...');
    const firstDir = targetDirs[0];

    for (const [id, url] of Object.entries(placeImages)) {
        const targetFile = path.join(firstDir, `${id}.jpg`);
        try {
            await downloadUrl(url, targetFile);
            console.log(`Downloaded ${id}.jpg (${fs.statSync(targetFile).size} bytes)`);

            // Copy to other targetDirs
            for (let i = 1; i < targetDirs.length; i++) {
                fs.copyFileSync(targetFile, path.join(targetDirs[i], `${id}.jpg`));
            }
        } catch (e) {
            console.error(`Error downloading ${id}:`, e.message);
        }
    }
    console.log('All places images synced!');
}

run();
