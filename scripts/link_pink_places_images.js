const fs = require('fs');
const path = require('path');

const placesFiles = [
    {
        json: path.join(__dirname, '../website/public/simulator/data/stationPlaces.json'),
        js: path.join(__dirname, '../website/public/simulator/js/data/stationPlaces.js')
    },
    {
        json: path.join(__dirname, '../website/data/stationPlaces.json'),
        js: path.join(__dirname, '../website/js/data/stationPlaces.js')
    },
    {
        json: path.join(__dirname, '../mobile/mobile-web/data/stationPlaces.json'),
        js: path.join(__dirname, '../mobile/mobile-web/js/data/stationPlaces.js')
    },
    {
        json: path.join(__dirname, '../mobile/android/app/src/main/assets/public/data/stationPlaces.json'),
        js: path.join(__dirname, '../mobile/android/app/src/main/assets/public/js/data/stationPlaces.js')
    }
];

const pinkStations = ['Kalena Agrahara', 'Hulimavu', 'IIM Bangalore', 'JP Nagar 4th Phase', 'Jayadeva Hospital', 'Tavarekere'];

placesFiles.forEach(({ json, js }) => {
    if (fs.existsSync(json)) {
        const data = JSON.parse(fs.readFileSync(json, 'utf8'));
        pinkStations.forEach(st => {
            if (data[st]) {
                data[st].forEach(p => {
                    p.image = `assets/images/places/${p.id}.jpg`;
                });
            }
        });
        fs.writeFileSync(json, JSON.stringify(data, null, 2), 'utf8');
        console.log('Updated JSON:', json);
    }

    if (fs.existsSync(js)) {
        let content = fs.readFileSync(js, 'utf8');
        // Extract json
        const prefix = 'export const stationPlaces = ';
        let raw = content.replace(prefix, '').trim();
        if (raw.endsWith(';')) raw = raw.slice(0, -1);
        try {
            const data = eval('(' + raw + ')');
            pinkStations.forEach(st => {
                if (data[st]) {
                    data[st].forEach(p => {
                        p.image = `assets/images/places/${p.id}.jpg`;
                    });
                }
            });
            const out = `${prefix}${JSON.stringify(data, null, 2)};\n`;
            fs.writeFileSync(js, out, 'utf8');
            console.log('Updated JS:', js);
        } catch (e) {
            console.error('Error parsing JS:', js, e);
        }
    }
});
