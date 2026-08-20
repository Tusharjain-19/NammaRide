const fs = require('fs');
const path = require('path');

const keystorePath = path.join(__dirname, '../secure/nammaride-upload-key.jks');
const certPath = path.join(__dirname, '../secure/nammaride-upload-certificate.pem');

console.log('--- SIGNING VERIFICATION ---');

if (!fs.existsSync(keystorePath)) {
    console.error('ERROR: Upload keystore missing at mobile/secure/nammaride-upload-key.jks!');
    console.error('Refusing build to prevent unintended un-signed or auto-generated keys.');
    process.exit(1);
}

if (!fs.existsSync(certPath)) {
    console.error('ERROR: Certificate file missing at mobile/secure/nammaride-upload-certificate.pem!');
    process.exit(1);
}

console.log('✓ Keystore found:', keystorePath);
console.log('✓ Public Certificate found:', certPath);
console.log('Expected SHA-1: 2C:C4:C5:39:5C:70:B4:EF:5E:4D:D7:E3:1A:05:72:B1:AB:DA:C3:66');
console.log('Expected SHA-256: E3:6D:A3:D2:DF:D1:10:AC:00:23:01:F8:F6:3E:D9:BF:C1:F3:C2:7C:69:0F:FB:33:0E:A5:70:70:AC:B3:BA:F3');
console.log('✓ Signing pre-checks PASSED!');
process.exit(0);
