const fs = require('fs');
const path = require('path');

const targetFiles = [
    path.join(__dirname, '../website/public/simulator/js/main.js'),
    path.join(__dirname, '../website/js/main.js')
];

for (let filePath of targetFiles) {
    if (!fs.existsSync(filePath)) continue;
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. Update message listener in initTheme
    const oldMsgBlock = "if (event.data && event.data.type === 'NAMMARIDE_THEME_CHANGED' && event.data.theme) {\n            currentThemeState = event.data.theme === 'dark' ? 'dark' : 'light';\n            applyTheme(currentThemeState);\n        }";
    const newMsgBlock = "if (event.data && event.data.type === 'NAMMARIDE_THEME_CHANGED' && event.data.theme) {\n            currentThemeState = event.data.theme === 'dark' ? 'dark' : 'light';\n            applyTheme(currentThemeState);\n        }\n        if (event.data && event.data.type === 'NAMMARIDE_LANG_CHANGED' && event.data.lang) {\n            if (event.data.lang !== currentLang) {\n                setLanguage(event.data.lang);\n            }\n        }";

    if (code.includes("NAMMARIDE_THEME_CHANGED") && !code.includes("NAMMARIDE_LANG_CHANGED")) {
        code = code.replace(oldMsgBlock, newMsgBlock);
        console.log('Added NAMMARIDE_LANG_CHANGED listener in:', filePath);
    }

    // 2. Enhance setLanguage
    const oldSetLang = "function setLanguage(lang) {\n    if (!translations[lang]) lang = 'en';\n    setCurrentLang(lang);\n    currentLang = getCurrentLang();\n    document.documentElement.lang = lang;\n    document.querySelectorAll('[data-lang-key]').forEach(elem => {";
    const newSetLang = "function setLanguage(lang) {\n    if (!translations[lang]) lang = 'en';\n    setCurrentLang(lang);\n    currentLang = getCurrentLang();\n    document.documentElement.lang = lang;\n\n    const currentLangText = document.getElementById('current-lang-text');\n    if (currentLangText) {\n        if (currentLang === 'en') currentLangText.textContent = 'EN';\n        else if (currentLang === 'hi') currentLangText.textContent = 'HI';\n        else if (currentLang === 'kn') currentLangText.textContent = 'KN';\n    }\n\n    initSections(() => currentLang, T, T_STATION);\n\n    document.querySelectorAll('[data-lang-key]').forEach(elem => {";

    if (code.includes("function setLanguage(lang) {") && !code.includes("initSections(() => currentLang, T, T_STATION);\n\n    document.querySelectorAll")) {
        code = code.replace(oldSetLang, newSetLang);
        console.log('Enhanced setLanguage in:', filePath);
    }

    // 3. Add parent postMessage in setLanguage before refreshActiveView
    const oldRefreshView = "    // Refresh active section view\n    refreshActiveView();";
    const newRefreshView = "    // Refresh active section view\n    refreshActiveView();\n\n    try {\n        if (window.parent && window.parent !== window) {\n            window.parent.postMessage({ type: 'NAMMARIDE_LANG_CHANGED', lang: currentLang }, '*');\n        }\n    } catch (e) {}";

    if (!code.includes("window.parent.postMessage({ type: 'NAMMARIDE_LANG_CHANGED'") && code.includes(oldRefreshView)) {
        code = code.replace(oldRefreshView, newRefreshView);
        console.log('Added parent postMessage in:', filePath);
    }

    fs.writeFileSync(filePath, code, 'utf8');
}
console.log('main.js patch complete!');
