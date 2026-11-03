const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// 1. Pink Line Stations List
const pinkStations = [
  {
    id: "PK01",
    name: "Kalena Agrahara",
    code: "KLNA",
    name_kn: "ಕಾಳೇನ ಅಗ್ರಹಾರ",
    name_hi: "कालेना अग्रहारा",
    lat: 12.8647,
    lon: 77.5975,
    timeToNext: 130,
    distanceToNext: 1.5,
    isActive: true,
    status: "operational",
    type: "Elevated",
    platforms: { forward: 1, backward: 2 },
    opened: 2026,
    landmarks: ["Royal Meenakshi Mall", "Gottigere BMTC Depot", "NICE Road Junction", "AMC Engineering College", "Meenakshi Sundareswarar Temple"],
    facilities: ["Toilets", "Escalator", "Elevator", "Ticket Counter", "Smart Card Recharge", "Wheelchair Access", "Parking"],
    connectivity: ["BMTC Bannerghatta Hub", "Auto rickshaw stand", "Taxi / Cab pickup", "NICE Road Corridor Link"]
  },
  {
    id: "PK02",
    name: "Hulimavu",
    code: "HLMV",
    name_kn: "ಹುಳಿಮಾವು",
    name_hi: "हुलीमावु",
    lat: 12.8782,
    lon: 77.5982,
    timeToNext: 135,
    distanceToNext: 1.6,
    isActive: true,
    status: "operational",
    type: "Elevated",
    platforms: { forward: 1, backward: 2 },
    opened: 2026,
    landmarks: ["Sri Ramalingeshwara Cave Temple", "Decathlon Bannerghatta", "BGS National Public School", "Nano Hospital", "Akshayanagar Link Road"],
    facilities: ["Toilets", "Escalator", "Elevator", "Ticket Counter", "Wheelchair Access"],
    connectivity: ["BMTC Bus Stop", "Auto rickshaw stand", "Decathlon feeder connection"]
  },
  {
    id: "PK03",
    name: "IIM Bangalore",
    code: "IIMB",
    name_kn: "ಐಐಎಂ ಬೆಂಗಳೂರು",
    name_hi: "आईआईएम बैंगलोर",
    lat: 12.8931,
    lon: 77.5990,
    timeToNext: 125,
    distanceToNext: 1.4,
    isActive: true,
    status: "operational",
    type: "Elevated",
    platforms: { forward: 1, backward: 2 },
    opened: 2026,
    landmarks: ["Indian Institute of Management Bangalore", "Fortis Hospital Bannerghatta", "Apollo Hospital Bannerghatta", "Kalyani Magnum Tech Park", "Bilekahalli Junction"],
    facilities: ["Toilets", "Escalator", "Elevator", "Ticket Counter", "Smart Card Recharge", "Wheelchair Access", "Accessible Counter"],
    connectivity: ["IIMB Bus Shelter", "BMTC Feeder routes", "Apollo/Fortis emergency transit access", "Auto stand"]
  },
  {
    id: "PK04",
    name: "JP Nagar 4th Phase",
    code: "JPN4",
    name_kn: "ಜೆಪಿ ನಗರ ೪ನೇ ಹಂತ",
    name_hi: "जेपी नगर चौथा चरण",
    lat: 12.9068,
    lon: 77.5998,
    timeToNext: 120,
    distanceToNext: 1.3,
    isActive: true,
    status: "operational",
    type: "Elevated",
    platforms: { forward: 1, backward: 2 },
    opened: 2026,
    landmarks: ["Vega City Mall", "Shoppers Stop Bannerghatta", "Dollars Colony", "Ranga Shankara", "Bannerghatta Outer Ring Road Junction"],
    facilities: ["Toilets", "Escalator", "Elevator", "Ticket Counter", "Smart Card Recharge", "Wheelchair Access", "Parking"],
    connectivity: ["Vega City Mall Pedestrian Walkway", "BMTC Ring Road Feeder", "Auto rickshaw stand", "Cab pickup bay"]
  },
  {
    id: "PK05",
    name: "Jayadeva Hospital",
    code: "JYDV",
    name_kn: "ಜಯದೇವ ಆಸ್ಪತ್ರೆ",
    name_hi: "जयदेव अस्पताल",
    lat: 12.9161,
    lon: 77.6015,
    timeToNext: 120,
    distanceToNext: 1.2,
    isActive: true,
    status: "operational",
    type: "Elevated",
    interchange: true,
    interchangeId: "jayadeva",
    platforms: { forward: 1, backward: 2 },
    opened: 2026,
    landmarks: ["Sri Jayadeva Institute of Cardiovascular Sciences", "Yellow Line Interchange (Level 1)", "BTM Layout 1st & 2nd Stage", "East End Circle Jayanagar", "Bannerghatta Flyover"],
    facilities: ["Interchange Concourse", "Toilets", "Escalator", "Elevator", "Ticket Counter", "Smart Card Recharge", "Wheelchair Access", "Medical First Aid Post"],
    connectivity: ["Yellow Line (RV Road - Bommasandra)", "BTM Ring Road Bus Station", "Jayanagar 9th Block link", "Auto bay", "Ambulance Priority Lane"]
  },
  {
    id: "PK06",
    name: "Tavarekere",
    code: "TVRK",
    name_kn: "ತಾವರೆಕೆರೆ",
    name_hi: "तवारेकेरे",
    lat: 12.9258,
    lon: 77.6052,
    timeToNext: 130,
    distanceToNext: 1.3,
    isActive: true,
    status: "operational",
    type: "Elevated",
    platforms: { forward: 1, backward: 2 },
    opened: 2026,
    landmarks: ["Tavarekere Park", "Swagath Road Cross", "Nexus Koramangala (Forum Mall)", "Christ University SG Palya", "St. John's Hospital Corridor", "Madiwala"],
    facilities: ["Toilets", "Escalator", "Elevator", "Ticket Counter", "Smart Card Recharge", "Wheelchair Access"],
    connectivity: ["Swagath Road BMTC Stop", "Koramangala Feeder Buses", "Auto rickshaw stand", "Cab pickup zone"]
  },
  // Upcoming Underground Phase 2B stations (Disabled in active navigation)
  {
    id: "PK07",
    name: "Dairy Circle",
    code: "DRYC",
    name_kn: "ಡೈರಿ ವೃತ್ತ",
    name_hi: "डेयरी सर्कल",
    lat: 12.9372,
    lon: 77.6004,
    timeToNext: 120,
    distanceToNext: 1.2,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Christ University Main Campus", "Dairy Circle Flyover", "NIMHANS", "Bangalore Dairy Compound"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Dairy Circle Bus Terminus", "Hosur Road link"]
  },
  {
    id: "PK08",
    name: "Lakkasandra",
    code: "LKSD",
    name_kn: "ಲಕ್ಕಸಂದ್ರ",
    name_hi: "लक्कासंद्र",
    lat: 12.9472,
    lon: 77.5986,
    timeToNext: 125,
    distanceToNext: 1.3,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Wilson Garden", "Mico Bosch Compound", "Lakkasandra Layout"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Hosur Main Road BMTC"]
  },
  {
    id: "PK09",
    name: "Langford Town",
    code: "LNTN",
    name_kn: "ಲ್ಯಾಂಗ್‌ಫೋರ್ಡ್ ಟೌನ್",
    name_hi: "लैंगफोर्ड टाउन",
    lat: 12.9592,
    lon: 77.6041,
    timeToNext: 115,
    distanceToNext: 1.1,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Langford Town", "Richmond Town", "Johnson Market", "St. Joseph's University"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Richmond Circle Feeder"]
  },
  {
    id: "PK10",
    name: "Rashtriya Military School",
    code: "RMSC",
    name_kn: "ರಾಷ್ಟ್ರೀಯ ಮಿಲಿಟರಿ ಶಾಲೆ",
    name_hi: "राष्ट्रीय मिलिट्री स्कूल",
    lat: 12.9680,
    lon: 77.6067,
    timeToNext: 110,
    distanceToNext: 1.0,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Rashtriya Military School", "Hosur Road Junction", "Brigade Road South Approach"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Hosur Road / Vellara Junction Bus Hub"]
  },
  {
    id: "PK11",
    name: "MG Road",
    code: "MGRD",
    name_kn: "ಮಹಾತ್ಮ ಗಾಂಧಿ ರಸ್ತೆ",
    name_hi: "एमजी रोड",
    lat: 12.9754,
    lon: 77.6068,
    timeToNext: 125,
    distanceToNext: 1.2,
    isActive: false,
    status: "under_construction",
    interchange: true,
    interchangeId: "mg_road",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Mahatma Gandhi Road", "Purple Line Interchange (P19)", "Church Street", "Brigade Road", "1 MG Mall"],
    facilities: ["Planned Underground Interchange Concourse", "Elevators", "Escalators"],
    connectivity: ["Purple Line Metro Transfer", "CBD Bus Hub"]
  },
  {
    id: "PK12",
    name: "Shivajinagar",
    code: "SHVJ",
    name_kn: "ಶಿವಾಜಿನಗರ",
    name_hi: "शिवाजीनगर",
    lat: 12.9863,
    lon: 77.6042,
    timeToNext: 115,
    distanceToNext: 1.1,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Shivajinagar Bus Station (TTMC)", "Russell Market", "Bowring & Lady Curzon Hospital", "St. Mary's Basilica"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Major BMTC Transit Terminus (TTMC)"]
  },
  {
    id: "PK13",
    name: "Cantonment Railway Station",
    code: "CNTM",
    name_kn: "ಕಂಟೋನ್ಮೆಂಟ್ ರೈಲ್ವೆ ನಿಲ್ದಾಣ",
    name_hi: "छावनी रेलवे स्टेशन",
    lat: 12.9937,
    lon: 77.6001,
    timeToNext: 120,
    distanceToNext: 1.2,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Bengaluru Cantonment Railway Station (BNC)", "Vasanth Nagar", "Cantonment Goods Shed"],
    facilities: ["Direct Pedestrian Sub-way to Railway Platforms", "Elevator", "Escalator"],
    connectivity: ["Indian Railways Mainline trains", "BMTC Cantonment Station stop"]
  },
  {
    id: "PK14",
    name: "Pottery Town",
    code: "PTRT",
    name_kn: "ಪಾಟರಿ ಟೌನ್",
    name_hi: "पोटरी टाउन",
    lat: 13.0033,
    lon: 77.6057,
    timeToNext: 110,
    distanceToNext: 1.0,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Pottery Town Traditional Artisan Market", "Benson Town", "Nethaji Road"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["BMTC Local stops"]
  },
  {
    id: "PK15",
    name: "Tannery Road",
    code: "TNRY",
    name_kn: "ಟ್ಯಾನರಿ ರಸ್ತೆ",
    name_hi: "टैनरी रोड",
    lat: 13.0112,
    lon: 77.6148,
    timeToNext: 120,
    distanceToNext: 1.2,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Tannery Road Commercial Hub", "Frazer Town Extension", "Dr. B.R. Ambedkar Medical College approach"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Tannery Road BMTC Services"]
  },
  {
    id: "PK16",
    name: "Venkateshpura",
    code: "VNKT",
    name_kn: "ವೆಂಕಟೇಶಪುರ",
    name_hi: "वेंकटेशपुरा",
    lat: 13.0203,
    lon: 77.6202,
    timeToNext: 125,
    distanceToNext: 1.3,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Venkateshpura", "Arabic College Cross", "Govindapura"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["BMTC Kadugondanahalli Corridor"]
  },
  {
    id: "PK17",
    name: "Kadugondanahalli",
    code: "KDGH",
    name_kn: "ಕಾಡುಗೊಂಡನಹಳ್ಳಿ",
    name_hi: "कडुगोंडनहल्ली",
    lat: 13.0315,
    lon: 77.6247,
    timeToNext: 135,
    distanceToNext: 1.4,
    isActive: false,
    status: "under_construction",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["KG Halli Police Station", "Nagawara Main Road", "Muslim Orphanage Community"],
    facilities: ["Planned Underground Metro Facilities", "Elevator", "Escalator"],
    connectivity: ["Nagawara - Shivajinagar BMTC Trunk route"]
  },
  {
    id: "PK18",
    name: "Nagawara",
    code: "NGWR",
    name_kn: "ನಾಗವಾರ",
    name_hi: "नागवारा",
    lat: 13.0456,
    lon: 77.6265,
    timeToNext: 0,
    distanceToNext: 0,
    isActive: false,
    status: "under_construction",
    interchange: true,
    interchangeId: "nagawara",
    phase: "Phase 2 Underground (Opening 2027)",
    type: "Underground",
    platforms: { forward: 1, backward: 2 },
    opened: "Upcoming (2027)",
    landmarks: ["Nagawara Lake & Lumbini Gardens", "Manyata Embassy Business Park (Tech Park)", "Outer Ring Road Junction", "Airport Blue Line Interchange (Phase 2B)"],
    facilities: ["Multi-Corridor Interchange Concourse", "Direct Pedestrian Skywalk to Manyata Tech Park", "Elevators", "Escalators"],
    connectivity: ["Blue Line Airport Metro (Phase 2B)", "Outer Ring Road BMTC Hub", "Airport Express buses"]
  }
];

// 2. Update stations.json files
const stationsJsonPaths = [
  path.join(ROOT_DIR, 'website/data/stations.json'),
  path.join(ROOT_DIR, 'website/public/simulator/data/stations.json')
];

for (const p of stationsJsonPaths) {
  if (!fs.existsSync(p)) continue;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));

  // Ensure Pink line exists in metroData
  data.metroData.pink = {
    name: "Pink Line",
    color: "#EC4899",
    stations: pinkStations.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lon: s.lon,
      timeToNext: s.timeToNext,
      distanceToNext: s.distanceToNext,
      isActive: s.isActive,
      status: s.status,
      phase: s.phase || "Phase 1 Elevated",
      interchange: s.interchange || false,
      interchangeId: s.interchangeId || undefined,
      platforms: s.platforms
    }))
  };

  // Ensure Yellow Line Jayadeva has interchangeId
  if (data.metroData.yellow && data.metroData.yellow.stations) {
    const yJayadeva = data.metroData.yellow.stations.find(s => s.id === 'Y03');
    if (yJayadeva) {
      yJayadeva.interchange = true;
      yJayadeva.interchangeId = 'jayadeva';
    }
  }

  // Update lineNameMap
  data.lineNameMap["Pink Line"] = "Pink Line";

  // Update translations for Pink Line
  if (data.translations) {
    if (data.translations.en) data.translations.en.linePink = "Pink Line";
    if (data.translations.kn) data.translations.kn.linePink = "ಪಿಂಕ್ ಲೈನ್";
    if (data.translations.hi) data.translations.hi.linePink = "पिंक लाइन";
  }

  // Update stationTranslations
  if (!data.stationTranslations) data.stationTranslations = {};
  pinkStations.forEach(s => {
    data.stationTranslations[s.name] = {
      kn: s.name_kn,
      hi: s.name_hi
    };
  });

  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${p}`);
}

// 3. Update public/simulator/js/data/stations.js
const stationsJsPath = path.join(ROOT_DIR, 'website/public/simulator/js/data/stations.js');
if (fs.existsSync(stationsJsPath)) {
  const simData = JSON.parse(fs.readFileSync(stationsJsonPaths[1], 'utf8'));
  const jsContent = `export const metroData = ${JSON.stringify(simData.metroData, null, 4)};\n\n` +
    `export const translations = ${JSON.stringify(simData.translations, null, 4)};\n\n` +
    `export const stationTranslations = ${JSON.stringify(simData.stationTranslations, null, 4)};\n\n` +
    `export const lineNameMap = ${JSON.stringify(simData.lineNameMap, null, 4)};\n`;
  fs.writeFileSync(stationsJsPath, jsContent, 'utf8');
  console.log(`Updated ${stationsJsPath}`);
}

// 4. Update stationsMeta.js
const stationsMetaPath = path.join(ROOT_DIR, 'website/public/simulator/js/data/stationsMeta.js');
if (fs.existsSync(stationsMetaPath)) {
  let metaContent = fs.readFileSync(stationsMetaPath, 'utf8');
  
  // Check if PK01 already added
  if (!metaContent.includes('PK01')) {
    const pinkMetaEntries = pinkStations.map(s => `  { id:"${s.id}", name:"${s.name}", name_kn:"${s.name_kn}", code:"${s.code}", line:"Pink Line", type:"${s.type}", platforms:"${s.platforms.forward + s.platforms.backward}", metroInfo:{operator:"BMRCL",opened:"${s.opened}"}, 
    isActive: ${s.isActive}, status: "${s.status}", phase: "${s.phase || 'Phase 1 Elevated'}",
    accessibility: { wheelchair: true, elevator: true, lifts: "Standard BMRCL lift parameters compliant with ADA", escalators: true, escalatorInfo: "Concourse to platform level" },
    facilities:${JSON.stringify(s.facilities)}, 
    connectivity:${JSON.stringify(s.connectivity)}, location:{lat:${s.lat},lon:${s.lon}}}`).join(',\n\n');

    const insertionMarker = 'export const stationsMeta = [';
    const pinkSection = `\n  // ═══════════════════════════════════════\n  // PINK LINE STATIONS (PK01 - PK18)\n  // Elevated: PK01-PK06 (Live Nov 13, 2026) | Underground: PK07-PK18 (2027)\n  // ═══════════════════════════════════════\n${pinkMetaEntries},\n`;
    
    metaContent = metaContent.replace(insertionMarker, insertionMarker + pinkSection);
    fs.writeFileSync(stationsMetaPath, metaContent, 'utf8');
    console.log(`Updated ${stationsMetaPath} with 18 Pink Line stations`);
  }
}

// 5. Update stationPlaces.json & stationPlaces.js
const placesJsonPath = path.join(ROOT_DIR, 'website/data/stationPlaces.json');
const simPlacesJsonPath = path.join(ROOT_DIR, 'website/public/simulator/data/stationPlaces.json');
const simPlacesJsPath = path.join(ROOT_DIR, 'website/public/simulator/js/data/stationPlaces.js');

const pinkPlacesMap = {
  "Kalena Agrahara": [
    { id: "royal_meenakshi_mall", name: "Royal Meenakshi Mall", type: "Mall", lat: 12.8680, lon: 77.5978, distance_km: 0.4, walk_time_min: 5, maps_link: "https://www.google.com/maps/search/?api=1&query=Royal+Meenakshi+Mall+Bengaluru" },
    { id: "gottigere_depot", name: "Gottigere BMTC Depot & Bus Hub", type: "Transit", lat: 12.8635, lon: 77.5970, distance_km: 0.2, walk_time_min: 3, maps_link: "https://www.google.com/maps/search/?api=1&query=Gottigere+Bus+Depot+Bengaluru" },
    { id: "meenakshi_temple", name: "Sri Meenakshi Sundareswarar Temple", type: "Heritage", lat: 12.8695, lon: 77.5990, distance_km: 0.6, walk_time_min: 7, maps_link: "https://www.google.com/maps/search/?api=1&query=Meenakshi+Sundareswarar+Temple+Hulimavu" },
    { id: "amc_college", name: "AMC Engineering College", type: "University", lat: 12.8520, lon: 77.5920, distance_km: 1.8, walk_time_min: 22, maps_link: "https://www.google.com/maps/search/?api=1&query=AMC+Engineering+College+Bengaluru" }
  ],
  "Hulimavu": [
    { id: "hulimavu_cave_temple", name: "Sri Ramalingeshwara Cave Temple", type: "Heritage", lat: 12.8750, lon: 77.5950, distance_km: 0.5, walk_time_min: 6, maps_link: "https://www.google.com/maps/search/?api=1&query=Hulimavu+Cave+Temple+Bengaluru" },
    { id: "decathlon_bannerghatta", name: "Decathlon Bannerghatta", type: "Mall", lat: 12.8795, lon: 77.5985, distance_km: 0.3, walk_time_min: 4, maps_link: "https://www.google.com/maps/search/?api=1&query=Decathlon+Bannerghatta+Bengaluru" },
    { id: "nano_hospitals", name: "Nano Hospitals Hulimavu", type: "Hospital", lat: 12.8805, lon: 77.6001, distance_km: 0.4, walk_time_min: 5, maps_link: "https://www.google.com/maps/search/?api=1&query=Nano+Hospitals+Hulimavu+Bengaluru" },
    { id: "bgs_school", name: "BGS National Public School", type: "University", lat: 12.8740, lon: 77.6020, distance_km: 0.8, walk_time_min: 10, maps_link: "https://www.google.com/maps/search/?api=1&query=BGS+National+Public+School+Bengaluru" }
  ],
  "IIM Bangalore": [
    { id: "iim_bangalore", name: "Indian Institute of Management Bangalore (IIM-B)", type: "University", lat: 12.8950, lon: 77.6000, distance_km: 0.1, walk_time_min: 2, maps_link: "https://www.google.com/maps/search/?api=1&query=IIM+Bangalore+Bannerghatta+Road" },
    { id: "fortis_hospital", name: "Fortis Hospital Bannerghatta Road", type: "Hospital", lat: 12.8920, lon: 77.5980, distance_km: 0.4, walk_time_min: 5, maps_link: "https://www.google.com/maps/search/?api=1&query=Fortis+Hospital+Bannerghatta+Road+Bengaluru" },
    { id: "apollo_hospital", name: "Apollo Hospital Bannerghatta", type: "Hospital", lat: 12.8910, lon: 77.5975, distance_km: 0.5, walk_time_min: 6, maps_link: "https://www.google.com/maps/search/?api=1&query=Apollo+Hospital+Bannerghatta+Road+Bengaluru" },
    { id: "kalyani_magnum", name: "Kalyani Magnum Tech Park", type: "IT", lat: 12.8980, lon: 77.6040, distance_km: 1.1, walk_time_min: 14, maps_link: "https://www.google.com/maps/search/?api=1&query=Kalyani+Magnum+Tech+Park+Bengaluru" }
  ],
  "JP Nagar 4th Phase": [
    { id: "vega_city_mall", name: "Vega City Mall", type: "Mall", lat: 12.9075, lon: 77.6010, distance_km: 0.3, walk_time_min: 4, maps_link: "https://www.google.com/maps/search/?api=1&query=Vega+City+Mall+Bengaluru" },
    { id: "shoppers_stop_bg", name: "Shoppers Stop Bannerghatta", type: "Mall", lat: 12.9060, lon: 77.5990, distance_km: 0.2, walk_time_min: 3, maps_link: "https://www.google.com/maps/search/?api=1&query=Shoppers+Stop+Bannerghatta+Road" },
    { id: "dollars_colony_jp", name: "Dollars Colony (JP Nagar)", type: "Transit", lat: 12.9050, lon: 77.5970, distance_km: 0.4, walk_time_min: 5, maps_link: "https://www.google.com/maps/search/?api=1&query=Dollars+Colony+JP+Nagar+Bengaluru" },
    { id: "ranga_shankara", name: "Ranga Shankara Theatre", type: "Heritage", lat: 12.9120, lon: 77.5860, distance_km: 1.6, walk_time_min: 19, maps_link: "https://www.google.com/maps/search/?api=1&query=Ranga+Shankara+Bengaluru" }
  ],
  "Jayadeva Hospital": [
    { id: "jayadeva_institute", name: "Sri Jayadeva Institute of Cardiovascular Sciences", type: "Hospital", lat: 12.9168, lon: 77.6000, distance_km: 0.1, walk_time_min: 2, maps_link: "https://www.google.com/maps/search/?api=1&query=Jayadeva+Hospital+Bengaluru" },
    { id: "btm_layout_1", name: "BTM Layout 1st Stage Commercial Hub", type: "Transit", lat: 12.9160, lon: 77.6045, distance_km: 0.4, walk_time_min: 5, maps_link: "https://www.google.com/maps/search/?api=1&query=BTM+Layout+1st+Stage+Bengaluru" },
    { id: "yellow_line_interchange", name: "Yellow Line Platform Concourse (Y03)", type: "Transit", lat: 12.9168, lon: 77.6000, distance_km: 0.0, walk_time_min: 1, maps_link: "https://www.google.com/maps/search/?api=1&query=Jayadeva+Metro+Station+Bengaluru" }
  ],
  "Tavarekere": [
    { id: "tavarekere_park", name: "Tavarekere Park", type: "Park", lat: 12.9265, lon: 77.6060, distance_km: 0.3, walk_time_min: 4, maps_link: "https://www.google.com/maps/search/?api=1&query=Tavarekere+Park+Bengaluru" },
    { id: "nexus_koramangala", name: "Nexus Koramangala (Forum Mall)", type: "Mall", lat: 12.9340, lon: 77.6110, distance_km: 1.2, walk_time_min: 15, maps_link: "https://www.google.com/maps/search/?api=1&query=Nexus+Koramangala+Bengaluru" },
    { id: "christ_university", name: "Christ University (Central Campus, SG Palya)", type: "University", lat: 12.9340, lon: 77.6050, distance_km: 0.9, walk_time_min: 11, maps_link: "https://www.google.com/maps/search/?api=1&query=Christ+University+Bengaluru" },
    { id: "st_johns_hospital", name: "St. John's Medical College & Hospital", type: "Hospital", lat: 12.9300, lon: 77.6180, distance_km: 1.4, walk_time_min: 18, maps_link: "https://www.google.com/maps/search/?api=1&query=St+Johns+Medical+College+Bengaluru" }
  ]
};

[placesJsonPath, simPlacesJsonPath].forEach(pjPath => {
  if (fs.existsSync(pjPath)) {
    const pData = JSON.parse(fs.readFileSync(pjPath, 'utf8'));
    Object.assign(pData, pinkPlacesMap);
    fs.writeFileSync(pjPath, JSON.stringify(pData, null, 2), 'utf8');
    console.log(`Updated ${pjPath}`);
  }
});

if (fs.existsSync(simPlacesJsPath)) {
  const pData = JSON.parse(fs.readFileSync(placesJsonPath, 'utf8'));
  const jsContent = `export const stationPlaces = ${JSON.stringify(pData, null, 2)};\n`;
  fs.writeFileSync(simPlacesJsPath, jsContent, 'utf8');
  console.log(`Updated ${simPlacesJsPath}`);
}

// 6. Update stationGates.js files
const gatesWebPath = path.join(ROOT_DIR, 'website/src/data/stationGates.js');
const gatesSimPath = path.join(ROOT_DIR, 'website/public/simulator/js/data/stationGates.js');

const pinkGatesData = {
  "PK01": [
    { gate: "A", name: "Royal Meenakshi Mall Side", destination: "Bannerghatta Main Road (West), Royal Meenakshi Mall, Gottigere BMTC Hub", landmark: "Royal Meenakshi Mall", icon: "mall" },
    { gate: "B", name: "Meenakshi Temple Side", destination: "Bannerghatta Main Road (East), Meenakshi Sundareswarar Temple, NICE Road link", landmark: "Meenakshi Temple", icon: "building" }
  ],
  "PK02": [
    { gate: "A", name: "Cave Temple / Decathlon Side", destination: "Bannerghatta Main Road (West), Hulimavu Cave Temple, Decathlon", landmark: "Hulimavu Cave Temple", icon: "building" },
    { gate: "B", name: "Nano Hospital / Akshayanagar Side", destination: "Bannerghatta Main Road (East), Nano Hospitals, Akshayanagar Road", landmark: "Nano Hospital", icon: "hospital" }
  ],
  "PK03": [
    { gate: "A", name: "IIM Bangalore Main Gate", destination: "IIMB Campus Entrance, Bilekahalli Bus Stop", landmark: "IIM Bangalore Campus", icon: "university" },
    { gate: "B", name: "Healthcare Corridor Side", destination: "Fortis Hospital, Apollo Hospital, Kalyani Magnum Tech Park", landmark: "Fortis & Apollo Hospitals", icon: "hospital" }
  ],
  "PK04": [
    { gate: "A", name: "Vega City Mall / Shoppers Stop", destination: "Vega City Mall direct access, Shoppers Stop, Dollars Colony", landmark: "Vega City Mall", icon: "mall" },
    { gate: "B", name: "4th Phase Residential Layout", destination: "JP Nagar 4th Phase, Outer Ring Road Flyover connection", landmark: "JP Nagar 4th Phase", icon: "bus" }
  ],
  "PK05": [
    { gate: "A", name: "Jayadeva Institute Main Entrance", destination: "Sri Jayadeva Cardiac Hospital, Outpatient block, Ambulance bay", landmark: "Jayadeva Hospital", icon: "hospital" },
    { gate: "B", name: "Yellow Line Concourse Connection", destination: "Direct interchange transfer to Yellow Line (Y03) for RV Road / Silk Board / Electronic City", landmark: "Yellow Line Interchange", icon: "metro" },
    { gate: "C", name: "BTM Layout Ring Road Side", destination: "BTM Layout 1st & 2nd Stage, East End Circle Jayanagar", landmark: "BTM Layout Ring Rd", icon: "bus" }
  ],
  "PK06": [
    { gate: "A", name: "Tavarekere Park / Swagath Road", destination: "Tavarekere Park, SG Palya, Christ University connection", landmark: "Tavarekere Park", icon: "park" },
    { gate: "B", name: "BTM 1st Stage / Koramangala Side", destination: "BTM 1st Stage, Dairy Circle link, Nexus Koramangala feeder", landmark: "Nexus Koramangala Link", icon: "mall" }
  ]
};

[gatesWebPath, gatesSimPath].forEach(gpPath => {
  if (fs.existsSync(gpPath)) {
    let content = fs.readFileSync(gpPath, 'utf8');
    if (!content.includes('PK01')) {
      const insertion = `\n    // PINK LINE (Elevated Live - Nov 13, 2026)\n` + 
        Object.entries(pinkGatesData).map(([id, gates]) => `    "${id}": ${JSON.stringify(gates, null, 8)}`).join(',\n') + ',\n';
      content = content.replace('export const stationGatesData = {', 'export const stationGatesData = {' + insertion);
      fs.writeFileSync(gpPath, content, 'utf8');
      console.log(`Updated ${gpPath}`);
    }
  }
});

// 7. Update timingsData.js
const timingsWebPath = path.join(ROOT_DIR, 'website/src/data/timingsData.js');
const timingsSimPath = path.join(ROOT_DIR, 'website/public/simulator/js/data/timings.js');

const pinkTimingsObj = {
  name: "Pink Line (Elevated Corridor)",
  color: "#EC4899",
  route: "Kalena Agrahara ↔ Tavarekere (7.5 km Phase 1)",
  stations: 6,
  notes: [
    "Inaugurated on November 13, 2026 by Hon'ble Prime Minister Narendra Modi.",
    "Direct 2-level interchange with Yellow Line (RV Road ↔ Bommasandra) at Jayadeva Hospital station.",
    "Phase 2 Underground section (Tavarekere to Nagawara - 12 stations) is scheduled for 2027.",
    "Equipped with CBTC modern signalling and 6-coach train sets."
  ],
  weekdays: [
    { time: "05:00 AM – 06:00 AM", frequency: "15 mins", peak: false, description: "Early Morning service" },
    { time: "06:00 AM – 08:30 AM", frequency: "10 mins", peak: false, description: "Morning build-up" },
    { time: "08:30 AM – 11:30 AM", frequency: "8 – 10 mins", peak: true, description: "Morning Peak (Bannerghatta IT & Healthcare)" },
    { time: "11:30 AM – 04:30 PM", frequency: "12 mins", peak: false, description: "Non-Peak midday frequency" },
    { time: "04:30 PM – 08:30 PM", frequency: "8 – 10 mins", peak: true, description: "Evening Peak commute" },
    { time: "08:30 PM – 11:00 PM", frequency: "12 – 15 mins", peak: false, description: "Late Night closing service" }
  ],
  sundays: [
    { time: "07:00 AM – 10:00 AM", frequency: "15 mins", peak: false, description: "Morning Sunday service" },
    { time: "10:00 AM – 08:30 PM", frequency: "10 – 12 mins", peak: false, description: "Weekend shopping & family commute (Meenakshi/Vega City)" },
    { time: "08:30 PM – 11:00 PM", frequency: "15 mins", peak: false, description: "Sunday Night close" }
  ],
  firstLastTrains: {
    fromTerminals: [
      { station: "Kalena Agrahara (towards Tavarekere)", firstTrain: "05:00 AM (Mon–Sat) / 07:00 AM (Sun)", lastTrain: "11:00 PM (All days)" },
      { station: "Tavarekere (towards Kalena Agrahara)", firstTrain: "05:05 AM (Mon–Sat) / 07:05 AM (Sun)", lastTrain: "11:05 PM (All days)" },
      { station: "Jayadeva Hospital (Interchange)", firstTrain: "05:12 AM", lastTrain: "11:15 PM" }
    ]
  }
};

if (fs.existsSync(timingsWebPath)) {
  let content = fs.readFileSync(timingsWebPath, 'utf8');
  if (!content.includes('pink:')) {
    const insertion = `  pink: ${JSON.stringify(pinkTimingsObj, null, 2)},\n`;
    content = content.replace('export const timingsData = {', 'export const timingsData = {\n' + insertion);
    fs.writeFileSync(timingsWebPath, content, 'utf8');
    console.log(`Updated ${timingsWebPath}`);
  }
}

if (fs.existsSync(timingsSimPath)) {
  let content = fs.readFileSync(timingsSimPath, 'utf8');
  if (!content.includes('pink:')) {
    const simPinkObj = {
      name: "Pink Line",
      color: "#EC4899",
      route: "Kalena Agrahara ↔ Tavarekere (7.5 km Elevated)",
      stations: 6,
      notes: [
        "Inaugurated on November 13, 2026 by Hon'ble Prime Minister Narendra Modi.",
        "Transfer at Jayadeva Hospital for Yellow Line."
      ],
      schedules: {
        mon_fri: {
          title: "Monday – Friday (Weekdays)",
          from_start: [
            { range: "05:00 - 06:00", frequency: "15 mins" },
            { range: "06:00 - 08:30", frequency: "10 mins" },
            { range: "08:30 - 11:30", frequency: "8-10 mins (Peak)" },
            { range: "11:30 - 16:30", frequency: "12 mins" },
            { range: "16:30 - 20:30", frequency: "8-10 mins (Peak)" },
            { range: "20:30 - 23:00", frequency: "15 mins" }
          ]
        },
        sunday: {
          title: "Sunday & General Holidays",
          from_start: [
            { range: "07:00 - 10:00", frequency: "15 mins" },
            { range: "10:00 - 20:30", frequency: "10-12 mins" },
            { range: "20:30 - 23:00", frequency: "15 mins" }
          ]
        }
      }
    };
    const insertion = `  pink: ${JSON.stringify(simPinkObj, null, 2)},\n`;
    content = content.replace('export const timingsData = {', 'export const timingsData = {\n' + insertion);
    fs.writeFileSync(timingsSimPath, content, 'utf8');
    console.log(`Updated ${timingsSimPath}`);
  }
}

console.log('Pink Line data enrichment script completed successfully!');
