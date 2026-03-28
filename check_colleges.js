const fs = require('fs');
const path = require('path');

const filePath = path.resolve('d:/NammaRide-main/NammaRide-main/js/data/stationPlaces.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Find all places which are colleges or universities
const blocks = content.match(/\{[\s\S]*?\}/g) || [];
const colleges = [];

blocks.forEach(block => {
  const nameM = block.match(/\"name\":\s*\"([^\"]+)\"/);
  const typeM = block.match(/\"type\":\s*\"([^\"]+)\"/);
  const imgM = block.match(/\"image\":\s*\"([^\"]+)\"/);
  
  if (nameM && typeM) {
    const name = nameM[1];
    const type = typeM[1];
    const image = imgM ? imgM[1] : 'none';
    
    if (type === 'College' || type === 'University' || /college|university|campus|BMS|RV |Institute/i.test(name)) {
      colleges.push({ name, type, image });
    }
  }
});

console.log(JSON.stringify(colleges, null, 2));
