const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'mall.jpg', url: 'https://images.unsplash.com/photo-1519567281728-1025537e2467?w=400&h=300&fit=crop' },
  { name: 'hospital.jpg', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop' },
  { name: 'museum.jpg', url: 'https://images.unsplash.com/photo-1582298687791-03f4f1db1238?w=400&h=300&fit=crop' },
  { name: 'lake.jpg', url: 'https://images.unsplash.com/photo-1572111504012-bd2cb15beecd?w=400&h=300&fit=crop' },
  { name: 'market.jpg', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop' },
  { name: 'stadium.jpg', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop' },
  { name: 'building.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Vidhana_Soudha_September_2022.jpg/640px-Vidhana_Soudha_September_2022.jpg' },
  { name: 'station.jpg', url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop' },
  { name: 'techpark.jpg', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop' },
  { name: 'airport.jpg', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop' },
  { name: 'bus_stand.jpg', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop' },
  { name: 'bus.jpg', url: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&h=300&fit=crop' }
];

const dir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const client = url.startsWith('https') ? https : require('http');
        
        client.get(url, function(response) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                download(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', function() {
                file.close(resolve);
            });
        }).on('error', function(err) {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

(async () => {
    for (const img of images) {
        try {
            console.log(`Downloading ${img.name}...`);
            await download(img.url, path.join(dir, img.name));
            console.log(`Downloaded ${img.name}`);
        } catch (e) {
            console.error(`Failed to download ${img.name}`, e);
        }
    }
})();
