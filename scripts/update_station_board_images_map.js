const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../website/public/simulator/js/data/stationBoardImages.js'),
  path.join(__dirname, '../website/js/data/stationBoardImages.js')
];

const pinkImages = {
  "PK01": "assets/images/stations/PK01.jpg",
  "PK02": "assets/images/stations/PK02.jpg",
  "PK03": "assets/images/stations/PK03.jpg",
  "PK04": "assets/images/stations/PK04.jpg",
  "PK05": "assets/images/stations/PK05.jpg",
  "PK06": "assets/images/stations/PK06.jpg"
};

targetFiles.forEach(tf => {
  if (!fs.existsSync(tf)) return;
  let content = fs.readFileSync(tf, 'utf8');
  if (!content.includes('PK01')) {
    const insertion = `  "PK01": "assets/images/stations/PK01.jpg",\n  "PK02": "assets/images/stations/PK02.jpg",\n  "PK03": "assets/images/stations/PK03.jpg",\n  "PK04": "assets/images/stations/PK04.jpg",\n  "PK05": "assets/images/stations/PK05.jpg",\n  "PK06": "assets/images/stations/PK06.jpg",\n`;
    content = content.replace('export const stationBoardImages = {', 'export const stationBoardImages = {\n' + insertion);
    fs.writeFileSync(tf, content, 'utf8');
    console.log(`Updated ${tf}`);
  }
});
