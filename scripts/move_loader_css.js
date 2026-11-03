const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../website/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find and remove all <style> tags from index.html
html = html.replace(/<style>[\s\S]*?<\/style>/g, '');
fs.writeFileSync(indexPath, html, 'utf8');

// Add preloader CSS to website/src/styles/index.css
const cssPath = path.join(__dirname, '../website/src/styles/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const loaderCss = `
/* Professional App Loading Preloader */
#app-loading-screen {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: opacity 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  #app-loading-screen { background-color: #050505 !important; color: #f9fafb !important; }
  #app-loading-screen .loader-subtext { color: #9ca3af !important; }
}

.dark #app-loading-screen {
  background-color: #050505 !important;
  color: #f9fafb !important;
}

.dark #app-loading-screen .loader-subtext {
  color: #9ca3af !important;
}

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
`;

if (!css.includes('#app-loading-screen')) {
    css += '\n' + loaderCss;
    fs.writeFileSync(cssPath, css, 'utf8');
}
console.log('Removed all <style> tags from index.html and added to src/styles/index.css');
