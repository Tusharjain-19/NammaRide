const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../website/index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Check where the <style> is
const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>') + '</style>'.length;

if (styleStart !== -1) {
    const styleBlock = content.substring(styleStart, styleEnd);
    // Remove it from current location
    content = content.replace(styleBlock, '');

    // Move style block into <head> right before </head>
    const headEnd = content.indexOf('</head>');
    if (headEnd !== -1) {
        content = content.substring(0, headEnd) + '\n' + styleBlock + '\n' + content.substring(headEnd);
    }
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('Moved <style> into <head>');
}
