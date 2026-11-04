const fs = require('fs');

const path = 'website/src/context/LanguageContext.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add pinkLine and pinkLineBadge to en
if (!content.includes("pinkLine: 'Pink Line'")) {
  content = content.replace(
    "yellowLine: 'Yellow Line',",
    "yellowLine: 'Yellow Line',\n    pinkLine: 'Pink Line',\n    pinkLineBadge: 'Nov 13',"
  );
}

// Add pinkLine and pinkLineBadge to kn
if (!content.includes("pinkLine: 'ಪಿಂಕ್ ಮಾರ್ಗ'")) {
  content = content.replace(
    "yellowLine: 'ಹಳದಿ ಮಾರ್ಗ',",
    "yellowLine: 'ಹಳದಿ ಮಾರ್ಗ',\n    pinkLine: 'ಪಿಂಕ್ ಮಾರ್ಗ',\n    pinkLineBadge: 'ನವೆಂಬರ್ 13',"
  );
}

// Add pinkLine and pinkLineBadge to hi
if (!content.includes("pinkLine: 'पिंक लाइन'")) {
  content = content.replace(
    "yellowLine: 'येलो लाइन',",
    "yellowLine: 'येलो लाइन',\n    pinkLine: 'पिंक लाइन',\n    pinkLineBadge: '13 नवंबर',"
  );
}

// Update useEffect in LanguageProvider to store appLang and dispatch event
const oldUseEffect = `  useEffect(() => {
    try {
      localStorage.setItem('nammaride_lang', lang);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, [lang]);`;

const newUseEffect = `  useEffect(() => {
    try {
      localStorage.setItem('nammaride_lang', lang);
      localStorage.setItem('appLang', lang);
      window.dispatchEvent(new CustomEvent('nammaride_lang_updated', { detail: { lang } }));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, [lang]);`;

if (content.includes(oldUseEffect)) {
  content = content.replace(oldUseEffect, newUseEffect);
} else {
  // Try regex replace
  content = content.replace(
    /localStorage\.setItem\('nammaride_lang',\s*lang\);/g,
    "localStorage.setItem('nammaride_lang', lang);\n      localStorage.setItem('appLang', lang);\n      window.dispatchEvent(new CustomEvent('nammaride_lang_updated', { detail: { lang } }));"
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('LanguageContext.jsx patched successfully!');
