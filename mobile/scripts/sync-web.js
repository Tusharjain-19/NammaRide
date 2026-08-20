const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../website');
const destDir = path.join(__dirname, '../mobile-web');

function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 1. Clean the destination
if (fs.existsSync(destDir)) {
    console.log(`Cleaning ${destDir}...`);
    fs.rmSync(destDir, { recursive: true, force: true });
}

// 2. Copy all files
console.log(`Copying from ${srcDir} to ${destDir}...`);
copyDirSync(srcDir, destDir);

// 3. Ensure clean JS output for Capacitor WebView
console.log('Mobile web sync complete!');

console.log('Sync complete!');
