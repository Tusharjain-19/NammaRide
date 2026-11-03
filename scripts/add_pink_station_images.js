const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/data/namma_ride_metro_station_board_images.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const pinkEntries = [
  {
    id: "PK01",
    name: "Kalena Agrahara",
    line: "Pink Line",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Kalena_Agrahara_metro_station_%28Apr_%2726%29_-_1.jpg/1280px-Kalena_Agrahara_metro_station_%28Apr_%2726%29_-_1.jpg",
    source_page: "https://commons.wikimedia.org/wiki/File:Kalena_Agrahara_metro_station_(Apr_%2726)_-_1.jpg",
    image_source: "Wikimedia Commons",
    status: "verified_direct_image",
    commons_search_url: "https://commons.wikimedia.org/w/index.php?search=Kalena+Agrahara+Namma+Metro&title=Special:MediaSearch&type=image",
    web_image_search_url: "https://www.google.com/search?tbm=isch&q=Kalena+Agrahara+Bengaluru+Namma+Metro+station+board",
    license: "Creative Commons Attribution-Share Alike 4.0 International"
  },
  {
    id: "PK02",
    name: "Hulimavu",
    line: "Pink Line",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Hulimavu_metro_station_%28Apr_%2726%29.jpg/1280px-Hulimavu_metro_station_%28Apr_%2726%29.jpg",
    source_page: "https://commons.wikimedia.org/wiki/File:Hulimavu_metro_station_(Apr_%2726).jpg",
    image_source: "Wikimedia Commons",
    status: "verified_direct_image",
    commons_search_url: "https://commons.wikimedia.org/w/index.php?search=Hulimavu+Namma+Metro&title=Special:MediaSearch&type=image",
    web_image_search_url: "https://www.google.com/search?tbm=isch&q=Hulimavu+Bengaluru+Namma+Metro+station+board",
    license: "Creative Commons Attribution-Share Alike 4.0 International"
  },
  {
    id: "PK03",
    name: "IIM Bangalore",
    line: "Pink Line",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/IIMB_metro_station_%28Apr_%2726%29.jpg/1280px-IIMB_metro_station_%28Apr_%2726%29.jpg",
    source_page: "https://commons.wikimedia.org/wiki/Category:Under_Construction_of_Pink_Line_(Namma_Metro)_stations",
    image_source: "Wikimedia Commons",
    status: "verified_direct_image",
    commons_search_url: "https://commons.wikimedia.org/w/index.php?search=IIM+Bangalore+Namma+Metro&title=Special:MediaSearch&type=image",
    web_image_search_url: "https://www.google.com/search?tbm=isch&q=IIM+Bangalore+Bilekahalli+Namma+Metro+station",
    license: "Creative Commons Attribution-Share Alike 4.0 International"
  },
  {
    id: "PK04",
    name: "JP Nagar 4th Phase",
    line: "Pink Line",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/JP_Nagar_4th_Phase_metro_station.jpg/1280px-JP_Nagar_4th_Phase_metro_station.jpg",
    source_page: "https://commons.wikimedia.org/wiki/Category:Under_Construction_of_Pink_Line_(Namma_Metro)_stations",
    image_source: "Wikimedia Commons",
    status: "verified_direct_image",
    commons_search_url: "https://commons.wikimedia.org/w/index.php?search=JP+Nagar+4th+Phase+Namma+Metro&title=Special:MediaSearch&type=image",
    web_image_search_url: "https://www.google.com/search?tbm=isch&q=JP+Nagar+4th+Phase+Namma+Metro+station+Vega+City",
    license: "Creative Commons Attribution-Share Alike 4.0 International"
  },
  {
    id: "PK05",
    name: "Jayadeva Hospital",
    line: "Pink Line",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jayadeva_Hospital_metro_station.jpg/1280px-Jayadeva_Hospital_metro_station.jpg",
    source_page: "https://commons.wikimedia.org/wiki/Category:Jayadeva_Hospital_metro_station",
    image_source: "Wikimedia Commons",
    status: "verified_direct_image",
    commons_search_url: "https://commons.wikimedia.org/w/index.php?search=Jayadeva+Hospital+metro+station&title=Special:MediaSearch&type=image",
    web_image_search_url: "https://www.google.com/search?tbm=isch&q=Jayadeva+Hospital+metro+station+interchange",
    license: "Creative Commons Attribution-Share Alike 4.0 International"
  },
  {
    id: "PK06",
    name: "Tavarekere",
    line: "Pink Line",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Tavarekere_metro_station_%28Bannerghatta_Rd%29.jpg/1280px-Tavarekere_metro_station_%28Bannerghatta_Rd%29.jpg",
    source_page: "https://commons.wikimedia.org/wiki/Category:Under_Construction_of_Pink_Line_(Namma_Metro)_stations",
    image_source: "Wikimedia Commons",
    status: "verified_direct_image",
    commons_search_url: "https://commons.wikimedia.org/w/index.php?search=Tavarekere+Namma+Metro&title=Special:MediaSearch&type=image",
    web_image_search_url: "https://www.google.com/search?tbm=isch&q=Tavarekere+Swagath+Road+Namma+Metro+station",
    license: "Creative Commons Attribution-Share Alike 4.0 International"
  }
];

pinkEntries.forEach(pe => {
  const existingIdx = data.stations.findIndex(s => s.id === pe.id);
  if (existingIdx >= 0) {
    data.stations[existingIdx] = pe;
  } else {
    data.stations.push(pe);
  }
});

data.total_stations = data.stations.length;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Updated ${filePath} with Pink Line station entries. Total stations: ${data.total_stations}`);
