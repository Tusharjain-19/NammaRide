const fs = require('fs');
const path = require('path');

const ids = [
  "royal_meenakshi_mall", "gottigere_depot", "meenakshi_temple", "amc_college",
  "hulimavu_cave_temple", "decathlon_bannerghatta", "nano_hospitals", "bgs_school",
  "iim_bangalore", "fortis_hospital", "apollo_hospital", "kalyani_magnum",
  "vega_city_mall", "shoppers_stop_bg", "dollars_colony_jp", "ranga_shankara",
  "jayadeva_institute", "btm_layout_1", "yellow_line_interchange",
  "tavarekere_park", "nexus_koramangala", "christ_university", "st_johns_hospital"
];

const dir = 'NammaRide-main/website/public/simulator/assets/images/places';
ids.forEach(id => {
    const file = path.join(dir, `${id}.jpg`);
    console.log(id, fs.existsSync(file) ? 'EXISTS' : 'MISSING');
});
