const fs = require('fs');
const path = require('path');

const filePath = path.resolve('d:/NammaRide-main/NammaRide-main/js/data/stationPlaces.js');
let content = fs.readFileSync(filePath, 'utf-8');

const mapping = {
  'BMS College of Engineering (BMSCE)': 'assets/images/BMSCE.jpg',
  'Bangalore University (Central College)': 'assets/images/Bangalore University.jpg',
  'Bangalore University (Jnanabharathi Campus)': 'assets/images/Bangalore University.jpg',
  'Central College Campus': 'assets/images/Bangalore University.jpg',
  'RV College of Engineering': 'assets/images/RV college.jpg',
  'Sri Sathya Sai Institute (Higher Learning)': 'assets/images/Sri Sathya Sai Institute.jpg',
  "Maharani's College Bangalore": 'assets/images/maharani college.jpg',
  'National College Basavanagudi': 'assets/images/national college.jpg'
};

const lines = content.split('\n');
let modified = false;

// We iterate through all place blocks and update based on the name
const blockRegex = /\{[^}]+\"name\":\s*\"([^\"]+)\"[^}]+\}/g;
let match;
while ((match = blockRegex.exec(content)) !== null) {
  const placeName = match[1];
  const block = match[0];
  
  if (mapping[placeName]) {
    const start = match.index;
    const end = match.index + block.length;
    
    // Find the current image in this block
    const imageRegex = /\"image\":\s*\"([^\"]+)\"/;
    const imageMatch = block.match(imageRegex);
    
    if (imageMatch) {
      const oldImage = imageMatch[1];
      const newImage = mapping[placeName];
      
      if (oldImage !== newImage) {
        // Construct the new block content
        const newBlock = block.replace(imageRegex, `"image": "${newImage}"`);
        // Replace in full content
        content = content.substring(0, start) + newBlock + content.substring(end);
        // Reset regex index to the start of the new content to continue search reliably
        blockRegex.lastIndex = start + newBlock.length;
        modified = true;
      }
    }
  }
}

if (modified) {
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('stationPlaces.js successfully updated with specific college/university images.');
} else {
  console.log('No changes were needed for stationPlaces.js.');
}
