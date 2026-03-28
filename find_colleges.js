const fs = require('fs');
const c = fs.readFileSync('d:/NammaRide-main/NammaRide-main/js/data/stationPlaces.js', 'utf-8');

let output = '';

// Find all places with college/university in name or type
const nameMatches = [...c.matchAll(/"name":\s*"([^"]*(?:college|university|Campus|BMS |RV |National College|Maharani)[^"]*)"/gi)];
output += 'College/University places:\n';
nameMatches.forEach(m => {
  const after = c.substring(m.index, m.index + 500);
  const imgMatch = after.match(/"image":\s*"([^"]+)"/);
  const typeMatch = after.match(/"type":\s*"([^"]+)"/);
  output += `  Name: ${m[1]}\n`;
  output += `  Type: ${typeMatch ? typeMatch[1] : 'unknown'}\n`;
  output += `  Image: ${imgMatch ? imgMatch[1] : 'unknown'}\n\n`;
});

// Also find places with type College or University
const collegeType = [...c.matchAll(/"type":\s*"(?:College|University)"/g)];
output += `\nPlaces with type College or University: ${collegeType.length}\n`;

fs.writeFileSync('d:/NammaRide-main/NammaRide-main/college_report.txt', output);
console.log('Report written to college_report.txt');
