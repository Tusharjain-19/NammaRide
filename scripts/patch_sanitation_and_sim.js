const fs = require('fs');
const path = require('path');

// 1. Patch website/src/main.jsx
const mainJsxPath = path.join(__dirname, '../website/src/main.jsx');
let mainJsx = fs.readFileSync(mainJsxPath, 'utf8');
if (!mainJsx.includes('purgeForeignOriginStorage')) {
    const purgeCode = `// Sanitize origin storage from sibling dev project leaks (e.g., JaipurRide)
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.toLowerCase().includes('jaipur')) {
        toRemove.push(k);
      } else if (k) {
        const v = localStorage.getItem(k);
        if (typeof v === 'string' && v.toLowerCase().includes('jaipur')) {
          toRemove.push(k);
        }
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  }
} catch (e) {}

function purgeForeignOriginStorage() {}
`;
    mainJsx = purgeCode + '\n' + mainJsx;
    fs.writeFileSync(mainJsxPath, mainJsx, 'utf8');
    console.log('Patched website/src/main.jsx');
}

// 2. Patch simulator main.js
const simMainFiles = [
    path.join(__dirname, '../website/public/simulator/js/main.js'),
    path.join(__dirname, '../website/js/main.js'),
    path.join(__dirname, '../mobile/mobile-web/js/main.js')
];

const simPurgeCode = `
// Automatic origin sanitation: purge foreign project keys (JaipurRide) on localhost
(function purgeForeignArtifacts() {
    try {
        if (typeof window === 'undefined') return;
        ['localStorage', 'sessionStorage'].forEach(storeName => {
            const store = window[storeName];
            if (!store) return;
            const toRemove = [];
            for (let i = 0; i < store.length; i++) {
                const k = store.key(i);
                if (!k) continue;
                if (k.toLowerCase().includes('jaipur')) {
                    toRemove.push(k);
                } else {
                    const v = store.getItem(k);
                    if (typeof v === 'string' && v.toLowerCase().includes('jaipur')) {
                        toRemove.push(k);
                    }
                }
            }
            toRemove.forEach(k => store.removeItem(k));
        });
    } catch (e) {}
})();
`;

simMainFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    if (!code.includes('purgeForeignArtifacts')) {
        code = simPurgeCode + '\n' + code;
        fs.writeFileSync(file, code, 'utf8');
        console.log('Patched sim main.js:', file);
    }
});

// 3. Improve mobile simulator sizing in SimulatorPage.jsx
const simPagePath = path.join(__dirname, '../website/src/pages/SimulatorPage.jsx');
let simPage = fs.readFileSync(simPagePath, 'utf8');

simPage = simPage.replace(
    /className="w-\[280px\] xs:w-\[310px\] sm:w-\[340px\] h-\[580px\] sm:h-\[650px\] 2xl:w-\[380px\] 2xl:h-\[750px\] 3xl:w-\[410px\] 3xl:h-\[810px\] max-w-\[calc\(100vw-32px\)\]/,
    `className="w-[330px] xs:w-[350px] sm:w-[365px] md:w-[375px] h-[640px] sm:h-[680px] 2xl:w-[395px] 2xl:h-[780px] max-w-[calc(100vw-20px)]`
);

fs.writeFileSync(simPagePath, simPage, 'utf8');
console.log('Patched SimulatorPage.jsx with responsive smartphone sizing');
