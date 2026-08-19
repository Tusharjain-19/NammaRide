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

// 3. Inject Capacitor plugins into the copied main.js
const mainJsPath = path.join(destDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
    console.log(`Injecting Capacitor logic into ${mainJsPath}...`);
    let content = fs.readFileSync(mainJsPath, 'utf8');
    
    // Inject Geolocation Plugin import at the top
    const injection = `
// --- CAPACITOR INJECTION ---
import { Geolocation } from '@capacitor/geolocation';
// ---------------------------
`;
    // Find the original navigator.geolocation calls and replace them if necessary.
    // For now, we just add the import, we'll let it use the web API or Capacitor depending on availability.
    
    content = injection + content;
    fs.writeFileSync(mainJsPath, content, 'utf8');
}

console.log('Sync complete!');
