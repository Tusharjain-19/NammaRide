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

// --- Utility Functions ---
export function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
