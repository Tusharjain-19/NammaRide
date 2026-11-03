const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// 1. Update index.html
const indexHtmlPath = path.join(ROOT_DIR, 'website/index.html');
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');

  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>NammaRide: Best Bengaluru Namma Metro App, Live Pink Line Map, Timings and Ticket Fare</title>');

  html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/, '<meta name="description" content="NammaRide is rated the #1 best offline Geo GPS app for Bengaluru Namma Metro (BMRCL). Plan routes across Purple, Green, Yellow, and Pink lines with live fares, 100 stations guide, platform interchange transfer, and train timings in English and Kannada." />');

  const newKeywords = 'best app for bengaluru metro, best metro app for bangalore, namma metro app, namma ride, namma ride app download, bengaluru metro route map, pink line metro bangalore, kalena agrahara to tavarekere, jayadeva interchange, namma metro ticket fare calculator, namma metro timings 2026, offline metro app bengaluru, bmrcl smart card discount, purple line, green line, yellow line, electronic city metro, majestic last train timings, ನಮ್ಮ ಮೆಟ್ರೋ ಅತ್ಯುತ್ತಮ ಆಪ್, ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಮಾರ್ಗ ನಕ್ಷೆ, ಪಿಂಕ್ ಲೈನ್ ಉದ್ಘಾಟನೆ, ನಮ್ಮ ಮೆಟ್ರೋ ಟಿಕೆಟ್ ದರ, ಮೆಜೆಸ್ಟಿಕ್ ಇಂಟರ್‌ಚೇಂಜ್, ಜಯದೇವ ಮೆಟ್ರೋ, ಕಾಳೇನ ಅಗ್ರಹಾರ, bengaluru metro app apk';
  html = html.replace(/<meta name="keywords" content="[\s\S]*?" \/>/, `<meta name="keywords" content="${newKeywords}" />`);

  html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, '<meta property="og:title" content="NammaRide: Best Bengaluru Namma Metro App, Live Pink Line Map, Timings and Ticket Fare" />');
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/, '<meta name="twitter:title" content="NammaRide: Best Bengaluru Namma Metro App, Live Pink Line Map, Timings and Ticket Fare" />');

  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  console.log('Updated index.html meta tags');
}

// 2. Update MetaSEO.jsx
const metaSeoPath = path.join(ROOT_DIR, 'website/src/components/MetaSEO.jsx');
if (fs.existsSync(metaSeoPath)) {
  let mseo = fs.readFileSync(metaSeoPath, 'utf8');

  mseo = mseo.replace(/const DEFAULT_TITLE = [\s\S]*?;/, 'const DEFAULT_TITLE = "NammaRide: Best Bengaluru Namma Metro App, Live Pink Line Map, Timings and Ticket Fare";');
  mseo = mseo.replace(/const DEFAULT_DESC = [\s\S]*?;/, 'const DEFAULT_DESC = "NammaRide is the #1 offline Geo GPS app for Bengaluru Metro (BMRCL). Plan routes across Purple, Green, Yellow, and Pink lines with live fares, maps, and timings in English and Kannada.";');

  fs.writeFileSync(metaSeoPath, mseo, 'utf8');
  console.log('Updated MetaSEO.jsx defaults');
}

// 3. Update HomePage.jsx
const homePagePath = path.join(ROOT_DIR, 'website/src/pages/HomePage.jsx');
if (fs.existsSync(homePagePath)) {
  let hp = fs.readFileSync(homePagePath, 'utf8');
  hp = hp.replace(/<MetaSEO[\s\S]*?\/>/, `<MetaSEO 
        title="NammaRide: Best Bengaluru Namma Metro App, Live Pink Line Map, Timings and Ticket Fare"
        description="NammaRide is rated the #1 best offline Geo GPS app for Bengaluru Namma Metro (BMRCL). Plan routes across Purple, Green, Yellow, and Pink lines with live fares, 100 stations guide, platform interchange transfer, and train timings in English and Kannada."
        canonicalPath="/"
      />`);
  fs.writeFileSync(homePagePath, hp, 'utf8');
  console.log('Updated HomePage.jsx MetaSEO');
}

// 4. Update ExplorePage.jsx
const explorePagePath = path.join(ROOT_DIR, 'website/src/pages/ExplorePage.jsx');
if (fs.existsSync(explorePagePath)) {
  let ep = fs.readFileSync(explorePagePath, 'utf8');
  ep = ep.replace(/<MetaSEO[\s\S]*?\/>/, `<MetaSEO 
        title="Explore Bengaluru by Metro: Top Attractions, Temples, Tech Parks and Malls"
        description="Discover famous Bengaluru landmarks, hospitals, universities, tech hubs, and heritage spots within walking distance of Namma Metro stations across Purple, Green, Yellow, and Pink lines."
        canonicalPath="/explore"
      />`);
  fs.writeFileSync(explorePagePath, ep, 'utf8');
  console.log('Updated ExplorePage.jsx MetaSEO');
}

// 5. Update MetroMapPage.jsx
const mapPagePath = path.join(ROOT_DIR, 'website/src/pages/MetroMapPage.jsx');
if (fs.existsSync(mapPagePath)) {
  let mp = fs.readFileSync(mapPagePath, 'utf8');
  mp = mp.replace(/<MetaSEO[\s\S]*?\/>/, `<MetaSEO 
        title="Official Bengaluru Metro Map 2026: High Resolution Interactive Line Map"
        description="Explore official Bengaluru Namma Metro map covering Purple, Green, Yellow, and Pink line corridors with interchange junctions and touch-friendly zoom."
        canonicalPath="/map"
      />`);
  fs.writeFileSync(mapPagePath, mp, 'utf8');
  console.log('Updated MetroMapPage.jsx MetaSEO');
}

console.log('All Meta titles and descriptions successfully updated!');
