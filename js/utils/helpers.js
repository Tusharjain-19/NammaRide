import { translations, stationTranslations, lineNameMap } from '../data/stations.js';

export const CONFIG = { INTERCHANGE_TIME_MINUTES: 5, AVERAGE_SPEED_KMPH: 35 };

let currentLang = localStorage.getItem('appLang') || 'en';
if (!['en', 'hi', 'kn'].includes(currentLang)) {
    currentLang = 'en';
}

export function getCurrentLang() {
    return currentLang;
}

export function setCurrentLang(lang) {
    if (['en', 'hi', 'kn'].includes(lang)) {
        currentLang = lang;
        localStorage.setItem('appLang', lang);
    }
}

export function T(key) {
    const lang = getCurrentLang();
    return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
}

export function T_STATION(name) {
    const lang = getCurrentLang();
    if (lineNameMap[name]) {
        const k = lineNameMap[name];
        return (stationTranslations[k] && stationTranslations[k][lang]) ? stationTranslations[k][lang] : name;
    }
    return (stationTranslations[name] && stationTranslations[name][lang]) ? stationTranslations[name][lang] : name;
}

export function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
