/**
 * helpers.js - Centralized translation and configuration utilities.
 * 
 * This module breaks the circular dependency between main.js, dropdown.js,
 * and route.js by providing shared translation functions (T, T_STATION),
 * app configuration (CONFIG), and utility functions (formatTime) in one place.
 */
import { translations, stationTranslations, lineNameMap } from '../data/stations.js';

// --- App Configuration ---
export const CONFIG = { INTERCHANGE_TIME_MINUTES: 5, AVERAGE_SPEED_KMPH: 35 };

// --- Language State ---
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

// --- Translation Helpers ---
export function T(key) {
    const lang = getCurrentLang();
    if (translations[lang] && translations[lang][key]) return translations[lang][key];
    if (translations.en && translations.en[key]) return translations.en[key];
    return key;
}

export function T_STATION(name) {
    if (!name) return '';
    const lang = getCurrentLang();
    if (lineNameMap[name]) {
        const k = lineNameMap[name];
        if (stationTranslations[k] && stationTranslations[k][lang]) return stationTranslations[k][lang];
    }
    if (stationTranslations[name] && stationTranslations[name][lang]) {
        return stationTranslations[name][lang];
    }
    return name;
}

// --- Utility Functions ---
export function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
