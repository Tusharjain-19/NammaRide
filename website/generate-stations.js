import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'public/simulator/data/stations.json');
const outputPath = path.join(__dirname, 'src/data/stationsData.js');

try {
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(rawData);

  let allStations = [];
  
  // To calculate cx, cy, we need min/max lat/lon
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  const linesConfig = [
    { key: 'purple', id: 'purple', name: 'Purple Line' },
    { key: 'green', id: 'green', name: 'Green Line' },
    { key: 'yellow', id: 'yellow', name: 'Yellow Line' }
  ];

  // First pass to find bounding box
  for (const line of linesConfig) {
    if (data.metroData[line.key] && data.metroData[line.key].stations) {
      for (const st of data.metroData[line.key].stations) {
        if (st.lat < minLat) minLat = st.lat;
        if (st.lat > maxLat) maxLat = st.lat;
        if (st.lon < minLon) minLon = st.lon;
        if (st.lon > maxLon) maxLon = st.lon;
      }
    }
  }

  // Add padding to bounding box
  const latPadding = (maxLat - minLat) * 0.1;
  const lonPadding = (maxLon - minLon) * 0.1;
  
  minLat -= latPadding;
  maxLat += latPadding;
  minLon -= lonPadding;
  maxLon += lonPadding;

  const svgWidth = 840;
  const svgHeight = 520;
  
  // Build stations list
  for (const line of linesConfig) {
    if (data.metroData[line.key] && data.metroData[line.key].stations) {
      for (const st of data.metroData[line.key].stations) {
        
        // Map GPS to SVG coordinate
        const cx = Math.round(((st.lon - minLon) / (maxLon - minLon)) * svgWidth);
        const cy = Math.round(svgHeight - ((st.lat - minLat) / (maxLat - minLat)) * svgHeight);
        
        // See if station already exists (interchange)
        let existingSt = allStations.find(s => s.name_en === st.name || (st.interchangeId && s.id === st.interchangeId));
        
        if (existingSt) {
          if (!existingSt.line_ids.includes(line.id)) {
            existingSt.line_ids.push(line.id);
            existingSt.lines.push(line.name);
          }
        } else {
          allStations.push({
            id: st.interchangeId || st.id.toLowerCase(),
            code: st.id,
            name_en: st.name,
            name_kn: st.name + ' (kn)', // Default fallback since we don't have kn translation in JSON
            line_ids: [line.id],
            lines: [line.name],
            latitude: st.lat,
            longitude: st.lon,
            cx: cx,
            cy: cy,
            interchange: st.interchange || false,
            operating_hours: { first_train: '05:00 AM', last_train: '11:00 PM' },
            platform_count: st.platforms ? (st.platforms.forward + st.platforms.backward) : 2,
            accessibility: {
              has_elevator: true,
              elevator_count: 2,
              has_escalator: true,
              escalator_count: 2,
              has_accessible_toilet: true,
              has_wheelchair_ramp: true,
              accessible_counter: true
            },
            facilities: {
              atms: ['Bank ATM'],
              has_wifi: false,
              has_food_court: false,
              retail_shops: ['Convenience Store'],
              has_womens_lounge: false,
              luggage_storage: false
            },
            nearby_transit: {
              bus_stands: ['Nearby Bus Stop'],
              auto_stand: 'Approved Auto Bay',
              taxi_zone: 'Taxi/Cabs Drop-off'
            },
            exit_gates: [
              { gate: 'A', destination: 'Main Road' },
              { gate: 'B', destination: 'Residential Area' }
            ],
            nearby_landmarks: ['Local Shops', 'Parks'],
            crowd_level: 'Moderate'
          });
        }
      }
    }
  }

  // Kannada Translations for some major stations (if match)
  const knTranslations = {
    "Nadaprabhu Kempegowda Stn., Majestic": "ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿಲ್ದಾಣ (ಮೆಜೆಸ್ಟಿಕ್)",
    "MG Road": "ಎಮ್ಜಿ ರಸ್ತೆ",
    "Mahatma Gandhi Road": "ಎಮ್ಜಿ ರಸ್ತೆ",
    "Indiranagar": "ಇಂದಿರಾನಗರ",
    "Whitefield (Kadugodi)": "ವೈಟ್‌ಫೀಲ್ಡ್ (ಕಾಡುಗೋಡಿ)",
    "Electronic City": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ",
    "Rashtreeya Vidyalaya Road": "ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾಲಯ ರಸ್ತೆ",
    "Vijayanagar": "ವಿಜಯನಗರ"
  };

  allStations.forEach(st => {
    if (knTranslations[st.name_en]) {
      st.name_kn = knTranslations[st.name_en];
    } else {
       // rough fallback: just remove "(kn)"
       st.name_kn = st.name_en;
    }
  });

  const linePaths = {};

  for (const line of linesConfig) {
    if (data.metroData[line.key] && data.metroData[line.key].stations) {
      linePaths[line.id] = data.metroData[line.key].stations.map(st => {
        const cx = Math.round(((st.lon - minLon) / (maxLon - minLon)) * svgWidth);
        const cy = Math.round(svgHeight - ((st.lat - minLat) / (maxLat - minLat)) * svgHeight);
        return { cx, cy };
      });
    }
  }

  const fileContent = `// AUTO-GENERATED from public/simulator/data/stations.json
export const stationsData = ${JSON.stringify(allStations, null, 2)};
export const linePaths = ${JSON.stringify(linePaths, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log("Successfully generated " + allStations.length + " stations in src/data/stationsData.js");

} catch (e) {
  console.error("Error generating stations:", e);
}
