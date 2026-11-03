const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../website/index.html');
const content = fs.readFileSync(indexPath, 'utf8');

const rootStart = content.indexOf('<div id="root">');
const scriptStart = content.indexOf('<script type="module" src="/src/main.jsx">');

console.log('rootStart:', rootStart, 'scriptStart:', scriptStart);
console.log('Between root and script length:', scriptStart - rootStart);
