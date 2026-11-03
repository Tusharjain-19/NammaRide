const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDirs = [
    path.join(__dirname, '../website/public/simulator/assets/images/places'),
    path.join(__dirname, '../website/assets/images/places'),
    path.join(__dirname, '../mobile/mobile-web/assets/images/places'),
    path.join(__dirname, '../mobile/android/app/src/main/assets/public/assets/images/places')
];

const url = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";

function downloadUrl(u, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
                file.close();
                return downloadUrl(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                file.close();
                return reject(new Error('Status ' + res.statusCode));
            }
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
}

async function run() {
    const dest = path.join(targetDirs[0], 'christ_university.jpg');
    await downloadUrl(url, dest);
    console.log('christ_university.jpg downloaded!');
    for (let i = 1; i < targetDirs.length; i++) {
        fs.copyFileSync(dest, path.join(targetDirs[i], 'christ_university.jpg'));
    }
}
run();
