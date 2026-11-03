const fs = require('fs');

const places = JSON.parse(fs.readFileSync('NammaRide-main/website/public/simulator/data/stationPlaces.json', 'utf8'));
const pinkStations = ['Kalena Agrahara', 'Hulimavu', 'IIM Bangalore', 'JP Nagar 4th Phase', 'Jayadeva Hospital', 'Tavarekere'];

pinkStations.forEach(st => {
    console.log(`=== ${st} ===`);
    console.log(JSON.stringify(places[st], null, 2));
});
