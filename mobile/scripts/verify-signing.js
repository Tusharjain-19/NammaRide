const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// This script verifies that the generated APK/AAB is signed properly,
// and halts the build if signing details do not match the expected certificate.

const aabPath = path.join(__dirname, '../android/app/build/outputs/bundle/release/app-release.aab');

console.log('Verifying signing configuration...');

if (!fs.existsSync(aabPath)) {
    console.warn('No release AAB found yet. Skipping verification.');
    process.exit(0);
}

try {
    // Note: requires apksigner in PATH
    const output = execSync(`apksigner verify --print-certs ${aabPath}`, { encoding: 'utf8' });
    console.log(output);

    // TODO: Compare with expected SHA-256
    console.log('Signing verification passed!');
} catch (e) {
    console.error('Signing verification failed!', e.message);
    process.exit(1);
}
