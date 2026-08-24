import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: 'NammaRide',
    subtitle: 'Bengaluru Transit Guide',
    tagline: 'Navigate Bengaluru Smartly, Offline Always',
    home: 'Home',
    simulator: 'Web Simulator',
    stations: 'Stations',
    map: 'Interactive Map',
    explore: 'Explore City',
    fareCalculator: 'Fare Calculator',
    timings: 'Timings',
    safety: 'Safety & Help',
    download: 'Download App',
    getApp: 'Get Android App',
    language: 'Language',
    purpleLine: 'Purple Line',
    greenLine: 'Green Line',
    yellowLine: 'Yellow Line',
    redLine: 'Red Line',
    blueLine: 'Blue Line',
    searchStation: 'Search station...',
    firstTrain: 'First Train',
    lastTrain: 'Last Train',
    operatingHours: 'Operating Hours',
    fare: 'Fare',
    smartCard: 'Smart Card (10% Off)',
    cashToken: 'Cash Token',
    accessibility: 'Accessibility Details',
    elevators: 'Elevators (Lifts)',
    escalators: 'Escalators',
    accessibleToilet: 'Accessible Restroom',
    facilities: 'Station Facilities',
    emergencyHelplines: 'Emergency Helplines',
    developedBy: 'Developed by Tushar Jain'
  },
  kn: {
    appName: 'ನಮ್ಮರೈಡ್',
    subtitle: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಮಾರ್ಗದರ್ಶಿ',
    tagline: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಪ್ರಯಾಣ, ಸದಾ ಆಫ್‌ಲೈನ್',
    home: 'ಮುಖಪುಟ',
    simulator: 'ವೆಬ್ ಸಿಮ್ಯುಲೇಟರ್',
    stations: 'ನಿಲ್ದಾಣಗಳು',
    map: 'ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
    explore: 'ನಗರ ಅನ್ವೇಷಣೆ',
    fareCalculator: 'ಪ್ರಯಾಣ ದರ ಲೆಕ್ಕಾಚಾರ',
    timings: 'ಸಮಯ ಸೂಚಕ',
    safety: 'ಸುರಕ್ಷತೆ ಮತ್ತು ಸಹಾಯ',
    download: 'ಆಪ್ ಡೌನ್‌ಲೋಡ್',
    getApp: 'ಆಂಡ್ರಾಯ್ಡ್ ಆಪ್ ಪಡೆಯಿರಿ',
    language: 'ಭಾಷೆ',
    purpleLine: 'ನೇರಳೆ ಮಾರ್ಗ',
    greenLine: 'ಹಸಿರು ಮಾರ್ಗ',
    yellowLine: 'ಹಳದಿ ಮಾರ್ಗ',
    redLine: 'ಕೆಂಪು ಮಾರ್ಗ',
    blueLine: 'ನೀಲಿ ಮಾರ್ಗ',
    searchStation: 'ನಿಲ್ದಾಣ ಹುಡುಕಿ...',
    firstTrain: 'ಮೊದಲ ರೈಲು',
    lastTrain: 'ಕೊನೆಯ ರೈಲು',
    operatingHours: 'ಕಾರ್ಯಾಚರಣೆಯ ಸಮಯ',
    fare: 'ಪ್ರಯಾಣ ದರ',
    smartCard: 'ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ (10% ರಿಯಾಯಿತಿ)',
    cashToken: 'ನಗದು ಟೋಕನ್',
    accessibility: 'ದಿವ್ಯಾಂಗ ಸೌಲಭ್ಯಗಳು',
    elevators: 'ಎಲಿವೇಟರ್‌ಗಳು (ಲಿಫ್ಟ್)',
    escalators: 'ಎಸ್ಸಲೇಟರ್‌ಗಳು',
    accessibleToilet: 'ಸುಸಜ್ಜಿತ ಶೌಚಾಲಯ',
    facilities: 'ನಿಲ್ದಾಣದ ಸೌಲಭ್ಯಗಳು',
    emergencyHelplines: 'ತುರ್ತು ಸಹಾಯವಾಣಿ',
    developedBy: 'ತುಷಾರ್ ಜೈನ್ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ್ದಾರೆ'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('nammaride_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('nammaride_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
