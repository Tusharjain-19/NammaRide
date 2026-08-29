const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../website/public/simulator');
const destDir = path.join(__dirname, '../mobile-web');

function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        if (['.DS_Store', 'node_modules', '.git', 'dist', 'build', '.cache', '.next', '.vscode'].includes(entry.name)) {
            continue;
        }

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

// 2. Copy simulator web assets
console.log(`Copying mobile web assets from ${srcDir} to ${destDir}...`);
copyDirSync(srcDir, destDir);

console.log('Mobile web sync complete!');
