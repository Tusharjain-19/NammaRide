const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../website/index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const rootStart = content.indexOf('<div id="root">');
const scriptStart = content.indexOf('<script type="module" src="/src/main.jsx">');

if (rootStart === -1 || scriptStart === -1) {
    console.error('Could not find root or script in index.html');
    process.exit(1);
}

// Extract old semantic block to place inside <noscript>
let oldSemanticBlock = content.substring(rootStart + '<div id="root">'.length, scriptStart);
// Close any open div from old root
const lastDivIdx = oldSemanticBlock.lastIndexOf('</div>');
if (lastDivIdx !== -1) {
    oldSemanticBlock = oldSemanticBlock.substring(0, lastDivIdx).trim();
}
// Clean any emojis and emdashes
oldSemanticBlock = oldSemanticBlock.replace(/[—–]/g, '-').replace(/[\u{1F300}-\u{1F9FF}]/gu, '');

const newRootAndNoscript = `<div id="root">
      <div id="app-loading-screen" style="min-height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffff; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; transition: opacity 0.3s ease;">
        <style>
          @media (prefers-color-scheme: dark) {
            #app-loading-screen { background-color: #050505 !important; color: #f9fafb !important; }
            #app-loading-screen .loader-subtext { color: #9ca3af !important; }
          }
          .dark #app-loading-screen { background-color: #050505 !important; color: #f9fafb !important; }
          .dark #app-loading-screen .loader-subtext { color: #9ca3af !important; }
          @keyframes nr-pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.85); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          .nr-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            display: inline-block;
            animation: nr-pulse 1.3s infinite ease-in-out;
          }
        </style>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <img src="/assets/images/logo_app.png" alt="NammaRide" style="width: 56px; height: 56px; object-fit: contain; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" onerror="this.style.display='none'">
          <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; display: flex; align-items: center; gap: 4px;">
            <span>Namma<span style="color: #10b981;">Ride</span></span>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <span class="nr-dot" style="background-color: #8b5cf6; animation-delay: 0s;"></span>
            <span class="nr-dot" style="background-color: #10b981; animation-delay: 0.2s;"></span>
            <span class="nr-dot" style="background-color: #eab308; animation-delay: 0.4s;"></span>
            <span class="nr-dot" style="background-color: #ec4899; animation-delay: 0.6s;"></span>
          </div>
          <p class="loader-subtext" style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: #6b7280; text-transform: uppercase; margin-top: 6px;">Official Bengaluru Metro Guide</p>
        </div>
      </div>
    </div>
    <noscript>
      ${oldSemanticBlock}
    </noscript>
    `;

content = content.substring(0, rootStart) + newRootAndNoscript + content.substring(scriptStart);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully updated website/index.html with professional preloader and noscript crawl fallback!');
