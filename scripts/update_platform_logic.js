const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Update stations.json files
const stationsJsonFiles = [
    path.join(ROOT_DIR, 'website/public/simulator/data/stations.json'),
    path.join(ROOT_DIR, 'website/data/stations.json')
];

stationsJsonFiles.forEach(f => {
    if (fs.existsSync(f)) {
        const data = JSON.parse(fs.readFileSync(f, 'utf8'));
        
        // Find Pink Line PK05 (Jayadeva Hospital)
        if (data.pink && data.pink.stations) {
            const pk05 = data.pink.stations.find(s => s.id === 'PK05');
            if (pk05) {
                pk05.platforms = { forward: 3, backward: 4 };
                console.log(`Updated PK05 platforms in ${f} to forward: 3, backward: 4`);
            }
            const pk06 = data.pink.stations.find(s => s.id === 'PK06');
            if (pk06) {
                pk06.platforms = { forward: 1, backward: 2 };
                console.log(`Verified PK06 platforms in ${f} as forward: 1, backward: 2`);
            }
        }
        
        // Verify Yellow Line Y03 (Jayadeva Hospital)
        if (data.yellow && data.yellow.stations) {
            const y03 = data.yellow.stations.find(s => s.id === 'Y03');
            if (y03) {
                y03.platforms = { forward: 2, backward: 1 };
                console.log(`Verified Y03 platforms in ${f} as forward: 2 (Bommasandra), backward: 1 (RV Road)`);
            }
        }

        fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf8');
    }
});

// 2. Update stations.js files
const stationsJsFiles = [
    path.join(ROOT_DIR, 'website/public/simulator/js/data/stations.js'),
    path.join(ROOT_DIR, 'website/js/data/stations.js')
];

stationsJsFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Replace PK05 platforms
        const pk05Regex = /("id":\s*"PK05",[\s\S]*?"platforms":\s*\{)[\s\S]*?(\})/g;
        content = content.replace(pk05Regex, `$1\n                    "forward": 3,\n                    "backward": 4\n                $2`);
        
        // Verify PK06 platforms
        const pk06Regex = /("id":\s*"PK06",[\s\S]*?"platforms":\s*\{)[\s\S]*?(\})/g;
        content = content.replace(pk06Regex, `$1\n                    "forward": 1,\n                    "backward": 2\n                $2`);

        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated platform logic in ${f}`);
    }
});

// 3. Update stationsMeta.js
const stationsMetaFiles = [
    path.join(ROOT_DIR, 'website/public/simulator/js/data/stationsMeta.js'),
    path.join(ROOT_DIR, 'website/js/data/stationsMeta.js')
];

stationsMetaFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(
            /\{ id:"PK05", name:"Jayadeva Hospital", name_kn:"ಜಯದೇವ ಆಸ್ಪತ್ರೆ", code:"JYDV", line:"Pink Line", type:"Elevated", platforms:"\d"/,
            `{ id:"PK05", name:"Jayadeva Hospital", name_kn:"ಜಯದೇವ ಆಸ್ಪತ್ರೆ", code:"JYDV", line:"Pink Line", type:"Elevated", platforms:"4"`
        );
        content = content.replace(
            /\{ id:"PK06", name:"Tavarekere", name_kn:"ತಾವರೆಕೆರೆ", code:"TVRK", line:"Pink Line", type:"Elevated", platforms:"\d"/,
            `{ id:"PK06", name:"Tavarekere", name_kn:"ತಾವರೆಕೆರೆ", code:"TVRK", line:"Pink Line", type:"Elevated", platforms:"2"`
        );
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated stationsMeta.js in ${f}`);
    }
});

console.log('Step 1-3 complete.');
